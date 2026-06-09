import Link from 'next/link'
import { Instagram, Facebook, Award } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import { instructors } from '@/lib/data/instructors'

export function FacultySection() {
  return (
    <section className="py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Our Faculty"
          title="Learn From"
          titleHighlight="The Best"
          subtitle="Our instructors bring decades of combined experience, passion, and a deep love for dance to every class."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {instructors.map(instructor => (
            <div
              key={instructor.id}
              className="group bg-dark-card border border-dark-border rounded-3xl overflow-hidden hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Avatar */}
              <div className={`relative h-56 bg-gradient-to-br ${instructor.photoGradient} flex items-end justify-start p-6 overflow-hidden`}>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                      <span className="font-display text-xl font-bold text-white">
                        {instructor.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                      <Award className="h-3 w-3 text-gold" />
                      <span className="text-xs text-white/90 font-body">{instructor.experience}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-white mb-0.5">{instructor.name}</h3>
                <p className="font-body text-sm text-primary mb-3">{instructor.title}</p>
                <p className="font-body text-sm text-white/50 leading-relaxed mb-4 line-clamp-3">
                  {instructor.bio}
                </p>

                {/* Styles */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {instructor.styles.map(style => (
                    <Badge key={style} variant="outline" className="text-[10px] px-2 py-0.5">
                      {style}
                    </Badge>
                  ))}
                </div>

                {/* Social */}
                <div className="flex items-center gap-2 pt-3 border-t border-dark-border">
                  {instructor.social?.instagram && (
                    <a
                      href={instructor.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-white/50 hover:text-primary hover:border-primary/40 transition-all"
                    >
                      <Instagram className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {instructor.social?.facebook && (
                    <a
                      href={instructor.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-white/50 hover:text-primary hover:border-primary/40 transition-all"
                    >
                      <Facebook className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <Link
                    href="/classes"
                    className="ml-auto text-xs font-body text-primary hover:text-primary-light transition-colors"
                  >
                    View Classes →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
