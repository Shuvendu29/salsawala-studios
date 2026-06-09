'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, Instagram, Facebook, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import toast from 'react-hot-toast'

const faqs = [
  { q: 'Do I need prior dance experience?', a: 'Absolutely not! Most of our classes are beginner-friendly. We\'ll have you moving confidently from your very first session.' },
  { q: 'What should I wear?', a: 'Comfortable clothing that allows movement. For footwear, avoid flat rubber-soled shoes — dance shoes or heels with smooth soles work best.' },
  { q: 'Can I join mid-batch?', a: 'Yes! Most of our classes are open-enrollment. Just book a class and join anytime.' },
  { q: 'Do you offer online classes?', a: 'Yes! We have select classes available online via Zoom. Check the schedule for classes marked \'Online\'.' },
  { q: 'Is there a trial class?', a: 'Your first class is FREE — no conditions. Come experience the Salsawala Studios energy before committing.' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success('Message sent! We\'ll get back to you within 24 hours.')
    setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    setLoading(false)
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(196,30,58,0.1),transparent)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <Badge variant="primary" className="mb-6">Get In Touch</Badge>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-white mb-6">
            Let&apos;s Start Your{' '}
            <span className="bg-crimson-gradient bg-clip-text text-transparent">Dance Journey</span>
          </h1>
          <p className="font-body text-xl text-white/60 leading-relaxed">
            Have questions about classes, pricing, or events? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact section */}
      <section className="py-16 bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-dark-card border border-dark-border rounded-3xl p-8">
              <h2 className="font-display text-2xl font-bold text-white mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 font-body mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 font-body mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+91 98xxx xxxxx"
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 font-body mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 font-body mb-1.5">Subject</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    <option value="">Select a topic…</option>
                    <option>Trial class enquiry</option>
                    <option>Class schedule & pricing</option>
                    <option>Private event / corporate booking</option>
                    <option>Workshop registration</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 font-body mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us what you'd like to know…"
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>
                <Button type="submit" loading={loading} className="w-full">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                <h3 className="font-display text-lg font-bold text-white mb-4">Contact Details</h3>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, title: 'Address', value: 'Near Park Street, Kolkata, WB — 700016' },
                    { icon: Phone, title: 'Phone', value: '+91 98301 58223', href: 'tel:+919830158223' },
                    { icon: Mail, title: 'Email', value: 'salsawalastudios@gmail.com', href: 'mailto:salsawalastudios@gmail.com' },
                    { icon: Clock, title: 'Hours', value: 'Mon–Fri 5:30–10 PM · Sat–Sun 9 AM–10 PM' },
                  ].map(({ icon: Icon, title, value, href }) => (
                    <div key={title} className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40 font-body">{title}</p>
                        {href ? (
                          <a href={href} className="text-sm text-white/70 hover:text-primary transition-colors font-body">{value}</a>
                        ) : (
                          <p className="text-sm text-white/70 font-body">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                <h3 className="font-display text-lg font-bold text-white mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {[
                    { icon: Instagram, href: 'https://www.instagram.com/salsawalastudios/', label: 'Instagram' },
                    { icon: Facebook, href: 'https://www.facebook.com/salsawalastudios/', label: 'Facebook' },
                    { icon: Youtube, href: 'https://www.youtube.com/@salsawalastudios', label: 'YouTube' },
                  ].map(({ icon: Icon, href, label }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-surface border border-dark-border text-white/60 hover:text-primary hover:border-primary/40 transition-all text-sm font-body">
                      <Icon className="h-4 w-4" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="bg-dark-card border border-dark-border rounded-2xl h-48 flex flex-col items-center justify-center">
                <MapPin className="h-8 w-8 text-primary mb-2 opacity-60" />
                <p className="text-white/60 font-body text-sm">Salsawala Studios, Kolkata</p>
                <a href="https://maps.google.com/?q=Salsawala+Studios+Kolkata" target="_blank" rel="noopener noreferrer"
                  className="mt-2 text-xs text-primary hover:text-primary-light transition-colors font-body">
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-dark-card border border-dark-border rounded-2xl p-5">
                <h3 className="font-display text-base font-semibold text-white mb-2">{q}</h3>
                <p className="font-body text-sm text-white/60 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
