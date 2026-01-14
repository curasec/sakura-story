'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface MatchResult {
  pair: { a: string; b: string }
  score: number
  level: string
  one_liner: string
  relationship_type: string
  attraction: string[]
  advantages: string[]
  risks: string[]
  triggers: Array<{
    topic: string
    pattern: string
    repair: string
  }>
  rules: {
    do: string[]
    dont: string[]
  }
  explain: {
    element: string
    modality: string
    geometry: string
  }
}

const SIGN_NAMES: Record<string, string> = {
  'Aries': '白羊座', 'Taurus': '金牛座', 'Gemini': '双子座',
  'Cancer': '巨蟹座', 'Leo': '狮子座', 'Virgo': '处女座',
  'Libra': '天秤座', 'Scorpio': '天蝎座', 'Sagittarius': '射手座',
  'Capricorn': '摩羯座', 'Aquarius': '水瓶座', 'Pisces': '双鱼座'
}

const LEVEL_COLORS: Record<string, string> = {
  'HIGH': '#4caf50',
  'MID': '#ff9800',
  'LOW': '#f44336'
}

const TYPE_LABELS: Record<string, string> = {
  'LongTerm': '长期稳定',
  'HighChemistryHighFriction': '激情与摩擦并存',
  'ComfortableButStale': '舒适但缺乏激情',
  'NeedsWork': '需要努力经营'
}

export default function MatchPage() {
  const router = useRouter()
  const params = useParams()
  const [data, setData] = useState<MatchResult | null>(null)
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
      {/* 1. one_liner */}
      <section className="section">
        <h2>{signA} & {signB}</h2>
        <p className="one-liner">{data.one_liner}</p>
      </section>

      {/* 2. level + score */}
      <section className="section">
        <div className="score-display">
          <span className="level" style={{ background: LEVEL_COLORS[data.level] }}>
            {data.level === 'HIGH' ? '高匹配' : data.level === 'MID' ? '中等匹配' : '低匹配'}
          </span>
          <span className="score">{data.score}分</span>
        </div>
      </section>

      {/* 3. relationship_type 标签 */}
      <section className="section">
        <span className="relationship-type">
          {TYPE_LABELS[data.relationship_type] || data.relationship_type}
        </span>
      </section>

      {/* 4. advantages */}
      <section className="section">
        <h3>优势</h3>
        <ul className="list">
          {data.advantages.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      {/* 5. risks */}
      <section className="section">
        <h3>风险</h3>
        <ul className="list">
          {data.risks.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      {/* 6. rules：do×3 / dont×3 */}
      <section className="section">
        <h3>相处建议</h3>
        <div className="rules">
          <div className="rule-group do">
            <h4>要做</h4>
            <ul className="list">
              {data.rules.do.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rule-group dont">
            <h4>不要做</h4>
            <ul className="list">
              {data.rules.dont.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7. 入口：进入 7 日关系日历 */}
      <section className="section">
        <Link href={`/forecast/${data.pair.a}/${data.pair.b}?level=${data.level}&type=${data.relationship_type}`} className="cta-button">
          查看 7 日关系日历
        </Link>
      </section>

      <style jsx>{`
        h2 {
          font-size: 20px;
          text-align: center;
          margin-bottom: 16px;
        }

        .one-liner {
          font-size: 18px;
          text-align: center;
          line-height: 1.6;
          padding: 16px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .section {
          margin-bottom: 24px;
        }

        .score-display {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .level {
          padding: 8px 16px;
          color: white;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .score {
          font-size: 32px;
          font-weight: 600;
        }

        .relationship-type {
          display: block;
          text-align: center;
          padding: 12px;
          background: #e3f2fd;
          color: #1976d2;
          border-radius: 8px;
          font-weight: 500;
        }

        h3 {
          font-size: 18px;
          margin-bottom: 12px;
        }

        .list {
          list-style: none;
          padding: 16px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .list li {
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
          line-height: 1.6;
        }

        .list li:last-child {
          border-bottom: none;
        }

        .rules {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rule-group h4 {
          font-size: 16px;
          margin-bottom: 8px;
        }

        .rule-group.do h4 {
          color: #4caf50;
        }

        .rule-group.dont h4 {
          color: #f44336;
        }

        .cta-button {
          display: block;
          text-align: center;
          padding: 16px;
          background: #e91e63;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
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
