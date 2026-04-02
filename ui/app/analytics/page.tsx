'use client'

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, Eye, Heart, ShoppingCart, DollarSign, FileText } from 'lucide-react'

const campaignTimeline = [
  { day: 'Day 1', reach: 4200, engagement: 380, conversions: 12 },
  { day: 'Day 2', reach: 6800, engagement: 520, conversions: 19 },
  { day: 'Day 3', reach: 9100, engagement: 710, conversions: 27 },
  { day: 'Day 4', reach: 11400, engagement: 890, conversions: 34 },
  { day: 'Day 5', reach: 14200, engagement: 1150, conversions: 48 },
  { day: 'Day 6', reach: 17800, engagement: 1380, conversions: 61 },
  { day: 'Day 7', reach: 22000, engagement: 1620, conversions: 78 },
  { day: 'Day 8', reach: 28500, engagement: 1940, conversions: 95 },
  { day: 'Day 9', reach: 34200, engagement: 2300, conversions: 112 },
  { day: 'Day 10', reach: 41000, engagement: 2780, conversions: 134 },
  { day: 'Day 11', reach: 48600, engagement: 3200, conversions: 158 },
  { day: 'Day 12', reach: 57000, engagement: 3700, conversions: 181 },
]

const platformData = [
  { platform: 'Instagram', reach: 38400, engagement: 5.8 },
  { platform: 'TikTok', reach: 52100, engagement: 8.2 },
  { platform: 'Snapchat', reach: 29700, engagement: 6.1 },
  { platform: 'Twitter/X', reach: 18300, engagement: 3.4 },
  { platform: 'LinkedIn', reach: 12400, engagement: 4.7 },
]

const contentPieData = [
  { name: 'Reels/Video', value: 38, color: '#FFD700' },
  { name: 'Image Posts', value: 28, color: '#A855F7' },
  { name: 'Stories', value: 22, color: '#3B82F6' },
  { name: 'Carousel', value: 12, color: '#22C55E' },
]

const agentPerf = [
  { agent: 'Copywriter Supreme', tasks: 47, success: 96, tokens: '128K', cost: '$2.14' },
  { agent: 'Visual Designer', tasks: 31, success: 94, tokens: '84K', cost: '$1.87' },
  { agent: 'Social Media Manager', tasks: 89, success: 98, tokens: '62K', cost: '$0.94' },
  { agent: 'Market Researcher', tasks: 24, success: 92, tokens: '210K', cost: '$3.22' },
  { agent: 'Data Analyst', tasks: 112, success: 99, tokens: '48K', cost: '$0.71' },
  { agent: 'Campaign Strategist', tasks: 18, success: 88, tokens: '320K', cost: '$4.85' },
]

const kpis = [
  { label: 'Total Reach', value: '150.4K', change: '+22%', up: true, icon: Eye, color: 'text-info' },
  { label: 'Engagement Rate', value: '5.2%', change: '+15%', up: true, icon: Heart, color: 'text-success' },
  { label: 'Conversions', value: '181', change: '+34%', up: true, icon: ShoppingCart, color: 'text-accent' },
  { label: 'ROAS', value: '3.8×', change: '-0.2×', up: false, icon: DollarSign, color: 'text-warning' },
  { label: 'Content Published', value: '127', change: '+8%', up: true, icon: FileText, color: 'text-success' },
]

const tooltipStyle = {
  backgroundColor: '#1A1400',
  border: '1px solid rgba(255,215,0,0.2)',
  borderRadius: 8,
  color: '#F0EDE6',
  fontSize: 12,
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-5 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <div key={k.label} className="glass-card gold-border-top p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon size={16} className={k.color} />
                <span className={`text-xs flex items-center gap-0.5 ${k.up ? 'text-success' : 'text-error'}`}>
                  {k.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {k.change}
                </span>
              </div>
              <p className="text-2xl font-heading font-bold text-text-primary">{k.value}</p>
              <p className="text-xs text-text-secondary mt-0.5">{k.label}</p>
            </div>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Campaign Timeline */}
        <div className="col-span-2 glass-card p-6">
          <h3 className="font-heading font-semibold text-text-primary mb-4">Campaign Timeline — Reach & Conversions</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={campaignTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,215,0,0.07)" />
              <XAxis dataKey="day" tick={{ fill: '#9E9B94', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9E9B94', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#9E9B94' }} />
              <Line type="monotone" dataKey="reach" stroke="#FFD700" strokeWidth={2} dot={false} name="Reach" />
              <Line type="monotone" dataKey="engagement" stroke="#A855F7" strokeWidth={2} dot={false} name="Engagement" />
              <Line type="monotone" dataKey="conversions" stroke="#22C55E" strokeWidth={2} dot={false} name="Conversions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Content Mix */}
        <div className="glass-card p-6">
          <h3 className="font-heading font-semibold text-text-primary mb-4">Content Mix</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={contentPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {contentPieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {contentPieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                <span className="text-text-secondary">{d.name}</span>
                <span className="ml-auto text-text-primary font-mono">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Performance */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold text-text-primary mb-4">Platform Performance</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={platformData} layout="vertical" barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,215,0,0.07)" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#9E9B94', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="platform" tick={{ fill: '#9E9B94', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="reach" fill="#FFD70050" name="Reach" radius={[0, 4, 4, 0]} />
            <Bar dataKey="engagement" fill="#A855F770" name="Eng. %" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Agent Performance Table */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-text-primary">Agent Performance</h3>
          <button className="text-xs text-accent border border-accent/30 px-3 py-1.5 rounded-lg hover:bg-accent/10 transition-colors">
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-secondary border-b border-gold-border/10">
                <th className="text-left py-2">Agent</th>
                <th className="text-left py-2">Tasks</th>
                <th className="text-left py-2">Success Rate</th>
                <th className="text-left py-2">Tokens Used</th>
                <th className="text-left py-2">Cost</th>
              </tr>
            </thead>
            <tbody>
              {agentPerf.map((a) => (
                <tr key={a.agent} className="border-b border-gold-border/5 hover:bg-surface/50">
                  <td className="py-3 text-text-primary font-medium">{a.agent}</td>
                  <td className="py-3 font-mono text-text-secondary">{a.tasks}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-background overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${a.success}%`, background: a.success >= 95 ? '#22C55E' : a.success >= 90 ? '#F59E0B' : '#EF4444' }} />
                      </div>
                      <span className="text-xs font-mono" style={{ color: a.success >= 95 ? '#22C55E' : a.success >= 90 ? '#F59E0B' : '#EF4444' }}>{a.success}%</span>
                    </div>
                  </td>
                  <td className="py-3 font-mono text-text-secondary">{a.tokens}</td>
                  <td className="py-3 font-mono text-text-secondary">{a.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
