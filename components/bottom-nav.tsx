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
      {/* Bottom Navigation - Instagram Style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800/50 flex items-center justify-around h-14 md:hidden z-40">
        <Link
          href="/home"
          className={`flex items-center justify-center w-full h-full transition-all duration-200 ${
            isActive('/home')
              ? 'text-black dark:text-white'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
          title="Home"
        >
          <Home size={22} className="hover:scale-110 transition-transform" />
        </Link>
        <Link
          href="/explore"
          className={`flex items-center justify-center w-full h-full transition-all duration-200 ${
            isActive('/explore')
              ? 'text-black dark:text-white'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
          title="Explore"
        >
          <Search size={22} className="hover:scale-110 transition-transform" />
        </Link>
        <Link
          href="/watch"
          className={`flex items-center justify-center w-full h-full transition-all duration-200 ${
            isActive('/watch')
              ? 'text-black dark:text-white'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
          title="Watch"
        >
          <Plus size={22} className="hover:scale-110 transition-transform" />
        </Link>
        <Link
          href="/network"
          className={`flex items-center justify-center w-full h-full transition-all duration-200 ${
            isActive('/network')
              ? 'text-black dark:text-white'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
          title="Network"
        >
          <Grid size={22} className="hover:scale-110 transition-transform" />
        </Link>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center justify-center w-full h-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 group"
          title="Profile"
        >
          <div className="relative">
            <User size={22} className="group-hover:scale-110 transition-transform" />
            {showMenu && (
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        </button>
      </nav>

      {/* Profile Menu - Glass Style */}
      {showMenu && (
        <div className="fixed bottom-14 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-lg border border-gray-200 dark:border-gray-800/50 rounded-2xl p-2 mb-2 shadow-xl z-50 animate-in fade-in scale-95 duration-200">
          <Link
            href="/profile"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-900/50 text-sm rounded-lg transition-colors"
            onClick={() => setShowMenu(false)}
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-600 dark:text-red-400 rounded-lg transition-colors"
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
