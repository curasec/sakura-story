'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

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

const SIGN_NAMES: Record<string, string> = {
  'Aries': '白羊座', 'Taurus': '金牛座', 'Gemini': '双子座',
  'Cancer': '巨蟹座', 'Leo': '狮子座', 'Virgo': '处女座',
  'Libra': '天秤座', 'Scorpio': '天蝎座', 'Sagittarius': '射手座',
  'Capricorn': '摩羯座', 'Aquarius': '水瓶座', 'Pisces': '双鱼座'
}

const COMPLEXITY_LABELS: Record<string, string> = {
  'LOW': '相处简单',
  'MID': '需要平衡',
  'HIGH': '需要用心经营'
}

const COMPLEXITY_COLORS: Record<string, string> = {
  'LOW': '#4caf50',
  'MID': '#ff9800',
  'HIGH': '#f44336'
}

const STRUCTURE_LABELS: Record<string, string> = {
  'LongTermStable': '长期稳定型',
  'HighChemistryHighFriction': '激情与摩擦并存型',
  'ComfortableButStale': '舒适但缺乏激情型',
  'NeedsActiveAdjustment': '需要主动调整型'
}

export default function MatchPage() {
  const router = useRouter()
  const params = useParams()
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

      {/* 2. complexity_level */}
      <section className="section">
        <div className="level-display">
          <span className="level" style={{ background: COMPLEXITY_COLORS[data.complexity_level] }}>
            {COMPLEXITY_LABELS[data.complexity_level] || data.complexity_level}
          </span>
        </div>
      </section>

      {/* 3. relationship_structure */}
      <section className="section">
        <span className="relationship-structure">
          {STRUCTURE_LABELS[data.relationship_structure] || data.relationship_structure}
        </span>
      </section>

      {/* 4. core_tension */}
      <section className="section">
        <h3>核心张力</h3>
        <p className="core-tension">{data.core_tension}</p>
      </section>

      {/* 5. advantages */}
      <section className="section">
        <h3>优势</h3>
        <ul className="list">
          {data.advantages.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      {/* 6. risks */}
      <section className="section">
        <h3>风险</h3>
        <ul className="list">
          {data.risks.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      {/* 7. conflict_loops */}
      <section className="section">
        <h3>冲突循环</h3>
        {data.conflict_loops.map((loop, i) => (
          <div key={i} className="conflict-loop">
            <h4>{loop.name}</h4>
            <p><strong>触发点：</strong>{loop.trigger}</p>
            <p><strong>循环模式：</strong>{loop.pattern}</p>
            <p><strong>打破规则：</strong>{loop.break_rule}</p>
          </div>
        ))}
      </section>

      {/* 8. interaction_rules */}
      <section className="section">
        <h3>相处建议</h3>
        <div className="rules">
          <div className="rule-group do">
            <h4>要做</h4>
            <ul className="list">
              {data.interaction_rules.do.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rule-group dont">
            <h4>不要做</h4>
            <ul className="list">
              {data.interaction_rules.dont.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 9. 进入 7 日关系日历 */}
      <section className="section">
        <Link href={`/forecast/${data.pair.a}/${data.pair.b}`} className="cta-button">
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

        .level-display {
          display: flex;
          justify-content: center;
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .level {
          padding: 10px 20px;
          color: white;
          border-radius: 20px;
          font-size: 16px;
          font-weight: 500;
        }

        .relationship-structure {
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

        h4 {
          font-size: 16px;
          margin-bottom: 8px;
          margin-top: 12px;
        }

        .core-tension {
          padding: 16px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          line-height: 1.6;
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

        .conflict-loop {
          padding: 16px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          margin-bottom: 12px;
        }

        .conflict-loop p {
          margin: 8px 0;
          line-height: 1.6;
        }

        .conflict-loop strong {
          font-weight: 500;
        }

        .rules {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rule-group h4 {
          font-size: 16px;
          margin-bottom: 8px;
          margin-top: 0;
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
