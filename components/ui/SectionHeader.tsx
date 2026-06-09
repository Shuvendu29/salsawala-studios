import { cn } from '@/lib/utils/cn'

interface SectionHeaderProps {
  badge?: string
  title: string
  titleHighlight?: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({
  badge,
  title,
  titleHighlight,
  subtitle,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-12', centered && 'text-center', className)}>
      {badge && (
        <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-primary/10 text-primary border border-primary/20">
          {badge}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
        {title}{' '}
        {titleHighlight && (
          <span className="bg-crimson-gradient bg-clip-text text-transparent">{titleHighlight}</span>
        )}
      </h2>
      {subtitle && (
        <p className="mt-4 text-white/60 font-body text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
