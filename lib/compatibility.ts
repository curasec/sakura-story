/**
 * 关系说明书计算引擎
 * 基于 SPEC 第 5 节规则系统
 */

import { Sign, getSignByCode } from './signs';

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
 * 理解与维护成本等级
 */
export type ComplexityLevel = 'LOW' | 'MID' | 'HIGH';

/**
 * 关系结构类型
 */
export type RelationshipStructure =
  | 'LongTermStable'
  | 'HighChemistryHighFriction'
  | 'ComfortableButStale'
  | 'NeedsActiveAdjustment';

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
 * 冲突循环项
 */
export interface ConflictLoop {
  name: string;
  trigger: string;
  pattern: string;
  break_rule: string;
}

/**
 * 相处规则
 */
export interface InteractionRules {
  do: string[];
  dont: string[];
}

/**
 * 结构解释
 */
export interface StructureExplain {
  element_relation: string;
  modality_relation: string;
  geometry_relation: string;
}

/**
 * 关系说明书输出（SPEC 第 3.1 节）
 */
export interface RelationshipManual {
  pair: { a: string; b: string };
  complexity_level: ComplexityLevel;
  one_liner: string;
  relationship_structure: RelationshipStructure;
  core_tension: string;
  advantages: string[];
  risks: string[];
  conflict_loops: ConflictLoop[];
  interaction_rules: InteractionRules;
  structure_explain: StructureExplain;
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
 * 判断 complexity_level（SPEC 第 5.4 节）
 */
export function calculateComplexityLevel(score: number): ComplexityLevel {
  if (score >= 75) return 'LOW';
  if (score >= 45) return 'MID';
  return 'HIGH';
}

/**
 * 判断 relationship_structure（SPEC 第 5.5 节）
 */
export function calculateRelationshipStructure(
  score: number,
  geometry: GeometryType,
  elementScore: number,
  modalityScore: number
): RelationshipStructure {
  // 优先级 1: HighChemistryHighFriction
  // Opposition 且 score 介于 45-75 或存在 Square 且 score >= 55
  if ((geometry === 'Opposition' && score >= 45 && score <= 75) ||
      (geometry === 'Square' && score >= 55)) {
    return 'HighChemistryHighFriction';
  }

  // 优先级 2: LongTermStable
  // score >= 75 且非 Square 主导
  if (score >= 75 && geometry !== 'Square') {
    return 'LongTermStable';
  }

  // 优先级 3: NeedsActiveAdjustment
  if (score < 45) {
    return 'NeedsActiveAdjustment';
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
  if (score >= 70) return 'LongTermStable';
  if (score >= 45) return 'ComfortableButStale';
  return 'NeedsActiveAdjustment';
}

/**
 * 文案模板库
 */

// one_liner 模板：按 relationship_structure + element_relation + geometry
const ONE_LINER_TEMPLATES: Record<RelationshipStructure, string[]> = {
  LongTermStable: [
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
  NeedsActiveAdjustment: [
    '这段关系需要双方付出额外的努力和理解才能维系。',
    '你们的差异较大，需要学习如何相互包容。',
    '这不是一个轻松的开始，但如果愿意投入仍有转机。',
  ],
};

// core_tension 模板
const CORE_TENSION_TEMPLATES: Record<RelationshipStructure, string[]> = {
  LongTermStable: [
    '双方价值观高度契合，冲突来源较少。',
    '主要挑战在于如何保持关系的活力。',
    '平稳期需要警惕关系停滞不前。',
  ],
  HighChemistryHighFriction: [
    '情感波动是常态，需要学习平衡激情与理性。',
    '冲突往往源于表达方式的差异。',
    '需要双方都有较强的自我调节能力。',
  ],
  ComfortableButStale: [
    '舒适感可能掩盖潜在的不满。',
    '缺乏挑战性可能导致关系倦怠。',
    '需要主动创造变化来维持吸引力。',
  ],
  NeedsActiveAdjustment: [
    '理解和接纳差异是核心挑战。',
    '需要建立新的沟通模式。',
    '双方都需要做出妥协和调整。',
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

// 冲突循环库
const CONFLICT_LOOP_TEMPLATES: Array<{
  name: string;
  triggers: string[];
  patterns: string[];
  break_rules: string[];
}> = [
  {
    name: '沟通困境循环',
    triggers: ['意见不合时急于反驳', '感觉被忽视时的沉默抗议'],
    patterns: ['一方表达不满，另一方防御性回应', '问题反复出现但从未真正解决'],
    break_rules: ['先倾听对方说完再表达', '用"我"语言代替指责性语言'],
  },
  {
    name: '期待落差循环',
    triggers: ['一方提出未明说的期待', '对方的反应不符合预期'],
    patterns: ['期待未被满足，感到失望', '对方感到压力，表现更加消极'],
    break_rules: ['清晰直接地表达自己的需求', '询问对方的真实想法而非假设'],
  },
  {
    name: '边界冲突循环',
    triggers: ['一方感觉空间被侵占', '对相处时间的期待不同'],
    patterns: ['要求更多空间，对方感到被拒绝', '给予空间后被误解为不在乎'],
    break_rules: ['明确沟通各自的边界需求', '约定可接受的相处频率'],
  },
  {
    name: '情绪反应循环',
    triggers: ['一方情绪激动，另一方试图理性化', '情绪被否定后加剧'],
    patterns: ['情绪表达被当作"反应过度"', '理性建议被当作"不关心"'],
    break_rules: ['先接纳对方的情绪，再讨论问题', '尊重对方的情绪反应方式'],
  },
];

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
  relationshipStructure: RelationshipStructure,
  elementA: string,
  elementB: string,
  geometry: GeometryType
): string {
  const templates = ONE_LINER_TEMPLATES[relationshipStructure];
  const seed = `${relationshipStructure}-${elementA}-${elementB}-${geometry}`;
  const index = simpleHash(seed) % templates.length;
  return templates[index]!;
}

/**
 * 生成 core_tension
 */
function generateCoreTension(
  relationshipStructure: RelationshipStructure,
  elementA: string,
  elementB: string
): string {
  const templates = CORE_TENSION_TEMPLATES[relationshipStructure];
  const seed = `${relationshipStructure}-${elementA}-${elementB}`;
  const index = simpleHash(seed) % templates.length;
  return templates[index]!;
}

/**
 * 生成冲突循环
 */
function generateConflictLoops(
  seedBase: string,
  count: number = 2
): ConflictLoop[] {
  const selectedLoops = selectFromList(`${seedBase}-loops`, CONFLICT_LOOP_TEMPLATES, count);

  return selectedLoops.map((loop, i) => {
    const seed = `${seedBase}-loop-${i}`;
    const trigger = selectFromList(`${seed}-trigger`, loop.triggers, 1)[0] ?? '';
    const pattern = selectFromList(`${seed}-pattern`, loop.patterns, 1)[0] ?? '';
    const breakRule = selectFromList(`${seed}-break`, loop.break_rules, 1)[0] ?? '';

    return {
      name: loop.name,
      trigger,
      pattern,
      break_rule: breakRule,
    };
  });
}

/**
 * 生成关系说明书
 */
export function generateRelationshipManual(
  signACode: string,
  signBCode: string
): RelationshipManual | null {
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

  // 计算等级和关系结构
  const complexityLevel = calculateComplexityLevel(score);
  const relationshipStructure = calculateRelationshipStructure(
    score,
    geometry,
    elementScore,
    modalityScore
  );

  // 生成文案（确定性地从模板库选择）
  const seedBase = `${signACode}-${signBCode}`;
  const oneLiner = generateOneLiner(relationshipStructure, signA.element, signB.element, geometry);
  const coreTension = generateCoreTension(relationshipStructure, signA.element, signB.element);
  const advantages = selectFromList(`${seedBase}-advantages`, ADVANTAGES_TEMPLATES, 3);
  const risks = selectFromList(`${seedBase}-risks`, RISKS_TEMPLATES, 3);
  const doRules = selectFromList(`${seedBase}-do`, DO_TEMPLATES, 3);
  const dontRules = selectFromList(`${seedBase}-dont`, DONT_TEMPLATES, 3);
  const conflictLoops = generateConflictLoops(seedBase, 2);

  // 解释文案
  const structureExplain: StructureExplain = {
    element_relation: getExplanationText('element', signA.element, signB.element, elementScore),
    modality_relation: getExplanationText('modality', signA.modality, signB.modality, modalityScore),
    geometry_relation: getExplanationText('geometry', geometry, '', geometryScore),
  };

  return {
    pair: { a: signACode, b: signBCode },
    complexity_level: complexityLevel,
    one_liner: oneLiner,
    relationship_structure: relationshipStructure,
    core_tension: coreTension,
    advantages,
    risks,
    conflict_loops: conflictLoops,
    interaction_rules: { do: doRules, dont: dontRules },
    structure_explain: structureExplain,
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
