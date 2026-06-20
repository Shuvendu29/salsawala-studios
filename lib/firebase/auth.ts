import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  User,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  linkWithCredential,
  EmailAuthProvider,
  PhoneAuthProvider,
} from 'firebase/auth'
import {
  doc, setDoc, getDoc, updateDoc, serverTimestamp,
  collection, query, where, getDocs,
} from 'firebase/firestore'
import { auth, db } from './config'
import { UserProfile, UserRole } from '../types'
import { clearMockSession, getMockSession } from '../mock-auth'
import { MOCK_MODE, store } from '../mock-data'

const googleProvider = new GoogleAuthProvider()

// ── Email/Password ────────────────────────────────────────────────────────────

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string,
  phone?: string
): Promise<User> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(user, { displayName })
  await createUserProfile(user, { displayName, phone, role: 'user' })
  return user
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const { user } = await signInWithEmailAndPassword(auth, email, password)
  return user
}

// ── Google ────────────────────────────────────────────────────────────────────

export async function loginWithGoogle(): Promise<User> {
  const { user } = await signInWithPopup(auth, googleProvider)
  const existing = await getUserProfile(user.uid)
  if (!existing) {
    await createUserProfile(user, { role: 'user' })
  } else {
    // merge email into linkedEmails if new
    const emails = existing.linkedEmails || []
    if (user.email && !emails.includes(user.email)) {
      await updateDoc(doc(db, 'users', user.uid), {
        linkedEmails: [...emails, user.email],
        updatedAt: serverTimestamp(),
      })
    }
  }
  return user
}

// ── Phone OTP ─────────────────────────────────────────────────────────────────

let recaptchaVerifier: RecaptchaVerifier | null = null

export function setupRecaptcha(containerId: string): RecaptchaVerifier {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear()
    recaptchaVerifier = null
  }
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {},
  })
  return recaptchaVerifier
}

export async function sendPhoneOTP(phone: string): Promise<ConfirmationResult> {
  const verifier = recaptchaVerifier || setupRecaptcha('recaptcha-container')
  const result = await signInWithPhoneNumber(auth, phone, verifier)
  return result
}

export async function verifyPhoneOTP(
  confirmation: ConfirmationResult,
  otp: string
): Promise<User> {
  const { user } = await confirmation.confirm(otp)
  const existing = await getUserProfile(user.uid)
  if (!existing) {
    await createUserProfile(user, { role: 'user', phone: user.phoneNumber || undefined })
  } else {
    const phones = existing.linkedPhones || []
    if (user.phoneNumber && !phones.includes(user.phoneNumber)) {
      await updateDoc(doc(db, 'users', user.uid), {
        linkedPhones: [...phones, user.phoneNumber],
        updatedAt: serverTimestamp(),
      })
    }
  }
  return user
}

// ── Lookup by phone/email across linked accounts ──────────────────────────────

export async function findUserByPhone(phone: string): Promise<UserProfile | null> {
  const q = query(collection(db, 'users'), where('linkedPhones', 'array-contains', phone))
  const snap = await getDocs(q)
  if (!snap.empty) return snap.docs[0].data() as UserProfile
  const q2 = query(collection(db, 'users'), where('phone', '==', phone))
  const snap2 = await getDocs(q2)
  return snap2.empty ? null : snap2.docs[0].data() as UserProfile
}

// ── Logout ────────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  if (getMockSession()) {
    clearMockSession()
    return
  }
  await signOut(auth)
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
}

// ── Profile helpers ───────────────────────────────────────────────────────────

export async function createUserProfile(
  user: User,
  extra: Partial<UserProfile & { displayName?: string; phone?: string }>
): Promise<void> {
  const userRef = doc(db, 'users', user.uid)
  const phone = user.phoneNumber || extra.phone || ''
  await setDoc(userRef, {
    uid: user.uid,
    displayName: user.displayName || extra.displayName || '',
    email: user.email || '',
    phone,
    profilePicture: user.photoURL || '',
    role: extra.role || 'user',
    registrationStatus: 'incomplete',
    linkedEmails: user.email ? [user.email] : [],
    linkedPhones: phone ? [phone] : [],
    profileComplete: false,
    enrolledClasses: [],
    bookings: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  if (MOCK_MODE) {
    const i = store.users.findIndex(u => u.uid === uid)
    if (i !== -1) store.users[i] = { ...store.users[i], ...data }
    return
  }
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() })
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (MOCK_MODE) return store.users.find(u => u.uid === uid) ?? null
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? (snap.data() as UserProfile) : null
}

export async function getUserRole(uid: string): Promise<UserRole> {
  const profile = await getUserProfile(uid)
  return profile?.role || 'user'
}
