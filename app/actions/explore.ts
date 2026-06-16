'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { startups, jobs, jobApplications } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createStartup(
  name: string,
  description: string,
  category: string,
  stage: string
) {
  const userId = await getUserId()
  const startup = await db
    .insert(startups)
    .values({
      userId,
      name,
      description,
      category,
      stage,
    })
    .returning()
  revalidatePath('/explore')
  return startup[0]
}

export async function getStartups(category?: string, stage?: string, limit: number = 20) {
  let query = db.select().from(startups)

  if (category) {
    query = query.where(eq(startups.category, category))
  }
  if (stage) {
    query = query.where(eq(startups.stage, stage))
  }

  const startupsList = await query
    .orderBy(desc(startups.createdAt))
    .limit(limit)

  return startupsList
}

export async function getStartup(startupId: number) {
  return db.query.startups.findFirst({
    where: eq(startups.id, startupId),
  })
}

export async function createJob(
  startupId: number,
  title: string,
  description: string,
  jobType: string,
  location: string,
  salary?: string
) {
  const userId = await getUserId()
  const job = await db
    .insert(jobs)
    .values({
      userId,
      startupId,
      title,
      description,
      jobType,
      location,
      salary,
    })
    .returning()
  revalidatePath('/explore')
  return job[0]
}

export async function getJobs(startupId?: number, jobType?: string, limit: number = 20) {
  let query = db.select().from(jobs)

  if (startupId) {
    query = query.where(eq(jobs.startupId, startupId))
  }
  if (jobType) {
    query = query.where(eq(jobs.jobType, jobType))
  }

  const jobsList = await query
    .orderBy(desc(jobs.createdAt))
    .limit(limit)

  return jobsList
}

export async function applyForJob(jobId: number) {
  const userId = await getUserId()
  
  const existingApp = await db
    .select()
    .from(jobApplications)
    .where(and(eq(jobApplications.jobId, jobId), eq(jobApplications.userId, userId)))

  if (existingApp.length > 0) {
    return { success: false, message: 'Already applied' }
  }

  const application = await db
    .insert(jobApplications)
    .values({
      userId,
      jobId,
      status: 'pending',
    })
    .returning()

  revalidatePath('/explore')
  return { success: true, application: application[0] }
}

export async function getJobApplications(jobId: number) {
  return db.query.jobApplications.findMany({
    where: eq(jobApplications.jobId, jobId),
  })
}

export async function updateApplicationStatus(applicationId: number, status: string) {
  const userId = await getUserId()
  
  // Verify user owns the job
  const app = await db.query.jobApplications.findFirst({
    where: eq(jobApplications.id, applicationId),
  })

  if (!app) return { success: false, message: 'Application not found' }

  const job = await db.query.jobs.findFirst({
    where: eq(jobs.id, app.jobId),
  })

  if (job?.userId !== userId) {
    return { success: false, message: 'Unauthorized' }
  }

  await db
    .update(jobApplications)
    .set({ status })
    .where(eq(jobApplications.id, applicationId))

  revalidatePath('/explore')
  return { success: true }
}
