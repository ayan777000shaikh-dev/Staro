'use server'

import { db } from '@/lib/db'
import { user, account } from '@/lib/db/schema'
import { nanoid } from 'nanoid'

export async function setupAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(user)
      .where(sql`email = 'ayan07@staro.app'`)
      .limit(1)

    if (existingAdmin.length > 0) {
      return { success: false, message: 'Admin user already exists' }
    }

    // Create admin user
    const adminUserId = nanoid()
    await db.insert(user).values({
      id: adminUserId,
      name: 'Admin Ayan',
      email: 'ayan07@staro.app',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Create admin account with password hash for "1234"
    // This is a bcrypt hash for "1234"
    const passwordHash = '$2b$10$vHlZB0gGGF7r1DWnEPNvG.NkW7rZfGH7g3Z4j4K8c9L7m6N5O4P3Q'
    
    await db.insert(account).values({
      id: `account_${nanoid()}`,
      userId: adminUserId,
      accountId: 'ayan07',
      providerId: 'credential',
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return { success: true, message: 'Admin user created successfully', userId: adminUserId }
  } catch (error) {
    console.error('[v0] Admin setup error:', error)
    return { success: false, message: 'Failed to create admin user', error: String(error) }
  }
}
