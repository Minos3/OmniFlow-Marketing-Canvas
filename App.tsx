import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  MarkerType,
  MiniMap,
  Panel,
} from 'reactflow';
import Sidebar from './components/Sidebar';
import ConfigPanel from './components/ConfigPanel';
import CustomNode from './components/CustomNode';
import CanvasAnalytics from './components/CanvasAnalytics';
import { SCENARIOS } from './constants';
import { AppNode, NodeType, AppEdge, CampaignSettings, CampaignType, AttributionType } from './types';
import { 
    Play, RotateCcw, Save, Layout, CheckCircle2, Plus, 
    ArrowRight, ChevronLeft, GitFork, Calendar, BarChart3, 
    MoreHorizontal, Edit3, Sparkles, UserPlus, ShoppingCart, 
    UserX, Gem, Check, X, Loader2, Cake, Megaphone, PackageCheck,
    AlertTriangle, ShieldCheck, Clock, MousePointerClick, Timer, Sliders, Zap,
    Search, Filter, User
} from 'lucide-react';

// Register custom node types
const nodeTypes = {
  custom: CustomNode,
};

// --- Helper: Generate AI Template ---
const generateTemplate = (audienceType: string): { nodes: AppNode[], edges: AppEdge[] } => {
    const id = () => Math.random().toString(36).substring(2, 9);
    const nodes: AppNode[] = [];
    const edges: AppEdge[] = [];

    const createNode = (
        idStr: string, type: NodeType, label: string, x: number, y: number, 
        icon?: string, subtype?: string, subLabel?: string
    ): AppNode => ({
        id: idStr,
        type: 'custom',
        position: { x, y },
        data: { type, label, icon, subtype, subLabel }
    });

    const createEdge = (source: string, target: string, label?: string): AppEdge => ({
        id: `e-${source}-${target}`,
        source,
        target,
        label,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
        style: { stroke: '#94a3b8', strokeWidth: 2 },
    });

    if (audienceType === 'new_users') {
        // Strategy: Welcome -> Delay -> Coupon -> Reminder
        const n1 = id(), n2 = id(), n3 = id(), n4 = id(), n5 = id();
        nodes.push(createNode(n1, NodeType.TRIGGER, '新用户注册', 250, 0, 'UserPlus', 'trigger', '实时触发'));
        nodes.push(createNode(n2, NodeType.DELAY, '等待 10 分钟', 250, 150, 'Clock', 'delay'));
        nodes.push(createNode(n3, NodeType.ACTION, '发放: 新人专享券', 250, 300, 'Ticket', 'coupon'));
        nodes.push(createNode(n4, NodeType.DELAY, '等待 2 天', 250, 450, 'Clock', 'delay'));
        nodes.push(createNode(n5, NodeType.ACTION, '短信: 优惠券过期提醒', 250, 600, 'MessageSquare', 'sms'));
        
        edges.push(createEdge(n1, n2));
        edges.push(createEdge(n2, n3));
        edges.push(createEdge(n3, n4));
        edges.push(createEdge(n4, n5));

    } else if (audienceType === 'cart_abandon') {
        // Strategy: Add Cart -> Wait -> Check -> Push/Email
        const n1 = id(), n2 = id(), n3 = id(), n4 = id(), n5 = id();
        nodes.push(createNode(n1, NodeType.TRIGGER, '加入购物车', 250, 0, 'ShoppingCart', 'trigger'));
        nodes.push(createNode(n2, NodeType.DELAY, '等待 60 分钟', 250, 150, 'Clock', 'delay'));
        nodes.push(createNode(n3, NodeType.CONDITION, '是否完成支付?', 250, 300, 'GitBranch', 'condition'));
        nodes.push(createNode(n4, NodeType.ACTION, 'App 推送: 您的商品还在等您', 100, 450, 'Bell', 'app_push'));
        nodes.push(createNode(n5, NodeType.ACTION, '邮件: 专属 95 折挽回', 400, 450, 'Mail', 'email'));

        edges.push(createEdge(n1, n2));
        edges.push(createEdge(n2, n3));
        edges.push(createEdge(n3, n4, '否 (低客单)'));
        edges.push(createEdge(n3, n5, '否 (高客单)'));

    } else if (audienceType === 'vip') {
        // Strategy: High Spend -> Tag -> SMS -> Points
        const n1 = id(), n2 = id(), n3 = id(), n4 = id();
        nodes.push(createNode(n1, NodeType.TRIGGER, '支付金额 > 2000元', 250, 0, 'DollarSign', 'trigger'));
        nodes.push(createNode(n2, NodeType.ACTION, '打标: SVIP 客户', 250, 150, 'Gem', 'member_tag'));
        nodes.push(createNode(n3, NodeType.ACTION, '赠送: 1000 积分', 250, 300, 'Coins', 'points'));
        nodes.push(createNode(n4, NodeType.ACTION, '企微: 专属管家问候', 250, 450, 'MessageCircle', 'wechat'));

        edges.push(createEdge(n1, n2));
        edges.push(createEdge(n2, n3));
        edges.push(createEdge(n3, n4));

    } else if (audienceType === 'churn') {
        // Strategy: Inactive -> Split -> A/B
        const n1 = id(), n2 = id(), n3 = id(), n4 = id();
        nodes.push(createNode(n1, NodeType.TRIGGER, '未登录 > 30天', 250, 0, 'UserX', 'trigger'));
        nodes.push(createNode(n2, NodeType.SPLIT, 'A/B 测试: 召回策略', 250, 150, 'Split', 'split'));
        nodes.push(createNode(n3, NodeType.ACTION, '策略 A: 大额优惠券', 100, 300, 'Ticket', 'coupon'));
        nodes.push(createNode(n4, NodeType.ACTION, '策略 B: 新品种草推送', 400, 300, 'Sparkles', 'ai_recommend'));

        edges.push(createEdge(n1, n2));
        edges.push(createEdge(n2, n3, '50%'));
        edges.push(createEdge(n2, n4, '50%'));

    } else if (audienceType === 'cross_sell') {
        // Strategy: Purchase -> Wait -> Condition (High Value?) -> Cross sell logic
        const n1 = id(), n2 = id(), n3 = id(), n4 = id(), n5 = id();
        nodes.push(createNode(n1, NodeType.TRIGGER, '订单状态: 已确认收货', 250, 0, 'PackageCheck', 'trigger'));
        nodes.push(createNode(n2, NodeType.DELAY, '等待 3 天 (使用体验期)', 250, 150, 'Clock', 'delay'));
        nodes.push(createNode(n3, NodeType.CONDITION, '订单金额 > 500?', 250, 300, 'GitBranch', 'condition'));
        nodes.push(createNode(n4, NodeType.ACTION, 'AI 推荐: 关联高奢配件', 100, 450, 'Sparkles', 'ai_recommend'));
        nodes.push(createNode(n5, NodeType.ACTION, '推荐: 耗材/补充装 + 9折券', 400, 450, 'Ticket', 'coupon'));
        
        edges.push(createEdge(n1, n2));
        edges.push(createEdge(n2, n3));
        edges.push(createEdge(n3, n4, '是'));
        edges.push(createEdge(n3, n5, '否'));

    } else if (audienceType === 'birthday') {
        // Strategy: Birthday Trigger -> Gift -> Follow up
        const n1 = id(), n2 = id(), n3 = id(), n4 = id();
        nodes.push(createNode(n1, NodeType.TRIGGER, '今日是用户生日', 250, 0, 'Cake', 'trigger'));
        nodes.push(createNode(n2, NodeType.ACTION, '短信: 生日祝福 + 神秘礼包', 250, 150, 'Gift', 'sms'));
        nodes.push(createNode(n3, NodeType.DELAY, '等待 24 小时', 250, 300, 'Clock', 'delay'));
        nodes.push(createNode(n4, NodeType.ACTION, 'App 推送: 您的生日礼遇即将过期', 250, 450, 'Bell', 'app_push'));

        edges.push(createEdge(n1, n2));
        edges.push(createEdge(n2, n3));
        edges.push(createEdge(n3, n4));

    } else if (audienceType === 'festival') {
        // Strategy: Countdown -> Start -> Last Call
        const n1 = id(), n2 = id(), n3 = id(), n4 = id(), n5 = id(), n6 = id();
        nodes.push(createNode(n1, NodeType.TRIGGER, '大促开始前 3 天', 250, 0, 'Calendar', 'trigger'));
        nodes.push(createNode(n2, NodeType.ACTION, '公众号: 活动预告清单', 250, 150, 'MessageCircle', 'wechat'));
        nodes.push(createNode(n3, NodeType.DELAY, '等待 3 天', 250, 300, 'Clock', 'delay'));
        nodes.push(createNode(n4, NodeType.ACTION, '短信: 大促正式开启!', 250, 450, 'Megaphone', 'sms'));
        nodes.push(createNode(n5, NodeType.DELAY, '等待 48 小时', 250, 600, 'Clock', 'delay'));
        nodes.push(createNode(n6, NodeType.ACTION, '邮件: 最后 4 小时倒计时', 250, 750, 'Mail', 'email'));

        edges.push(createEdge(n1, n2));
        edges.push(createEdge(n2, n3));
        edges.push(createEdge(n3, n4));
        edges.push(createEdge(n4, n5));
        edges.push(createEdge(n5, n6));
    }

    return { nodes, edges };
};

// --- Component: Wizard Modal ---
const CreateCampaignWizard = ({ 
    isOpen, 
    onClose, 
    onCreate 
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    onCreate: (settings: CampaignSettings, templateData: { nodes: AppNode[], edges: AppEdge[] } | null) => void 
}) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Form State
    const [settings, setSettings] = useState<CampaignSettings>({
        name: '',
        description: '',
        type: 'trigger_behavior',
        dndConfig: {
            enabled: true,
            startTime: '22:00',
            endTime: '08:00'
        },
        attribution: {
            type: 'touch_window',
            windowDuration: 24
        }
    });

    // Template Selection
    const [selectedAudience, setSelectedAudience] = useState<string | null>(null);

    if (!isOpen) return null;

    const audiences = [
        { id: 'new_users', title: '新注册用户', desc: '针对首次注册未下单的用户，建立信任并促进首单转化。', icon: UserPlus, color: 'indigo', type: 'trigger_behavior' },
        { id: 'cart_abandon', title: '购物车挽回', desc: '针对加购但未支付的用户，通过多渠道提醒挽回流失订单。', icon: ShoppingCart, color: 'amber', type: 'trigger_behavior' },
        { id: 'vip', title: '高价值客户 (VIP)', desc: '识别高消费人群，提供专属权益与服务，提升忠诚度。', icon: Gem, color: 'purple', type: 'trigger_behavior' },
        { id: 'churn', title: '流失预警用户', desc: '激活沉睡用户，通过差异化权益防止用户彻底流失。', icon: UserX, color: 'rose', type: 'trigger_behavior' },
        { id: 'cross_sell', title: '复购交叉销售', desc: '在用户收货后黄金期推荐关联品，提升客单价(AOV)。', icon: PackageCheck, color: 'emerald', type: 'trigger_behavior' },
        { id: 'birthday', title: '会员生日关怀', desc: '在会员生日当天自动触发祝福与专属权益，强化品牌情感。', icon: Cake, color: 'pink', type: 'trigger_event' },
        { id: 'festival', title: '大促活动预热', desc: '构建预热-爆发-返场的完整营销SOP，最大化活动GMV。', icon: Megaphone, color: 'orange', type: 'scheduled_single' },
    ];

    const handleCreate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            let template = null;
            if (selectedAudience) {
                template = generateTemplate(selectedAudience);
            }
            onCreate(settings, template);
            setIsGenerating(false);
            setStep(1); // Reset
            setSelectedAudience(null);
        }, 800);
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">画布名称</label>
                    <input 
                        type="text" 
                        value={settings.name}
                        onChange={e => setSettings({...settings, name: e.target.value})}
                        placeholder="例如：双11大促-高价值用户召回"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white text-slate-900 placeholder:text-slate-400"
                    />
                </div>
                
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">计划类型</label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 'scheduled_single', label: '定时型 - 单次', icon: Calendar, desc: '如：一次性大促活动' },
                            { id: 'scheduled_recurring', label: '定时型 - 周期', icon: RotateCcw, desc: '如：每月会员日' },
                            { id: 'trigger_behavior', label: '触发型 - 用户行为', icon: MousePointerClick, desc: '如：下单未支付' },
                            { id: 'trigger_event', label: '触发型 - 营销事件', icon: Zap, desc: '如：商品降价/生日' },
                        ].map((t) => {
                            const Icon = t.icon;
                            const isSelected = settings.type === t.id;
                            return (
                                <div 
                                    key={t.id}
                                    onClick={() => setSettings({...settings, type: t.id as CampaignType})}
                                    className={`cursor-pointer rounded-lg border p-3 flex items-start gap-3 transition-all
                                        ${isSelected ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                                    `}
                                >
                                    <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                                    <div>
                                        <div className={`text-sm font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>{t.label}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Dynamic Time Config based on Type */}
                {(settings.type === 'scheduled_single' || settings.type === 'scheduled_recurring') && (
                     <div className="col-span-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-3">执行周期配置</label>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs text-slate-500 mb-1">开始时间</label>
                                <input type="datetime-local" className="w-full rounded border border-slate-300 p-2 text-sm bg-white text-slate-900 placeholder:text-slate-400" />
                            </div>
                            {settings.type === 'scheduled_recurring' && (
                                 <div className="flex-1">
                                    <label className="block text-xs text-slate-500 mb-1">重复频率 (Cron)</label>
                                    <select className="w-full rounded border border-slate-300 p-2 text-sm bg-white text-slate-900">
                                        <option>每天</option>
                                        <option>每周</option>
                                        <option>每月</option>
                                    </select>
                                </div>
                            )}
                        </div>
                     </div>
                )}

                {/* DND Config */}
                <div className="col-span-2">
                    <div className="flex items-center justify-between mb-2">
                         <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                             <Clock className="h-4 w-4 text-slate-500" />
                             勿扰时间 (DND)
                             <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded ml-2">最高优先级</span>
                         </label>
                         <div className="flex items-center">
                            <input 
                                type="checkbox" 
                                checked={settings.dndConfig.enabled}
                                onChange={e => setSettings({...settings, dndConfig: {...settings.dndConfig, enabled: e.target.checked}})}
                                className="toggle-checkbox h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-slate-600">{settings.dndConfig.enabled ? '已开启' : '已关闭'}</span>
                         </div>
                    </div>
                    {settings.dndConfig.enabled && (
                        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                             <span className="text-sm text-slate-600">每日</span>
                             <input 
                                type="time" 
                                value={settings.dndConfig.startTime}
                                onChange={e => setSettings({...settings, dndConfig: {...settings.dndConfig, startTime: e.target.value}})}
                                className="rounded border border-slate-300 p-1 text-sm bg-white text-slate-900 placeholder:text-slate-400" 
                             />
                             <span className="text-sm text-slate-400">至 次日</span>
                             <input 
                                type="time" 
                                value={settings.dndConfig.endTime}
                                onChange={e => setSettings({...settings, dndConfig: {...settings.dndConfig, endTime: e.target.value}})}
                                className="rounded border border-slate-300 p-1 text-sm bg-white text-slate-900 placeholder:text-slate-400" 
                             />
                             <span className="text-xs text-slate-400 ml-auto">此时段内暂停所有触达</span>
                        </div>
                    )}
                </div>

                {/* Attribution Config */}
                <div className="col-span-2">
                     <label className="block text-sm font-semibold text-slate-700 mb-2">归因策略</label>
                     <div className="space-y-3">
                        {[
                            { id: 'touch', label: '触达归因', desc: '以触达行为为准，无论是否点击链接。' },
                            { id: 'click', label: '点击归因', desc: '用户必须点击消息中的链接/卡片才算转化。' },
                            { id: 'touch_window', label: '触达转化窗口期', desc: '触达后 N 小时内的转化行为。', input: true },
                            { id: 'fixed_window', label: '固定转化窗口期', desc: '指定具体日期范围内的转化。' },
                        ].map(a => {
                            const isSelected = settings.attribution.type === a.id;
                            return (
                                <div 
                                    key={a.id} 
                                    onClick={() => setSettings({...settings, attribution: {...settings.attribution, type: a.id as AttributionType}})}
                                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer
                                        ${isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center
                                            ${isSelected ? 'border-indigo-600' : 'border-slate-400'}
                                        `}>
                                            {isSelected && <div className="h-2 w-2 rounded-full bg-indigo-600" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-900">{a.label}</div>
                                            <div className="text-xs text-slate-500">{a.desc}</div>
                                        </div>
                                    </div>
                                    {a.input && isSelected && (
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number" 
                                                value={settings.attribution.windowDuration || 24}
                                                onChange={(e) => setSettings({...settings, attribution: {...settings.attribution, windowDuration: parseInt(e.target.value)}})}
                                                className="w-16 rounded border border-slate-300 p-1 text-sm text-center bg-white text-slate-900 placeholder:text-slate-400"
                                                onClick={e => e.stopPropagation()}
                                            />
                                            <span className="text-xs text-slate-600">小时</span>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                     </div>
                </div>

                 <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">计划备注</label>
                    <textarea 
                        value={settings.description}
                        onChange={e => setSettings({...settings, description: e.target.value})}
                        placeholder="选填：请输入画布的业务目标或注意事项..."
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-sm h-20 bg-white text-slate-900 placeholder:text-slate-400"
                    />
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="overflow-y-auto h-[60vh] p-1">
             <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100 flex gap-2">
                 <Sparkles className="h-4 w-4 mt-0.5" />
                 <span>系统根据您选择的 <strong>{settings.type === 'scheduled_single' ? '定时单次' : settings.type === 'scheduled_recurring' ? '定时周期' : '触发型'}</strong> 计划，为您推荐以下 AI 策略模板：</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {/* Empty Template Option */}
                  <div 
                    onClick={() => {
                        setSelectedAudience(null);
                        handleCreate();
                    }}
                    className="relative cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-5 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex flex-col items-center justify-center min-h-[200px] text-center"
                >
                    <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <Plus className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="font-bold text-slate-700">空白画布</h3>
                    <p className="text-xs text-slate-500 mt-1">不使用模板，从零开始设计</p>
                </div>

                {audiences.map((aud) => {
                    // Simple Filter Logic based on type mapping
                    // In a real app, this mapping would be more robust
                    let isMatch = true;
                    if (settings.type.includes('trigger') && !aud.type.includes('trigger')) isMatch = false;
                    if (settings.type.includes('scheduled') && !aud.type.includes('scheduled')) isMatch = false;
                    
                    // For demo purposes, let's show all but highlight matches, or just show all for flexibility
                    // Let's dim non-matches
                    const opacityClass = isMatch ? 'opacity-100' : 'opacity-50 grayscale-[0.5]';

                    const isSelected = selectedAudience === aud.id;
                    const Icon = aud.icon;
                    return (
                        <div 
                            key={aud.id}
                            onClick={() => setSelectedAudience(aud.id)}
                            className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 group flex flex-col h-full ${opacityClass}
                                ${isSelected 
                                    ? `border-${aud.color}-500 bg-${aud.color}-50 ring-2 ring-${aud.color}-200 ring-offset-2` 
                                    : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-md'
                                }
                            `}
                        >
                            {isSelected && (
                                <div className={`absolute right-3 top-3 rounded-full bg-${aud.color}-500 p-1 text-white`}>
                                    <Check className="h-3 w-3" />
                                </div>
                            )}
                            <div className={`mb-3 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg 
                                ${isSelected ? `bg-white text-${aud.color}-600` : `bg-slate-100 text-slate-500 group-hover:bg-${aud.color}-100 group-hover:text-${aud.color}-600`}
                            `}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <h3 className={`font-bold ${isSelected ? `text-${aud.color}-900` : 'text-slate-900'}`}>{aud.title}</h3>
                            <p className="mt-1 text-xs leading-relaxed text-slate-500">{aud.desc}</p>
                            {!isMatch && <div className="mt-2 text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded w-fit">类型不匹配 (推荐)</div>}
                        </div>
                    )
                })}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            {step === 1 ? <Layout className="h-5 w-5 text-indigo-600" /> : <Sparkles className="h-5 w-5 text-indigo-600" />}
                            {step === 1 ? '新建营销画布 - 业务配置' : '选择策略模板'}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                            <div className={`h-1.5 w-8 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                            <div className={`h-1.5 w-8 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                
                <div className="p-8 overflow-y-auto">
                    {step === 1 ? renderStep1() : renderStep2()}
                </div>

                <div className="border-t border-slate-100 bg-slate-50 p-6 flex justify-between items-center shrink-0">
                    <button 
                        onClick={step === 1 ? onClose : () => setStep(1)}
                        className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-white hover:text-slate-800 transition-colors"
                    >
                        {step === 1 ? '取消' : '上一步'}
                    </button>
                    
                    {step === 1 ? (
                        <button 
                            onClick={() => setSettings(s => ({...s, name: s.name || '未命名画布'})) || setStep(2)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
                        >
                            下一步: 选择策略
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    ) : (
                        <button 
                            onClick={handleCreate}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    生成中...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    完成创建
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Sub-component: Dashboard (Landing Page) ---
const Dashboard = ({ onSelectScenario, onCreateNew }: { onSelectScenario: (id: string | null) => void, onCreateNew: () => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [creatorFilter, setCreatorFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [analyzingScenarioId, setAnalyzingScenarioId] = useState<string | null>(null);

  const filteredScenarios = SCENARIOS.filter(scenario => {
      const typeLabel = scenario.name.includes('大促') ? 'scheduled_single' : scenario.name.includes('培育') ? 'scheduled_recurring' : 'trigger_behavior';
      
      const matchesSearch = scenario.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || typeLabel === typeFilter;
      const matchesStatus = statusFilter === 'all' || scenario.status === statusFilter;
      const matchesCreator = scenario.creator.toLowerCase().includes(creatorFilter.toLowerCase());
      const matchesDate = dateFilter === '' || scenario.createdAt.includes(dateFilter);

      return matchesSearch && matchesType && matchesStatus && matchesCreator && matchesDate;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {analyzingScenarioId && (
          <CanvasAnalytics 
            onClose={() => setAnalyzingScenarioId(null)} 
            scenarioName={SCENARIOS.find(s => s.id === analyzingScenarioId)?.name} 
          />
      )}

      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">营销活动管理</h1>
            <p className="mt-1 text-slate-500 text-sm">管理您的自动化营销流程，监控实时数据效果。</p>
          </div>
          <button 
             onClick={onCreateNew} 
             className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition-all hover:shadow-md"
          >
            <Plus className="h-4 w-4" /> 新建营销画布
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
             <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                 <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                     <input 
                        type="text" 
                        placeholder="搜索活动名称..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 placeholder:text-slate-400"
                     />
                 </div>
                 
                 <div>
                     <select 
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-600"
                     >
                         <option value="all">所有类型</option>
                         <option value="scheduled_single">定时型 - 单次</option>
                         <option value="scheduled_recurring">定时型 - 周期</option>
                         <option value="trigger_behavior">触发型 - 用户行为</option>
                     </select>
                 </div>

                 <div>
                     <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-600"
                     >
                         <option value="all">所有状态</option>
                         <option value="active">运行中</option>
                         <option value="paused">已暂停</option>
                         <option value="draft">草稿</option>
                     </select>
                 </div>
                 
                 <div className="relative">
                     <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                     <input 
                        type="text" 
                        placeholder="搜索创建人..." 
                        value={creatorFilter}
                        onChange={(e) => setCreatorFilter(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 placeholder:text-slate-400"
                     />
                 </div>

                 <div className="relative">
                     <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                     <input 
                        type="date" 
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 placeholder:text-slate-400"
                     />
                 </div>
             </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 font-semibold">
                        <th className="px-6 py-4">营销活动名称</th>
                        <th className="px-6 py-4">类型</th>
                        <th className="px-6 py-4">状态</th>
                        <th className="px-6 py-4">创建时间</th>
                        <th className="px-6 py-4">创建人</th>
                        <th className="px-6 py-4">核心指标 (转化率/营收)</th>
                        <th className="px-6 py-4 text-right">操作</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredScenarios.length > 0 ? filteredScenarios.map((scenario) => {
                        // Status Badge Logic
                        let statusColor = 'bg-slate-100 text-slate-600';
                        let statusText = '草稿';
                        if (scenario.status === 'active') {
                            statusColor = 'bg-emerald-100 text-emerald-700';
                            statusText = '运行中';
                        } else if (scenario.status === 'paused') {
                            statusColor = 'bg-amber-100 text-amber-700';
                            statusText = '已暂停';
                        }

                        // Mock Type Display based on ID or Name
                        const typeLabel = scenario.name.includes('大促') ? '定时型-单次' : scenario.name.includes('培育') ? '定时型-周期' : '触发型-用户行为';

                        return (
                            <tr key={scenario.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                            <GitFork className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">{scenario.name}</div>
                                            <div className="text-xs text-slate-500 max-w-[200px] truncate mt-0.5">{scenario.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                        {typeLabel}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}>
                                        {statusText}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                        {scenario.createdAt}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <User className="h-3.5 w-3.5 text-slate-400" />
                                        {scenario.creator}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-slate-500">转化率:</span>
                                            <span className="font-semibold text-slate-700">{scenario.metrics.conversionRate}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-slate-500">营收:</span>
                                            <span className="font-semibold text-slate-700">{scenario.metrics.revenue}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => setAnalyzingScenarioId(scenario.id)}
                                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                                            title="数据分析"
                                        >
                                            <BarChart3 className="h-3.5 w-3.5" />
                                        </button>
                                        <button 
                                            onClick={() => onSelectScenario(scenario.id)}
                                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                                        >
                                            <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                                            编辑
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    }) : (
                        <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                没有找到匹配的营销活动。
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

// --- Sub-component: Flow (The Canvas) ---
const FlowEditor = ({ 
    scenarioId, 
    initialTemplate,
    initialSettings,
    onBack 
}: { 
    scenarioId: string | null, 
    initialTemplate: { nodes: AppNode[], edges: AppEdge[] } | null,
    initialSettings: CampaignSettings | null,
    onBack: () => void 
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error' | 'info'} | null>(null);

  // Load a scenario or initial template
  useEffect(() => {
    if (scenarioId) {
      const scenario = SCENARIOS.find((s) => s.id === scenarioId);
      if (scenario) {
         const nodesWithStats = scenario.nodes.map(n => ({
            ...n,
            data: { ...n.data, stats: undefined }
          }));
        setNodes(nodesWithStats);
        setEdges(
          scenario.edges.map((e) => ({
            ...e,
            animated: false,
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
            style: { stroke: '#94a3b8', strokeWidth: 2 },
          }))
        );
      }
    } else if (initialTemplate) {
        // Load generated template
        setNodes(initialTemplate.nodes);
        setEdges(initialTemplate.edges);
    } else {
      // Empty Canvas fallback
      setNodes([]);
      setEdges([]);
    }
  }, [scenarioId, initialTemplate, setNodes, setEdges]);

  // Fit view after load
  useEffect(() => {
      if (reactFlowInstance) {
          setTimeout(() => {
              reactFlowInstance.fitView({ padding: 0.2, duration: 800 });
          }, 100);
      }
  }, [reactFlowInstance, scenarioId, initialTemplate]);

  // Clear toast after 3s
  useEffect(() => {
    if (toast) {
        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }
  }, [toast]);

  // Smart Connect Logic
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => {
        let label = '';
        if (reactFlowInstance) {
            const sourceNode = reactFlowInstance.getNode(params.source || '');
            if (sourceNode?.data?.type === NodeType.CONDITION) {
                // Check outgoing edges from this source
                const existingEdges = eds.filter(e => e.source === params.source);
                if (existingEdges.length === 0) label = '是';
                else if (existingEdges.length === 1) label = '否';
            } else if (sourceNode?.data?.type === NodeType.SPLIT) {
                label = '50%';
            }
        }
        
        return addEdge({ 
            ...params, 
            label,
            type: 'smoothstep', 
            animated: false,
            markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
            style: { stroke: '#94a3b8', strokeWidth: 2 },
        }, eds)
    }),
    [setEdges, reactFlowInstance]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const rawData = event.dataTransfer.getData('application/reactflow');
      
      if (!rawData || !reactFlowInstance || !reactFlowBounds) return;

      const { type, subtype, icon, label } = JSON.parse(rawData);
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: AppNode = {
        id: Math.random().toString(36).substring(2, 9),
        type: 'custom',
        position,
        data: { 
            label: label, 
            type: type as NodeType,
            subtype: subtype,
            icon: icon
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as AppNode);
  };

  const handleUpdateNode = (id: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: newData };
        }
        return node;
      })
    );
    // Don't close panel automatically, let user close it
    // setSelectedNode(null); 
    setToast({ msg: '配置已更新', type: 'success' });
  };

  const handleSimulate = () => {
      setIsSimulating(true);
      // Mock simulation
      setEdges((eds) => eds.map(e => ({ ...e, animated: true, style: { ...e.style, stroke: '#6366f1' } })));
      setNodes((nds) => nds.map(n => ({
          ...n,
          data: {
              ...n.data,
              stats: {
                  entered: Math.floor(Math.random() * 5000) + 1000,
                  active: Math.floor(Math.random() * 1000),
                  converted: Math.floor(Math.random() * 500)
              }
          }
      })));
      setToast({ msg: '模拟运行开始', type: 'info' });
  };

  const handleReset = () => {
    setIsSimulating(false);
    // Reload current logic without full reset to keep current nodes in view
    setNodes((nds) => nds.map(n => ({ ...n, data: { ...n.data, stats: undefined } })));
    setEdges((eds) => eds.map(e => ({ ...e, animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 } })));
    setToast({ msg: '模拟已重置', type: 'info' });
  };

  const handleValidate = () => {
      if (nodes.length === 0) {
          setToast({ msg: '画布为空，请添加节点', type: 'error' });
          return;
      }
      
      const isolatedNodes = nodes.filter(node => {
          const hasIncoming = edges.some(e => e.target === node.id);
          const hasOutgoing = edges.some(e => e.source === node.id);
          if (node.data.type === NodeType.TRIGGER) return !hasOutgoing;
          if (node.data.type === NodeType.ACTION) return !hasIncoming; // Actions can be end nodes
          return !hasIncoming || !hasOutgoing;
      });

      if (isolatedNodes.length > 0) {
          setToast({ msg: `发现 ${isolatedNodes.length} 个异常节点，请检查连线`, type: 'error' });
      } else {
          setToast({ msg: '流程逻辑校验通过，可以上线', type: 'success' });
      }
  };

  const currentScenarioName = scenarioId 
    ? SCENARIOS.find(s => s.id === scenarioId)?.name 
    : initialSettings?.name || "新建智能营销流程";
  
  const currentScenarioDesc = scenarioId
    ? SCENARIOS.find(s => s.id === scenarioId)?.description
    : initialSettings?.description || (initialTemplate ? "AI 已为您自动生成策略，您可以继续拖拽组件优化流程。" : "拖拽左侧组件开始设计流程...");

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm z-10">
        <div className="flex items-center gap-4">
            <button 
                onClick={onBack}
                className="flex items-center justify-center rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                title="返回列表"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                    <Layout className="h-5 w-5" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-800 leading-tight">{currentScenarioName}</h1>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-500 font-medium max-w-[300px] truncate">{currentScenarioDesc}</p>
                        {initialSettings && (
                            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 border border-slate-200">
                                {initialSettings.type === 'scheduled_single' ? '单次定时' : initialSettings.type === 'trigger_behavior' ? '行为触发' : '周期/事件'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
             <button 
                onClick={() => setShowAnalytics(true)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
                title="查看数据分析"
             >
                 <BarChart3 className="h-4 w-4" /> 数据分析
             </button>
             {initialSettings && (
                 <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors" title="查看业务配置">
                     <Sliders className="h-4 w-4" />
                 </button>
             )}
             <button 
                onClick={handleValidate}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                title="检查流程完整性"
             >
                 <ShieldCheck className="h-4 w-4" /> 检查
             </button>
             {isSimulating ? (
                 <button onClick={handleReset} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                    <RotateCcw className="h-4 w-4" /> 重置
                 </button>
             ) : (
                <button onClick={handleSimulate} className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100">
                    <Play className="h-4 w-4" /> 模拟运行
                </button>
             )}
            <button className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                <Save className="h-4 w-4" /> 保存流程
            </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <div className="relative flex-1" ref={reactFlowWrapper}>
             {/* Canvas Context Info (Simplified since we have info in header now) */}
            {isSimulating && (
                 <div className="absolute left-4 top-4 z-10 rounded-lg bg-white/90 p-4 shadow-sm backdrop-blur border border-slate-200 max-w-md pointer-events-none">
                     <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold w-fit">
                        <CheckCircle2 className="h-3 w-3" /> 系统运行中: 实时数据监测
                    </div>
                 </div>
            )}
            
            {/* Analytics Modal */}
            {showAnalytics && (
                <CanvasAnalytics onClose={() => setShowAnalytics(false)} scenarioName={currentScenarioName} />
            )}

            {/* Toast Notification */}
            {toast && (
                <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg animate-in slide-in-from-top-2 fade-in
                    ${toast.type === 'success' ? 'bg-emerald-600 text-white' : ''}
                    ${toast.type === 'error' ? 'bg-rose-600 text-white' : ''}
                    ${toast.type === 'info' ? 'bg-slate-800 text-white' : ''}
                `}>
                    {toast.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
                    {toast.type === 'error' && <AlertTriangle className="h-4 w-4" />}
                    {toast.type === 'info' && <CheckCircle2 className="h-4 w-4" />}
                    <span className="text-sm font-medium">{toast.msg}</span>
                </div>
            )}

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                className="bg-slate-50"
            >
            <Controls className="bg-white border border-slate-200 shadow-sm" />
            <MiniMap 
                nodeStrokeColor={(n) => {
                    if (n.type === 'input') return '#0041d0';
                    if (n.data?.type === NodeType.TRIGGER) return '#10b981'; // emerald
                    if (n.data?.type === NodeType.CONDITION) return '#8b5cf6'; // violet
                    return '#64748b';
                }}
                nodeColor={(n) => {
                    return '#f8fafc';
                }}
                className='bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden'
            />
            <Background color="#cbd5e1" variant={BackgroundVariant.Dots} gap={20} size={1} />
          </ReactFlow>

          {/* Config Panel Overlay */}
          <ConfigPanel 
            selectedNode={selectedNode} 
            onClose={() => setSelectedNode(null)}
            onUpdate={handleUpdateNode}
          />
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);
  
  // State for new campaign creation
  const [generatedTemplate, setGeneratedTemplate] = useState<{ nodes: AppNode[], edges: AppEdge[] } | null>(null);
  const [currentSettings, setCurrentSettings] = useState<CampaignSettings | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectScenario = (id: string | null) => {
    setGeneratedTemplate(null); 
    setCurrentSettings(null); // Load from mock data if needed
    setCurrentScenarioId(id);
    setView('editor');
  };

  const handleCreateNew = () => {
      setIsModalOpen(true);
  };

  const handleTemplateCreated = (settings: CampaignSettings, templateData: { nodes: AppNode[], edges: AppEdge[] } | null) => {
      setGeneratedTemplate(templateData);
      setCurrentSettings(settings);
      setCurrentScenarioId(null);
      setView('editor');
      setIsModalOpen(false);
  };

  const handleBack = () => {
    setView('dashboard');
    setCurrentScenarioId(null);
    setGeneratedTemplate(null);
    setCurrentSettings(null);
  };

  return (
    <ReactFlowProvider>
      <CreateCampaignWizard 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleTemplateCreated} 
      />

      {view === 'dashboard' ? (
        <Dashboard onSelectScenario={handleSelectScenario} onCreateNew={handleCreateNew} />
      ) : (
        <FlowEditor 
            scenarioId={currentScenarioId} 
            initialTemplate={generatedTemplate}
            initialSettings={currentSettings}
            onBack={handleBack} 
        />
      )}
    </ReactFlowProvider>
  );
}