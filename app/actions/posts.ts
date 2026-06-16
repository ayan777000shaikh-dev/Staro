'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { posts, likes, comments, userProfiles } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createPost(content: string, image?: string) {
  const userId = await getUserId()
  const post = await db
    .insert(posts)
    .values({ userId, content, image })
    .returning()
  revalidatePath('/')
  return post[0]
}

export async function getPosts(limit: number = 20, offset: number = 0) {
  const postsData = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset)

  // Get post author info
  const postsWithAuth = await Promise.all(
    postsData.map(async (post) => {
      const author = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, post.userId),
      })
      const postLikes = await db
        .select()
        .from(likes)
        .where(eq(likes.postId, post.id))
      const postComments = await db
        .select()
        .from(comments)
        .where(eq(comments.postId, post.id))
      return { ...post, author, likeCount: postLikes.length, commentCount: postComments.length }
    })
  )
  return postsWithAuth
}

export async function deletePost(postId: number) {
  const userId = await getUserId()
  await db.delete(posts).where(and(eq(posts.id, postId), eq(posts.userId, userId)))
  revalidatePath('/')
}

export async function likePost(postId: number) {
  const userId = await getUserId()
  const existingLike = await db
    .select()
    .from(likes)
    .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))

  if (existingLike.length > 0) {
    // Unlike
    await db
      .delete(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
  } else {
    // Like
    await db.insert(likes).values({ userId, postId })
  }
  revalidatePath('/')
}

export async function addComment(postId: number, content: string) {
  const userId = await getUserId()
  const comment = await db
    .insert(comments)
    .values({ userId, postId, content })
    .returning()
  revalidatePath('/')
  return comment[0]
}

export async function getComments(postId: number) {
  const postComments = await db
    .select()
    .from(comments)
    .where(eq(comments.postId, postId))
    .orderBy(desc(comments.createdAt))

  const commentsWithAuth = await Promise.all(
    postComments.map(async (comment) => {
      const author = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, comment.userId),
      })
      return { ...comment, author }
    })
  )
  return commentsWithAuth
}
