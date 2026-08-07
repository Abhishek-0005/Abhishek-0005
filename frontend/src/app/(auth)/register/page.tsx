'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import FormInput from '@/components/FormInput'
import { Button } from '@/components/Button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const schema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    })
    if (res.ok) {
      router.replace('/dashboard')
      router.refresh()
    } else {
      const body = await res.json().catch(() => ({}))
      setServerError(body.message || 'Registration failed')
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-6">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput label="Name" name="name" {...register('name')} error={errors.name} />
        <FormInput
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          {...register('email')}
          error={errors.email}
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
          error={errors.password}
        />
        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
          error={errors.confirmPassword}
        />
        {serverError && (
          <p className="text-sm text-red-600" role="alert">
            {serverError}
          </p>
        )}
        <Button type="submit" loading={isSubmitting} className="w-full">
          Create account
        </Button>
      </form>
    </div>
  )
}
