import { Timestamp } from 'firebase/firestore'

// ── Roles & Auth ──────────────────────────────────────────────────────────────

export type UserRole = 'user' | 'faculty' | 'crew' | 'admin'
export type RegistrationStatus =
  | 'incomplete'        // profile not filled
  | 'pending_payment'   // filled, needs online payment
  | 'pending_approval'  // chose cash, waiting admin
  | 'active'            // paid & approved
  | 'paused'            // paused (pause fee paid)
  | 'expired'           // validity ended

export type PaymentMethod = 'online' | 'cash'
export type PaymentStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded'
export type CouponType = 'flat' | 'percent'
export type CouponAppliesTo = 'all' | 'specific_event' | 'all_events' | 'specific_class' | 'all_classes'
export type AttendanceStatus = 'present' | 'absent' | 'late'

// ── User ──────────────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string
  displayName: string
  email?: string
  phone?: string
  photoURL?: string
  dob?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not'
  profilePicture?: string
  yearsOfDancing?: number
  role: UserRole
  registrationStatus: RegistrationStatus
  registrationExpiry?: Timestamp
  pauseExpiry?: Timestamp
  linkedEmails: string[]
  linkedPhones: string[]
  profileComplete: boolean
  enrolledClasses: string[]
  bookings: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ── Site Content ──────────────────────────────────────────────────────────────

export interface SiteVideo {
  id: string
  url: string
  storageRef: string
  title: string
  durationSec: number
  order: number
  active: boolean
  uploadedAt: Timestamp
}

export interface HomeContent {
  videos: SiteVideo[]
  heroTitle: string
  heroHighlight: string
  heroSubtitle: string
  stats: { label: string; value: string }[]
  ctaPrimary: string
  ctaSecondary: string
}

export interface SiteInfo {
  studioName: string
  tagline: string
  address: string
  phone: string
  email: string
  hours: string
  instagram: string
  facebook: string
  youtube: string
  aboutText: string
  aboutMission: string
}

// ── Registration Config ───────────────────────────────────────────────────────

export interface RegistrationConfig {
  amount: number
  validityMonths: number
  pauseAmount: number
  pauseValidityMonths: number
  updatedAt: Timestamp
}

// ── Classes ───────────────────────────────────────────────────────────────────

export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

export interface DanceClass {
  id: string
  name: string
  description: string
  style: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
  days: WeekDay[]
  timeFrom: string
  timeTo: string
  maxDurationMonths: number
  pricePerMonth: number
  classesPerMonth: number
  assignedFaculty: string[]
  active: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ── Events ────────────────────────────────────────────────────────────────────

export interface StudioEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  price: number
  capacity: number
  enrolled: number
  type: 'workshop' | 'social' | 'performance' | 'competition'
  tag: string
  gradient: string
  assignedFaculty: string[]
  active: boolean
  createdAt: Timestamp
}

// ── Coupons ───────────────────────────────────────────────────────────────────

export interface Coupon {
  id: string
  code: string
  type: CouponType
  value: number
  maxDiscount?: number
  appliesTo: CouponAppliesTo
  targetId?: string
  usagePerUser: number
  totalUsageLimit?: number
  totalUsed: number
  usedBy: Record<string, number>
  active: boolean
  expiresAt?: Timestamp
  createdAt: Timestamp
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export interface CartItem {
  type: 'class' | 'event' | 'registration' | 'pause'
  id: string
  name: string
  pricePerUnit: number
  durationMonths?: number
  maxDurationMonths?: number
  quantity: number
  classesPerMonth?: number
}

// ── Orders ────────────────────────────────────────────────────────────────────

export interface Order {
  id: string
  userId: string
  userName: string
  userEmail?: string
  userPhone?: string
  items: CartItem[]
  subtotal: number
  discountAmount: number
  couponCode?: string
  totalAmount: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  razorpayOrderId?: string
  razorpayPaymentId?: string
  notes?: string
  createdAt: Timestamp
  confirmedAt?: Timestamp
}

// ── Class Enrollment ──────────────────────────────────────────────────────────

export interface ClassEnrollment {
  id: string
  userId: string
  classId: string
  className: string
  durationMonths: number
  startDate: Timestamp
  endDate: Timestamp
  status: 'active' | 'paused' | 'expired' | 'cancelled'
  orderId: string
  createdAt: Timestamp
}

// ── Event Registration ────────────────────────────────────────────────────────

export interface EventRegistration {
  id: string
  userId?: string
  guestPhone?: string
  eventId: string
  eventTitle: string
  name: string
  email?: string
  gender: string
  source: string
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  orderId?: string
  amount: number
  createdAt: Timestamp
}

// ── Faculty ───────────────────────────────────────────────────────────────────

export interface FacultyProfile {
  id: string
  uid?: string
  name: string
  email?: string
  phone?: string
  role: 'faculty' | 'crew' | 'admin'
  assignedClasses: string[]
  assignedEvents: string[]
  active: boolean
  createdAt: Timestamp
}

// ── Attendance ────────────────────────────────────────────────────────────────

export interface AttendanceRecord {
  id: string
  type: 'class' | 'event'
  targetId: string
  date: string
  markedBy: string
  students: Record<string, AttendanceStatus>
  notes?: string
  createdAt: Timestamp
}

// ── Legacy (for existing static data) ────────────────────────────────────────

export interface DanceStyle {
  id: string
  name: string
  description: string
  icon: string
  color: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
  origin: string
}

export interface Instructor {
  id: string
  name: string
  title: string
  bio: string
  styles: string[]
  experience: string
  photoGradient: string
  social?: { instagram?: string; youtube?: string; facebook?: string }
}

export interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  style: string
  duration: string
  avatarGradient: string
}
