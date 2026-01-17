'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { useLocale } from '@/lib/i18n'
import { getSignName, getElementName, type SignCode, type Element } from '@/lib/signs'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

// 星座数据
const SIGNS_CONFIG: readonly [
  { code: 'Aries'; icon: string; element: 'Fire'; date: string },
  { code: 'Taurus'; icon: string; element: 'Earth'; date: string },
  { code: 'Gemini'; icon: string; element: 'Air'; date: string },
  { code: 'Cancer'; icon: string; element: 'Water'; date: string },
  { code: 'Leo'; icon: string; element: 'Fire'; date: string },
  { code: 'Virgo'; icon: string; element: 'Earth'; date: string },
  { code: 'Libra'; icon: string; element: 'Air'; date: string },
  { code: 'Scorpio'; icon: string; element: 'Water'; date: string },
  { code: 'Sagittarius'; icon: string; element: 'Fire'; date: string },
  { code: 'Capricorn'; icon: string; element: 'Earth'; date: string },
  { code: 'Aquarius'; icon: string; element: 'Air'; date: string },
  { code: 'Pisces'; icon: string; element: 'Water'; date: string },
] = [
  { code: 'Aries', icon: '♈', element: 'Fire', date: '3/21-4/19' },
  { code: 'Taurus', icon: '♉', element: 'Earth', date: '4/20-5/20' },
  { code: 'Gemini', icon: '♊', element: 'Air', date: '5/21-6/21' },
  { code: 'Cancer', icon: '♋', element: 'Water', date: '6/22-7/22' },
  { code: 'Leo', icon: '♌', element: 'Fire', date: '7/23-8/22' },
  { code: 'Virgo', icon: '♍', element: 'Earth', date: '8/23-9/22' },
  { code: 'Libra', icon: '♎', element: 'Air', date: '9/23-10/23' },
  { code: 'Scorpio', icon: '♏', element: 'Water', date: '10/24-11/22' },
  { code: 'Sagittarius', icon: '♐', element: 'Fire', date: '11/23-12/21' },
  { code: 'Capricorn', icon: '♑', element: 'Earth', date: '12/22-1/19' },
  { code: 'Aquarius', icon: '♒', element: 'Air', date: '1/20-2/18' },
  { code: 'Pisces', icon: '♓', element: 'Water', date: '2/19-3/20' },
]

// 元素颜色映射
const getElementColor = (element: Element, elementName: string) => {
  const colorMap: Record<string, string> = {
    '火象': 'bg-orange-100 text-orange-700 border-orange-200',
    '土象': 'bg-amber-100 text-amber-700 border-amber-200',
    '风象': 'bg-sky-100 text-sky-700 border-sky-200',
    '水象': 'bg-blue-100 text-blue-700 border-blue-200',
    'Fire': 'bg-orange-100 text-orange-700 border-orange-200',
    'Earth': 'bg-amber-100 text-amber-700 border-amber-200',
    'Air': 'bg-sky-100 text-sky-700 border-sky-200',
    'Water': 'bg-blue-100 text-blue-700 border-blue-200',
  }
  return colorMap[elementName] || 'bg-gray-100 text-gray-700 border-gray-200'
}

// 星座卡片组件
const SignCard = ({
  code,
  icon,
  element,
  date,
  isSelected,
  onClick,
  index,
}: {
  code: SignCode
  icon: string
  element: Element
  date: string
  isSelected: boolean
  onClick: () => void
  index: number
}) => {
  const { locale } = useLocale()
  const { signs } = useTranslation()
  const signName = getSignName(code, locale)
  const elementName = getElementName(element, locale)
  const elementColor = getElementColor(element, elementName)

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
        {icon}
      </div>
      {/* 星座名称 */}
      <div className={`font-display font-semibold mb-1 ${isSelected ? 'text-primary-700' : 'text-gray-800'}`}>
        {signName}
      </div>
      {/* 星座日期 */}
      <div className="text-xs text-gray-500 mb-2">
        {date}
      </div>
      {/* 元素标签 */}
      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${elementColor}`}>
        {elementName}
      </div>
    </button>
  )
}

export default function LandingPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const { common, home, signs } = useTranslation()
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
            <span className="font-display font-bold text-xl text-primary-700">{common.brand}</span>
          </div>
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Hero 区域 */}
      <section className="pt-36 pb-20 px-4">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              {/* 版本标签 */}
{/*               <div className="inline-flex items-center gap-2 bg-primary-100 px-4 py-2 rounded-full mb-6 shadow-sm">
                <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-primary-700">{home.versionTag}</span>
              </div> */}

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                {home.title}
                <span className="text-primary-600 block font-script text-5xl sm:text-6xl lg:text-7xl mt-2">
                  {home.subtitle}
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                {home.selectPrompt}
              </p>

              {/* 星座选择器 - 卡片网格 */}
              <div className="bg-white rounded-3xl p-6 shadow-soft-lg border border-primary-100 mb-8 max-w-xl mx-auto lg:mx-0">
                <div className="text-center mb-6">
                  <p className="text-sm font-medium text-gray-500 mb-4">{home.selectPrompt}</p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 mb-2">{home.yourSign}</div>
                      <div className="h-1 bg-gray-200 rounded-full">
                        <div className={`h-1 bg-primary-500 rounded-full transition-all duration-300 ${selectedSignA ? 'w-full' : 'w-0'}`} />
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 mb-2">{home.partnerSign}</div>
                      <div className="h-1 bg-gray-200 rounded-full">
                        <div className={`h-1 bg-primary-500 rounded-full transition-all duration-300 ${selectedSignB ? 'w-full' : 'w-0'}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 星座卡片网格 */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                  {SIGNS_CONFIG.map((sign, index) => (
                    <SignCard
                      key={sign.code}
                      code={sign.code}
                      icon={sign.icon}
                      element={sign.element}
                      date={sign.date}
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
                  {selectedSignA && selectedSignB ? home.startMatch : home.selectTwoSigns}
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
              <span className="font-display font-bold text-xl text-primary-700">{common.brand}</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-primary-600 transition-colors duration-200 cursor-pointer touch-target">
                {home.privacy}
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors duration-200 cursor-pointer touch-target">
                {home.terms}
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors duration-200 cursor-pointer touch-target">
                {home.contact}
              </a>
            </div>
            <div className="text-sm text-gray-400">
              {home.copyright}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
