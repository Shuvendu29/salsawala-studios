import { UserRole } from './types'

interface MockCredential {
  username: string
  password: string
  role: UserRole
  displayName: string
}

const MOCK_CREDENTIALS: MockCredential[] = [
  { username: 'admin',  password: 'admin1234', role: 'admin',   displayName: 'Admin'      },
  { username: 'User',   password: 'User1234',  role: 'user',    displayName: 'User'       },
  { username: 'Crew',   password: 'User1234',  role: 'faculty', displayName: 'Crew Member' },
]

const SESSION_KEY = 'mock_auth_session'

export interface MockSession {
  username: string
  role: UserRole
  displayName: string
}

export function checkMockCredentials(username: string, password: string): MockSession | null {
  const match = MOCK_CREDENTIALS.find(
    c => c.username === username && c.password === password
  )
  if (!match) return null
  return { username: match.username, role: match.role, displayName: match.displayName }
}

export function saveMockSession(session: MockSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getMockSession(): MockSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as MockSession) : null
  } catch {
    return null
  }
}

export function clearMockSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
}
