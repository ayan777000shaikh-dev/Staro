'use client'

import { useEffect, useState } from 'react'
import { Users, TrendingUp, Calendar, Hash } from 'lucide-react'
import {
  followUser,
  getFollowing,
  getFollowers,
  getFollowerCount,
  getFollowingCount,
  isFollowing,
} from '@/app/actions/users'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/bottom-nav'
import { TopHeader } from '@/components/top-header'

export default function NetworkPage() {
  const router = useRouter()
  const [stats, setStats] = useState({ connections: 0, following: 0, mentions: 0 })
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 2000) // Real-time polling
    return () => clearInterval(interval)
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      // In a real app, fetch actual user recommendations
      // For now, show empty state with action buttons
      setStats({
        connections: 0,
        following: 0,
        mentions: 0,
      })
    } catch (error) {
      console.log('[v0] Error loading network data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <TopHeader />
      <BottomNav />
      <main className="space-y-6 p-6 max-w-2xl mx-auto pt-20">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search people, founders, skills"
          className="w-full px-4 py-3 rounded-full border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Your Network Stats */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your network</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Find founders, engineers, and operators to build with.
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="CONNECTIONS" value={stats.connections} />
          <StatCard label="FOLLOWING" value={stats.following} />
          <StatCard label="MENTIONS" value={stats.mentions} />
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <ActionButton icon={<Users size={20} />} label="Invites" />
          <ActionButton icon={<TrendingUp size={20} />} label="Following" />
          <ActionButton icon={<Calendar size={20} />} label="Events" />
          <ActionButton icon={<Hash size={20} />} label="Hashtags" />
        </div>
      </div>

      {/* No Connections Message */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <Users size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          No connections yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Once you sign in and follow people, your co-founder matches, invites, and suggestions will appear here.
        </p>
        <button
          onClick={() => router.push('/network')}
          className="bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-6 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition"
        >
          🚀 Find people to follow
        </button>
      </div>

      {/* Recommended Users */}
      {users.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-lg">Suggested for you</h3>
          {users.map((user) => (
            <UserCard key={user.id} user={user} onFollow={() => loadData()} />
          ))}
        </div>
      )}
    </main>
    </>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border dark:border-gray-800 text-center">
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-xs text-gray-500 uppercase mt-1">{label}</div>
    </div>
  )
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-900 dark:text-white">
      <div className="text-gray-600 dark:text-gray-400">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}

function UserCard({ user, onFollow }: { user: any; onFollow: () => void }) {
  const [following, setFollowing] = useState(false)

  async function handleFollow() {
    try {
      await followUser(user.userId)
      setFollowing(!following)
      onFollow()
    } catch (error) {
      console.log('[v0] Error following user:', error)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border dark:border-gray-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
        <div>
          <div className="font-bold text-sm text-gray-900 dark:text-white">
            {user.role || 'Founder'}
          </div>
          <div className="text-xs text-gray-500">{user.skills || 'Building'}</div>
        </div>
      </div>
      <button
        onClick={handleFollow}
        className={`px-4 py-1 rounded-full font-medium text-sm transition ${
          following
            ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white'
            : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
        }`}
      >
        {following ? 'Following' : 'Follow'}
      </button>
    </div>
  )
}
