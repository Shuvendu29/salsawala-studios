import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './config'
import { UserProfile, UserRole } from '../types'

const googleProvider = new GoogleAuthProvider()

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

export async function loginWithGoogle(): Promise<User> {
  const { user } = await signInWithPopup(auth, googleProvider)
  const profileExists = await checkUserProfileExists(user.uid)
  if (!profileExists) {
    await createUserProfile(user, { role: 'user' })
  }
  return user
}

export async function logout(): Promise<void> {
  await signOut(auth)
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
}

async function createUserProfile(
  user: User,
  extra: Partial<UserProfile>
): Promise<void> {
  const userRef = doc(db, 'users', user.uid)
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || extra.displayName || '',
    photoURL: user.photoURL || '',
    role: extra.role || 'user',
    phone: extra.phone || '',
    enrolledClasses: [],
    bookings: [],
    joinedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

async function checkUserProfileExists(uid: string): Promise<boolean> {
  const userRef = doc(db, 'users', uid)
  const snap = await getDoc(userRef)
  return snap.exists()
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', uid)
  const snap = await getDoc(userRef)
  return snap.exists() ? (snap.data() as UserProfile) : null
}

export async function getUserRole(uid: string): Promise<UserRole> {
  const profile = await getUserProfile(uid)
  return profile?.role || 'user'
}
