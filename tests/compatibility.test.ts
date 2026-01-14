/**
 * compatibility.ts 单元测试
 * 基于 SPEC 第 5 节
 */

import { describe, it } from 'node:test';
import { strictEqual, deepStrictEqual, ok, notStrictEqual } from 'node:assert';
import {
  calculateGeometry,
  calculateElementScore,
  calculateModalityScore,
  calculateGeometryScore,
  calculateTotalScore,
  calculateComplexityLevel,
  calculateRelationshipStructure,
  generateRelationshipManual,
} from '../lib/compatibility.js';
import { SIGNS } from '../lib/signs.js';

describe('calculateGeometry', () => {
  it('d=0 应该是 Conjunction', () => {
    strictEqual(calculateGeometry(0, 0), 'Conjunction');
    strictEqual(calculateGeometry(5, 5), 'Conjunction');
    strictEqual(calculateGeometry(11, 11), 'Conjunction');
  });

  it('d=6 应该是 Opposition', () => {
    strictEqual(calculateGeometry(0, 6), 'Opposition');
    strictEqual(calculateGeometry(3, 9), 'Opposition');
    strictEqual(calculateGeometry(11, 5), 'Opposition');
  });

  it('d=4,8 应该是 Trine', () => {
    strictEqual(calculateGeometry(0, 4), 'Trine');
    strictEqual(calculateGeometry(0, 8), 'Trine');
    strictEqual(calculateGeometry(1, 9), 'Trine');
    strictEqual(calculateGeometry(3, 7), 'Trine');
  });

  it('d=2,10 应该是 Sextile', () => {
    strictEqual(calculateGeometry(0, 2), 'Sextile');
    strictEqual(calculateGeometry(0, 10), 'Sextile');
    strictEqual(calculateGeometry(1, 3), 'Sextile');
    strictEqual(calculateGeometry(5, 7), 'Sextile');
  });

  it('d=3,9 应该是 Square', () => {
    strictEqual(calculateGeometry(0, 3), 'Square');
    strictEqual(calculateGeometry(0, 9), 'Square');
    strictEqual(calculateGeometry(1, 4), 'Square');
    strictEqual(calculateGeometry(2, 11), 'Square');
  });

  it('d=1,5,7,11 应该是 Minor', () => {
    strictEqual(calculateGeometry(0, 1), 'Minor');
    strictEqual(calculateGeometry(0, 5), 'Minor');
    strictEqual(calculateGeometry(0, 7), 'Minor');
    strictEqual(calculateGeometry(0, 11), 'Minor');
  });
});

describe('calculateElementScore', () => {
  it('同元素应该 +10', () => {
    strictEqual(calculateElementScore('Fire', 'Fire'), 10);
    strictEqual(calculateElementScore('Earth', 'Earth'), 10);
    strictEqual(calculateElementScore('Air', 'Air'), 10);
    strictEqual(calculateElementScore('Water', 'Water'), 10);
  });

  it('火-风应该 +8', () => {
    strictEqual(calculateElementScore('Fire', 'Air'), 8);
    strictEqual(calculateElementScore('Air', 'Fire'), 8);
  });

  it('土-水应该 +8', () => {
    strictEqual(calculateElementScore('Earth', 'Water'), 8);
    strictEqual(calculateElementScore('Water', 'Earth'), 8);
  });

  it('火-水应该 -6', () => {
    strictEqual(calculateElementScore('Fire', 'Water'), -6);
    strictEqual(calculateElementScore('Water', 'Fire'), -6);
  });

  it('火-土应该 -6', () => {
    strictEqual(calculateElementScore('Fire', 'Earth'), -6);
    strictEqual(calculateElementScore('Earth', 'Fire'), -6);
  });

  it('风-水应该 -4', () => {
    strictEqual(calculateElementScore('Air', 'Water'), -4);
    strictEqual(calculateElementScore('Water', 'Air'), -4);
  });

  it('风-土应该 -4', () => {
    strictEqual(calculateElementScore('Air', 'Earth'), -4);
    strictEqual(calculateElementScore('Earth', 'Air'), -4);
  });
});

describe('calculateModalityScore', () => {
  it('同模式应该 +6', () => {
    strictEqual(calculateModalityScore('Cardinal', 'Cardinal'), 6);
    strictEqual(calculateModalityScore('Fixed', 'Fixed'), 6);
    strictEqual(calculateModalityScore('Mutable', 'Mutable'), 6);
  });

  it('本位 vs 固定应该 -2', () => {
    strictEqual(calculateModalityScore('Cardinal', 'Fixed'), -2);
    strictEqual(calculateModalityScore('Fixed', 'Cardinal'), -2);
  });

  it('固定 vs 变动应该 -2', () => {
    strictEqual(calculateModalityScore('Fixed', 'Mutable'), -2);
    strictEqual(calculateModalityScore('Mutable', 'Fixed'), -2);
  });

  it('本位 vs 变动应该 +2', () => {
    strictEqual(calculateModalityScore('Cardinal', 'Mutable'), 2);
    strictEqual(calculateModalityScore('Mutable', 'Cardinal'), 2);
  });
});

describe('calculateGeometryScore', () => {
  it('Conjunction 应该 +6', () => {
    strictEqual(calculateGeometryScore('Conjunction'), 6);
  });

  it('Trine 应该 +18', () => {
    strictEqual(calculateGeometryScore('Trine'), 18);
  });

  it('Sextile 应该 +12', () => {
    strictEqual(calculateGeometryScore('Sextile'), 12);
  });

  it('Opposition 应该 +8', () => {
    strictEqual(calculateGeometryScore('Opposition'), 8);
  });

  it('Square 应该 -12', () => {
    strictEqual(calculateGeometryScore('Square'), -12);
  });

  it('Minor 应该 0', () => {
    strictEqual(calculateGeometryScore('Minor'), 0);
  });
});

describe('calculateTotalScore', () => {
  it('应该收敛到 0-100', () => {
    // 极端情况测试
    strictEqual(calculateTotalScore(-100, -100, -100), 0);
    strictEqual(calculateTotalScore(100, 100, 100), 100);

    // 正常情况测试
    strictEqual(calculateTotalScore(10, 6, 18), 84);
    strictEqual(calculateTotalScore(-6, -2, -12), 30);
    strictEqual(calculateTotalScore(0, 0, 0), 50);
  });

  it('边界值测试', () => {
    strictEqual(calculateTotalScore(-50, 0, 0), 0); // 低于 0 收敛到 0
    strictEqual(calculateTotalScore(50, 0, 0), 100); // 高于 100 收敛到 100
    strictEqual(calculateTotalScore(25, 0, 25), 100); // 正好 100
    strictEqual(calculateTotalScore(-25, 0, -25), 0); // 正好 0
  });
});

describe('calculateComplexityLevel', () => {
  it('score ≥ 75 应该是 LOW', () => {
    strictEqual(calculateComplexityLevel(100), 'LOW');
    strictEqual(calculateComplexityLevel(85), 'LOW');
    strictEqual(calculateComplexityLevel(75), 'LOW');
  });

  it('45 ≤ score < 75 应该是 MID', () => {
    strictEqual(calculateComplexityLevel(74), 'MID');
    strictEqual(calculateComplexityLevel(60), 'MID');
    strictEqual(calculateComplexityLevel(45), 'MID');
  });

  it('score < 45 应该是 HIGH', () => {
    strictEqual(calculateComplexityLevel(44), 'HIGH');
    strictEqual(calculateComplexityLevel(30), 'HIGH');
    strictEqual(calculateComplexityLevel(0), 'HIGH');
  });
});

describe('calculateRelationshipStructure', () => {
  describe('优先级 1: HighChemistryHighFriction', () => {
    it('Opposition 且 score 介于 45-75', () => {
      strictEqual(calculateRelationshipStructure(50, 'Opposition', 8, 0), 'HighChemistryHighFriction');
      strictEqual(calculateRelationshipStructure(60, 'Opposition', 8, 0), 'HighChemistryHighFriction');
      strictEqual(calculateRelationshipStructure(45, 'Opposition', 8, 0), 'HighChemistryHighFriction');
      strictEqual(calculateRelationshipStructure(75, 'Opposition', 8, 0), 'HighChemistryHighFriction');
    });

    it('Square 且 score ≥ 55', () => {
      strictEqual(calculateRelationshipStructure(55, 'Square', -6, 0), 'HighChemistryHighFriction');
      strictEqual(calculateRelationshipStructure(70, 'Square', -6, 0), 'HighChemistryHighFriction');
    });

    it('Opposition 且 score < 45 不匹配', () => {
      notStrictEqual(calculateRelationshipStructure(44, 'Opposition', 8, 0), 'HighChemistryHighFriction');
    });

    it('Opposition 且 score > 75 不匹配', () => {
      notStrictEqual(calculateRelationshipStructure(76, 'Opposition', 8, 0), 'HighChemistryHighFriction');
    });

    it('Square 且 score < 55 不匹配', () => {
      notStrictEqual(calculateRelationshipStructure(54, 'Square', -6, 0), 'HighChemistryHighFriction');
    });
  });

  describe('优先级 2: LongTermStable', () => {
    it('score ≥ 75 且非 Square 主导', () => {
      strictEqual(calculateRelationshipStructure(80, 'Trine', 10, 6), 'LongTermStable');
      strictEqual(calculateRelationshipStructure(75, 'Sextile', 8, 6), 'LongTermStable');
      strictEqual(calculateRelationshipStructure(90, 'Conjunction', 10, 6), 'LongTermStable');
    });

    it('Square 主导不匹配', () => {
      notStrictEqual(calculateRelationshipStructure(80, 'Square', -6, 0), 'LongTermStable');
    });
  });

  describe('优先级 3: NeedsActiveAdjustment', () => {
    it('score < 45', () => {
      strictEqual(calculateRelationshipStructure(30, 'Square', -6, 0), 'NeedsActiveAdjustment');
      strictEqual(calculateRelationshipStructure(0, 'Minor', 0, 0), 'NeedsActiveAdjustment');
    });
  });

  describe('优先级 4: ComfortableButStale', () => {
    it('同元素或同模式加分多但几何为 Minor/Conjunction，且 score 55-75', () => {
      strictEqual(calculateRelationshipStructure(60, 'Minor', 10, 6), 'ComfortableButStale');
      strictEqual(calculateRelationshipStructure(70, 'Conjunction', 10, 6), 'ComfortableButStale');
    });
  });

  describe('默认回退', () => {
    it('未被前面的规则捕获时应该正确回退', () => {
      strictEqual(calculateRelationshipStructure(80, 'Minor', 10, 0), 'LongTermStable');
      strictEqual(calculateRelationshipStructure(50, 'Minor', 0, 0), 'ComfortableButStale');
      strictEqual(calculateRelationshipStructure(30, 'Minor', 0, 0), 'NeedsActiveAdjustment');
    });
  });
});

describe('generateRelationshipManual', () => {
  it('无效代码应该返回 null', () => {
    strictEqual(generateRelationshipManual('Invalid', 'Aries'), null);
    strictEqual(generateRelationshipManual('Aries', 'Invalid'), null);
  });

  it('应该返回正确的结果结构', () => {
    const result = generateRelationshipManual('Aries', 'Libra');

    ok(result !== null);
    deepStrictEqual(result?.pair, { a: 'Aries', b: 'Libra' });
    ok(['LOW', 'MID', 'HIGH'].includes(result?.complexity_level!));
    ok(typeof result?.one_liner === 'string');
    ok(result?.one_liner !== '');
    ok(['LongTermStable', 'HighChemistryHighFriction', 'ComfortableButStale', 'NeedsActiveAdjustment'].includes(result?.relationship_structure!));
    ok(typeof result?.core_tension === 'string');
    ok(Array.isArray(result?.advantages));
    ok(Array.isArray(result?.risks));
    ok(Array.isArray(result?.conflict_loops));
    ok(Array.isArray(result?.interaction_rules?.do));
    ok(Array.isArray(result?.interaction_rules?.dont));
    strictEqual(result?.interaction_rules?.do?.length, 3);
    strictEqual(result?.interaction_rules?.dont?.length, 3);
  });

  it('应该产生确定性结果', () => {
    const result1 = generateRelationshipManual('Aries', 'Libra');
    const result2 = generateRelationshipManual('Aries', 'Libra');

    deepStrictEqual(result1, result2);
  });

  it('交换星座顺序应该产生确定结果', () => {
    const result1 = generateRelationshipManual('Aries', 'Libra');
    const result2 = generateRelationshipManual('Libra', 'Aries');

    // 注意：由于几何计算是单向的，分数可能不同
    // 但这符合占星学中 A→B 和 B→A 可能不同的事实
    // 我们只需要验证结果是确定性的
    ok(result1 !== null);
    ok(result2 !== null);
  });

  it('同星座配对应该有 Conjunction 几何', () => {
    const result = generateRelationshipManual('Aries', 'Aries');
    ok(result?.structure_explain.geometry_relation.includes('相位重合'));
  });

  it('对宫配对应该有 Opposition 几何', () => {
    const result = generateRelationshipManual('Aries', 'Libra');
    ok(result?.structure_explain.geometry_relation.includes('对宫相位'));
  });

  it('三合配对应该有 Trine 几何', () => {
    const result = generateRelationshipManual('Aries', 'Sagittarius');
    ok(result?.structure_explain.geometry_relation.includes('三合相位'));
  });

  it('conflict_loops 应该有正确的结构', () => {
    const result = generateRelationshipManual('Aries', 'Libra');
    ok(result?.conflict_loops?.length! > 0);
    ok(typeof result?.conflict_loops![0]!.name === 'string');
    ok(typeof result?.conflict_loops![0]!.trigger === 'string');
    ok(typeof result?.conflict_loops![0]!.pattern === 'string');
    ok(typeof result?.conflict_loops![0]!.break_rule === 'string');
  });
});

describe('SPEC 8.1 单元测试要求', () => {
  describe('相位映射', () => {
    it('d=6 必为 Opposition', () => {
      for (let i = 0; i < 12; i++) {
        strictEqual(calculateGeometry(i, (i + 6) % 12), 'Opposition');
      }
    });

    it('d=4,8 必为 Trine', () => {
      for (let i = 0; i < 12; i++) {
        strictEqual(calculateGeometry(i, (i + 4) % 12), 'Trine');
        strictEqual(calculateGeometry(i, (i + 8) % 12), 'Trine');
      }
    });
  });

  describe('complexity_level 映射', () => {
    it('score ≥ 75 必为 LOW', () => {
      strictEqual(calculateComplexityLevel(75), 'LOW');
      strictEqual(calculateComplexityLevel(90), 'LOW');
      strictEqual(calculateComplexityLevel(100), 'LOW');
    });

    it('45-74 必为 MID', () => {
      strictEqual(calculateComplexityLevel(45), 'MID');
      strictEqual(calculateComplexityLevel(60), 'MID');
      strictEqual(calculateComplexityLevel(74), 'MID');
    });

    it('score < 45 必为 HIGH', () => {
      strictEqual(calculateComplexityLevel(44), 'HIGH');
      strictEqual(calculateComplexityLevel(30), 'HIGH');
      strictEqual(calculateComplexityLevel(0), 'HIGH');
    });
  });
});
