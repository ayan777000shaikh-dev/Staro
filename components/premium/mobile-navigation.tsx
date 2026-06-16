'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Plus, Users, User } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ size: number; className?: string }>
  badge?: number
}

const navItems: NavItem[] = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/create', label: 'Create', icon: Plus },
  { href: '/network', label: 'Network', icon: Users, badge: 0 },
  { href: '/profile', label: 'Profile', icon: User },
]

const MobileNavigation: React.FC = () => {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom md:hidden">
      {/* Safe area top padding */}
      <div className="h-14 md:hidden" />

      {/* Navigation items */}
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-4 transition-all duration-300 relative h-16 ${
                isActive
                  ? 'text-accent'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {/* Icon wrapper */}
              <div className="relative">
                <Icon
                  size={24}
                  className={`transition-all duration-300 ${
                    isActive ? 'scale-110' : 'scale-100'
                  }`}
                />

                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {item.badge > 99 ? '99+' : item.badge}
                  </div>
                )}
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-full" />
              )}

              {/* Label (visible on hover/active) */}
              <span className={`text-xs mt-1 font-medium transition-all duration-300 ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Home indicator */}
      <div className="h-5 bg-gradient-to-t from-background/20" />
    </nav>
  )
}

export { MobileNavigation }
