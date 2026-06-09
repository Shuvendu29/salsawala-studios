'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, TrendingUp, Star, BookOpen, User, LogOut, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/lib/hooks/useAuth'
import { logout } from '@/lib/firebase/auth'
import { weeklySchedule } from '@/lib/data/classes'
import toast from 'react-hot-toast'

const recentActivity = [
  { type: 'attended', label: 'Attended Salsa class', date: 'Today', instructor: 'Hitesh' },
  { type: 'booked', label: 'Booked Bachata on Tuesday', date: 'Yesterday', instructor: 'Hitesh' },
  { type: 'attended', label: 'Attended Hip-Hop class', date: '3 days ago', instructor: 'Akash' },
  { type: 'attended', label: 'Attended Contemporary', date: '5 days ago', instructor: 'Priyam' },
]

export default function UserDashboard() {
  const { user, profile, loading, role } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && user && (role === 'admin' || role === 'faculty')) {
      router.push(role === 'admin' ? '/admin' : '/faculty')
    }
  }, [user, loading, role, router])

  if (loading) return <PageLoader />
  if (!user) return null

  const upcomingClasses = weeklySchedule.slice(0, 3)

  async function handleLogout() {
    await logout()
    toast.success('See you next time!')
    router.push('/')
  }

  return (
    <div className="pt-20 min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">
              Hey, {profile?.displayName?.split(' ')[0] || 'Dancer'} 👋
            </h1>
            <p className="font-body text-white/50 mt-1">Welcome to your dance dashboard</p>
          </div>
          <div className="flex gap-3">
            <Link href="/classes"><Button size="sm">Book a Class</Button></Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white/50 hover:text-white">
              <LogOut className="h-4 w-4 mr-1" /> Log Out
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: CheckCircle, label: 'Classes Attended', value: '12', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
            { icon: Calendar, label: 'Upcoming Bookings', value: '2', color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
            { icon: TrendingUp, label: 'Progress Score', value: '78%', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            { icon: Star, label: 'Reviews Given', value: '3', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <Card key={label} className="p-5">
              <div className={`h-10 w-10 rounded-xl border ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className={`font-display text-2xl font-bold ${color}`}>{value}</div>
              <div className="font-body text-xs text-white/40 mt-1">{label}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming classes */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-white">Upcoming Classes</h2>
              <Link href="/classes" className="text-sm text-primary font-body hover:text-primary-light transition-colors flex items-center gap-1">
                Browse all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingClasses.map(cls => (
                <Card key={cls.id} className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-white">{cls.style}</h3>
                      <Badge variant={cls.level === 'Beginner' ? 'success' : cls.level === 'All Levels' ? 'primary' : 'warning'} className="text-[10px]">
                        {cls.level}
                      </Badge>
                    </div>
                    <p className="font-body text-sm text-white/50">{cls.day} · {cls.time} · {cls.instructor.split(' ')[0]}</p>
                  </div>
                  <Button size="sm" variant="outline">Book</Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Activity + Profile */}
          <div className="space-y-4">
            {/* Profile */}
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-crimson-gradient flex items-center justify-center">
                  <span className="font-display text-white text-lg font-bold">
                    {profile?.displayName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-display font-bold text-white">{profile?.displayName || 'Student'}</p>
                  <p className="font-body text-xs text-white/40">{user.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-white/50">Member since</span>
                  <span className="text-white">June 2026</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-white/50">Favourite style</span>
                  <span className="text-white">Salsa</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-white/50">Role</span>
                  <Badge variant="primary" className="text-[10px]">Student</Badge>
                </div>
              </div>
            </Card>

            {/* Recent activity */}
            <Card className="p-5">
              <h3 className="font-display font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${a.type === 'attended' ? 'bg-emerald-400' : 'bg-primary'}`} />
                    <div>
                      <p className="font-body text-sm text-white/70">{a.label}</p>
                      <p className="font-body text-xs text-white/30">{a.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Submit review CTA */}
        <Card className="mt-6 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Star className="h-8 w-8 text-gold" />
            <div>
              <p className="font-display font-bold text-white">Enjoying your classes?</p>
              <p className="font-body text-sm text-white/50">Share your experience to help other students discover Salsawala Studios.</p>
            </div>
          </div>
          <Button variant="gold" size="sm" className="shrink-0">Write a Review</Button>
        </Card>
      </div>
    </div>
  )
}
