'use client'

import { useState, useId } from 'react'
import { FlaskConical, TrendingUp, Users, CheckCircle2, Clock, Pause, ChevronDown, ChevronUp, AlertTriangle, BarChart2, Target } from 'lucide-react'
import {
  EXPERIMENTS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  experimentProgress,
  type Experiment,
  type Variant,
} from '@/lib/experiments'

// ─── Status badge ──────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Experiment['status'] }) {
  const map = {
    running:   { label: 'Running',   color: 'text-success', bg: 'bg-success/15',   icon: TrendingUp },
    paused:    { label: 'Paused',    color: 'text-warning', bg: 'bg-warning/15',   icon: Pause },
    concluded: { label: 'Concluded', color: 'text-accent',  bg: 'bg-accent/15',    icon: CheckCircle2 },
    draft:     { label: 'Draft',     color: 'text-text-secondary', bg: 'bg-surface', icon: Clock },
  }
  const cfg = map[status]
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color} ${cfg.bg}`}>
      <Icon size={10} /> {cfg.label}
    </span>
  )
}

// ─── Sample size progress bar ───────────────────────────────────────────────
function SampleProgress({ exp }: { exp: Experiment }) {
  const pct = experimentProgress(exp) * 100
  const [a, b] = exp.currentSampleSize
  const color = pct >= 100 ? '#22C55E' : '#FFD700'
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-text-secondary">
        <span>{a + b} collected</span>
        <span>{exp.targetSampleSize * 2} needed</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

// ─── Uplift bar ─────────────────────────────────────────────────────────────
function UpliftBadge({ uplift, confidence }: { uplift: number; confidence: number }) {
  const sig = confidence >= 0.95
  const color = uplift > 0 ? (sig ? '#22C55E' : '#FFD700') : '#EF4444'
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-mono font-semibold px-2 py-0.5 rounded"
      style={{ color, background: `${color}20` }}
    >
      {uplift > 0 ? '+' : ''}{uplift.toFixed(1)}%
      {sig ? ' ✓' : ' ~'}
    </span>
  )
}

// ─── Variant card ───────────────────────────────────────────────────────────
function VariantCard({ variant, result, primary }: { variant: Variant; result?: { primaryMetricValue: number; confidence: number; uplift: number }; primary: string }) {
  const isControl = variant.id === 'control'
  return (
    <div className={`flex-1 p-4 rounded-lg border ${isControl ? 'border-gold-border/20 bg-background/40' : 'border-accent/30 bg-accent/5'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${isControl ? 'bg-surface text-text-secondary' : 'bg-accent/20 text-accent'}`}>
          {isControl ? 'Control' : 'Treatment'}
        </span>
        {result && !isControl && <UpliftBadge uplift={result.uplift} confidence={result.confidence} />}
      </div>
      <p className="text-sm font-semibold text-text-primary mb-1">{variant.name}</p>
      <p className="text-xs text-text-secondary leading-relaxed">{variant.description}</p>
      {result && (
        <p className="mt-3 text-lg font-mono font-bold text-text-primary">
          {result.primaryMetricValue}
          <span className="text-xs text-text-secondary ml-1">{primary}</span>
        </p>
      )}
    </div>
  )
}

// ─── Experiment card ────────────────────────────────────────────────────────
function ExperimentCard({ exp }: { exp: Experiment }) {
  const [open, setOpen] = useState(false)
  const catColor = CATEGORY_COLORS[exp.category]
  const catLabel = CATEGORY_LABELS[exp.category]
  const pct = experimentProgress(exp) * 100

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 hover:bg-surface/30 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: catColor, background: `${catColor}20` }}>
                {catLabel}
              </span>
              <StatusBadge status={exp.status} />
              <span className="text-xs text-text-secondary font-mono">{exp.id}</span>
            </div>
            <h3 className="font-heading font-semibold text-text-primary pr-4">{exp.name}</h3>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Confidence indicator */}
            {exp.results && (
              <div className="text-center hidden sm:block">
                <p className="text-lg font-mono font-bold" style={{ color: catColor }}>
                  {(exp.results[1].confidence * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-text-secondary">confidence</p>
              </div>
            )}
            {/* Progress ring */}
            <div className="text-center">
              <p className="text-lg font-mono font-bold text-text-primary">{pct.toFixed(0)}%</p>
              <p className="text-xs text-text-secondary">sample</p>
            </div>
            {open ? <ChevronUp size={16} className="text-text-secondary" /> : <ChevronDown size={16} className="text-text-secondary" />}
          </div>
        </div>

        {/* Mini progress */}
        <div className="mt-3 h-1 rounded-full bg-surface overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: catColor }} />
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-5 pb-5 border-t border-gold-border/10 space-y-5">
          {/* Hypothesis */}
          <div className="pt-4">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Hypothesis</p>
            <p className="text-sm text-text-primary leading-relaxed italic">"{exp.hypothesis}"</p>
          </div>

          {/* Variants side-by-side */}
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Variants</p>
            <div className="flex gap-3">
              {exp.variants.map((v, i) => (
                <VariantCard
                  key={v.id}
                  variant={v}
                  result={exp.results?.[i]}
                  primary={exp.primaryMetric.unit ?? ''}
                />
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Primary Metric</p>
              <div className="p-3 bg-background/50 rounded-lg border border-gold-border/20">
                <p className="text-sm font-medium text-accent">{exp.primaryMetric.label}</p>
                <p className="text-xs text-text-secondary mt-0.5">{exp.primaryMetric.type}{exp.primaryMetric.unit ? ` · ${exp.primaryMetric.unit}` : ''}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Sample Progress</p>
              <div className="p-3 bg-background/50 rounded-lg border border-gold-border/20">
                <SampleProgress exp={exp} />
                <p className="text-xs text-text-secondary mt-2">{exp.targetSampleSize} per variant needed</p>
              </div>
            </div>
          </div>

          {/* Secondary + Guardrails */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Secondary Metrics</p>
              <div className="space-y-1">
                {exp.secondaryMetrics.map(m => (
                  <div key={m.key} className="flex items-center justify-between text-xs py-1 border-b border-gold-border/10">
                    <span className="text-text-secondary">{m.label}</span>
                    <span className="text-text-primary font-mono">{m.unit ?? m.type}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
                <AlertTriangle size={10} className="text-warning" /> Guardrail Metrics
              </p>
              <div className="space-y-1">
                {exp.guardrailMetrics.map(m => (
                  <div key={m.key} className="flex items-center gap-2 text-xs py-1 border-b border-gold-border/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning flex-shrink-0" />
                    <span className="text-text-secondary">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Config preview */}
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Treatment Config</p>
            <pre className="text-xs bg-background/60 border border-gold-border/20 rounded-lg p-3 text-accent font-mono overflow-auto">
              {JSON.stringify(exp.variants[1].config, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Summary stats ───────────────────────────────────────────────────────────
function SummaryStats() {
  const running   = EXPERIMENTS.filter(e => e.status === 'running').length
  const total     = EXPERIMENTS.length
  const totalN    = EXPERIMENTS.reduce((s, e) => s + e.currentSampleSize[0] + e.currentSampleSize[1], 0)
  const avgUplift = EXPERIMENTS.reduce((s, e) => s + (e.results?.[1].uplift ?? 0), 0) / total

  return (
    <div className="grid grid-cols-4 gap-3">
      {[
        { label: 'Active Tests', value: running, icon: FlaskConical, color: '#22C55E' },
        { label: 'Total Experiments', value: total, icon: BarChart2, color: '#A855F7' },
        { label: 'Total Observations', value: totalN, icon: Users, color: '#3B82F6' },
        { label: 'Avg Observed Uplift', value: `+${avgUplift.toFixed(1)}%`, icon: Target, color: '#FFD700' },
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
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ExperimentsPage() {
  const [filter, setFilter] = useState<Experiment['status'] | 'all'>('all')

  const visible = filter === 'all' ? EXPERIMENTS : EXPERIMENTS.filter(e => e.status === filter)

  return (
    <div className="space-y-5">
      {/* Summary */}
      <SummaryStats />

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'running', 'paused', 'concluded', 'draft'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === s
                ? 'bg-accent/15 text-accent border border-accent/30'
                : 'text-text-secondary hover:text-text-primary border border-transparent'
            }`}
          >
            {s === 'all' ? `All (${EXPERIMENTS.length})` : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <span className="ml-auto text-xs text-text-secondary">
          Significance threshold: 95% confidence · Min detectable effect: 15%
        </span>
      </div>

      {/* Experiment cards */}
      <div className="space-y-3">
        {visible.map(exp => (
          <ExperimentCard key={exp.id} exp={exp} />
        ))}
      </div>

      {/* Legend */}
      <div className="glass-card p-4 flex flex-wrap gap-4 text-xs text-text-secondary">
        <span className="flex items-center gap-1.5"><span className="font-mono font-bold text-success">+X% ✓</span> Statistically significant (≥95%)</span>
        <span className="flex items-center gap-1.5"><span className="font-mono font-bold text-warning">+X% ~</span> Trending (not yet significant)</span>
        <span className="flex items-center gap-1.5"><AlertTriangle size={11} className="text-warning" /> Guardrail metric — must not regress</span>
        <span className="ml-auto font-mono">n8n webhook: /webhook/amads/master-campaign</span>
      </div>
    </div>
  )
}
