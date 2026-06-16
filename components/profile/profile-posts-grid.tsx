'use client'

import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'

interface Post {
  id: string
  image?: string
  title?: string
  content: string
  likes: number
  comments: number
  shares: number
  date: string
}

interface ProfilePostsGridProps {
  posts: Post[]
}

export function ProfilePostsGrid({ posts }: ProfilePostsGridProps) {
  if (posts.length === 0) {
    return (
      <div className="card-glass rounded-2xl p-12 text-center">
        <p className="text-muted-foreground text-sm">No posts yet. Start creating!</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group card-glass rounded-xl overflow-hidden hover:border-accent/50 transition-all duration-300 transform hover:scale-105"
          >
            {/* Image placeholder */}
            {post.image && (
              <div className="relative h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              {post.title && <h3 className="font-semibold text-foreground mb-2 truncate">{post.title}</h3>}
              <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{post.content}</p>

              {/* Engagement */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <button className="hover:text-foreground transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              {/* Actions */}
              <div className="flex justify-around text-xs text-muted-foreground">
                <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors group/action">
                  <Heart size={16} className="group-hover/action:fill-red-500" />
                  {post.likes}
                </button>
                <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                  <MessageCircle size={16} />
                  {post.comments}
                </button>
                <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors">
                  <Share2 size={16} />
                  {post.shares}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
