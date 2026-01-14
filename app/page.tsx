'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SIGNS = [
  '白羊座', '金牛座', '双子座', '巨蟹座',
  '狮子座', '处女座', '天秤座', '天蝎座',
  '射手座', '摩羯座', '水瓶座', '双鱼座'
]

const SIGN_CODES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

export default function Home() {
  const router = useRouter()
  const [signA, setSignA] = useState('')
  const [signB, setSignB] = useState('')

  const handleSubmit = () => {
    if (signA && signB) {
      router.push(`/match/${signA}/${signB}`)
    }
  }

  return (
    <div className="container">
      <h1>星座关系说明书</h1>

      <div className="form">
        <label htmlFor="signA">选择你的星座</label>
        <select
          id="signA"
          value={signA}
          onChange={(e) => setSignA(e.target.value)}
        >
          <option value="">请选择</option>
          {SIGNS.map((name, i) => (
            <option key={name} value={SIGN_CODES[i]}>{name}</option>
          ))}
        </select>

        <label htmlFor="signB">选择对方星座</label>
        <select
          id="signB"
          value={signB}
          onChange={(e) => setSignB(e.target.value)}
        >
          <option value="">请选择</option>
          {SIGNS.map((name, i) => (
            <option key={name} value={SIGN_CODES[i]}>{name}</option>
          ))}
        </select>

        <button
          onClick={handleSubmit}
          disabled={!signA || !signB}
        >
          查看关系说明
        </button>
      </div>

      <style jsx>{`
        h1 {
          font-size: 24px;
          text-align: center;
          margin-bottom: 32px;
          margin-top: 24px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        label {
          font-size: 16px;
          font-weight: 500;
        }

        select {
          padding: 14px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
        }

        button {
          padding: 14px;
          font-size: 18px;
          font-weight: 500;
          background: #e91e63;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 8px;
        }

        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        button:not(:disabled):hover {
          background: #c2185b;
        }
      `}</style>
    </div>
  )
}
