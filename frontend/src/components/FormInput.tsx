import React from 'react'
import { FieldError } from 'react-hook-form'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
  error?: FieldError
}

export default function FormInput({ label, name, error, ...rest }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...rest}
      />
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}
