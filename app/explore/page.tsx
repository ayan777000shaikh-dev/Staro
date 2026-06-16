'use client'

import { useEffect, useState } from 'react'
import { Rocket, Briefcase, Filter, Search } from 'lucide-react'
import { getStartups, getJobs } from '@/app/actions/explore'
import { BottomNav } from '@/components/bottom-nav'

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<'startups' | 'jobs'>('startups')
  const [startups, setStartups] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'AI', 'SaaS', 'Fintech', 'HealthTech', 'ClimateTech', 'Robotics', 'Web3']

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [startupsData, jobsData] = await Promise.all([
          getStartups(),
          getJobs(),
        ])
        setStartups(startupsData || [])
        setJobs(jobsData || [])
      } catch (error) {
        console.log('[v0] Error loading explore data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredStartups = selectedCategory === 'All'
    ? startups
    : startups.filter(s => s.category === selectedCategory)

  return (
    <>
      <BottomNav />
      <main className="space-y-6 p-6 max-w-4xl mx-auto pb-32">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explore</h1>
          <p className="text-gray-600 dark:text-gray-400">Discover startups, jobs, and opportunities</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b dark:border-gray-700">
          <button
            onClick={() => setActiveTab('startups')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'startups'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Rocket size={18} className="inline mr-2" />
            Startups
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'jobs'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Briefcase size={18} className="inline mr-2" />
            Jobs
          </button>
        </div>

        {/* Startups Tab */}
        {activeTab === 'startups' && (
          <div className="space-y-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Startups List */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Loading startups...</p>
              </div>
            ) : filteredStartups.length === 0 ? (
              <div className="text-center py-12">
                <Rocket size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No startups in this category yet</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredStartups.map(startup => (
                  <div
                    key={startup.id}
                    className="p-4 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{startup.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{startup.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {startup.category && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                          {startup.category}
                        </span>
                      )}
                      {startup.stage && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                          {startup.stage}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No jobs posted yet</p>
              </div>
            ) : (
              jobs.map(job => (
                <div
                  key={job.id}
                  className="p-4 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{job.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.jobType && (
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                        {job.jobType}
                      </span>
                    )}
                    {job.location && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {job.location}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </>
  )
}
