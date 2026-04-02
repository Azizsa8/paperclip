export default function DeliverablesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-text-primary">Deliverables</h2>
        <div className="flex gap-2">
          {['All', 'Images', 'Copy', 'Reports', 'Videos'].map((filter) => (
            <button key={filter} className="px-3 py-1.5 text-xs rounded-lg bg-surface text-text-secondary hover:text-text-primary hover:bg-surface/80 border border-gold-border/10">
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { type: 'Image', agent: 'Visual Designer', time: '2 hours ago', status: 'approved' },
          { type: 'Copy', agent: 'Copywriter Supreme', time: '3 hours ago', status: 'draft' },
          { type: 'Report', agent: 'Data Analyst', time: '5 hours ago', status: 'published' },
          { type: 'Image', agent: 'Prompt Engineer', time: '6 hours ago', status: 'approved' },
          { type: 'Copy', agent: 'Narrative Creator', time: '8 hours ago', status: 'published' },
          { type: 'Video', agent: 'Content Creator', time: '1 day ago', status: 'published' },
        ].map((item, i) => (
          <div key={i} className="glass-card gold-border-top p-4">
            <div className="h-32 bg-background rounded-lg mb-3 flex items-center justify-center">
              <span className="text-text-secondary text-sm">{item.type} Preview</span>
            </div>
            <p className="text-sm font-medium text-text-primary">{item.type} by {item.agent}</p>
            <p className="text-xs text-text-secondary">{item.time}</p>
            <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs ${
              item.status === 'published' ? 'bg-success/20 text-success' :
              item.status === 'approved' ? 'bg-info/20 text-info' :
              'bg-warning/20 text-warning'
            }`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
