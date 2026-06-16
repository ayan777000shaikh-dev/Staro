'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
        danger: 'h-12 px-6 rounded-full transition-all duration-300 transform active:scale-95 hover:scale-105 bg-red-500 hover:bg-red-600 text-white hover:shadow-lg',
        outline: 'h-12 px-6 rounded-full transition-all duration-300 transform active:scale-95 hover:scale-105 border border-border hover:bg-gray-100 dark:hover:bg-gray-900',
      },
      size: {
        sm: 'h-10 px-4 text-sm rounded-lg',
        md: 'h-12 px-6 text-base rounded-full',
        lg: 'h-14 px-8 text-lg rounded-full',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
)

interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={buttonVariants({
          variant,
          size,
          fullWidth,
          className,
        })}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </button>
    )
  }
)

PremiumButton.displayName = 'PremiumButton'

export { PremiumButton, buttonVariants }
