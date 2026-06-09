import { Timestamp } from 'firebase/firestore'

export type UserRole = 'user' | 'faculty' | 'admin'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL: string
  role: UserRole
  phone?: string
  enrolledClasses: string[]
  bookings: string[]
  joinedAt: Timestamp
  updatedAt: Timestamp
}

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
  social?: {
    instagram?: string
    facebook?: string
  }
}

export interface Class {
  id: string
  name: string
  style: string
  instructorId: string
  instructorName: string
  day: string
  time: string
  duration: number
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
  capacity: number
  enrolled: number
  price: number
  description?: string
  isOnline: boolean
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Event {
  id: string
  title: string
  description: string
  date: Timestamp
  time: string
  venue: string
  price: number
  capacity: number
  enrolled: number
  type: 'workshop' | 'social' | 'performance' | 'competition'
  imageGradient?: string
  createdAt: Timestamp
}

export interface Booking {
  id: string
  userId: string
  userName: string
  userEmail: string
  classId?: string
  eventId?: string
  type: 'class' | 'event'
  status: 'confirmed' | 'pending' | 'cancelled'
  paymentStatus: 'paid' | 'pending' | 'free'
  paymentId?: string
  amount: number
  date: string
  createdAt: Timestamp
}

export interface Attendance {
  id: string
  userId: string
  userName: string
  classId: string
  facultyId: string
  date: string
  status: 'present' | 'absent' | 'late'
  feedback?: string
  markedAt: Timestamp
}

export interface Review {
  id: string
  userId: string
  userName: string
  userPhotoURL?: string
  rating: number
  text: string
  classId?: string
  instructorId?: string
  approved: boolean
  createdAt: Timestamp
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

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export interface ScheduleSlot {
  day: string
  time: string
  style: string
  instructor: string
  level: string
  spots: number
}
