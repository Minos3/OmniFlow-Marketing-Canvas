import React, { memo } from 'react';
import { Handle, Position, NodeProps, NodeToolbar, useReactFlow } from 'reactflow';
import { 
  Zap, Send, GitBranch, Clock, Split, 
  ShoppingBag, MessageSquare, ShoppingCart, Ticket, 
  Eye, DollarSign, Users, Calendar, GitPullRequest, 
  Smartphone, Bell, UserPlus, Moon, FlaskConical, 
  Gift, Database, TrendingDown, BellRing, MoreHorizontal,
  Sparkles, Tag, PlayCircle, Coins, MessageCircle, Mail,
  Gem, UserX, Cake, Megaphone, PackageCheck,
  Copy, Trash2
} from 'lucide-react';
import { NodeType, NodeData } from '../types';

const iconMap: Record<string, React.ElementType> = {
  Zap, Send, GitBranch, Clock, Split, 
  ShoppingBag, MessageSquare, ShoppingCart, Ticket, 
  Eye, DollarSign, Users, Calendar, GitPullRequest, 
  Smartphone, Bell, UserPlus, Moon, FlaskConical, 
  Gift, Database, TrendingDown, BellRing,
  Sparkles, Tag, PlayCircle, Coins, MessageCircle, Mail,
  Gem, UserX, Cake, Megaphone, PackageCheck
};

const getNodeStyles = (type: NodeType, subtype?: string) => {
  if (subtype === 'ai_recommend') {
      return 'border-indigo-500 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200 ring-offset-0';
  }

  switch (type) {
    case NodeType.TRIGGER:
      return 'border-emerald-500 bg-emerald-50 text-emerald-900';
    case NodeType.ACTION:
      // Differentiate channels vs internal actions if needed, or keep generic blue
      if (subtype === 'coupon' || subtype === 'member_tag') return 'border-pink-500 bg-pink-50 text-pink-900';
      return 'border-blue-500 bg-blue-50 text-blue-900';
    case NodeType.CONDITION:
    case NodeType.SPLIT:
      return 'border-violet-500 bg-violet-50 text-violet-900';
    case NodeType.DELAY:
      return 'border-amber-500 bg-amber-50 text-amber-900';
    default:
      return 'border-slate-400 bg-slate-50 text-slate-900';
  }
};

const CustomNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const { setNodes, getNodes, deleteElements } = useReactFlow();
  const Icon = data.icon ? iconMap[data.icon] : Zap;
  const isTrigger = data.type === NodeType.TRIGGER;
  const isAI = data.subtype === 'ai_recommend';

  const onDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const node = getNodes().find((n) => n.id === id);
    if (node) {
      const newNode = {
        ...node,
        id: Math.random().toString(36).substring(2, 9),
        position: { x: node.position.x + 50, y: node.position.y + 50 },
        selected: true,
      };
      // Deselect current
      setNodes((nds) => nds.map((n) => ({...n, selected: false})).concat(newNode));
    }
  };

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <>
      <NodeToolbar isVisible={selected} position={Position.Top} className="-translate-y-2">
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          <button 
            onClick={onDuplicate}
            className="rounded p-1 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            title="复制节点"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <div className="h-4 w-[1px] bg-slate-200"></div>
          <button 
            onClick={onDelete}
            className="rounded p-1 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            title="删除节点"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </NodeToolbar>

      <div
        className={`relative min-w-[200px] rounded-xl border-2 px-4 py-3 shadow-sm transition-all duration-200
          ${selected ? 'ring-2 ring-indigo-600 ring-offset-2' : ''}
          ${getNodeStyles(data.type, data.subtype)}
          hover:shadow-md
        `}
      >
        {/* Input Handle (Triggers don't have inputs) */}
        {!isTrigger && (
          <Handle
            type="target"
            position={Position.Top}
            className="!h-3 !w-3 !bg-slate-400"
          />
        )}

        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 shadow-sm border border-transparent`}>
            {Icon && <Icon className={`h-5 w-5 opacity-90 ${isAI ? 'text-indigo-600 animate-pulse' : ''}`} />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {data.subtype ? data.subtype.replace('_', ' ') : data.type}
              </div>
              {isAI && <span className="text-[8px] bg-indigo-600 text-white px-1 rounded">AI</span>}
            </div>
            
            <div className="font-bold leading-tight text-sm text-slate-900 mt-0.5">
              {data.label}
            </div>
            {data.subLabel && (
              <div className="text-xs text-slate-600 mt-1">
                {data.subLabel}
              </div>
            )}
          </div>
          <button className="text-current opacity-40 hover:opacity-100 transition-opacity">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Analytics overlay if configured */}
        {data.stats && (
          <div className="mt-3 flex flex-col gap-2 border-t border-black/10 pt-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-slate-600 font-medium">活跃</span>
                <span className="font-bold">{data.stats.active.toLocaleString()}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-slate-600 font-medium">转化</span>
                <span className="font-bold text-emerald-600">{data.stats.converted.toLocaleString()}</span>
              </div>
            </div>
            {/* Visual Bar */}
            <div className="h-1.5 w-full rounded-full bg-black/5 overflow-hidden">
               <div 
                 className="h-full bg-emerald-500 transition-all duration-1000" 
                 style={{ width: `${(data.stats.converted / (data.stats.entered || 1)) * 100}%` }}
               ></div>
            </div>
          </div>
        )}

        {/* Output Handle */}
        <Handle
          type="source"
          position={Position.Bottom}
          className="!h-3 !w-3 !bg-slate-400"
        />
      </div>
    </>
  );
};

export default memo(CustomNode);