import React, { useState, useEffect } from 'react';
import { AppNode, NodeType } from '../types';
import { X, BarChart3, Settings, Send, Loader2, Check, Plus, Trash2, Split } from 'lucide-react';

interface ConfigPanelProps {
  selectedNode: AppNode | null;
  onClose: () => void;
  onUpdate: (id: string, data: any) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ selectedNode, onClose, onUpdate }) => {
  const [label, setLabel] = useState('');
  const [activeTab, setActiveTab] = useState<'settings' | 'analytics'>('settings');
  const [isTestSending, setIsTestSending] = useState(false);
  const [testSendSuccess, setTestSendSuccess] = useState(false);

  // State for Conditions
  const [conditions, setConditions] = useState<any[]>([]);
  
  // State for Split
  const [splitRatio, setSplitRatio] = useState(50);

  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data.label);
      setActiveTab('settings');
      setTestSendSuccess(false);

      // Initialize Condition Data
      if (selectedNode.data.type === NodeType.CONDITION) {
          setConditions(selectedNode.data.config?.conditions || [
              { id: 1, field: 'total_spent', operator: '>', value: '500' }
          ]);
      }

      // Initialize Split Data
      if (selectedNode.data.type === NodeType.SPLIT) {
          setSplitRatio(selectedNode.data.config?.splitRatio ?? 50);
      }
    }
  }, [selectedNode]);

  if (!selectedNode) return null;

  const handleSave = () => {
    let updates: any = { label };
    let config = selectedNode.data.config || {};

    if (selectedNode.data.type === NodeType.CONDITION) {
        config = { ...config, conditions };
        // Auto-generate subLabel for visualization
        if (conditions.length > 0) {
            const f = conditions[0];
            const fieldMap: Record<string, string> = { 
                total_spent: '消费', 
                order_count: '订单数', 
                member_level: '等级', 
                cart_total: '加购额',
                last_pay_time: '支付时间',
                points: '积分'
            };
            
            let displayValue = f.value;
            // Map values to readable text
            if (f.field === 'member_level') {
                const levelMap: Record<string, string> = { regular: '普通', silver: '白银', gold: '黄金', diamond: '钻石' };
                displayValue = levelMap[f.value] || f.value;
            }
            
            updates.subLabel = `${fieldMap[f.field] || f.field} ${f.operator} ${displayValue}` + (conditions.length > 1 ? ` (+${conditions.length - 1})` : '');
        } else {
            updates.subLabel = '无过滤条件';
        }
    } else if (selectedNode.data.type === NodeType.SPLIT) {
        config = { ...config, splitRatio };
        updates.subLabel = `A组 ${splitRatio}% / B组 ${100 - splitRatio}%`;
    }

    onUpdate(selectedNode.id, { ...selectedNode.data, ...updates, config });
  };

  const handleTestSend = () => {
      setIsTestSending(true);
      setTimeout(() => {
          setIsTestSending(false);
          setTestSendSuccess(true);
          setTimeout(() => setTestSendSuccess(false), 3000);
      }, 1200);
  }

  // --- Condition Logic Helpers ---
  const addCondition = () => {
      setConditions([...conditions, { id: Date.now(), field: 'total_spent', operator: '>', value: '' }]);
  };

  const updateCondition = (id: number, field: string, value: any) => {
      // If changing field, reset value to avoid type mismatch (e.g. date string in number input)
      const prevField = conditions.find(c => c.id === id)?.field;
      let newValue = value;
      if (field === 'field' && value !== prevField) {
          newValue = value; // Reset value logic could go here, but strict clearing might be annoying.
          // For simplicity, we just update the field. The input type will change.
          // Ideally we might clear 'value' if switching types, but let's keep it simple.
          setConditions(conditions.map(c => c.id === id ? { ...c, [field]: value, value: '' } : c));
      } else {
          setConditions(conditions.map(c => c.id === id ? { ...c, [field]: value } : c));
      }
  };

  const removeCondition = (id: number) => {
      setConditions(conditions.filter(c => c.id !== id));
  };

  const renderVariableTags = () => (
      <div className="flex flex-wrap gap-1.5 mb-2 mt-2">
          {['{用户昵称}', '{会员等级}', '{积分余额}', '{商品名称}'].map(tag => (
              <span key={tag} className="cursor-pointer px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                  {tag}
              </span>
          ))}
      </div>
  );

  const renderConditionValueInput = (cond: any) => {
      const numericFields = ['total_spent', 'order_count', 'points', 'cart_total', 'visit_count'];
      
      if (cond.field === 'member_level') {
          return (
              <select 
                  value={cond.value}
                  onChange={(e) => updateCondition(cond.id, 'value', e.target.value)}
                  className="flex-1 text-xs rounded border border-slate-300 p-1.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
              >
                  <option value="">选择会员等级...</option>
                  <option value="regular">普通会员 (Regular)</option>
                  <option value="silver">白银会员 (Silver)</option>
                  <option value="gold">黄金会员 (Gold)</option>
                  <option value="diamond">钻石会员 (Diamond)</option>
              </select>
          );
      }
      
      if (cond.field === 'last_pay_time') {
           return (
              <input 
                  type="date" 
                  value={cond.value}
                  onChange={(e) => updateCondition(cond.id, 'value', e.target.value)}
                  className="flex-1 text-xs rounded border border-slate-300 p-1.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
              />
           );
      }

      if (numericFields.includes(cond.field)) {
          return (
              <input 
                  type="number" 
                  value={cond.value}
                  onChange={(e) => updateCondition(cond.id, 'value', e.target.value)}
                  className="flex-1 text-xs rounded border border-slate-300 p-1.5 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-indigo-500"
                  placeholder="输入数值..."
              />
          );
      }

      // Default text input
      return (
          <input 
              type="text" 
              value={cond.value}
              onChange={(e) => updateCondition(cond.id, 'value', e.target.value)}
              className="flex-1 text-xs rounded border border-slate-300 p-1.5 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-indigo-500"
              placeholder="输入值..."
          />
      );
  };

  const renderSpecificConfig = () => {
    const { type, subtype } = selectedNode.data;

    // --- CONDITION NODE ---
    if (type === NodeType.CONDITION) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                     <label className="text-xs font-medium text-slate-500">筛选条件 (且/AND)</label>
                     <button onClick={addCondition} className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700">
                         <Plus className="h-3 w-3" /> 添加
                     </button>
                </div>

                <div className="space-y-2">
                    {conditions.map((cond, idx) => (
                        <div key={cond.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 group relative">
                            {idx > 0 && (
                                <div className="absolute -top-3 left-4 bg-slate-200 text-[10px] px-1 rounded text-slate-500 font-bold z-10">AND</div>
                            )}
                            <button onClick={() => removeCondition(cond.id)} className="absolute right-2 top-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            
                            <div className="grid grid-cols-1 gap-2">
                                <select 
                                    value={cond.field}
                                    onChange={(e) => updateCondition(cond.id, 'field', e.target.value)}
                                    className="w-full text-xs rounded border border-slate-300 p-1.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
                                >
                                    <optgroup label="交易属性">
                                        <option value="total_spent">消费金额 (Total Spent)</option>
                                        <option value="order_count">订单总数 (Total Orders)</option>
                                        <option value="last_pay_time">最近支付时间</option>
                                    </optgroup>
                                    <optgroup label="用户属性">
                                        <option value="member_level">会员等级</option>
                                        <option value="points">积分余额</option>
                                        <option value="city">所在城市</option>
                                    </optgroup>
                                    <optgroup label="行为数据">
                                        <option value="cart_total">购物车金额</option>
                                        <option value="visit_count">近7天访问次数</option>
                                    </optgroup>
                                </select>
                                
                                <div className="flex gap-2">
                                    <select 
                                        value={cond.operator}
                                        onChange={(e) => updateCondition(cond.id, 'operator', e.target.value)}
                                        className="w-1/3 text-xs rounded border border-slate-300 p-1.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <option value=">">大于</option>
                                        <option value="<">小于</option>
                                        <option value="=">等于</option>
                                        <option value="!=">不等于</option>
                                        <option value="contains">包含</option>
                                    </select>
                                    
                                    {renderConditionValueInput(cond)}
                                </div>
                            </div>
                        </div>
                    ))}
                    {conditions.length === 0 && (
                        <div className="text-center py-4 border-2 border-dashed border-slate-200 rounded-lg text-xs text-slate-400">
                            暂无筛选条件，默认通过所有用户。
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- SPLIT NODE ---
    if (type === NodeType.SPLIT) {
        return (
            <div className="space-y-6">
                <div className="rounded-lg bg-indigo-50 p-4 border border-indigo-100 flex items-center justify-center">
                    <Split className="h-8 w-8 text-indigo-400 mr-4" />
                    <div>
                        <div className="text-sm font-bold text-indigo-900">A/B 流量分配</div>
                        <div className="text-xs text-indigo-700">随机将用户分流至不同路径</div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700">A组 (实验组)</span>
                        <span className="text-xs font-bold text-slate-700">{splitRatio}%</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={splitRatio} 
                        onChange={(e) => setSplitRatio(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between mt-2">
                        <span className="text-xs font-bold text-slate-500">B组 (对照组)</span>
                        <span className="text-xs font-bold text-slate-500">{100 - splitRatio}%</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-2 border border-indigo-200 bg-indigo-50 rounded">
                        <div className="text-[10px] text-indigo-400 uppercase">Path A</div>
                        <div className="text-lg font-bold text-indigo-700">{splitRatio}%</div>
                    </div>
                    <div className="p-2 border border-slate-200 bg-slate-50 rounded">
                        <div className="text-[10px] text-slate-400 uppercase">Path B</div>
                        <div className="text-lg font-bold text-slate-600">{100 - splitRatio}%</div>
                    </div>
                </div>
            </div>
        );
    }

    // AI Recommendation
    if (subtype === 'ai_recommend') {
        return (
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">推荐场景</label>
                     <select className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white text-slate-900 focus:ring-indigo-500 focus:border-indigo-500">
                        <option>首页猜你喜欢</option>
                        <option>购物车凑单推荐</option>
                        <option>支付成功页推荐</option>
                        <option>新品上市推广</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">推荐算法策略</label>
                    <select className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white text-slate-900 focus:ring-indigo-500 focus:border-indigo-500">
                        <option>协同过滤 (User-based CF)</option>
                        <option>关联规则 (买了又买)</option>
                        <option>基于内容 (Content-based)</option>
                        <option>高毛利优先</option>
                        <option>高库存优先</option>
                    </select>
                </div>
                 <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">推荐数量</label>
                        <input type="number" className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white text-slate-900 placeholder:text-slate-400" placeholder="4" defaultValue={4} />
                    </div>
                     <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">去重策略</label>
                        <select className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white text-slate-900 focus:ring-indigo-500 focus:border-indigo-500">
                            <option>过滤已购商品</option>
                            <option>过滤近期浏览</option>
                            <option>不过滤</option>
                        </select>
                    </div>
                </div>
            </div>
        )
    }

    // Coupons
    if (subtype === 'coupon') {
        return (
             <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">选择优惠券批次</label>
                    <select className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white text-slate-900 focus:ring-indigo-500 focus:border-indigo-500">
                        <option>CP_2024_NEW_USER (新人礼包 ¥50)</option>
                        <option>CP_RETENTION_Q3 (回归礼包 8折)</option>
                        <option>CP_VIP_BIRTHDAY (生日券 ¥100)</option>
                        <option>CP_CROSS_SELL (复购专享 9折)</option>
                    </select>
                </div>
                 <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500">面额</span>
                        <span className="font-semibold text-slate-800">¥50.00</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500">使用门槛</span>
                        <span className="font-semibold text-slate-800">满 299 可用</span>
                    </div>
                     <div className="flex justify-between text-xs">
                        <span className="text-slate-500">有效期</span>
                        <span className="font-semibold text-slate-800">领取后 7 天有效</span>
                    </div>
                 </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="notify" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                    <label htmlFor="notify" className="text-sm text-slate-600">发券后立即触发系统通知</label>
                </div>
             </div>
        );
    }

    // Points
    if (subtype === 'points') {
        return (
             <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">变更类型</label>
                    <div className="flex gap-2">
                        <button className="flex-1 rounded border border-indigo-600 bg-indigo-50 py-1.5 text-xs font-medium text-indigo-700">增加积分</button>
                        <button className="flex-1 rounded border border-slate-300 bg-white py-1.5 text-xs text-slate-600 hover:bg-slate-50">扣除积分</button>
                    </div>
                </div>
                <div>
                     <label className="block text-xs font-medium text-slate-500 mb-1">积分数量</label>
                     <input type="number" defaultValue={100} className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white text-slate-900 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                     <label className="block text-xs font-medium text-slate-500 mb-1">变更原因备注</label>
                     <input type="text" placeholder="例如：营销活动奖励" className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white text-slate-900 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
             </div>
        );
    }

    // Member Tags
    if (subtype === 'member_tag') {
        return (
            <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">操作类型</label>
                    <div className="flex gap-2">
                        <button className="flex-1 rounded border border-indigo-600 bg-indigo-50 py-1.5 text-xs font-medium text-indigo-700">添加标签</button>
                        <button className="flex-1 rounded border border-slate-300 bg-white py-1.5 text-xs text-slate-600 hover:bg-slate-50">移除标签</button>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">标签名称</label>
                     <select className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white text-slate-900 focus:ring-indigo-500 focus:border-indigo-500">
                        <option>高价值用户 (High LTV)</option>
                        <option>价格敏感 (Price Sensitive)</option>
                        <option>母婴人群 (Mom & Baby)</option>
                        <option>即将流失 (Churn Risk)</option>
                        <option>生日月用户 (Birthday Month)</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">标签有效期</label>
                     <select className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white text-slate-900 focus:ring-indigo-500 focus:border-indigo-500">
                        <option>永久有效</option>
                        <option>30天</option>
                        <option>90天</option>
                        <option>1年</option>
                    </select>
                </div>
            </div>
        );
    }

    // Generic Action (SMS, Push, Email, WeChat)
    if (type === NodeType.ACTION && !['ai_recommend', 'coupon', 'member_tag', 'points'].includes(subtype || '')) {
         return (
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">触达渠道</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['app_push', 'sms', 'email', 'wechat'].map(ch => (
                             <button key={ch} className={`rounded border px-3 py-2 text-xs font-medium capitalize transition-all
                                ${subtype === ch ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'}
                             `}>
                                 {ch.replace('_', ' ')}
                             </button>
                        ))}
                    </div>
                </div>

                {subtype === 'sms' && (
                     <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">短信签名</label>
                        <select className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white text-slate-900">
                            <option>【OmniShop】</option>
                            <option>【会员中心】</option>
                            <option>【活动通知】</option>
                        </select>
                    </div>
                )}
                
                {subtype === 'email' && (
                     <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">邮件标题</label>
                        <input type="text" placeholder="请输入引人注目的标题" className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white text-slate-900" />
                    </div>
                )}

                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">消息内容</label>
                    <textarea 
                        className="w-full h-24 rounded-md border border-slate-300 p-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white text-slate-900 placeholder:text-slate-400" 
                        placeholder="请输入消息内容..."
                        defaultValue={subtype === 'sms' && selectedNode.data.icon === 'Gift' ? "亲爱的 {用户昵称}，今天是您的生日！我们为您准备了神秘好礼，点击链接领取..." : ""}
                    ></textarea>
                    {renderVariableTags()}
                </div>

                {/* Test Send Button */}
                <div className="border-t border-slate-100 pt-3 mt-2">
                    <button 
                        onClick={handleTestSend}
                        disabled={isTestSending || testSendSuccess}
                        className={`w-full flex items-center justify-center gap-2 rounded-md py-2 text-xs font-medium transition-all
                            ${testSendSuccess 
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                                : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                            }
                        `}
                    >
                        {isTestSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 
                         testSendSuccess ? <Check className="h-3.5 w-3.5" /> : 
                         <Send className="h-3.5 w-3.5" />}
                        
                        {isTestSending ? '发送中...' : 
                         testSendSuccess ? '测试发送成功' : 
                         '发送测试消息 (模拟)'}
                    </button>
                    <p className="text-[10px] text-slate-400 mt-1.5 text-center">只会发送给当前登录的管理员账号，不会触达真实用户。</p>
                </div>
            </div>
         );
    }

    switch (type) {
      case NodeType.DELAY:
        return (
          <div className="space-y-4">
             {/* Type Switcher */}
             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button className="flex-1 py-1.5 text-xs font-medium rounded-md bg-white text-indigo-700 shadow-sm">相对时间</button>
                <button className="flex-1 py-1.5 text-xs font-medium rounded-md text-slate-500 hover:text-slate-700">绝对时间</button>
             </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">等待时长</label>
              <div className="flex gap-2">
                <input type="number" className="flex-1 rounded-md border border-slate-300 p-2 text-sm bg-white text-slate-900 placeholder:text-slate-400" placeholder="1" defaultValue={1} />
                <select className="rounded-md border border-slate-300 p-2 text-sm bg-white text-slate-900 focus:ring-indigo-500 focus:border-indigo-500">
                  <option>分钟</option>
                  <option>小时</option>
                  <option>天</option>
                  <option>周</option>
                </select>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-2 space-y-2">
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="exclude-weekend" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <label htmlFor="exclude-weekend" className="text-xs text-slate-600">跳过周末 (周六、周日)</label>
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="active-hours" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                    <label htmlFor="active-hours" className="text-xs text-slate-600">仅在活跃时段发送 (9:00 - 21:00)</label>
                </div>
                {/* Mock description for active hours */}
                 <p className="text-[10px] text-slate-400 pl-6">非活跃时段到达的用户将等待至次日 9:00 继续流程。</p>
            </div>
          </div>
        );
      case NodeType.TRIGGER:
        return (
           <div className="space-y-4">
             <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">触发事件类型</label>
                <select className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white text-slate-900 focus:ring-indigo-500 focus:border-indigo-500" defaultValue={selectedNode.data.icon === 'Cake' ? 'birthday' : selectedNode.data.icon === 'PackageCheck' ? 'order_status' : 'default'}>
                    <option value="default">请选择事件...</option>
                    <optgroup label="交易相关">
                        <option value="payment">支付订单 (Order Paid)</option>
                        <option value="refund">申请退款 (Order Refund)</option>
                        <option value="order_status">订单状态变更 (Status Changed)</option>
                    </optgroup>
                    <optgroup label="行为相关">
                        <option value="cart">加入购物车 (Add to Cart)</option>
                        <option value="view">浏览商品 (View Product)</option>
                        <option value="search">站内搜索 (Search)</option>
                    </optgroup>
                    <optgroup label="会员相关">
                        <option value="register">注册成功 (Sign Up)</option>
                        <option value="birthday">用户生日 (Birthday)</option>
                        <option value="upgrade">等级升级 (Level Up)</option>
                    </optgroup>
                </select>
             </div>
             
             {/* Dynamic Filter Section for Triggers */}
             <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">触发限制规则</label>
                <div className="space-y-2">
                     <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between group">
                        <div className="text-xs text-slate-700">
                            <span className="text-slate-500">过去 24h 内触发次数</span> <span className="font-semibold text-indigo-600"> &lt; 1 次</span>
                        </div>
                        <button className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="h-3 w-3" />
                        </button>
                    </div>
                     <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between group">
                        <div className="text-xs text-slate-700">
                             <span className="text-slate-500">会员状态</span> <span className="font-semibold text-indigo-600"> 等于 正常</span>
                        </div>
                        <button className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="h-3 w-3" />
                        </button>
                    </div>
                    <button className="w-full py-1.5 text-xs text-indigo-600 font-medium border border-dashed border-indigo-300 rounded hover:bg-indigo-50 flex items-center justify-center gap-1">
                        <Plus className="h-3 w-3" /> 添加限制规则
                    </button>
                </div>
             </div>
           </div>
        );
      default:
        return <div className="text-sm text-slate-400 italic">此节点类型暂无更多配置项。</div>;
    }
  };

  const renderAnalytics = () => (
      <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-100">
                  <div className="text-xs text-emerald-600 uppercase font-semibold">进入人数</div>
                  <div className="text-2xl font-bold text-emerald-800">12,403</div>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 border border-blue-100">
                  <div className="text-xs text-blue-600 uppercase font-semibold">活跃人数</div>
                  <div className="text-2xl font-bold text-blue-800">4,201</div>
              </div>
          </div>
          
          <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">转化率漏斗</h4>
              <div className="flex items-center gap-3 mb-1">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[65%]"></div>
                  </div>
                  <span className="text-sm font-bold text-slate-700">65%</span>
              </div>
              <p className="text-xs text-slate-400">高于行业平均水平 (42%)</p>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
             <div className="flex items-center justify-between mb-2">
                 <span className="text-sm font-medium text-slate-700">流失风险预警</span>
                 <span className="text-sm font-bold text-red-500">12%</span>
             </div>
             <p className="text-xs text-slate-500 mb-3">大多数用户在 2 天后流失。</p>
             <button className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50 bg-white">
                 查看流失用户列表
             </button>
          </div>
      </div>
  )

  return (
    <div className="flex h-full w-80 flex-col border-l border-slate-200 bg-white shadow-xl absolute right-0 top-0 z-50 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 p-4 bg-slate-50/50">
        <h3 className="font-bold text-slate-800">节点配置</h3>
        <button onClick={onClose} className="rounded p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'settings' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
              <Settings className="h-4 w-4" /> 设置
          </button>
          <button 
             onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'analytics' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
              <BarChart3 className="h-4 w-4" /> 数据
          </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'settings' ? (
            <>
                <div className="mb-6">
                <label className="block text-xs font-medium text-slate-500 mb-1">节点名称</label>
                <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-900 placeholder:text-slate-400"
                />
                </div>
                
                <div className="mb-6 border-t border-slate-100 pt-4">
                    {renderSpecificConfig()}
                </div>

                <div className="mt-8">
                    <button 
                        onClick={handleSave}
                        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                    >
                        保存更改
                    </button>
                </div>
            </>
        ) : renderAnalytics()}
      </div>
    </div>
  );
};

export default ConfigPanel;