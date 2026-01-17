/**
 * 国际化类型定义
 */

export type Locale = 'en' | 'zh' | 'ja'

export type Translations = {
  // 共同文案
  common: {
    brand: string
    loading: string
    notFound: string
    back: string
    backToHome: string
    start: string
  }

  // 首页
  home: {
    versionTag: string
    title: string
    subtitle: string
    selectPrompt: string
    yourSign: string
    partnerSign: string
    startMatch: string
    selectTwoSigns: string
    privacy: string
    terms: string
    contact: string
    copyright: string
  }

  // 配对页
  match: {
    pageTitle: string
    complexity: {
      LOW: string
      MID: string
      HIGH: string
    }
    structure: {
      LongTermStable: string
      HighChemistryHighFriction: string
      ComfortableButStale: string
      NeedsActiveAdjustment: string
    }
    coreTension: string
    advantages: string
    risks: string
    conflictLoops: string
    trigger: string
    pattern: string
    breakRule: string
    do: string
    dont: string
    viewCalendar: string
    newMatch: string
  }

  // 预测页
  forecast: {
    title: string
    subtitle: string
    day: string
    today: string
    tomorrow: string
    dayAfterTomorrow: string
    dayN: string
    tone: {
      Smooth: string
      Tense: string
      Misunderstanding: string
      Repair: string
      Passion: string
    }
    focus: string
    focusTypes: {
      communication: string
      boundaries: string
      money: string
      intimacy: string
      plans: string
      social: string
      repair: string
    }
    action: string
    risk: string
    backToMatch: string
    newMatch: string
  }

  // 星座相关
  signs: {
    Aries: string
    Taurus: string
    Gemini: string
    Cancer: string
    Leo: string
    Virgo: string
    Libra: string
    Scorpio: string
    Sagittarius: string
    Capricorn: string
    Aquarius: string
    Pisces: string
    element: {
      Fire: string
      Earth: string
      Air: string
      Water: string
    }
  }
}

export type Dictionary = Translations
