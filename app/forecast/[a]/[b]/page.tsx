'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { useLocale } from '@/lib/i18n'
import { getSignName, type SignCode } from '@/lib/signs'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

interface ForecastDay {
  date: string
  tone: string
  focus: string
  window_or_risk: string
  action: string
}

interface ForecastResult {
  pair: { a: string; b: string }
  days: ForecastDay[]
}

// 氛围配置
const getToneConfig = (tone: string, t: any) => {
  const map: Record<string, any> = {
    'Smooth': {
      label: t.forecast.tone.Smooth,
      color: 'text-sage-600',
      bg: 'bg-sage-100',
      icon: '😊'
    },
    'Tense': {
      label: t.forecast.tone.Tense,
      color: 'text-gold-600',
      bg: 'bg-gold-100',
      icon: '😰'
    },
    'Misunderstanding': {
      label: t.forecast.tone.Misunderstanding,
      color: 'text-sky-600',
      bg: 'bg-sky-100',
      icon: '💭'
    },
    'Repair': {
      label: t.forecast.tone.Repair,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      icon: '🤝'
    },
    'Passion': {
      label: t.forecast.tone.Passion,
      color: 'text-red-600',
      bg: 'bg-red-100',
      icon: '❤️'
    },
  }
  return map[tone] || map['Smooth']
}

// 焦点配置
const getFocusConfig = (focus: string, t: any) => {
  const map: Record<string, any> = {
    'communication': {
      label: t.forecast.focusTypes.communication,
      icon: '💬'
    },
    'boundaries': {
      label: t.forecast.focusTypes.boundaries,
      icon: '🚧'
    },
    'money': {
      label: t.forecast.focusTypes.money,
      icon: '💰'
    },
    'intimacy': {
      label: t.forecast.focusTypes.intimacy,
      icon: '💕'
    },
    'plans': {
      label: t.forecast.focusTypes.plans,
      icon: '📋'
    },
    'social': {
      label: t.forecast.focusTypes.social,
      icon: '👥'
    },
    'repair': {
      label: t.forecast.focusTypes.repair,
      icon: '🔧'
    },
  }
  return map[focus] || { label: focus, icon: '📌' }
}

// 日期标签
const getDayLabel = (dateString: string, index: number, t: any, locale: string) => {
  const date = new Date(dateString)
  const today = new Date()
  const diffTime = date.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return t.forecast.today
  if (diffDays === 1) return t.forecast.tomorrow
  if (diffDays === 2) return t.forecast.dayAfterTomorrow
  return t.forecast.dayN.replace('{n}', String(index + 1))
}

export default function ForecastPage() {
  const router = useRouter()
  const params = useParams()
  const { locale } = useLocale()
  const { common, forecast } = useTranslation()
  const [data, setData] = useState<ForecastResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const a = params.a
      const b = params.b
      const startDate = new Date().toISOString().split('T')[0]

      const response = await fetch(
        `/api/forecast?a=${a}&b=${b}&start=${startDate}`
      )
      const result = await response.json()
      setData(result)
      setLoading(false)
    }

    fetchData()
  }, [params.a, params.b])

  if (loading) {
    return (
      <div className="min-h-screen bg-sakura-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-gray-600">{common.loading}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-sakura-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-soft">
          <p className="text-red-500">{common.notFound}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 w-full bg-primary-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors cursor-pointer"
          >
            {common.backToHome}
          </button>
        </div>
      </div>
    )
  }

  const signA = getSignName(data.pair.a as SignCode, locale)
  const signB = getSignName(data.pair.b as SignCode, locale)

  return (
    <div className="min-h-screen bg-sakura-50 pb-20">
      {/* 导航栏 */}
      <nav className="fixed top-4 left-4 right-4 z-50 bg-white/90 backdrop-blur-md rounded-2xl shadow-soft border border-primary-100">
        <div className="container-custom py-4 flex items-center justify-between">
          <button
            onClick={() => router.push(`/match/${data.pair.a}/${data.pair.b}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors cursor-pointer touch-target"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">{common.back}</span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer">
            <svg className="w-8 h-8 text-primary-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C12 2 8 5 8 8C8 9.5 8.5 10.5 9.5 11.5C9 12.5 9 13.5 9.5 14.5C8.5 15 8 16 8 17.5C8 21 12 22 12 22C12 22 16 21 16 17.5C16 16 15.5 15 14.5 14.5C15 13.5 15 12.5 14.5 11.5C15.5 10.5 16 9.5 16 8C16 5 12 2 12 2Z" />
            </svg>
            <span className="font-display font-bold text-xl text-primary-700">{common.brand}</span>
          </div>
          <LanguageSwitcher />
        </div>
      </nav>

      {/* 内容区域 */}
      <section className="pt-32 pb-20 px-4">
        <div className="container-custom max-w-3xl mx-auto">
          {/* 标题区域 */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              {signA} <span className="text-primary-500">×</span> {signB}
            </h1>
            <p className="font-script text-2xl text-primary-600">{forecast.title}</p>
          </div>

          {/* 日期卡片网格 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {data.days.map((day, i) => {
              const toneConfig = getToneConfig(day.tone, forecast)
              const focusConfig = getFocusConfig(day.focus, forecast)
              const dayLabel = getDayLabel(day.date, i, forecast, locale)

              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 shadow-soft border border-primary-100 hover:shadow-soft-lg transition-shadow duration-300 group"
                >
                  {/* 日期和状态 */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">{dayLabel}</div>
                      <div className="text-xs text-gray-400">{day.date}</div>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${toneConfig.bg}`}>
                      <span>{toneConfig.icon}</span>
                      <span className={`text-sm font-medium ${toneConfig.color}`}>
                        {toneConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* 焦点 */}
                  <div className="flex items-center gap-2 mb-3 bg-gray-50 rounded-xl px-3 py-2">
                    <span className="text-lg">{focusConfig.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">{forecast.focus}</div>
                      <div className="text-sm font-medium text-gray-800">{focusConfig.label}</div>
                    </div>
                  </div>

                  {/* 行动建议 */}
                  <div className="text-gray-700 text-sm leading-relaxed mb-3 p-3 bg-primary-50 rounded-xl border border-primary-100">
                    {day.action}
                  </div>

                  {/* 风险提示 */}
                  {day.window_or_risk && (
                    <div className="flex items-start gap-2 p-3 bg-gold-50 rounded-xl border-l-4 border-gold-400">
                      <svg className="w-5 h-5 text-gold-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div className="text-sm text-gold-800">{day.window_or_risk}</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* CTA 按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push(`/match/${data.pair.a}/${data.pair.b}`)}
              className="flex items-center justify-center gap-3 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors cursor-pointer touch-target shadow-soft border border-gray-200"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>{forecast.backToMatch}</span>
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all cursor-pointer touch-target shadow-soft hover:shadow-soft-lg"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 011-1h2a1 1 0 01-1 1h2a1 1 0 01-1 1h-3a1 1 0 01-1 1h-3" />
              </svg>
              <span>{forecast.newMatch}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
