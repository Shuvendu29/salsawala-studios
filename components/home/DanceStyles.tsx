import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { danceStyles } from '@/lib/data/danceStyles'

export function DanceStyles() {
  const featured = danceStyles.slice(0, 8)

  return (
    <section className="py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Dance Universe"
          title="What Would You Like"
          titleHighlight="to Dance?"
          subtitle="From fiery Latin rhythms to graceful classical forms — we have a dance style for every soul."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((style) => (
            <Link
              key={style.id}
              href={`/classes#${style.id}`}
              className="group relative rounded-2xl overflow-hidden border border-dark-border hover:border-primary/50 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-card cursor-pointer"
            >
              {/* Gradient background tint */}
              <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

              <div className="relative z-10 p-5 flex flex-col h-full min-h-[140px]">
                <div className="text-3xl mb-3">{style.icon}</div>
                <h3 className="font-display text-lg font-bold text-ink mb-1">{style.name}</h3>
                <p className="font-body text-xs text-ink/65 leading-relaxed line-clamp-2 flex-1">
                  {style.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-body text-ink/30 uppercase tracking-wide">{style.level}</span>
                  <ArrowRight className="h-4 w-4 text-primary-dark opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/classes"
            className="inline-flex items-center gap-2 text-primary-dark hover:text-primary-600 font-body font-medium transition-colors"
          >
            View all 15+ dance styles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
