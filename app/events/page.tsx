import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { upcomingEvents } from '@/lib/data/events'

export const metadata: Metadata = {
  title: 'Events & Workshops',
  description: 'Upcoming dance events, workshops, and social nights at Salsawala Studios Kolkata. Salsa Bootcamp, Latin Social Night, Bachata Workshop & more.',
}

const typeColors: Record<string, 'primary' | 'gold' | 'success' | 'warning'> = {
  workshop: 'primary',
  social: 'gold',
  performance: 'success',
  competition: 'warning',
}

export default function EventsPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,200,221,0.2),transparent)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="gold" className="mb-6">Events & Workshops</Badge>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-ink mb-6">
            Dance Events That{' '}
            <span className="bg-gold-gradient bg-clip-text text-transparent">Move You</span>
          </h1>
          <p className="font-body text-xl text-ink/60 leading-relaxed">
            From intensive workshops to social dance nights — there&apos;s always something exciting at Salsawala Studios.
          </p>
        </div>
      </section>

      {/* Events grid */}
      <section className="py-16 bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map(event => {
              const date = new Date(event.date)
              const spotsLeft = event.capacity - event.enrolled
              const pctFull = (event.enrolled / event.capacity) * 100
              return (
                <div key={event.id} className="group bg-dark-card border border-dark-border rounded-3xl overflow-hidden hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                  {/* Dark gradient header — keep text-white */}
                  <div className={`relative h-48 bg-gradient-to-br ${event.gradient} flex items-end p-6`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10 flex items-end justify-between w-full">
                      <Badge variant={typeColors[event.type] || 'primary'}>{event.tag}</Badge>
                      <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-3 text-center">
                        <div className="font-display text-3xl font-bold text-white leading-none">{date.getDate()}</div>
                        <div className="font-body text-xs text-white/70 uppercase">{date.toLocaleString('default', { month: 'short' })} {date.getFullYear()}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-display text-2xl font-bold text-ink mb-2 group-hover:text-primary-dark transition-colors">{event.title}</h3>
                    <p className="font-body text-ink/60 leading-relaxed mb-5">{event.description}</p>

                    <div className="space-y-2.5 mb-5">
                      <div className="flex items-center gap-2 text-sm text-ink/50 font-body">
                        <Clock className="h-4 w-4 text-primary-dark" />{event.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-ink/50 font-body">
                        <MapPin className="h-4 w-4 text-primary-dark" />{event.venue}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-body">
                        <Users className="h-4 w-4 text-primary-dark" />
                        <span className={spotsLeft < 15 ? 'text-amber-500' : 'text-ink/50'}>
                          {spotsLeft} of {event.capacity} spots remaining
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-dark-surface rounded-full h-1.5 mb-5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all"
                        style={{ width: `${pctFull}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-display text-2xl font-bold text-ink">
                          {event.price === 0 ? 'FREE' : `₹${event.price.toLocaleString()}`}
                        </span>
                        {event.price > 0 && <span className="text-sm text-ink/50 font-body ml-1">/person</span>}
                      </div>
                      <Link href={`/contact?subject=Register for ${encodeURIComponent(event.title)}`}>
                        <Button size="md">Register Now <ArrowRight className="h-4 w-4" /></Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Host an event CTA */}
      <section className="py-16 bg-dark">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-ink mb-4">Want to Host a Private Event?</h2>
          <p className="font-body text-ink/60 mb-8">
            Corporate team-building, bachelorette parties, birthday celebrations, private workshops — we&apos;ve done it all. Our team will create a custom experience for your group.
          </p>
          <Link href="/contact"><Button size="lg">Get in Touch <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </section>
    </div>
  )
}
