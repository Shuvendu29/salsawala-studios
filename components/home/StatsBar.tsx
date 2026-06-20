import { GraduationCap, Music2, Star, Users, CalendarCheck } from 'lucide-react'

const stats = [
  { value: '500+', label: 'Happy Students',      Icon: GraduationCap },
  { value: '15+',  label: 'Dance Styles',         Icon: Music2        },
  { value: '10+',  label: 'Years of Excellence',  Icon: Star          },
  { value: '3',    label: 'Expert Instructors',   Icon: Users         },
  { value: '100+', label: 'Workshops Hosted',     Icon: CalendarCheck },
]

export function StatsBar() {
  return (
    <section className="bg-white border-y border-dark-border py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-0 md:divide-x md:divide-dark-border">
          {stats.map(({ value, label, Icon }) => (
            <div key={label} className="flex flex-col items-center text-center py-2 px-6 group">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-5 w-5 text-primary-dark" />
              </div>
              <span className="font-display text-3xl font-bold text-ink">{value}</span>
              <span className="font-body text-xs text-ink/55 mt-1 tracking-wide uppercase">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
