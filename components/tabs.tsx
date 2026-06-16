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
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  }

  if (variant === 'pills') {
    return (
      <div className="flex gap-2 flex-wrap p-1 bg-gray-100/50 dark:bg-gray-900/50 rounded-full w-fit backdrop-blur-sm">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`inline-flex items-center gap-2 font-medium rounded-full transition-all duration-300 transform ${sizeClasses[size]} ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-100 hover:shadow-xl'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:scale-105'
              }`}
            >
              {Icon && <Icon size={iconSizes[size]} className="transition-transform" />}
              <span className="font-semibold">{item.label}</span>
              {item.count !== undefined && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive
                    ? 'bg-white/30 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  if (variant === 'underline') {
    return (
      <div className="flex gap-0 border-b border-gray-200 dark:border-gray-800/50 overflow-x-auto">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`inline-flex items-center gap-2 font-medium transition-all duration-300 border-b-2 relative px-4 py-3 text-sm whitespace-nowrap ${
                isActive
                  ? 'border-transparent text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {Icon && <Icon size={iconSizes[size]} />}
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 ml-1">
                  {item.count}
                </span>
              )}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-in fade-in duration-300"></div>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // Default variant with enhanced styling
  return (
    <div className="flex gap-2 flex-wrap">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`inline-flex items-center gap-2 font-medium rounded-xl transition-all duration-300 transform ${sizeClasses[size]} ${
              isActive
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/40 dark:to-purple-950/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 shadow-md hover:shadow-lg scale-100'
                : 'bg-gray-100 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 hover:scale-105'
            }`}
          >
            {Icon && <Icon size={iconSizes[size]} className="transition-transform" />}
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span className={`ml-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                isActive
                  ? 'bg-blue-200/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}>
                {item.count}
              </span>
            )}
          </button>
        )
      })}
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
  return <div className="animate-in fade-in duration-300">{children}</div>
}

