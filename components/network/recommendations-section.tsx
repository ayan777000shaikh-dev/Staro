'use client'

import { TrendingUp, Users, Sparkles } from 'lucide-react'

interface RecommendationItem {
  id: string
  title: string
  description: string
  count: number
  type: 'trending' | 'popular' | 'new'
}

interface RecommendationsSectionProps {
  recommendations: RecommendationItem[]
  onSelect?: (item: RecommendationItem) => void
}

export function RecommendationsSection({
  recommendations,
  onSelect,
}: RecommendationsSectionProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'trending':
        return <TrendingUp size={18} className="text-red-500" />
      case 'popular':
        return <Users size={18} className="text-blue-500" />
      case 'new':
        return <Sparkles size={18} className="text-purple-500" />
      default:
        return null
    }
  }

  const getLabel = (type: string) => {
    switch (type) {
      case 'trending':
        return 'Trending'
      case 'popular':
        return 'Popular'
      case 'new':
        return 'New'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Recommendations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect?.(item)}
            className="card-glass rounded-2xl p-6 text-left hover:border-accent/50 transition-all duration-300 transform hover:scale-105 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                {getIcon(item.type)}
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">
                {getLabel(item.type)}
              </span>
            </div>

            <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>

            <div className="text-xs text-muted-foreground">
              {item.count.toLocaleString()} users interested
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
