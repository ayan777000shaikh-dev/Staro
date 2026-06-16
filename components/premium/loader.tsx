'use client'

import React from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number
  height?: string
  width?: string
  circle?: boolean
}

const Skeleton: React.FC<SkeletonProps> = ({
  count = 1,
  height = 'h-4',
  width = 'w-full',
  circle = false,
  className = '',
  ...props
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton ${width} ${height} ${circle ? 'rounded-full' : 'rounded-lg'} mb-2 ${className}`}
          {...props}
        />
      ))}
    </>
  )
}

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`} {...props}>
      <div
        className={`${sizeClasses[size]} border-accent border-t-transparent rounded-full animate-spin`}
      />
      {text && <p className="text-muted-foreground text-sm font-medium">{text}</p>}
    </div>
  )
}

interface PulseLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number
}

const PulseLoader: React.FC<PulseLoaderProps> = ({ count = 3, className = '', ...props }) => {
  return (
    <div className={`flex gap-2 items-center justify-center ${className}`} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-3 h-3 rounded-full bg-accent animate-pulse"
          style={{
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}

export { Skeleton, LoadingSpinner, PulseLoader }
