'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { getClasses, getEvents, getDayOffs } from '@/lib/firebase/firestore'
import { DanceClass, StudioEvent, DayOff, WeekDay } from '@/lib/types'

const WEEKDAY_JS: Record<WeekDay, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function toYMD(date: Date): string {
  return date.toISOString().split('T')[0]
}

export default function CalendarPage() {
  const [classes, setClasses] = useState<DanceClass[]>([])
  const [events, setEvents] = useState<StudioEvent[]>([])
  const [dayOffs, setDayOffs] = useState<DayOff[]>([])
  const [loading, setLoading] = useState(true)

  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const [selectedDay, setSelectedDay] = useState<string | null>(toYMD(today))

  useEffect(() => {
    Promise.all([
      getClasses(true),
      getEvents(true),
      getDayOffs(),
    ]).then(([c, e, d]) => {
      setClasses(c)
      setEvents(e)
      setDayOffs(d)
    }).finally(() => setLoading(false))
  }, [])

  // Build calendar grid
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDow = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  // Pad before first day
  const cells: (number | null)[] = Array(startDow).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  function dateStr(day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function classesOnDay(day: number): DanceClass[] {
    const dow = new Date(year, month, day).getDay()
    return classes.filter(c => c.days.some(d => WEEKDAY_JS[d] === dow))
  }

  function eventsOnDay(day: number): StudioEvent[] {
    return events.filter(e => e.date === dateStr(day))
  }

  function dayOffOnDay(day: number): DayOff | undefined {
    return dayOffs.find(d => d.date === dateStr(day))
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  // Selected day details
  const selectedDayNum = selectedDay ? Number(selectedDay.split('-')[2]) : null
  const selectedDayYear = selectedDay ? Number(selectedDay.split('-')[0]) : null
  const selectedDayMonth = selectedDay ? Number(selectedDay.split('-')[1]) - 1 : null
  const isSelectedInView = selectedDayYear === year && selectedDayMonth === month && selectedDayNum !== null

  const selectedClasses = isSelectedInView && selectedDayNum ? classesOnDay(selectedDayNum) : []
  const selectedEvents = isSelectedInView && selectedDayNum ? eventsOnDay(selectedDayNum) : []
  const selectedDayOff = isSelectedInView && selectedDayNum ? dayOffOnDay(selectedDayNum) : undefined

  const todayStr = toYMD(today)

  return (
    <div className="pt-20 min-h-screen bg-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <Badge variant="primary" className="mb-4">Studio Schedule</Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink">
            Class <span className="bg-crimson-gradient bg-clip-text text-transparent">Calendar</span>
          </h1>
          <p className="font-body text-ink/60 mt-3">View all classes, events and holidays at a glance.</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-primary-dark" /><span className="font-body text-xs text-ink/60">Classes</span></div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-gold-dark" /><span className="font-body text-xs text-ink/60">Events</span></div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-400" /><span className="font-body text-xs text-ink/60">Day Off / Holiday</span></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar grid */}
          <div className="lg:col-span-2">
            <Card className="p-4 sm:p-6">
              {/* Month navigator */}
              <div className="flex items-center justify-between mb-5">
                <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-dark-surface text-ink/50 hover:text-ink transition-colors">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="font-display text-xl font-bold text-ink">
                  {MONTH_NAMES[month]} {year}
                </h2>
                <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-dark-surface text-ink/50 hover:text-ink transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Day labels */}
              <div className="grid grid-cols-7 mb-2">
                {DAY_NAMES.map(d => (
                  <div key={d} className="text-center font-body text-xs font-semibold text-ink/40 uppercase py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              {loading ? (
                <div className="grid grid-cols-7 gap-1">
                  {Array(35).fill(0).map((_, i) => <div key={i} className="h-12 bg-dark-surface rounded-lg animate-pulse" />)}
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {cells.map((day, idx) => {
                    if (day === null) return <div key={idx} />
                    const ds = dateStr(day)
                    const isToday = ds === todayStr
                    const isSelected = ds === selectedDay
                    const dayOff = dayOffOnDay(day)
                    const hasClasses = classesOnDay(day).length > 0
                    const hasEvents = eventsOnDay(day).length > 0

                    return (
                      <button key={idx} onClick={() => setSelectedDay(ds)}
                        className={`relative flex flex-col items-center justify-start pt-1.5 h-14 rounded-xl border transition-all text-sm ${
                          dayOff
                            ? 'bg-red-400/10 border-red-400/25 text-red-500'
                            : isSelected
                            ? 'bg-primary border-primary-dark text-ink'
                            : isToday
                            ? 'bg-primary/20 border-primary/40 text-ink'
                            : 'border-transparent hover:bg-dark-surface text-ink/70 hover:text-ink'
                        }`}>
                        <span className={`font-display text-sm font-bold ${isToday && !isSelected ? 'text-primary-dark' : ''}`}>
                          {day}
                        </span>
                        {/* Dots */}
                        <div className="flex gap-0.5 mt-1">
                          {hasClasses && !dayOff && <span className="h-1.5 w-1.5 rounded-full bg-primary-dark" />}
                          {hasEvents && !dayOff && <span className="h-1.5 w-1.5 rounded-full bg-gold-dark" />}
                          {dayOff && <span className="h-1.5 w-1.5 rounded-full bg-red-400" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Day detail panel */}
          <div>
            <Card className="p-5 sticky top-24">
              {selectedDay && isSelectedInView ? (
                <>
                  <h3 className="font-display font-bold text-ink mb-1">
                    {new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h3>
                  {selectedDay === todayStr && <p className="font-body text-xs text-primary-dark font-medium mb-3">Today</p>}

                  {selectedDayOff && (
                    <div className="mb-4 bg-red-400/10 border border-red-400/25 rounded-xl p-3">
                      <p className="font-body text-sm font-semibold text-red-500">{selectedDayOff.name}</p>
                      <p className="font-body text-xs text-red-400 mt-0.5">Studio closed — Day Off</p>
                      {selectedDayOff.notes && <p className="font-body text-xs text-red-400/70 mt-1">{selectedDayOff.notes}</p>}
                    </div>
                  )}

                  {selectedClasses.length > 0 && (
                    <div className="mb-4">
                      <p className="font-body text-xs font-semibold text-ink/50 uppercase tracking-wider mb-2">Classes</p>
                      <div className="space-y-2">
                        {selectedClasses.map(c => (
                          <div key={c.id} className={`p-3 bg-primary/8 border border-primary/15 rounded-xl ${selectedDayOff ? 'opacity-50' : ''}`}>
                            <p className="font-display text-sm font-semibold text-ink">{c.name}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3 text-primary-dark" />
                              <span className="font-body text-xs text-ink/60">{c.timeFrom}–{c.timeTo}</span>
                            </div>
                            <Badge variant="primary" className="text-[10px] mt-1.5">{c.level}</Badge>
                            {selectedDayOff && <p className="font-body text-xs text-red-400 mt-1">Cancelled — holiday</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedEvents.length > 0 && (
                    <div className="mb-4">
                      <p className="font-body text-xs font-semibold text-ink/50 uppercase tracking-wider mb-2">Events</p>
                      <div className="space-y-2">
                        {selectedEvents.map(e => (
                          <div key={e.id} className="p-3 bg-gold/10 border border-gold/20 rounded-xl">
                            <p className="font-display text-sm font-semibold text-ink">{e.title}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Clock className="h-3 w-3 text-gold-dark" />
                              <span className="font-body text-xs text-ink/60">{e.time}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3 text-gold-dark" />
                              <span className="font-body text-xs text-ink/60">{e.venue}</span>
                            </div>
                            <p className="font-body text-xs font-semibold text-ink mt-1">₹{e.price.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!selectedDayOff && selectedClasses.length === 0 && selectedEvents.length === 0 && (
                    <p className="font-body text-sm text-ink/40 text-center py-6">No classes or events on this day.</p>
                  )}
                </>
              ) : (
                <p className="font-body text-sm text-ink/40 text-center py-6">Select a date to see schedule.</p>
              )}
            </Card>
          </div>
        </div>

        {/* Upcoming day offs banner */}
        {dayOffs.filter(d => d.date >= todayStr).length > 0 && (
          <div className="mt-6">
            <h2 className="font-display font-bold text-ink mb-3">Upcoming Holidays</h2>
            <div className="flex flex-wrap gap-3">
              {dayOffs
                .filter(d => d.date >= todayStr)
                .sort((a, b) => a.date.localeCompare(b.date))
                .slice(0, 6)
                .map(d => (
                  <div key={d.id} className="flex items-center gap-2 px-4 py-2.5 bg-red-400/10 border border-red-400/25 rounded-xl">
                    <span className="h-2 w-2 rounded-full bg-red-400 flex-shrink-0" />
                    <div>
                      <p className="font-body text-sm font-semibold text-red-500">{d.name}</p>
                      <p className="font-body text-xs text-red-400">
                        {new Date(d.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
