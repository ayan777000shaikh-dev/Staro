'use client'

import { Play, Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

interface Video {
  id: string
  title: string
  thumbnail: string
  duration: number
  views: number
  likes: number
  createdAt: string
  creator: string
}

interface VideosGridProps {
  videos: Video[]
  onVideoSelect?: (video: Video) => void
}

export function VideosGrid({ videos, onVideoSelect }: VideosGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (videos.length === 0) {
    return (
      <div className="card-glass rounded-2xl p-12 text-center">
        <p className="text-muted-foreground">No videos yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div
          key={video.id}
          onMouseEnter={() => setHoveredId(video.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="group cursor-pointer"
        >
          {/* Video thumbnail */}
          <div className="relative rounded-2xl overflow-hidden mb-3 bg-card border border-border transition-all duration-300 hover:border-accent/50">
            <div className="relative pb-[56.25%] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
              {video.thumbnail && (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/40 transition-colors">
                  <Play size={24} className="text-white ml-1 fill-white" />
                </div>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded-md text-xs text-white font-medium">
                {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
              </div>

              {/* Views badge */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded-md text-xs text-white/80">
                {(video.views / 1000).toFixed(1)}K views
              </div>
            </div>
          </div>

          {/* Video info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
              {video.title}
            </h3>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
                <span>{video.creator}</span>
              </div>
              <button className="hover:text-foreground transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>

            {/* Engagement stats */}
            {hoveredId === video.id && (
              <div className="flex gap-3 text-xs text-muted-foreground pt-2 border-t border-border animate-fade-in">
                <button className="flex items-center gap-1 hover:text-red-500 transition-colors group/action">
                  <Heart size={14} className="group-hover/action:fill-red-500" />
                  {video.likes}
                </button>
                <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                  <MessageCircle size={14} />
                  Chat
                </button>
                <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                  <Share2 size={14} />
                  Share
                </button>
              </div>
            )}

            {/* Date */}
            <p className="text-xs text-muted-foreground">
              {new Date(video.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
