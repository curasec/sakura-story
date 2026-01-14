'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'

interface ForecastDay {
  date: string
  tone: string
  focus: string
  warning_or_window: string
  action: string
}

interface ForecastResult {
  pair: { a: string; b: string }
  days: ForecastDay[]
}

const SIGN_NAMES: Record<string, string> = {
  'Aries': '白羊座', 'Taurus': '金牛座', 'Gemini': '双子座',
  'Cancer': '巨蟹座', 'Leo': '狮子座', 'Virgo': '处女座',
  'Libra': '天秤座', 'Scorpio': '天蝎座', 'Sagittarius': '射手座',
  'Capricorn': '摩羯座', 'Aquarius': '水瓶座', 'Pisces': '双鱼座'
}

const TONE_LABELS: Record<string, string> = {
  'Smooth': '顺畅',
  'Tense': '紧张',
  'Misunderstanding': '误会',
  'Repair': '修复',
  'Passion': '激情'
}

const TONE_COLORS: Record<string, string> = {
  'Smooth': '#4caf50',
  'Tense': '#ff9800',
  'Misunderstanding': '#2196f3',
  'Repair': '#9c27b0',
  'Passion': '#e91e63'
}

const FOCUS_LABELS: Record<string, string> = {
  'communication': '沟通',
  'boundaries': '边界',
  'money': '金钱',
  'intimacy': '亲密',
  'plans': '计划',
  'social': '社交',
  'repair': '修复'
}

export default function ForecastPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [data, setData] = useState<ForecastResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const a = params.a
      const b = params.b
      const level = searchParams.get('level')
      const type = searchParams.get('type')
      const startDate = new Date().toISOString().split('T')[0]

      const response = await fetch(
        `/api/forecast?a=${a}&b=${b}&start=${startDate}&level=${level}&relationship_type=${type}`
      )
      const result = await response.json()
      setData(result)
      setLoading(false)
    }

    fetchData()
  }, [params.a, params.b, searchParams])

  if (loading) {
    return (
      <div className="container">
        <div className="loading">加载中...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container">
        <div className="error">未找到结果</div>
      </div>
    )
  }

  const signA = SIGN_NAMES[data.pair.a] || data.pair.a
  const signB = SIGN_NAMES[data.pair.b] || data.pair.b

  return (
    <div className="container">
      <h2>
        {signA} & {signB}
      </h2>
      <p className="subtitle">7 日关系日历</p>

      <div className="days-list">
        {data.days.map((day, i) => (
          <div key={i} className="day-card">
            <div className="day-header">
              <span className="day-date">{day.date}</span>
              <span
                className="day-tone"
                style={{ background: TONE_COLORS[day.tone] }}
              >
                {TONE_LABELS[day.tone] || day.tone}
              </span>
            </div>
            <div className="day-focus">
              <span className="focus-label">焦点：</span>
              <span>{FOCUS_LABELS[day.focus] || day.focus}</span>
            </div>
            <div className="day-action">{day.action}</div>
            {day.warning_or_window && (
              <div className="day-warning">{day.warning_or_window}</div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        h2 {
          font-size: 20px;
          text-align: center;
          margin-bottom: 8px;
        }

        .subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 24px;
        }

        .days-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .day-card {
          background: #fff;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .day-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .day-date {
          font-size: 16px;
          font-weight: 500;
        }

        .day-tone {
          padding: 4px 12px;
          color: white;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
        }

        .day-focus {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }

        .focus-label {
          font-weight: 500;
        }

        .day-action {
          font-size: 16px;
          line-height: 1.6;
          padding: 12px;
          background: #f5f5f5;
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .day-warning {
          font-size: 14px;
          color: #666;
          padding: 8px 12px;
          background: #fff3e0;
          border-radius: 8px;
          border-left: 3px solid #ff9800;
        }

        .loading, .error {
          text-align: center;
          padding: 40px;
          font-size: 16px;
        }

        .error {
          color: #f44336;
        }
      `}</style>
    </div>
  )
}
