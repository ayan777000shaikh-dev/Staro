'use client'

import { useEffect, useState } from 'react'
import { Upload, Play, Film } from 'lucide-react'
import { getVideos, getShorts } from '@/app/actions/videos'
import { BottomNav } from '@/components/bottom-nav'
import { TopHeader } from '@/components/top-header'

export default function WatchPage() {
  const [activeTab, setActiveTab] = useState<'videos' | 'shorts'>('videos')
  const [videos, setVideos] = useState<any[]>([])
  const [shorts, setShorts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadVideos() {
      try {
        setLoading(true)
        const [videosData, shortsData] = await Promise.all([
          getVideos(),
          getShorts(),
        ])
        setVideos(videosData || [])
        setShorts(shortsData || [])
      } catch (error) {
        console.log('[v0] Error loading videos:', error)
      } finally {
        setLoading(false)
      }
    }
    loadVideos()
  }, [])

  const displayedVideos = activeTab === 'videos' ? videos : shorts

  return (
    <>
      <TopHeader />
      <BottomNav />
      <main className="space-y-6 p-6 max-w-4xl mx-auto pb-32 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🎬</span>
            <span className="text-sm font-semibold uppercase text-gray-400">WATCH</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">Reels, shorts & founder talks</h1>
          <p className="text-gray-400 mb-6">
            Once creators start posting, you&apos;ll see videos and shorts from the STARO community here.
          </p>
          <button className="flex items-center gap-2 bg-white text-gray-900 font-semibold py-3 px-6 rounded-full hover:bg-gray-100 transition">
            <Upload size={20} />
            Upload a video
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b dark:border-gray-700">
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'videos'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Film size={18} className="inline mr-2" />
            Videos
          </button>
          <button
            onClick={() => setActiveTab('shorts')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'shorts'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            <Play size={18} className="inline mr-2" />
            Shorts
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading {activeTab}...</p>
          </div>
        ) : displayedVideos.length === 0 ? (
          <div className="text-center py-12">
            <Play size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No {activeTab} yet</p>
            <p className="text-sm text-gray-500 mt-2">Be the first to upload!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedVideos.map(video => (
              <div
                key={video.id}
                className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border dark:border-gray-700 hover:shadow-lg transition cursor-pointer"
              >
                <div className="aspect-video bg-gray-800 flex items-center justify-center">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Play size={48} className="text-gray-600" />
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-white">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
                    <span>{video.views || 0} views</span>
                    {video.duration && <span>{Math.floor(video.duration / 60)}m</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
