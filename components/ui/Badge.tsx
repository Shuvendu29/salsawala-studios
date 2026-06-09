import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface BadgeProps {
  children: ReactNode
  variant?: 'primary' | 'gold' | 'outline' | 'success' | 'warning' | 'danger'
  className?: string
}

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  const variants = {
    primary: 'bg-primary/20 text-primary border border-primary/30',
    gold: 'bg-gold/20 text-gold border border-gold/30',
    outline: 'bg-transparent text-white border border-dark-border',
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
