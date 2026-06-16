// Server action error handling wrapper
export async function withServerAction<T>(
  handler: () => Promise<T>,
  context?: { action: string }
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const data = await handler()
    return { success: true, data }
  } catch (error: any) {
    console.error(`[v0] Server Action Error (${context?.action || 'unknown'}):`, error)
    return {
      success: false,
      error: error?.message || 'An error occurred',
    }
  }
}

// Rate limiting helper
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(key: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count < limit) {
    record.count++
    return true
  }

  return false
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .slice(0, 5000)
}

// UUID validation
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}
