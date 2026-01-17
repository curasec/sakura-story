'use client'

import { useLocale } from '../contexts/LocaleContext'
import type { Translations } from '../types'
import en from '../dictionaries/en.json'
import zh from '../dictionaries/zh.json'
import ja from '../dictionaries/ja.json'

const dictionaries: Record<string, Translations> = {
  en: en as Translations,
  zh: zh as Translations,
  ja: ja as Translations,
}

export function useTranslation(): Translations {
  const { locale } = useLocale()
  return dictionaries[locale]
}
