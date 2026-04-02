'use client'

import { useState } from 'react'
import { BookOpen, Lightbulb, Filter, Archive, CheckCircle2, Clock, Upload } from 'lucide-react'

const learnings = [
  { id: 1, category: 'Creative Direction', scope: 'Global platform rule', text: 'Always include a clear CTA in Arabic for MENA campaigns — English CTAs reduce conversion by 31% in Saudi market.', impact: 9, timesApplied: 14, verified: true, date: '2026-03-28' },
  { id: 2, category: 'Cultural Fit', scope: 'This product type', text: 'Avoid imagery with mixed-gender groups for conservative segment targeting — use family or single-gender shots instead.', impact: 8, timesApplied: 7, verified: true, date: '2026-03-25' },
  { id: 3, category: 'Research Quality', scope: 'This content type', text: 'Competitor pricing data from Noon.com is 24-48hrs delayed. Always cross-check with Salla store scrape.', impact: 6, timesApplied: 4, verified: false, date: '2026-03-22' },
  { id: 4, category: 'Language/Arabic Quality', scope: 'This agent always', text: 'Copywriter output in Gulf Arabic dialect outperforms MSA by 18% engagement. Use خليجي dialect for all KSA campaigns.', impact: 9, timesApplied: 11, verified: true, date: '2026-03-20' },
  { id: 5, category: 'Strategic Alignment', scope: 'Global platform rule', text: 'Campaign launches during Riyadh Season drive 3× higher reach — schedule launches accordingly.', impact: 7, timesApplied: 3, verified: false, date: '2026-03-15' },
  { id: 6, category: 'Process Issue', scope: 'This deliverable only', text: 'LUMA AI image pipeline adds 8-12 min latency. Trigger image generation 15 min before content deadlines.', impact: 5, timesApplied: 8, verified: true, date: '2026-03-10' },
]

const knowledgeFiles = [
  { name: 'Saudi Market Overview 2026.md', size: '24KB', updated: '2026-03-30' },
  { name: 'MENA Consumer Personas.md', size: '18KB', updated: '2026-03-28' },
  { name: 'Platform Algorithm Notes.md', size: '12KB', updated: '2026-03-25' },
  { name: 'Creative Guardrails — MENA.md', size: '8KB', updated: '2026-03-22' },
  { name: 'Competitor Landscape Q1 2026.md', size: '31KB', updated: '2026-03-20' },
  { name: 'Pricing Psychology — Gulf.md', size: '15KB', updated: '2026-03-18' },
]

const knowledgeContent: Record<string, string> = {
  'Saudi Market Overview 2026.md': `# Saudi Market Overview Q1 2026\n\nThe Saudi e-commerce market reached SAR 47.6B in 2025, representing 18% YoY growth. Mobile commerce accounts for 78% of all transactions, with peak activity between 9PM–1AM AST.\n\n## Key Platforms\n\nNoon.com holds 34% market share, followed by Amazon.sa at 28%. TikTok Shop launched in KSA Q4 2025 and already captures 12% of Gen-Z purchases.\n\n## Consumer Behavior\n\nAverage order value: SAR 284. Return rate: 22%. Top categories: Fashion (31%), Electronics (24%), Beauty (18%).`,
  'MENA Consumer Personas.md': `# MENA Consumer Personas\n\n## Persona 1: The Saudi Trendsetter (محمد، 24)\n\nAge: 18–28 | Gender: Male | Income: Mid | Platform: TikTok, Snapchat\n\nMotivated by social proof, limited-edition drops, and FOMO. Responds to Arabic slang and local humor.\n\n## Persona 2: The Gulf Homemaker (نورة، 34)\n\nAge: 28–42 | Gender: Female | Income: Upper-Mid | Platform: Instagram\n\nPurchase-driven by family value propositions. Arabic copy with family imagery converts best.`,
}

const categoryColors: Record<string, string> = {
  'Creative Direction': '#A855F7',
  'Cultural Fit': '#EC4899',
  'Research Quality': '#3B82F6',
  'Language/Arabic Quality': '#22C55E',
  'Strategic Alignment': '#FFD700',
  'Process Issue': '#F97316',
}

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<'learnings' | 'knowledge'>('learnings')
  const [selectedFile, setSelectedFile] = useState(knowledgeFiles[0].name)

  return (
    <div className="space-y-4">
      <div className="flex gap-1 p-1 rounded-lg bg-surface w-fit border border-gold-border/20">
        {(['learnings', 'knowledge'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all ${activeTab === tab ? 'bg-accent/15 text-accent border border-accent/30' : 'text-text-secondary hover:text-text-primary'}`}
          >
            {tab === 'learnings' ? <Lightbulb size={14} /> : <BookOpen size={14} />}
            {tab === 'learnings' ? 'Campaign Learnings' : 'Knowledge Library'}
          </button>
        ))}
      </div>

      {activeTab === 'learnings' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Filter size={14} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">{learnings.length} learnings stored</span>
            <span className="text-text-secondary">·</span>
            <span className="text-sm text-success">{learnings.filter((l) => l.verified).length} verified</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {learnings.map((l) => {
              const color = categoryColors[l.category] ?? '#FFD700'
              return (
                <div key={l.id} className="glass-card p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${color}20`, color }}>
                      {l.category}
                    </span>
                    {l.verified && <CheckCircle2 size={14} className="text-success flex-shrink-0 mt-0.5" />}
                  </div>
                  <p className="text-sm text-text-primary leading-relaxed">{l.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i < l.impact ? color : 'rgba(255,215,0,0.1)' }} />
                      ))}
                    </div>
                    <span className="text-xs text-text-secondary ml-auto">Applied {l.timesApplied}×</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">{l.scope}</span>
                    <div className="flex gap-2">
                      <button className="text-xs text-accent hover:underline">Edit Scope</button>
                      <button className="text-xs text-text-secondary hover:text-error flex items-center gap-1">
                        <Archive size={10} /> Archive
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'knowledge' && (
        <div className="grid grid-cols-3 gap-6" style={{ height: 'calc(100vh - 16rem)' }}>
          <div className="glass-card p-4 overflow-auto">
            <h3 className="text-sm font-heading font-semibold text-text-primary mb-3">Files</h3>
            <div className="space-y-1">
              {knowledgeFiles.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setSelectedFile(f.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${selectedFile === f.name ? 'bg-accent/10 text-accent border border-accent/20' : 'text-text-secondary hover:bg-surface/60 hover:text-text-primary'}`}
                >
                  <div className="font-medium truncate">{f.name}</div>
                  <div className="flex items-center gap-1 mt-0.5 opacity-70">
                    <span>{f.size}</span>
                    <Clock size={8} />
                    <span>{f.updated}</span>
                  </div>
                </button>
              ))}
            </div>
            <button className="w-full mt-3 py-2 border border-dashed border-gold-border/30 rounded-lg text-xs text-text-secondary hover:border-accent/50 hover:text-accent transition-colors flex items-center justify-center gap-1">
              <Upload size={12} /> Upload Knowledge
            </button>
          </div>
          <div className="col-span-2 glass-card p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-text-primary">{selectedFile}</h3>
              <button className="text-xs text-accent border border-accent/30 px-3 py-1.5 rounded-lg hover:bg-accent/10 transition-colors">
                Edit
              </button>
            </div>
            <pre className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed font-body">
              {knowledgeContent[selectedFile] ?? `# ${selectedFile.replace('.md', '')}\n\nKnowledge document. Click Edit to modify.\n\nThis file contains curated intelligence for AMADS agents to reference during campaign execution.`}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
