import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

export const Button: React.FC<Props> = ({
  className = '',
  children,
  disabled,
  loading,
  ...rest
}) => (
  <button
    className={
      'px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 ' +
      className
    }
    disabled={disabled || loading}
    {...rest}
  >
    {loading ? 'Loading…' : children}
  </button>
)
