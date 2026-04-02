'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Rocket,
  Network,
  GitBranch,
  Palette,
  FileBox,
  Table2,
  Brain,
  BarChart3,
  Settings,
  FlaskConical,
  Megaphone,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/experiments', label: 'Experiments', icon: FlaskConical },
  { href: '/canvas', label: 'Agent Canvas', icon: Network },
  { href: '/hierarchy', label: 'Hierarchy', icon: GitBranch },
  { href: '/studio', label: 'Studio', icon: Palette },
  { href: '/deliverables', label: 'Deliverables', icon: FileBox },
  { href: '/tables', label: 'Tables', icon: Table2 },
  { href: '/intelligence', label: 'Intelligence', icon: Brain },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-surface border-r border-gold-border/20 p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-accent">AMADS</h1>
        <p className="text-xs text-text-secondary">Marketing OS v1.0</p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-accent/10 text-accent border border-accent/30'
                  : 'text-text-secondary hover:bg-surface/80 hover:text-text-primary'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
