import { z } from 'zod'

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  code?: string
  timestamp: number
}

// Error handler
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  error?: string,
  code?: string
): ApiResponse<T> {
  return {
    success,
    data,
    error,
    code,
    timestamp: Date.now(),
  }
}

// Validation schemas
export const PostValidation = z.object({
  content: z.string().min(1, 'Post content required').max(5000, 'Post too long'),
})

export const UserValidation = z.object({
  name: z.string().min(1, 'Name required').max(100),
  email: z.string().email('Invalid email'),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  skills: z.string().max(500).optional(),
})

export const StartupValidation = z.object({
  name: z.string().min(1, 'Name required').max(200),
  description: z.string().min(10, 'Description too short').max(2000),
  category: z.string().min(1, 'Category required'),
  website: z.string().url().optional().or(z.literal('')),
})

export const MessageValidation = z.object({
  content: z.string().min(1, 'Message required').max(5000),
  recipientId: z.string().uuid('Invalid recipient'),
})

export const CommentValidation = z.object({
  content: z.string().min(1, 'Comment required').max(2000),
  postId: z.string().uuid('Invalid post'),
})

// Error class for consistent error handling
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Async wrapper for route handlers
export async function withErrorHandling<T>(
  handler: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await handler()
    return createApiResponse(true, data)
  } catch (error: any) {
    console.error('[v0] API Error:', error)

    if (error instanceof z.ZodError) {
      return createApiResponse(
        false,
        undefined,
        'Validation error',
        'VALIDATION_ERROR'
      )
    }

    if (error instanceof ApiError) {
      return createApiResponse(
        false,
        undefined,
        error.message,
        error.code
      )
    }

    return createApiResponse(
      false,
      undefined,
      'Internal server error',
      'INTERNAL_ERROR'
    )
  }
}

// Validation helper
export function validateData<T>(schema: z.Schema<T>, data: unknown): { valid: boolean; data?: T; errors?: any } {
  try {
    const validated = schema.parse(data)
    return { valid: true, data: validated }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { valid: false, errors: error.errors }
    }
    return { valid: false, errors: [{ message: 'Validation failed' }] }
  }
}
