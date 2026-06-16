'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface TabItem {
  id: string
  label: string
  icon?: LucideIcon
  count?: number
}

interface TabsProps {
  items: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'md' | 'lg'
}

export function Tabs({
  items,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
}: TabsProps) {
  const baseStyles =
    'font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2'
  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  const variantStyles = {
    default:
      'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border-b-2 border-transparent data-[active=true]:border-blue-600 data-[active=true]:text-blue-600 dark:data-[active=true]:text-blue-400',
    pills:
      'rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 data-[active=true]:bg-blue-600 data-[active=true]:text-white',
    underline:
      'text-gray-600 dark:text-gray-400 border-b-2 border-transparent data-[active=true]:border-blue-600 data-[active=true]:text-blue-600 dark:data-[active=true]:text-blue-400',
  }

  return (
    <div className={variant === 'default' ? 'border-b border-gray-200 dark:border-gray-700' : ''}>
      <div
        className={`flex gap-${size === 'sm' ? '2' : size === 'md' ? '4' : '6'} ${variant === 'pills' ? 'bg-gray-100 dark:bg-gray-900 p-1 rounded-full inline-flex' : ''}`}
      >
        {items.map(item => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              data-active={activeTab === item.id}
              className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`}
            >
              {Icon && <Icon size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />}
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className="ml-1 text-xs font-semibold bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function TabContent({
  children,
  isActive,
}: {
  children: React.ReactNode
  isActive: boolean
}) {
  if (!isActive) return null
  return <>{children}</>
}
