'use client'

import { useState } from 'react'
import { ChevronRight, Cpu, Search } from 'lucide-react'

const divisionColor: Record<string, string> = {
  'C-Suite': '#FFD700',
  'Research': '#3B82F6',
  'Creative': '#A855F7',
  'Prompt Team': '#EC4899',
  'Strategy': '#06B6D4',
  'Execution': '#22C55E',
  'Analytics': '#F97316',
  'Optimization': '#F43F5E',
}

interface AgentNode {
  id: string
  name: string
  role: string
  division: string
  model: string
  status: 'active' | 'idle' | 'thinking'
  reports?: AgentNode[]
}

const hierarchy: AgentNode = {
  id: 'ceo', name: 'CEO Agent', role: 'Chief Executive Officer', division: 'C-Suite', model: 'MiMo', status: 'active',
  reports: [
    {
      id: 'cmo', name: 'CMO Agent', role: 'Chief Marketing Officer', division: 'C-Suite', model: 'MiMo', status: 'active',
      reports: [
        {
          id: 'creative-dir', name: 'Creative Director', role: 'Creative Lead', division: 'Creative', model: 'Claude', status: 'active',
          reports: [
            { id: 'visual', name: 'Visual Designer', role: 'Visual AI', division: 'Creative', model: 'Claude', status: 'active' },
            { id: 'copywriter', name: 'Copywriter Supreme', role: 'Copy AI', division: 'Creative', model: 'Claude', status: 'idle' },
            { id: 'narrative', name: 'Narrative Creator', role: 'Storytelling', division: 'Creative', model: 'Claude', status: 'idle' },
            { id: 'psychology', name: 'Psychology Master', role: 'Behavioral AI', division: 'Creative', model: 'Claude', status: 'thinking' },
          ],
        },
        {
          id: 'camp-strat', name: 'Campaign Strategist', role: 'Campaign Lead', division: 'Strategy', model: 'MiMo', status: 'active',
          reports: [
            { id: 'channel', name: 'Channel Strategist', role: 'Channel Mix', division: 'Strategy', model: 'Groq', status: 'idle' },
            { id: 'messaging', name: 'Messaging Strategist', role: 'Messaging', division: 'Strategy', model: 'Claude', status: 'active' },
            { id: 'budget', name: 'Budget Strategist', role: 'Budget AI', division: 'Strategy', model: 'Groq', status: 'active' },
            { id: 'timing', name: 'Timing Strategist', role: 'Schedule AI', division: 'Strategy', model: 'Groq', status: 'idle' },
          ],
        },
        {
          id: 'market-res', name: 'Market Researcher', role: 'Research Lead', division: 'Research', model: 'Groq', status: 'active',
          reports: [
            { id: 'product-res', name: 'Product Researcher', role: 'Product Intel', division: 'Research', model: 'Groq', status: 'active' },
            { id: 'persona', name: 'Persona Architect', role: 'Persona Builder', division: 'Research', model: 'Claude', status: 'active' },
            { id: 'competitor', name: 'Competitor Analyst', role: 'Competitive Intel', division: 'Research', model: 'Groq', status: 'idle' },
            { id: 'trend', name: 'Trend Forecaster', role: 'Trend Intel', division: 'Research', model: 'Claude', status: 'thinking' },
          ],
        },
        {
          id: 'prompt-eng', name: 'Prompt Engineer', role: 'Prompt Lead', division: 'Prompt Team', model: 'Groq', status: 'active',
          reports: [
            { id: 'qa', name: 'QA Agent', role: 'Quality Control', division: 'Prompt Team', model: 'Groq', status: 'active' },
            { id: 'humanizer', name: 'Humanizer', role: 'Human Touch', division: 'Prompt Team', model: 'Groq', status: 'idle' },
            { id: 'cultural', name: 'Cultural Researcher', role: 'Cultural Intel', division: 'Prompt Team', model: 'Groq', status: 'thinking' },
          ],
        },
      ],
    },
    {
      id: 'cro', name: 'CRO Agent', role: 'Chief Revenue Officer', division: 'C-Suite', model: 'MiMo', status: 'thinking',
      reports: [
        { id: 'sales-analyst', name: 'Sales Analyst', role: 'Sales Intel', division: 'Analytics', model: 'Groq', status: 'idle' },
        { id: 'ab-test', name: 'A/B Testing Agent', role: 'Experiment AI', division: 'Optimization', model: 'Groq', status: 'active' },
        { id: 'perf-opt', name: 'Performance Optimizer', role: 'Optimization AI', division: 'Optimization', model: 'MiMo', status: 'thinking' },
      ],
    },
    {
      id: 'coo', name: 'COO Agent', role: 'Chief Operations Officer', division: 'C-Suite', model: 'Groq', status: 'idle',
      reports: [
        {
          id: 'content-creator', name: 'Content Creator', role: 'Content Production', division: 'Execution', model: 'Groq', status: 'active',
          reports: [
            { id: 'social-mgr', name: 'Social Media Manager', role: 'Social Publishing', division: 'Execution', model: 'Groq', status: 'active' },
            { id: 'paid-media', name: 'Paid Media Specialist', role: 'Ad Campaigns', division: 'Execution', model: 'Groq', status: 'idle' },
            { id: 'seo', name: 'SEO Specialist', role: 'Search Optimization', division: 'Execution', model: 'Groq', status: 'active' },
            { id: 'dm-agent', name: 'DM Agent', role: 'Direct Messaging', division: 'Execution', model: 'Groq', status: 'idle' },
          ],
        },
        {
          id: 'data-analyst', name: 'Data Analyst', role: 'Analytics Lead', division: 'Analytics', model: 'Groq', status: 'active',
          reports: [
            { id: 'behavior', name: 'Behavior Analyst', role: 'Behavior Intel', division: 'Analytics', model: 'Claude', status: 'thinking' },
            { id: 'sentiment', name: 'Sentiment Analyst', role: 'Sentiment Intel', division: 'Analytics', model: 'Groq', status: 'active' },
          ],
        },
        { id: 'auto-learning', name: 'Auto-Learning Agent', role: 'Institutional Memory', division: 'Optimization', model: 'MiMo', status: 'active' },
      ],
    },
  ],
}

const statusColors: Record<string, string> = { active: '#22C55E', idle: '#64748B', thinking: '#4F46E5' }

function AgentCard({ node, depth = 0 }: { node: AgentNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2)
  const [selected, setSelected] = useState(false)
  const color = divisionColor[node.division] ?? '#FFD700'
  const hasChildren = node.reports && node.reports.length > 0

  return (
    <div className={`relative ${depth > 0 ? 'ml-6 pl-4 border-l border-gold-border/10' : ''}`}>
      <div
        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer mb-1 transition-all ${selected ? 'bg-accent/10 border border-accent/20' : 'hover:bg-surface/60'}`}
        onClick={() => { setSelected(!selected); if (hasChildren) setExpanded(!expanded) }}
      >
        {hasChildren && (
          <ChevronRight size={14} className={`text-text-secondary transition-transform ${expanded ? 'rotate-90' : ''}`} />
        )}
        {!hasChildren && <div className="w-3.5" />}

        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: `${color}15`, color, border: `1px solid ${color}40` }}>
          {node.name[0]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary truncate">{node.name}</span>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: statusColors[node.status] }} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary truncate">{node.role}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: `${color}15`, color }}>
            {node.division}
          </span>
          <span className="text-[10px] text-text-secondary font-mono flex items-center gap-0.5">
            <Cpu size={9} /> {node.model}
          </span>
        </div>
      </div>

      {expanded && node.reports && (
        <div>
          {node.reports.map((child) => (
            <AgentCard key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function HierarchyPage() {
  const [search, setSearch] = useState('')
  const activeCount = 19
  const totalCount = 35

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents..."
            className="w-full pl-8 pr-4 py-2 bg-surface border border-gold-border/20 rounded-lg text-sm text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex gap-2 text-xs text-text-secondary">
          <span className="text-success font-mono">{activeCount}</span> active ·
          <span className="font-mono">{totalCount}</span> total
        </div>
      </div>

      <div className="glass-card p-6 overflow-auto max-h-[calc(100vh-14rem)]">
        <AgentCard node={hierarchy} depth={0} />
      </div>
    </div>
  )
}
