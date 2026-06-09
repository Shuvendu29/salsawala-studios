import Link from 'next/link'
import { ArrowRight, Camera } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'

const galleryItems = [
  { gradient: 'from-red-900 via-red-700 to-orange-600', label: 'Salsa Night', span: 'md:col-span-2 md:row-span-2' },
  { gradient: 'from-purple-900 via-purple-700 to-pink-600', label: 'Bachata Workshop', span: '' },
  { gradient: 'from-blue-900 via-blue-700 to-cyan-600', label: 'Hip-Hop Showcase', span: '' },
  { gradient: 'from-teal-900 via-teal-700 to-emerald-600', label: 'Contemporary Class', span: '' },
  { gradient: 'from-amber-900 via-amber-700 to-yellow-600', label: 'Bollywood Batch', span: '' },
  { gradient: 'from-indigo-900 via-indigo-700 to-violet-600', label: 'Kizomba Session', span: 'md:col-span-2' },
]

export function GalleryPreview() {
  return (
    <section className="py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Gallery"
          title="Life at"
          titleHighlight="Salsawala Studios"
          subtitle="A peek into our vibrant community, energetic classes, and memorable moments."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:grid-rows-2 md:h-[480px]">
          {galleryItems.map((item, i) => (
            <div
              key={i}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${item.span}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

              {/* Pattern overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 11px)`,
                }}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="h-8 w-8 text-white mb-2" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <p className="font-body text-xs text-white/80 font-medium">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/gallery" className="inline-flex items-center gap-2 text-primary hover:text-primary-light font-body font-medium transition-colors">
            View Full Gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
