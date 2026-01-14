
# Core SPEC v0.2

**星座情侣说明书 + 7 日关系日历**

---

## 0. 范围与原则

### 0.1 产品边界

本产品仅实现以下闭环：

**输入双方星座 → 输出关系结构说明（内容为主） → 输出 7 日关系日历（每日可执行行动）**

### 0.2 明确不做

* 用户系统（登录 / 注册 / 资料）
* 出生时间、上升、月亮、宫位
* 星座百科或文章系统
* 社交互动、评论、关注
* 付费、订阅
* 对外呈现“匹配度评分”

---

## 1. 产品目标

### 1.1 主要目标

* 用结构化文字解释情侣关系中的冲突来源
* 给出可执行、可验证的相处规则
* 通过 7 日关系日历促成短期回访行为

### 1.2 非目标

* 不判断关系好坏
* 不给“合 / 不合 / 适不适合”的结论
* 不提供情绪安慰或命运预测

---

## 2. 用户输入

### 2.1 输入参数（MVP）

```ts
signA: Zodiac // 12 星座之一
signB: Zodiac // 12 星座之一
```

---

## 3. 核心输出一：关系说明书

### 3.1 输出结构

```json
{
  "pair": { "a": "Aries", "b": "Libra" },

  "complexity_level": "LOW | MID | HIGH",
  "one_liner": "",

  "relationship_structure": "LongTermStable | HighChemistryHighFriction | ComfortableButStale | NeedsActiveAdjustment",

  "core_tension": "",

  "advantages": ["", ""],
  "risks": ["", ""],

  "conflict_loops": [
    {
      "name": "",
      "trigger": "",
      "pattern": "",
      "break_rule": ""
    }
  ],

  "interaction_rules": {
    "do": ["", "", ""],
    "dont": ["", "", ""]
  },

  "structure_explain": {
    "element_relation": "",
    "modality_relation": "",
    "geometry_relation": ""
  }
}
```

### 3.2 语义约束

* `complexity_level`
  表示**理解与维护成本**，不代表关系价值或前景

* `relationship_structure`
  描述关系运行形态，不构成建议或判断

* 所有文本：

  * 第三视角
  * 短句
  * 不使用“你应该 / 建议你”
  * 不出现“合 / 不合 / 匹配度”

---

## 4. 核心输出二：7 日关系日历

### 4.1 输出结构

```json
{
  "pair": { "a": "Aries", "b": "Libra" },
  "days": [
    {
      "date": "YYYY-MM-DD",
      "tone": "Smooth | Tense | Misunderstanding | Repair | Passion",
      "focus": "communication | boundaries | money | intimacy | plans | social",
      "window_or_risk": "",
      "action": ""
    }
  ]
}
```

### 4.2 生成约束

* 同一对星座 + 同一天 → 结果必须一致
* `action` 必须是明确行为指令
* 不使用运势语言，不承诺结果

---

## 5. 规则系统（内部计算）

### 5.1 星座基础数据

每个星座固定属性：

* `element`: Fire / Earth / Air / Water
* `modality`: Cardinal / Fixed / Mutable
* `index`: 0–11（白羊为 0，顺时针）

---

### 5.2 几何关系计算

```ts
d = (indexB - indexA + 12) % 12
```

映射关系：

* 0：Conjunction
* 6：Opposition
* 4, 8：Trine
* 2, 10：Sextile
* 3, 9：Square
* 1, 5, 7, 11：Minor

---

### 5.3 内部评分系统（不对外）

评分仅用于推导结构，不直接输出。

* 初始：50
* 元素、模式、几何相位加权
* 最终 clamp 到 0–100

---

### 5.4 complexity_level 映射

```ts
score >= 75  → LOW
45–74       → MID
score < 45  → HIGH
```

---

### 5.5 relationship_structure 判定优先级

1. HighChemistryHighFriction
2. LongTermStable
3. NeedsActiveAdjustment
4. ComfortableButStale

---

## 6. 页面与路由

### 6.1 星座输入页

* 路由：`/`
* 功能：选择双方星座 → 查看关系说明
* 不出现“匹配 / 评分”字样

---

### 6.2 关系说明书页

* 路由：`/match/[a]/[b]`
* 内容顺序固定：

  1. one_liner
  2. complexity_level
  3. relationship_structure
  4. core_tension
  5. advantages
  6. risks
  7. interaction_rules
  8. 进入 7 日关系日历

---

### 6.3 7 日关系日历页

* 路由：`/forecast/[a]/[b]`
* 展示 7 天列表
* 默认只显示 tone / focus / action

---

## 7. API（可选）

* `GET /api/match?a=&b=`
  → 返回关系说明书

* `GET /api/forecast?a=&b=&start=&days=7`
  → 返回 7 日关系日历

无数据库依赖，允许内存或缓存。

---

## 8. 测试与验收

### 8.1 单元测试

* 几何相位映射正确
* 分数始终在 0–100
* complexity_level 映射正确
* 日历生成具确定性

### 8.2 UI 验收

* 移动端首屏可读
* 无登录完成全流程
* 页面跳转正常

---

## 9. 禁止扩展清单

任何版本不得新增：

* 用户体系
* 星座百科
* 社交互动
* 付费订阅
* 情绪化判断输出

---

**V0.2 到此为止。**
