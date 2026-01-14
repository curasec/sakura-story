import { NextRequest, NextResponse } from 'next/server'
import { generateForecast } from '@/lib/forecast'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const a = searchParams.get('a')
  const b = searchParams.get('b')
  const start = searchParams.get('start') || new Date().toISOString().split('T')[0]
  const days = parseInt(searchParams.get('days') || '7', 10)

  if (!a || !b) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  // 首先需要从 match API 获取配对结果来获取 level 和 relationship_type
  // 但为了避免循环依赖，我们重新计算或传递参数
  // 这里简化处理，直接使用 forecast 函数需要 level 和 relationship_type
  // 由于 forecast 需要 level 和 relationship_type，我们需要先获取这些值

  // 临时方案：从 URL 参数获取 level 和 relationship_type
  const level = searchParams.get('level') as any
  const relationshipType = searchParams.get('relationship_type') as any

  if (!level || !relationshipType) {
    return NextResponse.json(
      { error: 'Missing level or relationship_type' },
      { status: 400 }
    )
  }

  const result = generateForecast(a, b, start, level, relationshipType, days)

  return NextResponse.json(result)
}
