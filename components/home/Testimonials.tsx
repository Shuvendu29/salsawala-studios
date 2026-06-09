import { Star, Quote } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { testimonials } from '@/lib/data/testimonials'

export function Testimonials() {
  return (
    <section className="py-24 bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Student Stories"
          title="What Our"
          titleHighlight="Community Says"
          subtitle="Real stories from real dancers who found their rhythm at Salsawala Studios."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div
              key={t.id}
              className="bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-gold/30 hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden"
            >
              <Quote className="absolute top-4 right-4 h-10 w-10 text-primary/10 group-hover:text-primary/20 transition-colors" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gold fill-gold" />
                ))}
              </div>

              {/* Text */}
              <p className="font-body text-sm text-white/70 leading-relaxed mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.avatarGradient} flex items-center justify-center shrink-0`}>
                  <span className="font-display text-white text-sm font-bold">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-white">{t.name}</p>
                  <p className="font-body text-xs text-white/40">
                    {t.style} · {t.duration}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
