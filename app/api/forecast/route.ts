import { NextRequest, NextResponse } from 'next/server'
import { generateForecast } from '@/lib/forecast'
import { generateRelationshipManual } from '@/lib/compatibility'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const a = searchParams.get('a')
  const b = searchParams.get('b')
  const start = searchParams.get('start') || new Date().toISOString().split('T')[0]
  const days = parseInt(searchParams.get('days') || '7', 10)

  if (!a || !b) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  // 先获取关系说明书以获取 complexity_level 和 relationship_structure
  const manual = generateRelationshipManual(a, b)
  if (!manual) {
    return NextResponse.json({ error: 'Invalid signs' }, { status: 400 })
  }

  const result = generateForecast(
    a,
    b,
    start,
    manual.complexity_level,
    manual.relationship_structure,
    days
  )

  return NextResponse.json(result)
}
