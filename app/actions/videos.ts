'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { videos, likes, comments, userProfiles } from '@/lib/db/schema'
import { and, desc, eq, or } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createVideo(
  title: string,
  description: string,
  videoUrl: string,
  thumbnail: string,
  duration: number,
  isShort: boolean,
  category: string
) {
  const userId = await getUserId()
  const video = await db
    .insert(videos)
    .values({
      userId,
      title,
      description,
      videoUrl,
      thumbnail,
      duration,
      isShort,
      category,
    })
    .returning()
  revalidatePath('/watch')
  return video[0]
}

export async function getVideos(isShort?: boolean, category?: string, limit: number = 20, offset: number = 0) {
  let query = db.select().from(videos)

  if (isShort !== undefined) {
    query = query.where(eq(videos.isShort, isShort))
  }
  if (category) {
    query = query.where(eq(videos.category, category))
  }

  const videosData = await query
    .orderBy(desc(videos.createdAt))
    .limit(limit)
    .offset(offset)

  const videosWithAuth = await Promise.all(
    videosData.map(async (video) => {
      const author = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, video.userId),
      })
      const videoLikes = await db
        .select()
        .from(likes)
        .where(eq(likes.videoId, video.id))
      const videoComments = await db
        .select()
        .from(comments)
        .where(eq(comments.videoId, video.id))
      return { 
        ...video, 
        author, 
        likeCount: videoLikes.length, 
        commentCount: videoComments.length,
        liked: false
      }
    })
  )
  return videosWithAuth
}

export async function getVideosByCategory(category: string) {
  return getVideos(undefined, category)
}

export async function getShorts(limit: number = 20, offset: number = 0) {
  return getVideos(true, undefined, limit, offset)
}

export async function getFullLengthVideos(limit: number = 20, offset: number = 0) {
  return getVideos(false, undefined, limit, offset)
}

export async function incrementVideoViews(videoId: number) {
  const video = await db.query.videos.findFirst({
    where: eq(videos.id, videoId),
  })
  if (video) {
    await db
      .update(videos)
      .set({ views: video.views + 1 })
      .where(eq(videos.id, videoId))
  }
}

export async function likeVideo(videoId: number) {
  const userId = await getUserId()
  const existingLike = await db
    .select()
    .from(likes)
    .where(and(eq(likes.videoId, videoId), eq(likes.userId, userId)))

  if (existingLike.length > 0) {
    await db
      .delete(likes)
      .where(and(eq(likes.videoId, videoId), eq(likes.userId, userId)))
  } else {
    await db.insert(likes).values({ userId, videoId })
  }
  revalidatePath('/watch')
}

export async function addVideoComment(videoId: number, content: string) {
  const userId = await getUserId()
  const comment = await db
    .insert(comments)
    .values({ userId, postId: videoId, content })
    .returning()
  revalidatePath('/watch')
  return comment[0]
}

export async function deleteVideo(videoId: number) {
  const userId = await getUserId()
  await db.delete(videos).where(and(eq(videos.id, videoId), eq(videos.userId, userId)))
  revalidatePath('/watch')
}
