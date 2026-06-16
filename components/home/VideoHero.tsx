'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { subscribeHomeVideos } from '@/lib/firebase/firestore'
import { SiteVideo } from '@/lib/types'

const DEFAULT_STATS = [
  { value: '500+', label: 'Students' },
  { value: '15+', label: 'Dance Styles' },
  { value: '3+', label: 'Expert Faculty' },
  { value: '10+', label: 'Years of Dance' },
]

export function VideoHero() {
  const [videos, setVideos] = useState<SiteVideo[]>([])
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const unsub = subscribeHomeVideos(vids => {
      setVideos(vids)
      setLoaded(true)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    if (!videos.length) return
    const vid = videos[current]
    const duration = (vid.durationSec || 8) * 1000
    timerRef.current = setTimeout(() => {
      setCurrent(c => (c + 1) % videos.length)
    }, duration)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, videos])

  useEffect(() => {
    if (videoRef.current && videos[current]) {
      videoRef.current.src = videos[current].url
      videoRef.current.load()
      videoRef.current.play().catch(() => {})
    }
  }, [current, videos])

  function goTo(idx: number) {
    if (timerRef.current) clearTimeout(timerRef.current)
    setCurrent(idx)
  }

  const hasVideos = videos.length > 0

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark">
      {/* Video background */}
      {hasVideos && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop={videos.length === 1}
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      {/* Gradient overlay — lighter when no video */}
      <div className={`absolute inset-0 z-10 ${hasVideos
        ? 'bg-gradient-to-r from-black/70 via-black/40 to-black/20'
        : 'bg-hero-gradient'
      }`} />

      {/* Decorative orbs (fallback when no video) */}
      {!hasVideos && (
        <>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[120px] pointer-events-none z-10" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gold/20 rounded-full blur-[100px] pointer-events-none z-10" />
        </>
      )}

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="font-body text-sm text-white/90 font-medium">Kolkata&apos;s Premier Dance Studio</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="text-white">Move.</span>{' '}
            <span className="bg-crimson-gradient bg-clip-text text-transparent">Feel.</span>
            <br />
            <span className="text-white">Transform.</span>
          </h1>

          <p className="font-body text-lg text-white/70 leading-relaxed mb-8 max-w-xl">
            Discover 15+ dance styles with world-class instructors in the heart of Kolkata.
            Whether you&apos;re a complete beginner or an advanced dancer — your journey starts here.
          </p>

          <div className="flex items-center gap-2 mb-10">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="h-5 w-5 text-gold-dark fill-gold-dark" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="font-body text-sm text-white/70 ml-1"><strong className="text-white">500+</strong> happy students</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register">
              <Button size="lg" className="shadow-glow-red w-full sm:w-auto">
                Book a Free Trial
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/classes">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 hover:border-white/60">
                <Play className="h-4 w-4 mr-1" />
                Explore Classes
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats — floating cards */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4">
          {DEFAULT_STATS.map(stat => (
            <div key={stat.label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 text-center min-w-[110px]">
              <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
              <div className="font-body text-xs text-white/60 uppercase tracking-wide mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Video navigation dots */}
      {videos.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          <button onClick={() => goTo((current - 1 + videos.length) % videos.length)}
            className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-all">
            <ChevronLeft className="h-4 w-4" />
          </button>
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-white/40'}`}
            />
          ))}
          <button onClick={() => goTo((current + 1) % videos.length)}
            className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-all">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Current video title */}
      {hasVideos && videos[current]?.title && (
        <div className="absolute top-24 right-8 z-20 bg-black/30 backdrop-blur-sm rounded-full px-4 py-1.5 hidden md:block">
          <span className="font-body text-xs text-white/70">{videos[current].title}</span>
        </div>
      )}
    </section>
  )
}
