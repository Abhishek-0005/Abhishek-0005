import { ButtonHTMLAttributes, forwardRef, AnchorHTMLAttributes } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', asChild, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'
    const styles = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-600',
      secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-gray-300',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-200'
    }[variant]

    if (asChild) {
      const A = Link as unknown as React.FC<AnchorHTMLAttributes<HTMLAnchorElement>>
      return (
        <A className={clsx(base, styles, className)} {...(props as any)} />
      )
    }

    return (
      <button ref={ref} className={clsx(base, styles, className)} {...props} />
    )
  }
)
Button.displayName = 'Button'
