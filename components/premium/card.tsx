'use client'

import React from 'react'

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  isHoverable?: boolean
  isGlass?: boolean
  isPulse?: boolean
  children: React.ReactNode
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  (
    { className = '', isHoverable = true, isGlass = false, isPulse = false, children, ...props },
    ref
  ) => {
    const baseClasses = isGlass
      ? 'card-glass'
      : 'card-premium'

    const interactiveClasses = isHoverable ? 'hover-lift' : ''
    const pulseClasses = isPulse ? 'animate-glow' : ''

    return (
      <div
        ref={ref}
        className={`${baseClasses} ${interactiveClasses} ${pulseClasses} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

PremiumCard.displayName = 'PremiumCard'

export { PremiumCard }
