// Public-facing URLs — Railway internal URLs are only reachable server-side
const PAPERCLIP_BASE =
  process.env.NEXT_PUBLIC_PAPERCLIP_URL
    ? `${process.env.NEXT_PUBLIC_PAPERCLIP_URL}/api`
    : 'https://paperclip-groq-production.up.railway.app/api'

const OPENCLAW_BASE =
  process.env.NEXT_PUBLIC_OPENCLAW_URL
    ? `${process.env.NEXT_PUBLIC_OPENCLAW_URL}/v1`
    : 'https://openclaw-production-af70.up.railway.app/v1'

export async function fetchAgents() {
  try {
    const res = await fetch(`${PAPERCLIP_BASE}/agents`, { next: { revalidate: 10 } })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export async function fetchCampaigns() {
  try {
    const res = await fetch(`${PAPERCLIP_BASE}/campaigns`, { next: { revalidate: 10 } })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export async function createCampaign(data: Record<string, unknown>) {
  const res = await fetch(`${PAPERCLIP_BASE}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function triggerAgent(agentId: string, payload: Record<string, unknown>) {
  const res = await fetch(`${OPENCLAW_BASE}/agents/${agentId}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json()
}
