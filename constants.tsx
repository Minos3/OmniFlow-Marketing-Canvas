import { NodeType, ScenarioTemplate, ToolbarCategory } from './types';

// Helper to create IDs
const id = () => Math.random().toString(36).substring(2, 9);

export const TOOLBAR_CATEGORIES: ToolbarCategory[] = [
  {
    title: '流程控制',
    items: [
      { type: NodeType.TRIGGER, subtype: 'start', label: '开始/触发', icon: 'PlayCircle', description: '监听用户行为或系统事件以启动流程' },
      { type: NodeType.CONDITION, subtype: 'condition', label: '判断条件', icon: 'GitBranch', description: '基于用户画像、订单属性等条件分流' },
      { type: NodeType.SPLIT, subtype: 'split', label: 'A/B 分流', icon: 'Split', description: '按比例随机分配流量进行 A/B 测试' },
      { type: NodeType.DELAY, subtype: 'delay', label: '延时等待', icon: 'Clock', description: '暂停一段时间或等待至特定时刻' },
      { type: NodeType.END, subtype: 'end', label: '流程结束', icon: 'Flag', description: '结束当前路径并统计转化结果' },
    ]
  },
  {
    title: '智能营销',
    items: [
      { type: NodeType.ACTION, subtype: 'ai_recommend', label: 'AI 商品推荐', icon: 'Sparkles', description: '基于用户历史行为的个性化推荐算法' },
      { type: NodeType.ACTION, subtype: 'coupon', label: '发放优惠券', icon: 'Ticket', description: '自动发放优惠券、红包或礼品卡' },
      { type: NodeType.ACTION, subtype: 'member_tag', label: '会员标签', icon: 'Tag', description: '为用户添加或移除画像标签' },
      { type: NodeType.ACTION, subtype: 'points', label: '赠送积分', icon: 'Coins', description: '增加或扣除会员积分余额' },
    ]
  },
  {
    title: '触达渠道',
    items: [
      { type: NodeType.ACTION, subtype: 'sms', label: '发送短信', icon: 'MessageSquare', description: '高到达率，支持短链追踪转化' },
      { type: NodeType.ACTION, subtype: 'app_push', label: 'App 推送', icon: 'Bell', description: '低成本移动端通知触达' },
      { type: NodeType.ACTION, subtype: 'wechat', label: '企业微信', icon: 'MessageCircle', description: '通过企微助手触达私域客户' },
      { type: NodeType.ACTION, subtype: 'email', label: '发送邮件', icon: 'Mail', description: '发送 EDM 邮件，适合长内容营销' },
    ]
  }
];

// --- SCENARIO 1: Periodic Nurturing (Baby Care SOP) ---
const s1_trigger = { id: 's1-1', type: 'custom', position: { x: 300, y: 0 }, data: { label: '支付成功: 1段奶粉', type: NodeType.TRIGGER, icon: 'ShoppingBag', subLabel: 'SOP 触发', stats: { entered: 12500, active: 12500, converted: 12500 } } };
const s1_delay1 = { id: 's1-2', type: 'custom', position: { x: 300, y: 150 }, data: { label: '等待 3 天 (体验期)', type: NodeType.DELAY, subtype: 'delay', icon: 'Clock', stats: { entered: 12500, active: 400, converted: 12100 } } };
const s1_action1 = { id: 's1-3', type: 'custom', position: { x: 300, y: 300 }, data: { label: '企微: 新手喂养指南', type: NodeType.ACTION, subtype: 'wechat', icon: 'MessageCircle', subLabel: '关怀型内容', stats: { entered: 12100, active: 0, converted: 11800 } } };
const s1_delay2 = { id: 's1-4', type: 'custom', position: { x: 300, y: 450 }, data: { label: '等待 25 天 (消耗期)', type: NodeType.DELAY, subtype: 'delay', icon: 'Clock', stats: { entered: 11800, active: 2500, converted: 9300 } } };
const s1_cond1 = { id: 's1-5', type: 'custom', position: { x: 300, y: 600 }, data: { label: '是否已复购?', type: NodeType.CONDITION, subtype: 'condition', icon: 'GitBranch', stats: { entered: 9300, active: 0, converted: 9300 } } };
const s1_end_win = { id: 's1-6', type: 'custom', position: { x: 500, y: 750 }, data: { label: '培育成功', type: NodeType.END, icon: 'Flag', subLabel: '自然复购', stats: { entered: 2100, active: 0, converted: 0 } } };
const s1_action2 = { id: 's1-7', type: 'custom', position: { x: 100, y: 750 }, data: { label: '短信: 专属85折券', type: NodeType.ACTION, subtype: 'sms', icon: 'Ticket', subLabel: '召回干预', stats: { entered: 7200, active: 0, converted: 1800 } } };

// --- SCENARIO 2: Behavior Trigger (Cart Abandonment) ---
const s2_trigger = { id: 's2-1', type: 'custom', position: { x: 300, y: 0 }, data: { label: '加入购物车', type: NodeType.TRIGGER, icon: 'ShoppingCart', subLabel: '高意向触发', stats: { entered: 45200, active: 45200, converted: 45200 } } };
const s2_delay1 = { id: 's2-2', type: 'custom', position: { x: 300, y: 150 }, data: { label: '等待 30 分钟', type: NodeType.DELAY, subtype: 'delay', icon: 'Clock', stats: { entered: 45200, active: 1200, converted: 44000 } } };
const s2_cond1 = { id: 's2-3', type: 'custom', position: { x: 300, y: 300 }, data: { label: '是否完成支付?', type: NodeType.CONDITION, subtype: 'condition', icon: 'DollarSign', stats: { entered: 44000, active: 0, converted: 44000 } } };
const s2_end1 = { id: 's2-4', type: 'custom', position: { x: 550, y: 450 }, data: { label: '流程结束', type: NodeType.END, icon: 'Flag', subLabel: '自行转化', stats: { entered: 12500, active: 0, converted: 0 } } };
const s2_action1 = { id: 's2-5', type: 'custom', position: { x: 150, y: 450 }, data: { label: 'App 推送: 您的商品在想您', type: NodeType.ACTION, subtype: 'app_push', icon: 'Bell', subLabel: '免费触达', stats: { entered: 31500, active: 0, converted: 31500 } } };
const s2_delay2 = { id: 's2-6', type: 'custom', position: { x: 150, y: 600 }, data: { label: '等待 24 小时', type: NodeType.DELAY, subtype: 'delay', icon: 'Clock', stats: { entered: 31500, active: 5000, converted: 26500 } } };
const s2_cond2 = { id: 's2-7', type: 'custom', position: { x: 150, y: 750 }, data: { label: '是否完成支付?', type: NodeType.CONDITION, subtype: 'condition', icon: 'DollarSign', stats: { entered: 26500, active: 0, converted: 26500 } } };
const s2_action2 = { id: 's2-8', type: 'custom', position: { x: -50, y: 900 }, data: { label: '短信: 限时免单抽奖', type: NodeType.ACTION, subtype: 'sms', icon: 'MessageSquare', subLabel: '付费触达 (最后尝试)', stats: { entered: 22000, active: 0, converted: 4500 } } };

// --- SCENARIO 3: Big Promo A/B (Pre-heat) ---
const s3_trigger = { id: 's3-1', type: 'custom', position: { x: 350, y: 0 }, data: { label: '双11预热: 晚8点', type: NodeType.TRIGGER, icon: 'Calendar', subLabel: '定时触发', stats: { entered: 100000, active: 100000, converted: 100000 } } };
const s3_split = { id: 's3-2', type: 'custom', position: { x: 350, y: 150 }, data: { label: '人群分流 (50/50)', type: NodeType.SPLIT, subtype: 'split', icon: 'Split', subLabel: '随机实验', stats: { entered: 100000, active: 0, converted: 100000 } } };
const s3_act_a = { id: 's3-3', type: 'custom', position: { x: 150, y: 300 }, data: { label: 'A组: 短信通道', type: NodeType.ACTION, subtype: 'sms', icon: 'MessageSquare', subLabel: '成本高/到达率高', stats: { entered: 50000, active: 0, converted: 48500 } } };
const s3_act_b = { id: 's3-4', type: 'custom', position: { x: 550, y: 300 }, data: { label: 'B组: App Push', type: NodeType.ACTION, subtype: 'app_push', icon: 'Bell', subLabel: '成本低/易被屏蔽', stats: { entered: 50000, active: 0, converted: 32000 } } };
const s3_delay = { id: 's3-5', type: 'custom', position: { x: 350, y: 450 }, data: { label: '统计观察期 (24h)', type: NodeType.DELAY, subtype: 'delay', icon: 'Timer', stats: { entered: 80500, active: 80500, converted: 0 } } };

// --- SCENARIO 4: New User First Order ---
const s4_trigger = { id: 's4-1', type: 'custom', position: { x: 300, y: 0 }, data: { label: '新用户注册成功', type: NodeType.TRIGGER, icon: 'UserPlus', stats: { entered: 2800, active: 2800, converted: 2800 } } };
const s4_action1 = { id: 's4-2', type: 'custom', position: { x: 300, y: 150 }, data: { label: '发放: 首单立减券', type: NodeType.ACTION, subtype: 'coupon', icon: 'Ticket', subLabel: '¥20 无门槛', stats: { entered: 2800, active: 0, converted: 2800 } } };
const s4_delay1 = { id: 's4-3', type: 'custom', position: { x: 300, y: 300 }, data: { label: '等待 48 小时', type: NodeType.DELAY, subtype: 'delay', icon: 'Clock', stats: { entered: 2800, active: 150, converted: 2650 } } };
const s4_cond1 = { id: 's4-4', type: 'custom', position: { x: 300, y: 450 }, data: { label: '优惠券是否使用?', type: NodeType.CONDITION, subtype: 'condition', icon: 'PackageCheck', stats: { entered: 2650, active: 0, converted: 2650 } } };
const s4_end_ok = { id: 's4-5', type: 'custom', position: { x: 500, y: 600 }, data: { label: '转化成功', type: NodeType.END, icon: 'Flag', stats: { entered: 850, active: 0, converted: 0 } } };
const s4_action2 = { id: 's4-6', type: 'custom', position: { x: 100, y: 600 }, data: { label: '邮件: 优惠券即将过期', type: NodeType.ACTION, subtype: 'email', icon: 'Mail', subLabel: '紧迫感营销', stats: { entered: 1800, active: 0, converted: 300 } } };
const s4_tag = { id: 's4-7', type: 'custom', position: { x: 100, y: 750 }, data: { label: '打标: 价格敏感型', type: NodeType.ACTION, subtype: 'member_tag', icon: 'Tag', stats: { entered: 1800, active: 0, converted: 1800 } } };

// --- SCENARIO 5: Price Drop Notification ---
const s5_trigger = { id: 's5-1', type: 'custom', position: { x: 300, y: 0 }, data: { label: '事件: 商品降价', type: NodeType.TRIGGER, icon: 'TrendingDown', subLabel: '系统监控', stats: { entered: 500, active: 500, converted: 500 } } };
const s5_cond1 = { id: 's5-2', type: 'custom', position: { x: 300, y: 150 }, data: { label: '用户收藏夹包含此品?', type: NodeType.CONDITION, subtype: 'condition', icon: 'ShoppingBag', stats: { entered: 500, active: 0, converted: 500 } } };
const s5_end_fail = { id: 's5-3', type: 'custom', position: { x: 500, y: 300 }, data: { label: '不触达', type: NodeType.END, icon: 'Flag', stats: { entered: 350, active: 0, converted: 0 } } };
const s5_cond2 = { id: 's5-4', type: 'custom', position: { x: 100, y: 300 }, data: { label: '会员等级 >= 黄金?', type: NodeType.CONDITION, subtype: 'condition', icon: 'Gem', subLabel: '优先高价值用户', stats: { entered: 150, active: 0, converted: 150 } } };
const s5_action = { id: 's5-5', type: 'custom', position: { x: 100, y: 450 }, data: { label: 'App 推送: 降价提醒', type: NodeType.ACTION, subtype: 'app_push', icon: 'BellRing', stats: { entered: 90, active: 0, converted: 45 } } };
const s5_action_sms = { id: 's5-6', type: 'custom', position: { x: -100, y: 450 }, data: { label: '短信: 降价提醒', type: NodeType.ACTION, subtype: 'sms', icon: 'MessageSquare', subLabel: '普通会员通道', stats: { entered: 60, active: 0, converted: 15 } } };

export const SCENARIOS: ScenarioTemplate[] = [
  {
    id: '1',
    name: '周期性用户培育 SOP',
    description: '针对奶粉、尿裤等周期性消耗品，建立"3-7-30"天复购提醒与育儿知识关怀自动化流程。',
    createdAt: '2023-10-24',
    creator: '张三',
    status: 'active',
    metrics: { conversionRate: '18.5%', revenue: '¥1,244,000' },
    nodes: [s1_trigger, s1_delay1, s1_action1, s1_delay2, s1_cond1, s1_end_win, s1_action2],
    edges: [
      { id: 'e1-1', source: 's1-1', target: 's1-2', sourceHandle: 'bottom', targetHandle: 'top' },
      { id: 'e1-2', source: 's1-2', target: 's1-3', sourceHandle: 'bottom', targetHandle: 'top' },
      { id: 'e1-3', source: 's1-3', target: 's1-4', sourceHandle: 'bottom', targetHandle: 'top' },
      { id: 'e1-4', source: 's1-4', target: 's1-5', sourceHandle: 'bottom', targetHandle: 'top' },
      { id: 'e1-5', source: 's1-5', target: 's1-6', label: '是', sourceHandle: 'right', targetHandle: 'top' },
      { id: 'e1-6', source: 's1-5', target: 's1-7', label: '否', sourceHandle: 'bottom', targetHandle: 'top' },
    ]
  },
  {
    id: '2',
    name: '高意向用户挽回 (Cart)',
    description: '针对加购未支付用户，在黄金30分钟内进行APP推送触达，24小时后对仍未支付用户进行短信补救。',
    createdAt: '2023-11-02',
    creator: '李四',
    status: 'active',
    metrics: { conversionRate: '12.3%', revenue: '¥845,200' },
    nodes: [s2_trigger, s2_delay1, s2_cond1, s2_end1, s2_action1, s2_delay2, s2_cond2, s2_action2],
    edges: [
      { id: 'e2-1', source: 's2-1', target: 's2-2', sourceHandle: 'bottom', targetHandle: 'top' },
      { id: 'e2-2', source: 's2-2', target: 's2-3', sourceHandle: 'bottom', targetHandle: 'top' },
      { id: 'e2-3', source: 's2-3', target: 's2-4', label: '是', sourceHandle: 'right', targetHandle: 'left' },
      { id: 'e2-4', source: 's2-3', target: 's2-5', label: '否', sourceHandle: 'bottom', targetHandle: 'top' },
      { id: 'e2-5', source: 's2-5', target: 's2-6', sourceHandle: 'bottom', targetHandle: 'top' },
      { id: 'e2-6', source: 's2-6', target: 's2-7', sourceHandle: 'bottom', targetHandle: 'top' },
      { id: 'e2-7', source: 's2-7', target: 's2-4', label: '是', sourceHandle: 'right', targetHandle: 'left' },
      { id: 'e2-8', source: 's2-7', target: 's2-8', label: '否', sourceHandle: 'bottom', targetHandle: 'top' },
    ]
  },
  {
    id: '3',
    name: '双11大促预热 A/B 测试',
    description: '在大促活动预热期，将流量进行50/50随机分流，测试高成本短信通道与低成本Push通道的ROI差异。',
    createdAt: '2023-11-10',
    creator: '王五',
    status: 'paused',
    metrics: { conversionRate: '4.1%', revenue: '¥330,000' },
    nodes: [s3_trigger, s3_split, s3_act_a, s3_act_b, s3_delay],
    edges: [
      { id: 'e3-1', source: 's3-1', target: 's3-2', sourceHandle: 'bottom', targetHandle: 'top' },
      { id: 'e3-2', source: 's3-2', target: 's3-3', label: '50%', sourceHandle: 'bottom', targetHandle: 'top' }, // Flowing Leftish
      { id: 'e3-3', source: 's3-2', target: 's3-4', label: '50%', sourceHandle: 'right', targetHandle: 'left' }, // Flowing Rightish
      { id: 'e3-4', source: 's3-3', target: 's3-5', sourceHandle: 'bottom', targetHandle: 'top' },
      { id: 'e3-5', source: 's3-4', target: 's3-5', sourceHandle: 'bottom', targetHandle: 'top' },
    ]
  },
  {
    id: '4',
    name: '新客首单转化激励',
    description: '针对新注册用户发放首单礼金，并监控卡券核销状态；未核销用户在过期前发送邮件提醒并打上“价格敏感”标签。',
    createdAt: '2023-11-15',
    creator: '赵六',
    status: 'draft',
    metrics: { conversionRate: '-', revenue: '-' },
    nodes: [s4_trigger, s4_action1, s4_delay1, s4_cond1, s4_end_ok, s4_action2, s4_tag],
    edges: [
      { id: 'e4-1', source: 's4-1', target: 's4-2', sourceHandle: 'bottom', targetHandle: 'top' },
      { id: 'e4-2', source: 's4-2', target: 's4-3', sourceHandle: 'bottom', targetHandle: 'top' },
      { id: 'e4-3', source: 's4-3', target: 's4-4', sourceHandle: 'bottom', targetHandle: 'top' },
      { id: 'e4-4', source: 's4-4', target: 's4-5', label: '是', sourceHandle: 'right', targetHandle: 'left' },
      { id: 'e4-5', source: 's4-4', target: 's4-6', label: '否', sourceHandle: 'bottom', targetHandle: 'top' },
      { id: 'e4-6', source: 's4-6', target: 's4-7', sourceHandle: 'bottom', targetHandle: 'top' },
    ]
  },
  {
    id: '5',
    name: '降价提醒通知 (Wishlist)',
    description: '实时监听商品价格变动事件，自动扫描用户收藏夹。针对黄金及以上会员发送App Push，普通会员发送短信。',
    createdAt: '2023-11-20',
    creator: '张三',
    status: 'active',
    metrics: { conversionRate: '22.5%', revenue: '¥42,400' },
    nodes: [s5_trigger, s5_cond1, s5_end_fail, s5_cond2, s5_action, s5_action_sms],
    edges: [
      { id: 'e5-1', source: 's5-1', target: 's5-2', sourceHandle: 'bottom', targetHandle: 'top' },
      { id: 'e5-2', source: 's5-2', target: 's5-3', label: '否', sourceHandle: 'right', targetHandle: 'left' },
      { id: 'e5-3', source: 's5-2', target: 's5-4', label: '是', sourceHandle: 'bottom', targetHandle: 'top' },
      { id: 'e5-4', source: 's5-4', target: 's5-5', label: '是', sourceHandle: 'bottom', targetHandle: 'top' },
      { id: 'e5-5', source: 's5-4', target: 's5-6', label: '否', sourceHandle: 'bottom', targetHandle: 'top' }, // SMS to the left, changed to bottom source
    ]
  }
];