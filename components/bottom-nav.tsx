'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Search, Plus, Grid, User } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const isActive = (path: string) => pathname === path || pathname.startsWith(path)

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      router.push('/sign-in')
    } catch (error) {
      console.log('[v0] Logout error:', error)
    }
  }

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t dark:border-gray-800 flex items-center justify-around h-16 md:hidden">
        <Link
          href="/home"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive('/home') ? 'text-black dark:text-white' : 'text-gray-400'
          }`}
        >
          <Home size={24} />
        </Link>
        <Link
          href="/explore"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive('/explore') ? 'text-black dark:text-white' : 'text-gray-400'
          }`}
        >
          <Search size={24} />
        </Link>
        <Link
          href="/watch"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive('/watch') ? 'text-black dark:text-white' : 'text-gray-400'
          }`}
        >
          <Plus size={24} />
        </Link>
        <Link
          href="/network"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive('/network') ? 'text-black dark:text-white' : 'text-gray-400'
          }`}
        >
          <Grid size={24} />
        </Link>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-black dark:hover:text-white"
        >
          <User size={24} />
        </button>
      </nav>

      {/* Profile Menu */}
      {showMenu && (
        <div className="fixed bottom-16 right-0 bg-white dark:bg-black border dark:border-gray-800 rounded-lg p-2 mb-2 mr-2 md:hidden">
          <Link
            href="/profile"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 text-sm"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 text-sm text-red-600"
          >
            Logout
          </button>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:bg-white md:dark:bg-black md:border-r md:dark:border-gray-800 md:flex md:flex-col md:p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">⚡ STARO</h1>
        </div>

        <nav className="flex-1 space-y-4">
          <Link
            href="/home"
            className={`block px-4 py-2 rounded-lg transition ${
              isActive('/home')
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
            }`}
          >
            <Home className="inline mr-2" size={20} />
            Home
          </Link>
          <Link
            href="/explore"
            className={`block px-4 py-2 rounded-lg transition ${
              isActive('/explore')
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
            }`}
          >
            <Search className="inline mr-2" size={20} />
            Explore
          </Link>
          <Link
            href="/watch"
            className={`block px-4 py-2 rounded-lg transition ${
              isActive('/watch')
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
            }`}
          >
            <Plus className="inline mr-2" size={20} />
            Watch
          </Link>
          <Link
            href="/network"
            className={`block px-4 py-2 rounded-lg transition ${
              isActive('/network')
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
            }`}
          >
            <Grid className="inline mr-2" size={20} />
            Network
          </Link>
          <Link
            href="/profile"
            className={`block px-4 py-2 rounded-lg transition ${
              isActive('/profile')
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
            }`}
          >
            <User className="inline mr-2" size={20} />
            Profile
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm"
        >
          Logout
        </button>
      </aside>

      {/* Main content spacing */}
      <style jsx>{`
        @media (min-width: 768px) {
          main {
            margin-left: 256px;
          }
        }
        @media (max-width: 767px) {
          main {
            padding-bottom: 64px;
          }
        }
      `}</style>
    </>
  )
}
