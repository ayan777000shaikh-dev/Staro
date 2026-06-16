'use client'

import { useState } from 'react'
import { Settings, Bell, Lock, User, Palette } from 'lucide-react'

interface SettingsTab {
  id: string
  label: string
  icon: React.ReactNode
}

const SETTINGS_TABS: SettingsTab[] = [
  { id: 'account', label: 'Account', icon: <User size={18} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { id: 'privacy', label: 'Privacy', icon: <Lock size={18} /> },
  { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
]

interface ProfileSettingsProps {
  onTabChange?: (tab: string) => void
}

export function ProfileSettings({ onTabChange }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState('account')

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    onTabChange?.(tab)
  }

  return (
    <div className="space-y-6">
      {/* Settings header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-accent/10 rounded-lg">
          <Settings size={24} className="text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your account preferences</p>
        </div>
      </div>

      {/* Settings tabs */}
      <div className="flex gap-2 flex-wrap">
        {SETTINGS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-accent text-white shadow-lg'
                : 'bg-card hover:bg-muted text-foreground border border-border'
            }`}
          >
            {tab.icon}
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings content */}
      <div className="bg-card rounded-2xl border border-border p-6">
        {activeTab === 'account' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Account Settings</h3>
            <p className="text-muted-foreground text-sm">Update your account information and credentials</p>
            <button className="mt-4 btn-secondary">Edit Profile</button>
          </div>
        )}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
            <p className="text-muted-foreground text-sm">Control how you receive notifications</p>
          </div>
        )}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Privacy Settings</h3>
            <p className="text-muted-foreground text-sm">Manage your privacy and visibility</p>
          </div>
        )}
        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
            <p className="text-muted-foreground text-sm">Customize your visual preferences</p>
          </div>
        )}
      </div>
    </div>
  )
}
