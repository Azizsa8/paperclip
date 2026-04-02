export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-heading font-semibold text-text-primary">System Settings</h2>
      
      <div className="glass-card gold-border-top p-6">
        <h3 className="font-heading font-semibold text-text-primary mb-4">General</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Platform Name</label>
            <input type="text" defaultValue="AMADS Marketing OS" className="w-full px-4 py-2 bg-background border border-gold-border/20 rounded-lg text-text-primary" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Default LLM Model</label>
            <select className="w-full px-4 py-2 bg-background border border-gold-border/20 rounded-lg text-text-primary">
              <option>groq/llama-3.3-70b-versatile</option>
              <option>openrouter/xiaomi/mimo-v2-pro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Language</label>
            <select className="w-full px-4 py-2 bg-background border border-gold-border/20 rounded-lg text-text-primary">
              <option>English</option>
              <option>Arabic</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-card gold-border-top p-6">
        <h3 className="font-heading font-semibold text-text-primary mb-4">Integrations</h3>
        <div className="space-y-3">
          {[
            { name: 'Paperclip', status: 'connected', url: 'paperclip-groq.railway.internal:3100' },
            { name: 'OpenClaw', status: 'connected', url: 'openclaw.railway.internal:8080' },
            { name: 'n8n', status: 'connected', url: 'n8n-prim.up.railway.app' },
            { name: 'PostgreSQL', status: 'connected', url: 'Postgres.railway.internal:5432' },
            { name: 'postforme.dev', status: 'pending', url: 'Not configured' },
            { name: 'LUMA AI', status: 'pending', url: 'Not configured' },
          ].map((integration) => (
            <div key={integration.name} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-text-primary">{integration.name}</p>
                <p className="text-xs text-text-secondary font-mono">{integration.url}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                integration.status === 'connected' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
              }`}>
                {integration.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button className="px-6 py-3 bg-accent text-background font-heading font-bold rounded-lg hover:bg-accent-hover transition-colors">
        Save Settings
      </button>
    </div>
  )
}
