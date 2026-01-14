/**
 * signs.ts 单元测试
 */

import { describe, it } from 'node:test';
import { strictEqual, deepStrictEqual, ok, notStrictEqual } from 'node:assert';
import {
  SIGNS,
  getSignByCode,
  getSignByName,
  getSignByIndex,
  getAllSignCodes,
  isValidSignCode,
} from '../lib/signs.js';

describe('SIGNS 常量', () => {
  it('应该包含 12 个星座', () => {
    strictEqual(SIGNS.length, 12);
  });

  it('每个星座应该有必需的属性', () => {
    SIGNS.forEach(sign => {
      ok(typeof sign.name === 'string');
      ok(typeof sign.code === 'string');
      ok(typeof sign.element === 'string');
      ok(typeof sign.modality === 'string');
      ok(typeof sign.index === 'number');
    });
  });

  it('index 应该从 0 到 11 且唯一', () => {
    const indices = SIGNS.map(s => s.index);
    strictEqual(indices.length, 12);
    strictEqual(new Set(indices).size, 12);
    ok(indices.every(i => i >= 0 && i <= 11));
  });

  it('白羊座 index 应该是 0', () => {
    const aries = SIGNS.find(s => s.code === 'Aries');
    strictEqual(aries?.index, 0);
  });

  it('elements 应该包含 Fire/Earth/Air/Water', () => {
    const elements = new Set(SIGNS.map(s => s.element));
    ok(elements.has('Fire'));
    ok(elements.has('Earth'));
    ok(elements.has('Air'));
    ok(elements.has('Water'));
  });

  it('modalities 应该包含 Cardinal/Fixed/Mutable', () => {
    const modalities = new Set(SIGNS.map(s => s.modality));
    ok(modalities.has('Cardinal'));
    ok(modalities.has('Fixed'));
    ok(modalities.has('Mutable'));
  });

  it('同元素的星座应该有 3 个', () => {
    const elements = ['Fire', 'Earth', 'Air', 'Water'] as const;
    elements.forEach(el => {
      const count = SIGNS.filter(s => s.element === el).length;
      strictEqual(count, 3);
    });
  });

  it('同模式的星座应该有 4 个', () => {
    const modalities = ['Cardinal', 'Fixed', 'Mutable'] as const;
    modalities.forEach(mod => {
      const count = SIGNS.filter(s => s.modality === mod).length;
      strictEqual(count, 4);
    });
  });
});

describe('getSignByCode', () => {
  it('应该正确返回星座', () => {
    strictEqual(getSignByCode('Aries')?.code, 'Aries');
    strictEqual(getSignByCode('aries')?.code, 'Aries');
    strictEqual(getSignByCode('TAURUS')?.code, 'Taurus');
  });

  it('无效代码应该返回 null', () => {
    strictEqual(getSignByCode('Invalid'), null);
    strictEqual(getSignByCode(''), null);
  });

  it('应该能找到所有星座', () => {
    const codes = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    codes.forEach(code => {
      strictEqual(getSignByCode(code)?.code, code);
    });
  });
});

describe('getSignByName', () => {
  it('应该正确返回星座', () => {
    strictEqual(getSignByName('白羊座')?.code, 'Aries');
    strictEqual(getSignByName('金牛座')?.code, 'Taurus');
  });

  it('无效名称应该返回 null', () => {
    strictEqual(getSignByName('Invalid'), null);
    strictEqual(getSignByName(''), null);
  });

  it('应该能找到所有星座', () => {
    const names = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];
    names.forEach(name => {
      strictEqual(getSignByName(name)?.name, name);
    });
  });
});

describe('getSignByIndex', () => {
  it('应该正确返回星座', () => {
    strictEqual(getSignByIndex(0)?.code, 'Aries');
    strictEqual(getSignByIndex(1)?.code, 'Taurus');
    strictEqual(getSignByIndex(6)?.code, 'Libra');
    strictEqual(getSignByIndex(11)?.code, 'Pisces');
  });

  it('无效索引应该返回 null', () => {
    strictEqual(getSignByIndex(-1), null);
    strictEqual(getSignByIndex(12), null);
    strictEqual(getSignByIndex(100), null);
  });
});

describe('getAllSignCodes', () => {
  it('应该返回所有星座代码', () => {
    const codes = getAllSignCodes();
    strictEqual(codes.length, 12);
    ok(codes.includes('Aries'));
    ok(codes.includes('Pisces'));
  });
});

describe('isValidSignCode', () => {
  it('有效代码应该返回 true', () => {
    ok(isValidSignCode('Aries'));
    ok(isValidSignCode('aries'));
    ok(isValidSignCode('TAURUS'));
  });

  it('无效代码应该返回 false', () => {
    ok(!isValidSignCode('Invalid'));
    ok(!isValidSignCode(''));
    ok(!isValidSignCode('AR'));
  });
});
