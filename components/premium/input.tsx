'use client'

import React from 'react'

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  isLoading?: boolean
  icon?: React.ReactNode
}

const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ className = '', label, error, helperText, isLoading, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-foreground mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`input-premium ${icon ? 'pl-12' : ''} ${
              error ? 'border-red-500 focus:ring-red-500/20' : ''
            } ${className}`}
            disabled={isLoading}
            {...props}
          />
          {isLoading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-muted-foreground text-sm mt-1">{helperText}</p>
        )}
      </div>
    )
  }
)

PremiumInput.displayName = 'PremiumInput'

export { PremiumInput }
