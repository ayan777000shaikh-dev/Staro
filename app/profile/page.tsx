'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUserProfile } from '@/app/actions/users'
import { getPosts } from '@/app/actions/posts'
import { authClient } from '@/lib/auth-client'
import { TopHeader } from '@/components/top-header'
import { BottomNav } from '@/components/bottom-nav'
import { ProfileHero } from '@/components/profile/profile-hero'
import { ProfileStats } from '@/components/profile/profile-stats'
import { ProfileSettings } from '@/components/profile/profile-settings'
import { ProfilePostsGrid } from '@/components/profile/profile-posts-grid'
import { Zap, Users, BarChart3, Award } from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  bio?: string
  location?: string
  website?: string
  followers?: number
  following?: number
}

interface Post {
  id: string
  content: string
  likes?: number
  comments?: number
  shares?: number
  createdAt: string
  authorName?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<'posts' | 'settings'>('posts')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Check if user is authenticated
        const { data: session } = await authClient.getSession()
        if (!session?.user) {
          router.push('/sign-in')
          return
        }

        // Load profile data
        const profileData = await getCurrentUserProfile()
        if (profileData) {
          setProfile(profileData)
        }

        // Load user's posts
        const postsData = await getPosts()
        if (postsData) {
          setPosts(postsData)
        }
      } catch (error) {
        console.error('[v0] Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-border border-t-accent animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load profile</p>
      </div>
    )
  }

  // Prepare stats data
  const stats = [
    {
      label: 'Posts',
      value: posts.length,
      change: '+5%',
      trend: 'up' as const,
      icon: <Zap className="text-blue-500" size={20} />,
    },
    {
      label: 'Followers',
      value: profile.followers || 0,
      change: '+12%',
      trend: 'up' as const,
      icon: <Users className="text-purple-500" size={20} />,
    },
    {
      label: 'Engagement',
      value: '1.2k',
      change: '+8%',
      trend: 'up' as const,
      icon: <BarChart3 className="text-pink-500" size={20} />,
    },
    {
      label: 'Reputation',
      value: '98%',
      change: '+2%',
      trend: 'up' as const,
      icon: <Award className="text-green-500" size={20} />,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      <BottomNav />

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-8 pb-32">
        {/* Profile Hero Section */}
        <ProfileHero
          name={profile.name}
          email={profile.email}
          bio={profile.bio}
          location={profile.location}
          website={profile.website}
          followers={profile.followers}
          following={profile.following}
          posts={posts.length}
        />

        {/* Stats Grid */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-6">Your Stats</h2>
          <ProfileStats stats={stats} />
        </section>

        {/* Section Toggle */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveSection('posts')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeSection === 'posts'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveSection('settings')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeSection === 'settings'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Posts Section */}
        {activeSection === 'posts' && (
          <section className="animate-fade-in">
            <ProfilePostsGrid
              posts={posts.map((post) => ({
                ...post,
                likes: post.likes || 0,
                comments: post.comments || 0,
                shares: post.shares || 0,
              }))}
            />
          </section>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <section className="animate-fade-in">
            <ProfileSettings onTabChange={(tab) => console.log('Settings tab changed:', tab)} />
          </section>
        )}
      </main>
    </div>
  )
}
