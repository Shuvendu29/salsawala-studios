import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const perks = [
  'First class FREE — no commitment needed',
  'All levels welcome — from beginner to pro',
  'Flexible schedule — morning, evening & weekend batches',
  'State-of-the-art air-conditioned studio space',
]

export function CTASection() {
  return (
    <section className="py-24 bg-dark relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(189,178,255,0.2),transparent)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-primary/15 text-primary-700 border border-primary/30">
          Ready to Begin?
        </span>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mb-6 leading-tight">
          Join the{' '}
          <span className="bg-crimson-gradient bg-clip-text text-transparent">Salsawala</span>
          <br />Family Today
        </h2>
        <p className="font-body text-lg text-ink/60 mb-8 max-w-xl mx-auto leading-relaxed">
          500+ students have already discovered their love for dance with us. Your first class is on us — no strings attached.
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 max-w-xl mx-auto text-left">
          {perks.map(perk => (
            <li key={perk} className="flex items-start gap-2.5">
              <CheckCircle className="h-5 w-5 text-primary-dark shrink-0 mt-0.5" />
              <span className="font-body text-sm text-ink/70">{perk}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="shadow-glow-red w-full sm:w-auto">
              Start Your Free Trial
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Talk to Us First
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-xs text-ink/30 font-body">
          No credit card required · Cancel anytime · Join 500+ happy dancers
        </p>
      </div>
    </section>
  )
}
