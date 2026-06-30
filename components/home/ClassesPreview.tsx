'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, Users, Calendar } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getClasses } from '@/lib/firebase/firestore'
import { DanceClass } from '@/lib/types'
import { weeklySchedule } from '@/lib/data/classes'

const styleColors: Record<string, string> = {
  Salsa: 'from-red-400 to-orange-400',
  Bachata: 'from-rose-400 to-pink-400',
  'Hip-Hop': 'from-blue-400 to-cyan-400',
  Contemporary: 'from-teal-400 to-emerald-400',
  Bollywood: 'from-yellow-400 to-orange-300',
  Kizomba: 'from-purple-400 to-violet-400',
  Pilates: 'from-green-400 to-lime-400',
  Zumba: 'from-indigo-400 to-purple-400',
}

const levelColors: Record<string, 'success' | 'warning' | 'primary' | 'outline' | 'danger'> = {
  Beginner: 'success',
  'All Levels': 'primary',
  Intermediate: 'warning',
  Advanced: 'danger',
}

export function ClassesPreview() {
  const [firestoreClasses, setFirestoreClasses] = useState<DanceClass[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClasses(true)
      .then(setFirestoreClasses)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const hasFirestore = firestoreClasses.length > 0

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

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-52 bg-dark-card border border-dark-border rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Firestore classes */}
        {!loading && hasFirestore && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {firestoreClasses.slice(0, 6).map(cls => {
              const gradient = styleColors[cls.style] || 'from-violet-400 to-purple-400'
              return (
                <div key={cls.id} className="bg-white border border-dark-border rounded-2xl overflow-hidden hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-card transition-all duration-300 group">
                  {cls.imageUrl ? (
                    <img src={cls.imageUrl} alt={cls.name} className="w-full h-32 object-cover" />
                  ) : (
                    <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-display text-lg font-bold text-ink group-hover:text-primary-dark transition-colors">{cls.name}</h3>
                        <p className="font-body text-sm text-ink/50 mt-0.5">{cls.style}</p>
                      </div>
                      <Badge variant={levelColors[cls.level] || 'outline'}>{cls.level}</Badge>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-sm text-ink/60 font-body">
                        <Calendar className="h-3.5 w-3.5 text-primary-dark" />{cls.days.join(', ')}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-ink/60 font-body">
                        <Clock className="h-3.5 w-3.5 text-primary-dark" />{cls.timeFrom}–{cls.timeTo}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-ink/60 font-body">
                        <Users className="h-3.5 w-3.5 text-primary-dark" />{cls.classesPerMonth} classes/month
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-dark-border">
                      <span className="font-display font-bold text-ink">
                        ₹{(cls.pricePerMonth ?? 0).toLocaleString()}<span className="text-xs text-ink/40 font-body font-normal">/month</span>
                      </span>
                      <Link href="/classes"><Button size="sm">Enroll</Button></Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Static fallback when no Firestore classes */}
        {!loading && !hasFirestore && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {weeklySchedule.map(cls => {
              const isFull = cls.spots === 0
              const isAlmostFull = cls.spots <= 3 && cls.spots > 0
              const gradient = styleColors[cls.style] || 'from-violet-400 to-purple-400'
              return (
                <div key={cls.id} className="bg-white border border-dark-border rounded-2xl overflow-hidden hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-card transition-all duration-300 group">
                  <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display text-lg font-bold text-ink group-hover:text-primary-dark transition-colors">{cls.style}</h3>
                        <p className="font-body text-sm text-ink/50 mt-0.5">{cls.instructor.split(' ')[0]}</p>
                      </div>
                      <Badge variant={levelColors[cls.level] || 'outline'}>{cls.level}</Badge>
                    </div>
                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-center gap-2 text-sm text-ink/60 font-body">
                        <Calendar className="h-3.5 w-3.5 text-primary-dark" />{cls.day}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-ink/60 font-body">
                        <Clock className="h-3.5 w-3.5 text-primary-dark" />{cls.time} · {cls.duration}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-body">
                        <Users className="h-3.5 w-3.5 text-primary-dark" />
                        <span className={isFull ? 'text-red-500' : isAlmostFull ? 'text-amber-500' : 'text-ink/60'}>
                          {isFull ? 'Class Full' : `${cls.spots} spots left`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-dark-border">
                      <span className="font-display font-bold text-ink">
                        ₹{cls.price.toLocaleString()}<span className="text-xs text-ink/40 font-body font-normal">/class</span>
                      </span>
                      <Link href="/classes"><Button size="sm" disabled={isFull}>{isFull ? 'Full' : 'Book Now'}</Button></Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/classes"><Button variant="secondary">View Full Schedule</Button></Link>
        </div>
      </div>
    </section>
  )
}
