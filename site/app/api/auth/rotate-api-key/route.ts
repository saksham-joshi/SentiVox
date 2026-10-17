import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { rotateApiKey as dbRotateApiKey } from '@/db/pg'
import { rotateApiKey as redisRotateApiKey } from '@/api/redis-interface/redis'

export async function POST() {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await dbRotateApiKey(session.email)

  if (
    result.ok &&
    (await redisRotateApiKey(result.oldApiKey, result.newApiKey))
  ) {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json(
    { error: result.ok ? 'Failed to rotate API key' : result.msg },
    { status: 409 }
  )
}
