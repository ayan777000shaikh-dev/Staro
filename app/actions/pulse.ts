'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pulseLogs } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function logShip() {
  const userId = await getUserId()
  
  const existingPulse = await db
    .select()
    .from(pulseLogs)
    .where(eq(pulseLogs.userId, userId))

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (existingPulse.length === 0) {
    // Create new pulse log
    await db.insert(pulseLogs).values({
      userId,
      currentStreak: 1,
      longestStreak: 1,
      weeklyActivity: 1,
      shippingScore: 100,
      lastShipDate: new Date(),
    })
  } else {
    const pulse = existingPulse[0]
    const lastShip = pulse.lastShipDate ? new Date(pulse.lastShipDate) : null
    lastShip?.setHours(0, 0, 0, 0)

    let newStreak = pulse.currentStreak
    let newLongestStreak = pulse.longestStreak

    if (!lastShip || lastShip.getTime() !== today.getTime()) {
      // New day, increment streak
      if (lastShip && lastShip.getTime() === new Date(today.getTime() - 86400000).getTime()) {
        // Consecutive day
        newStreak = pulse.currentStreak + 1
      } else {
        // Streak broken
        newStreak = 1
      }

      if (newStreak > newLongestStreak) {
        newLongestStreak = newStreak
      }
    }

    await db
      .update(pulseLogs)
      .set({
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        weeklyActivity: pulse.weeklyActivity + 1,
        shippingScore: Math.min(pulse.shippingScore + 10, 1000),
        lastShipDate: new Date(),
      })
      .where(eq(pulseLogs.userId, userId))
  }

  revalidatePath('/')
  return { success: true }
}

export async function getPulse() {
  const userId = await getUserId()
  const pulse = await db
    .select()
    .from(pulseLogs)
    .where(eq(pulseLogs.userId, userId))

  if (pulse.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      weeklyActivity: 0,
      shippingScore: 0,
      lastShipDate: null,
    }
  }

  return pulse[0]
}

export async function getTopShippers(limit: number = 10) {
  const topShippers = await db
    .select()
    .from(pulseLogs)
    .orderBy(desc(pulseLogs.shippingScore))
    .limit(limit)

  return topShippers
}
