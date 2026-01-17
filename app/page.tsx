'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 星座数据
const SIGNS = [
  { code: 'Aries', name: '白羊座', icon: '♈', element: '火象', date: '3/21-4/19' },
  { code: 'Taurus', name: '金牛座', icon: '♉', element: '土象', date: '4/20-5/20' },
  { code: 'Gemini', name: '双子座', icon: '♊', element: '风象', date: '5/21-6/21' },
  { code: 'Cancer', name: '巨蟹座', icon: '♋', element: '水象', date: '6/22-7/22' },
  { code: 'Leo', name: '狮子座', icon: '♌', element: '火象', date: '7/23-8/22' },
  { code: 'Virgo', name: '处女座', icon: '♍', element: '土象', date: '8/23-9/22' },
  { code: 'Libra', name: '天秤座', icon: '♎', element: '风象', date: '9/23-10/23' },
  { code: 'Scorpio', name: '天蝎座', icon: '♏', element: '水象', date: '10/24-11/22' },
  { code: 'Sagittarius', name: '射手座', icon: '♐', element: '火象', date: '11/23-12/21' },
  { code: 'Capricorn', name: '摩羯座', icon: '♑', element: '土象', date: '12/22-1/19' },
  { code: 'Aquarius', name: '水瓶座', icon: '♒', element: '风象', date: '1/20-2/18' },
  { code: 'Pisces', name: '双鱼座', icon: '♓', element: '水象', date: '2/19-3/20' },
]


// 星座卡片组件
const SignCard = ({ sign, isSelected, onClick, index }: {
  sign: typeof SIGNS[0]
  isSelected: boolean
  onClick: () => void
  index: number
}) => {
  const elementColor = {
    '火象': 'bg-orange-100 text-orange-700 border-orange-200',
    '土象': 'bg-amber-100 text-amber-700 border-amber-200',
    '风象': 'bg-sky-100 text-sky-700 border-sky-200',
    '水象': 'bg-blue-100 text-blue-700 border-blue-200',
  }[sign.element]

  return (
    <button
      onClick={onClick}
      className={`
        relative group touch-target cursor-pointer transition-all duration-300
        rounded-2xl p-4 text-center border-2
        ${isSelected
          ? 'border-primary-500 bg-primary-50 shadow-soft-lg'
          : 'border-transparent bg-white hover:border-primary-200 hover:shadow-soft'
        }
      `}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* 星座符号 */}
      <div className={`
        text-4xl mb-2 transition-transform duration-300
        ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
      `}>
        {sign.icon}
      </div>
      {/* 星座名称 */}
      <div className={`font-display font-semibold mb-1 ${isSelected ? 'text-primary-700' : 'text-gray-800'}`}>
        {sign.name}
      </div>
      {/* 星座日期 */}
      <div className="text-xs text-gray-500 mb-2">
        {sign.date}
      </div>
      {/* 元素标签 */}
      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${elementColor}`}>
        {sign.element}
      </div>
    </button>
  )
}

export default function LandingPage() {
  const router = useRouter()
  const [selectedSignA, setSelectedSignA] = useState('')
  const [selectedSignB, setSelectedSignB] = useState('')

  const handleMatch = () => {
    if (selectedSignA && selectedSignB) {
      router.push(`/match/${selectedSignA}/${selectedSignB}`)
    }
  }

  const handleSignSelect = (code: string) => {
    // 如果点击已选中的星座，取消选择
    if (selectedSignA === code) {
      setSelectedSignA('')
      return
    }
    if (selectedSignB === code) {
      setSelectedSignB('')
      return
    }

    // 正常选择逻辑
    if (!selectedSignA) {
      setSelectedSignA(code)
    } else if (!selectedSignB) {
      setSelectedSignB(code)
    } else {
      // 两个都已选择，替换第一个（A）
      setSelectedSignA(code)
    }
  }

  return (
    <div className="min-h-screen bg-sakura-50">
      {/* 导航栏 - 浮动式设计 */}
      <nav className="fixed top-4 left-4 right-4 z-50 bg-white/90 backdrop-blur-md rounded-2xl shadow-soft border border-primary-100">
        <div className="container-custom py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            {/* SVG 樱花图标 */}
            <svg className="w-8 h-8 text-primary-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C12 2 8 5 8 8C8 9.5 8.5 10.5 9.5 11.5C9 12.5 9 13.5 9.5 14.5C8.5 15 8 16 8 17.5C8 21 12 22 12 22C12 22 16 21 16 17.5C16 16 15.5 15 14.5 14.5C15 13.5 15 12.5 14.5 11.5C15.5 10.5 16 9.5 16 8C16 5 12 2 12 2Z" />
            </svg>
            <span className="font-display font-bold text-xl text-primary-700">Sakura Story</span>
          </div>
        </div>
      </nav>

      {/* Hero 区域 */}
      <section className="pt-36 pb-20 px-4">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              {/* 版本标签 */}
              <div className="inline-flex items-center gap-2 bg-primary-100 px-4 py-2 rounded-full mb-6 shadow-sm">
                <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-primary-700">新版本 2.0 已上线</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                探索星座的奥秘
                <span className="text-primary-600 block font-script text-5xl sm:text-6xl lg:text-7xl mt-2">
                  解锁你们的关系密码
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                Sakura Story 让星座分析变得简单有趣。配对分析、每日运势、关系追踪，让爱情更有仪式感。
              </p>

              {/* 星座选择器 - 卡片网格 */}
              <div className="bg-white rounded-3xl p-6 shadow-soft-lg border border-primary-100 mb-8 max-w-xl mx-auto lg:mx-0">
                <div className="text-center mb-6">
                  <p className="text-sm font-medium text-gray-500 mb-4">立即测试你们的星座匹配度</p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 mb-2">你的星座</div>
                      <div className="h-1 bg-gray-200 rounded-full">
                        <div className={`h-1 bg-primary-500 rounded-full transition-all duration-300 ${selectedSignA ? 'w-full' : 'w-0'}`} />
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 mb-2">对方星座</div>
                      <div className="h-1 bg-gray-200 rounded-full">
                        <div className={`h-1 bg-primary-500 rounded-full transition-all duration-300 ${selectedSignB ? 'w-full' : 'w-0'}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 星座卡片网格 */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                  {SIGNS.map((sign, index) => (
                    <SignCard
                      key={sign.code}
                      sign={sign}
                      isSelected={selectedSignA === sign.code || selectedSignB === sign.code}
                      onClick={() => handleSignSelect(sign.code)}
                      index={index}
                    />
                  ))}
                </div>

                <button
                  onClick={handleMatch}
                  disabled={!selectedSignA || !selectedSignB}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer touch-target shadow-soft hover:shadow-soft-lg"
                >
                  {selectedSignA && selectedSignB ? '开始配对分析' : '请选择两个星座'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 cursor-pointer">
              <svg className="w-8 h-8 text-primary-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C12 2 8 5 8 8C8 9.5 8.5 10.5 9.5 11.5C9 12.5 9 13.5 9.5 14.5C8.5 15 8 16 8 17.5C8 21 12 22 12 22C12 22 16 21 16 17.5C16 16 15.5 15 14.5 14.5C15 13.5 15 12.5 14.5 11.5C15.5 10.5 16 9.5 16 8C16 5 12 2 12 2Z" />
              </svg>
              <span className="font-display font-bold text-xl text-primary-700">Sakura Story</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-primary-600 transition-colors duration-200 cursor-pointer touch-target">
                隐私政策
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors duration-200 cursor-pointer touch-target">
                用户协议
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors duration-200 cursor-pointer touch-target">
                联系我们
              </a>
            </div>
            <div className="text-sm text-gray-400">
              © 2026 Sakura Story. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
