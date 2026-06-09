import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-primary hover:bg-primary-dark text-ink shadow-glow-red hover:shadow-lg focus:ring-primary',
    secondary:
      'bg-white hover:bg-dark-hover text-ink border border-dark-border hover:border-primary focus:ring-primary',
    outline:
      'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-ink focus:ring-primary',
    ghost:
      'bg-transparent text-ink hover:bg-dark-surface focus:ring-primary',
    gold:
      'bg-gold-gradient text-ink font-bold hover:opacity-90 shadow-glow-gold focus:ring-gold',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading…
        </>
      ) : (
        children
      )}
    </button>
  )
}
