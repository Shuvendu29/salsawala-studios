import type { Metadata } from 'next'
import Link from 'next/link'
import { Award, Heart, Users, Star, CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { instructors } from '@/lib/data/instructors'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Salsawala Studios — Kolkata\'s premier dance studio founded by Hitesh H. Teckchandani "The Salsawala". Our story, mission, and faculty.',
}

const values = [
  { icon: Heart, title: 'Passion First', desc: 'We believe dance is an expression of the soul. Every class is taught with joy, authenticity, and heart.' },
  { icon: Users, title: 'Community', desc: 'More than a studio — a family of movers who support and inspire each other at every step.' },
  { icon: Award, title: 'Excellence', desc: 'Our instructors bring real-world performance experience and decade-long teaching expertise to every session.' },
  { icon: Star, title: 'Inclusivity', desc: 'Dance has no barriers. All ages, backgrounds, and fitness levels are welcome at Salsawala Studios.' },
]

const milestones = [
  { year: '2014', event: 'Founded by Hitesh H. Teckchandani near Park Street, Kolkata' },
  { year: '2016', event: 'Expanded to 5+ dance styles with dedicated faculty' },
  { year: '2018', event: 'First Annual Dance Showcase at Rabindra Sadan — sold out!' },
  { year: '2020', event: 'Launched online classes to keep the community dancing through lockdown' },
  { year: '2022', event: 'Crossed 500+ students milestone and 15+ dance styles' },
  { year: '2024', event: 'New studio space with premium wooden floor and sound system upgrade' },
]

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(189,178,255,0.15),transparent)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="primary" className="mb-6">Our Story</Badge>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-ink mb-6 leading-tight">
            Where Every Beat Tells{' '}
            <span className="bg-crimson-gradient bg-clip-text text-transparent">a Story</span>
          </h1>
          <p className="font-body text-xl text-ink/60 leading-relaxed max-w-2xl mx-auto">
            Born from a deep love for Latin dance, Salsawala Studios has been Kolkata&apos;s heartbeat for dance and movement since 2014. We&apos;re not just a dance school — we&apos;re a movement.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="gold" className="mb-4">Our Mission</Badge>
              <h2 className="font-display text-4xl font-bold text-ink mb-6">
                Making Dance Accessible to{' '}
                <span className="bg-crimson-gradient bg-clip-text text-transparent">Everyone</span>
              </h2>
              <p className="font-body text-ink/60 leading-relaxed mb-6">
                Salsawala Studios was founded on the belief that dance is for everybody. Not just the naturally talented — but for anyone who wants to move, express, and connect. Our founder Hitesh H. Teckchandani, known as &quot;The Salsawala,&quot; built this studio from the ground up with one simple goal: to bring the joy of Latin dance to Kolkata.
              </p>
              <p className="font-body text-ink/60 leading-relaxed mb-8">
                From a small beginner class to a thriving community of 500+ dancers across 15+ styles, we&apos;ve grown into Kolkata&apos;s most loved dance destination — while staying true to our roots: great music, great teaching, and great company.
              </p>
              <div className="space-y-3">
                {['World-class wooden dance floor', 'Professional mirror and sound system', 'Air-conditioned and well-ventilated space', 'Flexible batch timings', 'Online & in-studio options'].map(f => (
                  <div key={f} className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-primary-dark shrink-0" />
                    <span className="font-body text-sm text-ink/70">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual — dark gradient boxes, keep text-white */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { gradient: 'from-red-900 to-orange-700', label: 'Studio Space', sub: 'Premium wooden floor' },
                { gradient: 'from-purple-900 to-pink-700', label: 'Salsa Nights', sub: 'Every month' },
                { gradient: 'from-blue-900 to-cyan-700', label: 'Workshops', sub: '100+ hosted' },
                { gradient: 'from-green-900 to-emerald-700', label: 'Community', sub: '500+ dancers' },
              ].map(item => (
                <div key={item.label} className={`rounded-2xl bg-gradient-to-br ${item.gradient} p-6 aspect-square flex flex-col justify-end relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10">
                    <div className="font-display text-white font-bold">{item.label}</div>
                    <div className="font-body text-white/60 text-sm">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">What We Stand For</Badge>
            <h2 className="font-display text-4xl font-bold text-ink">
              Our <span className="bg-crimson-gradient bg-clip-text text-transparent">Core Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-primary/30 transition-all">
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary-dark" />
                </div>
                <h3 className="font-display text-lg font-bold text-ink mb-2">{title}</h3>
                <p className="font-body text-sm text-ink/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty */}
      <section className="py-20 bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="gold" className="mb-4">The Team</Badge>
            <h2 className="font-display text-4xl font-bold text-ink">
              Meet Our <span className="bg-crimson-gradient bg-clip-text text-transparent">Faculty</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {instructors.map(instructor => (
              <div key={instructor.id} className="bg-dark-card border border-dark-border rounded-3xl overflow-hidden">
                {/* Photo area — dark gradient, keep text-white */}
                <div className={`h-48 bg-gradient-to-br ${instructor.photoGradient} flex items-center justify-center relative`}>
                  <div className="h-20 w-20 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                    <span className="font-display text-3xl font-bold text-white">{instructor.name.charAt(0)}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-xs text-white/90 font-body">{instructor.experience}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-ink">{instructor.name}</h3>
                  <p className="text-primary-dark text-sm font-body mb-3">{instructor.title}</p>
                  <p className="font-body text-sm text-ink/60 leading-relaxed mb-4">{instructor.bio}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {instructor.styles.map(s => (
                      <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Our Journey</Badge>
            <h2 className="font-display text-4xl font-bold text-ink">
              A Decade of <span className="bg-crimson-gradient bg-clip-text text-transparent">Dance</span>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-dark-border" />
            <div className="space-y-8">
              {milestones.map((m) => (
                <div key={m.year} className="relative flex gap-6 items-start">
                  <div className="relative z-10 h-16 w-16 rounded-full bg-primary/10 border-2 border-primary/30 flex flex-col items-center justify-center shrink-0">
                    <span className="font-display text-sm font-bold text-primary-dark leading-none">{m.year}</span>
                  </div>
                  <div className="flex-1 pt-4">
                    <p className="font-body text-ink/70 leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-dark-surface">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-ink mb-4">
            Be Part of Our Story
          </h2>
          <p className="font-body text-ink/60 mb-8">
            Join the Salsawala family. Your first class is free.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register"><Button size="lg">Book Free Trial <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="/contact"><Button variant="outline" size="lg">Contact Us</Button></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
