'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
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
  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const unsub = subscribeHomeVideos(vids => setVideos(vids))
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
    <section className="relative min-h-screen bg-black flex flex-col lg:flex-row overflow-hidden pt-16 lg:pt-0">

      {/* ── LEFT: single video panel (60%) ── */}
      <div className="relative w-full lg:w-[60%] h-[56vw] lg:h-auto min-h-[300px] lg:min-h-screen flex-shrink-0">
        {hasVideos ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop={videos.length === 1}
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          /* Decorative gradient placeholder when no video yet */
          <div className="absolute inset-0 bg-hero-gradient">
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/25 rounded-full blur-[140px]" />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-gold/20 rounded-full blur-[120px]" />
          </div>
        )}
        {/* Fade right edge into the dark right panel */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/70 hidden lg:block" />

        {/* Video dot indicators */}
        {videos.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-white/40'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT: content panel (40%) — original content, dark bg ── */}
      <div className="relative z-10 w-full lg:w-[40%] flex flex-col justify-center
                      bg-black px-8 sm:px-12 lg:px-12 xl:px-16
                      py-16 lg:py-0 min-h-[50vw] lg:min-h-screen">

        {/* Badge — original */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 w-fit
                        bg-white/10 backdrop-blur-sm border-white/25">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="font-body text-sm font-semibold tracking-wide text-white/90">
            Kolkata&apos;s Premier Dance Studio
          </span>
        </div>

        {/* Headline — original words, original gradient on "Feel." */}
        <h1 className="font-display text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] mb-6">
          <span className="text-white">Move.</span>{' '}
          <span className="bg-crimson-gradient bg-clip-text text-transparent">Feel.</span>
          <br />
          <span className="text-white">Transform.</span>
        </h1>

        {/* Subtitle — original */}
        <p className="font-body text-lg leading-relaxed mb-8 max-w-sm text-white/75">
          Discover 15+ dance styles with world-class instructors in the heart of Kolkata.
          Whether you&apos;re a complete beginner or an advanced dancer — your journey starts here.
        </p>

        {/* Stars + count — original */}
        <div className="flex items-center gap-2 mb-10">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="h-5 w-5 text-gold-dark fill-gold-dark" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="font-body text-sm text-white/75 ml-1">
            <strong className="text-white">500+</strong> happy students
          </span>
        </div>

        {/* CTAs — original buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link href="/register">
            <Button size="lg" className="shadow-glow-red w-full sm:w-auto">
              Book a Free Trial
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/classes">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 hover:border-white/60"
            >
              <Play className="h-4 w-4 mr-1" />
              Explore Classes
            </Button>
          </Link>
        </div>

        {/* Stats — original values, now as a row at the bottom */}
        <div className="flex flex-wrap gap-3">
          {DEFAULT_STATS.map(stat => (
            <div
              key={stat.label}
              className="rounded-2xl px-4 py-3 text-center bg-white/10 backdrop-blur-md border border-white/20"
            >
              <div className="font-display text-xl font-bold text-white">{stat.value}</div>
              <div className="font-body text-xs uppercase tracking-wide text-white/60 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
