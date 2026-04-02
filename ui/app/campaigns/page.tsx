'use client'

import { useState } from 'react'
import { Rocket, Plus, Clock, CheckCircle2, XCircle, Loader2, ChevronRight, FlaskConical, Zap, BarChart2, Users } from 'lucide-react'
import { EXPERIMENTS, assignVariant, CATEGORY_COLORS } from '@/lib/experiments'

// ─── Mock past campaigns ────────────────────────────────────────────────────
const PAST_CAMPAIGNS = [
  {
    id: 'CMP-881204',
    product: 'Luxury Oud Perfume — Al-Misk',
    market: 'KSA',
    status: 'completed',
    budget: 45000,
    roas: 3.8,
    reach: 284000,
    launched: '2026-03-22',
    model: 'openrouter/xiaomi/mimo-v2-pro',
    dialect: 'gulf',
    duration: 14,
  },
  {
    id: 'CMP-773015',
    product: 'Saudi Coffee Brand — Qahwa Gold',
    market: 'KSA',
    status: 'running',
    budget: 30000,
    roas: 2.9,
    reach: 142000,
    launched: '2026-03-28',
    model: 'anthropic/claude-sonnet-4-6',
    dialect: 'msa',
    duration: 7,
  },
  {
    id: 'CMP-654892',
    product: 'Athletic Wear — AzizSports KW',
    market: 'Kuwait',
    status: 'running',
    budget: 18000,
    roas: 2.1,
    reach: 89000,
    launched: '2026-03-30',
    model: 'openrouter/xiaomi/mimo-v2-pro',
    dialect: 'gulf',
    duration: 14,
  },
  {
    id: 'CMP-512377',
    product: 'Skincare Routine Bundle — GlowKSA',
    market: 'KSA',
    status: 'completed',
    budget: 60000,
    roas: 4.2,
    reach: 391000,
    launched: '2026-03-15',
    model: 'anthropic/claude-sonnet-4-6',
    dialect: 'gulf',
    duration: 14,
  },
]

const STATUS_MAP = {
  running:   { label: 'Running',   color: 'text-success', bg: 'bg-success/15',   icon: Loader2 },
  completed: { label: 'Completed', color: 'text-text-secondary', bg: 'bg-surface', icon: CheckCircle2 },
  failed:    { label: 'Failed',    color: 'text-error',   bg: 'bg-error/15',     icon: XCircle },
  draft:     { label: 'Draft',     color: 'text-warning', bg: 'bg-warning/15',   icon: Clock },
}

// ─── Launch form ─────────────────────────────────────────────────────────────
const USER_ID = 'operator-001'  // in a real app this comes from auth

function LaunchForm({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'form' | 'variants' | 'launching' | 'done'>('form')
  const [form, setForm] = useState({
    productName: '',
    market: 'KSA',
    targetSegment: '',
    budget: '',
    primaryGoal: 'conversions',
    constraints: '',
  })
  const [webhookResult, setWebhookResult] = useState<string | null>(null)

  // Determine which variant this operator is in for each experiment
  const assignedVariants = EXPERIMENTS.filter(e => e.status === 'running').map(exp => ({
    exp,
    variantId: assignVariant(exp.id, USER_ID),
    variant: exp.variants.find(v => v.id === assignVariant(exp.id, USER_ID))!,
  }))

  const handleLaunch = async () => {
    setStep('launching')
    try {
      const payload = {
        ...form,
        budget: Number(form.budget),
        experiments: assignedVariants.reduce((acc, { exp, variant }) => ({
          ...acc,
          [exp.id]: { variantId: variant.id, config: variant.config },
        }), {}),
        testRun: false,
      }
      const res = await fetch('https://n8n-prim.up.railway.app/webhook/amads/master-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const text = await res.text()
      setWebhookResult(res.ok ? 'Campaign launched successfully.' : `Warning: ${text}`)
    } catch (e) {
      setWebhookResult(`Network error: ${(e as Error).message}`)
    }
    setStep('done')
  }

  if (step === 'form') return (
    <div className="space-y-4">
      <h3 className="font-heading font-semibold text-text-primary">New Campaign Brief</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs text-text-secondary mb-1.5">Product / Brand Name</label>
          <input
            className="w-full px-3 py-2 bg-background border border-gold-border/20 rounded-lg text-sm text-text-primary focus:border-accent focus:outline-none"
            placeholder="e.g. Luxury Oud Perfume — Al-Misk"
            value={form.productName}
            onChange={e => setForm(f => ({...f, productName: e.target.value}))}
          />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1.5">Market</label>
          <select
            className="w-full px-3 py-2 bg-background border border-gold-border/20 rounded-lg text-sm text-text-primary focus:border-accent focus:outline-none"
            value={form.market}
            onChange={e => setForm(f => ({...f, market: e.target.value}))}
          >
            <option>KSA</option><option>UAE</option><option>Kuwait</option><option>Bahrain</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1.5">Budget (SAR)</label>
          <input
            type="number"
            className="w-full px-3 py-2 bg-background border border-gold-border/20 rounded-lg text-sm text-text-primary focus:border-accent focus:outline-none"
            placeholder="50000"
            value={form.budget}
            onChange={e => setForm(f => ({...f, budget: e.target.value}))}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-text-secondary mb-1.5">Target Segment</label>
          <input
            className="w-full px-3 py-2 bg-background border border-gold-border/20 rounded-lg text-sm text-text-primary focus:border-accent focus:outline-none"
            placeholder="e.g. Saudi women 25-40, luxury lifestyle, Instagram-first"
            value={form.targetSegment}
            onChange={e => setForm(f => ({...f, targetSegment: e.target.value}))}
          />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1.5">Primary Goal</label>
          <select
            className="w-full px-3 py-2 bg-background border border-gold-border/20 rounded-lg text-sm text-text-primary focus:border-accent focus:outline-none"
            value={form.primaryGoal}
            onChange={e => setForm(f => ({...f, primaryGoal: e.target.value}))}
          >
            <option value="conversions">Conversions</option>
            <option value="reach">Brand Awareness</option>
            <option value="engagement">Engagement</option>
            <option value="traffic">Traffic</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1.5">Constraints (optional)</label>
          <input
            className="w-full px-3 py-2 bg-background border border-gold-border/20 rounded-lg text-sm text-text-primary focus:border-accent focus:outline-none"
            placeholder="e.g. no competitor mentions, family-friendly imagery"
            value={form.constraints}
            onChange={e => setForm(f => ({...f, constraints: e.target.value}))}
          />
        </div>
      </div>
      <button
        onClick={() => setStep('variants')}
        disabled={!form.productName || !form.budget}
        className="flex items-center gap-2 px-4 py-2.5 bg-accent text-background rounded-lg font-heading font-bold text-sm hover:bg-accent-hover transition-colors disabled:opacity-40"
      >
        Review Active Experiments <ChevronRight size={14} />
      </button>
    </div>
  )

  if (step === 'variants') return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading font-semibold text-text-primary">Active Experiments</h3>
        <p className="text-xs text-text-secondary mt-1">
          Your operator ID <span className="font-mono text-accent">{USER_ID}</span> is deterministically assigned to these variants.
        </p>
      </div>
      <div className="space-y-2">
        {assignedVariants.map(({ exp, variantId, variant }) => {
          const catColor = CATEGORY_COLORS[exp.category]
          const isControl = variantId === 'control'
          return (
            <div key={exp.id} className="p-3 bg-background/50 border border-gold-border/20 rounded-lg flex items-start gap-3">
              <FlaskConical size={14} style={{ color: catColor }} className="mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-text-primary truncate">{exp.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isControl ? 'bg-surface text-text-secondary' : 'bg-accent/20 text-accent'}`}>
                    {isControl ? 'Control' : 'Treatment'}: {variant.name}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5 truncate">{variant.description}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex gap-3">
        <button onClick={() => setStep('form')} className="px-4 py-2 border border-gold-border/30 text-text-secondary rounded-lg text-sm hover:border-accent/50 hover:text-text-primary transition-colors">
          Back
        </button>
        <button onClick={handleLaunch} className="flex items-center gap-2 px-4 py-2.5 bg-accent text-background rounded-lg font-heading font-bold text-sm hover:bg-accent-hover transition-colors">
          <Rocket size={14} /> Launch Campaign
        </button>
      </div>
    </div>
  )

  if (step === 'launching') return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <Loader2 size={28} className="text-accent animate-spin" />
      <p className="text-sm text-text-secondary">Triggering n8n master campaign workflow…</p>
    </div>
  )

  return (
    <div className="text-center py-8 space-y-3">
      <CheckCircle2 size={32} className="text-success mx-auto" />
      <p className="font-heading font-semibold text-text-primary">Campaign Queued</p>
      <p className="text-sm text-text-secondary">{webhookResult}</p>
      <p className="text-xs text-text-secondary font-mono">n8n → CEO Agent → Research + Creative pipelines</p>
      <button onClick={onClose} className="px-4 py-2 bg-accent/15 text-accent rounded-lg text-sm hover:bg-accent/25 transition-colors">
        Close
      </button>
    </div>
  )
}

// ─── Campaign row ─────────────────────────────────────────────────────────────
function CampaignRow({ c }: { c: typeof PAST_CAMPAIGNS[0] }) {
  const { label, color, bg, icon: Icon } = STATUS_MAP[c.status as keyof typeof STATUS_MAP]
  return (
    <div className="flex items-center gap-4 p-4 bg-background/40 border border-gold-border/15 rounded-lg hover:border-gold-border/30 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-text-primary truncate">{c.product}</p>
          <span className="text-xs text-text-secondary bg-surface px-2 py-0.5 rounded">{c.market}</span>
        </div>
        <p className="text-xs text-text-secondary mt-0.5 font-mono">{c.id} · Launched {c.launched}</p>
      </div>
      <div className="hidden sm:flex items-center gap-6 text-xs text-text-secondary">
        <div className="text-center">
          <p className="font-mono font-bold text-text-primary text-sm">{c.roas}x</p>
          <p>ROAS</p>
        </div>
        <div className="text-center">
          <p className="font-mono font-bold text-text-primary text-sm">{(c.reach / 1000).toFixed(0)}K</p>
          <p>Reach</p>
        </div>
        <div className="text-center">
          <p className="font-mono font-bold text-text-primary text-sm">{c.duration}d</p>
          <p>Duration</p>
        </div>
      </div>
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${color} ${bg}`}>
        <Icon size={10} className={c.status === 'running' ? 'animate-spin' : ''} />
        {label}
      </span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CampaignsPage() {
  const [showForm, setShowForm] = useState(false)

  const running   = PAST_CAMPAIGNS.filter(c => c.status === 'running').length
  const completed = PAST_CAMPAIGNS.filter(c => c.status === 'completed').length
  const avgRoas   = (PAST_CAMPAIGNS.reduce((s, c) => s + c.roas, 0) / PAST_CAMPAIGNS.length).toFixed(1)
  const totalReach = PAST_CAMPAIGNS.reduce((s, c) => s + c.reach, 0)

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Active Campaigns', value: running, icon: Zap, color: '#22C55E' },
          { label: 'Completed',        value: completed, icon: CheckCircle2, color: '#A855F7' },
          { label: 'Avg ROAS',         value: `${avgRoas}x`, icon: BarChart2, color: '#FFD700' },
          { label: 'Total Reach',      value: `${(totalReach / 1000).toFixed(0)}K`, icon: Users, color: '#3B82F6' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} style={{ color }} />
              <span className="text-xs text-text-secondary">{label}</span>
            </div>
            <p className="text-2xl font-mono font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Header + Launch button */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-text-primary">Campaign History</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-background rounded-lg font-heading font-bold text-sm hover:bg-accent-hover transition-colors"
        >
          <Plus size={14} /> New Campaign
        </button>
      </div>

      {/* Launch modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg p-6 m-4 max-h-[90vh] overflow-auto">
            <LaunchForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Campaign list */}
      <div className="space-y-2">
        {PAST_CAMPAIGNS.map(c => <CampaignRow key={c.id} c={c} />)}
      </div>

      {/* Experiment notice */}
      <div className="glass-card p-4 flex items-start gap-3">
        <FlaskConical size={14} className="text-accent mt-0.5 flex-shrink-0" />
        <div className="text-xs text-text-secondary space-y-1">
          <p className="text-text-primary font-medium">Experiments Active</p>
          <p>{EXPERIMENTS.filter(e => e.status === 'running').length} A/B experiments are running. Each campaign launch is automatically tagged with your assigned variant. View results in the <strong className="text-accent">Experiments</strong> section.</p>
        </div>
      </div>
    </div>
  )
}
