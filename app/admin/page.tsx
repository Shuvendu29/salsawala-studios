'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, BookOpen, Calendar, DollarSign, Plus, Settings,
  BarChart3, LogOut, Video, Tag, UserCog, CheckCircle,
  Clock, XCircle, Trash2, Edit3, Upload, AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/lib/hooks/useAuth'
import { logout, updateUserProfile } from '@/lib/firebase/auth'
import {
  getAllHomeVideos, addHomeVideo, updateHomeVideo, deleteHomeVideo,
  updateSiteInfo, getSiteInfo,
  getRegistrationConfig, updateRegistrationConfig,
  getAllUsers, getPendingApprovalUsers, approveUserRegistration,
  getPendingCashOrders, confirmOrder,
  createCoupon, getFacultyProfiles, createFacultyProfile,
} from '@/lib/firebase/firestore'
import { uploadVideo, deleteStorageFile } from '@/lib/firebase/storage'
import {
  SiteVideo, RegistrationConfig, UserProfile, Coupon,
  FacultyProfile, Order,
} from '@/lib/types'
import toast from 'react-hot-toast'

type Tab = 'overview' | 'content' | 'students' | 'coupons' | 'faculty' | 'finance' | 'config'

export default function AdminDashboard() {
  const { user, profile, loading, role } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('overview')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && user && role !== 'admin') {
      router.push(role === 'faculty' || role === 'crew' ? '/faculty' : '/dashboard')
    }
  }, [user, loading, role, router])

  if (loading) return <PageLoader />
  if (!user) return null

  async function handleLogout() {
    await logout()
    toast.success('Logged out')
    router.push('/')
  }

  const TABS: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'content', label: 'Content & Videos', icon: Video },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'faculty', label: 'Faculty / Crew', icon: UserCog },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'config', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="pt-20 min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">Admin Panel</h1>
            <p className="font-body text-sm text-ink/50 mt-1">Salsawala Studios — {profile?.displayName}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-ink/50 hover:text-ink">
            <LogOut className="h-4 w-4 mr-1" /> Log Out
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-body text-sm font-medium whitespace-nowrap transition-all ${
                  tab === t.id
                    ? 'bg-primary text-ink border border-primary-dark'
                    : 'text-ink/60 hover:text-ink hover:bg-dark-surface border border-transparent'
                }`}>
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Tab Panels */}
        {tab === 'overview' && <OverviewTab />}
        {tab === 'content' && <ContentTab />}
        {tab === 'students' && <StudentsTab />}
        {tab === 'coupons' && <CouponsTab adminUid={user.uid} />}
        {tab === 'faculty' && <FacultyTab />}
        {tab === 'finance' && <FinanceTab />}
        {tab === 'config' && <ConfigTab />}
      </div>
    </div>
  )
}

// ─── Overview ────────────────────────────────────────────────────────────────
function OverviewTab() {
  const stats = [
    { label: 'Total Students', value: '—', icon: Users, color: 'text-primary-dark', bg: 'bg-primary/10 border-primary/20' },
    { label: 'Classes Today', value: '—', icon: BookOpen, color: 'text-gold-dark', bg: 'bg-gold/10 border-gold/20' },
    { label: 'Pending Approvals', value: '—', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Revenue (Month)', value: '—', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  ]
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="p-5">
              <div className={`h-10 w-10 rounded-xl border ${s.bg} flex items-center justify-center mb-3`}>
                <Icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="font-body text-xs text-ink/50 mt-1">{s.label}</div>
            </Card>
          )
        })}
      </div>
      <Card className="p-6">
        <h2 className="font-display font-bold text-ink mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Manage Videos', desc: 'Upload / edit hero videos', tab: 'content' },
            { label: 'Approve Students', desc: 'Cash payment approvals', tab: 'students' },
            { label: 'Create Coupon', desc: 'Discount codes', tab: 'coupons' },
            { label: 'Add Faculty', desc: 'Crew & faculty accounts', tab: 'faculty' },
            { label: 'View Finance', desc: 'Revenue & orders', tab: 'finance' },
            { label: 'Site Config', desc: 'Fees & settings', tab: 'config' },
          ].map(item => (
            <div key={item.label} className="bg-dark-surface border border-dark-border rounded-xl p-4">
              <p className="font-display font-semibold text-ink text-sm">{item.label}</p>
              <p className="font-body text-xs text-ink/50 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Content / Videos ────────────────────────────────────────────────────────
function ContentTab() {
  const [videos, setVideos] = useState<SiteVideo[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [newTitle, setNewTitle] = useState('')
  const [newDuration, setNewDuration] = useState(8)

  useEffect(() => {
    getAllHomeVideos().then(setVideos)
  }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setProgress(0)
    try {
      const { url, storageRef } = await uploadVideo(file, p => setProgress(p))
      await addHomeVideo({
        url,
        storageRef,
        title: newTitle || file.name,
        durationSec: newDuration,
        order: videos.length,
        active: true,
      })
      toast.success('Video uploaded!')
      setNewTitle('')
      setNewDuration(8)
      getAllHomeVideos().then(setVideos)
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function toggleActive(v: SiteVideo) {
    await updateHomeVideo(v.id, { active: !v.active })
    setVideos(vs => vs.map(x => x.id === v.id ? { ...x, active: !x.active } : x))
  }

  async function handleDelete(v: SiteVideo) {
    if (!confirm(`Delete "${v.title}"?`)) return
    await deleteHomeVideo(v.id)
    if (v.storageRef) await deleteStorageFile(v.storageRef).catch(() => {})
    setVideos(vs => vs.filter(x => x.id !== v.id))
    toast.success('Deleted')
  }

  async function updateDuration(v: SiteVideo, sec: number) {
    await updateHomeVideo(v.id, { durationSec: sec })
    setVideos(vs => vs.map(x => x.id === v.id ? { ...x, durationSec: sec } : x))
    toast.success('Duration updated')
  }

  return (
    <div className="space-y-6">
      {/* Upload form */}
      <Card className="p-6">
        <h2 className="font-display font-bold text-ink mb-4 flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary-dark" /> Upload Hero Video
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Video title (optional)"
            className="sm:col-span-2 bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60" />
          <div className="flex items-center gap-2">
            <label className="font-body text-xs text-ink/60 whitespace-nowrap">Duration (sec)</label>
            <input type="number" min={3} max={60} value={newDuration} onChange={e => setNewDuration(Number(e.target.value))}
              className="w-20 bg-dark-surface border border-dark-border rounded-xl px-3 py-2.5 text-ink font-body text-sm focus:outline-none focus:border-primary/60" />
          </div>
        </div>
        <label className={`flex items-center justify-center gap-2 border-2 border-dashed border-dark-border rounded-xl p-8 cursor-pointer hover:border-primary/40 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload className="h-5 w-5 text-ink/40" />
          <span className="font-body text-sm text-ink/60">{uploading ? `Uploading ${progress.toFixed(0)}%…` : 'Click to select a video file (MP4, WebM)'}</span>
          <input type="file" accept="video/*" onChange={handleUpload} className="hidden" />
        </label>
        {uploading && (
          <div className="mt-3 h-2 bg-dark-border rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </Card>

      {/* Video list */}
      <div>
        <h2 className="font-display font-bold text-ink mb-4">Uploaded Videos ({videos.length})</h2>
        {videos.length === 0
          ? <p className="font-body text-sm text-ink/40">No videos uploaded yet.</p>
          : (
            <div className="space-y-3">
              {videos.map(v => (
                <Card key={v.id} className="p-4 flex items-center gap-4">
                  <video src={v.url} className="h-14 w-24 rounded-lg object-cover bg-black" muted />
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-ink truncate">{v.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-body text-xs text-ink/50">Duration:</span>
                      <input type="number" min={3} max={60} defaultValue={v.durationSec}
                        onBlur={e => updateDuration(v, Number(e.target.value))}
                        className="w-16 bg-dark-surface border border-dark-border rounded-lg px-2 py-1 text-ink font-body text-xs focus:outline-none focus:border-primary/60" />
                      <span className="font-body text-xs text-ink/40">sec</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all ${
                        v.active ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-dark-surface text-ink/50 border border-dark-border'
                      }`}>
                      {v.active ? 'Active' : 'Hidden'}
                    </button>
                    <button onClick={() => handleDelete(v)} className="text-red-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}

// ─── Students ────────────────────────────────────────────────────────────────
function StudentsTab() {
  const [pending, setPending] = useState<UserProfile[]>([])
  const [all, setAll] = useState<UserProfile[]>([])
  const [viewMode, setViewMode] = useState<'pending' | 'all'>('pending')
  const [approvingId, setApprovingId] = useState<string | null>(null)

  useEffect(() => {
    getPendingApprovalUsers().then(setPending)
    getAllUsers().then(setAll)
  }, [])

  async function handleApprove(uid: string) {
    setApprovingId(uid)
    try {
      await approveUserRegistration(uid, 12)
      setPending(p => p.filter(u => u.uid !== uid))
      toast.success('Student approved!')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setApprovingId(null)
    }
  }

  const displayList = viewMode === 'pending' ? pending : all

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        {(['pending', 'all'] as const).map(m => (
          <button key={m} onClick={() => setViewMode(m)}
            className={`px-4 py-2 rounded-xl font-body text-sm font-medium transition-all ${
              viewMode === m ? 'bg-primary text-ink' : 'text-ink/60 hover:text-ink bg-dark-surface border border-dark-border'
            }`}>
            {m === 'pending' ? `Pending Approval (${pending.length})` : `All Students (${all.length})`}
          </button>
        ))}
      </div>

      {displayList.length === 0 ? (
        <p className="font-body text-sm text-ink/40">{viewMode === 'pending' ? 'No pending approvals.' : 'No students yet.'}</p>
      ) : (
        <div className="space-y-3">
          {displayList.map(u => (
            <Card key={u.uid} className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="font-display font-bold text-primary-dark">{u.displayName?.charAt(0) || '?'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-ink">{u.displayName || 'Unnamed'}</p>
                <p className="font-body text-xs text-ink/50">{u.email || u.phone || '—'}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={u.registrationStatus || 'incomplete'} />
                {u.registrationStatus === 'pending_approval' && (
                  <Button size="sm" onClick={() => handleApprove(u.uid)} loading={approvingId === u.uid}>
                    <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { v: 'success' | 'warning' | 'outline' | 'primary'; label: string }> = {
    active: { v: 'success', label: 'Active' },
    pending_approval: { v: 'warning', label: 'Pending' },
    pending_payment: { v: 'outline', label: 'Unpaid' },
    paused: { v: 'primary', label: 'Paused' },
    expired: { v: 'outline', label: 'Expired' },
    incomplete: { v: 'outline', label: 'Incomplete' },
  }
  const cfg = map[status] || { v: 'outline' as const, label: status }
  return <Badge variant={cfg.v} className="text-[10px]">{cfg.label}</Badge>
}

// ─── Coupons ─────────────────────────────────────────────────────────────────
function CouponsTab({ adminUid }: { adminUid: string }) {
  const [form, setForm] = useState({
    code: '',
    type: 'flat' as 'flat' | 'percent',
    value: '',
    maxDiscount: '',
    appliesTo: 'all' as 'all' | 'all_events' | 'all_classes' | 'specific_event' | 'specific_class',
    targetId: '',
    usagePerUser: '1',
  })
  const [saving, setSaving] = useState(false)

  async function handleCreate() {
    if (!form.code || !form.value) { toast.error('Code and value required'); return }
    setSaving(true)
    try {
      await createCoupon({
        code: form.code.toUpperCase(),
        type: form.type,
        value: Number(form.value),
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        appliesTo: form.appliesTo,
        targetId: form.targetId || undefined,
        usagePerUser: Number(form.usagePerUser) || 1,
        usedBy: {},
        active: true,
        createdBy: adminUid,
      } as any)
      toast.success('Coupon created!')
      setForm({ code: '', type: 'flat', value: '', maxDiscount: '', appliesTo: 'all', targetId: '', usagePerUser: '1' })
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-6 max-w-xl">
      <h2 className="font-display font-bold text-ink mb-5 flex items-center gap-2">
        <Tag className="h-5 w-5 text-primary-dark" /> Create Coupon
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-xs text-ink/60 mb-1.5">Coupon Code</label>
            <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SAVE20"
              className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60 tracking-widest" />
          </div>
          <div>
            <label className="block font-body text-xs text-ink/60 mb-1.5">Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}
              className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink font-body text-sm focus:outline-none focus:border-primary/60">
              <option value="flat">Flat (₹)</option>
              <option value="percent">Percent (%)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-xs text-ink/60 mb-1.5">Value ({form.type === 'flat' ? '₹' : '%'})</label>
            <input type="number" min={0} value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder={form.type === 'flat' ? '500' : '20'}
              className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60" />
          </div>
          {form.type === 'percent' && (
            <div>
              <label className="block font-body text-xs text-ink/60 mb-1.5">Max Discount (₹)</label>
              <input type="number" min={0} value={form.maxDiscount} onChange={e => setForm(f => ({ ...f, maxDiscount: e.target.value }))} placeholder="1000 (optional)"
                className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-xs text-ink/60 mb-1.5">Applies To</label>
            <select value={form.appliesTo} onChange={e => setForm(f => ({ ...f, appliesTo: e.target.value as any, targetId: '' }))}
              className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink font-body text-sm focus:outline-none focus:border-primary/60">
              <option value="all">All</option>
              <option value="all_events">All Events</option>
              <option value="all_classes">All Classes</option>
              <option value="specific_event">Specific Event</option>
              <option value="specific_class">Specific Class</option>
            </select>
          </div>
          <div>
            <label className="block font-body text-xs text-ink/60 mb-1.5">Usage per user</label>
            <input type="number" min={1} value={form.usagePerUser} onChange={e => setForm(f => ({ ...f, usagePerUser: e.target.value }))}
              className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink font-body text-sm focus:outline-none focus:border-primary/60" />
          </div>
        </div>

        {(form.appliesTo === 'specific_event' || form.appliesTo === 'specific_class') && (
          <div>
            <label className="block font-body text-xs text-ink/60 mb-1.5">Target ID</label>
            <input value={form.targetId} onChange={e => setForm(f => ({ ...f, targetId: e.target.value }))} placeholder="Event or class ID"
              className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60" />
          </div>
        )}

        {form.type === 'percent' && form.maxDiscount && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
            <p className="font-body text-xs text-ink/70">
              A {form.value}% coupon on ₹20,000 = ₹{(20000 * Number(form.value) / 100).toLocaleString()}, but capped at <strong>₹{Number(form.maxDiscount).toLocaleString()}</strong> discount.
            </p>
          </div>
        )}

        <Button onClick={handleCreate} loading={saving} className="w-full">
          <Plus className="h-4 w-4 mr-1" /> Create Coupon
        </Button>
      </div>
    </Card>
  )
}

// ─── Faculty / Crew ───────────────────────────────────────────────────────────
function FacultyTab() {
  const [faculty, setFaculty] = useState<FacultyProfile[]>([])
  const [form, setForm] = useState({ name: '', email: '', phone: '', userType: 'faculty' as 'faculty' | 'crew' | 'admin' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getFacultyProfiles().then(setFaculty)
  }, [])

  async function handleCreate() {
    if (!form.name || (!form.email && !form.phone)) {
      toast.error('Name and email or phone required')
      return
    }
    setSaving(true)
    try {
      await createFacultyProfile({
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        role: form.userType,
        assignedClasses: [],
        assignedEvents: [],
        active: true,
      } as any)
      toast.success('Faculty / crew member created!')
      setForm({ name: '', email: '', phone: '', userType: 'faculty' })
      getFacultyProfiles().then(setFaculty)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6">
        <h2 className="font-display font-bold text-ink mb-5 flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary-dark" /> Add Faculty / Crew
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block font-body text-xs text-ink/60 mb-1.5">Full Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Hitesh Kumar"
              className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-xs text-ink/60 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="hitesh@studio.com"
                className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60" />
            </div>
            <div>
              <label className="block font-body text-xs text-ink/60 mb-1.5">Mobile</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98xxx xxxxx"
                className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60" />
            </div>
          </div>
          <div>
            <label className="block font-body text-xs text-ink/60 mb-1.5">Role</label>
            <select value={form.userType} onChange={e => setForm(f => ({ ...f, userType: e.target.value as any }))}
              className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink font-body text-sm focus:outline-none focus:border-primary/60">
              <option value="faculty">Faculty (Instructor)</option>
              <option value="crew">Crew (Support)</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="bg-dark-surface border border-dark-border rounded-xl p-3">
            <p className="font-body text-xs text-ink/50">
              The person must sign in using the same email or mobile number. They will automatically get {form.userType} panel access.
            </p>
          </div>
          <Button onClick={handleCreate} loading={saving} className="w-full">Create Account</Button>
        </div>
      </Card>

      <div>
        <h2 className="font-display font-bold text-ink mb-4">Current Faculty & Crew ({faculty.length})</h2>
        {faculty.length === 0
          ? <p className="font-body text-sm text-ink/40">No faculty or crew added yet.</p>
          : (
            <div className="space-y-3">
              {faculty.map(f => (
                <Card key={f.uid || f.name} className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-bold text-primary-dark">{f.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-ink">{f.name}</p>
                    <p className="font-body text-xs text-ink/50">{f.email || f.phone || '—'}</p>
                  </div>
                  <Badge variant={f.role === 'admin' ? 'primary' : f.role === 'faculty' ? 'success' : 'warning'} className="text-[10px] capitalize">
                    {f.role}
                  </Badge>
                </Card>
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}

// ─── Finance ─────────────────────────────────────────────────────────────────
function FinanceTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [approvingId, setApprovingId] = useState<string | null>(null)

  useEffect(() => {
    getPendingCashOrders().then(setOrders)
  }, [])

  async function handleConfirm(orderId: string) {
    setApprovingId(orderId)
    try {
      await confirmOrder(orderId)
      setOrders(o => o.filter(x => x.id !== orderId))
      toast.success('Order confirmed!')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setApprovingId(null)
    }
  }

  return (
    <div>
      <h2 className="font-display font-bold text-ink mb-4">Pending Cash Payments</h2>
      {orders.length === 0
        ? <p className="font-body text-sm text-ink/40">No pending cash orders.</p>
        : (
          <div className="space-y-3">
            {orders.map(o => (
              <Card key={o.id} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-ink">{o.userName}</p>
                  <p className="font-body text-xs text-ink/50">{o.userEmail || o.userPhone || '—'}</p>
                  <p className="font-body text-xs text-ink/40 mt-1">{o.items.map(i => i.name).join(', ')}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-ink">₹{o.totalAmount.toLocaleString()}</p>
                  <Button size="sm" className="mt-2" onClick={() => handleConfirm(o.id!)} loading={approvingId === o.id}>
                    <CheckCircle className="h-3.5 w-3.5 mr-1" /> Confirm
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )
      }
    </div>
  )
}

// ─── Config ───────────────────────────────────────────────────────────────────
function ConfigTab() {
  const [config, setConfig] = useState<RegistrationConfig | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ amount: '', validityMonths: '', pauseAmount: '', pauseValidityMonths: '' })

  useEffect(() => {
    getRegistrationConfig().then(c => {
      if (c) {
        setConfig(c)
        setForm({
          amount: String(c.amount),
          validityMonths: String(c.validityMonths),
          pauseAmount: String(c.pauseAmount),
          pauseValidityMonths: String(c.pauseValidityMonths),
        })
      }
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await updateRegistrationConfig({
        amount: Number(form.amount),
        validityMonths: Number(form.validityMonths),
        pauseAmount: Number(form.pauseAmount),
        pauseValidityMonths: Number(form.pauseValidityMonths),
      })
      toast.success('Configuration saved!')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-6 max-w-lg">
      <h2 className="font-display font-bold text-ink mb-5 flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary-dark" /> Registration & Fee Settings
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-xs text-ink/60 mb-1.5">Registration Fee (₹)</label>
            <input type="number" min={0} value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink font-body text-sm focus:outline-none focus:border-primary/60" />
          </div>
          <div>
            <label className="block font-body text-xs text-ink/60 mb-1.5">Validity (months)</label>
            <input type="number" min={1} value={form.validityMonths} onChange={e => setForm(f => ({ ...f, validityMonths: e.target.value }))}
              className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink font-body text-sm focus:outline-none focus:border-primary/60" />
          </div>
        </div>
        <div className="border-t border-dark-border pt-4">
          <p className="font-body text-xs text-ink/60 mb-3">Pause Fee (students who pause classes for up to 2 months)</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-xs text-ink/60 mb-1.5">Pause Fee (₹)</label>
              <input type="number" min={0} value={form.pauseAmount} onChange={e => setForm(f => ({ ...f, pauseAmount: e.target.value }))}
                className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink font-body text-sm focus:outline-none focus:border-primary/60" />
            </div>
            <div>
              <label className="block font-body text-xs text-ink/60 mb-1.5">Pause Validity (months)</label>
              <input type="number" min={1} max={2} value={form.pauseValidityMonths} onChange={e => setForm(f => ({ ...f, pauseValidityMonths: e.target.value }))}
                className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink font-body text-sm focus:outline-none focus:border-primary/60" />
            </div>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="font-body text-xs text-amber-700">If a student doesn't pay the pause fee after 2 months, they must pay the full registration fee again.</p>
        </div>
        <Button onClick={handleSave} loading={saving} className="w-full">Save Settings</Button>
      </div>
    </Card>
  )
}
