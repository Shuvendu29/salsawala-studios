'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Mail, Lock, Phone, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { registerWithEmail, loginWithGoogle } from '@/lib/firebase/auth'
import toast from 'react-hot-toast'

const perks = [
  'First class FREE',
  'Easy online booking',
  'Progress tracking',
  'Event priority access',
]

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()

  function update(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await registerWithEmail(form.email, form.password, form.name, form.phone)
      toast.success('Welcome to Salsawala Studios!')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      toast.success('Welcome to Salsawala Studios!')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.message || 'Google sign-in failed.')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: perks */}
        <div className="hidden lg:block">
          <Link href="/" className="flex flex-col leading-none mb-10">
            <span className="font-display text-3xl font-bold text-ink">SALSAWALA</span>
            <span className="font-body text-[9px] tracking-[0.3em] text-primary-dark uppercase mt-0.5">Studios • Kolkata</span>
          </Link>
          <h2 className="font-display text-4xl font-bold text-ink mb-4 leading-tight">
            Start Your Dance Journey <span className="bg-crimson-gradient bg-clip-text text-transparent">Today</span>
          </h2>
          <p className="font-body text-ink/60 mb-8 leading-relaxed">
            Join 500+ dancers in Kolkata&apos;s most vibrant dance community. Your first class is completely free.
          </p>
          <ul className="space-y-3">
            {perks.map(p => (
              <li key={p} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary-dark shrink-0" />
                <span className="font-body text-ink/70">{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex -space-x-3">
            {['from-red-500 to-rose-600', 'from-blue-500 to-indigo-600', 'from-green-500 to-emerald-600', 'from-purple-500 to-violet-600', 'from-amber-500 to-orange-600'].map((g, i) => (
              <div key={i} className={`h-10 w-10 rounded-full bg-gradient-to-br ${g} border-2 border-dark-border flex items-center justify-center`}>
                <span className="text-xs text-white font-bold">{'ABHPS'.charAt(i)}</span>
              </div>
            ))}
            <div className="h-10 px-3 rounded-full bg-dark-card border-2 border-dark-border flex items-center">
              <span className="text-xs text-ink/50 font-body">+495 more</span>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div>
          <div className="text-center lg:hidden mb-8">
            <Link href="/" className="inline-flex flex-col items-center leading-none">
              <span className="font-display text-3xl font-bold text-ink">SALSAWALA</span>
              <span className="font-body text-[9px] tracking-[0.3em] text-primary-dark uppercase mt-0.5">Studios • Kolkata</span>
            </Link>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-3xl p-8">
            <h1 className="font-display text-2xl font-bold text-ink mb-1">Create Account</h1>
            <p className="font-body text-sm text-ink/60 mb-6">Your first class is on us</p>

            <Button variant="secondary" className="w-full mb-5 gap-3" onClick={handleGoogle} loading={googleLoading}>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-border" /></div>
              <div className="relative flex justify-center"><span className="bg-dark-card px-3 text-xs text-ink/40 font-body">or with email</span></div>
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input type="text" required value={form.name} onChange={update('name')} placeholder="Full name"
                  className="w-full bg-dark-surface border border-dark-border rounded-xl pl-10 pr-4 py-3 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60 transition-colors" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input type="email" required value={form.email} onChange={update('email')} placeholder="Email address"
                  className="w-full bg-dark-surface border border-dark-border rounded-xl pl-10 pr-4 py-3 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60 transition-colors" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input type="tel" value={form.phone} onChange={update('phone')} placeholder="Phone number (optional)"
                  className="w-full bg-dark-surface border border-dark-border rounded-xl pl-10 pr-4 py-3 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60 transition-colors" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input type={showPwd ? 'text' : 'password'} required value={form.password} onChange={update('password')} placeholder="Create password"
                  className="w-full bg-dark-surface border border-dark-border rounded-xl pl-10 pr-10 py-3 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60 transition-colors" />
                <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <input type="password" required value={form.confirm} onChange={update('confirm')} placeholder="Confirm password"
                  className="w-full bg-dark-surface border border-dark-border rounded-xl pl-10 pr-4 py-3 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60 transition-colors" />
              </div>
              <Button type="submit" loading={loading} className="w-full mt-1">Create My Account</Button>
            </form>

            <p className="text-center text-xs text-ink/40 font-body mt-4">
              By signing up you agree to our Terms of Service and Privacy Policy.
            </p>
            <p className="text-center text-sm text-ink/50 font-body mt-3">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-dark hover:text-primary font-semibold transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
