import React from 'react';
import { TOOLBAR_CATEGORIES } from '../constants';
import * as Icons from 'lucide-react';
import { NodeType } from '../types';

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType, subtype: string | undefined, icon: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, subtype, icon, label }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex w-72 flex-col border-r border-slate-200 bg-white shadow-sm h-full select-none">
      <div className="p-4 border-b border-slate-100">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">组件库</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="space-y-6">
          {TOOLBAR_CATEGORIES.map((category, catIndex) => (
             <div key={catIndex}>
                 <h3 className="mb-3 text-xs font-bold text-slate-400 uppercase tracking-wide">{category.title}</h3>
                 <div className="grid grid-cols-2 gap-3">
                    {category.items.map((item) => {
                        const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle;
                        // Distinct style for AI items
                        const isAI = item.subtype === 'ai_recommend';
                        
                        return (
                        <div
                            key={`${item.type}-${item.subtype}`}
                            className={`group flex cursor-grab flex-col items-center gap-2 rounded-lg border p-3 transition-all hover:shadow-md active:cursor-grabbing text-center
                                ${isAI 
                                    ? 'border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-400' 
                                    : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-500'
                                }
                            `}
                            draggable
                            onDragStart={(event) => onDragStart(event, item.type, item.subtype, item.icon, item.label)}
                        >
                            <div className={`flex h-9 w-9 items-center justify-center rounded-lg shadow-sm ring-1 transition-colors
                                ${isAI
                                    ? 'bg-white text-indigo-600 ring-indigo-200 group-hover:bg-indigo-600 group-hover:text-white'
                                    : 'bg-white text-slate-600 ring-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                                }
                            `}>
                            <IconComponent className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-medium text-slate-700">{item.label}</span>
                        </div>
                        );
                    })}
                 </div>
             </div>
          ))}
        </div>
        
        <div className="mt-8 mb-4 rounded-lg bg-indigo-50 p-4 border border-indigo-100">
            <h3 className="text-indigo-900 font-bold text-xs mb-2">OmniFlow AI 引擎</h3>
            <p className="text-indigo-800 text-xs leading-relaxed">
                尝试拖入“AI 商品推荐”节点，让系统自动根据用户画像匹配最佳商品。
            </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;