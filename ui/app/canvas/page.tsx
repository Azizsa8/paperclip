export default function CanvasPage() {
  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="glass-card h-full p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary mb-2">Agent Network Visualization</p>
          <p className="text-xs text-text-secondary">React Flow canvas with 35 agent nodes</p>
          <p className="text-xs text-accent mt-4">Connect to Paperclip API for live data</p>
        </div>
      </div>
    </div>
  )
}
