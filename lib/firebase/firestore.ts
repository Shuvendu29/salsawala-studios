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

// ── Home Content / Videos ────────────────────────────────────────────────────

export async function getHomeContent(): Promise<HomeContent | null> {
  const snap = await getDoc(doc(db, 'siteContent', 'home'))
  return snap.exists() ? (snap.data() as HomeContent) : null
}

export async function updateHomeContent(data: Partial<HomeContent>): Promise<void> {
  await setDoc(doc(db, 'siteContent', 'home'), data, { merge: true })
}

export async function addHomeVideo(video: Omit<SiteVideo, 'id' | 'uploadedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'siteContent', 'home', 'videos'), {
    ...video,
    uploadedAt: serverTimestamp(),
  })
  return ref.id
}

export async function getHomeVideos(): Promise<SiteVideo[]> {
  const q = query(
    collection(db, 'siteContent', 'home', 'videos'),
    where('active', '==', true),
    orderBy('order', 'asc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as SiteVideo))
}

export async function getAllHomeVideos(): Promise<SiteVideo[]> {
  const q = query(collection(db, 'siteContent', 'home', 'videos'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as SiteVideo))
}

export async function updateHomeVideo(id: string, data: Partial<SiteVideo>): Promise<void> {
  await updateDoc(doc(db, 'siteContent', 'home', 'videos', id), data)
}

export async function deleteHomeVideo(id: string): Promise<void> {
  await deleteDoc(doc(db, 'siteContent', 'home', 'videos', id))
}

// ── Site Info ─────────────────────────────────────────────────────────────────

export async function getSiteInfo(): Promise<SiteInfo | null> {
  const snap = await getDoc(doc(db, 'siteContent', 'info'))
  return snap.exists() ? (snap.data() as SiteInfo) : null
}

export async function updateSiteInfo(data: Partial<SiteInfo>): Promise<void> {
  await setDoc(doc(db, 'siteContent', 'info'), data, { merge: true })
}

// ── Registration Config ───────────────────────────────────────────────────────

export async function getRegistrationConfig(): Promise<RegistrationConfig | null> {
  const snap = await getDoc(doc(db, 'config', 'registration'))
  return snap.exists() ? (snap.data() as RegistrationConfig) : null
}

export async function updateRegistrationConfig(data: Partial<RegistrationConfig>): Promise<void> {
  await setDoc(doc(db, 'config', 'registration'), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

// ── Classes ───────────────────────────────────────────────────────────────────

export async function getClasses(activeOnly = true): Promise<DanceClass[]> {
  const q = activeOnly
    ? query(collection(db, 'classes'), where('active', '==', true), orderBy('createdAt', 'desc'))
    : query(collection(db, 'classes'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as DanceClass))
}

export async function getClassById(id: string): Promise<DanceClass | null> {
  const snap = await getDoc(doc(db, 'classes', id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as DanceClass) : null
}

export async function createClass(data: Omit<DanceClass, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'classes'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateClass(id: string, data: Partial<DanceClass>): Promise<void> {
  await updateDoc(doc(db, 'classes', id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteClass(id: string): Promise<void> {
  await deleteDoc(doc(db, 'classes', id))
}

// ── Events ────────────────────────────────────────────────────────────────────

export async function getEvents(activeOnly = true): Promise<StudioEvent[]> {
  const q = activeOnly
    ? query(collection(db, 'events'), where('active', '==', true), orderBy('date', 'asc'))
    : query(collection(db, 'events'), orderBy('date', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as StudioEvent))
}

export async function getEventById(id: string): Promise<StudioEvent | null> {
  const snap = await getDoc(doc(db, 'events', id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as StudioEvent) : null
}

export async function createEvent(data: Omit<StudioEvent, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'events'), { ...data, createdAt: serverTimestamp() })
  return ref.id
}

export async function updateEvent(id: string, data: Partial<StudioEvent>): Promise<void> {
  await updateDoc(doc(db, 'events', id), data)
}

export async function deleteEvent(id: string): Promise<void> {
  await deleteDoc(doc(db, 'events', id))
}

// ── Coupons ───────────────────────────────────────────────────────────────────

export async function getCoupons(): Promise<Coupon[]> {
  const snap = await getDocs(collection(db, 'coupons'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Coupon))
}

export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const q = query(collection(db, 'coupons'), where('code', '==', code.toUpperCase()), where('active', '==', true))
  const snap = await getDocs(q)
  return snap.empty ? null : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as Coupon)
}

export async function createCoupon(data: Omit<Coupon, 'id' | 'createdAt' | 'totalUsed' | 'usedBy'>): Promise<string> {
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
  await updateDoc(doc(db, 'coupons', id), data)
}

export async function deleteCoupon(id: string): Promise<void> {
  await deleteDoc(doc(db, 'coupons', id))
}

export function applyCoupon(
  coupon: Coupon,
  subtotal: number,
  userId: string,
  cartItems: CartItem[]
): { discount: number; error?: string } {
  // Check usage per user
  const userUsed = coupon.usedBy?.[userId] || 0
  if (userUsed >= coupon.usagePerUser) {
    return { discount: 0, error: 'You have already used this coupon.' }
  }
  // Check total limit
  if (coupon.totalUsageLimit && coupon.totalUsed >= coupon.totalUsageLimit) {
    return { discount: 0, error: 'Coupon usage limit reached.' }
  }
  // Check expiry
  if (coupon.expiresAt && coupon.expiresAt.toDate() < new Date()) {
    return { discount: 0, error: 'This coupon has expired.' }
  }
  // Check applies-to filter
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
  const ref = await addDoc(collection(db, 'orders'), { ...data, createdAt: serverTimestamp() })
  return ref.id
}

export async function updateOrder(id: string, data: Partial<Order>): Promise<void> {
  await updateDoc(doc(db, 'orders', id), data)
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const q = query(collection(db, 'orders'), where('userId', '==', userId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order))
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order))
}

export async function getPendingCashOrders(): Promise<Order[]> {
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
  await updateDoc(doc(db, 'orders', orderId), {
    paymentStatus: 'confirmed',
    confirmedAt: serverTimestamp(),
  })
}

// ── Class Enrollments ─────────────────────────────────────────────────────────

export async function createEnrollment(data: Omit<ClassEnrollment, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'enrollments'), { ...data, createdAt: serverTimestamp() })
  return ref.id
}

export async function getUserEnrollments(userId: string): Promise<ClassEnrollment[]> {
  const q = query(collection(db, 'enrollments'), where('userId', '==', userId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClassEnrollment))
}

export async function getClassEnrollments(classId: string): Promise<ClassEnrollment[]> {
  const q = query(collection(db, 'enrollments'), where('classId', '==', classId), where('status', '==', 'active'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClassEnrollment))
}

// ── Event Registrations ───────────────────────────────────────────────────────

export async function createEventRegistration(data: Omit<EventRegistration, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'eventRegistrations'), { ...data, createdAt: serverTimestamp() })
  return ref.id
}

export async function getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
  const q = query(collection(db, 'eventRegistrations'), where('eventId', '==', eventId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as EventRegistration))
}

export async function getUserEventRegistrations(userId: string): Promise<EventRegistration[]> {
  const q = query(collection(db, 'eventRegistrations'), where('userId', '==', userId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as EventRegistration))
}

export async function getGuestEventRegistrations(phone: string): Promise<EventRegistration[]> {
  const q = query(collection(db, 'eventRegistrations'), where('guestPhone', '==', phone), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as EventRegistration))
}

// ── Faculty ───────────────────────────────────────────────────────────────────

export async function getFacultyProfiles(): Promise<FacultyProfile[]> {
  const q = query(collection(db, 'faculty'), where('active', '==', true))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as FacultyProfile))
}

export async function getFacultyByUID(uid: string): Promise<FacultyProfile | null> {
  const q = query(collection(db, 'faculty'), where('uid', '==', uid))
  const snap = await getDocs(q)
  return snap.empty ? null : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as FacultyProfile)
}

export async function createFacultyProfile(data: Omit<FacultyProfile, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'faculty'), { ...data, createdAt: serverTimestamp() })
  return ref.id
}

export async function updateFacultyProfile(id: string, data: Partial<FacultyProfile>): Promise<void> {
  await updateDoc(doc(db, 'faculty', id), data)
}

export async function assignFacultyToClass(classId: string, facultyId: string): Promise<void> {
  const batch = writeBatch(db)
  batch.update(doc(db, 'classes', classId), { assignedFaculty: /* arrayUnion */ [facultyId] })
  batch.update(doc(db, 'faculty', facultyId), { assignedClasses: [classId] })
  await batch.commit()
}

// ── Attendance ────────────────────────────────────────────────────────────────

export async function saveAttendance(data: Omit<AttendanceRecord, 'id' | 'createdAt'>): Promise<string> {
  // upsert by targetId + date
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
  const q = query(collection(db, 'attendance'), where('targetId', '==', targetId), where('date', '==', date))
  const snap = await getDocs(q)
  return snap.empty ? null : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as AttendanceRecord)
}

// ── Users (for admin) ─────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map(d => d.data() as UserProfile)
}

export async function getPendingApprovalUsers(): Promise<UserProfile[]> {
  const q = query(collection(db, 'users'), where('registrationStatus', '==', 'pending_approval'))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data() as UserProfile)
}

export async function approveUserRegistration(uid: string, validityMonths: number): Promise<void> {
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
  const q = query(
    collection(db, 'siteContent', 'home', 'videos'),
    where('active', '==', true),
    orderBy('order', 'asc')
  )
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as SiteVideo))))
}

export function subscribeToAllHomeVideos(cb: (videos: SiteVideo[]) => void) {
  const q = query(collection(db, 'siteContent', 'home', 'videos'), orderBy('order', 'asc'))
  return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as SiteVideo))))
}
