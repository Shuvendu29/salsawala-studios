'use client'

import { createContext, useEffect, useState, ReactNode } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { getUserProfile } from '@/lib/firebase/auth'
import { UserProfile, UserRole } from '@/lib/types'
import { getMockSession } from '@/lib/mock-auth'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  role: UserRole
  loading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: 'user',
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [role, setRole] = useState<UserRole>('user')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock session takes priority over Firebase (for testing without Firebase setup)
    const mockSession = getMockSession()
    if (mockSession) {
      const mockUser = {
        uid: `mock-${mockSession.username}`,
        displayName: mockSession.displayName,
        email: `${mockSession.username}@mock.local`,
      } as User
      setUser(mockUser)
      setProfile({
        uid: mockUser.uid,
        email: mockUser.email!,
        displayName: mockSession.displayName,
        photoURL: '',
        role: mockSession.role,
        enrolledClasses: [],
        bookings: [],
        joinedAt: null as any,
        updatedAt: null as any,
      })
      setRole(mockSession.role)
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const userProfile = await getUserProfile(firebaseUser.uid)
        setProfile(userProfile)
        setRole(userProfile?.role || 'user')
      } else {
        setProfile(null)
        setRole('user')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, role, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
