import { NextRequest, NextResponse } from 'next/server'
import { calculateCompatibility } from '@/lib/compatibility'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const a = searchParams.get('a')
  const b = searchParams.get('b')

  if (!a || !b) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const result = calculateCompatibility(a, b)

  if (!result) {
    return NextResponse.json({ error: 'Invalid signs' }, { status: 400 })
  }

  return NextResponse.json(result)
}
