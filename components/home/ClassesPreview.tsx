import Link from 'next/link'
import { Clock, Users, Wifi, Calendar } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { weeklySchedule } from '@/lib/data/classes'

const styleColors: Record<string, string> = {
  Salsa: 'from-red-600 to-orange-500',
  Bachata: 'from-rose-700 to-pink-500',
  'Hip-Hop': 'from-blue-700 to-cyan-500',
  Contemporary: 'from-teal-600 to-emerald-500',
  Bollywood: 'from-yellow-600 to-orange-400',
  Kizomba: 'from-purple-700 to-violet-500',
  Pilates: 'from-green-700 to-lime-500',
  'Salsa Social': 'from-red-600 to-rose-700',
  Zumba: 'from-indigo-600 to-purple-500',
}

const levelColors: Record<string, 'success' | 'warning' | 'primary' | 'outline'> = {
  Beginner: 'success',
  'All Levels': 'primary',
  Intermediate: 'warning',
  Advanced: 'danger' as any,
}

export function ClassesPreview() {
  const featured = weeklySchedule.slice(0, 6)

  return (
    <section className="py-24 bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <SectionHeader
            badge="Weekly Schedule"
            title="This Week's"
            titleHighlight="Classes"
            subtitle="Book your spot before they fill up — limited capacity ensures personal attention."
            centered={false}
            className="mb-0"
          />
          <Link href="/classes" className="hidden sm:block">
            <Button variant="secondary" size="sm">View Full Schedule</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map(cls => {
            const spotsLeft = cls.spots
            const isFull = spotsLeft === 0
            const isAlmostFull = spotsLeft <= 3 && spotsLeft > 0
            const gradient = styleColors[cls.style] || 'from-gray-700 to-gray-500'

            return (
              <div
                key={cls.id}
                className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                {/* Top color strip */}
                <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display text-lg font-bold text-white group-hover:text-primary transition-colors">
                        {cls.style}
                      </h3>
                      <p className="font-body text-sm text-white/50 mt-0.5">{cls.instructor.split(' ')[0]}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge variant={levelColors[cls.level] || 'outline'}>{cls.level}</Badge>
                      {cls.isOnline && (
                        <span className="flex items-center gap-1 text-xs text-cyan-400">
                          <Wifi className="h-3 w-3" /> Online
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-4">
                    <div className="flex items-center gap-2 text-sm text-white/60 font-body">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {cls.day}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/60 font-body">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {cls.time} · {cls.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-body">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span className={isFull ? 'text-red-400' : isAlmostFull ? 'text-amber-400' : 'text-white/60'}>
                        {isFull ? 'Class Full' : `${spotsLeft} spots left`}
                      </span>
                    </div>
                  </div>

                  {/* Spots bar */}
                  <div className="w-full bg-dark-surface rounded-full h-1 mb-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all bg-gradient-to-r ${gradient}`}
                      style={{ width: `${((cls.totalSpots - cls.spots) / cls.totalSpots) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-white">
                      ₹{cls.price.toLocaleString()}
                      <span className="text-xs text-white/40 font-body font-normal">/class</span>
                    </span>
                    <Link href={`/classes?book=${cls.id}`}>
                      <Button size="sm" disabled={isFull} variant={isFull ? 'secondary' : 'primary'}>
                        {isFull ? 'Join Waitlist' : 'Book Now'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/classes">
            <Button variant="secondary">View Full Schedule</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
