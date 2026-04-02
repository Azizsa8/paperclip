export default function HierarchyPage() {
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-heading font-semibold text-text-primary mb-6">Organization Hierarchy</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="glass-card gold-border-top p-4 text-center">
            <p className="font-heading font-bold text-accent">CEO Agent</p>
            <p className="text-xs text-text-secondary">Chief Executive Officer</p>
          </div>
        </div>
        <div className="flex justify-center gap-8">
          {['CMO', 'CRO', 'COO'].map((role) => (
            <div key={role} className="glass-card gold-border-top p-3 text-center">
              <p className="font-heading font-semibold text-text-primary">{role} Agent</p>
              <p className="text-xs text-text-secondary">C-Suite</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 flex-wrap">
          {['Research', 'Creative', 'Strategy', 'Execution', 'Analytics', 'Optimization', 'Prompt Team'].map((div) => (
            <div key={div} className="glass-card p-3 text-center min-w-[120px]">
              <p className="text-sm font-medium text-text-primary">{div}</p>
              <p className="text-xs text-text-secondary">Division</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
