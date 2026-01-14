/**
 * 配对计算引擎
 * 基于 SPEC 第 4 节规则系统
 */

import { Sign, SignCode, getSignByCode } from './signs';

/**
 * 几何相位类型
 */
export type GeometryType =
  | 'Conjunction'    // 0: 同星座
  | 'Opposition'     // 6: 对宫
  | 'Trine'          // 4, 8: 三合
  | 'Sextile'        // 2, 10: 六合
  | 'Square'         // 3, 9: 刑
  | 'Minor';         // 1, 5, 7, 11: 次要相位

/**
 * 关系类型
 */
export type RelationshipType =
  | 'LongTerm'
  | 'HighChemistryHighFriction'
  | 'ComfortableButStale'
  | 'NeedsWork';

/**
 * 配对等级
 */
export type Level = 'HIGH' | 'MID' | 'LOW';

/**
 * 焦点类型
 */
export type Focus =
  | 'communication'
  | 'boundaries'
  | 'money'
  | 'intimacy'
  | 'plans'
  | 'social'
  | 'repair';

/**
 * 氛围类型
 */
export type Tone = 'Smooth' | 'Tense' | 'Misunderstanding' | 'Repair' | 'Passion';

/**
 * 触发点类型
 */
export type TriggerTopic = 'money' | 'boundaries' | 'communication' | 'jealousy' | 'time';

/**
 * 配对结果（SPEC 第 2.2 节）
 */
export interface MatchResult {
  pair: { a: string; b: string };
  score: number;
  level: Level;
  one_liner: string;
  relationship_type: RelationshipType;
  attraction: string[];
  advantages: string[];
  risks: string[];
  triggers: Array<{
    topic: TriggerTopic;
    pattern: string;
    repair: string;
  }>;
  rules: {
    do: string[];
    dont: string[];
  };
  explain: {
    element: string;
    modality: string;
    geometry: string;
  };
}

/**
 * 计算几何相位
 * 基于 index 差值 d = (indexB - indexA + 12) % 12
 */
export function calculateGeometry(indexA: number, indexB: number): GeometryType {
  const d = (indexB - indexA + 12) % 12;

  switch (d) {
    case 0:
      return 'Conjunction';
    case 6:
      return 'Opposition';
    case 4:
    case 8:
      return 'Trine';
    case 2:
    case 10:
      return 'Sextile';
    case 3:
    case 9:
      return 'Square';
    default: // 1, 5, 7, 11
      return 'Minor';
  }
}

/**
 * 计算元素分数（权重约 40）
 */
export function calculateElementScore(elementA: string, elementB: string): number {
  const elementScores: Record<string, Record<string, number>> = {
    Fire: { Fire: 10, Earth: -6, Air: 8, Water: -6 },
    Earth: { Fire: -6, Earth: 10, Air: -4, Water: 8 },
    Air: { Fire: 8, Earth: -4, Air: 10, Water: -4 },
    Water: { Fire: -6, Earth: 8, Air: -4, Water: 10 },
  };

  return elementScores[elementA]?.[elementB] ?? 0;
}

/**
 * 计算模式分数（权重约 25）
 */
export function calculateModalityScore(modalityA: string, modalityB: string): number {
  if (modalityA === modalityB) {
    return 6; // 稳定但可能固执/僵化
  }

  const pairs: Record<string, number> = {
    'Cardinal-Fixed': -2,
    'Fixed-Mutable': -2,
    'Cardinal-Mutable': 2,
  };

  const key = [modalityA, modalityB].sort().join('-');
  return pairs[key] ?? 0;
}

/**
 * 计算几何相位分数（权重约 35）
 */
export function calculateGeometryScore(geometry: GeometryType): number {
  const scores: Record<GeometryType, number> = {
    Conjunction: 6,
    Trine: 18,
    Sextile: 12,
    Opposition: 8, // 吸引强但波动
    Square: -12,
    Minor: 0,
  };

  return scores[geometry];
}

/**
 * 计算总分（收敛到 0-100）
 */
export function calculateTotalScore(
  elementScore: number,
  modalityScore: number,
  geometryScore: number
): number {
  const total = 50 + elementScore + modalityScore + geometryScore;
  return Math.max(0, Math.min(100, total)); // clamp(0, 100)
}

/**
 * 判断等级 level
 */
export function calculateLevel(score: number): Level {
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MID';
  return 'LOW';
}

/**
 * 判断关系类型 relationship_type
 */
export function calculateRelationshipType(
  score: number,
  geometry: GeometryType,
  elementScore: number,
  modalityScore: number
): RelationshipType {
  // 优先级 1: HighChemistryHighFriction
  // Opposition 且 score 介于 45-75 或存在 Square 且 score ≥ 55
  if ((geometry === 'Opposition' && score >= 45 && score <= 75) ||
      (geometry === 'Square' && score >= 55)) {
    return 'HighChemistryHighFriction';
  }

  // 优先级 2: LongTerm
  // score ≥ 75 且非 Square 主导
  if (score >= 75 && geometry !== 'Square') {
    return 'LongTerm';
  }

  // 优先级 3: NeedsWork
  if (score < 45) {
    return 'NeedsWork';
  }

  // 优先级 4: ComfortableButStale
  // 同元素或同模式加分多但几何为 Minor/Conjunction，且 score 55-75
  const hasSameElementOrModalityBonus = elementScore > 0 || modalityScore > 0;
  if (hasSameElementOrModalityBonus &&
      (geometry === 'Minor' || geometry === 'Conjunction') &&
      score >= 55 && score <= 75) {
    return 'ComfortableButStale';
  }

  // 默认回退
  if (score >= 70) return 'LongTerm';
  if (score >= 45) return 'ComfortableButStale';
  return 'NeedsWork';
}

/**
 * 文案模板库
 */

// one_liner 模板：按 relationship_type + element_relation + geometry
const ONE_LINER_TEMPLATES: Record<RelationshipType, string[]> = {
  LongTerm: [
    '这是一段有着长期潜力的配对，彼此的能量互补且稳定。',
    '你们的组合建立在坚实的理解基础上，适合共同成长。',
    '这段关系有望随着时间的推移而愈发深厚。',
  ],
  HighChemistryHighFriction: [
    '强烈的吸引力伴随着不可避免的摩擦，需要用心经营。',
    '你们之间的化学反应很强烈，但需要平衡激情与冲突。',
    '这是充满张力的一对，既能点燃彼此也可能互相伤害。',
  ],
  ComfortableButStale: [
    '相处舒适但缺乏火花，需要主动注入新鲜感。',
    '你们的关系很稳定，但要警惕陷入平庸的日常。',
    '彼此熟悉到有些平淡，需要共同创造新的体验。',
  ],
  NeedsWork: [
    '这段关系需要双方付出额外的努力和理解才能维系。',
    '你们的差异较大，需要学习如何相互包容。',
    '这不是一个轻松的开始，但如果愿意投入仍有转机。',
  ],
};

// 优势文案库
const ADVANTAGES_TEMPLATES: string[] = [
  '能够直接沟通，减少不必要的猜忌。',
  '在重大决策上容易达成共识。',
  '彼此的性格特质形成互补。',
  '能够为对方提供稳定的情感支持。',
  '在危机时刻能够相互依靠。',
  '价值观相似，生活方式相容。',
  '彼此的缺点能够被对方包容。',
  '愿意为对方改变和妥协。',
  '能够共同规划未来方向。',
  '在财务观念上容易协调。',
];

// 风险文案库
const RISKS_TEMPLATES: string[] = [
  '可能陷入重复性的争吵模式。',
  '沟通不畅时容易产生误解。',
  '情绪冲突可能导致激烈争吵。',
  '对彼此的需求反应迟钝。',
  '长期相处可能失去新鲜感。',
  '在价值观差异上产生分歧。',
  '缺乏足够的情感共鸣。',
  '过度依赖对方可能导致失去自我。',
  '处理问题的方式差异较大。',
  '容易忽视对方的感受和需求。',
];

// 吸引力文案库
const ATTRACTION_TEMPLATES: string[] = [
  '初次见面就感到莫名的亲近感。',
  '对方的某些特质深深吸引着你。',
  '彼此的能量场有天然的共鸣。',
  '在对方身上看到自己缺失的特质。',
  '能够读懂对方未说出口的想法。',
];

// Do 规则库（动词开头，可执行）
const DO_TEMPLATES: string[] = [
  '定期进行坦诚的对话，倾听对方的真实想法。',
  '在冲突发生时给彼此冷静处理的时间。',
  '为对方的小成就表达真诚的赞赏。',
  '共同制定应对分歧的沟通规则。',
  '在对方需要支持时及时出现在身边。',
  '尊重彼此的独处时间和个人空间。',
  '主动分享自己的感受，不隐藏情绪。',
  '为关系注入新的共同体验和活动。',
  '在争吵后主动寻求修复的机会。',
  '学习对方的沟通偏好，调整表达方式。',
];

// Don't 规则库（动词开头，可执行）
const DONT_TEMPLATES: string[] = [
  '不要在愤怒时说出伤人的话。',
  '不要忽视对方表达的需求和担忧。',
  '不要在第三方面前批评或贬低对方。',
  '不要用冷战或沉默作为惩罚手段。',
  '不要试图改变对方的本质特质。',
  '不要假设对方已经知道你的想法。',
  '不要把过去的错误反复翻出来。',
  '不要用威胁或最后通牒来逼迫对方。',
  '不要忽视关系中的小问题直到爆发。',
  '不要在压力大时过度依赖对方。',
];

// 触发点库
const TRIGGER_TEMPLATES: Record<TriggerTopic, { pattern: string; repair: string }[]> = {
  money: [
    { pattern: '对消费习惯的不同看法引发争执。', repair: '制定共同的预算和消费规则。' },
    { pattern: '对未来的财务规划产生分歧。', repair: '定期讨论理财目标和策略。' },
  ],
  boundaries: [
    { pattern: '一方感觉自己的空间被侵犯。', repair: '明确表达各自的边界需求。' },
    { pattern: '在社交时间安排上产生冲突。', repair: '协商各自需要的时间和自由度。' },
  ],
  communication: [
    { pattern: '沟通方式不同导致误解。', repair: '学习并适应对方的沟通偏好。' },
    { pattern: '沉默或回避让问题积累。', repair: '及时表达担忧，不回避对话。' },
  ],
  jealousy: [
    { pattern: '对对方的社交关系产生不安全感。', repair: '通过坦诚对话建立信任基础。' },
    { pattern: '过度关注对方的过往经历。', repair: '关注当下，接受彼此的过去。' },
  ],
  time: [
    { pattern: '对相处时间的期待不一致。', repair: '协商双方都能接受的时间安排。' },
    { pattern: '一方觉得被忽视或冷落。', repair: '主动安排高质量的相处时光。' },
  ],
};

/**
 * 确定性选择器（基于哈希）
 */
function selectFromList<T>(seed: string, list: T[], count: number): T[] {
  const result: T[] = [];
  const available = [...list];

  for (let i = 0; i < count && available.length > 0; i++) {
    let hash = simpleHash(seed + i);
    const index = hash % available.length;
    result.push(available[index]!);
    available.splice(index, 1);
  }

  return result;
}

/**
 * 简单哈希函数
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * 生成 one_liner
 */
function generateOneLiner(
  relationshipType: RelationshipType,
  elementA: string,
  elementB: string,
  geometry: GeometryType
): string {
  const templates = ONE_LINER_TEMPLATES[relationshipType];
  const seed = `${relationshipType}-${elementA}-${elementB}-${geometry}`;
  const index = simpleHash(seed) % templates.length;
  return templates[index]!;
}

/**
 * 生成配对结果
 */
export function calculateCompatibility(
  signACode: string,
  signBCode: string
): MatchResult | null {
  const signA = getSignByCode(signACode);
  const signB = getSignByCode(signBCode);

  if (!signA || !signB) {
    return null;
  }

  // 计算几何相位
  const geometry = calculateGeometry(signA.index, signB.index);

  // 计算各维度分数
  const elementScore = calculateElementScore(signA.element, signB.element);
  const modalityScore = calculateModalityScore(signA.modality, signB.modality);
  const geometryScore = calculateGeometryScore(geometry);

  // 计算总分
  const score = calculateTotalScore(elementScore, modalityScore, geometryScore);

  // 计算等级和关系类型
  const level = calculateLevel(score);
  const relationshipType = calculateRelationshipType(
    score,
    geometry,
    elementScore,
    modalityScore
  );

  // 生成文案（确定性地从模板库选择）
  const seedBase = `${signACode}-${signBCode}`;
  const oneLiner = generateOneLiner(relationshipType, signA.element, signB.element, geometry);
  const attraction = selectFromList(`${seedBase}-attraction`, ATTRACTION_TEMPLATES, 2);
  const advantages = selectFromList(`${seedBase}-advantages`, ADVANTAGES_TEMPLATES, 3);
  const risks = selectFromList(`${seedBase}-risks`, RISKS_TEMPLATES, 3);
  const doRules = selectFromList(`${seedBase}-do`, DO_TEMPLATES, 3);
  const dontRules = selectFromList(`${seedBase}-dont`, DONT_TEMPLATES, 3);

  // 生成触发点
  const triggers: MatchResult['triggers'] = [];
  const topics: TriggerTopic[] = ['money', 'boundaries', 'communication', 'jealousy', 'time'];
  const selectedTopics = selectFromList(`${seedBase}-triggers`, topics, 2);
  selectedTopics.forEach((topic, i) => {
    const options = TRIGGER_TEMPLATES[topic];
    const selected = selectFromList(`${seedBase}-trigger-${i}`, options, 1);
    if (selected[0]) {
      triggers.push({ topic, ...selected[0] });
    }
  });

  // 解释文案
  const explain = {
    element: getExplanationText('element', signA.element, signB.element, elementScore),
    modality: getExplanationText('modality', signA.modality, signB.modality, modalityScore),
    geometry: getExplanationText('geometry', geometry, '', geometryScore),
  };

  return {
    pair: { a: signACode, b: signBCode },
    score,
    level,
    one_liner: oneLiner,
    relationship_type: relationshipType,
    attraction,
    advantages,
    risks,
    triggers,
    rules: { do: doRules, dont: dontRules },
    explain,
  };
}

/**
 * 获取解释文案
 */
function getExplanationText(
  type: 'element' | 'modality' | 'geometry',
  valueA: string,
  valueB: string,
  score: number
): string {
  const base = `${type}:${valueA}-${valueB}`;
  const texts: string[] = [];

  if (type === 'element') {
    if (valueA === valueB) {
      texts.push(`${valueA} 与 ${valueB} 同元素，天然默契。`);
    } else if (score > 0) {
      texts.push(`${valueA} 与 ${valueB} 互相吸引，有良好互动。`);
    } else {
      texts.push(`${valueA} 与 ${valueB} 存在差异，需要理解调和。`);
    }
  } else if (type === 'modality') {
    if (valueA === valueB) {
      texts.push('行动模式一致，配合默契但可能固执。');
    } else if (score > 0) {
      texts.push('行动方式互补，能够互相支持。');
    } else {
      texts.push('行动节奏不同，需要协调同步。');
    }
  } else if (type === 'geometry') {
    const geometryMap: Record<string, string> = {
      Conjunction: '相位重合，彼此影响强烈。',
      Opposition: '对宫相位，吸引与冲突并存。',
      Trine: '三合相位，和谐顺畅的互动。',
      Sextile: '六合相位，带来良好的协作机会。',
      Square: '刑克相位，冲突明显需要磨合。',
      Minor: '次要相位，影响相对温和。',
    };
    texts.push(geometryMap[valueA] ?? '');
  }

  // 根据哈希选择
  const index = simpleHash(base) % texts.length;
  return texts[index] ?? '';
}
