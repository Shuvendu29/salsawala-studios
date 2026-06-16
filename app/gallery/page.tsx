import type { Metadata } from 'next'
import { Badge } from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos and videos from Salsawala Studios — our classes, workshops, performances, and social dance events in Kolkata.',
}

const galleryItems = [
  { gradient: 'from-red-900 via-red-700 to-orange-600', label: 'Salsa Night', category: 'Social', span: 'col-span-2 row-span-2' },
  { gradient: 'from-purple-900 via-purple-700 to-pink-600', label: 'Bachata Workshop', category: 'Workshop', span: '' },
  { gradient: 'from-blue-900 via-blue-700 to-cyan-600', label: 'Hip-Hop Showcase', category: 'Performance', span: '' },
  { gradient: 'from-teal-900 via-teal-700 to-emerald-600', label: 'Contemporary Class', category: 'Class', span: '' },
  { gradient: 'from-amber-900 via-amber-700 to-yellow-600', label: 'Bollywood Batch', category: 'Class', span: '' },
  { gradient: 'from-indigo-900 via-indigo-700 to-violet-600', label: 'Annual Showcase', category: 'Performance', span: 'col-span-2' },
  { gradient: 'from-rose-900 via-rose-700 to-red-600', label: 'Kizomba Session', category: 'Class', span: '' },
  { gradient: 'from-green-900 via-green-700 to-lime-600', label: 'Pilates Morning', category: 'Fitness', span: '' },
  { gradient: 'from-orange-900 via-orange-700 to-yellow-600', label: 'Mambo Workshop', category: 'Workshop', span: '' },
  { gradient: 'from-cyan-900 via-cyan-700 to-teal-600', label: 'Online Class', category: 'Online', span: '' },
  { gradient: 'from-pink-900 via-pink-700 to-rose-600', label: 'Latin Social', category: 'Social', span: 'col-span-2' },
  { gradient: 'from-violet-900 via-violet-700 to-purple-600', label: 'Kathak Class', category: 'Class', span: '' },
]

const categories = ['All', 'Class', 'Workshop', 'Performance', 'Social', 'Fitness']

export default function GalleryPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(189,178,255,0.15),transparent)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="primary" className="mb-6">Gallery</Badge>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-ink mb-6">
            Life at{' '}
            <span className="bg-crimson-gradient bg-clip-text text-transparent">Salsawala</span>
          </h1>
          <p className="font-body text-xl text-ink/60 leading-relaxed">
            A glimpse into the energy, community, and passion that defines every moment at Salsawala Studios.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="py-6 bg-dark-surface border-b border-dark-border sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button key={cat} className="shrink-0 px-4 py-1.5 rounded-full text-sm font-body border border-dark-border text-ink/60 hover:text-ink hover:border-primary/40 transition-all first:bg-primary first:text-ink first:border-primary">
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery grid — items are on dark gradients, keep text-white inside */}
      <section className="py-10 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px]">
            {galleryItems.map((item, i) => (
              <div
                key={i}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer ${item.span}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
                    <span className="text-white text-2xl">🔍</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-body text-sm font-medium text-white">{item.label}</p>
                  <Badge variant="outline" className="mt-1 text-[10px] border-white/20 text-white/70">{item.category}</Badge>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-ink/40 text-sm font-body mt-8">
            More photos coming soon — follow us on Instagram <span className="text-primary-dark">@salsawalastudios</span>
          </p>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="py-16 bg-dark-surface">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-ink mb-4">Follow Us on Instagram</h2>
          <p className="font-body text-ink/60 mb-6">
            See the latest from our studio — classes, events, reels, and more @salsawalastudios
          </p>
          <a
            href="https://www.instagram.com/salsawalastudios/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <span>@salsawalastudios</span>
          </a>
        </div>
      </section>
    </div>
  )
}
