import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Users, Filter, ArrowRight, Wifi } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { danceStyles } from '@/lib/data/danceStyles'
import { weeklySchedule, days } from '@/lib/data/classes'

export const metadata: Metadata = {
  title: 'Dance Classes & Schedule',
  description: 'Browse all dance classes at Salsawala Studios. Salsa, Bachata, Kizomba, Hip-Hop, Contemporary, Bollywood & more. Book your spot online.',
}

const styleColorMap: Record<string, string> = {
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

const levelBadge: Record<string, 'success' | 'warning' | 'primary' | 'outline'> = {
  Beginner: 'success',
  'All Levels': 'primary',
  Intermediate: 'warning',
  Advanced: 'outline',
}

export default function ClassesPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(196,30,58,0.12),transparent)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="primary" className="mb-6">Weekly Schedule</Badge>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-white mb-6">
            Find Your{' '}
            <span className="bg-crimson-gradient bg-clip-text text-transparent">Perfect Class</span>
          </h1>
          <p className="font-body text-xl text-white/60 leading-relaxed">
            15+ dance styles, flexible timings, all levels welcome. Book your spot and start dancing today.
          </p>
        </div>
      </section>

      {/* Dance Styles Grid */}
      <section className="py-16 bg-dark-surface" id="styles">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-white mb-8">
            All Dance <span className="text-primary">Styles</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {danceStyles.map(style => (
              <a
                key={style.id}
                href={`#${style.id}`}
                className="group bg-dark-card border border-dark-border rounded-xl p-4 hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 text-center"
              >
                <div className="text-2xl mb-2">{style.icon}</div>
                <div className="font-display text-sm font-bold text-white group-hover:text-primary transition-colors">{style.name}</div>
                <div className="font-body text-xs text-white/40 mt-0.5">{style.level}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="py-16 bg-dark" id="schedule">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-bold text-white">
              Weekly <span className="text-primary">Schedule</span>
            </h2>
          </div>

          {days.map(day => {
            const dayClasses = weeklySchedule.filter(c => c.day === day)
            if (!dayClasses.length) return null
            return (
              <div key={day} className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="text-primary text-xs font-bold">{day.slice(0, 2)}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white">{day}</h3>
                  <div className="flex-1 h-px bg-dark-border" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dayClasses.map(cls => {
                    const isFull = cls.spots === 0
                    const gradient = styleColorMap[cls.style] || 'from-gray-700 to-gray-500'
                    return (
                      <div key={cls.id} id={cls.style.toLowerCase().replace(/\s+/g, '-')} className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all group">
                        <div className={`h-1 bg-gradient-to-r ${gradient}`} />
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-display text-lg font-bold text-white group-hover:text-primary transition-colors">{cls.style}</h4>
                              <p className="text-sm text-white/50 font-body">{cls.instructor}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                              <Badge variant={levelBadge[cls.level] || 'outline'}>{cls.level}</Badge>
                              {cls.isOnline && <span className="flex items-center gap-1 text-xs text-cyan-400"><Wifi className="h-3 w-3" />Online</span>}
                            </div>
                          </div>
                          <div className="flex gap-4 text-sm text-white/50 font-body mb-4">
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" />{cls.time}</span>
                            <span>{cls.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-body mb-4">
                            <Users className="h-3.5 w-3.5 text-primary" />
                            <span className={isFull ? 'text-red-400' : cls.spots <= 3 ? 'text-amber-400' : 'text-white/50'}>
                              {isFull ? 'Full' : `${cls.spots} spots left`}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-display font-bold text-white">₹{cls.price.toLocaleString()}<span className="text-xs text-white/40 font-body font-normal">/class</span></span>
                            <Link href={`/register?class=${cls.id}`}>
                              <Button size="sm" disabled={isFull}>{isFull ? 'Full' : 'Book Now'}</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Pricing note */}
      <section className="py-16 bg-dark-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">Flexible Pricing</h2>
          <p className="font-body text-white/60 mb-8">
            Pay per class or ask about monthly packages for the best value. Corporate and group rates available on request.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Drop-in Class', price: '₹700–₹900', sub: 'Per class · No commitment' },
              { label: 'Monthly Pack', price: '₹2,500', sub: '8 classes · Save 20%' },
              { label: 'Unlimited', price: '₹4,500', sub: 'All classes · Best value' },
            ].map(p => (
              <div key={p.label} className="bg-dark-card border border-dark-border rounded-2xl p-5">
                <div className="font-body text-sm text-white/50 mb-1">{p.label}</div>
                <div className="font-display text-2xl font-bold text-white mb-1">{p.price}</div>
                <div className="font-body text-xs text-white/40">{p.sub}</div>
              </div>
            ))}
          </div>
          <Link href="/register"><Button size="lg">Start with a Free Trial <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </section>
    </div>
  )
}
