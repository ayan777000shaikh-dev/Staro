'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message ?? 'Something went wrong')
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm p-8 bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {isSignUp
              ? 'Join STARO to build with founders'
              : 'Sign in to your STARO account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-white">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading
              ? 'Please wait...'
              : isSignUp
                ? 'Create account'
                : 'Sign in'}
          </button>
        </form>

        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-6">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <Link
            href={isSignUp ? '/sign-in' : '/sign-up'}
            className="text-blue-500 hover:underline font-medium"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </Link>
        </p>
      </div>
    </main>
  )
}
