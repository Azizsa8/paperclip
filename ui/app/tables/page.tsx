export default function TablesPage() {
  const tables = ['agents', 'campaigns', 'tasks', 'deliverables', 'analytics', 'personas', 'agent_logs']

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-semibold text-text-primary">Database Tables</h2>
      
      <div className="flex gap-2 mb-4">
        {tables.map((table) => (
          <button key={table} className="px-3 py-1.5 text-xs rounded-lg bg-surface text-text-secondary hover:text-text-primary border border-gold-border/10">
            {table}
          </button>
        ))}
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-text-primary">agents</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs rounded-lg bg-accent/10 text-accent border border-accent/30">Export CSV</button>
            <button className="px-3 py-1.5 text-xs rounded-lg bg-accent/10 text-accent border border-accent/30">Run Analysis</button>
            <button className="px-3 py-1.5 text-xs rounded-lg bg-accent/10 text-accent border border-accent/30">Add Row</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-secondary border-b border-gold-border/10">
                <th className="text-left py-2 px-3">ID</th>
                <th className="text-left py-2 px-3">Name</th>
                <th className="text-left py-2 px-3">Role</th>
                <th className="text-left py-2 px-3">Division</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-left py-2 px-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'ceo-agent', name: 'CEO Agent', role: 'Chief Executive Officer', division: 'c-suite', status: 'active', created: '2026-04-02' },
                { id: 'cmo-agent', name: 'CMO Agent', role: 'Chief Marketing Officer', division: 'c-suite', status: 'active', created: '2026-04-02' },
                { id: 'market-researcher', name: 'Market Researcher', role: 'Market Intelligence Analyst', division: 'research', status: 'active', created: '2026-04-02' },
              ].map((row) => (
                <tr key={row.id} className="border-b border-gold-border/5 hover:bg-surface/50">
                  <td className="py-2 px-3 text-text-secondary font-mono text-xs">{row.id}</td>
                  <td className="py-2 px-3 text-text-primary">{row.name}</td>
                  <td className="py-2 px-3 text-text-secondary">{row.role}</td>
                  <td className="py-2 px-3 text-text-secondary">{row.division}</td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-success/20 text-success">{row.status}</span>
                  </td>
                  <td className="py-2 px-3 text-text-secondary">{row.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
