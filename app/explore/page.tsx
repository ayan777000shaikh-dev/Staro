'use client'

import { useEffect, useState } from 'react'
import { Rocket, Briefcase, Search as SearchIcon, Filter } from 'lucide-react'
import { getStartups, getJobs } from '@/app/actions/explore'
import { BottomNav } from '@/components/bottom-nav'
import { TopHeader } from '@/components/top-header'
import { Tabs, TabContent } from '@/components/tabs'

const STARTUP_CATEGORIES = [
  { id: 'all', label: 'All', icon: Rocket },
  { id: 'ai', label: 'AI/ML', count: 0 },
  { id: 'fintech', label: 'Fintech', count: 0 },
  { id: 'saas', label: 'SaaS', count: 0 },
  { id: 'health', label: 'HealthTech', count: 0 },
  { id: 'web3', label: 'Web3', count: 0 },
]

const JOB_CATEGORIES = [
  { id: 'all', label: 'All', icon: Briefcase },
  { id: 'engineering', label: 'Engineering', count: 0 },
  { id: 'design', label: 'Design', count: 0 },
  { id: 'product', label: 'Product', count: 0 },
  { id: 'marketing', label: 'Marketing', count: 0 },
  { id: 'sales', label: 'Sales', count: 0 },
]

export default function ExplorePage() {
  const [mainTab, setMainTab] = useState<'startups' | 'jobs'>('startups')
  const [startupCategory, setStartupCategory] = useState('all')
  const [jobCategory, setJobCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [startups, setStartups] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
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

  const mainTabs = [
    { id: 'startups', label: 'Startups', icon: Rocket, count: startups.length },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, count: jobs.length },
  ]

  const filteredStartups = startups.filter(s => {
    const matchesCategory = startupCategory === 'all' || s.category === startupCategory
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const filteredJobs = jobs.filter(j => {
    const matchesCategory = jobCategory === 'all' || j.type === jobCategory
    const matchesSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <TopHeader />
      <BottomNav />
      <main className="space-y-6 p-6 max-w-6xl mx-auto pb-32 pt-20">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Explore</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Discover startups, jobs, and opportunities in the STARO ecosystem
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search startups, jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs
          items={mainTabs}
          activeTab={mainTab}
          onTabChange={(tab) => setMainTab(tab as 'startups' | 'jobs')}
          variant="pills"
          size="md"
        />

        {/* Startups Tab */}
        <TabContent isActive={mainTab === 'startups'}>
          <div className="space-y-6">
            {/* Category Filter */}
            <Tabs
              items={STARTUP_CATEGORIES}
              activeTab={startupCategory}
              onTabChange={setStartupCategory}
              variant="underline"
              size="sm"
            />

            {/* Startups Grid */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Loading startups...</p>
              </div>
            ) : filteredStartups.length === 0 ? (
              <div className="text-center py-12">
                <Rocket size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No startups found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStartups.map(startup => (
                  <div
                    key={startup.id}
                    className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-blue-400 transition cursor-pointer"
                  >
                    <h3 className="font-bold text-gray-900 dark:text-white">{startup.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {startup.description}
                    </p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                        {startup.category || 'Other'}
                      </span>
                      {startup.status && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                          {startup.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabContent>

        {/* Jobs Tab */}
        <TabContent isActive={mainTab === 'jobs'}>
          <div className="space-y-6">
            {/* Category Filter */}
            <Tabs
              items={JOB_CATEGORIES}
              activeTab={jobCategory}
              onTabChange={setJobCategory}
              variant="underline"
              size="sm"
            />

            {/* Jobs Grid */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No jobs found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredJobs.map(job => (
                  <div
                    key={job.id}
                    className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-blue-400 transition cursor-pointer"
                  >
                    <h3 className="font-bold text-gray-900 dark:text-white">{job.title}</h3>
                    {job.company && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {job.description}
                    </p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {job.type && (
                        <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                          {job.type}
                        </span>
                      )}
                      {job.location && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                          {job.location}
                        </span>
                      )}
                      {job.remote && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                          {job.remote ? 'Remote' : 'On-site'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabContent>
      </main>
    </>
  )
}
