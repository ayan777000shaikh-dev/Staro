'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Bell, Menu, X, LogOut, Settings, User } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export function TopHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [notificationCount, setNotificationCount] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const getUser = async () => {
      try {
        const session = await authClient.getSession()
        setUser(session?.user)
      } catch (error) {
        console.log('[v0] Error fetching user:', error)
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      router.push('/sign-in')
      router.refresh()
    } catch (error) {
      console.log('[v0] Error logging out:', error)
    }
  }

  // Hide header on auth pages
  if (pathname?.includes('/sign-in') || pathname?.includes('/sign-up')) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2 flex-shrink-0">
          <div className="text-2xl font-bold text-black dark:text-white">STARO</div>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 hidden sm:block">
            OS for Founders
          </div>
        </Link>

        {/* Center - Navigation (Desktop Only) */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/home" label="Home" active={pathname === '/home'} />
          <NavLink href="/network" label="Network" active={pathname === '/network'} />
          <NavLink href="/explore" label="Explore" active={pathname === '/explore'} />
          <NavLink href="/watch" label="Watch" active={pathname === '/watch'} />
        </nav>

        {/* Right side - Notifications and Menu */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition"
              aria-label="Menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1">
                {user && (
                  <>
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">
                        {user.name || user.email}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </>
                )}

                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={16} />
                  Profile
                </Link>

                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-left"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings size={16} />
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-left border-t border-gray-200 dark:border-gray-800 mt-1 pt-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-md text-sm font-medium transition ${
        active
          ? 'bg-black dark:bg-white text-white dark:text-black'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
      }`}
    >
      {label}
    </Link>
  )
}
