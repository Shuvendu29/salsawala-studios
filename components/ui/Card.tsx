import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export function Card({ children, className, hover = false, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-dark-card border border-dark-border rounded-2xl overflow-hidden',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover',
        glow && 'shadow-glow-red',
        className
      )}
    >
      {children}
    </div>
  )
}
