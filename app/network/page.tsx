'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  getFollowing,
  getFollowers,
  followUser,
  isFollowing as checkFollowing,
} from '@/app/actions/users'
import { authClient } from '@/lib/auth-client'
import { TopHeader } from '@/components/top-header'
import { BottomNav } from '@/components/bottom-nav'
import { Tabs } from '@/components/tabs'
import { UserDiscoveryCard } from '@/components/network/user-discovery-card'
import { RecommendationsSection } from '@/components/network/recommendations-section'
import { Users, Search, TrendingUp, Star } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  bio?: string
  followers?: number
  following?: number
  isFollowing?: boolean
  badges?: string[]
}

interface Recommendation {
  id: string
  title: string
  description: string
  count: number
  type: 'trending' | 'popular' | 'new'
}

export default function NetworkPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('discover')
  const [loading, setLoading] = useState(true)
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if user is authenticated
        const { data: session } = await authClient.getSession()
        if (!session?.user) {
          router.push('/sign-in')
          return
        }

        // Load following list
        const followingData = await getFollowing()
        if (followingData) {
          setFollowing(followingData)
          setFollowingIds(new Set(followingData.map((u) => u.id)))
        }

        // Load followers
        const followersData = await getFollowers()
        if (followersData) {
          // Add some mock users for discovery
          const mockUsers: User[] = [
            {
              id: '1',
              name: 'Sarah Chen',
              email: 'sarah@staro.app',
              bio: 'Product Designer & Startup Builder',
              followers: 2500,
              badges: ['Verified', 'Creator'],
            },
            {
              id: '2',
              name: 'Alex Rivera',
              email: 'alex@staro.app',
              bio: 'Full-stack developer passionate about AI',
              followers: 3200,
              badges: ['Developer'],
            },
            {
              id: '3',
              name: 'Jordan Lee',
              email: 'jordan@staro.app',
              bio: 'Marketing expert and growth hacker',
              followers: 1800,
              badges: ['Verified'],
            },
            {
              id: '4',
              name: 'Casey Morgan',
              email: 'casey@staro.app',
              bio: 'Data scientist and ML enthusiast',
              followers: 2100,
              badges: ['Creator'],
            },
            {
              id: '5',
              name: 'Taylor Woods',
              email: 'taylor@staro.app',
              bio: 'Product manager at innovative startups',
              followers: 1600,
              badges: ['Verified'],
            },
            {
              id: '6',
              name: 'Morgan Smith',
              email: 'morgan@staro.app',
              bio: 'Investor and venture advisor',
              followers: 4200,
              badges: ['Verified', 'Creator'],
            },
          ]
          setUsers(mockUsers)
        }
      } catch (error) {
        console.error('[v0] Error loading network data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId)
      setFollowingIds((prev) => new Set(prev).add(userId))
    } catch (error) {
      console.error('[v0] Error following user:', error)
    }
  }

  const handleMessage = (userId: string) => {
    console.log('Message user:', userId)
  }

  const tabs = [
    { id: 'discover', label: 'Discover', icon: <TrendingUp size={18} />, count: users.length },
    { id: 'following', label: 'Following', icon: <Users size={18} />, count: following.length },
    { id: 'recommended', label: 'For You', icon: <Star size={18} />, count: 5 },
  ]

  const recommendations: Recommendation[] = [
    {
      id: '1',
      title: 'AI & Machine Learning',
      description: 'Explore the latest in AI technology and ML applications',
      count: 12400,
      type: 'trending',
    },
    {
      id: '2',
      title: 'Startup Founders',
      description: 'Connect with successful entrepreneurs and founders',
      count: 8900,
      type: 'popular',
    },
    {
      id: '3',
      title: 'Tech Innovators',
      description: 'Discover new technologies and innovations',
      count: 5600,
      type: 'new',
    },
    {
      id: '4',
      title: 'Product Builders',
      description: 'Learn from product managers and designers',
      count: 7200,
      type: 'popular',
    },
    {
      id: '5',
      title: 'Growth Hackers',
      description: 'Master growth strategies and marketing tactics',
      count: 4100,
      type: 'trending',
    },
    {
      id: '6',
      title: 'Emerging Talents',
      description: 'Support new and rising creators in the community',
      count: 3400,
      type: 'new',
    },
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-border border-t-accent animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading network...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      <BottomNav />

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-8 pb-32">
        {/* Header Section */}
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Network
            </h1>
            <p className="text-muted-foreground mt-2">Discover and connect with amazing people</p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-premium pl-12 w-full"
            />
          </div>
        </div>

        {/* Tabs */}
        <section>
          <Tabs
            items={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="pills"
            size="md"
          />
        </section>

        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <div className="space-y-6 animate-fade-in">
            {filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <UserDiscoveryCard
                    key={user.id}
                    user={{
                      ...user,
                      isFollowing: followingIds.has(user.id),
                    }}
                    onFollow={handleFollow}
                    onMessage={handleMessage}
                    onViewProfile={(id) => router.push(`/profile/${id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="card-glass rounded-2xl p-12 text-center">
                <p className="text-muted-foreground">No users found matching your search</p>
              </div>
            )}
          </div>
        )}

        {/* Following Tab */}
        {activeTab === 'following' && (
          <div className="space-y-6 animate-fade-in">
            {following.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {following.map((user) => (
                  <UserDiscoveryCard
                    key={user.id}
                    user={{
                      ...user,
                      isFollowing: true,
                    }}
                    onFollow={handleFollow}
                    onMessage={handleMessage}
                  />
                ))}
              </div>
            ) : (
              <div className="card-glass rounded-2xl p-12 text-center">
                <p className="text-muted-foreground">You haven't followed anyone yet</p>
              </div>
            )}
          </div>
        )}

        {/* Recommended Tab */}
        {activeTab === 'recommended' && (
          <div className="animate-fade-in">
            <RecommendationsSection recommendations={recommendations} />
          </div>
        )}
      </main>
    </div>
  )
}
