'use client'

import { useEffect, useState } from 'react'
import { Zap, Plus, Share2 } from 'lucide-react'
import { getPulse, logShip } from '@/app/actions/pulse'
import { createPost, getPosts } from '@/app/actions/posts'
import { BottomNav } from '@/components/bottom-nav'
import { TopHeader } from '@/components/top-header'

export default function HomePage() {
  const [pulse, setPulse] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 2000)
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-purple-500 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading STARO...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <TopHeader />
      <BottomNav />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-950 space-y-6 p-4 md:p-6 max-w-2xl mx-auto pb-28 pt-24">
        {/* STARO Pulse Section - Premium Glass */}
        <div className="glass rounded-3xl p-8 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-white/10 backdrop-blur-xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 text-transparent bg-gradient-to-r from-orange-400 via-pink-400 to-red-400 bg-clip-text">
              <Zap size={20} className="text-orange-400 drop-shadow-lg" />
              <span className="text-xs font-bold uppercase tracking-widest">STARO PULSE - Build Streak</span>
            </div>
            
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
                  {pulse?.currentStreak || 0}
                </div>
                <div className="text-gray-300 text-sm font-medium mt-1">day streak</div>
                {(pulse?.currentStreak || 0) === 0 && (
                  <div className="text-gray-400 text-xs mt-3">Log your first ship to start building</div>
                )}
              </div>
              <button
                onClick={handleShip}
                className="group/btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center gap-2"
              >
                <Plus size={20} className="group-hover/btn:rotate-90 transition-transform" />
                <span>Ship Today</span>
              </button>
            </div>

            {/* Streak visualization - Premium */}
            <div className="flex gap-1.5 flex-wrap">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-md transition-all duration-300 transform hover:scale-125 ${
                    i < (pulse?.currentStreak || 0)
                      ? 'bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg shadow-blue-500/50'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Your Story Section */}
        <div className="glass rounded-3xl p-8 border border-white/10 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white mb-4">Your Story</h2>
          <div className="space-y-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What did you build today? Share your progress..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all resize-none"
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setContent('')}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={posting || !content.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>

        {/* Posts Feed Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white px-2">Your Feed</h2>
          {posts.length === 0 ? (
            <div className="glass rounded-3xl p-12 border border-white/10 backdrop-blur-xl text-center">
              <Share2 size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-400 text-sm">No posts yet. Start by creating one above!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="glass rounded-2xl p-6 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-white group-hover:text-blue-300 transition-colors">{post.authorName}</p>
                    <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed break-words">{post.content}</p>
                <div className="flex gap-6 mt-4 text-xs text-gray-400 border-t border-white/10 pt-4">
                  <button className="hover:text-pink-400 transition-colors flex items-center gap-1 hover:scale-110">
                    ❤️ {post.likes || 0}
                  </button>
                  <button className="hover:text-blue-400 transition-colors flex items-center gap-1 hover:scale-110">
                    💬 {post.comments || 0}
                  </button>
                  <button className="hover:text-green-400 transition-colors flex items-center gap-1 hover:scale-110">
                    🔄 {post.shares || 0}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  )
}
