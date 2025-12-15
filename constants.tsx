import { NodeType, ScenarioTemplate, ToolbarCategory } from './types';

// Helper to create IDs
const id = () => Math.random().toString(36).substring(2, 9);

export const TOOLBAR_CATEGORIES: ToolbarCategory[] = [
  {
    title: '流程控制',
    items: [
      { type: NodeType.TRIGGER, subtype: 'start', label: '开始/触发', icon: 'PlayCircle', description: '流程的起点' },
      { type: NodeType.CONDITION, subtype: 'condition', label: '判断条件', icon: 'GitBranch', description: '基于属性筛选' },
      { type: NodeType.SPLIT, subtype: 'split', label: 'A/B 分流', icon: 'Split', description: '流量随机分配' },
      { type: NodeType.DELAY, subtype: 'delay', label: '延时等待', icon: 'Clock', description: '暂停一段时间' },
    ]
  },
  {
    title: '智能营销',
    items: [
      { type: NodeType.ACTION, subtype: 'ai_recommend', label: 'AI 商品推荐', icon: 'Sparkles', description: '千人千面推荐' },
      { type: NodeType.ACTION, subtype: 'coupon', label: '发放优惠券', icon: 'Ticket', description: '自动发券' },
      { type: NodeType.ACTION, subtype: 'member_tag', label: '会员标签', icon: 'Tag', description: '打标/去标' },
      { type: NodeType.ACTION, subtype: 'points', label: '赠送积分', icon: 'Coins', description: '会员积分变更' },
    ]
  },
  {
    title: '触达渠道',
    items: [
      { type: NodeType.ACTION, subtype: 'sms', label: '发送短信', icon: 'MessageSquare', description: '高触达率' },
      { type: NodeType.ACTION, subtype: 'app_push', label: 'App 推送', icon: 'Bell', description: '应用通知' },
      { type: NodeType.ACTION, subtype: 'wechat', label: '企业微信', icon: 'MessageCircle', description: '私域运营' },
      { type: NodeType.ACTION, subtype: 'email', label: '发送邮件', icon: 'Mail', description: '内容营销' },
    ]
  }
];

// --- SCENARIO 1: Periodic Nurturing ---
const s1_trigger = { id: 's1-1', type: 'custom', position: { x: 250, y: 0 }, data: { label: '购买: 1段奶粉', type: NodeType.TRIGGER, icon: 'ShoppingBag', subLabel: '周期开始' } };
const s1_delay1 = { id: 's1-2', type: 'custom', position: { x: 250, y: 150 }, data: { label: '等待 7 天', type: NodeType.DELAY, subtype: 'delay', icon: 'Clock' } };
const s1_action1 = { id: 's1-3', type: 'custom', position: { x: 250, y: 300 }, data: { label: 'AI 育儿知识', type: NodeType.ACTION, subtype: 'ai_recommend', icon: 'Sparkles' } };
const s1_delay2 = { id: 's1-4', type: 'custom', position: { x: 250, y: 450 }, data: { label: '等待 8 天 (第15天)', type: NodeType.DELAY, subtype: 'delay', icon: 'Clock' } };
const s1_action2 = { id: 's1-5', type: 'custom', position: { x: 250, y: 600 }, data: { label: 'AI 商品推荐', type: NodeType.ACTION, subtype: 'ai_recommend', icon: 'Sparkles' } };
const s1_delay3 = { id: 's1-6', type: 'custom', position: { x: 250, y: 750 }, data: { label: '等待 10 天 (第25天)', type: NodeType.DELAY, subtype: 'delay', icon: 'Clock' } };
const s1_action3 = { id: 's1-7', type: 'custom', position: { x: 250, y: 900 }, data: { label: '发放: 复购券', type: NodeType.ACTION, subtype: 'coupon', icon: 'Ticket' } };

// --- SCENARIO 2: Behavior Trigger ---
const s2_trigger = { id: 's2-1', type: 'custom', position: { x: 250, y: 0 }, data: { label: '浏览商品 > 3次', type: NodeType.TRIGGER, icon: 'Eye', subLabel: '高意向用户' } };
const s2_cond1 = { id: 's2-2', type: 'custom', position: { x: 250, y: 150 }, data: { label: '是否加入购物车?', type: NodeType.CONDITION, subtype: 'condition', icon: 'ShoppingCart' } };
const s2_cond2 = { id: 's2-3', type: 'custom', position: { x: 450, y: 300 }, data: { label: '消费金额 > 500元?', type: NodeType.CONDITION, subtype: 'condition', icon: 'DollarSign' } };
const s2_action = { id: 's2-4', type: 'custom', position: { x: 450, y: 450 }, data: { label: '企微: 发送专属券', type: NodeType.ACTION, subtype: 'wechat', icon: 'MessageCircle' } };

// --- SCENARIO 3: Big Promo A/B ---
const s3_trigger = { id: 's3-1', type: 'custom', position: { x: 300, y: 0 }, data: { label: '大促活动开始', type: NodeType.TRIGGER, icon: 'Calendar' } };
const s3_split = { id: 's3-2', type: 'custom', position: { x: 300, y: 150 }, data: { label: '人群分流', type: NodeType.SPLIT, subtype: 'split', icon: 'GitPullRequest', subLabel: '已去重' } };
const s3_a = { id: 's3-3', type: 'custom', position: { x: 100, y: 300 }, data: { label: 'A组: 50%', type: NodeType.CONDITION, subtype: 'condition', icon: 'Users' } };
const s3_b = { id: 's3-4', type: 'custom', position: { x: 500, y: 300 }, data: { label: 'B组: 50%', type: NodeType.CONDITION, subtype: 'condition', icon: 'Users' } };
const s3_act_a = { id: 's3-5', type: 'custom', position: { x: 100, y: 450 }, data: { label: '短信触达', type: NodeType.ACTION, subtype: 'sms', icon: 'MessageSquare' } };
const s3_act_b = { id: 's3-6', type: 'custom', position: { x: 500, y: 450 }, data: { label: 'App 推送', type: NodeType.ACTION, subtype: 'app_push', icon: 'Bell' } };

// --- SCENARIO 4: Acquisition ---
const s4_trigger = { id: 's4-1', type: 'custom', position: { x: 300, y: 0 }, data: { label: '分群: 新注册会员', type: NodeType.TRIGGER, icon: 'UserPlus' } };
const s4_time = { id: 's4-2', type: 'custom', position: { x: 300, y: 150 }, data: { label: '等待: 活跃时间 (晚8点)', type: NodeType.DELAY, subtype: 'delay', icon: 'Moon' } };
const s4_split = { id: 's4-3', type: 'custom', position: { x: 300, y: 300 }, data: { label: 'A/B 测试', type: NodeType.SPLIT, subtype: 'split', icon: 'FlaskConical' } };
const s4_gift = { id: 's4-4', type: 'custom', position: { x: 100, y: 450 }, data: { label: '发放: 新人礼包', type: NodeType.ACTION, subtype: 'coupon', icon: 'Gift' } };
const s4_flash = { id: 's4-5', type: 'custom', position: { x: 500, y: 450 }, data: { label: '推送: 限时秒杀', type: NodeType.ACTION, subtype: 'app_push', icon: 'Zap' } };
const s4_crm = { id: 's4-6', type: 'custom', position: { x: 300, y: 600 }, data: { label: '打标: 潜在客户', type: NodeType.ACTION, subtype: 'member_tag', icon: 'Tag' } };

// --- SCENARIO 5: Price Drop ---
const s5_trigger = { id: 's5-1', type: 'custom', position: { x: 250, y: 0 }, data: { label: '事件: 商品降价', type: NodeType.TRIGGER, icon: 'TrendingDown' } };
const s5_cond = { id: 's5-2', type: 'custom', position: { x: 250, y: 150 }, data: { label: '购物车包含此商品?', type: NodeType.CONDITION, subtype: 'condition', icon: 'ShoppingCart' } };
const s5_action = { id: 's5-3', type: 'custom', position: { x: 250, y: 300 }, data: { label: '通知: 降价提醒', type: NodeType.ACTION, subtype: 'app_push', icon: 'BellRing' } };

export const SCENARIOS: ScenarioTemplate[] = [
  {
    id: '1',
    name: '周期性用户培育',
    description: '针对奶粉等周期性商品，建立30天复购提醒与育儿知识关怀SOP。',
    createdAt: '2023-10-24',
    status: 'active',
    metrics: { conversionRate: '12.5%', revenue: '¥124,000' },
    nodes: [s1_trigger, s1_delay1, s1_action1, s1_delay2, s1_action2, s1_delay3, s1_action3],
    edges: [
      { id: 'e1-1', source: 's1-1', target: 's1-2' },
      { id: 'e1-2', source: 's1-2', target: 's1-3' },
      { id: 'e1-3', source: 's1-3', target: 's1-4' },
      { id: 'e1-4', source: 's1-4', target: 's1-5' },
      { id: 'e1-5', source: 's1-5', target: 's1-6' },
      { id: 'e1-6', source: 's1-6', target: 's1-7' },
    ]
  },
  {
    id: '2',
    name: '高意向用户召回',
    description: '当用户浏览商品超过3次且加入购物车时，通过企微发送专属优惠券。',
    createdAt: '2023-11-02',
    status: 'active',
    metrics: { conversionRate: '8.3%', revenue: '¥45,200' },
    nodes: [s2_trigger, s2_cond1, s2_cond2, s2_action],
    edges: [
      { id: 'e2-1', source: 's2-1', target: 's2-2' },
      { id: 'e2-2', source: 's2-2', target: 's2-3', label: '是' },
      { id: 'e2-3', source: 's2-3', target: 's2-4', label: '是' },
    ]
  },
  {
    id: '3',
    name: '大促 A/B 测试',
    description: '在大促活动开始时，将流量进行50/50分流，测试短信与APP推送的转化效果。',
    createdAt: '2023-11-10',
    status: 'paused',
    metrics: { conversionRate: '4.1%', revenue: '¥330,000' },
    nodes: [s3_trigger, s3_split, s3_a, s3_b, s3_act_a, s3_act_b],
    edges: [
      { id: 'e3-1', source: 's3-1', target: 's3-2' },
      { id: 'e3-2', source: 's3-2', target: 's3-3' },
      { id: 'e3-3', source: 's3-2', target: 's3-4' },
      { id: 'e3-4', source: 's3-3', target: 's3-act-a' },
      { id: 'e3-5', source: 's3-4', target: 's3-act-b' },
    ]
  },
  {
    id: '4',
    name: '新客首单转化',
    description: '针对新注册会员，在晚间活跃高峰期推送不同权益（礼包vs秒杀）进行测试。',
    createdAt: '2023-11-15',
    status: 'draft',
    metrics: { conversionRate: '-', revenue: '-' },
    nodes: [s4_trigger, s4_time, s4_split, s4_gift, s4_flash, s4_crm],
    edges: [
      { id: 'e4-1', source: 's4-1', target: 's4-2' },
      { id: 'e4-2', source: 's4-2', target: 's4-3' },
      { id: 'e4-3', source: 's4-3', target: 's4-gift' },
      { id: 'e4-4', source: 's4-3', target: 's4-flash' },
      { id: 'e4-5', source: 's4-gift', target: 's4-crm' },
      { id: 'e4-6', source: 's4-flash', target: 's4-crm' },
    ]
  },
  {
    id: '5',
    name: '降价提醒通知',
    description: '监听商品价格变动事件，自动检查用户购物车并发送降价提醒。',
    createdAt: '2023-11-20',
    status: 'active',
    metrics: { conversionRate: '15.2%', revenue: '¥12,400' },
    nodes: [s5_trigger, s5_cond, s5_action],
    edges: [
      { id: 'e5-1', source: 's5-1', target: 's5-2' },
      { id: 'e5-2', source: 's5-2', target: 's5-3', label: '是' },
    ]
  }
];