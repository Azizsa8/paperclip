const PAPERCLIP_BASE = 'http://paperclip-groq.railway.internal:3100/api'
const OPENCLAW_BASE = 'http://openclaw.railway.internal:8080/v1'

export async function fetchAgents() {
  const res = await fetch(`${PAPERCLIP_BASE}/agents`)
  return res.json()
}

export async function fetchCampaigns() {
  const res = await fetch(`${PAPERCLIP_BASE}/campaigns`)
  return res.json()
}

export async function createCampaign(data: any) {
  const res = await fetch(`${PAPERCLIP_BASE}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function triggerAgent(agentId: string, payload: any) {
  const res = await fetch(`${OPENCLAW_BASE}/agents/${agentId}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.json()
}
