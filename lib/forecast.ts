/**
 * 确定性 7 日关系日历生成器
 * 基于 SPEC 第 5 节
 */

import type { Level, Tone, Focus, RelationshipType } from './compatibility';

/**
 * 日历单日输出（SPEC 第 2.3 节）
 */
export interface ForecastDay {
  date: string; // YYYY-MM-DD
  tone: Tone;
  focus: Focus;
  warning_or_window: string;
  action: string;
}

/**
 * 7 日关系日历（SPEC 第 2.3 节）
 */
export interface ForecastResult {
  pair: { a: string; b: string };
  days: ForecastDay[];
}

/**
 * Mulberry32 伪随机数生成器
 * 确定性：相同种子产生相同序列
 */
class Mulberry32 {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  next(): number {
    let t = this.state += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextItem<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

/**
 * 字符串转数字哈希（用于生成种子）
 */
function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * 焦点库（focus 枚举）
 */
const FOCUS_OPTIONS: Focus[] = [
  'communication',
  'boundaries',
  'money',
  'intimacy',
  'plans',
  'social',
  'repair',
];

/**
 * 氛围库（tone 枚举）
 */
const TONE_OPTIONS: Tone[] = [
  'Smooth',
  'Tense',
  'Misunderstanding',
  'Repair',
  'Passion',
];

/**
 * 行动文案库（按 focus 分类）
 */
const ACTION_TEMPLATES: Record<Focus, string[]> = {
  communication: [
    '主动向对方表达你的想法和感受。',
    '安排一次深入对话，增进彼此了解。',
    '坦诚分享近期的心事或烦恼。',
    '倾听对方的建议，真诚地给予反馈。',
    '通过文字或语音保持日常联系。',
  ],
  boundaries: [
    '尊重对方的个人空间和时间。',
    '清晰地表达你对界限的需求。',
    '在需要独处时勇敢地说出来。',
    '检查是否有越界行为需要调整。',
    '和对方讨论彼此舒适相处的方式。',
  ],
  money: [
    '讨论近期的财务目标和计划。',
    '共同回顾近期的消费情况。',
    '为共同的未来做财务规划。',
    '坦诚讨论彼此的金钱观念。',
    '在消费决策前先和对方商量。',
  ],
  intimacy: [
    '创造一个温馨的二人相处时光。',
    '主动表达你的爱意和欣赏。',
    '给对方一个温暖的拥抱或触碰。',
    '分享内心最柔软的情感。',
    '安排一次浪漫的约会或惊喜。',
  ],
  plans: [
    '一起规划接下来的周末安排。',
    '讨论长期目标并制定行动计划。',
    '回顾之前计划的执行情况。',
    '为下个月或下季度设定小目标。',
    '协调彼此的时间安排，确认重要日期。',
  ],
  social: [
    '邀请对方参加朋友聚会或活动。',
    '一起尝试新的餐厅或娱乐项目。',
    '介绍朋友认识，扩大社交圈。',
    '安排一次户外活动或运动。',
    '参与共同感兴趣的活动或课程。',
  ],
  repair: [
    '主动修复之前的小摩擦或误会。',
    '为过去的某个行为真诚道歉。',
    '放下成见，以新的眼光看待对方。',
    '重新审视双方的沟通方式。',
    '用温和的方式提起被忽略的问题。',
  ],
};

/**
 * 警告文案库（按 tone 分类）
 */
const WARNING_TEMPLATES: Record<Tone, string[]> = {
  Smooth: [
    '珍惜这段平稳的时光。',
    '趁状态好时讨论重要议题。',
  ],
  Tense: [
    '控制情绪，避免冲动言辞。',
    '冷静处理分歧，不急于求成。',
    '先处理情绪，再处理问题。',
  ],
  Misunderstanding: [
    '多听少说，确认对方真实意思。',
    '不要预设对方的意图。',
    '用提问代替猜测。',
  ],
  Repair: [
    '主动放下姿态寻求和解。',
    '给对方表达和修复的机会。',
    '记住关系的价值，不让小事蒙蔽。',
  ],
  Passion: [
    '享受强烈的情感连接。',
    '让这股能量为关系注入活力。',
    '共同创造难忘的回忆。',
  ],
};

/**
 * 空窗/机会文案库
 */
const WINDOW_TEMPLATES: string[] = [
  '适合深入沟通的时机。',
  '是表达心意的好机会。',
  '适合尝试新鲜事物。',
  '适合规划共同未来。',
  '适合放松和享受相处。',
];

/**
 * 根据 level 调整 tone 的权重
 */
function adjustToneWeightsByLevel(tones: Tone[], level: Level): Tone[] {
  const weighted: Tone[] = [];

  for (const tone of tones) {
    let weight = 1;

    if (level === 'HIGH') {
      if (tone === 'Smooth' || tone === 'Passion') weight = 3;
      if (tone === 'Repair') weight = 0;
      if (tone === 'Tense' || tone === 'Misunderstanding') weight = 0.5;
    } else if (level === 'LOW') {
      if (tone === 'Tense' || tone === 'Misunderstanding' || tone === 'Repair') weight = 3;
      if (tone === 'Smooth' || tone === 'Passion') weight = 0.5;
    } else { // MID
      if (tone === 'Smooth') weight = 2;
      if (tone === 'Tense' || tone === 'Misunderstanding') weight = 1.5;
    }

    for (let i = 0; i < weight; i++) {
      weighted.push(tone);
    }
  }

  return weighted;
}

/**
 * 根据 relationship_type 调整 tone 的权重
 */
function adjustToneWeightsByType(tones: Tone[], relationshipType: string): Tone[] {
  const weighted: Tone[] = [...tones];

  if (relationshipType === 'HighChemistryHighFriction') {
    // Passion 与 Misunderstanding 同时更高
    weighted.push('Passion', 'Passion', 'Passion');
    weighted.push('Misunderstanding', 'Misunderstanding');
  }

  return weighted;
}

/**
 * 生成日期字符串
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 生成单日预测
 */
function generateDay(
  rng: Mulberry32,
  date: Date,
  level: Level,
  relationshipType: RelationshipType
): ForecastDay {
  // 根据 level 和 relationship_type 调整 tone 概率
  let weightedTones = adjustToneWeightsByLevel(TONE_OPTIONS, level);
  weightedTones = adjustToneWeightsByType(weightedTones, relationshipType);

  const tone = rng.nextItem(weightedTones);
  const focus = rng.nextItem(FOCUS_OPTIONS);

  // 选择 action
  const actions = ACTION_TEMPLATES[focus];
  const action = rng.nextItem(actions);

  // 选择 warning 或 window（根据 tone 决定类型）
  const isWarning = ['Tense', 'Misunderstanding', 'Repair'].includes(tone);
  if (isWarning) {
    const warnings = WARNING_TEMPLATES[tone];
    const warningOrWindow = rng.nextItem(warnings);
    return { date: formatDate(date), tone, focus, action, warning_or_window: warningOrWindow };
  } else {
    const windowText = rng.nextItem(WINDOW_TEMPLATES);
    return { date: formatDate(date), tone, focus, action, warning_or_window: windowText };
  }
}

/**
 * 生成 7 日关系日历
 * @param signACode 星座 A 代码
 * @param signBCode 星座 B 代码
 * @param startDate 起始日期 (YYYY-MM-DD)
 * @param level 配对等级（影响 tone 概率）
 * @param relationshipType 关系类型（影响 tone 概率）
 * @param days 天数，默认 7
 */
export function generateForecast(
  signACode: string,
  signBCode: string,
  startDate: string,
  level: Level,
  relationshipType: RelationshipType,
  days: number = 7
): ForecastResult {
  const daysResult: ForecastDay[] = [];

  // 解析起始日期
  const [year, month, day] = startDate.split('-').map(Number);
  let currentDate = new Date(year!, month! - 1, day!);

  // 确定性种子
  const seed = stringToHash(`${startDate}:${signACode}:${signBCode}`);
  const rng = new Mulberry32(seed);

  for (let i = 0; i < days; i++) {
    const dayResult = generateDay(rng, currentDate, level, relationshipType);
    daysResult.push(dayResult);

    // 推进一天
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    pair: { a: signACode, b: signBCode },
    days: daysResult,
  };
}
