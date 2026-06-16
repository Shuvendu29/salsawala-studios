'use client'

import { useEffect, useState } from 'react'
import { Calendar, MapPin, Users, Clock, ArrowRight, X, Phone, User, Mail, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/lib/hooks/useAuth'
import { getEvents, createEventRegistration } from '@/lib/firebase/firestore'
import { sendPhoneOTP, verifyPhoneOTP } from '@/lib/firebase/auth'
import { StudioEvent } from '@/lib/types'
import { upcomingEvents } from '@/lib/data/events'
import toast from 'react-hot-toast'
import type { ConfirmationResult } from 'firebase/auth'

const typeColors: Record<string, 'primary' | 'gold' | 'success' | 'warning'> = {
  workshop: 'primary',
  social: 'gold',
  performance: 'success',
  competition: 'warning',
}

// Adapts static event data to the same shape for display
interface DisplayEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  price: number
  capacity: number
  enrolled: number
  type: string
  gradient: string
  tag: string
}

export default function EventsPage() {
  const { user, profile } = useAuth()
  const [events, setEvents] = useState<DisplayEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<DisplayEvent | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    getEvents(true)
      .then(fireEvents => {
        if (fireEvents.length > 0) {
          setEvents(fireEvents.map(e => ({
            id: e.id, title: e.title, description: e.description,
            date: e.date, time: e.time, venue: e.venue, price: e.price,
            capacity: e.capacity, enrolled: e.enrolled, type: e.type,
            gradient: e.gradient, tag: e.tag,
          })))
        } else {
          setEvents(upcomingEvents)
        }
      })
      .catch(() => setEvents(upcomingEvents))
      .finally(() => setLoading(false))
  }, [])

  function openRegistration(ev: DisplayEvent) {
    setSelected(ev)
    setShowModal(true)
  }

  return (
    <div className="pt-20">
      <div id="recaptcha-container" />

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
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-80 bg-dark-card border border-dark-border rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {events.map(event => {
                const date = new Date(event.date)
                const spotsLeft = event.capacity - event.enrolled
                const pctFull = Math.min((event.enrolled / event.capacity) * 100, 100)
                return (
                  <div key={event.id} className="group bg-dark-card border border-dark-border rounded-3xl overflow-hidden hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                    <div className={`relative h-48 bg-gradient-to-br ${event.gradient} flex items-end p-6`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="relative z-10 flex items-end justify-between w-full">
                        <Badge variant={typeColors[event.type] || 'primary'}>{event.tag}</Badge>
                        <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-3 text-center">
                          <div className="font-display text-3xl font-bold text-white leading-none">{date.getDate()}</div>
                          <div className="font-body text-xs text-white/70 uppercase">
                            {date.toLocaleString('default', { month: 'short' })} {date.getFullYear()}
                          </div>
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

                      <div className="w-full bg-dark-surface rounded-full h-1.5 mb-5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all" style={{ width: `${pctFull}%` }} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-display text-2xl font-bold text-ink">
                            {event.price === 0 ? 'FREE' : `₹${event.price.toLocaleString()}`}
                          </span>
                          {event.price > 0 && <span className="text-sm text-ink/50 font-body ml-1">/person</span>}
                        </div>
                        <Button size="md" onClick={() => openRegistration(event)} disabled={spotsLeft === 0}>
                          {spotsLeft === 0 ? 'Sold Out' : 'Register Now'} {spotsLeft > 0 && <ArrowRight className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Host CTA */}
      <section className="py-16 bg-dark">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-ink mb-4">Want to Host a Private Event?</h2>
          <p className="font-body text-ink/60 mb-8">
            Corporate team-building, bachelorette parties, birthday celebrations — we create custom experiences.
          </p>
          <a href="/contact"><Button size="lg">Get in Touch <ArrowRight className="h-4 w-4" /></Button></a>
        </div>
      </section>

      {/* Registration Modal */}
      {showModal && selected && (
        <EventRegistrationModal
          event={selected}
          user={user}
          profile={profile}
          onClose={() => { setShowModal(false); setSelected(null) }}
        />
      )}
    </div>
  )
}

// ─── Registration Modal ───────────────────────────────────────────────────────
interface ModalProps {
  event: DisplayEvent
  user: any
  profile: any
  onClose: () => void
}

function EventRegistrationModal({ event, user, profile, onClose }: ModalProps) {
  const isRegistered = !!user && profile?.registrationStatus === 'active'

  const [guestForm, setGuestForm] = useState({
    name: user ? profile?.displayName || '' : '',
    email: user ? user.email || '' : '',
    phone: user ? profile?.phone || '' : '',
    gender: user ? profile?.gender || '' : '',
    source: '',
  })
  const [payMethod, setPayMethod] = useState<'online' | 'cash'>('online')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null)
  const [phoneVerified, setPhoneVerified] = useState(isRegistered)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSendOTP() {
    const phone = guestForm.phone.trim()
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      toast.error('Enter a valid 10-digit mobile number')
      return
    }
    setSendingOtp(true)
    try {
      const full = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`
      const result = await sendPhoneOTP(full)
      setConfirmation(result)
      setOtpSent(true)
      toast.success('OTP sent!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP')
    } finally {
      setSendingOtp(false)
    }
  }

  async function handleVerifyOTP() {
    if (!confirmation || otp.length !== 6) return
    setVerifyingOtp(true)
    try {
      await verifyPhoneOTP(confirmation, otp)
      setPhoneVerified(true)
      toast.success('Phone verified!')
    } catch {
      toast.error('Invalid OTP')
    } finally {
      setVerifyingOtp(false)
    }
  }

  async function handleSubmit() {
    if (!guestForm.name || !guestForm.phone || !guestForm.gender || !guestForm.source) {
      toast.error('Please fill all required fields')
      return
    }
    if (!phoneVerified) {
      toast.error('Please verify your phone number first')
      return
    }
    setSubmitting(true)
    try {
      await createEventRegistration({
        userId: user?.uid,
        guestPhone: !user ? guestForm.phone : undefined,
        eventId: event.id,
        eventTitle: event.title,
        name: guestForm.name,
        email: guestForm.email || undefined,
        gender: guestForm.gender,
        source: guestForm.source,
        paymentStatus: payMethod === 'online' ? 'confirmed' : 'pending',
        paymentMethod: payMethod,
        amount: event.price,
      })
      setDone(true)
      toast.success('Registration successful!')
    } catch (err: any) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-dark-card border border-dark-border rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-display text-xl font-bold text-ink">Register for Event</h2>
            <p className="font-body text-sm text-ink/60 mt-0.5">{event.title}</p>
          </div>
          <button onClick={onClose} className="text-ink/40 hover:text-ink p-1 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {done ? (
          <div className="text-center py-8">
            <div className="h-16 w-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-ink mb-2">You&apos;re Registered!</h3>
            <p className="font-body text-sm text-ink/60 mb-6">
              {payMethod === 'cash' ? 'Pay at the venue on the day of the event.' : 'See you there!'}
            </p>
            <Button onClick={onClose} className="w-full">Done</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Event summary */}
            <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
              <div className="flex justify-between text-sm font-body">
                <span className="text-ink/60">Date</span>
                <span className="text-ink">{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between text-sm font-body mt-1.5">
                <span className="text-ink/60">Price</span>
                <span className="font-display font-bold text-ink">{event.price === 0 ? 'FREE' : `₹${event.price.toLocaleString()}`}</span>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block font-body text-xs text-ink/60 mb-1.5">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input value={guestForm.name} onChange={e => setGuestForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name"
                  className="w-full bg-dark-surface border border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-body text-xs text-ink/60 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input type="email" value={guestForm.email} onChange={e => setGuestForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com (optional)"
                  className="w-full bg-dark-surface border border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60" />
              </div>
            </div>

            {/* Phone + OTP */}
            <div>
              <label className="block font-body text-xs text-ink/60 mb-1.5">Mobile Number *</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                  <input type="tel" value={guestForm.phone} onChange={e => setGuestForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98xxx xxxxx" disabled={phoneVerified}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60 disabled:opacity-60" />
                </div>
                {!phoneVerified && (
                  <Button size="sm" onClick={handleSendOTP} loading={sendingOtp}>
                    {otpSent ? 'Resend' : 'Send OTP'}
                  </Button>
                )}
                {phoneVerified && (
                  <div className="flex items-center gap-1 text-emerald-600 text-sm font-body whitespace-nowrap">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Verified
                  </div>
                )}
              </div>
              {otpSent && !phoneVerified && (
                <div className="flex gap-2 mt-2">
                  <input type="text" inputMode="numeric" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="6-digit OTP"
                    className="flex-1 bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink placeholder-ink/30 font-body text-sm text-center tracking-widest focus:outline-none focus:border-primary/60" />
                  <Button size="sm" onClick={handleVerifyOTP} loading={verifyingOtp} disabled={otp.length !== 6}>Verify</Button>
                </div>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block font-body text-xs text-ink/60 mb-1.5">Gender *</label>
              <select value={guestForm.gender} onChange={e => setGuestForm(f => ({ ...f, gender: e.target.value }))}
                className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink font-body text-sm focus:outline-none focus:border-primary/60">
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not">Prefer not to say</option>
              </select>
            </div>

            {/* Source */}
            <div>
              <label className="block font-body text-xs text-ink/60 mb-1.5">How did you hear about us? *</label>
              <select value={guestForm.source} onChange={e => setGuestForm(f => ({ ...f, source: e.target.value }))}
                className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink font-body text-sm focus:outline-none focus:border-primary/60">
                <option value="">Select</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="friend">Friend / Word of mouth</option>
                <option value="google">Google</option>
                <option value="youtube">YouTube</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Payment method */}
            {event.price > 0 && (
              <div>
                <label className="block font-body text-xs text-ink/60 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['online', 'cash'] as const).map(m => (
                    <button key={m} onClick={() => setPayMethod(m)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                        payMethod === m ? 'border-primary bg-primary/10' : 'border-dark-border'
                      }`}>
                      <div className={`h-3 w-3 rounded-full border-2 flex-shrink-0 ${payMethod === m ? 'border-primary bg-primary' : 'border-ink/30'}`} />
                      <div>
                        <p className="font-body text-xs font-medium text-ink capitalize">{m === 'online' ? 'Online' : 'Pay at Venue'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={handleSubmit} loading={submitting} className="w-full mt-2">
              {event.price === 0 ? 'Confirm Registration' : payMethod === 'online' ? `Pay ₹${event.price.toLocaleString()}` : 'Register & Pay at Venue'}
            </Button>

            {!user && (
              <p className="text-center font-body text-xs text-ink/40">
                Already a student?{' '}
                <a href="/login" className="text-primary-dark hover:text-primary">Log in</a> to use your saved details.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
