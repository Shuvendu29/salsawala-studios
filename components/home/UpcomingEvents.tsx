import Link from 'next/link'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { upcomingEvents } from '@/lib/data/events'

const typeColors: Record<string, 'primary' | 'gold' | 'success' | 'warning'> = {
  workshop: 'primary',
  social: 'gold',
  performance: 'success',
  competition: 'warning',
}

export function UpcomingEvents() {
  const featured = upcomingEvents.slice(0, 3)

  return (
    <section className="py-24 bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <SectionHeader
            badge="Upcoming"
            title="Events &"
            titleHighlight="Workshops"
            subtitle="Expand your skills and connect with the dance community."
            centered={false}
            className="mb-0"
          />
          <Link href="/events" className="hidden sm:block shrink-0">
            <Button variant="secondary" size="sm">All Events</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map(event => {
            const date = new Date(event.date)
            const spotsLeft = event.capacity - event.enrolled
            return (
              <div
                key={event.id}
                className="group bg-white border border-dark-border rounded-2xl overflow-hidden hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-card transition-all duration-300"
              >
                {/* Header gradient — keep dark for visual impact */}
                <div className={`h-32 bg-gradient-to-br ${event.gradient} relative flex items-end p-5`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10">
                    <Badge variant={typeColors[event.type] || 'primary'}>{event.tag}</Badge>
                  </div>
                  {/* Date badge */}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5 text-center">
                    <div className="font-display text-2xl font-bold text-white leading-none">
                      {date.getDate()}
                    </div>
                    <div className="font-body text-xs text-white/70 uppercase tracking-wide">
                      {date.toLocaleString('default', { month: 'short' })}
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-ink mb-1 group-hover:text-primary-dark transition-colors">
                    {event.title}
                  </h3>
                  <p className="font-body text-sm text-ink/50 leading-relaxed mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-ink/50 font-body">
                      <Calendar className="h-3.5 w-3.5 text-primary-dark" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-ink/50 font-body">
                      <MapPin className="h-3.5 w-3.5 text-primary-dark" />
                      {event.venue}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-body">
                      <Users className="h-3.5 w-3.5 text-primary-dark" />
                      <span className={spotsLeft < 10 ? 'text-amber-500' : 'text-ink/50'}>
                        {spotsLeft} spots remaining
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-display font-bold text-ink text-lg">
                        {event.price === 0 ? 'FREE' : `₹${event.price.toLocaleString()}`}
                      </span>
                      {event.price > 0 && <span className="text-xs text-ink/40 font-body">/person</span>}
                    </div>
                    <Link href={`/events/${event.id}`}>
                      <Button size="sm">Register</Button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/events"><Button variant="secondary">View All Events</Button></Link>
        </div>
      </div>
    </section>
  )
}
