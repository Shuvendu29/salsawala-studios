'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, BookOpen, Calendar, DollarSign, Plus, Settings,
  BarChart3, LogOut, Video, Tag, UserCog, CheckCircle,
  Clock, Trash2, Edit3, Upload, AlertCircle, Search,
  X, ExternalLink, CalendarOff,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/lib/hooks/useAuth'
import { logout, updateUserProfile } from '@/lib/firebase/auth'
import {
  getAllHomeVideos, addHomeVideo, updateHomeVideo, deleteHomeVideo,
  getRegistrationConfig, updateRegistrationConfig,
  getAllUsers, getPendingApprovalUsers, approveUserRegistration,
  getPendingCashOrders, confirmOrder,
  createCoupon, getFacultyProfiles, createFacultyProfile,
  getClasses, createClass, updateClass, deleteClass,
  getEvents, createEvent, updateEvent, deleteEvent,
  searchUsers, getDayOffs, createDayOff, deleteDayOff,
} from '@/lib/firebase/firestore'
import { uploadVideo, uploadImage, deleteStorageFile } from '@/lib/firebase/storage'
import {
  SiteVideo, RegistrationConfig, UserProfile, Coupon,
  FacultyProfile, Order, DanceClass, StudioEvent, WeekDay,
  DanceLevel, PriceTier, AssignedMember, GuestFaculty, DayOff,
} from '@/lib/types'
import toast from 'react-hot-toast'

type Tab = 'overview' | 'classes' | 'events' | 'content' | 'students' | 'coupons' | 'members' | 'dayoffs' | 'finance' | 'config'

const INPUT = 'w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60'
const LABEL = 'block font-body text-xs text-ink/60 mb-1.5'

export default function AdminDashboard() {
  const { user, profile, loading, role } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('overview')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && user && role !== 'admin') {
      router.push(role === 'faculty' || role === 'crew' || role === 'member' ? '/faculty' : '/dashboard')
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
    { id: 'overview',  label: 'Overview',        icon: BarChart3 },
    { id: 'classes',   label: 'Classes',          icon: BookOpen },
    { id: 'events',    label: 'Events',           icon: Calendar },
    { id: 'content',   label: 'Videos',           icon: Video },
    { id: 'students',  label: 'Students',         icon: Users },
    { id: 'coupons',   label: 'Coupons',          icon: Tag },
    { id: 'members',   label: 'Members',          icon: UserCog },
    { id: 'dayoffs',   label: 'Day Offs',         icon: CalendarOff },
    { id: 'finance',   label: 'Finance',          icon: DollarSign },
    { id: 'config',    label: 'Settings',         icon: Settings },
  ]

  return (
    <div className="pt-20 min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">Admin Panel</h1>
            <p className="font-body text-sm text-ink/50 mt-1">Salsawala Studios — {profile?.displayName}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-ink/50 hover:text-ink">
            <LogOut className="h-4 w-4 mr-1" /> Log Out
          </Button>
        </div>

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

        {tab === 'overview'  && <OverviewTab />}
        {tab === 'classes'   && <ClassesTab />}
        {tab === 'events'    && <EventsTab />}
        {tab === 'content'   && <ContentTab />}
        {tab === 'students'  && <StudentsTab />}
        {tab === 'coupons'   && <CouponsTab adminUid={user.uid} />}
        {tab === 'members'   && <MembersTab />}
        {tab === 'dayoffs'   && <DayOffsTab />}
        {tab === 'finance'   && <FinanceTab />}
        {tab === 'config'    && <ConfigTab />}
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
            { label: 'Manage Videos', desc: 'Upload / edit hero videos' },
            { label: 'Approve Students', desc: 'Cash payment approvals' },
            { label: 'Create Coupon', desc: 'Discount codes' },
            { label: 'Add Member', desc: 'Faculty & crew accounts' },
            { label: 'View Finance', desc: 'Revenue & orders' },
            { label: 'Day Offs', desc: 'Holidays & closures' },
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

// ─── Classes ─────────────────────────────────────────────────────────────────
const DANCE_LEVELS: DanceLevel[] = [
  'Beginner', 'Advance Beginner', 'Improver', 'Advance Improver',
  'Intermediate', 'Advance Intermediate', 'Advance', 'Open Level',
]
const DAYS_OF_WEEK: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const BLANK_CLASS = {
  name: '', description: '', style: '',
  level: 'Beginner' as DanceLevel,
  days: [] as WeekDay[],
  timeFrom: '07:00', timeTo: '08:00', imageUrl: '',
}

function ClassesTab() {
  const [classes, setClasses] = useState<DanceClass[]>([])
  const [allMembers, setAllMembers] = useState<FacultyProfile[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [form, setForm] = useState(BLANK_CLASS)
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([{ price: 1500, maxMonths: 3 }])
  const [assignedMembers, setAssignedMembers] = useState<AssignedMember[]>([])
  const [guestFaculty, setGuestFaculty] = useState<GuestFaculty[]>([])
  const [memberSearch, setMemberSearch] = useState('')
  const [memberDropOpen, setMemberDropOpen] = useState(false)
  const memberDropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getClasses(false).then(setClasses)
    getFacultyProfiles().then(setAllMembers)
  }, [])

  // Close member dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (memberDropRef.current && !memberDropRef.current.contains(e.target as Node)) {
        setMemberDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function toggleDay(d: WeekDay) {
    setForm(f => ({ ...f, days: f.days.includes(d) ? f.days.filter(x => x !== d) : [...f.days, d] }))
  }

  function addPriceTier() { setPriceTiers(t => [...t, { price: 1500, maxMonths: 1 }]) }
  function removePriceTier(i: number) { if (priceTiers.length > 1) setPriceTiers(t => t.filter((_, idx) => idx !== i)) }
  function updateTier(i: number, field: keyof PriceTier, val: number) {
    setPriceTiers(t => t.map((tier, idx) => idx === i ? { ...tier, [field]: val } : tier))
  }

  const filteredMembers = allMembers.filter(m => {
    const q = memberSearch.toLowerCase()
    return (
      !assignedMembers.some(am => am.uid === (m.uid || m.id)) &&
      (m.name.toLowerCase().includes(q) || m.email?.includes(q) || m.phone?.includes(q))
    )
  })

  function pickMember(m: FacultyProfile) {
    setAssignedMembers(prev => [...prev, {
      uid: m.uid || m.id,
      name: m.name,
      photoURL: m.photoURL,
      role: (m.role === 'admin' ? 'faculty' : m.role) as 'faculty' | 'crew',
    }])
    setMemberSearch('')
    setMemberDropOpen(false)
  }

  function removeMember(uid: string) { setAssignedMembers(prev => prev.filter(m => m.uid !== uid)) }
  function updateMemberRole(uid: string, role: 'faculty' | 'crew') {
    setAssignedMembers(prev => prev.map(m => m.uid === uid ? { ...m, role } : m))
  }

  function addGuest() { setGuestFaculty(prev => [...prev, { name: '', profileLink: '' }]) }
  function updateGuest(i: number, field: keyof GuestFaculty, val: string) {
    setGuestFaculty(prev => prev.map((g, idx) => idx === i ? { ...g, [field]: val } : g))
  }
  function removeGuest(i: number) { setGuestFaculty(prev => prev.filter((_, idx) => idx !== i)) }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await uploadImage(file, 'classes')
      setForm(f => ({ ...f, imageUrl: url }))
      toast.success('Image uploaded!')
    } catch { toast.error('Image upload failed') }
    finally { setUploading(false) }
  }

  function reset() {
    setForm(BLANK_CLASS)
    setPriceTiers([{ price: 1500, maxMonths: 3 }])
    setAssignedMembers([])
    setGuestFaculty([])
    setEditId(null)
  }

  async function handleSave() {
    if (!form.name || form.days.length === 0) { toast.error('Fill class name and select at least one day'); return }
    if (priceTiers.length === 0 || priceTiers.some(t => !t.price)) { toast.error('Add at least one valid price'); return }
    setSaving(true)
    try {
      const payload = {
        ...form,
        priceTiers,
        assignedMembers,
        guestFaculty: guestFaculty.filter(g => g.name.trim()),
        assignedFaculty: assignedMembers.map(m => m.uid),
        active: true,
      }
      if (editId) {
        await updateClass(editId, payload)
        toast.success('Class updated!')
      } else {
        await createClass(payload as any)
        toast.success('Class created!')
      }
      reset()
      getClasses(false).then(setClasses)
    } catch (e: any) { toast.error(e.message || 'Failed') }
    finally { setSaving(false) }
  }

  function startEdit(c: DanceClass) {
    setEditId(c.id)
    setForm({ name: c.name, description: c.description, style: c.style, level: c.level, days: c.days, timeFrom: c.timeFrom, timeTo: c.timeTo, imageUrl: c.imageUrl || '' })
    setPriceTiers(c.priceTiers?.length ? c.priceTiers : [{ price: c.pricePerMonth || 1500, maxMonths: c.maxDurationMonths || 3 }])
    setAssignedMembers(c.assignedMembers || [])
    setGuestFaculty(c.guestFaculty || [])
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return
    await deleteClass(id)
    setClasses(cs => cs.filter(c => c.id !== id))
    toast.success('Deleted')
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-display font-bold text-ink mb-5 flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary-dark" /> {editId ? 'Edit Class' : 'Create New Class'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input placeholder="Class name (e.g. Salsa Beginners)" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={INPUT} />
          <input placeholder="Style (e.g. Salsa, Bachata, Hip-Hop)" value={form.style}
            onChange={e => setForm(f => ({ ...f, style: e.target.value }))} className={INPUT} />
          <textarea placeholder="Description" value={form.description} rows={2}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className={`${INPUT} sm:col-span-2 resize-none`} />

          {/* Level dropdown — 8 levels */}
          <div>
            <label className={LABEL}>Level</label>
            <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value as DanceLevel }))} className={INPUT}>
              {DANCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>From</label>
              <input type="time" value={form.timeFrom} onChange={e => setForm(f => ({ ...f, timeFrom: e.target.value }))} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>To</label>
              <input type="time" value={form.timeTo} onChange={e => setForm(f => ({ ...f, timeTo: e.target.value }))} className={INPUT} />
            </div>
          </div>
        </div>

        {/* Faculty & Crew multi-select */}
        <div className="mt-4">
          <label className={LABEL}>Faculty & Crew</label>

          {/* Selected members */}
          {assignedMembers.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {assignedMembers.map(m => (
                <div key={m.uid} className="flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-xl px-3 py-1.5">
                  <span className="font-body text-sm font-medium text-ink">{m.name}</span>
                  <select value={m.role} onChange={e => updateMemberRole(m.uid, e.target.value as 'faculty' | 'crew')}
                    className="bg-transparent font-body text-xs text-ink/60 outline-none cursor-pointer">
                    <option value="faculty">Faculty</option>
                    <option value="crew">Crew</option>
                  </select>
                  <button onClick={() => removeMember(m.uid)} className="text-ink/40 hover:text-red-400">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Member search dropdown */}
          <div className="relative" ref={memberDropRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40 pointer-events-none" />
              <input
                value={memberSearch}
                onChange={e => { setMemberSearch(e.target.value); setMemberDropOpen(true) }}
                onFocus={() => setMemberDropOpen(true)}
                placeholder="Search members to assign…"
                className={`${INPUT} pl-9`}
              />
            </div>
            {memberDropOpen && (
              <div className="absolute z-20 w-full mt-1 bg-dark-card border border-dark-border rounded-xl shadow-lg overflow-hidden">
                {filteredMembers.length === 0 && !memberSearch && (
                  <p className="font-body text-xs text-ink/40 px-4 py-3">Type to search members</p>
                )}
                {filteredMembers.map(m => (
                  <button key={m.id} onMouseDown={() => pickMember(m)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-surface text-left transition-colors">
                    <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      {m.photoURL
                        ? <img src={m.photoURL} alt={m.name} className="h-full w-full rounded-full object-cover" />
                        : <span className="font-display font-bold text-primary-dark text-xs">{m.name.charAt(0)}</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-ink">{m.name}</p>
                      <p className="font-body text-xs text-ink/50">{m.role} · {m.email || m.phone || '—'}</p>
                    </div>
                  </button>
                ))}
                <button onMouseDown={addGuest}
                  className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gold/10 text-left border-t border-dark-border transition-colors">
                  <Plus className="h-4 w-4 text-gold-dark" />
                  <span className="font-body text-sm text-gold-dark font-medium">Add Guest Faculty</span>
                </button>
              </div>
            )}
          </div>

          {/* Guest faculty fields */}
          {guestFaculty.map((g, i) => (
            <div key={i} className="flex gap-2 mt-2">
              <input value={g.name} onChange={e => updateGuest(i, 'name', e.target.value)}
                placeholder="Guest name *" className={`${INPUT} flex-1`} />
              <input value={g.profileLink || ''} onChange={e => updateGuest(i, 'profileLink', e.target.value)}
                placeholder="Profile link (optional)" className={`${INPUT} flex-1`} />
              <button onClick={() => removeGuest(i)} className="p-2.5 text-red-400 hover:bg-red-400/10 rounded-xl">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="mt-4">
          <label className={LABEL}>Days</label>
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map(d => (
              <button key={d} onClick={() => toggleDay(d)}
                className={`px-3 py-1.5 rounded-lg font-body text-sm font-medium border transition-all ${
                  form.days.includes(d) ? 'bg-primary border-primary-dark text-ink' : 'border-dark-border text-ink/50 hover:text-ink'
                }`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Price Tiers */}
        <div className="mt-4">
          <label className={LABEL}>Price Options (students choose when enrolling)</label>
          <div className="space-y-2">
            {priceTiers.map((tier, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 flex-1">
                  <span className="font-body text-sm text-ink/50">₹</span>
                  <input type="number" min={0} value={tier.price}
                    onChange={e => updateTier(i, 'price', Number(e.target.value))}
                    className="w-24 bg-transparent font-body text-sm text-ink outline-none" />
                  <span className="font-body text-sm text-ink/40 mx-2">for</span>
                  <input type="number" min={1} max={24} value={tier.maxMonths}
                    onChange={e => updateTier(i, 'maxMonths', Number(e.target.value))}
                    className="w-12 bg-transparent font-body text-sm text-ink outline-none text-center" />
                  <span className="font-body text-sm text-ink/50">month{tier.maxMonths !== 1 ? 's' : ''}</span>
                </div>
                {priceTiers.length > 1 && (
                  <button onClick={() => removePriceTier(i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button onClick={addPriceTier}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-primary/40 text-primary-dark font-body text-sm hover:bg-primary/5 transition-colors">
              <Plus className="h-4 w-4" /> Add Another Price
            </button>
          </div>
        </div>

        {/* Photo */}
        <div className="mt-4">
          <label className={LABEL}>Class Photo (optional)</label>
          <div className="flex items-center gap-4">
            {form.imageUrl && <img src={form.imageUrl} alt="preview" className="h-16 w-24 object-cover rounded-lg border border-dark-border" />}
            <label className={`flex items-center gap-2 px-4 py-2.5 bg-dark-surface border border-dashed border-dark-border rounded-xl cursor-pointer hover:border-primary/40 transition-colors font-body text-sm text-ink/60 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading…' : form.imageUrl ? 'Change Photo' : 'Upload Photo'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            {form.imageUrl && <button onClick={() => setForm(f => ({ ...f, imageUrl: '' }))} className="text-xs text-red-400">Remove</button>}
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <Button onClick={handleSave} disabled={saving || uploading} className="flex-1">
            {saving ? 'Saving…' : editId ? 'Update Class' : 'Create Class'}
          </Button>
          {editId && <Button variant="ghost" onClick={reset}>Cancel</Button>}
        </div>
      </Card>

      {/* Classes list */}
      <Card className="p-6">
        <h2 className="font-display font-bold text-ink mb-4">All Classes ({classes.length})</h2>
        {classes.length === 0 ? (
          <p className="font-body text-sm text-ink/40 text-center py-8">No classes yet. Create one above.</p>
        ) : (
          <div className="space-y-3">
            {classes.map(c => {
              const lowestPrice = c.priceTiers?.length
                ? Math.min(...c.priceTiers.map(t => t.price))
                : c.pricePerMonth || 0
              const allFaculty = [
                ...(c.assignedMembers?.map(m => m.name) || []),
                ...(c.guestFaculty?.map(g => g.name) || []),
              ]
              return (
                <div key={c.id} className="flex items-start justify-between bg-dark-surface border border-dark-border rounded-xl p-4">
                  <div>
                    <p className="font-display font-semibold text-ink">{c.name}</p>
                    <p className="font-body text-xs text-ink/50 mt-0.5">{c.style && `${c.style} · `}{c.level} · {c.days.join(', ')} · {c.timeFrom}–{c.timeTo}</p>
                    <p className="font-body text-xs text-ink/50">From ₹{lowestPrice.toLocaleString()}</p>
                    {allFaculty.length > 0 && <p className="font-body text-xs text-primary-dark mt-0.5">{allFaculty.join(', ')}</p>}
                  </div>
                  <div className="flex gap-2 ml-4 shrink-0">
                    <button onClick={() => startEdit(c)} className="p-2 rounded-lg hover:bg-primary/20 text-ink/50 hover:text-ink transition-colors"><Edit3 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(c.id, c.name)} className="p-2 rounded-lg hover:bg-red-500/20 text-ink/50 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}

// ─── Events ──────────────────────────────────────────────────────────────────
function EventsTab() {
  const [events, setEvents] = useState<StudioEvent[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const blank = { title: '', description: '', date: '', time: '18:00', venue: '', price: 500, capacity: 50, type: 'workshop' as StudioEvent['type'], tag: '', imageUrl: '' }
  const [form, setForm] = useState(blank)
  const TYPES: StudioEvent['type'][] = ['workshop', 'social', 'performance', 'competition']
  const GRADIENTS = ['from-pink-500 to-rose-500', 'from-purple-500 to-indigo-500', 'from-amber-500 to-orange-500', 'from-emerald-500 to-teal-500']

  useEffect(() => { getEvents(false).then(setEvents) }, [])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try { const { url } = await uploadImage(file, 'events'); setForm(f => ({ ...f, imageUrl: url })); toast.success('Image uploaded!') }
    catch { toast.error('Image upload failed') } finally { setUploading(false) }
  }

  async function handleSave() {
    if (!form.title || !form.date || !form.venue) { toast.error('Fill title, date and venue'); return }
    setSaving(true)
    try {
      const gradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]
      if (editId) { await updateEvent(editId, { ...form }); toast.success('Event updated!') }
      else { await createEvent({ ...form, gradient, enrolled: 0, assignedFaculty: [], active: true }); toast.success('Event created!') }
      setForm(blank); setEditId(null); getEvents(false).then(setEvents)
    } catch (e: any) { toast.error(e.message || 'Failed') } finally { setSaving(false) }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return
    await deleteEvent(id); setEvents(es => es.filter(e => e.id !== id)); toast.success('Deleted')
  }

  function startEdit(e: StudioEvent) {
    setEditId(e.id)
    setForm({ title: e.title, description: e.description, date: e.date, time: e.time, venue: e.venue, price: e.price, capacity: e.capacity, type: e.type, tag: e.tag, imageUrl: e.imageUrl || '' })
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-display font-bold text-ink mb-5 flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary-dark" /> {editId ? 'Edit Event' : 'Create New Event'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input placeholder="Event title (e.g. Salsa Social Night)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={`${INPUT} sm:col-span-2`} />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className={`${INPUT} sm:col-span-2 resize-none`} />
          <div><label className={LABEL}>Date</label><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={INPUT} /></div>
          <div><label className={LABEL}>Time</label><input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} className={INPUT} /></div>
          <input placeholder="Venue" value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} className={INPUT} />
          <input placeholder="Tag (e.g. Beginners Welcome)" value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} className={INPUT} />
          <div><label className={LABEL}>Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as StudioEvent['type'] }))} className={INPUT}>
              {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={LABEL}>Price (₹)</label><input type="number" min={0} value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} className={INPUT} /></div>
            <div><label className={LABEL}>Capacity</label><input type="number" min={1} value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: Number(e.target.value) }))} className={INPUT} /></div>
          </div>
        </div>
        <div className="mt-4">
          <label className={LABEL}>Event Photo (optional)</label>
          <div className="flex items-center gap-4">
            {form.imageUrl && <img src={form.imageUrl} alt="preview" className="h-16 w-24 object-cover rounded-lg border border-dark-border" />}
            <label className={`flex items-center gap-2 px-4 py-2.5 bg-dark-surface border border-dashed border-dark-border rounded-xl cursor-pointer hover:border-primary/40 font-body text-sm text-ink/60 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <Upload className="h-4 w-4" />{uploading ? 'Uploading…' : form.imageUrl ? 'Change Photo' : 'Upload Photo'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            {form.imageUrl && <button onClick={() => setForm(f => ({ ...f, imageUrl: '' }))} className="text-xs text-red-400">Remove</button>}
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <Button onClick={handleSave} disabled={saving || uploading} className="flex-1">{saving ? 'Saving…' : editId ? 'Update Event' : 'Create Event'}</Button>
          {editId && <Button variant="ghost" onClick={() => { setEditId(null); setForm(blank) }}>Cancel</Button>}
        </div>
      </Card>
      <Card className="p-6">
        <h2 className="font-display font-bold text-ink mb-4">All Events ({events.length})</h2>
        {events.length === 0 ? <p className="font-body text-sm text-ink/40 text-center py-8">No events yet.</p> : (
          <div className="space-y-3">
            {events.map(e => (
              <div key={e.id} className="flex items-start justify-between bg-dark-surface border border-dark-border rounded-xl p-4">
                <div>
                  <p className="font-display font-semibold text-ink">{e.title}</p>
                  <p className="font-body text-xs text-ink/50 mt-0.5">{e.date} at {e.time} · {e.venue}</p>
                  <p className="font-body text-xs text-ink/50">₹{e.price} · {e.capacity} spots · {e.type}</p>
                </div>
                <div className="flex gap-2 ml-4 shrink-0">
                  <button onClick={() => startEdit(e)} className="p-2 rounded-lg hover:bg-primary/20 text-ink/50 hover:text-ink"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(e.id, e.title)} className="p-2 rounded-lg hover:bg-red-500/20 text-ink/50 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
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

  useEffect(() => { getAllHomeVideos().then(setVideos) }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true); setProgress(0)
    try {
      const { url, storageRef } = await uploadVideo(file, p => setProgress(p))
      await addHomeVideo({ url, storageRef, title: newTitle || file.name, durationSec: newDuration, order: videos.length, active: true })
      toast.success('Video uploaded!'); setNewTitle(''); setNewDuration(8); getAllHomeVideos().then(setVideos)
    } catch (err: any) { toast.error(err.message || 'Upload failed') } finally { setUploading(false) }
  }

  async function toggleActive(v: SiteVideo) {
    await updateHomeVideo(v.id, { active: !v.active })
    setVideos(vs => vs.map(x => x.id === v.id ? { ...x, active: !x.active } : x))
  }

  async function handleDelete(v: SiteVideo) {
    if (!confirm(`Delete "${v.title}"?`)) return
    await deleteHomeVideo(v.id)
    if (v.storageRef) await deleteStorageFile(v.storageRef).catch(() => {})
    setVideos(vs => vs.filter(x => x.id !== v.id)); toast.success('Deleted')
  }

  async function updateDuration(v: SiteVideo, sec: number) {
    await updateHomeVideo(v.id, { durationSec: sec })
    setVideos(vs => vs.map(x => x.id === v.id ? { ...x, durationSec: sec } : x)); toast.success('Duration updated')
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-display font-bold text-ink mb-4 flex items-center gap-2"><Upload className="h-5 w-5 text-primary-dark" /> Upload Hero Video</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Video title (optional)" className={`${INPUT} sm:col-span-2`} />
          <div className="flex items-center gap-2">
            <label className="font-body text-xs text-ink/60 whitespace-nowrap">Duration (sec)</label>
            <input type="number" min={3} max={60} value={newDuration} onChange={e => setNewDuration(Number(e.target.value))} className="w-20 bg-dark-surface border border-dark-border rounded-xl px-3 py-2.5 text-ink font-body text-sm focus:outline-none focus:border-primary/60" />
          </div>
        </div>
        <label className={`flex items-center justify-center gap-2 border-2 border-dashed border-dark-border rounded-xl p-8 cursor-pointer hover:border-primary/40 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload className="h-5 w-5 text-ink/40" />
          <span className="font-body text-sm text-ink/60">{uploading ? `Uploading ${progress.toFixed(0)}%…` : 'Click to select a video file (MP4, WebM)'}</span>
          <input type="file" accept="video/*" onChange={handleUpload} className="hidden" />
        </label>
        {uploading && <div className="mt-3 h-2 bg-dark-border rounded-full overflow-hidden"><div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div>}
      </Card>
      <div>
        <h2 className="font-display font-bold text-ink mb-4">Uploaded Videos ({videos.length})</h2>
        {videos.length === 0 ? <p className="font-body text-sm text-ink/40">No videos uploaded yet.</p> : (
          <div className="space-y-3">
            {videos.map(v => (
              <Card key={v.id} className="p-4 flex items-center gap-4">
                <video src={v.url} className="h-14 w-24 rounded-lg object-cover bg-black" muted />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-ink truncate">{v.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-body text-xs text-ink/50">Duration:</span>
                    <input type="number" min={3} max={60} defaultValue={v.durationSec} onBlur={e => updateDuration(v, Number(e.target.value))} className="w-16 bg-dark-surface border border-dark-border rounded-lg px-2 py-1 text-ink font-body text-xs focus:outline-none focus:border-primary/60" />
                    <span className="font-body text-xs text-ink/40">sec</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(v)} className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all ${v.active ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-dark-surface text-ink/50 border border-dark-border'}`}>{v.active ? 'Active' : 'Hidden'}</button>
                  <button onClick={() => handleDelete(v)} className="text-red-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Students ────────────────────────────────────────────────────────────────
function StudentsTab() {
  const [pending, setPending] = useState<UserProfile[]>([])
  const [all, setAll] = useState<UserProfile[]>([])
  const [viewMode, setViewMode] = useState<'pending' | 'all'>('pending')
  const [searchQ, setSearchQ] = useState('')
  const [approvingId, setApprovingId] = useState<string | null>(null)

  useEffect(() => { getPendingApprovalUsers().then(setPending); getAllUsers().then(setAll) }, [])

  async function handleApprove(uid: string) {
    setApprovingId(uid)
    try { await approveUserRegistration(uid, 12); setPending(p => p.filter(u => u.uid !== uid)); toast.success('Student approved!') }
    catch (err: any) { toast.error(err.message) } finally { setApprovingId(null) }
  }

  const baseList = viewMode === 'pending' ? pending : all
  const displayList = searchQ.trim()
    ? baseList.filter(u => {
        const q = searchQ.toLowerCase()
        return u.displayName?.toLowerCase().includes(q) || u.email?.includes(q) || u.phone?.includes(q)
      })
    : baseList

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2">
          {(['pending', 'all'] as const).map(m => (
            <button key={m} onClick={() => setViewMode(m)}
              className={`px-4 py-2 rounded-xl font-body text-sm font-medium transition-all ${viewMode === m ? 'bg-primary text-ink' : 'text-ink/60 hover:text-ink bg-dark-surface border border-dark-border'}`}>
              {m === 'pending' ? `Pending (${pending.length})` : `All Students (${all.length})`}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40 pointer-events-none" />
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search by name, email or phone…"
            className={`${INPUT} pl-9`} />
        </div>
      </div>

      {displayList.length === 0 ? (
        <p className="font-body text-sm text-ink/40">{viewMode === 'pending' ? 'No pending approvals.' : 'No students found.'}</p>
      ) : (
        <div className="space-y-3">
          {displayList.map(u => (
            <Card key={u.uid} className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {u.photoURL || u.profilePicture
                  ? <img src={u.photoURL || u.profilePicture} alt={u.displayName} className="h-full w-full object-cover" />
                  : <span className="font-display font-bold text-primary-dark">{u.displayName?.charAt(0) || '?'}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-ink">{u.displayName || 'Unnamed'}</p>
                <p className="font-body text-xs text-ink/50">{u.email || '—'} · {u.phone || '—'}</p>
                <p className="font-body text-xs text-ink/40 capitalize">{u.role}</p>
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
  const [form, setForm] = useState({ code: '', type: 'flat' as 'flat' | 'percent', value: '', maxDiscount: '', appliesTo: 'all' as any, targetId: '', usagePerUser: '1' })
  const [saving, setSaving] = useState(false)

  async function handleCreate() {
    if (!form.code || !form.value) { toast.error('Code and value required'); return }
    setSaving(true)
    try {
      await createCoupon({ code: form.code.toUpperCase(), type: form.type, value: Number(form.value), maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined, appliesTo: form.appliesTo, targetId: form.targetId || undefined, usagePerUser: Number(form.usagePerUser) || 1, usedBy: {}, active: true, createdBy: adminUid } as any)
      toast.success('Coupon created!')
      setForm({ code: '', type: 'flat', value: '', maxDiscount: '', appliesTo: 'all', targetId: '', usagePerUser: '1' })
    } catch (err: any) { toast.error(err.message) } finally { setSaving(false) }
  }

  return (
    <Card className="p-6 max-w-xl">
      <h2 className="font-display font-bold text-ink mb-5 flex items-center gap-2"><Tag className="h-5 w-5 text-primary-dark" /> Create Coupon</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LABEL}>Coupon Code</label><input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SAVE20" className={`${INPUT} tracking-widest`} /></div>
          <div><label className={LABEL}>Type</label><select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))} className={INPUT}><option value="flat">Flat (₹)</option><option value="percent">Percent (%)</option></select></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LABEL}>Value ({form.type === 'flat' ? '₹' : '%'})</label><input type="number" min={0} value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} className={INPUT} /></div>
          {form.type === 'percent' && <div><label className={LABEL}>Max Discount (₹)</label><input type="number" min={0} value={form.maxDiscount} onChange={e => setForm(f => ({ ...f, maxDiscount: e.target.value }))} placeholder="optional" className={INPUT} /></div>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LABEL}>Applies To</label><select value={form.appliesTo} onChange={e => setForm(f => ({ ...f, appliesTo: e.target.value as any, targetId: '' }))} className={INPUT}><option value="all">All</option><option value="all_events">All Events</option><option value="all_classes">All Classes</option><option value="specific_event">Specific Event</option><option value="specific_class">Specific Class</option></select></div>
          <div><label className={LABEL}>Usage per user</label><input type="number" min={1} value={form.usagePerUser} onChange={e => setForm(f => ({ ...f, usagePerUser: e.target.value }))} className={INPUT} /></div>
        </div>
        {(form.appliesTo === 'specific_event' || form.appliesTo === 'specific_class') && (
          <div><label className={LABEL}>Target ID</label><input value={form.targetId} onChange={e => setForm(f => ({ ...f, targetId: e.target.value }))} placeholder="Event or class ID" className={INPUT} /></div>
        )}
        <Button onClick={handleCreate} loading={saving} className="w-full"><Plus className="h-4 w-4 mr-1" /> Create Coupon</Button>
      </div>
    </Card>
  )
}

// ─── Members (was Faculty/Crew) ───────────────────────────────────────────────
function MembersTab() {
  const [members, setMembers] = useState<FacultyProfile[]>([])
  const [searchQ, setSearchQ] = useState('')
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [memberRole, setMemberRole] = useState<'faculty' | 'crew'>('faculty')
  const [saving, setSaving] = useState(false)
  const [searching, setSearching] = useState(false)

  useEffect(() => { getFacultyProfiles().then(setMembers) }, [])

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!searchQ.trim() || selectedUser) { setSearchResults([]); return }
      setSearching(true)
      try { setSearchResults(await searchUsers(searchQ)) }
      catch {} finally { setSearching(false) }
    }, 300)
    return () => clearTimeout(t)
  }, [searchQ, selectedUser])

  async function handleAdd() {
    if (!selectedUser) { toast.error('Select a user first'); return }
    setSaving(true)
    try {
      await createFacultyProfile({
        uid: selectedUser.uid,
        name: selectedUser.displayName,
        email: selectedUser.email,
        phone: selectedUser.phone,
        photoURL: selectedUser.photoURL || selectedUser.profilePicture,
        role: memberRole,
        assignedClasses: [],
        assignedEvents: [],
        active: true,
      } as any)
      await updateUserProfile(selectedUser.uid, { role: memberRole as any })
      toast.success(`${selectedUser.displayName} added as ${memberRole}!`)
      setSelectedUser(null); setSearchQ(''); setSearchResults([])
      getFacultyProfiles().then(setMembers)
    } catch (err: any) { toast.error(err.message) } finally { setSaving(false) }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6">
        <h2 className="font-display font-bold text-ink mb-5 flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary-dark" /> Add Member
        </h2>
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Search by name, phone or email</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40 pointer-events-none" />
              <input
                value={searchQ}
                onChange={e => { setSearchQ(e.target.value); setSelectedUser(null) }}
                placeholder="e.g. Priya or +91 98…"
                className={`${INPUT} pl-9`}
              />
            </div>
            {/* Search results */}
            {searchResults.length > 0 && !selectedUser && (
              <div className="mt-1 bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-lg">
                {searchResults.map(u => (
                  <button key={u.uid} onClick={() => { setSelectedUser(u); setSearchQ(u.displayName); setSearchResults([]) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-surface text-left transition-colors">
                    <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {u.photoURL || u.profilePicture
                        ? <img src={u.photoURL || u.profilePicture} alt={u.displayName} className="h-full w-full object-cover" />
                        : <span className="font-display font-bold text-primary-dark text-xs">{u.displayName?.charAt(0)}</span>
                      }
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-ink">{u.displayName}</p>
                      <p className="font-body text-xs text-ink/50">{u.email || u.phone}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {searching && <p className="text-xs text-ink/40 mt-1 font-body">Searching…</p>}
          </div>

          {/* Selected user preview */}
          {selectedUser && (
            <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-xl">
              <div className="h-12 w-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                {selectedUser.photoURL || selectedUser.profilePicture
                  ? <img src={selectedUser.photoURL || selectedUser.profilePicture} alt={selectedUser.displayName} className="h-full w-full object-cover" />
                  : <span className="font-display text-lg font-bold text-primary-dark">{selectedUser.displayName?.charAt(0)}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-ink">{selectedUser.displayName}</p>
                <p className="font-body text-xs text-ink/60">{selectedUser.email || selectedUser.phone || '—'}</p>
              </div>
              <button onClick={() => { setSelectedUser(null); setSearchQ('') }} className="text-ink/40 hover:text-red-400">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div>
            <label className={LABEL}>Assign Role</label>
            <select value={memberRole} onChange={e => setMemberRole(e.target.value as 'faculty' | 'crew')} className={INPUT}>
              <option value="faculty">Faculty (Instructor)</option>
              <option value="crew">Crew (Support Staff)</option>
            </select>
          </div>

          <div className="bg-dark-surface border border-dark-border rounded-xl p-3">
            <p className="font-body text-xs text-ink/50">
              Search for an existing user by name, email or phone. Their name and photo will auto-fill from their profile. Once added, their badge changes to Member and they get access to the Member panel.
            </p>
          </div>

          <Button onClick={handleAdd} loading={saving} disabled={!selectedUser} className="w-full">
            Add as Member
          </Button>
        </div>
      </Card>

      <div>
        <h2 className="font-display font-bold text-ink mb-4">Current Members ({members.length})</h2>
        {members.length === 0 ? (
          <p className="font-body text-sm text-ink/40">No members added yet.</p>
        ) : (
          <div className="space-y-3">
            {members.map(f => (
              <Card key={f.id} className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {f.photoURL
                    ? <img src={f.photoURL} alt={f.name} className="h-full w-full object-cover" />
                    : <span className="font-display font-bold text-primary-dark">{f.name.charAt(0)}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-ink">{f.name}</p>
                  <p className="font-body text-xs text-ink/50">{f.email || f.phone || '—'}</p>
                </div>
                <Badge variant={f.role === 'faculty' ? 'success' : 'warning'} className="text-[10px] capitalize">{f.role}</Badge>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Day Offs / Holidays ─────────────────────────────────────────────────────
const WEEKDAY_TO_JS: Record<WeekDay, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

function DayOffsTab() {
  const [dayOffs, setDayOffs] = useState<DayOff[]>([])
  const [classes, setClasses] = useState<DanceClass[]>([])
  const [form, setForm] = useState({ date: '', name: '', notes: '' })
  const [conflicts, setConflicts] = useState<DanceClass[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getDayOffs().then(setDayOffs)
    getClasses(true).then(setClasses)
  }, [])

  function checkConflicts(dateStr: string) {
    if (!dateStr) { setConflicts([]); return }
    const dow = new Date(dateStr + 'T00:00:00').getDay()
    setConflicts(classes.filter(c => c.days.some(d => WEEKDAY_TO_JS[d] === dow)))
  }

  async function handleAdd() {
    if (!form.date || !form.name.trim()) { toast.error('Date and name are required'); return }
    setSaving(true)
    try {
      await createDayOff({ date: form.date, name: form.name.trim(), notes: form.notes.trim() || undefined })
      toast.success('Day off added!')
      setForm({ date: '', name: '', notes: '' })
      setConflicts([])
      getDayOffs().then(setDayOffs)
    } catch (err: any) { toast.error(err.message) } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    await deleteDayOff(id)
    setDayOffs(list => list.filter(d => d.id !== id))
    toast.success('Removed')
  }

  const upcoming = dayOffs
    .filter(d => d.date >= new Date().toISOString().split('T')[0])
    .sort((a, b) => a.date.localeCompare(b.date))

  const past = dayOffs
    .filter(d => d.date < new Date().toISOString().split('T')[0])
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-display font-bold text-ink mb-5 flex items-center gap-2">
          <CalendarOff className="h-5 w-5 text-primary-dark" /> Add Day Off / Holiday
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Date</label>
            <input type="date" value={form.date}
              onChange={e => { setForm(f => ({ ...f, date: e.target.value })); checkConflicts(e.target.value) }}
              className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Holiday / Reason</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Diwali, Independence Day…" className={INPUT} />
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL}>Notes (optional)</label>
            <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Additional info for students…" className={INPUT} />
          </div>
        </div>

        {/* Conflict warning */}
        {conflicts.length > 0 && (
          <div className="mt-4 bg-amber-500/10 border border-amber-500/25 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-body text-sm font-medium text-amber-700">{conflicts.length} class{conflicts.length > 1 ? 'es' : ''} scheduled on this day:</p>
                <ul className="mt-1 space-y-0.5">
                  {conflicts.map(c => (
                    <li key={c.id} className="font-body text-xs text-amber-600">
                      {c.name} · {c.timeFrom}–{c.timeTo}
                    </li>
                  ))}
                </ul>
                <p className="font-body text-xs text-amber-500 mt-1">These classes will appear as cancelled on this date in the calendar. Contact students to arrange make-up sessions.</p>
              </div>
            </div>
          </div>
        )}

        <Button onClick={handleAdd} loading={saving} className="mt-4">
          <Plus className="h-4 w-4 mr-1" /> Add Day Off
        </Button>
      </Card>

      {/* Upcoming */}
      <Card className="p-6">
        <h2 className="font-display font-bold text-ink mb-4">Upcoming Day Offs ({upcoming.length})</h2>
        {upcoming.length === 0 ? (
          <p className="font-body text-sm text-ink/40">No upcoming day offs.</p>
        ) : (
          <div className="space-y-2">
            {upcoming.map(d => {
              const dow = new Date(d.date + 'T00:00:00').getDay()
              const affected = classes.filter(c => c.days.some(day => WEEKDAY_TO_JS[day] === dow))
              return (
                <div key={d.id} className="flex items-center justify-between bg-dark-surface border border-dark-border rounded-xl p-4">
                  <div>
                    <p className="font-display font-semibold text-ink">{d.name}</p>
                    <p className="font-body text-xs text-ink/50">
                      {new Date(d.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    {affected.length > 0 && (
                      <p className="font-body text-xs text-amber-600 mt-0.5">{affected.length} class{affected.length > 1 ? 'es' : ''} affected</p>
                    )}
                  </div>
                  <button onClick={() => handleDelete(d.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {past.length > 0 && (
        <Card className="p-6">
          <h2 className="font-display font-bold text-ink mb-4 text-ink/60">Past Day Offs ({past.length})</h2>
          <div className="space-y-2">
            {past.slice(0, 5).map(d => (
              <div key={d.id} className="flex items-center justify-between rounded-xl p-3 opacity-50">
                <div>
                  <p className="font-display font-medium text-ink text-sm">{d.name}</p>
                  <p className="font-body text-xs text-ink/50">{new Date(d.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <button onClick={() => handleDelete(d.id)} className="p-1.5 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

// ─── Finance ─────────────────────────────────────────────────────────────────
function FinanceTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [approvingId, setApprovingId] = useState<string | null>(null)

  useEffect(() => { getPendingCashOrders().then(setOrders) }, [])

  async function handleConfirm(orderId: string) {
    setApprovingId(orderId)
    try { await confirmOrder(orderId); setOrders(o => o.filter(x => x.id !== orderId)); toast.success('Order confirmed!') }
    catch (err: any) { toast.error(err.message) } finally { setApprovingId(null) }
  }

  return (
    <div>
      <h2 className="font-display font-bold text-ink mb-4">Pending Cash Payments</h2>
      {orders.length === 0 ? <p className="font-body text-sm text-ink/40">No pending cash orders.</p> : (
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
      )}
    </div>
  )
}

// ─── Config ───────────────────────────────────────────────────────────────────
function ConfigTab() {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ amount: '', validityMonths: '', pauseAmount: '', pauseValidityMonths: '' })

  useEffect(() => {
    getRegistrationConfig().then(c => {
      if (c) setForm({ amount: String(c.amount), validityMonths: String(c.validityMonths), pauseAmount: String(c.pauseAmount), pauseValidityMonths: String(c.pauseValidityMonths) })
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await updateRegistrationConfig({ amount: Number(form.amount), validityMonths: Number(form.validityMonths), pauseAmount: Number(form.pauseAmount), pauseValidityMonths: Number(form.pauseValidityMonths) })
      toast.success('Configuration saved!')
    } catch (err: any) { toast.error(err.message) } finally { setSaving(false) }
  }

  return (
    <Card className="p-6 max-w-lg">
      <h2 className="font-display font-bold text-ink mb-5 flex items-center gap-2"><Settings className="h-5 w-5 text-primary-dark" /> Registration & Fee Settings</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LABEL}>Registration Fee (₹)</label><input type="number" min={0} value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className={INPUT} /></div>
          <div><label className={LABEL}>Validity (months)</label><input type="number" min={1} value={form.validityMonths} onChange={e => setForm(f => ({ ...f, validityMonths: e.target.value }))} className={INPUT} /></div>
        </div>
        <div className="border-t border-dark-border pt-4">
          <p className="font-body text-xs text-ink/60 mb-3">Pause Fee</p>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={LABEL}>Pause Fee (₹)</label><input type="number" min={0} value={form.pauseAmount} onChange={e => setForm(f => ({ ...f, pauseAmount: e.target.value }))} className={INPUT} /></div>
            <div><label className={LABEL}>Pause Validity (months)</label><input type="number" min={1} max={2} value={form.pauseValidityMonths} onChange={e => setForm(f => ({ ...f, pauseValidityMonths: e.target.value }))} className={INPUT} /></div>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="font-body text-xs text-amber-700">Registration fee is optional if you've removed the payment step from onboarding.</p>
        </div>
        <Button onClick={handleSave} loading={saving} className="w-full">Save Settings</Button>
      </div>
    </Card>
  )
}
