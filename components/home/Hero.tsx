'use client'

import Link from 'next/link'
import { ChevronDown, Play, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark">
      {/* Background layers */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(196,30,58,0.18),transparent)]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gold/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
        <div className="lg:w-3/5 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary font-medium tracking-wide">Kolkata&apos;s Premier Dance Studio</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] mb-6">
            Move.{' '}
            <span className="bg-crimson-gradient bg-clip-text text-transparent">Feel.</span>
            <br />
            Transform.
          </h1>

          <p className="font-body text-lg sm:text-xl text-white/60 max-w-xl mb-8 leading-relaxed">
            Discover 15+ dance styles with world-class instructors in the heart of Kolkata.
            Whether you&apos;re a complete beginner or an advanced dancer — your journey starts here.
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-8 justify-center lg:justify-start">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-gold fill-gold" />
              ))}
            </div>
            <span className="text-white/70 text-sm font-body">
              <strong className="text-white">500+</strong> happy students
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto shadow-glow-red">
                Book a Free Trial
              </Button>
            </Link>
            <Link href="/classes">
              <Button variant="outline" size="lg" className="w-full sm:w-auto group">
                <Play className="h-4 w-4 mr-1 group-hover:text-white transition-colors" />
                Explore Classes
              </Button>
            </Link>
          </div>
        </div>

        {/* Right: floating stats cards */}
        <div className="lg:w-2/5 flex justify-center lg:justify-end">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80">
            {/* Central circle */}
            <div className="absolute inset-8 rounded-full bg-crimson-gradient opacity-20 blur-2xl" />
            <div className="absolute inset-12 rounded-full border-2 border-primary/30 flex items-center justify-center">
              <div className="text-center">
                <div className="font-display text-5xl font-bold text-white">15<span className="text-primary">+</span></div>
                <div className="font-body text-xs text-white/50 tracking-widest uppercase mt-1">Dance Styles</div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -top-4 left-0 animate-float" style={{ animationDelay: '0s' }}>
              <div className="bg-dark-card border border-dark-border rounded-2xl px-4 py-3 shadow-card">
                <div className="font-display text-xl font-bold text-white">500<span className="text-primary">+</span></div>
                <div className="font-body text-xs text-white/50">Students</div>
              </div>
            </div>

            <div className="absolute -bottom-4 right-0 animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="bg-dark-card border border-dark-border rounded-2xl px-4 py-3 shadow-card">
                <div className="font-display text-xl font-bold text-gold">10<span className="text-white">+</span></div>
                <div className="font-body text-xs text-white/50">Years of Dance</div>
              </div>
            </div>

            <div className="absolute top-1/2 -right-8 -translate-y-1/2 animate-float" style={{ animationDelay: '0.8s' }}>
              <div className="bg-dark-card border border-dark-border rounded-2xl px-4 py-3 shadow-card">
                <div className="font-display text-xl font-bold text-white">3<span className="text-primary">+</span></div>
                <div className="font-body text-xs text-white/50">Expert Faculty</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span className="font-body text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </div>
    </section>
  )
}
