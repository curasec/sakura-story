'use client'

import { useLocale } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n/types'

const LOCALE_LABELS: Record<Locale, { label: string; flag: string }> = {
  en: { label: 'English', flag: '🇺🇸' },
  zh: { label: '中文', flag: '🇨🇳' },
  ja: { label: '日本語', flag: '🇯🇵' },
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium cursor-pointer hover:border-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-200"
    >
      {(Object.keys(LOCALE_LABELS) as Locale[]).map((l) => (
        <option key={l} value={l}>
          {LOCALE_LABELS[l].flag} {LOCALE_LABELS[l].label}
        </option>
      ))}
    </select>
  )
}
