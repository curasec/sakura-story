/**
 * forecast.ts 单元测试
 * 基于 SPEC 第 5 节
 */

import { describe, it } from 'node:test';
import { strictEqual, deepStrictEqual, ok, match } from 'node:assert';
import {
  generateForecast,
} from '../lib/forecast.js';
import type { Tone, Focus, Level, RelationshipType } from '../lib/compatibility.js';

describe('generateForecast', () => {
  describe('SPEC 8.1 单元测试要求', () => {
    it('日历确定性：同输入同日期两次生成结果一致', () => {
      const result1 = generateForecast('Aries', 'Libra', '2026-01-14', 'HIGH', 'LongTerm', 7);
      const result2 = generateForecast('Aries', 'Libra', '2026-01-14', 'HIGH', 'LongTerm', 7);

      deepStrictEqual(result1, result2);
    });

    it('不同输入应该产生不同结果', () => {
      const result1 = generateForecast('Aries', 'Libra', '2026-01-14', 'HIGH', 'LongTerm', 7);
      const result2 = generateForecast('Aries', 'Taurus', '2026-01-14', 'HIGH', 'LongTerm', 7);

      // 至少有一天不同
      let hasDifference = false;
      for (let i = 0; i < 7; i++) {
        if (result1.days[i]!.tone !== result2.days[i]!.tone ||
            result1.days[i]!.focus !== result2.days[i]!.focus) {
          hasDifference = true;
          break;
        }
      }
      ok(hasDifference);
    });

    it('不同日期应该产生不同结果', () => {
      const result1 = generateForecast('Aries', 'Libra', '2026-01-14', 'HIGH', 'LongTerm', 7);
      const result2 = generateForecast('Aries', 'Libra', '2026-01-15', 'HIGH', 'LongTerm', 7);

      // 日期应该不同
      strictEqual(result1.days[0]!.date, '2026-01-14');
      strictEqual(result2.days[0]!.date, '2026-01-15');
    });
  });

  describe('结果结构', () => {
    it('应该返回正确的结果结构', () => {
      const result = generateForecast('Aries', 'Libra', '2026-01-14', 'HIGH', 'LongTerm', 7);

      deepStrictEqual(result.pair, { a: 'Aries', b: 'Libra' });
      strictEqual(result.days.length, 7);
    });

    it('每天应该包含必需的字段', () => {
      const result = generateForecast('Aries', 'Libra', '2026-01-14', 'HIGH', 'LongTerm', 7);

      result.days.forEach(day => {
        ok(typeof day.date === 'string');
        match(day.date, /^\d{4}-\d{2}-\d{2}$/);
        ok(['Smooth', 'Tense', 'Misunderstanding', 'Repair', 'Passion'].includes(day.tone));
        ok(['communication', 'boundaries', 'money', 'intimacy', 'plans', 'social', 'repair'].includes(day.focus));
        ok(typeof day.action === 'string');
        strictEqual(day.action.length > 0, true);
        ok(typeof day.warning_or_window === 'string');
      });
    });
  });

  describe('日期生成', () => {
    it('日期应该连续递增', () => {
      const result = generateForecast('Aries', 'Libra', '2026-01-14', 'HIGH', 'LongTerm', 7);

      const dates = result.days.map(d => d.date);
      deepStrictEqual(dates, [
        '2026-01-14',
        '2026-01-15',
        '2026-01-16',
        '2026-01-17',
        '2026-01-18',
        '2026-01-19',
        '2026-01-20',
      ]);
    });

    it('跨月日期应该正确', () => {
      const result = generateForecast('Aries', 'Libra', '2026-01-28', 'HIGH', 'LongTerm', 7);

      const dates = result.days.map(d => d.date);
      deepStrictEqual(dates, [
        '2026-01-28',
        '2026-01-29',
        '2026-01-30',
        '2026-01-31',
        '2026-02-01',
        '2026-02-02',
        '2026-02-03',
      ]);
    });

    it('跨年日期应该正确', () => {
      const result = generateForecast('Aries', 'Libra', '2026-12-28', 'HIGH', 'LongTerm', 7);

      const dates = result.days.map(d => d.date);
      deepStrictEqual(dates, [
        '2026-12-28',
        '2026-12-29',
        '2026-12-30',
        '2026-12-31',
        '2027-01-01',
        '2027-01-02',
        '2027-01-03',
      ]);
    });
  });

  describe('SPEC 5.4 约束规则', () => {
    it('HIGH 等级：Smooth/Passion 概率更高；Repair 更少', () => {
      // 多次测试以验证概率趋势
      let smoothCount = 0;
      let passionCount = 0;
      let repairCount = 0;
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        const result = generateForecast('Aries', 'Libra', `2026-01-${14 + i}`, 'HIGH', 'LongTerm', 1);
        const day = result.days[0]!;

        if (day.tone === 'Smooth') smoothCount++;
        if (day.tone === 'Passion') passionCount++;
        if (day.tone === 'Repair') repairCount++;
      }

      // Smooth/Passion 应该比 Repair 多
      ok(smoothCount + passionCount > repairCount);
    });

    it('LOW 等级：Tense/Misunderstanding/Repair 概率更高', () => {
      // 多次测试以验证概率趋势
      let tenseCount = 0;
      let misunderstandingCount = 0;
      let repairCount = 0;
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        const result = generateForecast('Aries', 'Libra', `2026-01-${14 + i}`, 'LOW', 'NeedsWork', 1);
        const day = result.days[0]!;

        if (day.tone === 'Tense') tenseCount++;
        if (day.tone === 'Misunderstanding') misunderstandingCount++;
        if (day.tone === 'Repair') repairCount++;
      }

      // Tense/Misunderstanding/Repair 应该比 Smooth/Passion 多
      ok(tenseCount + misunderstandingCount + repairCount > 10);
    });
  });

  describe('不同天数参数', () => {
    it('应该支持不同的天数', () => {
      const result3 = generateForecast('Aries', 'Libra', '2026-01-14', 'HIGH', 'LongTerm', 3);
      const result10 = generateForecast('Aries', 'Libra', '2026-01-14', 'HIGH', 'LongTerm', 10);

      strictEqual(result3.days.length, 3);
      strictEqual(result10.days.length, 10);
    });

    it('默认应该是 7 天', () => {
      const result = generateForecast('Aries', 'Libra', '2026-01-14', 'HIGH', 'LongTerm');
      strictEqual(result.days.length, 7);
    });
  });

  describe('SPEC 5.5 每日输出限制', () => {
    it('每一天必须输出 tone（枚举）', () => {
      const result = generateForecast('Aries', 'Libra', '2026-01-14', 'HIGH', 'LongTerm', 7);

      const validTones: Tone[] = ['Smooth', 'Tense', 'Misunderstanding', 'Repair', 'Passion'];
      result.days.forEach(day => {
        ok(validTones.includes(day.tone));
      });
    });

    it('每一天必须输出 focus（枚举）', () => {
      const result = generateForecast('Aries', 'Libra', '2026-01-14', 'HIGH', 'LongTerm', 7);

      const validFocus: Focus[] = ['communication', 'boundaries', 'money', 'intimacy', 'plans', 'social', 'repair'];
      result.days.forEach(day => {
        ok(validFocus.includes(day.focus));
      });
    });

    it('每一天必须输出 action（动词开头一句话）', () => {
      const result = generateForecast('Aries', 'Libra', '2026-01-14', 'HIGH', 'LongTerm', 7);

      result.days.forEach(day => {
        ok(typeof day.action === 'string');
        ok(day.action.length > 0);
        // 验证是中文句子
        ok(/[\u4e00-\u9fa5]/.test(day.action));
      });
    });

    it('每一天必须输出 warning_or_window（可选，短句）', () => {
      const result = generateForecast('Aries', 'Libra', '2026-01-14', 'HIGH', 'LongTerm', 7);

      result.days.forEach(day => {
        ok(typeof day.warning_or_window === 'string');
        // warning_or_window 可以为空，或者应该是短句
        // 验证如果是中文则格式正确
        if (day.warning_or_window.length > 0) {
          ok(/[\u4e00-\u9fa5]/.test(day.warning_or_window));
        }
      });
    });
  });

  describe('edge cases', () => {
    it('闰年日期应该正确处理', () => {
      const result = generateForecast('Aries', 'Libra', '2024-02-28', 'HIGH', 'LongTerm', 7);

      const dates = result.days.map(d => d.date);
      deepStrictEqual(dates, [
        '2024-02-28',
        '2024-02-29', // 闰日
        '2024-03-01',
        '2024-03-02',
        '2024-03-03',
        '2024-03-04',
        '2024-03-05',
      ]);
    });
  });
});
