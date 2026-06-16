'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { messages, userProfiles } from '@/lib/db/schema'
import { and, desc, eq, or } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function sendMessage(recipientId: string, content: string) {
  const userId = await getUserId()
  const message = await db
    .insert(messages)
    .values({ senderId: userId, recipientId, content })
    .returning()
  revalidatePath(`/messages/${recipientId}`)
  return message[0]
}

export async function getConversation(otherUserId: string) {
  const userId = await getUserId()
  const conversation = await db
    .select()
    .from(messages)
    .where(
      or(
        and(eq(messages.senderId, userId), eq(messages.recipientId, otherUserId)),
        and(eq(messages.senderId, otherUserId), eq(messages.recipientId, userId))
      )
    )
    .orderBy(desc(messages.createdAt))

  // Fetch sender and recipient info for each message
  const messagesWithAuth = await Promise.all(
    conversation.map(async (msg) => {
      const sender = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, msg.senderId),
      })
      const recipient = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, msg.recipientId),
      })
      return { ...msg, sender, recipient }
    })
  )
  return messagesWithAuth.reverse()
}

export async function getInbox() {
  const userId = await getUserId()
  
  // Get all unique conversations
  const allMessages = await db
    .select()
    .from(messages)
    .where(or(eq(messages.senderId, userId), eq(messages.recipientId, userId)))
    .orderBy(desc(messages.createdAt))

  // Group by conversation and get latest message
  const conversationsMap = new Map()
  for (const msg of allMessages) {
    const otherUserId = msg.senderId === userId ? msg.recipientId : msg.senderId
    if (!conversationsMap.has(otherUserId)) {
      conversationsMap.set(otherUserId, msg)
    }
  }

  const conversations = await Promise.all(
    Array.from(conversationsMap.entries()).map(async ([otherUserId, lastMsg]) => {
      const profile = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, otherUserId),
      })
      const unreadCount = (
        await db
          .select()
          .from(messages)
          .where(
            and(
              eq(messages.senderId, otherUserId),
              eq(messages.recipientId, userId),
              eq(messages.read, false)
            )
          )
      ).length
      return { otherUserId, profile, lastMessage: lastMsg, unreadCount }
    })
  )

  return conversations.sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime())
}

export async function markMessageAsRead(messageId: number) {
  const userId = await getUserId()
  const msg = await db.query.messages.findFirst({
    where: eq(messages.id, messageId),
  })
  if (msg && msg.recipientId === userId) {
    await db.update(messages).set({ read: true }).where(eq(messages.id, messageId))
  }
}

export async function getUnreadCount() {
  const userId = await getUserId()
  const unread = await db
    .select()
    .from(messages)
    .where(and(eq(messages.recipientId, userId), eq(messages.read, false)))
  return unread.length
}
