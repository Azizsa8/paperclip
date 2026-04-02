'use client'

import { useState } from 'react'
import { CheckCircle2, AlertCircle, Send, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'

const integrations = [
  { name: 'Paperclip', key: 'PAPERCLIP_URL', value: 'https://paperclip-groq-production.up.railway.app', status: 'connected' },
  { name: 'OpenClaw', key: 'OPENCLAW_URL', value: 'https://openclaw-production-af70.up.railway.app', status: 'connected' },
  { name: 'PostgreSQL', key: 'DATABASE_URL', value: 'Postgres.railway.internal:5432', status: 'connected' },
  { name: 'n8n', key: 'N8N_INSTANCE_URL', value: 'Not configured', status: 'pending' },
  { name: 'Airtable', key: 'AIRTABLE_API_KEY', value: 'Not configured', status: 'pending' },
  { name: 'Postforme', key: 'POSTFORME_API_KEY', value: 'Not configured', status: 'missing' },
  { name: 'LUMA AI', key: 'LUMA_API_KEY', value: 'Not configured', status: 'missing' },
  { name: 'Telegram Bot', key: 'TELEGRAM_BOT_TOKEN', value: 'Not configured', status: 'pending' },
]

const statusConfig = {
  connected: { color: 'text-success', bg: 'bg-success/20', icon: CheckCircle2, label: 'Connected' },
  pending: { color: 'text-warning', bg: 'bg-warning/20', icon: AlertCircle, label: 'Pending' },
  missing: { color: 'text-error', bg: 'bg-error/20', icon: AlertCircle, label: 'Missing' },
}

function AccordionSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-surface/40 transition-colors"
      >
        <h3 className="font-heading font-semibold text-text-primary">{title}</h3>
        {open ? <ChevronUp size={16} className="text-text-secondary" /> : <ChevronDown size={16} className="text-text-secondary" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-gold-border/10">{children}</div>}
    </div>
  )
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-2xl space-y-4">
      {/* Platform */}
      <AccordionSection title="Platform Configuration" defaultOpen>
        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-xs text-text-secondary mb-1.5">Default Market</label>
            <select className="w-full px-3 py-2 bg-background border border-gold-border/20 rounded-lg text-sm text-text-primary focus:border-accent focus:outline-none">
              <option>Saudi Arabia (KSA)</option>
              <option>UAE</option>
              <option>Kuwait</option>
              <option>Bahrain</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1.5">Strategic Agents LLM</label>
            <select className="w-full px-3 py-2 bg-background border border-gold-border/20 rounded-lg text-sm text-text-primary focus:border-accent focus:outline-none">
              <option>openrouter/xiaomi/mimo-v2-pro</option>
              <option>anthropic/claude-sonnet-4-6</option>
              <option>openai/gpt-5.4</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1.5">Execution Agents LLM</label>
            <select className="w-full px-3 py-2 bg-background border border-gold-border/20 rounded-lg text-sm text-text-primary focus:border-accent focus:outline-none">
              <option>groq/llama-3.3-70b-versatile</option>
              <option>openrouter/xiaomi/mimo-v2-pro</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1.5">Campaign Duration (days)</label>
            <input type="number" defaultValue={14} className="w-full px-3 py-2 bg-background border border-gold-border/20 rounded-lg text-sm text-text-primary focus:border-accent focus:outline-none" />
          </div>
        </div>
      </AccordionSection>

      {/* Integrations */}
      <AccordionSection title="Credential Status" defaultOpen>
        <div className="space-y-2 pt-4">
          {integrations.map((intg) => {
            const cfg = statusConfig[intg.status as keyof typeof statusConfig]
            const Icon = cfg.icon
            return (
              <div key={intg.name} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary">{intg.name}</p>
                  <p className="text-xs text-text-secondary font-mono truncate">{intg.key}</p>
                </div>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${cfg.color} ${cfg.bg}`}>
                  <Icon size={11} />
                  {cfg.label}
                </span>
              </div>
            )
          })}
          <p className="text-xs text-text-secondary mt-2">Credential values are never displayed — manage via Railway environment variables.</p>
        </div>
      </AccordionSection>

      {/* n8n */}
      <AccordionSection title="n8n Integration">
        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-xs text-text-secondary mb-1.5">Instance URL</label>
            <input type="text" placeholder="https://your-n8n.up.railway.app" className="w-full px-3 py-2 bg-background border border-gold-border/20 rounded-lg text-sm text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1.5">API Key</label>
            <input type="password" placeholder="n8n_api_..." className="w-full px-3 py-2 bg-background border border-gold-border/20 rounded-lg text-sm text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gold-border/30 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-accent/50 transition-colors">
            <RefreshCw size={14} /> Test Connection
          </button>
        </div>
      </AccordionSection>

      {/* Notifications */}
      <AccordionSection title="Notifications">
        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-xs text-text-secondary mb-1.5">Telegram Bot Token</label>
            <input type="password" placeholder="7432...:AAH..." className="w-full px-3 py-2 bg-background border border-gold-border/20 rounded-lg text-sm text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-1.5">Operator Chat ID</label>
            <input type="text" placeholder="-100..." className="w-full px-3 py-2 bg-background border border-gold-border/20 rounded-lg text-sm text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gold-border/30 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-accent/50 transition-colors">
            <Send size={14} /> Send Test Message
          </button>
          <div className="space-y-2">
            {['Campaign launched', 'Agent error', 'KPI threshold crossed', 'Deliverable ready for review'].map((trigger) => (
              <label key={trigger} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-yellow-400" />
                <span className="text-sm text-text-secondary">{trigger}</span>
              </label>
            ))}
          </div>
        </div>
      </AccordionSection>

      {/* Save */}
      <button
        onClick={handleSave}
        className={`w-full py-3 font-heading font-bold rounded-lg transition-all ${saved ? 'bg-success text-white' : 'bg-accent text-background hover:bg-accent-hover'}`}
      >
        {saved ? '✓ Settings Saved' : 'Save Settings'}
      </button>
    </div>
  )
}
