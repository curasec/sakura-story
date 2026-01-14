/**
 * triggers → repair 配对库
 * 至少 40 对
 * trigger 是具体场景，repair 是单一可执行步骤
 */

export const TRIGGERS_REPAIR: Array<{
  topic: 'money' | 'boundaries' | 'communication' | 'jealousy' | 'time'
  pattern: string
  repair: string
}> = [
  // money
  {
    topic: 'money',
    pattern: '讨论消费预算时产生分歧',
    repair: '设定月度预算上限',
  },
  {
    topic: 'money',
    pattern: '对方隐瞒重大支出',
    repair: '建立财务公开机制',
  },
  {
    topic: 'money',
    pattern: '储蓄目标不一致',
    repair: '制定共同储蓄计划',
  },
  {
    topic: 'money',
    pattern: '投资意见分歧严重',
    repair: '约定投资决策流程',
  },
  {
    topic: 'money',
    pattern: '礼物花费引发不快',
    repair: '设定礼物预算范围',
  },
  {
    topic: 'money',
    pattern: '借贷问题反复出现',
    repair: '签署书面借条协议',
  },
  {
    topic: 'money',
    pattern: '餐饮开销差异过大',
    repair: '分摊餐饮账单费用',
  },
  {
    topic: 'money',
    pattern: '购物观念对立明显',
    repair: '分账号管理各自资金',
  },
  {
    topic: 'money',
    pattern: '对收入差距态度消极',
    repair: '公开讨论收入分配',
  },
  // boundaries
  {
    topic: 'boundaries',
    pattern: '频繁查看对方手机',
    repair: '删除对方设备密码',
  },
  {
    topic: 'boundaries',
    pattern: '对社交媒体记录过度好奇',
    repair: '尊重彼此社交隐私',
  },
  {
    topic: 'boundaries',
    pattern: '独处时间常被打扰',
    repair: '约定每天独处时段',
  },
  {
    topic: 'boundaries',
    pattern: '对个人日记缺乏尊重',
    repair: '停止查看私人笔记',
  },
  {
    topic: 'boundaries',
    pattern: '对朋友圈控制过严',
    repair: '允许对方自由社交',
  },
  {
    topic: 'boundaries',
    pattern: '追问对方行踪',
    repair: '只在工作时间询问',
  },
  {
    topic: 'boundaries',
    pattern: '对异性朋友频繁猜疑',
    repair: '认识对方核心好友',
  },
  {
    topic: 'boundaries',
    pattern: '对个人物品边界越界',
    repair: '尊重私人物品主权',
  },
  {
    topic: 'boundaries',
    pattern: '对同事关系过度敏感',
    repair: '了解正常同事交往',
  },
  // communication
  {
    topic: 'communication',
    pattern: '沉默处理矛盾',
    repair: '主动开启对话窗口',
  },
  {
    topic: 'communication',
    pattern: '冷战持续时间过长',
    repair: '规定最长冷处理时间',
  },
  {
    topic: 'communication',
    pattern: '在公共场合批评对方',
    repair: '私下提出改进建议',
  },
  {
    topic: 'communication',
    pattern: '频繁打断对方说话',
    repair: '数三秒后再回应',
  },
  {
    topic: 'communication',
    pattern: '说话时情绪失控',
    repair: '暂停谈话恢复冷静',
  },
  {
    topic: 'communication',
    pattern: '回避关键问题',
    repair: '预约专门时间讨论',
  },
  {
    topic: 'communication',
    pattern: '对沟通需求反应迟钝',
    repair: '及时回应对方信息',
  },
  {
    topic: 'communication',
    pattern: '说话时心不在焉',
    repair: '放下手机专心倾听',
  },
  // jealousy
  {
    topic: 'jealousy',
    pattern: '对前任话题过度敏感',
    repair: '不再主动提起前任',
  },
  {
    topic: 'jealousy',
    pattern: '参加活动时猜疑不断',
    repair: '专注于当下相处时光',
  },
  {
    topic: 'jealousy',
    pattern: '对异性朋友控制过严',
    repair: '接受对方正常社交',
  },
  {
    topic: 'jealousy',
    pattern: '对工作同事关系不信任',
    repair: '了解工作场景真实情况',
  },
  {
    topic: 'jealousy',
    pattern: '对社交软件信息过度分析',
    repair: '减少查看对方动态',
  },
  {
    topic: 'jealousy',
    pattern: '怀疑对方出轨频繁',
    repair: '直接沟通消除误解',
  },
  {
    topic: 'jealousy',
    pattern: '对过去经历反复追究',
    repair: '接受彼此过去的存在',
  },
  {
    topic: 'jealousy',
    pattern: '因为异性朋友争执',
    repair: '认识对方主要好友圈',
  },
  // time
  {
    topic: 'time',
    pattern: '约会时间观念差异大',
    repair: '约定等待宽限时间',
  },
  {
    topic: 'time',
    pattern: '周末安排无法达成一致',
    repair: '轮流选择周末活动',
  },
  {
    topic: 'time',
    pattern: '相处时间分配不均',
    repair: '调整每周相处频率',
  },
  {
    topic: 'time',
    pattern: '对加班出差缺乏理解',
    repair: '支持对方工作优先级',
  },
  {
    topic: 'time',
    pattern: '对个人时间占用不满',
    repair: '保护对方独处需求',
  },
  {
    topic: 'time',
    pattern: '假期规划经常冲突',
    repair: '提前协商假期安排',
  },
  {
    topic: 'time',
    pattern: '对作息时间调整争执',
    repair: '接受彼此睡眠习惯',
  },
  {
    topic: 'time',
    pattern: '早晨安排方式不同',
    repair: '约定起床后互不打扰',
  },
  {
    topic: 'time',
    pattern: '晚间时间分配分歧',
    repair: '协商各自晚间安排',
  },
  {
    topic: 'time',
    pattern: '对对方睡眠习惯不尊重',
    repair: '控制自己活动不影响休息',
  },
]
