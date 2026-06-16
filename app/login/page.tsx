'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, Phone, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  loginWithEmail,
  loginWithGoogle,
  setupRecaptcha,
  sendPhoneOTP,
  verifyPhoneOTP,
} from '@/lib/firebase/auth'
import { useAuth } from '@/lib/hooks/useAuth'
import { checkMockCredentials, saveMockSession } from '@/lib/mock-auth'
import toast from 'react-hot-toast'
import type { ConfirmationResult } from 'firebase/auth'

type Method = 'choose' | 'email' | 'phone'

export default function LoginPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  const [method, setMethod] = useState<Method>('choose')

  // Email/Password
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  // Google
  const [googleLoading, setGoogleLoading] = useState(false)

  // Phone OTP
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null)

  useEffect(() => {
    if (!loading && user) {
      if (profile && !profile.profileComplete) {
        router.push('/onboarding')
      } else {
        redirectByRole(profile?.role)
      }
    }
  }, [user, profile, loading]) // eslint-disable-line

  function redirectByRole(role?: string) {
    if (role === 'admin') router.push('/admin')
    else if (role === 'faculty' || role === 'crew') router.push('/faculty')
    else router.push('/dashboard')
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setEmailLoading(true)
    try {
      // Check mock credentials first (dev/testing mode)
      const mockSession = checkMockCredentials(email, password)
      if (mockSession) {
        saveMockSession(mockSession)
        toast.success(`Welcome, ${mockSession.displayName}!`)
        redirectByRole(mockSession.role)
        return
      }
      await loginWithEmail(email, password)
      toast.success('Welcome back!')
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Check your credentials.')
    } finally {
      setEmailLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      toast.success('Signed in with Google!')
    } catch (err: any) {
      toast.error(err.message || 'Google sign-in failed.')
    } finally {
      setGoogleLoading(false)
    }
  }

  async function handleSendOTP() {
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      toast.error('Enter a valid 10-digit mobile number')
      return
    }
    setSendingOtp(true)
    try {
      const full = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`
      const result = await sendPhoneOTP(full)
      setConfirmation(result)
      setOtpSent(true)
      toast.success('OTP sent to your mobile!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP')
    } finally {
      setSendingOtp(false)
    }
  }

  async function handleVerifyOTP() {
    if (!confirmation || otp.length !== 6) return
    setVerifyingOtp(true)
    try {
      await verifyPhoneOTP(confirmation, otp)
      toast.success('Signed in successfully!')
    } catch {
      toast.error('Invalid OTP. Please try again.')
    } finally {
      setVerifyingOtp(false)
    }
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-20">
      {/* Recaptcha anchor for phone auth */}
      <div id="recaptcha-container" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center leading-none">
            <span className="font-display text-3xl font-bold text-ink">SALSAWALA</span>
            <span className="font-body text-[9px] tracking-[0.3em] text-primary-dark uppercase mt-0.5">Studios • Kolkata</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-ink mt-6 mb-1">Welcome back</h1>
          <p className="font-body text-sm text-ink/60">Sign in to your account</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-3xl p-8">

          {/* Method chooser */}
          {method === 'choose' && (
            <div className="space-y-3">
              {/* Google */}
              <Button variant="secondary" className="w-full gap-3" onClick={handleGoogle} loading={googleLoading}>
                <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>

              {/* Email */}
              <button onClick={() => setMethod('email')}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-dark-border bg-dark-surface hover:border-primary/40 transition-all text-left">
                <Mail className="h-5 w-5 text-ink/50 flex-shrink-0" />
                <div>
                  <p className="font-body text-sm font-medium text-ink">Continue with Email</p>
                  <p className="font-body text-xs text-ink/40">Use your email and password</p>
                </div>
              </button>

              {/* Phone */}
              <button onClick={() => setMethod('phone')}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-dark-border bg-dark-surface hover:border-primary/40 transition-all text-left">
                <Phone className="h-5 w-5 text-ink/50 flex-shrink-0" />
                <div>
                  <p className="font-body text-sm font-medium text-ink">Continue with Mobile OTP</p>
                  <p className="font-body text-xs text-ink/40">Get a one-time code on your phone</p>
                </div>
              </button>

              <p className="text-center text-sm text-ink/50 font-body pt-2">
                New here?{' '}
                <Link href="/register" className="text-primary-dark hover:text-primary font-semibold transition-colors">
                  Create account
                </Link>
              </p>
            </div>
          )}

          {/* Email + Password */}
          {method === 'email' && (
            <div>
              <button onClick={() => setMethod('choose')} className="flex items-center gap-1 text-xs text-ink/50 hover:text-ink mb-5 transition-colors">
                <ChevronLeft className="h-3.5 w-3.5" /> Back
              </button>

              <h2 className="font-display text-lg font-bold text-ink mb-4">Sign in with Email</h2>

              <form onSubmit={handleEmail} className="space-y-4">
                <div>
                  <label className="block text-sm text-ink/70 font-body mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                      className="w-full bg-dark-surface border border-dark-border rounded-xl pl-10 pr-4 py-3 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60 transition-colors" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm text-ink/70 font-body">Password</label>
                    <Link href="/forgot-password" className="text-xs text-primary-dark hover:text-primary font-body transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                    <input type={showPwd ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                      className="w-full bg-dark-surface border border-dark-border rounded-xl pl-10 pr-10 py-3 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60 transition-colors" />
                    <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70">
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" loading={emailLoading} className="w-full mt-2">Sign In</Button>
              </form>
            </div>
          )}

          {/* Phone OTP */}
          {method === 'phone' && (
            <div>
              <button onClick={() => { setMethod('choose'); setOtpSent(false); setOtp('') }} className="flex items-center gap-1 text-xs text-ink/50 hover:text-ink mb-5 transition-colors">
                <ChevronLeft className="h-3.5 w-3.5" /> Back
              </button>

              <h2 className="font-display text-lg font-bold text-ink mb-4">Sign in with Mobile OTP</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-ink/70 font-body mb-1.5">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" disabled={otpSent}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl pl-10 pr-4 py-3 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60 transition-colors disabled:opacity-50" />
                  </div>
                </div>

                {!otpSent ? (
                  <Button onClick={handleSendOTP} loading={sendingOtp} className="w-full">Send OTP</Button>
                ) : (
                  <>
                    <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
                      <p className="font-body text-xs text-ink/70">OTP sent to <strong>{phone}</strong></p>
                    </div>
                    <div>
                      <label className="block text-sm text-ink/70 font-body mb-1.5">Enter 6-digit OTP</label>
                      <input type="text" inputMode="numeric" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="• • • • • •"
                        className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-ink placeholder-ink/30 font-body text-sm text-center tracking-[0.5em] focus:outline-none focus:border-primary/60 transition-colors" />
                    </div>
                    <Button onClick={handleVerifyOTP} loading={verifyingOtp} disabled={otp.length !== 6} className="w-full">Verify & Sign In</Button>
                    <button onClick={() => { setOtpSent(false); setOtp(''); setConfirmation(null) }} className="w-full text-center text-xs text-primary-dark hover:text-primary font-body transition-colors">
                      Change number / Resend OTP
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
