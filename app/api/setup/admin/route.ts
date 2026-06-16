import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(user)
      .where(eq(user.email, 'ayan07@staro.app'))
      .limit(1)

    if (existingAdmin.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Admin user already exists' },
        { status: 400 }
      )
    }

    // Create admin user using Better Auth API
    const result = await auth.api.signUpEmail(
      {
        email: 'ayan07@staro.app',
        password: '12345678',
        name: 'Admin Ayan',
      },
      {
        headers: request.headers,
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully with email: ayan07@staro.app and password: 12345678',
    })
  } catch (error) {
    console.error('[v0] Admin setup error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create admin user', error: String(error) },
      { status: 500 }
    )
  }
}
