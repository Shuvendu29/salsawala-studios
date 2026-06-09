import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore'
import { db } from './config'
import { Class, Event, Booking, Attendance, Review } from '../types'

// ── Classes ──────────────────────────────────────────────────────────────────

export async function getClasses(filters?: QueryConstraint[]): Promise<Class[]> {
  const q = filters
    ? query(collection(db, 'classes'), ...filters)
    : query(collection(db, 'classes'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Class))
}

export async function getClassById(id: string): Promise<Class | null> {
  const snap = await getDoc(doc(db, 'classes', id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Class) : null
}

export async function createClass(data: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'classes'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateClass(id: string, data: Partial<Class>): Promise<void> {
  await updateDoc(doc(db, 'classes', id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteClass(id: string): Promise<void> {
  await deleteDoc(doc(db, 'classes', id))
}

// ── Events ───────────────────────────────────────────────────────────────────

export async function getEvents(upcomingOnly = false): Promise<Event[]> {
  const constraints: QueryConstraint[] = [orderBy('date', 'asc')]
  if (upcomingOnly) constraints.push(where('date', '>=', Timestamp.now()))
  const q = query(collection(db, 'events'), ...constraints)
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Event))
}

export async function createEvent(data: Omit<Event, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'events'), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

// ── Bookings ──────────────────────────────────────────────────────────────────

export async function createBooking(data: Omit<Booking, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'bookings'), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const q = query(
    collection(db, 'bookings'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking))
}

export async function getClassBookings(classId: string): Promise<Booking[]> {
  const q = query(collection(db, 'bookings'), where('classId', '==', classId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking))
}

// ── Attendance ────────────────────────────────────────────────────────────────

export async function markAttendance(data: Omit<Attendance, 'id' | 'markedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'attendance'), {
    ...data,
    markedAt: serverTimestamp(),
  })
  return ref.id
}

export async function getClassAttendance(classId: string, date: string): Promise<Attendance[]> {
  const q = query(
    collection(db, 'attendance'),
    where('classId', '==', classId),
    where('date', '==', date)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Attendance))
}

export async function getUserAttendance(userId: string): Promise<Attendance[]> {
  const q = query(
    collection(db, 'attendance'),
    where('userId', '==', userId),
    orderBy('markedAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Attendance))
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export async function submitReview(data: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'reviews'), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getApprovedReviews(): Promise<Review[]> {
  const q = query(
    collection(db, 'reviews'),
    where('approved', '==', true),
    orderBy('createdAt', 'desc'),
    limit(20)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Review))
}

// ── Real-time subscriptions ───────────────────────────────────────────────────

export function subscribeToClasses(callback: (classes: Class[]) => void) {
  const q = query(collection(db, 'classes'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Class)))
  })
}

export function subscribeToUserBookings(userId: string, callback: (bookings: Booking[]) => void) {
  const q = query(
    collection(db, 'bookings'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking)))
  })
}
