'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getVideos } from '@/app/actions/videos'
import { authClient } from '@/lib/auth-client'
import { TopHeader } from '@/components/top-header'
import { BottomNav } from '@/components/bottom-nav'
import { Tabs } from '@/components/tabs'
import { StoryCarousel } from '@/components/watch/story-carousel'
import { VideosGrid } from '@/components/watch/videos-grid'
import { Play, Zap, Clock } from 'lucide-react'

interface Video {
  id: string
  title: string
  description?: string
  thumbnail?: string
  duration: number
  views: number
  likes?: number
  createdAt: string
  creator?: string
  type?: string
}

export default function WatchPage() {
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const [selectedStory, setSelectedStory] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVideos = async () => {
      try {
        // Check if user is authenticated
        const { data: session } = await authClient.getSession()
        if (!session?.user) {
          router.push('/sign-in')
          return
        }

        // Load videos
        const videosData = await getVideos()
        if (videosData) {
          setVideos(videosData)
        }
      } catch (error) {
        console.error('[v0] Error loading videos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [router])

  const tabs = [
    { id: 'all', label: 'All Videos', icon: <Play size={18} />, count: videos.length },
    { id: 'trending', label: 'Trending', icon: <Zap size={18} />, count: videos.filter(v => v.views > 5000).length },
    { id: 'recent', label: 'Recent', icon: <Clock size={18} />, count: videos.length },
  ]

  const filteredVideos = videos.filter((video) => {
    if (activeTab === 'trending') return video.views > 5000
    if (activeTab === 'recent') return true
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-border border-t-accent animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading videos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      <BottomNav />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-8 pb-32">
        {/* Header Section */}
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Watch
            </h1>
            <p className="text-muted-foreground mt-2">Discover amazing videos and stories from creators</p>
          </div>
        </div>

        {/* Featured Stories Section */}
        {videos.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Featured Stories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {videos.slice(0, 5).map((video) => (
                <button
                  key={video.id}
                  onClick={() => setSelectedStory(video)}
                  className="group relative rounded-2xl overflow-hidden h-40 border border-border hover:border-accent/50 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/40 group-hover:to-purple-500/40 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/40 transition-colors">
                      <Play size={16} className="text-white ml-0.5 fill-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white text-xs font-medium truncate">{video.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Video Categories Tabs */}
        <section>
          <Tabs
            items={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="pills"
            size="md"
          />
        </section>

        {/* Videos Grid */}
        <section className="animate-fade-in">
          {activeTab === 'all' && (
            <VideosGrid
              videos={filteredVideos.map(v => ({
                ...v,
                creator: v.creator || 'Creator',
                likes: v.likes || 0,
              }))}
              onVideoSelect={(video) => setSelectedStory(video)}
            />
          )}
          {activeTab === 'trending' && (
            <VideosGrid
              videos={filteredVideos.map(v => ({
                ...v,
                creator: v.creator || 'Creator',
                likes: v.likes || 0,
              }))}
              onVideoSelect={(video) => setSelectedStory(video)}
            />
          )}
          {activeTab === 'recent' && (
            <VideosGrid
              videos={filteredVideos.map(v => ({
                ...v,
                creator: v.creator || 'Creator',
                likes: v.likes || 0,
              }))}
              onVideoSelect={(video) => setSelectedStory(video)}
            />
          )}
        </section>

        {/* Upload Section */}
        <section className="card-glass rounded-2xl p-8 border border-border text-center">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <Play size={32} className="text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Share Your Videos</h3>
          <p className="text-muted-foreground mb-6">Upload and share your content with the STARO community</p>
          <button className="btn-primary">Upload Video</button>
        </section>
      </main>

      {/* Story Carousel Modal */}
      {selectedStory && (
        <StoryCarousel
          items={[
            {
              id: selectedStory.id,
              title: selectedStory.title,
              description: selectedStory.description,
              duration: selectedStory.duration || 5,
              thumbnail: selectedStory.thumbnail,
              type: 'video',
            },
          ]}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </div>
  )
}
