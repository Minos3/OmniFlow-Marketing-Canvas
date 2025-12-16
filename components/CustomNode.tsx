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
  Copy, Trash2, Flag
} from 'lucide-react';
import { NodeType, NodeData } from '../types';

const iconMap: Record<string, React.ElementType> = {
  Zap, Send, GitBranch, Clock, Split, 
  ShoppingBag, MessageSquare, ShoppingCart, Ticket, 
  Eye, DollarSign, Users, Calendar, GitPullRequest, 
  Smartphone, Bell, UserPlus, Moon, FlaskConical, 
  Gift, Database, TrendingDown, BellRing,
  Sparkles, Tag, PlayCircle, Coins, MessageCircle, Mail,
  Gem, UserX, Cake, Megaphone, PackageCheck, Flag
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
    case NodeType.END:
      return 'border-slate-400 bg-slate-100 text-slate-700';
    default:
      return 'border-slate-400 bg-slate-50 text-slate-900';
  }
};

const CustomNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const { setNodes, getNodes, deleteElements } = useReactFlow();
  
  // Robust Icon Resolution:
  // 1. Check if data.icon exists
  // 2. Check if the icon exists in our map (and isn't undefined due to import failure)
  // 3. Fallback to Zap
  const Icon = (data.icon && iconMap[data.icon]) ? iconMap[data.icon] : Zap;
  
  const isTrigger = data.type === NodeType.TRIGGER;
  const isEnd = data.type === NodeType.END;

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
      setNodes((nds) => nds.map((n) => ({...n, selected: false})).concat(newNode));
    }
  };

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <div
      className={`relative min-w-[180px] rounded-xl border shadow-sm transition-all hover:shadow-md ${selected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''} ${getNodeStyles(data.type, data.subtype)}`}
    >
        {/* Node Toolbar for quick actions */}
        <NodeToolbar isVisible={selected} position={Position.Top}>
             <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                 <button onClick={onDuplicate} className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-indigo-600" title="复制">
                     <Copy className="h-4 w-4" />
                 </button>
                 <button onClick={onDelete} className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-red-600" title="删除">
                     <Trash2 className="h-4 w-4" />
                 </button>
             </div>
        </NodeToolbar>

      {/* Inputs (Targets): Top & Left */}
      {!isTrigger && (
        <>
            <Handle
            type="target"
            position={Position.Top}
            id="top"
            className="!h-3 !w-3 !bg-slate-400 !border-2 !border-white hover:!bg-indigo-500 transition-colors"
            />
            <Handle
            type="target"
            position={Position.Left}
            id="left"
            className="!h-3 !w-3 !bg-slate-400 !border-2 !border-white hover:!bg-indigo-500 transition-colors"
            />
        </>
      )}

      <div className="flex items-center gap-3 p-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/50 backdrop-blur-sm`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-bold leading-tight">{data.label}</div>
          {data.subLabel && <div className="mt-0.5 text-[10px] opacity-80">{data.subLabel}</div>}
        </div>
      </div>
      
      {/* Simulation Stats Overlay */}
      {data.stats && (
          <div className="border-t border-black/5 px-3 py-2 bg-white/30 backdrop-blur-[1px] rounded-b-xl">
              <div className="flex items-center justify-between text-[10px] font-medium">
                  <div className="flex flex-col">
                      <span className="opacity-60 uppercase tracking-wider">进入</span>
                      <span>{data.stats.entered.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col text-right">
                       <span className="opacity-60 uppercase tracking-wider">转化</span>
                       <span>{data.stats.converted.toLocaleString()}</span>
                  </div>
              </div>
          </div>
      )}

      {/* Outputs (Sources): Bottom & Right */}
      {!isEnd && (
        <>
            <Handle
            type="source"
            position={Position.Bottom}
            id="bottom"
            className="!h-3 !w-3 !bg-slate-400 !border-2 !border-white hover:!bg-indigo-500 transition-colors"
            />
            <Handle
            type="source"
            position={Position.Right}
            id="right"
            className="!h-3 !w-3 !bg-slate-400 !border-2 !border-white hover:!bg-indigo-500 transition-colors"
            />
        </>
      )}
    </div>
  );
};

export default memo(CustomNode);