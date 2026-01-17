'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import { useLocale } from '@/lib/i18n'
import { getSignName, type SignCode } from '@/lib/signs'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

interface ConflictLoop {
  name: string
  trigger: string
  pattern: string
  break_rule: string
}

interface InteractionRules {
  do: string[]
  dont: string[]
}

interface StructureExplain {
  element_relation: string
  modality_relation: string
  geometry_relation: string
}

interface RelationshipManual {
  pair: { a: string; b: string }
  complexity_level: string
  one_liner: string
  relationship_structure: string
  core_tension: string
  advantages: string[]
  risks: string[]
  conflict_loops: ConflictLoop[]
  interaction_rules: InteractionRules
  structure_explain: StructureExplain
}

// 复杂度配置
const getComplexityConfig = (level: string, t: any) => {
  const map: Record<string, any> = {
    'LOW': {
      label: t.complexity.LOW,
      color: 'text-sage-600',
      bg: 'bg-sage-100',
      icon: '😊'
    },
    'MID': {
      label: t.complexity.MID,
      color: 'text-gold-600',
      bg: 'bg-gold-100',
      icon: '⚖️'
    },
    'HIGH': {
      label: t.complexity.HIGH,
      color: 'text-red-600',
      bg: 'bg-red-100',
      icon: '💪'
    },
  }
  return map[level] || map['MID']
}

// 关系类型配置
const getStructureConfig = (structure: string, t: any) => {
  const map: Record<string, any> = {
    'LongTermStable': {
      label: t.structure.LongTermStable,
      icon: '🏠',
      color: 'bg-sage-100 text-sage-700'
    },
    'HighChemistryHighFriction': {
      label: t.structure.HighChemistryHighFriction,
      icon: '🔥',
      color: 'bg-red-100 text-red-700'
    },
    'ComfortableButStale': {
      label: t.structure.ComfortableButStale,
      icon: '☕',
      color: 'bg-gray-100 text-gray-700'
    },
    'NeedsActiveAdjustment': {
      label: t.structure.NeedsActiveAdjustment,
      icon: '🔄',
      color: 'bg-gold-100 text-gold-700'
    },
  }
  return map[structure] || { label: structure, icon: '💫', color: 'bg-primary-50 text-primary-700' }
}

export default function MatchPage() {
  const router = useRouter()
  const params = useParams()
  const { locale } = useLocale()
  const { common, match } = useTranslation()
  const [data, setData] = useState<RelationshipManual | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const a = params.a
      const b = params.b
      const response = await fetch(`/api/match?a=${a}&b=${b}`)
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
  const complexityConfig = getComplexityConfig(data.complexity_level, match)
  const structureConfig = getStructureConfig(data.relationship_structure, match)

  return (
    <div className="min-h-screen bg-sakura-50 pb-20">
      {/* 导航栏 */}
      <nav className="fixed top-4 left-4 right-4 z-50 bg-white/90 backdrop-blur-md rounded-2xl shadow-soft border border-primary-100">
        <div className="container-custom py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
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
          <div className="w-20" />
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
            <p className="font-script text-2xl text-primary-600">{data.one_liner}</p>
          </div>

          {/* 复杂度标签 */}
          <div className="flex justify-center mb-8">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${complexityConfig.bg}`}>
              <span className="text-2xl">{complexityConfig.icon}</span>
              <span className={`font-semibold ${complexityConfig.color}`}>
                {complexityConfig.label}
              </span>
            </div>
          </div>

          {/* 关系类型卡片 */}
          <div className={`bg-white rounded-2xl p-6 shadow-soft border border-primary-100 mb-6 ${structureConfig.color}`}>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">{structureConfig.icon}</span>
              <span className="font-display font-bold text-xl">{structureConfig.label}</span>
            </div>
          </div>

          {/* 核心张力 */}
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-primary-100 mb-6">
            <h3 className="font-display font-semibold text-lg mb-4 text-gray-900">{match.coreTension}</h3>
            <p className="text-gray-700 leading-relaxed">{data.core_tension}</p>
          </div>

          {/* 优势与风险 */}
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            {/* 优势 */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-primary-100">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-display font-semibold text-lg text-gray-900">{match.advantages}</h3>
              </div>
              <ul className="space-y-3">
                {data.advantages.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 风险 */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-primary-100">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="font-display font-semibold text-lg text-gray-900">{match.risks}</h3>
              </div>
              <ul className="space-y-3">
                {data.risks.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8 8.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 冲突循环 */}
          {data.conflict_loops.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-primary-100 mb-6">
              <h3 className="font-display font-semibold text-lg mb-6 text-gray-900">{match.conflictLoops}</h3>
              <div className="space-y-6">
                {data.conflict_loops.map((loop, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">{loop.name}</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium text-gray-600">{match.trigger}：</span>
                        <span className="text-gray-700">{loop.trigger}</span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">{match.pattern}：</span>
                        <span className="text-gray-700">{loop.pattern}</span>
                      </p>
                      <p>
                        <span className="font-medium text-sage-600">{match.breakRule}：</span>
                        <span className="text-sage-700 font-medium">{loop.break_rule}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 相处建议 */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {/* 要做 */}
            <div className="bg-sage-50 rounded-2xl p-6 shadow-soft border border-sage-200">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-display font-semibold text-lg text-sage-800">{match.do}</h3>
              </div>
              <ul className="space-y-3">
                {data.interaction_rules.do.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 不要做 */}
            <div className="bg-red-50 rounded-2xl p-6 shadow-soft border border-red-200">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 18.364m0 0L12 21m0 0L5.636 5.636m12.728 12.728L5.636 18.364" />
                </svg>
                <h3 className="font-display font-semibold text-lg text-red-800">{match.dont}</h3>
              </div>
              <ul className="space-y-3">
                {data.interaction_rules.dont.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8 8.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA 按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/forecast/${data.pair.a}/${data.pair.b}`}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all cursor-pointer touch-target shadow-soft hover:shadow-soft-lg"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{match.viewCalendar}</span>
            </Link>
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-3 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors cursor-pointer touch-target shadow-soft border border-gray-200"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>{match.newMatch}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
