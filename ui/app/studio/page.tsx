export default function StudioPage() {
  const agents = [
    { id: 'ceo-agent', name: 'CEO Agent', division: 'C-Suite', status: 'active' },
    { id: 'cmo-agent', name: 'CMO Agent', division: 'C-Suite', status: 'active' },
    { id: 'market-researcher', name: 'Market Researcher', division: 'Research', status: 'active' },
    { id: 'creative-director', name: 'Creative Director', division: 'Creative', status: 'active' },
    { id: 'social-media-manager', name: 'Social Media Manager', division: 'Execution', status: 'idle' },
  ]

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Agent List */}
      <div className="w-64 glass-card p-4 overflow-y-auto">
        <h3 className="text-sm font-heading font-semibold text-text-primary mb-4">Agents</h3>
        <div className="space-y-2">
          {agents.map((agent) => (
            <div key={agent.id} className="p-3 rounded-lg bg-background/50 hover:bg-background cursor-pointer border border-transparent hover:border-gold-border/20">
              <p className="text-sm font-medium text-text-primary">{agent.name}</p>
              <p className="text-xs text-text-secondary">{agent.division}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                agent.status === 'active' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
              }`}>
                {agent.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Editor */}
      <div className="flex-1 glass-card p-6">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">Agent Configuration</h3>
        <p className="text-text-secondary">Select an agent from the list to edit their configuration.</p>
      </div>
    </div>
  )
}
