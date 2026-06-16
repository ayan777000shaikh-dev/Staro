'use client'

import { useEffect, useState } from 'react'
import { Share2, Settings, Rocket, TrendingUp, Bookmark, Award, LogOut } from 'lucide-react'
import { getCurrentUserProfile, createOrUpdateProfile } from '@/app/actions/users'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/bottom-nav'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    bio: '',
    role: '',
    skills: '',
    location: '',
    website: '',
  })

  useEffect(() => {
    async function loadProfile() {
      try {
        const session = await authClient.getSession()
        if (session?.user) {
          setUser(session.user)
          const profileData = await getCurrentUserProfile()
          setProfile(profileData)
          if (profileData) {
            setFormData({
              bio: profileData.bio || '',
              role: profileData.role || '',
              skills: profileData.skills || '',
              location: profileData.location || '',
              website: profileData.website || '',
            })
          }
        }
      } catch (error) {
        console.log('[v0] Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  async function handleLogout() {
    try {
      await authClient.signOut()
      router.push('/sign-in')
    } catch (error) {
      console.log('[v0] Error logging out:', error)
    }
  }

  async function handleSaveProfile() {
    try {
      await createOrUpdateProfile(formData)
      setProfile({ ...profile, ...formData })
      setIsEditing(false)
    } catch (error) {
      console.log('[v0] Error saving profile:', error)
    }
  }

  if (loading) {
    return (
      <>
        <BottomNav />
        <main className="p-6 text-center">Loading profile...</main>
      </>
    )
  }

  return (
    <>
      <BottomNav />
      <main className="space-y-6 p-6 max-w-2xl mx-auto pb-32">
        {/* Header Background */}
        <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>

        {/* Profile Header */}
        <div className="flex items-start justify-between -mt-12 mb-4">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 border-4 border-white dark:border-gray-900 flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{formData.role || 'Builder'}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Settings size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <StatCard label="Posts" value={profile?.postsCount || 0} />
          <StatCard label="Followers" value={profile?.followers || 0} />
          <StatCard label="Following" value={profile?.following || 0} />
          <StatCard label="Shipped" value={profile?.shippedCount || 0} />
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Profile</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself"
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Founder, Engineer, Designer"
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="e.g., React, Node.js, AI"
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., San Francisco, CA"
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://yourwebsite.com"
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveProfile}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Bio */}
        {formData.bio && (
          <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-4">
            <p className="text-gray-700 dark:text-gray-300">{formData.bio}</p>
          </div>
        )}

        {/* Skills */}
        {formData.skills && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {formData.skills.split(',').map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </main>
    </>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border dark:border-gray-700">
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-xs text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  )
}
