'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, CheckCircle, XCircle, MessageSquare, Calendar, LogOut, BookOpen, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/lib/hooks/useAuth'
import { logout } from '@/lib/firebase/auth'
import {
  getClasses, getClassEnrollments, saveAttendance, getAttendance,
  getEvents, getEventRegistrations,
} from '@/lib/firebase/firestore'
import { DanceClass, ClassEnrollment, StudioEvent, EventRegistration, AttendanceStatus } from '@/lib/types'
import toast from 'react-hot-toast'

type PanelTab = 'classes' | 'events' | 'attendance'

export default function FacultyDashboard() {
  const { user, profile, loading, role } = useAuth()
  const router = useRouter()

  const [tab, setTab] = useState<PanelTab>('classes')
  const [myClasses, setMyClasses] = useState<DanceClass[]>([])
  const [myEvents, setMyEvents] = useState<StudioEvent[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Attendance state
  const [selectedClass, setSelectedClass] = useState<DanceClass | null>(null)
  const [enrollments, setEnrollments] = useState<ClassEnrollment[]>([])
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({})
  const [savingAttendance, setSavingAttendance] = useState(false)
  const [attendanceNotes, setAttendanceNotes] = useState('')

  // Event registrations
  const [selectedEvent, setSelectedEvent] = useState<StudioEvent | null>(null)
  const [eventRegs, setEventRegs] = useState<EventRegistration[]>([])
  const [loadingRegs, setLoadingRegs] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && user && role === 'user') router.push('/dashboard')
    if (!loading && user && role === 'admin') router.push('/admin')
  }, [user, loading, role, router])

  useEffect(() => {
    if (!user) return
    Promise.all([getClasses(true), getEvents(true)])
      .then(([classes, events]) => {
        // Filter to faculty's assigned items
        const facultyClasses = role === 'admin'
          ? classes
          : classes.filter(c => c.assignedFaculty?.includes(user.uid))
        const facultyEvents = role === 'admin'
          ? events
          : events.filter(e => e.assignedFaculty?.includes(user.uid))
        setMyClasses(facultyClasses)
        setMyEvents(facultyEvents)
      })
      .catch(() => {})
      .finally(() => setLoadingData(false))
  }, [user, role])

  useEffect(() => {
    if (!selectedClass) return
    const today = new Date().toISOString().split('T')[0]
    Promise.all([
      getClassEnrollments(selectedClass.id),
      getAttendance(selectedClass.id, today),
    ]).then(([enrList, existingAttendance]) => {
      setEnrollments(enrList)
      if (existingAttendance) {
        setAttendance(existingAttendance.students)
        setAttendanceNotes(existingAttendance.notes || '')
      } else {
        setAttendance(Object.fromEntries(enrList.map(e => [e.userId, 'absent'])))
        setAttendanceNotes('')
      }
    }).catch(() => {})
  }, [selectedClass])

  useEffect(() => {
    if (!selectedEvent) return
    setLoadingRegs(true)
    getEventRegistrations(selectedEvent.id)
      .then(setEventRegs)
      .catch(() => {})
      .finally(() => setLoadingRegs(false))
  }, [selectedEvent])

  if (loading) return <PageLoader />
  if (!user) return null

  const presentCount = Object.values(attendance).filter(v => v === 'present').length
  const absentCount = Object.values(attendance).filter(v => v === 'absent').length
  const lateCount = Object.values(attendance).filter(v => v === 'late').length

  async function handleLogout() {
    await logout()
    toast.success('Logged out')
    router.push('/')
  }

  async function saveAttendanceNow() {
    if (!selectedClass || !user) return
    setSavingAttendance(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      await saveAttendance({
        type: 'class',
        targetId: selectedClass.id,
        date: today,
        markedBy: user.uid,
        students: attendance,
        notes: attendanceNotes,
      })
      toast.success('Attendance saved!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to save attendance')
    } finally {
      setSavingAttendance(false)
    }
  }

  function markAll(status: AttendanceStatus) {
    setAttendance(prev => Object.fromEntries(Object.keys(prev).map(k => [k, status])))
  }

  const TABS: { id: PanelTab; label: string; count?: number }[] = [
    { id: 'classes', label: 'My Classes', count: myClasses.length },
    { id: 'events', label: 'My Events', count: myEvents.length },
    { id: 'attendance', label: 'Mark Attendance' },
  ]

  return (
    <div className="pt-20 min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="gold">{role === 'admin' ? 'Admin' : role === 'crew' ? 'Crew' : 'Faculty'}</Badge>
            </div>
            <h1 className="font-display text-3xl font-bold text-ink">Faculty Panel</h1>
            <p className="font-body text-ink/60 mt-1">{profile?.displayName || 'Instructor'}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-ink/50 hover:text-ink self-start">
            <LogOut className="h-4 w-4 mr-1" /> Log Out
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'My Classes', value: myClasses.length, color: 'text-primary-dark', bg: 'bg-primary/10 border-primary/20', icon: BookOpen },
            { label: 'My Events', value: myEvents.length, color: 'text-gold-dark', bg: 'bg-gold/10 border-gold/20', icon: Calendar },
            { label: "Today's Present", value: presentCount, color: 'text-emerald-600', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
            { label: "Today's Absent", value: absentCount + lateCount, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20', icon: XCircle },
          ].map(({ label, value, color, bg, icon: Icon }) => (
            <Card key={label} className="p-5">
              <div className={`h-10 w-10 rounded-xl border ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className={`font-display text-2xl font-bold ${color}`}>{value}</div>
              <div className="font-body text-xs text-ink/50 mt-1">{label}</div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-body text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.id ? 'bg-primary text-ink' : 'text-ink/60 hover:text-ink bg-dark-surface border border-dark-border'
              }`}>
              {t.label}
              {t.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-ink/20 text-ink' : 'bg-dark-border text-ink/50'}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Classes tab */}
        {tab === 'classes' && (
          <div>
            {loadingData ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-dark-card border border-dark-border rounded-2xl animate-pulse" />)}</div>
            ) : myClasses.length === 0 ? (
              <Card className="p-10 text-center">
                <BookOpen className="h-10 w-10 text-ink/20 mx-auto mb-3" />
                <p className="font-body text-ink/50">No classes assigned yet. Ask admin to assign you.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {myClasses.map(cls => (
                  <Card key={cls.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display font-bold text-ink">{cls.name}</h3>
                          <Badge variant={cls.level === 'Beginner' ? 'success' : cls.level === 'Intermediate' ? 'warning' : 'primary'} className="text-[10px]">
                            {cls.level}
                          </Badge>
                        </div>
                        <p className="font-body text-sm text-ink/60 mb-2">{cls.style}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-ink/50 font-body">
                          <span>{cls.days.join(', ')}</span>
                          <span>·</span>
                          <span>{cls.timeFrom} – {cls.timeTo}</span>
                          <span>·</span>
                          <span>{cls.classesPerMonth} classes/month</span>
                          <span>·</span>
                          <span>₹{(cls.pricePerMonth ?? 0).toLocaleString()}/month</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => { setSelectedClass(cls); setTab('attendance') }}>
                        Mark Attendance
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Events tab */}
        {tab === 'events' && (
          <div className="space-y-4">
            {loadingData ? (
              <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-24 bg-dark-card border border-dark-border rounded-2xl animate-pulse" />)}</div>
            ) : myEvents.length === 0 ? (
              <Card className="p-10 text-center">
                <Calendar className="h-10 w-10 text-ink/20 mx-auto mb-3" />
                <p className="font-body text-ink/50">No events assigned yet.</p>
              </Card>
            ) : (
              myEvents.map(ev => (
                <Card key={ev.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-ink mb-1">{ev.title}</h3>
                      <p className="font-body text-sm text-ink/60">
                        {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {ev.time}
                      </p>
                      <p className="font-body text-xs text-ink/40 mt-1">{ev.venue}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => {
                      setSelectedEvent(ev)
                      // Load registrations
                    }}>
                      View Registrations
                    </Button>
                  </div>

                  {/* Registrations list */}
                  {selectedEvent?.id === ev.id && (
                    <div className="mt-4 pt-4 border-t border-dark-border">
                      {loadingRegs ? (
                        <p className="font-body text-sm text-ink/40">Loading…</p>
                      ) : eventRegs.length === 0 ? (
                        <p className="font-body text-sm text-ink/40">No registrations yet.</p>
                      ) : (
                        <div className="space-y-2">
                          <p className="font-body text-xs text-ink/60 mb-2">{eventRegs.length} registrations</p>
                          {eventRegs.map(r => (
                            <div key={r.id} className="flex items-center justify-between bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5">
                              <div>
                                <p className="font-body text-sm font-medium text-ink">{r.name}</p>
                                <p className="font-body text-xs text-ink/50">{r.email || r.guestPhone || '—'}</p>
                              </div>
                              <Badge variant={r.paymentStatus === 'confirmed' ? 'success' : 'warning'} className="text-[10px] capitalize">
                                {r.paymentStatus}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        )}

        {/* Attendance tab */}
        {tab === 'attendance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6">
                {/* Class selector */}
                <div className="mb-5">
                  <label className="block font-body text-xs text-ink/60 mb-1.5">Select Class</label>
                  <div className="relative">
                    <select
                      value={selectedClass?.id || ''}
                      onChange={e => {
                        const cls = myClasses.find(c => c.id === e.target.value) || null
                        setSelectedClass(cls)
                      }}
                      className="w-full appearance-none bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-ink font-body text-sm focus:outline-none focus:border-primary/60 pr-10"
                    >
                      <option value="">Choose a class…</option>
                      {myClasses.map(c => (
                        <option key={c.id} value={c.id}>{c.name} — {c.days.join(', ')} {c.timeFrom}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40 pointer-events-none" />
                  </div>
                </div>

                {!selectedClass ? (
                  <div className="text-center py-12">
                    <Users className="h-10 w-10 text-ink/20 mx-auto mb-3" />
                    <p className="font-body text-sm text-ink/40">Select a class to mark attendance</p>
                  </div>
                ) : enrollments.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="font-body text-sm text-ink/40">No enrolled students in this class yet.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                      <div>
                        <h2 className="font-display text-xl font-bold text-ink">Today&apos;s Attendance</h2>
                        <p className="font-body text-sm text-ink/60">{selectedClass.name} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => markAll('present')}>All Present</Button>
                        <Button size="sm" variant="ghost" onClick={() => markAll('absent')} className="text-ink/60">All Absent</Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {enrollments.map(enr => (
                        <div key={enr.id} className="flex items-center gap-3 p-3 bg-dark-surface rounded-xl border border-dark-border">
                          <div className="h-9 w-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                            <span className="font-display text-sm font-bold text-primary-dark">
                              {enr.className?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-sm font-medium text-ink truncate">{enr.userId}</p>
                            <p className="font-body text-xs text-ink/40 truncate">Enrolled: {enr.durationMonths}mo</p>
                          </div>
                          <div className="flex gap-1.5">
                            {(['present', 'late', 'absent'] as const).map(s => (
                              <button key={s} onClick={() => setAttendance(a => ({ ...a, [enr.userId]: s }))}
                                className={`px-2.5 py-1 rounded-full text-xs font-body font-medium transition-all ${
                                  attendance[enr.userId] === s
                                    ? s === 'present' ? 'bg-emerald-500 text-white'
                                      : s === 'late' ? 'bg-amber-400 text-ink'
                                      : 'bg-red-500 text-white'
                                    : 'bg-dark-card border border-dark-border text-ink/50 hover:text-ink'
                                }`}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <textarea
                        value={attendanceNotes}
                        onChange={e => setAttendanceNotes(e.target.value)}
                        placeholder="Notes (optional)…"
                        rows={2}
                        className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60 resize-none"
                      />
                    </div>

                    <Button className="w-full mt-4" onClick={saveAttendanceNow} loading={savingAttendance}>
                      <CheckCircle className="h-4 w-4" /> Save Attendance
                    </Button>
                  </>
                )}
              </Card>
            </div>

            {/* Summary sidebar */}
            <div className="space-y-4">
              <Card className="p-5">
                <h3 className="font-display font-bold text-ink mb-4">Today&apos;s Summary</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Present', value: presentCount, color: 'text-emerald-600', dot: 'bg-emerald-500' },
                    { label: 'Late', value: lateCount, color: 'text-amber-600', dot: 'bg-amber-400' },
                    { label: 'Absent', value: absentCount, color: 'text-red-500', dot: 'bg-red-500' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${row.dot}`} />
                        <span className="font-body text-sm text-ink/60">{row.label}</span>
                      </div>
                      <span className={`font-display font-bold ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                  <div className="border-t border-dark-border pt-2 flex justify-between">
                    <span className="font-body text-sm text-ink/60">Total</span>
                    <span className="font-display font-bold text-ink">{enrollments.length}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="font-display font-bold text-ink mb-3">Send Feedback</h3>
                <p className="font-body text-xs text-ink/50 mb-3">Share observations with students after class.</p>
                <textarea placeholder="Write feedback…" rows={3}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2.5 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60 resize-none mb-2" />
                <Button size="sm" className="w-full" onClick={() => toast.success('Feedback feature coming soon!')}>
                  <MessageSquare className="h-3.5 w-3.5 mr-1" /> Send
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
