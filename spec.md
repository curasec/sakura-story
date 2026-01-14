# Core SPEC：星座情侣配对 + 7日关系日历（交付给 Claude）

## 0. 范围声明

只做核心闭环：输入两星座 → 输出关系结论与可执行规则 → 输出 7 日关系日历（含每日行动）。不做用户系统、不做百科、不做出生时间、不做付费。

---

## 1. 产品目标

### 1.1 主要目标

* 给出可执行的关系结论，降低误判与无谓冲突。
* 让用户第二天回来查看“今日行动”。

### 1.2 非目标

* 不追求占星准确性到天象/宫位/上升/月亮。
* 不做社交、评论、关注、账号体系。

---

## 2. 用户输入与输出

### 2.1 输入（MVP）

* `signA`：12 星座之一（中文或英文代码）
* `signB`：12 星座之一

### 2.2 输出（配对结果）

必须输出结构化字段：

```json
{
  "pair": { "a": "Aries", "b": "Libra" },
  "score": 0,
  "level": "HIGH|MID|LOW",
  "one_liner": "",
  "relationship_type": "LongTerm|HighChemistryHighFriction|ComfortableButStale|NeedsWork",
  "attraction": [""],
  "advantages": ["", ""],
  "risks": ["", ""],
  "triggers": [
    { "topic": "money|boundaries|communication|jealousy|time", "pattern": "", "repair": "" }
  ],
  "rules": {
    "do": ["", "", ""],
    "dont": ["", "", ""]
  },
  "explain": {
    "element": "",
    "modality": "",
    "geometry": ""
  }
}
```

### 2.3 输出（7 日关系日历）

```json
{
  "pair": { "a": "Aries", "b": "Libra" },
  "days": [
    {
      "date": "2026-01-14",
      "tone": "Smooth|Tense|Misunderstanding|Repair|Passion",
      "focus": "communication|boundaries|money|intimacy|plans|social",
      "warning_or_window": "",
      "action": ""
    }
  ]
}
```

---

## 3. 页面与路由（仅 3 页）

### 3.1 配对输入页

* 路由：`/`
* 功能：选择双方星座（下拉/宫位按钮均可），点击“查看结论”跳转结果页。
* 验收：选择后可进入结果页；无登录、无额外步骤。

### 3.2 配对结果页

* 路由：`/match/[a]/[b]`
* 内容顺序不可扩展：

  1. one_liner
  2. level + score（可视化可选）
  3. relationship_type 标签
  4. advantages（2–3 条）
  5. risks（2–3 条）
  6. rules：do×3 / dont×3
  7. 入口：进入 7 日关系日历
* 验收：移动端首屏能看到 one_liner + level；向下滚动看到 rules 与日历入口。

### 3.3 7 日关系日历页

* 路由：`/forecast/[a]/[b]`
* 内容：7 日列表或日历视图，每天只显示 tone / focus / action（warning 可在展开里）。
* 验收：7 条完整天数据，刷新保持一致（同一天同一对星座不变）。

---

## 4. 规则系统（必须可解释、可测试、可扩展）

### 4.1 星座基础数据

每个星座固定属性：

* `element`: Fire/Earth/Air/Water
* `modality`: Cardinal/Fixed/Mutable
* `index`: 0..11（按白羊为 0，顺时针）

### 4.2 几何关系（基于 index 差值 d）

令 `d = (indexB - indexA + 12) % 12`，映射：

* `0`：Conjunction（同星座）
* `6`：Opposition（对宫）
* `4, 8`：Trine（三合）
* `2, 10`：Sextile（六合）
* `3, 9`：Square（刑）
* `1, 5, 7, 11`：Minor（次要相位，轻微影响）

### 4.3 配对分数（0–100）

初始化 `score = 50`，叠加三层分：

1. 元素（权重约 40）

* 同元素：+10
* 火-风：+8
* 土-水：+8
* 火-水：-6
* 火-土：-6
* 风-水：-4
* 风-土：-4

2. 模式（权重约 25）

* 同模式：+6（稳定但可能固执/僵化）
* 本位 vs 固定：-2
* 固定 vs 变动：-2
* 本位 vs 变动：+2

3. 几何相位（权重约 35）

* Conjunction：+6
* Trine：+18
* Sextile：+12
* Opposition：+8（吸引强但波动）
* Square：-12
* Minor：0

收敛：`score = clamp(score, 0, 100)`

### 4.4 等级 level

* `HIGH`：score ≥ 70
* `MID`：40 ≤ score < 70
* `LOW`：score < 40

### 4.5 relationship_type 判定（规则优先级）

按优先级匹配第一个：

1. `HighChemistryHighFriction`：Opposition 且 score 介于 45–75 或存在 Square 且 score ≥ 55
2. `LongTerm`：score ≥ 75 且非 Square 主导
3. `NeedsWork`：score < 45
4. `ComfortableButStale`：同元素或同模式加分多但几何为 Minor/Conjunction，且 score 55–75

### 4.6 文案生成（模板化，不使用大模型也能跑）

* one_liner：按 `relationship_type + element_relation + geometry` 选模板
* advantages/risks/triggers/rules：从预置库按组合抽取 2–3 条
* 约束：输出条目必须短句、动词开头、可执行

---

## 5. 7 日关系日历生成（确定性）

### 5.1 目标

同一对星座在同一天生成的日历必须一致（避免用户困惑）。

### 5.2 确定性种子

`seed = hash(date + ":" + signA + ":" + signB)`
用伪随机（如 mulberry32）从主题库抽样。

### 5.3 主题库

focus 枚举：

* communication, boundaries, money, intimacy, plans, social, repair

tone 枚举：

* Smooth, Tense, Misunderstanding, Repair, Passion

### 5.4 约束规则

* `HIGH`：Smooth/Passion 概率更高；Repair 更少
* `LOW`：Tense/Misunderstanding/Repair 概率更高
* `HighChemistryHighFriction`：Passion 与 Misunderstanding 同时更高

### 5.5 每日输出限制

每一天必须输出：

* `tone`（枚举）
* `focus`（枚举）
* `action`（动词开头一句话）
* `warning_or_window`（可选，短句）

---

## 6. API 设计（若用 Next.js Route Handlers）

* `GET /api/match?a=Aries&b=Libra`

  * 返回配对结果 JSON（第 2.2）
* `GET /api/forecast?a=Aries&b=Libra&start=2026-01-14&days=7`

  * 返回 7 日 JSON（第 2.3）

要求：纯计算即可，不依赖数据库；DB 仅作为可选缓存（MVP 可不落库）。

---

## 7. 代码结构（建议）

* `lib/signs.ts`：12 星座属性表
* `lib/compatibility.ts`：计算分数 + 类型 + 文案选择
* `lib/forecast.ts`：确定性 7 日生成器
* `app/match/[a]/[b]/page.tsx`
* `app/forecast/[a]/[b]/page.tsx`

---

## 8. 测试与验收（必须有）

### 8.1 单元测试

* 相位映射：d=6 必为 Opposition，d=4/8 必为 Trine 等
* 分数边界：永远 0–100
* 结果结构：字段齐全、不为空（必要字段）
* 日历确定性：同输入同日期两次生成结果一致

### 8.2 UI 验收

* 移动端首屏可读
* 不需要登录即可完成全流程
* 结果页到日历页跳转正常

---

## 9. 明确的“禁止扩展”

Claude 不得新增：

* 登录/注册/用户资料
* 出生时间/上升/月亮/宫位
* 星座百科/文章系统
* 支付与订阅
* 社交互动（评论/关注）

---
