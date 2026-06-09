'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, User, LogOut, LayoutDashboard, Users, Shield } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/lib/hooks/useAuth'
import { logout } from '@/lib/firebase/auth'
import toast from 'react-hot-toast'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Classes', href: '/classes' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, role } = useAuth()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setProfileOpen(false)
  }, [pathname])

  async function handleLogout() {
    try {
      await logout()
      toast.success('Logged out successfully')
      router.push('/')
    } catch {
      toast.error('Failed to log out')
    }
  }

  const dashboardHref =
    role === 'admin' ? '/admin' : role === 'faculty' ? '/faculty' : '/dashboard'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled || mobileOpen
          ? 'bg-white/95 backdrop-blur-md border-b border-dark-border shadow-card'
          : 'bg-white/80 backdrop-blur-sm border-b border-dark-border'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span className="font-display text-xl md:text-2xl font-bold text-ink group-hover:text-primary-dark transition-colors">
              SALSAWALA
            </span>
            <span className="font-body text-[9px] tracking-[0.3em] text-gold-dark uppercase">
              Studios • Kolkata
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-primary-dark bg-primary/10'
                      : 'text-ink/60 hover:text-ink hover:bg-dark-hover'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(p => !p)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-dark-surface border border-dark-border hover:border-primary/60 transition-all"
                >
                  <div className="h-7 w-7 rounded-full bg-crimson-gradient flex items-center justify-center text-ink text-xs font-bold">
                    {profile?.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-ink/80 max-w-[100px] truncate">
                    {profile?.displayName?.split(' ')[0] || 'User'}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-dark-border rounded-xl shadow-card overflow-hidden">
                    <div className="px-4 py-3 border-b border-dark-border">
                      <p className="text-ink text-sm font-medium truncate">{profile?.displayName}</p>
                      <p className="text-ink/50 text-xs truncate">{user.email}</p>
                    </div>
                    <Link
                      href={dashboardHref}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-ink/70 hover:text-ink hover:bg-dark-surface transition-colors"
                    >
                      {role === 'admin' ? <Shield className="h-4 w-4 text-gold-dark" /> :
                       role === 'faculty' ? <Users className="h-4 w-4 text-primary" /> :
                       <LayoutDashboard className="h-4 w-4 text-primary" />}
                      My Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-ink/70 hover:text-primary-dark hover:bg-dark-surface transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Book Free Trial</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-ink/70 hover:text-ink"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-dark-border bg-white/98 backdrop-blur-md">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
                  pathname === link.href
                    ? 'text-primary-dark bg-primary/10'
                    : 'text-ink/70 hover:text-ink hover:bg-dark-surface'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 pb-1 border-t border-dark-border flex flex-col gap-2">
              {user ? (
                <>
                  <Link href={dashboardHref}>
                    <Button variant="secondary" className="w-full justify-start gap-3">
                      <LayoutDashboard className="h-4 w-4" />
                      My Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 text-ink/60">
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login"><Button variant="secondary" className="w-full">Log In</Button></Link>
                  <Link href="/register"><Button className="w-full">Book Free Trial</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
