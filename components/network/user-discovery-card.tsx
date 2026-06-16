'use client'

import { Users, MessageCircle, User, Check } from 'lucide-react'

interface UserCard {
  id: string
  name: string
  email: string
  bio?: string
  followers?: number
  isFollowing?: boolean
  badges?: string[]
}

interface UserDiscoveryCardProps {
  user: UserCard
  onFollow?: (userId: string) => void
  onMessage?: (userId: string) => void
  onViewProfile?: (userId: string) => void
}

export function UserDiscoveryCard({
  user,
  onFollow,
  onMessage,
  onViewProfile,
}: UserDiscoveryCardProps) {
  return (
    <div className="group card-glass rounded-2xl p-6 hover:border-accent/50 transition-all duration-300 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-border group-hover:ring-accent transition-all">
            <User size={24} className="text-white" />
          </div>

          {/* User info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>

            {/* Badges */}
            {user.badges && user.badges.length > 0 && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {user.badges.slice(0, 2).map((badge) => (
                  <span
                    key={badge}
                    className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-sm text-foreground line-clamp-2">{user.bio}</p>
      )}

      {/* Stats */}
      {user.followers && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users size={14} />
          <span>{user.followers} followers</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <button
          onClick={() => onMessage?.(user.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors text-sm font-medium"
        >
          <MessageCircle size={16} />
          Message
        </button>
        <button
          onClick={() => onFollow?.(user.id)}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            user.isFollowing
              ? 'bg-accent/10 text-accent hover:bg-accent/20'
              : 'bg-accent hover:bg-accent/90 text-white'
          }`}
        >
          {user.isFollowing ? (
            <>
              <Check size={16} />
              Following
            </>
          ) : (
            <>
              <User size={16} />
              Follow
            </>
          )}
        </button>
      </div>
    </div>
  )
}
