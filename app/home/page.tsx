'use client'

import { useEffect, useState } from 'react'
import { Zap, Plus, Share2 } from 'lucide-react'
import { getPulse, logShip } from '@/app/actions/pulse'
import { createPost, getPosts } from '@/app/actions/posts'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/bottom-nav'
import { TopHeader } from '@/components/top-header'

export default function HomePage() {
  const router = useRouter()
  const [pulse, setPulse] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 2000) // Real-time polling every 2 seconds
    return () => clearInterval(interval)
  }, [])

  async function loadData() {
    try {
      const pulseData = await getPulse()
      setPulse(pulseData)
      const postsData = await getPosts()
      setPosts(postsData)
    } catch (error) {
      console.log('[v0] Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleShip() {
    try {
      await logShip()
      await loadData()
    } catch (error) {
      console.log('[v0] Error logging ship:', error)
    }
  }

  async function handlePost() {
    if (!content.trim()) return
    setPosting(true)
    try {
      await createPost(content)
      setContent('')
      await loadData()
    } catch (error) {
      console.log('[v0] Error posting:', error)
    } finally {
      setPosting(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>
  }

  return (
    <>
      <TopHeader />
      <BottomNav />
      <main className="space-y-6 p-6 max-w-2xl mx-auto pt-20">
      {/* STARO Pulse Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4 text-orange-400">
          <Zap size={20} />
          <span className="text-sm font-semibold uppercase">STARO PULSE</span>
        </div>
        
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-5xl font-bold">{pulse?.currentStreak || 0}</div>
            <div className="text-gray-400 text-sm">days</div>
            <div className="text-gray-500 mt-2">Log your first ship</div>
          </div>
          <button
            onClick={handleShip}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition"
          >
            + Ship
          </button>
        </div>

        {/* Streak visualization */}
        <div className="flex gap-1 mb-6 flex-wrap">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < (pulse?.currentStreak || 0)
                  ? 'bg-blue-500'
                  : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-4 justify-between">
          <div>
            <div className="text-2xl font-bold">{pulse?.longestStreak || 0}</div>
            <div className="text-gray-400 text-xs">Best 0d</div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full transition">
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>

      {/* Stories Section */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        <button className="min-w-32 h-40 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 transition">
          <Plus size={32} className="text-gray-500" />
        </button>
        <div className="text-center text-sm text-gray-500 self-center">Your story</div>
      </div>

      {/* Create Post Section */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your startup update, photo, or video..."
          className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 focus:outline-none focus:border-blue-500"
          rows={3}
        />
        <div className="flex justify-end">
          <button
            onClick={handlePost}
            disabled={posting}
            className="bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-6 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-50"
          >
            {posting ? 'Posting...' : 'Create post'}
          </button>
        </div>
      </div>

      {/* Feed Section */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="text-gray-400 mb-4">Your feed is empty</div>
          <button
            onClick={() => router.push('/network')}
            className="text-blue-500 hover:underline text-sm"
          >
            Find people to follow →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-900 rounded-lg p-4 border dark:border-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div>
                  <div className="font-semibold text-sm">{post.author?.bio || 'User'}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <p className="text-gray-900 dark:text-gray-100 mb-3">{post.content}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-64 object-cover rounded-lg mb-3"
                />
              )}
              <div className="flex gap-6 text-gray-500 text-sm">
                <button className="hover:text-blue-500 transition">❤️ {post.likeCount}</button>
                <button className="hover:text-blue-500 transition">💬 {post.commentCount}</button>
                <button className="hover:text-blue-500 transition">↗️ Share</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
    </>
  )
}
