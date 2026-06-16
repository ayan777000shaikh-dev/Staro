import { pgTable, text, timestamp, boolean, serial, integer } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Add your app tables below. Always include a plain `userId` column so queries
// can be scoped per user — the security model depends on this column existing,
// not on a foreign key. Do NOT add a foreign key constraint
// (`.references(() => user.id, ...)`) unless the user explicitly asks for
// foreign keys or referential integrity; FK constraints make iterating on the
// schema harder.
//
// Example:
//
// import { serial } from "drizzle-orm/pg-core"
//
// export const todos = pgTable("todos", {
//   id: serial("id").primaryKey(),
//   userId: text("userId").notNull(),
//   title: text("title").notNull(),
//   completed: boolean("completed").notNull().default(false),
//   createdAt: timestamp("createdAt").notNull().defaultNow(),
// })
//
// --- App tables - STARO ---------------------------------------------------

// Posts/Feed
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  content: text('content').notNull(),
  image: text('image'),
  likes: integer('likes').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Videos (full-length and shorts)
export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  videoUrl: text('videoUrl').notNull(),
  thumbnail: text('thumbnail'),
  duration: integer('duration').notNull(), // in seconds
  views: integer('views').notNull().default(0),
  isShort: boolean('isShort').notNull().default(false), // true for shorts (<60s), false for videos
  category: text('category').notNull(), // 'founder-talks', 'pitch-reels', 'demos', 'engineering'
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Comments
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  postId: integer('postId').notNull(),
  content: text('content').notNull(),
  likes: integer('likes').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Likes (for posts and videos)
export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  postId: integer('postId'),
  videoId: integer('videoId'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Follows
export const follows = pgTable('follows', {
  id: serial('id').primaryKey(),
  followerId: text('followerId').notNull(),
  followingId: text('followingId').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Direct Messages
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  senderId: text('senderId').notNull(),
  recipientId: text('recipientId').notNull(),
  content: text('content').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Startups
export const startups = pgTable('startups', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  logo: text('logo'),
  website: text('website'),
  category: text('category'), // 'AI', 'SaaS', 'Fintech', etc
  stage: text('stage'), // 'Idea', 'MVP', 'Launched', 'Scaling'
  funding: text('funding'), // funding amount
  teamSize: integer('teamSize'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Jobs
export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  startupId: integer('startupId').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  jobType: text('jobType'), // 'Full Time', 'Part Time', 'Contract', 'Internship'
  location: text('location'),
  salary: text('salary'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Job Applications
export const jobApplications = pgTable('jobApplications', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  jobId: integer('jobId').notNull(),
  status: text('status').notNull().default('pending'), // pending, accepted, rejected
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Stories (24-hour ephemeral content)
export const stories = pgTable('stories', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  content: text('content').notNull(),
  image: text('image'),
  expiresAt: timestamp('expiresAt').notNull(), // 24 hours from creation
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// STARO Pulse (shipping tracker)
export const pulseLogs = pgTable('pulseLogs', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  currentStreak: integer('currentStreak').notNull().default(0),
  longestStreak: integer('longestStreak').notNull().default(0),
  weeklyActivity: integer('weeklyActivity').notNull().default(0),
  shippingScore: integer('shippingScore').notNull().default(0),
  lastShipDate: timestamp('lastShipDate'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// User Connections (co-founder matching)
export const connections = pgTable('connections', {
  id: serial('id').primaryKey(),
  fromUserId: text('fromUserId').notNull(),
  toUserId: text('toUserId').notNull(),
  status: text('status').notNull().default('pending'), // pending, accepted, rejected
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// User Profiles (extended user data)
export const userProfiles = pgTable('userProfiles', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  bio: text('bio'),
  role: text('role'), // 'Founder', 'Engineer', 'Designer', etc
  skills: text('skills'), // comma-separated
  location: text('location'),
  website: text('website'),
  followers: integer('followers').notNull().default(0),
  following: integer('following').notNull().default(0),
  postsCount: integer('postsCount').notNull().default(0),
  shippedCount: integer('shippedCount').notNull().default(0),
  badge: text('badge'), // 'Builder', 'AI Expert', etc
  reputation: integer('reputation').notNull().default(0),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
