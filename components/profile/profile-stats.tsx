'use client'

import { TrendingUp, Zap, Trophy, Target } from 'lucide-react'

interface StatsCard {
  label: string
  value: string | number
  change?: string
  icon: React.ReactNode
  trend?: 'up' | 'down'
}

interface ProfileStatsProps {
  stats: StatsCard[]
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group card-glass rounded-2xl p-4 hover:border-accent/50 transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
              {stat.icon}
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            {stat.value}
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
          {stat.change && (
            <p className={`text-xs mt-2 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
