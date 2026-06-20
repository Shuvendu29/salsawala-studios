import {
  collection, doc, addDoc, setDoc, updateDoc, deleteDoc,
  getDoc, getDocs, query, where, orderBy, limit,
  onSnapshot, serverTimestamp, Timestamp, writeBatch,
} from 'firebase/firestore'
import { db } from './config'
import {
  HomeContent, SiteInfo, RegistrationConfig, SiteVideo,
  DanceClass, StudioEvent, Coupon, Order, ClassEnrollment,
  EventRegistration, FacultyProfile, AttendanceRecord,
  CartItem, UserProfile,
} from '../types'
import { MOCK_MODE, store, genId } from '../mock-data'

// ── Home Content / Videos ────────────────────────────────────────────────────

export async function getHomeContent(): Promise<HomeContent | null> {
  if (MOCK_MODE) return null
  const snap = await getDoc(doc(db, 'siteContent', 'home'))
  return snap.exists() ? (snap.data() as HomeContent) : null
}

export async function updateHomeContent(data: Partial<HomeContent>): Promise<void> {
  if (MOCK_MODE) return
  await setDoc(doc(db, 'siteContent', 'home'), data, { merge: true })
}

export async function addHomeVideo(video: Omit<SiteVideo, 'id' | 'uploadedAt'>): Promise<string> {
  if (MOCK_MODE) {
    const v = { ...video, id: genId(), uploadedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } } as any
    store.videos.push(v)
    return v.id
  }
  const ref = await addDoc(collection(db, 'siteContent', 'home', 'videos'), {
    ...video,
    uploadedAt: serverTimestamp(),
  })
  return ref.id
}

export async function getHomeVideos(): Promise<SiteVideo[]> {
  if (MOCK_MODE) return store.videos.filter(v => v.active)
  const q = query(
    collection(db, 'siteContent', 'home', 'videos'),
    where('active', '==', true),
    orderBy('order', 'asc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as SiteVideo))
}

export async function getAllHomeVideos(): Promise<SiteVideo[]> {
  if (MOCK_MODE) return [...store.videos]
  const q = query(collection(db, 'siteContent', 'home', 'videos'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as SiteVideo))
}

export async function updateHomeVideo(id: string, data: Partial<SiteVideo>): Promise<void> {
  if (MOCK_MODE) {
    const i = store.videos.findIndex(v => v.id === id)
    if (i !== -1) store.videos[i] = { ...store.videos[i], ...data }
    return
  }
  await updateDoc(doc(db, 'siteContent', 'home', 'videos', id), data)
}

export async function deleteHomeVideo(id: string): Promise<void> {
  if (MOCK_MODE) {
    store.videos = store.videos.filter(v => v.id !== id)
    return
  }
  await deleteDoc(doc(db, 'siteContent', 'home', 'videos', id))
}

// ── Site Info ─────────────────────────────────────────────────────────────────

export async function getSiteInfo(): Promise<SiteInfo | null> {
  if (MOCK_MODE) return null
  const snap = await getDoc(doc(db, 'siteContent', 'info'))
  return snap.exists() ? (snap.data() as SiteInfo) : null
}

export async function updateSiteInfo(data: Partial<SiteInfo>): Promise<void> {
  if (MOCK_MODE) return
  await setDoc(doc(db, 'siteContent', 'info'), data, { merge: true })
}

// ── Registration Config ───────────────────────────────────────────────────────

export async function getRegistrationConfig(): Promise<RegistrationConfig | null> {
  if (MOCK_MODE) return { ...store.config }
  const snap = await getDoc(doc(db, 'config', 'registration'))
  return snap.exists() ? (snap.data() as RegistrationConfig) : null
}

export async function updateRegistrationConfig(data: Partial<RegistrationConfig>): Promise<void> {
  if (MOCK_MODE) {
    store.config = { ...store.config, ...data }
    return
  }
  await setDoc(doc(db, 'config', 'registration'), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

// ── Classes ───────────────────────────────────────────────────────────────────

export async function getClasses(activeOnly = true): Promise<DanceClass[]> {
  if (MOCK_MODE) return activeOnly ? store.classes.filter(c => c.active) : [...store.classes]
  const q = activeOnly
    ? query(collection(db, 'classes'), where('active', '==', true), orderBy('createdAt', 'desc'))
    : query(collection(db, 'classes'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as DanceClass))
}

export async function getClassById(id: string): Promise<DanceClass | null> {
  if (MOCK_MODE) return store.classes.find(c => c.id === id) ?? null
  const snap = await getDoc(doc(db, 'classes', id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as DanceClass) : null
}

export async function createClass(data: Omit<DanceClass, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  if (MOCK_MODE) {
    const id = genId()
    const now = { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
    store.classes.unshift({ ...data, id, createdAt: now as any, updatedAt: now as any })
    return id
  }
  const ref = await addDoc(collection(db, 'classes'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateClass(id: string, data: Partial<DanceClass>): Promise<void> {
  if (MOCK_MODE) {
    const i = store.classes.findIndex(c => c.id === id)
    if (i !== -1) store.classes[i] = { ...store.classes[i], ...data }
    return
  }
  await updateDoc(doc(db, 'classes', id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteClass(id: string): Promise<void> {
  if (MOCK_MODE) {
    store.classes = store.classes.filter(c => c.id !== id)
    return
  }
  await deleteDoc(doc(db, 'classes', id))
}

// ── Events ────────────────────────────────────────────────────────────────────

export async function getEvents(activeOnly = true): Promise<StudioEvent[]> {
  if (MOCK_MODE) {
    const list = activeOnly ? store.events.filter(e => e.active) : [...store.events]
    return list.sort((a, b) => a.date.localeCompare(b.date))
  }
  const q = activeOnly
    ? query(collection(db, 'events'), where('active', '==', true), orderBy('date', 'asc'))
    : query(collection(db, 'events'), orderBy('date', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as StudioEvent))
}

export async function getEventById(id: string): Promise<StudioEvent | null> {
  if (MOCK_MODE) return store.events.find(e => e.id === id) ?? null
  const snap = await getDoc(doc(db, 'events', id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as StudioEvent) : null
}

export async function createEvent(data: Omit<StudioEvent, 'id' | 'createdAt'>): Promise<string> {
  if (MOCK_MODE) {
    const id = genId()
    store.events.push({ ...data, id, createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any })
    return id
  }
  const ref = await addDoc(collection(db, 'events'), { ...data, createdAt: serverTimestamp() })
  return ref.id
}

export async function updateEvent(id: string, data: Partial<StudioEvent>): Promise<void> {
  if (MOCK_MODE) {
    const i = store.events.findIndex(e => e.id === id)
    if (i !== -1) store.events[i] = { ...store.events[i], ...data }
    return
  }
  await updateDoc(doc(db, 'events', id), data)
}

export async function deleteEvent(id: string): Promise<void> {
  if (MOCK_MODE) {
    store.events = store.events.filter(e => e.id !== id)
    return
  }
  await deleteDoc(doc(db, 'events', id))
}

// ── Coupons ───────────────────────────────────────────────────────────────────

export async function getCoupons(): Promise<Coupon[]> {
  if (MOCK_MODE) return [...store.coupons]
  const snap = await getDocs(collection(db, 'coupons'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Coupon))
}

export async function getCouponByCode(code: string): Promise<Coupon | null> {
  if (MOCK_MODE) return store.coupons.find(c => c.code === code.toUpperCase() && c.active) ?? null
  const q = query(collection(db, 'coupons'), where('code', '==', code.toUpperCase()), where('active', '==', true))
  const snap = await getDocs(q)
  return snap.empty ? null : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as Coupon)
}

export async function createCoupon(data: Omit<Coupon, 'id' | 'createdAt' | 'totalUsed' | 'usedBy'>): Promise<string> {
  if (MOCK_MODE) {
    const id = genId()
    store.coupons.push({
      ...data,
      id,
      code: data.code.toUpperCase(),
      totalUsed: 0,
      usedBy: {},
      createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    })
    return id
  }
  const ref = await addDoc(collection(db, 'coupons'), {
    ...data,
    code: data.code.toUpperCase(),
    totalUsed: 0,
    usedBy: {},
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateCoupon(id: string, data: Partial<Coupon>): Promise<void> {
  if (MOCK_MODE) {
    const i = store.coupons.findIndex(c => c.id === id)
    if (i !== -1) store.coupons[i] = { ...store.coupons[i], ...data }
    return
  }
  await updateDoc(doc(db, 'coupons', id), data)
}

export async function deleteCoupon(id: string): Promise<void> {
  if (MOCK_MODE) {
    store.coupons = store.coupons.filter(c => c.id !== id)
    return
  }
  await deleteDoc(doc(db, 'coupons', id))
}

export function applyCoupon(
  coupon: Coupon,
  subtotal: number,
  userId: string,
  cartItems: CartItem[]
): { discount: number; error?: string } {
  const userUsed = coupon.usedBy?.[userId] || 0
  if (userUsed >= coupon.usagePerUser) {
    return { discount: 0, error: 'You have already used this coupon.' }
  }
  if (coupon.totalUsageLimit && coupon.totalUsed >= coupon.totalUsageLimit) {
    return { discount: 0, error: 'Coupon usage limit reached.' }
  }
  if (coupon.expiresAt && coupon.expiresAt.toDate() < new Date()) {
    return { discount: 0, error: 'This coupon has expired.' }
  }
  const applicable = cartItems.filter(item => {
    if (coupon.appliesTo === 'all') return true
    if (coupon.appliesTo === 'all_classes') return item.type === 'class'
    if (coupon.appliesTo === 'all_events') return item.type === 'event'
    if (coupon.appliesTo === 'specific_class') return item.type === 'class' && item.id === coupon.targetId
    if (coupon.appliesTo === 'specific_event') return item.type === 'event' && item.id === coupon.targetId
    return false
  })
  if (applicable.length === 0) {
    return { discount: 0, error: 'Coupon does not apply to items in your cart.' }
  }
  const applicableTotal = applicable.reduce((s, i) => s + i.pricePerUnit * (i.durationMonths || 1) * i.quantity, 0)
  let discount = coupon.type === 'flat'
    ? coupon.value
    : (applicableTotal * coupon.value) / 100
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
  return { discount: Math.round(discount) }
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function createOrder(data: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
  if (MOCK_MODE) {
    const id = genId()
    store.orders.unshift({ ...data, id, createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any })
    return id
  }
  const ref = await addDoc(collection(db, 'orders'), { ...data, createdAt: serverTimestamp() })
  return ref.id
}

export async function updateOrder(id: string, data: Partial<Order>): Promise<void> {
  if (MOCK_MODE) {
    const i = store.orders.findIndex(o => o.id === id)
    if (i !== -1) store.orders[i] = { ...store.orders[i], ...data }
    return
  }
  await updateDoc(doc(db, 'orders', id), data)
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  if (MOCK_MODE) return store.orders.filter(o => o.userId === userId)
  const q = query(collection(db, 'orders'), where('userId', '==', userId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order))
}

export async function getAllOrders(): Promise<Order[]> {
  if (MOCK_MODE) return [...store.orders]
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order))
}

export async function getPendingCashOrders(): Promise<Order[]> {
  if (MOCK_MODE) return store.orders.filter(o => o.paymentMethod === 'cash' && o.paymentStatus === 'pending')
  const q = query(
    collection(db, 'orders'),
    where('paymentMethod', '==', 'cash'),
    where('paymentStatus', '==', 'pending'),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order))
}

export async function confirmOrder(orderId: string): Promise<void> {
  if (MOCK_MODE) {
    await updateOrder(orderId, { paymentStatus: 'confirmed' })
    // Also approve the user if this is a registration order
    const order = store.orders.find(o => o.id === orderId)
    if (order && order.items.some(i => i.type === 'registration')) {
      const userIdx = store.users.findIndex(u => u.uid === order.userId)
      if (userIdx !== -1) {
        const expiry = new Date()
        expiry.setMonth(expiry.getMonth() + store.config.validityMonths)
        store.users[userIdx] = {
          ...store.users[userIdx],
          registrationStatus: 'active',
          registrationExpiry: { seconds: Math.floor(expiry.getTime() / 1000), nanoseconds: 0, toDate: () => expiry } as any,
        }
      }
    }
    return
  }
  await updateDoc(doc(db, 'orders', orderId), {
    paymentStatus: 'confirmed',
    confirmedAt: serverTimestamp(),
  })
}

// ── Class Enrollments ─────────────────────────────────────────────────────────

export async function createEnrollment(data: Omit<ClassEnrollment, 'id' | 'createdAt'>): Promise<string> {
  if (MOCK_MODE) {
    const id = genId()
    store.enrollments.unshift({ ...data, id, createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any })
    return id
  }
  const ref = await addDoc(collection(db, 'enrollments'), { ...data, createdAt: serverTimestamp() })
  return ref.id
}

export async function getUserEnrollments(userId: string): Promise<ClassEnrollment[]> {
  if (MOCK_MODE) return store.enrollments.filter(e => e.userId === userId)
  const q = query(collection(db, 'enrollments'), where('userId', '==', userId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClassEnrollment))
}

export async function getClassEnrollments(classId: string): Promise<ClassEnrollment[]> {
  if (MOCK_MODE) return store.enrollments.filter(e => e.classId === classId && e.status === 'active')
  const q = query(collection(db, 'enrollments'), where('classId', '==', classId), where('status', '==', 'active'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClassEnrollment))
}

// ── Event Registrations ───────────────────────────────────────────────────────

export async function createEventRegistration(data: Omit<EventRegistration, 'id' | 'createdAt'>): Promise<string> {
  if (MOCK_MODE) {
    const id = genId()
    store.eventRegistrations.push({ ...data, id, createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any })
    // Increment event enrolled count
    const evtIdx = store.events.findIndex(e => e.id === data.eventId)
    if (evtIdx !== -1) store.events[evtIdx] = { ...store.events[evtIdx], enrolled: (store.events[evtIdx].enrolled || 0) + 1 }
    return id
  }
  const ref = await addDoc(collection(db, 'eventRegistrations'), { ...data, createdAt: serverTimestamp() })
  return ref.id
}

export async function getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
  if (MOCK_MODE) return store.eventRegistrations.filter(r => r.eventId === eventId)
  const q = query(collection(db, 'eventRegistrations'), where('eventId', '==', eventId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as EventRegistration))
}

export async function getUserEventRegistrations(userId: string): Promise<EventRegistration[]> {
  if (MOCK_MODE) return store.eventRegistrations.filter(r => r.userId === userId)
  const q = query(collection(db, 'eventRegistrations'), where('userId', '==', userId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as EventRegistration))
}

export async function getGuestEventRegistrations(phone: string): Promise<EventRegistration[]> {
  if (MOCK_MODE) return store.eventRegistrations.filter(r => (r as any).guestPhone === phone)
  const q = query(collection(db, 'eventRegistrations'), where('guestPhone', '==', phone), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as EventRegistration))
}

// ── Faculty ───────────────────────────────────────────────────────────────────

export async function getFacultyProfiles(): Promise<FacultyProfile[]> {
  if (MOCK_MODE) return store.faculty.filter(f => f.active)
  const q = query(collection(db, 'faculty'), where('active', '==', true))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as FacultyProfile))
}

export async function getFacultyByUID(uid: string): Promise<FacultyProfile | null> {
  if (MOCK_MODE) return store.faculty.find(f => f.uid === uid) ?? null
  const q = query(collection(db, 'faculty'), where('uid', '==', uid))
  const snap = await getDocs(q)
  return snap.empty ? null : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as FacultyProfile)
}

export async function createFacultyProfile(data: Omit<FacultyProfile, 'id' | 'createdAt'>): Promise<string> {
  if (MOCK_MODE) {
    const id = genId()
    store.faculty.push({ ...data, id, createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any })
    return id
  }
  const ref = await addDoc(collection(db, 'faculty'), { ...data, createdAt: serverTimestamp() })
  return ref.id
}

export async function updateFacultyProfile(id: string, data: Partial<FacultyProfile>): Promise<void> {
  if (MOCK_MODE) {
    const i = store.faculty.findIndex(f => f.id === id)
    if (i !== -1) store.faculty[i] = { ...store.faculty[i], ...data }
    return
  }
  await updateDoc(doc(db, 'faculty', id), data)
}

export async function assignFacultyToClass(classId: string, facultyId: string): Promise<void> {
  if (MOCK_MODE) {
    const ci = store.classes.findIndex(c => c.id === classId)
    const fi = store.faculty.findIndex(f => f.id === facultyId)
    if (ci !== -1 && !store.classes[ci].assignedFaculty?.includes(facultyId)) {
      store.classes[ci] = { ...store.classes[ci], assignedFaculty: [...(store.classes[ci].assignedFaculty || []), facultyId] }
    }
    if (fi !== -1 && !store.faculty[fi].assignedClasses?.includes(classId)) {
      store.faculty[fi] = { ...store.faculty[fi], assignedClasses: [...(store.faculty[fi].assignedClasses || []), classId] }
    }
    return
  }
  const batch = writeBatch(db)
  batch.update(doc(db, 'classes', classId), { assignedFaculty: [facultyId] })
  batch.update(doc(db, 'faculty', facultyId), { assignedClasses: [classId] })
  await batch.commit()
}

// ── Attendance ────────────────────────────────────────────────────────────────

export async function saveAttendance(data: Omit<AttendanceRecord, 'id' | 'createdAt'>): Promise<string> {
  if (MOCK_MODE) {
    const existing = store.attendance.findIndex(a => a.targetId === data.targetId && a.date === data.date)
    if (existing !== -1) {
      store.attendance[existing] = { ...store.attendance[existing], students: data.students, notes: data.notes }
      return store.attendance[existing].id!
    }
    const id = genId()
    store.attendance.push({ ...data, id, createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any })
    return id
  }
  const q = query(
    collection(db, 'attendance'),
    where('targetId', '==', data.targetId),
    where('date', '==', data.date)
  )
  const snap = await getDocs(q)
  if (!snap.empty) {
    await updateDoc(snap.docs[0].ref, { students: data.students, notes: data.notes })
    return snap.docs[0].id
  }
  const ref = await addDoc(collection(db, 'attendance'), { ...data, createdAt: serverTimestamp() })
  return ref.id
}

export async function getAttendance(targetId: string, date: string): Promise<AttendanceRecord | null> {
  if (MOCK_MODE) return store.attendance.find(a => a.targetId === targetId && a.date === date) ?? null
  const q = query(collection(db, 'attendance'), where('targetId', '==', targetId), where('date', '==', date))
  const snap = await getDocs(q)
  return snap.empty ? null : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as AttendanceRecord)
}

// ── Users (for admin) ─────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<UserProfile[]> {
  if (MOCK_MODE) return [...store.users]
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map(d => d.data() as UserProfile)
}

export async function getPendingApprovalUsers(): Promise<UserProfile[]> {
  if (MOCK_MODE) return store.users.filter(u => u.registrationStatus === 'pending_approval')
  const q = query(collection(db, 'users'), where('registrationStatus', '==', 'pending_approval'))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data() as UserProfile)
}

export async function approveUserRegistration(uid: string, validityMonths: number): Promise<void> {
  if (MOCK_MODE) {
    const expiry = new Date()
    expiry.setMonth(expiry.getMonth() + validityMonths)
    const i = store.users.findIndex(u => u.uid === uid)
    if (i !== -1) {
      store.users[i] = {
        ...store.users[i],
        registrationStatus: 'active',
        registrationExpiry: { seconds: Math.floor(expiry.getTime() / 1000), nanoseconds: 0, toDate: () => expiry } as any,
        updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
      }
    }
    return
  }
  const expiry = new Date()
  expiry.setMonth(expiry.getMonth() + validityMonths)
  await updateDoc(doc(db, 'users', uid), {
    registrationStatus: 'active',
    registrationExpiry: Timestamp.fromDate(expiry),
    updatedAt: serverTimestamp(),
  })
}

// ── Subscriptions (real-time) ─────────────────────────────────────────────────

export function subscribeHomeVideos(cb: (videos: SiteVideo[]) => void) {
  if (MOCK_MODE) {
    cb([])
    return () => {}
  }
  const q = query(
    collection(db, 'siteContent', 'home', 'videos'),
    where('active', '==', true),
    orderBy('order', 'asc')
  )
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as SiteVideo))))
}

export function subscribeToAllHomeVideos(cb: (videos: SiteVideo[]) => void) {
  if (MOCK_MODE) {
    cb([])
    return () => {}
  }
  const q = query(collection(db, 'siteContent', 'home', 'videos'), orderBy('order', 'asc'))
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as SiteVideo))))
}
