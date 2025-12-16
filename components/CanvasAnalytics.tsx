import React, { useState } from 'react';
import { 
  X, TrendingUp, Users, Ticket, 
  ArrowRight, DollarSign, Activity, Filter, ShoppingBag,
  Smartphone, Mail, MapPin, CreditCard, Tag, Search,
  CheckCircle2, AlertCircle, Clock, MousePointerClick
} from 'lucide-react';

interface CanvasAnalyticsProps {
  onClose: () => void;
  scenarioName?: string;
}

// --- Helper Components ---

const KPICard = ({ title, value, subValue, icon: Icon, color, trend }: any) => (
  <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all hover:shadow-md">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        <h3 className="mt-2 text-2xl font-bold text-slate-800 tracking-tight">{value}</h3>
      </div>
      <div className={`rounded-lg p-2.5 ${color} bg-opacity-10`}>
        <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
    {subValue && (
      <div className="mt-4 flex items-center text-xs font-medium">
        <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {trend === 'up' ? '↑' : '↓'} {subValue}
        </span>
        <span className="ml-2 text-slate-400">vs 上一周期</span>
      </div>
    )}
  </div>
);

const AreaChart = ({ data, height = 240, color = "#6366f1" }: { data: number[], height?: number, color?: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data) * 0.8;
    const range = max - min || 1;
    
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 100; 
        return `${x},${y}`;
    }).join(' ');

    const areaPoints = `0,100 ${points} 100,100`;

    return (
        <div className="w-full relative overflow-hidden" style={{ height }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
                <defs>
                    <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polygon points={areaPoints} fill={`url(#gradient-${color})`} />
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    points={points}
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {data.map((val, i) => {
                     const x = (i / (data.length - 1)) * 100;
                     const y = 100 - ((val - min) / range) * 100;
                     return (
                         <circle 
                            key={i} 
                            cx={x} 
                            cy={y} 
                            r="0" 
                            className="stroke-white hover:r-3 transition-all cursor-pointer opacity-0 hover:opacity-100"
                            fill={color}
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                         >
                            <title>{val}</title>
                         </circle>
                     );
                })}
            </svg>
             <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                {['11-01', '11-05', '11-10', '11-15', '11-20', '11-25', '11-30'].map((d, i) => (
                    <span key={i}>{d}</span>
                ))}
            </div>
        </div>
    );
};

const DonutChart = ({ data }: { data: { label: string, value: number, color: string }[] }) => {
    const total = data.reduce((acc, cur) => acc + cur.value, 0);
    let currentAngle = 0;
    const gradient = data.map(item => {
        const percentage = (item.value / total) * 100;
        const start = currentAngle;
        currentAngle += percentage;
        return `${item.color} ${start}% ${currentAngle}%`;
    }).join(', ');

    return (
        <div className="flex items-center gap-8">
            <div className="relative h-32 w-32 shrink-0 rounded-full" style={{ background: `conic-gradient(${gradient})` }}>
                <div className="absolute inset-0 m-auto h-20 w-20 rounded-full bg-white flex items-center justify-center flex-col shadow-inner">
                    <span className="text-[10px] text-slate-400 uppercase">Total</span>
                    <span className="text-sm font-bold text-slate-800">{(total / 1000).toFixed(1)}k</span>
                </div>
            </div>
            <div className="flex-1 space-y-3">
                {data.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm text-slate-600">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-800">{Math.round((item.value/total)*100)}%</span>
                            <span className="text-xs text-slate-400 w-12 text-right">{item.value.toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// --- Main Component ---

const CanvasAnalytics: React.FC<CanvasAnalyticsProps> = ({ onClose, scenarioName }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'journey' | 'persona' | 'channel_sms' | 'channel_coupon' | 'channel_email'>('overview');
  const [trendMetric, setTrendMetric] = useState('gmv');

  // Trend Data
  const trendData: Record<string, number[]> = {
      gmv: [12000, 15400, 18200, 16900, 21000, 23500, 28000],
      orders: [120, 154, 132, 189, 210, 195, 240],
      visitors: [1200, 1540, 1320, 1890, 2100, 1950, 2400],
  };

  const channelDistribution = [
      { label: '短信 (SMS)', value: 12500, color: '#6366f1' }, 
      { label: 'App 推送', value: 8300, color: '#ec4899' }, 
      { label: '企业微信', value: 4200, color: '#10b981' }, 
      { label: '邮件 EDM', value: 2100, color: '#f59e0b' }, 
  ];

  const topProducts = [
      { id: 1, name: 'Illuma 启赋 3段幼儿配方奶粉', price: 328, sales: 423, revenue: 138744 },
      { id: 2, name: 'BabyCare 婴儿湿巾 (80抽*3包)', price: 39.9, sales: 1205, revenue: 48079 },
      { id: 3, name: 'Pampers 帮宝适 一级帮尿裤 L', price: 109, sales: 310, revenue: 33790 },
      { id: 4, name: 'Aveeno 艾惟诺 婴儿身体乳', price: 79, sales: 215, revenue: 16985 },
      { id: 5, name: 'Hape 益智积木玩具 (80粒)', price: 129, sales: 85, revenue: 10965 },
  ];

  const navClass = (id: string) => `w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === id ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' : 'text-slate-600 hover:bg-slate-50'}`;

  // --- Render Views ---

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="支付总金额 (GMV)" value="¥124,000" subValue="+12.5%" icon={DollarSign} color="bg-indigo-500" trend="up" />
            <KPICard title="总支付订单" value="1,240" subValue="+8.2%" icon={ShoppingBag} color="bg-blue-500" trend="up" />
            <KPICard title="客单价 (AOV)" value="¥100.0" subValue="-1.2%" icon={Ticket} color="bg-pink-500" trend="down" />
            <KPICard title="总触达用户" value="45,200" subValue="+18.3%" icon={Users} color="bg-emerald-500" trend="up" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Trend Chart */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-base font-bold text-slate-800">趋势分析</h3>
                        <p className="text-xs text-slate-500 mt-1">核心指标随时间变化情况</p>
                    </div>
                    <div className="flex rounded-md bg-slate-100 p-0.5">
                        {['gmv', 'orders', 'visitors'].map(m => (
                            <button 
                                key={m}
                                onClick={() => setTrendMetric(m)}
                                className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${trendMetric === m ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {m === 'gmv' ? 'GMV' : m === 'orders' ? '订单数' : '访客'}
                            </button>
                        ))}
                    </div>
                </div>
                <AreaChart data={trendData[trendMetric]} color={trendMetric === 'gmv' ? '#6366f1' : trendMetric === 'orders' ? '#3b82f6' : '#10b981'} />
            </div>

            {/* Channel Distribution */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-center">
                <div className="mb-6">
                    <h3 className="text-base font-bold text-slate-800">渠道触达占比</h3>
                    <p className="text-xs text-slate-500 mt-1">不同触达方式的发送量分布</p>
                </div>
                <DonutChart data={channelDistribution} />
            </div>
        </div>

        {/* Products Table */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-sm">关联商品销售排行 (Top 5)</h3>
                <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    查看全部 <ArrowRight className="h-3 w-3" />
                </button>
            </div>
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
                        <th className="px-6 py-3">商品信息</th>
                        <th className="px-6 py-3 text-right">单价</th>
                        <th className="px-6 py-3 text-right">销量</th>
                        <th className="px-6 py-3 text-right">销售额</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {topProducts.map((p, index) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-500">
                                        {index + 1}
                                    </div>
                                    <span className="font-medium text-slate-700">{p.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-3 text-right text-slate-500">¥{p.price}</td>
                            <td className="px-6 py-3 text-right text-slate-700 font-medium">{p.sales}</td>
                            <td className="px-6 py-3 text-right text-slate-900 font-bold">¥{p.revenue.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderPersona = () => (
      <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender & Age */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-6">人口统计学特征</h3>
                  <div className="flex items-start gap-8">
                       <div className="flex-1 space-y-4">
                           <p className="text-xs font-semibold text-slate-500 uppercase">性别分布</p>
                           <div className="flex gap-1 h-8 w-full rounded-md overflow-hidden">
                               <div className="bg-blue-500 w-[35%] hover:opacity-90 transition-opacity" title="男 35%"></div>
                               <div className="bg-pink-500 w-[60%] hover:opacity-90 transition-opacity" title="女 60%"></div>
                               <div className="bg-slate-200 w-[5%] hover:opacity-90 transition-opacity" title="未知 5%"></div>
                           </div>
                           <div className="flex justify-between text-xs text-slate-500">
                               <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> 男 35%</span>
                               <span className="flex items-center gap-1"><div className="w-2 h-2 bg-pink-500 rounded-full"></div> 女 60%</span>
                           </div>
                       </div>
                       <div className="flex-1 space-y-4">
                           <p className="text-xs font-semibold text-slate-500 uppercase">年龄段分布</p>
                           <div className="flex items-end gap-2 h-24 border-b border-slate-100 pb-1">
                                {[10, 25, 45, 15, 5].map((h, i) => (
                                    <div key={i} className="flex-1 bg-indigo-100 rounded-t-sm hover:bg-indigo-500 transition-colors relative group" style={{ height: `${h * 2}%` }}>
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {h}%
                                        </div>
                                    </div>
                                ))}
                           </div>
                           <div className="flex justify-between text-[10px] text-slate-400">
                               <span>18-24</span><span>25-34</span><span>35-44</span><span>45+</span><span>未知</span>
                           </div>
                       </div>
                  </div>
              </div>

               {/* Member Level */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-6">会员等级与价值</h3>
                  <div className="space-y-4">
                      {[
                          { label: '钻石会员 (Diamond)', count: 240, percent: 5, color: 'bg-indigo-600' },
                          { label: '黄金会员 (Gold)', count: 850, percent: 18, color: 'bg-amber-500' },
                          { label: '白银会员 (Silver)', count: 1200, percent: 25, color: 'bg-slate-400' },
                          { label: '普通会员 (Regular)', count: 2500, percent: 52, color: 'bg-slate-200' },
                      ].map((level, idx) => (
                          <div key={idx}>
                              <div className="flex justify-between text-xs mb-1.5">
                                  <span className="font-medium text-slate-700">{level.label}</span>
                                  <span className="text-slate-500">{level.count}人 ({level.percent}%)</span>
                              </div>
                              <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${level.color}`} style={{ width: `${level.percent}%` }}></div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

               {/* Tags Cloud */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4">活跃用户标签云</h3>
                  <div className="flex flex-wrap gap-2">
                      {[
                          '价格敏感', '母婴人群', '夜间活跃', '高退货率', '新品尝鲜', 
                          '宠物主', '美妆达人', '周末党', '促销驱动', '高净值',
                          '沉睡唤醒', 'App重度用户'
                      ].map((tag, i) => (
                          <span 
                            key={i} 
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-default
                                ${i % 3 === 0 ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 
                                  i % 3 === 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                  'bg-slate-50 text-slate-600 border-slate-200'}
                            `}
                          >
                              {tag}
                          </span>
                      ))}
                  </div>
              </div>

              {/* Geo Distribution */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4">地域分布 (Top 5)</h3>
                  <div className="space-y-3">
                      {[
                          { city: '上海市', users: 1240, color: 'w-[85%]' },
                          { city: '北京市', users: 980, color: 'w-[70%]' },
                          { city: '杭州市', users: 850, color: 'w-[60%]' },
                          { city: '深圳市', users: 720, color: 'w-[50%]' },
                          { city: '成都市', users: 540, color: 'w-[35%]' },
                      ].map((loc, i) => (
                          <div key={i} className="flex items-center gap-3">
                              <span className="w-4 text-xs font-bold text-slate-400">{i+1}</span>
                              <span className="w-16 text-xs text-slate-700">{loc.city}</span>
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
                                  <div className={`h-full bg-blue-500 rounded-full ${loc.color}`}></div>
                              </div>
                              <span className="text-xs font-medium text-slate-600">{loc.users}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );

  const renderChannelAnalysis = (type: string) => {
      const isSMS = type === 'channel_sms';
      const color = isSMS ? 'indigo' : type === 'channel_coupon' ? 'pink' : 'amber';
      const title = isSMS ? '短信 (SMS)' : type === 'channel_coupon' ? '优惠券 (Coupon)' : '邮件 (EDM)';
      
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex items-center justify-between mb-8">
                     <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                         <span className={`w-2 h-6 rounded-full bg-${color}-500`}></span>
                         {title} 渠道表现
                     </h3>
                     <div className="flex gap-4 text-sm">
                         <div className="flex flex-col items-end">
                             <span className="text-slate-500 text-xs">总花费</span>
                             <span className="font-bold text-slate-800">¥12,450</span>
                         </div>
                         <div className="flex flex-col items-end">
                             <span className="text-slate-500 text-xs">ROI</span>
                             <span className="font-bold text-emerald-600">1 : 4.5</span>
                         </div>
                     </div>
                 </div>

                 {/* Funnel Horizontal */}
                 <div className="relative flex justify-between items-center px-4">
                     {/* Line background */}
                     <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-10"></div>
                     
                     {[
                         { label: '发送量', count: '50,000', sub: '100%', icon: Activity },
                         { label: '成功触达', count: '48,500', sub: '97%', icon: CheckCircle2 },
                         { label: '打开/点击', count: '12,400', sub: '25.6%', icon: MousePointerClick },
                         { label: '最终转化', count: '980', sub: '2.1%', icon: DollarSign },
                     ].map((step, i) => (
                         <div key={i} className="flex flex-col items-center bg-white px-4">
                             <div className={`h-12 w-12 rounded-full border-2 border-${color}-100 bg-${color}-50 flex items-center justify-center text-${color}-600 mb-3 shadow-sm`}>
                                 <step.icon className="h-5 w-5" />
                             </div>
                             <span className="text-lg font-bold text-slate-800">{step.count}</span>
                             <span className="text-xs font-semibold text-slate-500 uppercase">{step.label}</span>
                             <span className="text-xs text-slate-400 mt-1">{step.sub}</span>
                         </div>
                     ))}
                 </div>
            </div>

            {/* Recent History Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h4 className="font-bold text-slate-700 text-sm">最近发送记录</h4>
                    <div className="relative">
                        <input type="text" placeholder="搜索批次ID..." className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md" />
                        <Search className="h-3 w-3 text-slate-400 absolute left-2.5 top-2" />
                    </div>
                </div>
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-xs text-slate-500 uppercase">
                            <th className="px-6 py-3 font-semibold">批次 ID</th>
                            <th className="px-6 py-3 font-semibold">发送时间</th>
                            <th className="px-6 py-3 font-semibold">目标人群</th>
                            <th className="px-6 py-3 font-semibold">状态</th>
                            <th className="px-6 py-3 font-semibold text-right">触达率</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[1,2,3,4].map((i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-3 font-mono text-xs text-slate-600">BATCH_202311{10+i}</td>
                                <td className="px-6 py-3 text-slate-600">2023-11-{10+i} 14:30</td>
                                <td className="px-6 py-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs border border-slate-200">高价值流失用户</span></td>
                                <td className="px-6 py-3">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                                        <CheckCircle2 className="h-3 w-3" /> 完成
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-right font-medium text-slate-700">98.{i}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      );
  }

  // --- Layout ---

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="flex h-[90vh] w-full max-w-[95vw] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-white/20">
        
        {/* Sidebar */}
        <div className="w-64 shrink-0 flex flex-col border-r border-slate-200 bg-slate-50">
            <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 bg-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="font-bold text-slate-800">数据看板</span>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                <button onClick={() => setActiveTab('overview')} className={navClass('overview')}>
                    <TrendingUp className="h-4 w-4" /> 效果总览
                </button>
                <button onClick={() => setActiveTab('journey')} className={navClass('journey')}>
                    <Filter className="h-4 w-4" /> 转化漏斗
                </button>
                <button onClick={() => setActiveTab('persona')} className={navClass('persona')}>
                    <Users className="h-4 w-4" /> 用户画像
                </button>
                
                <div className="my-4 border-t border-slate-200"></div>
                <div className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">渠道分析</div>
                
                <button onClick={() => setActiveTab('channel_sms')} className={navClass('channel_sms')}>
                    <Smartphone className="h-4 w-4 text-indigo-500" /> 短信 SMS
                </button>
                <button onClick={() => setActiveTab('channel_coupon')} className={navClass('channel_coupon')}>
                    <Ticket className="h-4 w-4 text-pink-500" /> 优惠券分析
                </button>
                <button onClick={() => setActiveTab('channel_email')} className={navClass('channel_email')}>
                    <Mail className="h-4 w-4 text-amber-500" /> 邮件 EDM
                </button>
            </nav>

            <div className="p-4 border-t border-slate-200 text-xs text-slate-400 text-center">
                数据更新于: 10分钟前
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/30">
            {/* Top Bar */}
            <div className="h-16 flex items-center justify-between px-8 border-b border-slate-200 bg-white shrink-0">
                 <div>
                      <h2 className="text-lg font-bold text-slate-800">
                          {activeTab === 'overview' ? '全链路效果总览' : 
                           activeTab === 'journey' ? '用户旅程转化漏斗' : 
                           activeTab === 'persona' ? '触达用户画像分析' : '渠道专项分析'}
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>项目: {scenarioName || '未命名画布'}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                          <span className="text-emerald-600 font-medium">运行中</span>
                      </div>
                 </div>
                 <div className="flex items-center gap-3">
                     <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs font-medium text-slate-600 border border-slate-200">
                        <button className="rounded px-3 py-1.5 bg-white text-indigo-600 shadow-sm transition-all">最近 7 天</button>
                        <button className="rounded px-3 py-1.5 hover:bg-white/50 transition-all">30 天</button>
                     </div>
                     <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                        <X className="h-5 w-5" />
                     </button>
                 </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8">
                 <div className="max-w-6xl mx-auto">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'journey' && (
                        // Keeping the previous Journey content but wrapped cleanly
                        <div className="space-y-8 animate-in fade-in duration-300">
                             <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">转化漏斗详情</h3>
                                <p className="text-sm text-slate-500 mb-8">展示从目标人群覆盖到最终成交的各阶段流失情况。</p>
                                {/* ... (Keeping existing funnel UI structure) ... */}
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <div className="w-32 text-right pr-4 text-sm font-semibold text-slate-600">目标人群</div>
                                        <div className="flex-1 h-12 bg-indigo-50 rounded-r-lg flex items-center px-4 relative group">
                                            <div className="absolute left-0 top-0 h-full bg-indigo-500 rounded-l-lg rounded-r-sm w-full"></div>
                                            <span className="relative z-10 text-white font-bold">50,000</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center py-1"><span className="text-xs text-slate-400">↓ 流失 15%</span></div>
                                    <div className="flex items-center">
                                        <div className="w-32 text-right pr-4 text-sm font-semibold text-slate-600">成功触达</div>
                                        <div className="flex-1 h-12 bg-indigo-50 rounded-r-lg flex items-center px-4 relative">
                                            <div className="absolute left-0 top-0 h-full bg-indigo-400 rounded-l-lg rounded-r-sm w-[85%]"></div>
                                            <span className="relative z-10 text-white font-bold">42,500</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center py-1"><span className="text-xs text-slate-400">↓ 点击率 36.2%</span></div>
                                    <div className="flex items-center">
                                        <div className="w-32 text-right pr-4 text-sm font-semibold text-slate-600">点击/进店</div>
                                        <div className="flex-1 h-12 bg-indigo-50 rounded-r-lg flex items-center px-4 relative">
                                            <div className="absolute left-0 top-0 h-full bg-indigo-300 rounded-l-lg rounded-r-sm w-[30.8%]"></div>
                                            <span className="relative z-10 text-slate-700 font-bold">15,420</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center py-1"><span className="text-xs text-slate-400">↓ 转化率 7.6%</span></div>
                                    <div className="flex items-center">
                                        <div className="w-32 text-right pr-4 text-sm font-semibold text-slate-600">支付成交</div>
                                        <div className="flex-1 h-12 bg-indigo-50 rounded-r-lg flex items-center px-4 relative">
                                            <div className="absolute left-0 top-0 h-full bg-indigo-600 rounded-lg w-[2.3%]"></div>
                                            <span className="relative z-10 text-indigo-700 font-bold ml-2">1,180</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <h4 className="font-bold text-slate-700 mb-2">流失原因分析</h4>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-sm"><span className="text-slate-600">价格敏感</span><span className="text-red-500 font-medium">45%</span></div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-red-400 h-1.5 rounded-full w-[45%]"></div></div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-sm"><span className="text-slate-600">渠道疲劳</span><span className="text-orange-500 font-medium">28%</span></div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-orange-400 h-1.5 rounded-full w-[28%]"></div></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <h4 className="font-bold text-slate-700 mb-2">AI 优化建议</h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-2 text-sm text-slate-600"><span className="text-indigo-500">💡</span>针对“价格敏感”流失人群，建议追加一张 <span className="font-medium text-slate-900">限时9折券</span>。</li>
                                        <li className="flex gap-2 text-sm text-slate-600"><span className="text-indigo-500">📢</span>短信渠道点击率偏低，建议尝试 <span className="font-medium text-slate-900">AI 生成文案 B 版</span>。</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'persona' && renderPersona()}
                    {activeTab.startsWith('channel_') && renderChannelAnalysis(activeTab)}
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasAnalytics;