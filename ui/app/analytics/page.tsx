export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-semibold text-text-primary">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Campaigns', value: '47', change: '+12%' },
          { label: 'Content Published', value: '2,847', change: '+8%' },
          { label: 'Avg Engagement Rate', value: '5.2%', change: '+15%' },
          { label: 'Total Reach', value: '1.2M', change: '+22%' },
        ].map((metric) => (
          <div key={metric.label} className="glass-card gold-border-top p-4">
            <p className="text-2xl font-heading font-bold text-text-primary">{metric.value}</p>
            <p className="text-xs text-text-secondary">{metric.label}</p>
            <p className="text-xs text-success mt-1">{metric.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-heading font-semibold text-text-primary mb-4">Campaign Performance</h3>
          <div className="h-48 flex items-center justify-center text-text-secondary">
            <p>Recharts line chart placeholder</p>
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="font-heading font-semibold text-text-primary mb-4">Platform Distribution</h3>
          <div className="h-48 flex items-center justify-center text-text-secondary">
            <p>Recharts pie chart placeholder</p>
          </div>
        </div>
      </div>
    </div>
  )
}
