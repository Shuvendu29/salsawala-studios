'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar, TrendingUp, Star, BookOpen, LogOut, ArrowRight,
  CheckCircle, AlertCircle, Clock, ShoppingCart, PauseCircle,
  User as UserIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/lib/hooks/useAuth'
import { logout } from '@/lib/firebase/auth'
import { getUserEnrollments } from '@/lib/firebase/firestore'
import { ClassEnrollment } from '@/lib/types'
import toast from 'react-hot-toast'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle; desc: string }> = {
  active: { label: 'Active', color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle, desc: 'Your membership is active.' },
  pending_payment: { label: 'Payment Pending', color: 'text-amber-600 bg-amber-500/10 border-amber-500/20', icon: Clock, desc: 'Complete your registration payment.' },
  pending_approval: { label: 'Pending Approval', color: 'text-blue-600 bg-blue-500/10 border-blue-500/20', icon: Clock, desc: 'Admin will approve your registration soon.' },
  paused: { label: 'Paused', color: 'text-purple-600 bg-purple-500/10 border-purple-500/20', icon: PauseCircle, desc: 'Your membership is on pause.' },
  expired: { label: 'Expired', color: 'text-red-600 bg-red-500/10 border-red-500/20', icon: AlertCircle, desc: 'Your membership has expired. Please renew.' },
  incomplete: { label: 'Incomplete', color: 'text-ink/50 bg-dark-surface border-dark-border', icon: AlertCircle, desc: 'Complete your profile to continue.' },
}

export default function UserDashboard() {
  const { user, profile, loading, role } = useAuth()
  const router = useRouter()
  const [enrollments, setEnrollments] = useState<ClassEnrollment[]>([])
  const [loadingEnroll, setLoadingEnroll] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && user && (role === 'admin')) router.push('/admin')
    if (!loading && user && (role === 'faculty' || role === 'crew')) router.push('/faculty')
    if (!loading && user && profile && !profile.profileComplete) router.push('/onboarding')
  }, [user, loading, role, profile, router])

  useEffect(() => {
    if (!user) return
    getUserEnrollments(user.uid).then(e => {
      setEnrollments(e)
      setLoadingEnroll(false)
    }).catch(() => setLoadingEnroll(false))
  }, [user])

  if (loading) return <PageLoader />
  if (!user) return null

  async function handleLogout() {
    await logout()
    toast.success('See you next time!')
    router.push('/')
  }

  const status = profile?.registrationStatus || 'incomplete'
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.incomplete
  const StatusIcon = statusCfg.icon
  const isActive = status === 'active'

  const expiryDate = profile?.registrationExpiry
    ? new Date((profile.registrationExpiry as any)?.seconds * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <div className="pt-20 min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">
              Hey, {profile?.displayName?.split(' ')[0] || 'Dancer'} 👋
            </h1>
            <p className="font-body text-ink/60 mt-1">Welcome to your dance dashboard</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {isActive && (
              <Link href="/cart"><Button size="sm"><ShoppingCart className="h-4 w-4 mr-1" />Cart</Button></Link>
            )}
            {isActive && (
              <Link href="/classes"><Button size="sm" variant="outline">Browse Classes</Button></Link>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-ink/50 hover:text-ink">
              <LogOut className="h-4 w-4 mr-1" /> Log Out
            </Button>
          </div>
        </div>

        {/* Membership status banner */}
        <div className={`border rounded-2xl p-4 mb-8 flex items-center gap-4 ${statusCfg.color}`}>
          <StatusIcon className="h-6 w-6 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-body font-semibold text-sm">{statusCfg.label}</p>
            <p className="font-body text-xs opacity-80">{statusCfg.desc}{expiryDate ? ` Valid until ${expiryDate}.` : ''}</p>
          </div>
          {(status === 'pending_payment' || status === 'expired') && (
            <Link href="/onboarding">
              <Button size="sm">Complete Registration</Button>
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: 'Classes Enrolled', value: enrollments.filter(e => e.status === 'active').length, color: 'text-primary-dark', bg: 'bg-primary/10 border-primary/20' },
            { icon: Calendar, label: 'Upcoming Classes', value: '—', color: 'text-gold-dark', bg: 'bg-gold/10 border-gold/20' },
            { icon: TrendingUp, label: 'Classes Attended', value: '—', color: 'text-emerald-600', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            { icon: Star, label: 'Years Dancing', value: profile?.yearsOfDancing || 0, color: 'text-purple-600', bg: 'bg-purple-500/10 border-purple-500/20' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <Card key={label} className="p-5">
              <div className={`h-10 w-10 rounded-xl border ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className={`font-display text-2xl font-bold ${color}`}>{value}</div>
              <div className="font-body text-xs text-ink/50 mt-1">{label}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enrolled classes */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-ink">My Classes</h2>
              {isActive && (
                <Link href="/classes" className="text-sm text-primary-dark font-body hover:text-primary transition-colors flex items-center gap-1">
                  Enroll more <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            {loadingEnroll ? (
              <div className="space-y-3">
                {[1, 2].map(i => <div key={i} className="h-20 bg-dark-card border border-dark-border rounded-2xl animate-pulse" />)}
              </div>
            ) : enrollments.length === 0 ? (
              <Card className="p-8 text-center">
                <BookOpen className="h-10 w-10 text-ink/20 mx-auto mb-3" />
                <p className="font-body text-sm text-ink/50 mb-4">No classes enrolled yet.</p>
                {isActive && (
                  <Link href="/classes"><Button size="sm">Browse Classes</Button></Link>
                )}
              </Card>
            ) : (
              <div className="space-y-3">
                {enrollments.map(enr => (
                  <Card key={enr.id} className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <BookOpen className="h-5 w-5 text-primary-dark" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-ink">{enr.classId}</h3>
                      <p className="font-body text-sm text-ink/60">{enr.durationMonths} month{enr.durationMonths > 1 ? 's' : ''}</p>
                    </div>
                    <Badge variant={enr.status === 'active' ? 'success' : 'warning'} className="text-[10px] capitalize">
                      {enr.status}
                    </Badge>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Profile card */}
          <div className="space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-14 w-14 rounded-full overflow-hidden bg-primary border-2 border-primary-dark flex items-center justify-center shrink-0">
                  {profile?.profilePicture
                    ? <img src={profile.profilePicture} alt={profile.displayName} className="w-full h-full object-cover" />
                    : <span className="font-display text-ink text-xl font-bold">{profile?.displayName?.charAt(0).toUpperCase() || 'U'}</span>
                  }
                </div>
                <div>
                  <p className="font-display font-bold text-ink">{profile?.displayName || 'Student'}</p>
                  <p className="font-body text-xs text-ink/50">{user.email || profile?.phone || '—'}</p>
                </div>
              </div>
              <div className="space-y-2.5 text-sm font-body">
                {[
                  { label: 'Gender', value: profile?.gender || '—' },
                  { label: 'Phone', value: profile?.phone || '—' },
                  { label: 'Years dancing', value: `${profile?.yearsOfDancing || 0} yrs` },
                  { label: 'Member since', value: profile?.createdAt
                    ? new Date((profile.createdAt as any)?.seconds * 1000).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                    : '—' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-ink/50">{row.label}</span>
                    <span className="text-ink font-medium capitalize">{row.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick actions */}
            {isActive && (
              <Card className="p-5">
                <h3 className="font-display font-semibold text-ink mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/cart" className="flex items-center justify-between p-3 rounded-xl hover:bg-dark-surface transition-colors">
                    <div className="flex items-center gap-2.5">
                      <ShoppingCart className="h-4 w-4 text-primary-dark" />
                      <span className="font-body text-sm text-ink">Add Classes</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-ink/30" />
                  </Link>
                  <Link href="/events" className="flex items-center justify-between p-3 rounded-xl hover:bg-dark-surface transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="h-4 w-4 text-gold-dark" />
                      <span className="font-body text-sm text-ink">Browse Events</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-ink/30" />
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
