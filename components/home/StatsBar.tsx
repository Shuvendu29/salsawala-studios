const stats = [
  { value: '500+', label: 'Happy Students', icon: '🎓' },
  { value: '15+', label: 'Dance Styles', icon: '💃' },
  { value: '10+', label: 'Years of Excellence', icon: '⭐' },
  { value: '3', label: 'Expert Instructors', icon: '🎭' },
  { value: '100+', label: 'Workshops Hosted', icon: '🎉' },
]

export function StatsBar() {
  return (
    <section className="bg-white border-y border-dark-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-0 md:divide-x md:divide-dark-border">
          {stats.map(stat => (
            <div key={stat.label} className="flex flex-col items-center text-center py-2 px-4">
              <span className="text-2xl mb-1">{stat.icon}</span>
              <span className="font-display text-3xl font-bold text-ink">{stat.value}</span>
              <span className="font-body text-xs text-ink/40 mt-1 tracking-wide uppercase">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
