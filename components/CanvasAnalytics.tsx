import React, { useState } from 'react';
import { 
  X, TrendingUp, Users, ShoppingCart, CreditCard, Ticket, 
  ArrowDown, Package, DollarSign, Activity, Calendar, Filter, ShoppingBag
} from 'lucide-react';

interface CanvasAnalyticsProps {
  onClose: () => void;
  scenarioName?: string;
}

const KPICard = ({ title, value, subValue, icon: Icon, color }: any) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`rounded-lg p-2 ${color}`}>
        <Icon className="h-5 w-5 opacity-80" />
      </div>
    </div>
    {subValue && (
      <div className="mt-3 flex items-center text-xs">
        <span className={subValue.startsWith('+') ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
          {subValue}
        </span>
        <span className="ml-1 text-slate-400">较上周期</span>
      </div>
    )}
  </div>
);

const FunnelStep = ({ label, count, percent, color, width, isLast }: any) => (
  <div className="flex flex-col items-center w-full relative">
    <div 
      className={`relative z-10 flex h-24 flex-col items-center justify-center rounded-lg text-white shadow-md transition-all hover:-translate-y-1 ${color}`}
      style={{ width: width }}
    >
      <span className="text-3xl font-bold">{count}</span>
      <span className="text-sm opacity-90">{label}</span>
      <span className="absolute -right-16 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
        {percent}
      </span>
    </div>
    {!isLast && (
      <div className="my-1">
         <ArrowDown className="h-5 w-5 text-slate-300" />
      </div>
    )}
  </div>
);

const SimpleLineChart = ({ data, colorClass = "stroke-indigo-500" }: { data: number[], colorClass?: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 80 - 10; // padding
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="h-full w-full relative">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
                <polyline
                    fill="none"
                    strokeWidth="2"
                    points={points}
                    vectorEffect="non-scaling-stroke"
                    className={colorClass}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Dots */}
                {data.map((val, i) => {
                     const x = (i / (data.length - 1)) * 100;
                     const y = 100 - ((val - min) / range) * 80 - 10;
                     return (
                         <circle 
                            key={i} 
                            cx={x} 
                            cy={y} 
                            r="1.5" 
                            className="fill-white stroke-slate-400 hover:stroke-indigo-600 hover:r-2 transition-all cursor-pointer" 
                            strokeWidth="0.5" 
                            vectorEffect="non-scaling-stroke"
                         >
                            <title>{val}</title>
                         </circle>
                     );
                })}
            </svg>
            {/* X Axis Labels */}
            <div className="absolute bottom-[-20px] left-0 right-0 flex justify-between text-[10px] text-slate-400">
                {['11-01', '11-02', '11-03', '11-04', '11-05', '11-06', '11-07'].map((d, i) => (
                    <span key={i}>{d}</span>
                ))}
            </div>
        </div>
    );
}

const CanvasAnalytics: React.FC<CanvasAnalyticsProps> = ({ onClose, scenarioName }) => {
  const [trendMetric, setTrendMetric] = useState('gmv');

  // Mock Data
  const trendData: Record<string, number[]> = {
      gmv: [12000, 15400, 13200, 18900, 21000, 19500, 24000],
      orders: [120, 154, 132, 189, 210, 195, 240],
      visitors: [1200, 1540, 1320, 1890, 2100, 1950, 2400],
      conversion: [10, 10, 10, 10, 10, 10, 10], // Simplified
  };

  const topProducts = [
      { id: 1, name: 'Illuma 启赋 3段幼儿配方奶粉', price: 328, sales: 423, revenue: 138744 },
      { id: 2, name: 'BabyCare 婴儿湿巾 (80抽*3包)', price: 39.9, sales: 1205, revenue: 48079 },
      { id: 3, name: 'Pampers 帮宝适 一级帮尿裤 L', price: 109, sales: 310, revenue: 33790 },
      { id: 4, name: 'Aveeno 艾惟诺 婴儿身体乳', price: 79, sales: 215, revenue: 16985 },
      { id: 5, name: 'Hape 益智积木玩具 (80粒)', price: 129, sales: 85, revenue: 10965 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6 overflow-hidden">
      <div className="flex h-full w-full max-w-6xl flex-col rounded-2xl bg-slate-50 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
          <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-600" />
                  数据分析看板
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                  当前画布：<span className="font-medium text-slate-700">{scenarioName || '未命名画布'}</span>
              </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1.5 text-xs text-slate-600 border border-slate-200">
                <Calendar className="h-3.5 w-3.5" />
                <span>最近 7 天</span>
             </div>
             <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <X className="h-6 w-6" />
             </button>
          </div>
        </div>

        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
            
            {/* 1. Overall Effect (KPIs) */}
            <div className="mb-8">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-indigo-500" /> 
                    核心效果总览
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard 
                        title="支付总金额 (GMV)" 
                        value="¥124,000" 
                        subValue="+12.5%" 
                        icon={DollarSign} 
                        color="bg-indigo-50 text-indigo-600"
                    />
                    <KPICard 
                        title="支付订单数" 
                        value="1,240" 
                        subValue="+8.2%" 
                        icon={ShoppingBag} 
                        color="bg-blue-50 text-blue-600"
                    />
                    <KPICard 
                        title="权益核销率" 
                        value="45.2%" 
                        subValue="-2.1%" 
                        icon={Ticket} 
                        color="bg-pink-50 text-pink-600"
                    />
                    <KPICard 
                        title="进店访客数" 
                        value="15,420" 
                        subValue="+18.3%" 
                        icon={Users} 
                        color="bg-emerald-50 text-emerald-600"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                {/* 2. Funnel Analysis */}
                <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Filter className="h-4 w-4 text-indigo-500" />
                            漏斗模型分析
                        </h3>
                        <span className="text-xs text-slate-400">转化周期: 24h</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 py-4">
                        <FunnelStep 
                            label="计划覆盖人数" 
                            count="50,000" 
                            percent="100%" 
                            width="90%" 
                            color="bg-indigo-200 text-indigo-900" 
                        />
                        <FunnelStep 
                            label="计划通知人数" 
                            count="42,500" 
                            percent="85%" 
                            width="75%" 
                            color="bg-indigo-300 text-indigo-900" 
                        />
                        <FunnelStep 
                            label="进店访客数" 
                            count="15,420" 
                            percent="30.8%" 
                            width="60%" 
                            color="bg-indigo-400 text-white" 
                        />
                        <FunnelStep 
                            label="支付成交人数" 
                            count="1,180" 
                            percent="2.3%" 
                            width="45%" 
                            color="bg-indigo-600 text-white" 
                            isLast
                        />
                    </div>
                </div>

                {/* 3. Trend Analysis */}
                <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-indigo-500" />
                            效果趋势分析
                        </h3>
                        <select 
                            value={trendMetric}
                            onChange={(e) => setTrendMetric(e.target.value)}
                            className="text-xs rounded-md border-slate-200 bg-white py-1 pl-2 pr-8 font-medium text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="gmv">支付金额 (GMV)</option>
                            <option value="orders">支付订单数</option>
                            <option value="visitors">进店访客数</option>
                        </select>
                    </div>
                    <div className="flex-1 min-h-[250px] w-full px-4 pb-6 pt-2">
                         <SimpleLineChart 
                            data={trendData[trendMetric]} 
                            colorClass={trendMetric === 'gmv' ? 'stroke-indigo-500' : trendMetric === 'orders' ? 'stroke-blue-500' : 'stroke-emerald-500'} 
                         />
                    </div>
                </div>
            </div>

            {/* 4. Product Ranking */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Package className="h-4 w-4 text-indigo-500" />
                        商品消费排行榜 (TOP 5)
                    </h3>
                    <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">查看全部 &rarr;</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <th className="py-3 pl-2">排名</th>
                                <th className="py-3">商品名称</th>
                                <th className="py-3 text-right">单价</th>
                                <th className="py-3 text-right">销量</th>
                                <th className="py-3 text-right">销售额</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {topProducts.map((p, index) => (
                                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3 pl-2 font-medium text-slate-600">
                                        <span className={`inline-flex h-5 w-5 items-center justify-center rounded text-xs font-bold 
                                            ${index < 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}
                                        `}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="py-3 text-slate-900 font-medium">{p.name}</td>
                                    <td className="py-3 text-right text-slate-500">¥{p.price}</td>
                                    <td className="py-3 text-right text-slate-700 font-medium">{p.sales}</td>
                                    <td className="py-3 text-right text-slate-900 font-bold">¥{p.revenue.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasAnalytics;