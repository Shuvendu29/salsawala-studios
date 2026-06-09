'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, CheckCircle, XCircle, MessageSquare, Calendar, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/lib/hooks/useAuth'
import { logout } from '@/lib/firebase/auth'
import { weeklySchedule } from '@/lib/data/classes'
import toast from 'react-hot-toast'

const mockStudents = [
  { id: '1', name: 'Ritika Sharma', email: 'ritika@ex.com', class: 'Salsa', status: 'present' as const },
  { id: '2', name: 'Arjun Mehta', email: 'arjun@ex.com', class: 'Salsa', status: 'absent' as const },
  { id: '3', name: 'Sneha Banerjee', email: 'sneha@ex.com', class: 'Salsa', status: 'present' as const },
  { id: '4', name: 'Rohan Das', email: 'rohan@ex.com', class: 'Salsa', status: 'late' as const },
  { id: '5', name: 'Priya Kapoor', email: 'priya@ex.com', class: 'Salsa', status: 'present' as const },
]

type AttendanceStatus = 'present' | 'absent' | 'late' | null

export default function FacultyDashboard() {
  const { user, profile, loading, role } = useAuth()
  const router = useRouter()
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(
    Object.fromEntries(mockStudents.map(s => [s.id, s.status]))
  )

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && user && role === 'user') router.push('/dashboard')
    if (!loading && user && role === 'admin') router.push('/admin')
  }, [user, loading, role, router])

  if (loading) return <PageLoader />
  if (!user) return null

  const myClasses = weeklySchedule.filter(c => c.instructor.includes('Hitesh')).slice(0, 4)
  const presentCount = Object.values(attendance).filter(v => v === 'present').length
  const absentCount = Object.values(attendance).filter(v => v === 'absent').length

  function markAll(status: AttendanceStatus) {
    setAttendance(Object.fromEntries(mockStudents.map(s => [s.id, status])))
    toast.success(`All students marked as ${status}`)
  }

  async function handleLogout() {
    await logout()
    toast.success('Logged out')
    router.push('/')
  }

  return (
    <div className="pt-20 min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="gold">Faculty</Badge>
            </div>
            <h1 className="font-display text-3xl font-bold text-ink">
              Faculty Dashboard
            </h1>
            <p className="font-body text-ink/60 mt-1">{profile?.displayName || 'Instructor'}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-ink/50 hover:text-ink self-start sm:self-auto">
            <LogOut className="h-4 w-4 mr-1" /> Log Out
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'My Classes', value: '4', sub: 'This week', color: 'text-primary-dark', bg: 'bg-primary/10 border-primary/20', icon: Calendar },
            { label: 'Total Students', value: '42', sub: 'Across all classes', color: 'text-gold-dark', bg: 'bg-gold/10 border-gold/20', icon: Users },
            { label: "Today's Present", value: `${presentCount}`, sub: `of ${mockStudents.length} students`, color: 'text-emerald-600', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
            { label: "Today's Absent", value: `${absentCount}`, sub: 'Marked absent', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20', icon: XCircle },
          ].map(({ label, value, sub, color, bg, icon: Icon }) => (
            <Card key={label} className="p-5">
              <div className={`h-10 w-10 rounded-xl border ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className={`font-display text-2xl font-bold ${color}`}>{value}</div>
              <div className="font-body text-xs text-ink font-medium mt-0.5">{label}</div>
              <div className="font-body text-xs text-ink/40">{sub}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance marking */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-ink">Today&apos;s Attendance</h2>
                  <p className="font-body text-sm text-ink/60">Salsa Beginner · Monday 7:00 PM</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => markAll('present')}>Mark All Present</Button>
                  <Button size="sm" variant="ghost" onClick={() => markAll('absent')} className="text-ink/60">Mark All Absent</Button>
                </div>
              </div>

              <div className="space-y-3">
                {mockStudents.map(student => (
                  <div key={student.id} className="flex items-center gap-3 p-3 bg-dark-surface rounded-xl border border-dark-border">
                    <div className="h-9 w-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                      <span className="font-display text-sm font-bold text-primary-dark">{student.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-ink truncate">{student.name}</p>
                      <p className="font-body text-xs text-ink/50 truncate">{student.email}</p>
                    </div>
                    <div className="flex gap-1.5">
                      {(['present', 'late', 'absent'] as const).map(status => (
                        <button
                          key={status}
                          onClick={() => setAttendance(a => ({ ...a, [student.id]: status }))}
                          className={`px-2.5 py-1 rounded-full text-xs font-body font-medium transition-all ${
                            attendance[student.id] === status
                              ? status === 'present' ? 'bg-emerald-500 text-white' :
                                status === 'late' ? 'bg-amber-400 text-ink' :
                                'bg-red-500 text-white'
                              : 'bg-dark-card border border-dark-border text-ink/50 hover:text-ink'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-5" onClick={() => toast.success('Attendance saved successfully!')}>
                <CheckCircle className="h-4 w-4" /> Save Attendance
              </Button>
            </Card>
          </div>

          {/* My classes + quick actions */}
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-display text-lg font-bold text-ink mb-4">My Weekly Classes</h3>
              <div className="space-y-3">
                {myClasses.map(cls => (
                  <div key={cls.id} className="flex items-center gap-3 p-2.5 bg-dark-surface rounded-xl border border-dark-border">
                    <div className="w-1 h-10 rounded-full bg-primary-dark shrink-0" />
                    <div>
                      <p className="font-display text-sm font-bold text-ink">{cls.style}</p>
                      <p className="font-body text-xs text-ink/50">{cls.day} · {cls.time}</p>
                    </div>
                    <Badge variant={cls.level === 'Beginner' ? 'success' : 'warning'} className="ml-auto text-[10px]">
                      {cls.level.slice(0, 4)}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-display text-lg font-bold text-ink mb-4">Give Feedback</h3>
              <p className="font-body text-sm text-ink/60 mb-3">Send personalized feedback to your students after each class.</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-dark-surface border border-dark-border rounded-xl px-3 py-2 flex items-center">
                  <MessageSquare className="h-4 w-4 text-ink/40" />
                </div>
                <Button size="sm" onClick={() => toast.success('Feedback feature — connect to Firebase to enable')}>
                  Send
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
