'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, Users, ArrowRight, ShoppingCart, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/lib/hooks/useAuth'
import { useCart } from '@/lib/context/CartContext'
import { getClasses } from '@/lib/firebase/firestore'
import { DanceClass } from '@/lib/types'
import { weeklySchedule } from '@/lib/data/classes'
import toast from 'react-hot-toast'

const styleColorMap: Record<string, string> = {
  Salsa: 'from-red-600 to-orange-500',
  Bachata: 'from-rose-700 to-pink-500',
  'Hip-Hop': 'from-blue-700 to-cyan-500',
  Contemporary: 'from-teal-600 to-emerald-500',
  Bollywood: 'from-yellow-600 to-orange-400',
  Kizomba: 'from-purple-700 to-violet-500',
  Pilates: 'from-green-700 to-lime-500',
  Zumba: 'from-indigo-600 to-purple-500',
}

const levelBadge: Record<string, 'success' | 'warning' | 'primary' | 'outline'> = {
  Beginner: 'success',
  'All Levels': 'primary',
  Intermediate: 'warning',
  Advanced: 'outline',
}

export default function ClassesPage() {
  const { user, profile } = useAuth()
  const { addItem, items } = useCart()
  const [firestoreClasses, setFirestoreClasses] = useState<DanceClass[]>([])
  const [loadingClasses, setLoadingClasses] = useState(true)

  useEffect(() => {
    getClasses(true)
      .then(setFirestoreClasses)
      .catch(() => {})
      .finally(() => setLoadingClasses(false))
  }, [])

  const isActive = profile?.registrationStatus === 'active'

  function handleAddToCart(cls: DanceClass) {
    if (!user) {
      toast.error('Please log in first')
      return
    }
    if (!isActive) {
      toast.error('Complete registration to enroll in classes')
      return
    }
    addItem({
      type: 'class',
      id: cls.id,
      name: cls.name,
      pricePerUnit: cls.pricePerMonth,
      durationMonths: 1,
      maxDurationMonths: cls.maxDurationMonths,
      quantity: 1,
      classesPerMonth: cls.classesPerMonth,
    })
    toast.success(`${cls.name} added to cart!`)
  }

  function isInCart(id: string) {
    return items.some(i => i.id === id && i.type === 'class')
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(189,178,255,0.15),transparent)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="primary" className="mb-6">Dance Classes</Badge>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-ink mb-6">
            Find Your{' '}
            <span className="bg-crimson-gradient bg-clip-text text-transparent">Perfect Class</span>
          </h1>
          <p className="font-body text-xl text-ink/60 leading-relaxed">
            15+ dance styles, flexible timings, all levels welcome.
          </p>
          {!user && (
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/login"><Button size="lg">Log In to Enroll</Button></Link>
              <Link href="/register"><Button variant="outline" size="lg">Create Account</Button></Link>
            </div>
          )}
        </div>
      </section>

      {/* Firestore classes */}
      {!loadingClasses && firestoreClasses.length > 0 && (
        <section className="py-16 bg-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl font-bold text-ink">
                Available <span className="text-primary-dark">Classes</span>
              </h2>
              {isActive && (
                <Link href="/cart">
                  <Button size="sm" variant="outline">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    View Cart ({items.length})
                  </Button>
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {firestoreClasses.map(cls => {
                const gradient = styleColorMap[cls.style] || 'from-gray-700 to-gray-500'
                const inCart = isInCart(cls.id)
                return (
                  <Card key={cls.id} className="overflow-hidden group hover:border-primary/30 transition-all">
                    <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-display text-lg font-bold text-ink group-hover:text-primary-dark transition-colors">{cls.name}</h3>
                          <p className="font-body text-sm text-ink/50">{cls.style}</p>
                        </div>
                        <Badge variant={levelBadge[cls.level] || 'outline'}>{cls.level}</Badge>
                      </div>

                      <p className="font-body text-sm text-ink/60 mb-3 line-clamp-2">{cls.description}</p>

                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-sm text-ink/50 font-body">
                          <Clock className="h-3.5 w-3.5 text-primary-dark" />
                          {cls.days.join(', ')} · {cls.timeFrom}–{cls.timeTo}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-ink/50 font-body">
                          <Users className="h-3.5 w-3.5 text-primary-dark" />
                          {cls.classesPerMonth} classes/month
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-dark-border">
                        <div>
                          <span className="font-display font-bold text-ink">₹{cls.pricePerMonth.toLocaleString()}</span>
                          <span className="text-xs text-ink/40 font-body">/month</span>
                        </div>
                        {inCart ? (
                          <Link href="/cart">
                            <Button size="sm" variant="secondary">
                              <CheckCircle className="h-3.5 w-3.5 mr-1 text-emerald-500" /> In Cart
                            </Button>
                          </Link>
                        ) : (
                          <Button size="sm" onClick={() => handleAddToCart(cls)}>
                            <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Add to Cart
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Static weekly schedule (always shown as reference) */}
      <section className="py-16 bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-ink mb-8">
            Weekly <span className="text-primary-dark">Schedule</span>
          </h2>

          {loadingClasses && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-48 bg-dark-card border border-dark-border rounded-2xl animate-pulse" />
              ))}
            </div>
          )}

          {/* Group by day */}
          {(() => {
            const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
            return days.map(day => {
              const dayClasses = weeklySchedule.filter(c => c.day === day)
              if (!dayClasses.length) return null
              return (
                <div key={day} className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <span className="text-primary-dark text-xs font-bold">{day.slice(0, 2)}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-ink">{day}</h3>
                    <div className="flex-1 h-px bg-dark-border" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dayClasses.map(cls => {
                      const isFull = cls.spots === 0
                      const gradient = styleColorMap[cls.style] || 'from-gray-700 to-gray-500'
                      return (
                        <div key={cls.id} className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all group">
                          <div className={`h-1 bg-gradient-to-r ${gradient}`} />
                          <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-display text-lg font-bold text-ink group-hover:text-primary-dark transition-colors">{cls.style}</h4>
                                <p className="text-sm text-ink/50 font-body">{cls.instructor}</p>
                              </div>
                              <Badge variant={levelBadge[cls.level] || 'outline'}>{cls.level}</Badge>
                            </div>
                            <div className="flex gap-4 text-sm text-ink/50 font-body mb-3">
                              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary-dark" />{cls.time}</span>
                              <span>{cls.duration}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-display font-bold text-ink">
                                ₹{cls.price.toLocaleString()}<span className="text-xs text-ink/40 font-body font-normal">/class</span>
                              </span>
                              {isFull ? (
                                <span className="text-xs text-red-500 font-body font-medium">Class Full</span>
                              ) : isActive ? (
                                <Button size="sm" onClick={() => toast.success('Add this class from the Classes section above once admin creates it in the system.')}>
                                  Enroll
                                </Button>
                              ) : (
                                <Link href={user ? '/onboarding' : '/register'}>
                                  <Button size="sm">{user ? 'Complete Registration' : 'Register First'}</Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
          })()}
        </div>
      </section>
    </div>
  )
}
