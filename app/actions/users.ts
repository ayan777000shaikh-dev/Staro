'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { follows, userProfiles, user } from '@/lib/db/schema'
import { and, eq, or } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createOrUpdateProfile(
  bio: string,
  role: string,
  skills: string,
  location: string,
  website: string
) {
  const userId = await getUserId()
  
  const existingProfile = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))

  if (existingProfile.length > 0) {
    await db
      .update(userProfiles)
      .set({ bio, role, skills, location, website, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
  } else {
    await db
      .insert(userProfiles)
      .values({ userId, bio, role, skills, location, website })
  }
  
  revalidatePath('/profile')
  return { success: true }
}

export async function getProfile(userId: string) {
  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, userId),
  })
  const userData = await db.query.user.findFirst({
    where: eq(user.id, userId),
  })
  return { profile, userData }
}

export async function getCurrentUserProfile() {
  const userId = await getUserId()
  return getProfile(userId)
}

export async function followUser(targetUserId: string) {
  const userId = await getUserId()
  
  const existingFollow = await db
    .select()
    .from(follows)
    .where(and(eq(follows.followerId, userId), eq(follows.followingId, targetUserId)))

  if (existingFollow.length > 0) {
    // Unfollow
    await db
      .delete(follows)
      .where(and(eq(follows.followerId, userId), eq(follows.followingId, targetUserId)))
  } else {
    // Follow
    await db.insert(follows).values({ followerId: userId, followingId: targetUserId })
  }

  // Update follower/following counts
  const targetFollowers = await db
    .select()
    .from(follows)
    .where(eq(follows.followingId, targetUserId))
  const userFollowing = await db
    .select()
    .from(follows)
    .where(eq(follows.followerId, userId))

  await db
    .update(userProfiles)
    .set({ followers: targetFollowers.length })
    .where(eq(userProfiles.userId, targetUserId))

  await db
    .update(userProfiles)
    .set({ following: userFollowing.length })
    .where(eq(userProfiles.userId, userId))

  revalidatePath('/network')
}

export async function getFollowers(userId: string) {
  const followersList = await db
    .select()
    .from(follows)
    .where(eq(follows.followingId, userId))

  const followers = await Promise.all(
    followersList.map(async (follow) => {
      const profile = await getProfile(follow.followerId)
      return profile
    })
  )
  return followers
}

export async function getFollowing(userId: string) {
  const followingList = await db
    .select()
    .from(follows)
    .where(eq(follows.followerId, userId))

  const following = await Promise.all(
    followingList.map(async (follow) => {
      const profile = await getProfile(follow.followingId)
      return profile
    })
  )
  return following
}

export async function isFollowing(targetUserId: string) {
  const userId = await getUserId()
  const follow = await db
    .select()
    .from(follows)
    .where(and(eq(follows.followerId, userId), eq(follows.followingId, targetUserId)))
  return follow.length > 0
}

export async function getFollowerCount(userId: string) {
  const followers = await db
    .select()
    .from(follows)
    .where(eq(follows.followingId, userId))
  return followers.length
}

export async function getFollowingCount(userId: string) {
  const following = await db
    .select()
    .from(follows)
    .where(eq(follows.followerId, userId))
  return following.length
}

export async function searchUsers(query: string, limit: number = 20) {
  const results = await db.query.userProfiles.findMany({
    where: (profile) =>
      or(
        profile.bio?.includes(query),
        profile.role?.includes(query)
      ),
    limit,
  })
  return results
}
