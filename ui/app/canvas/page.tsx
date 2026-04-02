'use client'

import { useCallback, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'

type AgentStatus = 'IDLE' | 'THINKING' | 'WORKING' | 'DELIVERING' | 'ERROR'

interface AgentData {
  name: string
  division: string
  model: string
  status: AgentStatus
  task: string
}

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

const statusColor: Record<AgentStatus, string> = {
  IDLE: '#64748B',
  THINKING: '#4F46E5',
  WORKING: '#F59E0B',
  DELIVERING: '#22C55E',
  ERROR: '#EF4444',
}

const agents: AgentData[] = [
  { name: 'CEO Agent', division: 'C-Suite', model: 'MiMo', status: 'WORKING', task: 'Overseeing Campaign #47' },
  { name: 'CMO Agent', division: 'C-Suite', model: 'MiMo', status: 'WORKING', task: 'Reviewing creative assets' },
  { name: 'CRO Agent', division: 'C-Suite', model: 'MiMo', status: 'THINKING', task: 'Analyzing conversion data' },
  { name: 'COO Agent', division: 'C-Suite', model: 'Groq', status: 'IDLE', task: 'Monitoring operations' },
  { name: 'Market Researcher', division: 'Research', model: 'Groq', status: 'WORKING', task: 'Scanning Saudi market trends' },
  { name: 'Product Researcher', division: 'Research', model: 'Groq', status: 'WORKING', task: 'Analyzing product positioning' },
  { name: 'Persona Architect', division: 'Research', model: 'Claude', status: 'DELIVERING', task: 'Finalizing 3 buyer personas' },
  { name: 'Competitor Analyst', division: 'Research', model: 'Groq', status: 'IDLE', task: 'Awaiting next cycle' },
  { name: 'Trend Forecaster', division: 'Research', model: 'Claude', status: 'THINKING', task: 'Processing Ramadan trends' },
  { name: 'Creative Director', division: 'Creative', model: 'Claude', status: 'WORKING', task: 'Approving visual concepts' },
  { name: 'Visual Designer', division: 'Creative', model: 'Claude', status: 'WORKING', task: 'Generating LUMA AI prompts' },
  { name: 'Copywriter Supreme', division: 'Creative', model: 'Claude', status: 'DELIVERING', task: 'Writing 10 ad headlines' },
  { name: 'Narrative Creator', division: 'Creative', model: 'Claude', status: 'IDLE', task: 'Awaiting brief' },
  { name: 'Psychology Master', division: 'Creative', model: 'Claude', status: 'THINKING', task: 'Crafting emotional hooks' },
  { name: 'Prompt Engineer', division: 'Prompt Team', model: 'Groq', status: 'WORKING', task: 'Optimizing image prompts' },
  { name: 'QA Agent', division: 'Prompt Team', model: 'Groq', status: 'WORKING', task: 'Reviewing output quality' },
  { name: 'Humanizer', division: 'Prompt Team', model: 'Groq', status: 'IDLE', task: 'Waiting for copy draft' },
  { name: 'Cultural Researcher', division: 'Prompt Team', model: 'Groq', status: 'THINKING', task: 'MENA cultural review' },
  { name: 'Campaign Strategist', division: 'Strategy', model: 'MiMo', status: 'WORKING', task: 'Building 14-day plan' },
  { name: 'Channel Strategist', division: 'Strategy', model: 'Groq', status: 'IDLE', task: 'Evaluating platform mix' },
  { name: 'Messaging Strategist', division: 'Strategy', model: 'Claude', status: 'DELIVERING', task: 'Messaging framework done' },
  { name: 'Budget Strategist', division: 'Strategy', model: 'Groq', status: 'WORKING', task: 'Allocating SAR 50,000' },
  { name: 'Timing Strategist', division: 'Strategy', model: 'Groq', status: 'IDLE', task: 'Setting post schedule' },
  { name: 'Social Media Manager', division: 'Execution', model: 'Groq', status: 'WORKING', task: 'Scheduling 5 posts' },
  { name: 'Paid Media Specialist', division: 'Execution', model: 'Groq', status: 'IDLE', task: 'Awaiting ad approval' },
  { name: 'SEO Specialist', division: 'Execution', model: 'Groq', status: 'WORKING', task: 'Optimizing landing page' },
  { name: 'Content Creator', division: 'Execution', model: 'Groq', status: 'DELIVERING', task: 'Post batch ready' },
  { name: 'DM Agent', division: 'Execution', model: 'Groq', status: 'IDLE', task: 'DM queue empty' },
  { name: 'Data Analyst', division: 'Analytics', model: 'Groq', status: 'WORKING', task: 'Syncing GA4 metrics' },
  { name: 'Behavior Analyst', division: 'Analytics', model: 'Claude', status: 'THINKING', task: 'Analyzing funnel drops' },
  { name: 'Sentiment Analyst', division: 'Analytics', model: 'Groq', status: 'WORKING', task: 'Monitoring brand mentions' },
  { name: 'Sales Analyst', division: 'Analytics', model: 'Groq', status: 'IDLE', task: 'Awaiting sales data' },
  { name: 'A/B Testing Agent', division: 'Optimization', model: 'Groq', status: 'WORKING', task: 'Running headline test' },
  { name: 'Performance Optimizer', division: 'Optimization', model: 'MiMo', status: 'THINKING', task: 'Analyzing CTR patterns' },
  { name: 'Auto-Learning Agent', division: 'Optimization', model: 'MiMo', status: 'DELIVERING', task: 'Storing 4 new learnings' },
]

// Layout: grid by division
const divisionPositions: Record<string, { x: number; y: number }> = {
  'C-Suite': { x: 600, y: 0 },
  'Research': { x: 0, y: 240 },
  'Creative': { x: 320, y: 240 },
  'Prompt Team': { x: 640, y: 240 },
  'Strategy': { x: 960, y: 240 },
  'Execution': { x: 1280, y: 240 },
  'Analytics': { x: 320, y: 560 },
  'Optimization': { x: 900, y: 560 },
}

function buildNodes(): Node[] {
  const divisionCounts: Record<string, number> = {}
  return agents.map((agent, i) => {
    const idx = divisionCounts[agent.division] ?? 0
    divisionCounts[agent.division] = idx + 1
    const base = divisionPositions[agent.division] ?? { x: 0, y: 0 }
    const col = idx % 3
    const row = Math.floor(idx / 3)
    return {
      id: `agent-${i}`,
      type: 'default',
      position: { x: base.x + col * 170, y: base.y + row * 110 },
      data: agent,
      style: {
        background: 'rgba(26, 20, 0, 0.95)',
        border: `1px solid ${divisionColor[agent.division] ?? '#FFD700'}40`,
        borderTop: `2px solid ${divisionColor[agent.division] ?? '#FFD700'}`,
        borderRadius: 8,
        padding: 0,
        width: 155,
        minHeight: 90,
      },
    }
  })
}

const edges: Edge[] = [
  { id: 'e-ceo-cmo', source: 'agent-0', target: 'agent-1', animated: true, style: { stroke: '#FFD70060' } },
  { id: 'e-ceo-cro', source: 'agent-0', target: 'agent-2', animated: true, style: { stroke: '#FFD70060' } },
  { id: 'e-ceo-coo', source: 'agent-0', target: 'agent-3', animated: false, style: { stroke: '#FFD70030' } },
  { id: 'e-cmo-research', source: 'agent-1', target: 'agent-4', style: { stroke: '#3B82F660' } },
  { id: 'e-cmo-creative', source: 'agent-1', target: 'agent-9', style: { stroke: '#A855F760' } },
  { id: 'e-cmo-strategy', source: 'agent-1', target: 'agent-18', style: { stroke: '#06B6D460' } },
  { id: 'e-coo-execution', source: 'agent-3', target: 'agent-23', style: { stroke: '#22C55E60' } },
  { id: 'e-cro-analytics', source: 'agent-2', target: 'agent-28', animated: true, style: { stroke: '#F9731660' } },
  { id: 'e-cro-optim', source: 'agent-2', target: 'agent-32', animated: true, style: { stroke: '#F43F5E60' } },
]

function AgentNodeContent({ data }: { data: AgentData }) {
  const color = divisionColor[data.division] ?? '#FFD700'
  const sColor = statusColor[data.status]
  return (
    <div className="p-2 h-full">
      <div className="flex items-center gap-1.5 mb-1">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: `${color}20`, color, border: `1px solid ${color}60` }}>
          {data.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate" style={{ color: '#F0EDE6', fontFamily: 'var(--font-syne)' }}>{data.name}</p>
          <p className="text-[10px]" style={{ color: color + 'CC' }}>{data.division}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 mb-1">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: sColor }} />
        <span className="text-[9px] font-mono" style={{ color: sColor }}>{data.status}</span>
        <span className="text-[9px] ml-auto" style={{ color: '#9E9B94' }}>{data.model}</span>
      </div>
      <p className="text-[9px] truncate" style={{ color: '#9E9B94' }}>{data.task}</p>
    </div>
  )
}

const nodeTypes = {
  default: ({ data }: { data: AgentData }) => <AgentNodeContent data={data} />,
}

export default function CanvasPage() {
  const initialNodes = buildNodes()
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edgesState, setEdges, onEdgesChange] = useEdgesState(edges)
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  const visibleNodes = selectedDivision
    ? nodes.map((n) => ({ ...n, hidden: (n.data as AgentData).division !== selectedDivision }))
    : nodes

  const activeCount = agents.filter((a) => a.status === 'WORKING' || a.status === 'DELIVERING').length

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-3">
      {/* Controls bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setSelectedDivision(null)}
          className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${!selectedDivision ? 'bg-accent/20 text-accent border border-accent/30' : 'text-text-secondary hover:text-text-primary bg-surface border border-gold-border/10'}`}
        >
          All Divisions
        </button>
        {Object.keys(divisionColor).map((div) => (
          <button
            key={div}
            onClick={() => setSelectedDivision(div === selectedDivision ? null : div)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${selectedDivision === div ? 'border' : 'text-text-secondary hover:text-text-primary bg-surface border border-gold-border/10'}`}
            style={selectedDivision === div ? { background: `${divisionColor[div]}20`, color: divisionColor[div], borderColor: `${divisionColor[div]}60` } : {}}
          >
            {div}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-xs text-text-secondary">
          <span className="text-success font-mono">{activeCount}</span> agents active
          <span className="text-text-secondary">·</span>
          <span className="font-mono">{agents.length}</span> total
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 rounded-xl overflow-hidden border border-gold-border/20" style={{ background: '#0A0800' }}>
        <ReactFlow
          nodes={visibleNodes}
          edges={edgesState}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={2}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#FFD70015" />
          <Controls style={{ background: '#1A1400', border: '1px solid rgba(255,215,0,0.2)' }} />
          <MiniMap
            style={{ background: '#1A1400', border: '1px solid rgba(255,215,0,0.2)' }}
            nodeColor={(n) => divisionColor[(n.data as AgentData)?.division] ?? '#FFD700'}
          />
        </ReactFlow>
      </div>
    </div>
  )
}
