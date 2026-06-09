'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Users, BookOpen, Calendar, TrendingUp, DollarSign,
  Plus, Settings, Shield, BarChart3, LogOut, Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/lib/hooks/useAuth'
import { logout } from '@/lib/firebase/auth'
import { weeklySchedule } from '@/lib/data/classes'
import { upcomingEvents } from '@/lib/data/events'
import toast from 'react-hot-toast'

const recentBookings = [
  { name: 'Ritika Sharma', class: 'Salsa Beginner', amount: 800, status: 'confirmed', time: '2 min ago' },
  { name: 'Arjun Mehta', class: 'Hip-Hop', amount: 700, status: 'confirmed', time: '15 min ago' },
  { name: 'Sneha Banerjee', class: 'Contemporary', amount: 750, status: 'pending', time: '1 hr ago' },
  { name: 'Vikram Singh', class: 'Kizomba', amount: 900, status: 'confirmed', time: '2 hr ago' },
  { name: 'Priya Kapoor', class: 'Pilates', amount: 700, status: 'cancelled', time: '3 hr ago' },
]

export default function AdminDashboard() {
  const { user, profile, loading, role } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'events' | 'analytics'>('overview')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && user && role !== 'admin') {
      router.push(role === 'faculty' ? '/faculty' : '/dashboard')
    }
  }, [user, loading, role, router])

  if (loading) return <PageLoader />
  if (!user) return null

  async function handleLogout() {
    await logout()
    toast.success('Logged out')
    router.push('/')
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'classes', label: 'Classes', icon: BookOpen },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ] as const

  return (
    <div className="pt-20 min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-gold-dark" />
              <Badge variant="gold">Admin</Badge>
            </div>
            <h1 className="font-display text-3xl font-bold text-ink">Admin Dashboard</h1>
            <p className="font-body text-ink/60 mt-1">Salsawala Studios Control Panel</p>
          </div>
          <div className="flex gap-3">
            <Button size="sm" variant="gold">
              <Plus className="h-4 w-4" /> New Class
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-ink/50 hover:text-ink">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-dark-surface border border-dark-border rounded-xl p-1 mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all whitespace-nowrap ${
                activeTab === id
                  ? 'bg-primary text-ink shadow-glow-red'
                  : 'text-ink/50 hover:text-ink'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Students', value: '512', sub: '+24 this month', icon: Users, color: 'text-primary-dark', bg: 'bg-primary/10 border-primary/20' },
                { label: 'Active Classes', value: `${weeklySchedule.length}`, sub: 'This week', icon: BookOpen, color: 'text-gold-dark', bg: 'bg-gold/10 border-gold/20' },
                { label: 'Monthly Revenue', value: '₹1.2L', sub: '+18% vs last month', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                { label: 'Upcoming Events', value: `${upcomingEvents.length}`, sub: 'Next 60 days', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-500/10 border-purple-500/20' },
              ].map(({ label, value, sub, icon: Icon, color, bg }) => (
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent bookings */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-lg font-bold text-ink">Recent Bookings</h2>
                  <button className="text-xs text-primary-dark font-body hover:text-primary flex items-center gap-1">
                    View all <Eye className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {recentBookings.map((b, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-dark-surface rounded-xl border border-dark-border">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="font-display text-xs font-bold text-primary-dark">{b.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm text-ink truncate">{b.name}</p>
                        <p className="font-body text-xs text-ink/50">{b.class} · {b.time}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-display text-sm font-bold text-ink">₹{b.amount}</p>
                        <span className={`text-xs font-body ${
                          b.status === 'confirmed' ? 'text-emerald-600' :
                          b.status === 'pending' ? 'text-amber-500' :
                          'text-red-500'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick actions */}
              <div className="space-y-4">
                <Card className="p-6">
                  <h2 className="font-display text-lg font-bold text-ink mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Add Class', icon: Plus, color: 'text-primary-dark', bg: 'bg-primary/10 border-primary/20', action: () => toast.success('Open class creation modal') },
                      { label: 'Add Event', icon: Calendar, color: 'text-gold-dark', bg: 'bg-gold/10 border-gold/20', action: () => toast.success('Open event creation modal') },
                      { label: 'Add Faculty', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-500/10 border-emerald-500/20', action: () => toast.success('Open faculty creation modal') },
                      { label: 'Site Settings', icon: Settings, color: 'text-purple-600', bg: 'bg-purple-500/10 border-purple-500/20', action: () => toast.success('Open settings') },
                    ].map(({ label, icon: Icon, color, bg, action }) => (
                      <button
                        key={label}
                        onClick={action}
                        className="flex flex-col items-center gap-2 p-4 bg-dark-surface border border-dark-border rounded-xl hover:border-primary/30 transition-all group"
                      >
                        <div className={`h-10 w-10 rounded-xl border ${bg} flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 ${color}`} />
                        </div>
                        <span className="font-body text-xs text-ink/60 group-hover:text-ink transition-colors">{label}</span>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Revenue summary */}
                <Card className="p-5">
                  <h3 className="font-display font-bold text-ink mb-4">Revenue Overview</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Class Bookings', amount: '₹85,400', pct: 70 },
                      { label: 'Events & Workshops', amount: '₹28,500', pct: 23 },
                      { label: 'Monthly Passes', amount: '₹8,700', pct: 7 },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs font-body mb-1">
                          <span className="text-ink/60">{item.label}</span>
                          <span className="text-ink font-medium">{item.amount}</span>
                        </div>
                        <div className="w-full bg-dark-surface rounded-full h-1.5 overflow-hidden">
                          <div className="h-full bg-crimson-gradient rounded-full" style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Classes Tab */}
        {activeTab === 'classes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-xl font-bold text-ink">All Classes</h2>
              <Button size="sm"><Plus className="h-4 w-4" /> Add Class</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weeklySchedule.map(cls => (
                <Card key={cls.id} className="p-4 hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-display font-bold text-ink">{cls.style}</h3>
                    <Badge variant={cls.level === 'Beginner' ? 'success' : cls.level === 'All Levels' ? 'primary' : 'warning'}>{cls.level}</Badge>
                  </div>
                  <p className="font-body text-sm text-ink/60 mb-3">{cls.instructor}</p>
                  <div className="flex gap-4 text-xs text-ink/50 font-body mb-3">
                    <span>{cls.day}</span>
                    <span>{cls.time}</span>
                    <span>{cls.spots}/{cls.totalSpots} spots</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-display font-bold text-ink">₹{cls.price}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">Edit</Button>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">Delete</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-xl font-bold text-ink">All Events</h2>
              <Button size="sm"><Plus className="h-4 w-4" /> Add Event</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {upcomingEvents.map(event => {
                const date = new Date(event.date)
                return (
                  <Card key={event.id} className="overflow-hidden hover:border-primary/30 transition-all">
                    {/* Dark gradient header — keep text-white */}
                    <div className={`h-24 bg-gradient-to-br ${event.gradient} flex items-center justify-end p-4`}>
                      <div className="bg-black/40 rounded-xl px-3 py-2 text-center">
                        <div className="font-display text-2xl font-bold text-white leading-none">{date.getDate()}</div>
                        <div className="font-body text-xs text-white/70">{date.toLocaleString('default', { month: 'short' })}</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-display font-bold text-ink">{event.title}</h3>
                        <Badge variant={event.type === 'workshop' ? 'primary' : event.type === 'social' ? 'gold' : 'success'}>{event.tag}</Badge>
                      </div>
                      <p className="font-body text-xs text-ink/60 mb-3">{event.time} · {event.venue}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-display font-bold text-ink">₹{event.price}</span>
                          <span className="text-xs text-ink/50 font-body ml-1">{event.enrolled}/{event.capacity} registered</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary">Edit</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Most Popular Style', value: 'Salsa', sub: '38% of bookings', icon: '🔥' },
                { label: 'Peak Day', value: 'Saturday', sub: 'Highest attendance', icon: '📅' },
                { label: 'Avg. Class Size', value: '11 students', sub: 'Across all classes', icon: '👥' },
              ].map(stat => (
                <Card key={stat.label} className="p-5 text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="font-display text-xl font-bold text-ink">{stat.value}</div>
                  <div className="font-body text-xs text-ink/60 mt-1">{stat.label}</div>
                  <div className="font-body text-xs text-ink/40">{stat.sub}</div>
                </Card>
              ))}
            </div>

            <Card className="p-6">
              <h3 className="font-display text-lg font-bold text-ink mb-4">Style Popularity</h3>
              <div className="space-y-3">
                {[
                  { style: 'Salsa', count: 195, pct: 38 },
                  { style: 'Bachata', count: 130, pct: 25 },
                  { style: 'Hip-Hop', count: 92, pct: 18 },
                  { style: 'Contemporary', count: 60, pct: 12 },
                  { style: 'Others', count: 35, pct: 7 },
                ].map(item => (
                  <div key={item.style} className="flex items-center gap-3">
                    <span className="font-body text-sm text-ink/60 w-28 shrink-0">{item.style}</span>
                    <div className="flex-1 bg-dark-surface rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-crimson-gradient rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                    <span className="font-body text-xs text-ink/50 w-16 text-right shrink-0">{item.count} students</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-display text-lg font-bold text-ink mb-2">Firebase Analytics</h3>
              <p className="font-body text-sm text-ink/60">
                Connect Firebase Analytics to see real-time data: revenue charts, student retention, booking trends, and more. Set up in your Firebase console and configure Google Analytics.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
