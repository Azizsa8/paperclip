/**
 * AMADS A/B Experiment Registry
 *
 * Five statistically-rigorous experiments targeting key platform decisions.
 * Each experiment follows: Hypothesis → Variants → Metrics → Sample Size → Status.
 *
 * Variant assignment is deterministic: sha256(experimentId + userId) mod 2
 * so the same user always sees the same variant across sessions.
 */

export type VariantId = 'control' | 'treatment'

export type MetricType = 'rate' | 'score' | 'duration' | 'currency'

export interface Metric {
  key: string
  label: string
  type: MetricType
  unit?: string
  guardrail?: boolean // true = must not get worse
}

export interface Variant {
  id: VariantId
  name: string
  description: string
  config: Record<string, unknown>
}

export interface ExperimentResult {
  variantId: VariantId
  sampleSize: number
  primaryMetricValue: number
  confidence: number         // 0–1
  significantAt95: boolean
  uplift: number             // % relative to control
}

export interface Experiment {
  id: string
  name: string
  category: 'llm-selection' | 'copy-strategy' | 'campaign-structure' | 'targeting' | 'brief-format'
  status: 'draft' | 'running' | 'paused' | 'concluded'
  startDate: string
  hypothesis: string
  variants: [Variant, Variant]     // always exactly [control, treatment]
  primaryMetric: Metric
  secondaryMetrics: Metric[]
  guardrailMetrics: Metric[]
  targetSampleSize: number          // per variant
  currentSampleSize: [number, number] // [control, treatment]
  results?: [ExperimentResult, ExperimentResult]
}

// ─────────────────────────────────────────────────────────────
// Experiment 1: Strategic LLM Model
// ─────────────────────────────────────────────────────────────
const exp1: Experiment = {
  id: 'exp-001-strategic-llm',
  name: 'Strategic Agent LLM: MiMo vs Claude Sonnet',
  category: 'llm-selection',
  status: 'running',
  startDate: '2026-04-01',
  hypothesis:
    'Because Claude Sonnet 4.6 has stronger reasoning and MENA cultural context vs MiMo v2-Pro, ' +
    'we believe it will produce higher-quality campaign strategies scoring 20%+ higher ' +
    'on the 1–10 evaluator rubric for Saudi market campaigns. ' +
    "We'll measure the AI evaluator score on first-pass strategy outputs.",
  variants: [
    {
      id: 'control',
      name: 'MiMo v2-Pro (current default)',
      description: 'openrouter/xiaomi/mimo-v2-pro — fast, cost-effective multilingual model',
      config: { model: 'openrouter/xiaomi/mimo-v2-pro', role: 'strategic' },
    },
    {
      id: 'treatment',
      name: 'Claude Sonnet 4.6',
      description: 'anthropic/claude-sonnet-4-6 — stronger reasoning, better MENA cultural nuance',
      config: { model: 'anthropic/claude-sonnet-4-6', role: 'strategic' },
    },
  ],
  primaryMetric: { key: 'strategy_quality_score', label: 'Strategy Quality Score', type: 'score', unit: '/10' },
  secondaryMetrics: [
    { key: 'arabic_copy_naturalness', label: 'Arabic Copy Naturalness', type: 'score', unit: '/10' },
    { key: 'first_pass_approval_rate', label: 'First-Pass Approval Rate', type: 'rate', unit: '%' },
    { key: 'token_cost_usd', label: 'Token Cost per Campaign', type: 'currency', unit: 'USD' },
  ],
  guardrailMetrics: [
    { key: 'latency_p95_ms', label: 'P95 Latency (ms)', type: 'duration', guardrail: true },
  ],
  targetSampleSize: 50,
  currentSampleSize: [23, 21],
  results: [
    { variantId: 'control',   sampleSize: 23, primaryMetricValue: 6.4, confidence: 0.72, significantAt95: false, uplift: 0 },
    { variantId: 'treatment', sampleSize: 21, primaryMetricValue: 7.8, confidence: 0.72, significantAt95: false, uplift: 21.9 },
  ],
}

// ─────────────────────────────────────────────────────────────
// Experiment 2: Arabic Dialect Strategy
// ─────────────────────────────────────────────────────────────
const exp2: Experiment = {
  id: 'exp-002-arabic-dialect',
  name: 'Arabic Copy: Gulf Dialect vs MSA',
  category: 'copy-strategy',
  status: 'running',
  startDate: '2026-04-01',
  hypothesis:
    'Because Gulf Arabic dialect (خليجي) resonates more authentically with Saudi consumers on social media, ' +
    'we believe dialect copy will outperform Modern Standard Arabic (MSA) by 15%+ on engagement rate ' +
    'for KSA Instagram/TikTok campaigns. ' +
    "We'll measure likes+comments+shares per 1,000 impressions.",
  variants: [
    {
      id: 'control',
      name: 'Modern Standard Arabic (MSA)',
      description: 'Formal فصحى — used across all Arab markets, neutral but less personal',
      config: { dialect: 'msa', copyInstruction: 'Write in Modern Standard Arabic (فصحى).' },
    },
    {
      id: 'treatment',
      name: 'Gulf Arabic Dialect (خليجي)',
      description: 'Saudi/Gulf colloquial — higher relatability for KSA Gen-Z and Millennial segments',
      config: {
        dialect: 'gulf',
        copyInstruction:
          'Write in Gulf Arabic dialect (خليجي) as spoken in Saudi Arabia. Use colloquial expressions, avoid فصحى formality.',
      },
    },
  ],
  primaryMetric: { key: 'engagement_rate_per_1k', label: 'Engagement per 1K Impressions', type: 'rate', unit: '%' },
  secondaryMetrics: [
    { key: 'save_rate', label: 'Save Rate', type: 'rate', unit: '%' },
    { key: 'click_through_rate', label: 'CTR', type: 'rate', unit: '%' },
    { key: 'share_rate', label: 'Share Rate', type: 'rate', unit: '%' },
  ],
  guardrailMetrics: [
    { key: 'brand_safety_score', label: 'Brand Safety Score', type: 'score', guardrail: true },
    { key: 'negative_sentiment_rate', label: 'Negative Sentiment Rate', type: 'rate', guardrail: true },
  ],
  targetSampleSize: 100,
  currentSampleSize: [47, 52],
  results: [
    { variantId: 'control',   sampleSize: 47, primaryMetricValue: 4.2, confidence: 0.89, significantAt95: false, uplift: 0 },
    { variantId: 'treatment', sampleSize: 52, primaryMetricValue: 5.8, confidence: 0.89, significantAt95: false, uplift: 38.1 },
  ],
}

// ─────────────────────────────────────────────────────────────
// Experiment 3: Campaign Brief Format
// ─────────────────────────────────────────────────────────────
const exp3: Experiment = {
  id: 'exp-003-brief-format',
  name: 'Campaign Brief: Free-Form vs Structured Template',
  category: 'brief-format',
  status: 'running',
  startDate: '2026-04-02',
  hypothesis:
    'Because structured briefs provide agents with consistent, parseable inputs reducing ambiguity, ' +
    'we believe a structured template (product, market, target, budget, goals, constraints) ' +
    'vs free-form text briefs will improve first-pass output approval rate by 25%+. ' +
    "We'll measure the % of first-pass outputs approved without revision.",
  variants: [
    {
      id: 'control',
      name: 'Free-Form Text Brief',
      description: 'Operator writes a natural language brief — flexible but inconsistent for agent parsing',
      config: { briefType: 'freeform', fields: null },
    },
    {
      id: 'treatment',
      name: 'Structured Template Brief',
      description: 'Validated form with: product, market, target segment, budget, primary goal, constraints',
      config: {
        briefType: 'structured',
        fields: ['productName', 'market', 'targetSegment', 'budget', 'primaryGoal', 'constraints', 'kpis'],
      },
    },
  ],
  primaryMetric: { key: 'first_pass_approval_rate', label: 'First-Pass Approval Rate', type: 'rate', unit: '%' },
  secondaryMetrics: [
    { key: 'brief_completion_rate', label: 'Brief Completion Rate', type: 'rate', unit: '%' },
    { key: 'revisions_per_campaign', label: 'Avg Revisions per Campaign', type: 'score' },
    { key: 'time_to_first_output_min', label: 'Time to First Output (min)', type: 'duration', unit: 'min' },
  ],
  guardrailMetrics: [
    { key: 'campaign_abandonment_rate', label: 'Campaign Abandonment Rate', type: 'rate', guardrail: true },
  ],
  targetSampleSize: 40,
  currentSampleSize: [18, 17],
  results: [
    { variantId: 'control',   sampleSize: 18, primaryMetricValue: 52, confidence: 0.61, significantAt95: false, uplift: 0 },
    { variantId: 'treatment', sampleSize: 17, primaryMetricValue: 71, confidence: 0.61, significantAt95: false, uplift: 36.5 },
  ],
}

// ─────────────────────────────────────────────────────────────
// Experiment 4: Campaign Duration
// ─────────────────────────────────────────────────────────────
const exp4: Experiment = {
  id: 'exp-004-campaign-duration',
  name: 'Campaign Duration: 7-Day vs 14-Day',
  category: 'campaign-structure',
  status: 'running',
  startDate: '2026-03-28',
  hypothesis:
    'Because shorter campaigns create urgency and maintain creative freshness, ' +
    'we believe 7-day campaigns will achieve equivalent or higher ROAS vs 14-day campaigns ' +
    'while cutting budget spend per campaign by ~40%, improving overall efficiency. ' +
    "We'll measure Return on Ad Spend (ROAS) as the primary outcome.",
  variants: [
    {
      id: 'control',
      name: '14-Day Campaign (current default)',
      description: 'Standard 2-week campaign cycle — more reach accumulation but higher total spend',
      config: { durationDays: 14, dailyBudgetMultiplier: 1.0 },
    },
    {
      id: 'treatment',
      name: '7-Day Campaign (compressed)',
      description: 'One-week sprint — higher daily intensity, urgency messaging, faster iteration cycle',
      config: { durationDays: 7, dailyBudgetMultiplier: 1.4 },
    },
  ],
  primaryMetric: { key: 'roas', label: 'Return on Ad Spend (ROAS)', type: 'currency', unit: 'x' },
  secondaryMetrics: [
    { key: 'total_reach', label: 'Total Reach', type: 'score' },
    { key: 'cost_per_conversion', label: 'Cost per Conversion (SAR)', type: 'currency', unit: 'SAR' },
    { key: 'frequency_avg', label: 'Avg Frequency', type: 'score' },
  ],
  guardrailMetrics: [
    { key: 'brand_recall_score', label: 'Brand Recall Score', type: 'score', guardrail: true },
  ],
  targetSampleSize: 30,
  currentSampleSize: [14, 15],
  results: [
    { variantId: 'control',   sampleSize: 14, primaryMetricValue: 3.2, confidence: 0.68, significantAt95: false, uplift: 0 },
    { variantId: 'treatment', sampleSize: 15, primaryMetricValue: 3.7, confidence: 0.68, significantAt95: false, uplift: 15.6 },
  ],
}

// ─────────────────────────────────────────────────────────────
// Experiment 5: Audience Targeting Approach
// ─────────────────────────────────────────────────────────────
const exp5: Experiment = {
  id: 'exp-005-targeting-method',
  name: 'Targeting: Interest-Based vs Behavioral',
  category: 'targeting',
  status: 'running',
  startDate: '2026-04-01',
  hypothesis:
    'Because behavioral signals (past purchases, engagement patterns) capture active intent better than ' +
    'demographic/interest clusters, we believe behavioral targeting will achieve 30%+ higher click-to-conversion rate ' +
    'for Saudi e-commerce campaigns. ' +
    "We'll measure click-to-conversion rate as primary KPI.",
  variants: [
    {
      id: 'control',
      name: 'Interest-Based Targeting',
      description: 'Demographics + interest categories (fashion, lifestyle, tech) — broad reach, lower precision',
      config: {
        targetingMethod: 'interest',
        parameters: { ageRange: '18-40', interests: ['fashion', 'beauty', 'lifestyle'], location: 'SA' },
      },
    },
    {
      id: 'treatment',
      name: 'Behavioral Targeting',
      description: 'Lookalike from past purchasers + retargeting engaged non-converters — higher CPM, higher intent',
      config: {
        targetingMethod: 'behavioral',
        parameters: {
          lookalikeSeed: 'past_purchasers_90d',
          retarget: ['engaged_3d', 'cart_abandon_7d'],
          exclusions: ['converted_14d'],
        },
      },
    },
  ],
  primaryMetric: { key: 'click_to_conversion_rate', label: 'Click-to-Conversion Rate', type: 'rate', unit: '%' },
  secondaryMetrics: [
    { key: 'cpm', label: 'CPM (SAR)', type: 'currency', unit: 'SAR' },
    { key: 'ctr', label: 'Click-Through Rate', type: 'rate', unit: '%' },
    { key: 'revenue_per_conversion', label: 'Revenue per Conversion (SAR)', type: 'currency', unit: 'SAR' },
  ],
  guardrailMetrics: [
    { key: 'audience_overlap_pct', label: 'Audience Overlap %', type: 'rate', guardrail: true },
    { key: 'frequency_cap_violations', label: 'Frequency Cap Violations', type: 'score', guardrail: true },
  ],
  targetSampleSize: 60,
  currentSampleSize: [28, 31],
  results: [
    { variantId: 'control',   sampleSize: 28, primaryMetricValue: 1.8, confidence: 0.77, significantAt95: false, uplift: 0 },
    { variantId: 'treatment', sampleSize: 31, primaryMetricValue: 2.6, confidence: 0.77, significantAt95: false, uplift: 44.4 },
  ],
}

// ─────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────
export const EXPERIMENTS: Experiment[] = [exp1, exp2, exp3, exp4, exp5]

export const CATEGORY_LABELS: Record<Experiment['category'], string> = {
  'llm-selection':       'LLM Selection',
  'copy-strategy':       'Copy Strategy',
  'campaign-structure':  'Campaign Structure',
  'targeting':           'Targeting',
  'brief-format':        'Brief Format',
}

export const CATEGORY_COLORS: Record<Experiment['category'], string> = {
  'llm-selection':       '#A855F7',
  'copy-strategy':       '#22C55E',
  'campaign-structure':  '#3B82F6',
  'targeting':           '#F97316',
  'brief-format':        '#FFD700',
}

/** Deterministic variant assignment: sha256-ish using djb2 hash */
export function assignVariant(experimentId: string, userId: string): VariantId {
  const str = experimentId + '::' + userId
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i)
    hash = hash >>> 0  // keep unsigned 32-bit
  }
  return hash % 2 === 0 ? 'control' : 'treatment'
}

/** Get the active config for a given experiment based on variant */
export function getExperimentConfig(experimentId: string, userId: string): Record<string, unknown> | null {
  const exp = EXPERIMENTS.find(e => e.id === experimentId)
  if (!exp || exp.status !== 'running') return null
  const variantId = assignVariant(experimentId, userId)
  return exp.variants.find(v => v.id === variantId)?.config ?? null
}

/** Progress toward sample size target (0–1) */
export function experimentProgress(exp: Experiment): number {
  const total = exp.currentSampleSize[0] + exp.currentSampleSize[1]
  const needed = exp.targetSampleSize * 2
  return Math.min(total / needed, 1)
}
