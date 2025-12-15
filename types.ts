import { Node, Edge } from 'reactflow';

export enum NodeType {
  TRIGGER = 'trigger',
  ACTION = 'action',
  CONDITION = 'condition',
  DELAY = 'delay',
  SPLIT = 'split',
  END = 'end'
}

export interface NodeData {
  label: string;
  subLabel?: string;
  type: NodeType;
  subtype?: string; // e.g., 'ai_recommend', 'coupon', 'sms'
  icon?: string; // Icon name from Lucide
  config?: Record<string, any>;
  stats?: {
    entered: number;
    active: number;
    converted: number;
  };
}

export type AppNode = Node<NodeData>;
export type AppEdge = Edge;

// New Configuration Interfaces
export type CampaignType = 'scheduled_single' | 'scheduled_recurring' | 'trigger_behavior' | 'trigger_event';

export type AttributionType = 'touch' | 'click' | 'fixed_window' | 'touch_window';

export interface CampaignSettings {
  name: string;
  description: string;
  type: CampaignType;
  scheduleConfig?: {
    startTime?: string;
    endTime?: string;
    cronExpression?: string; // For recurring
  };
  dndConfig: {
    enabled: boolean;
    startTime: string; // "22:00"
    endTime: string;   // "08:00"
  };
  attribution: {
    type: AttributionType;
    windowDuration?: number; // hours, for touch_window
    fixedWindowStart?: string;
    fixedWindowEnd?: string;
  };
}

export interface ScenarioTemplate {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: 'active' | 'paused' | 'draft';
  metrics: {
    conversionRate: string;
    revenue: string;
  };
  nodes: AppNode[];
  edges: AppEdge[];
  settings?: CampaignSettings; // Optional backfilled settings
}

export interface ToolbarItem {
  type: NodeType;
  subtype?: string;
  label: string;
  icon: string;
  description: string;
}

export interface ToolbarCategory {
  title: string;
  items: ToolbarItem[];
}