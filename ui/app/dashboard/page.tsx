'use client'

import { Activity, Bot, CheckCircle2, AlertTriangle, Wifi, Zap } from 'lucide-react'

const kpis = [
  { label: 'Active Agents', value: '32', icon: Bot, color: 'text-success', pulse: true },
  { label: 'Tasks In Progress', value: '12', icon: Activity, color: 'text-warning', pulse: true },
  { label: 'Completed Today', value: '847', icon: CheckCircle2, color: 'text-success', pulse: false },
  { label: 'Errors / Alerts', value: '2', icon: AlertTriangle, color: 'text-error', pulse: true },
  { label: 'MCP Connections', value: '8/11', icon: Wifi, color: 'text-success', pulse: true },
  { label: 'API Calls/hr', value: '1,247', icon: Zap, color: 'text-info', pulse: false },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPI Strip */}
      <div className="grid grid-cols-6 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="glass-card gold-border-top p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className={kpi.color} />
                {kpi.pulse && <span className={`w-2 h-2 rounded-full ${kpi.color} pulse-green`}></span>}
              </div>
              <p className="text-2xl font-heading font-bold text-text-primary">{kpi.value}</p>
              <p className="text-xs text-text-secondary">{kpi.label}</p>
            </div>
          )
        })}
      </div>

      {/* Agent Status Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">Agent Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-secondary border-b border-gold-border/10">
                <th className="text-left py-2">Agent</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Division</th>
                <th className="text-left py-2">Current Task</th>
                <th className="text-left py-2">Last Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'CEO Agent', status: 'active', division: 'C-Suite', task: 'Overseeing campaign #47', last: '2 min ago' },
                { name: 'CMO Agent', status: 'active', division: 'C-Suite', task: 'Reviewing creative assets', last: '5 min ago' },
                { name: 'Market Researcher', status: 'active', division: 'Research', task: 'Analyzing competitor data', last: '1 min ago' },
                { name: 'Creative Director', status: 'active', division: 'Creative', task: 'Approving visual assets', last: '3 min ago' },
                { name: 'Social Media Manager', status: 'idle', division: 'Execution', task: 'Awaiting content approval', last: '15 min ago' },
                { name: 'Data Analyst', status: 'active', division: 'Analytics', task: 'Generating daily report', last: '1 min ago' },
              ].map((agent) => (
                <tr key={agent.name} className="border-b border-gold-border/5 hover:bg-surface/50 cursor-pointer">
                  <td className="py-3 text-text-primary font-medium">{agent.name}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      agent.status === 'active' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                    }`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="py-3 text-text-secondary">{agent.division}</td>
                  <td className="py-3 text-text-secondary">{agent.task}</td>
                  <td className="py-3 text-text-secondary">{agent.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Activity Log */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">Live Activity</h3>
        <div className="h-64 overflow-y-auto space-y-2 font-mono text-xs">
          {[
            { time: '14:32:15', agent: 'CEO Agent', action: 'Campaign #47 status updated to ACTIVE' },
            { time: '14:32:18', agent: 'CMO Agent', action: 'Delegated research task to Market Researcher' },
            { time: '14:32:22', agent: 'Market Researcher', action: 'Started competitor analysis for product X' },
            { time: '14:32:45', agent: 'Creative Director', action: 'Received visual assets from LUMA AI pipeline' },
            { time: '14:33:01', agent: 'Data Analyst', action: 'GA4 metrics synced - 1,247 sessions today' },
            { time: '14:33:15', agent: 'Persona Architect', action: 'Created 3 buyer personas for campaign #47' },
            { time: '14:33:30', agent: 'Copywriter Supreme', action: 'Generated 10 headline variations' },
            { time: '14:33:45', agent: 'Social Media Manager', action: 'Scheduled 5 posts for tomorrow' },
          ].map((log, i) => (
            <div key={i} className="flex gap-4 text-text-secondary">
              <span className="text-accent">{log.time}</span>
              <span className="text-text-primary w-32">{log.agent}</span>
              <span>{log.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
