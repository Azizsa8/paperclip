'use client'

import { usePathname } from 'next/navigation'
import { Bell, User, Globe } from 'lucide-react'

export function TopBar() {
  const pathname = usePathname()
  const pageTitle = pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'
  const capitalizedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)

  return (
    <header className="h-16 bg-surface border-b border-gold-border/20 px-6 flex items-center justify-between">
      <h2 className="text-xl font-heading font-semibold text-text-primary">
        {capitalizedTitle}
      </h2>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 text-text-secondary hover:text-text-primary transition-colors">
          <Globe size={16} />
          <span className="text-sm">EN</span>
        </button>

        <button className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
        </button>

        <button className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium">
          A
        </button>
      </div>
    </header>
  )
}
