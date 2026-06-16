'use client'

import { User, MapPin, Link as LinkIcon, Mail } from 'lucide-react'
import Image from 'next/image'

interface ProfileHeroProps {
  name: string
  email: string
  bio?: string
  location?: string
  website?: string
  followers?: number
  following?: number
  posts?: number
}

export function ProfileHero({
  name,
  email,
  bio,
  location,
  website,
  followers = 0,
  following = 0,
  posts = 0,
}: ProfileHeroProps) {
  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="h-32 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl mb-8"></div>

      {/* Profile card */}
      <div className="bg-card rounded-2xl border border-border p-6 mx-4 md:mx-0 -mt-12 relative z-10 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-4 ring-card">
              <User size={40} className="text-white" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">{name}</h1>
            <p className="text-muted-foreground text-sm mb-3 flex items-center gap-2">
              <Mail size={16} />
              {email}
            </p>

            {/* Bio */}
            {bio && (
              <p className="text-foreground text-sm mb-4 max-w-2xl leading-relaxed">
                {bio}
              </p>
            )}

            {/* Location & Website */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              {location && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  {location}
                </div>
              )}
              {website && (
                <div className="flex items-center gap-1.5">
                  <LinkIcon size={16} />
                  <a href={website} className="text-accent hover:underline">
                    {website.replace('https://', '')}
                  </a>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{posts}</div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Posts</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{followers}</div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Followers</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{following}</div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
