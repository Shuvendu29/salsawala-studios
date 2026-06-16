'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { resetPassword } from '@/lib/firebase/auth'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center leading-none">
            <span className="font-display text-3xl font-bold text-ink">SALSAWALA</span>
            <span className="font-body text-[9px] tracking-[0.3em] text-primary-dark uppercase mt-0.5">Studios • Kolkata</span>
          </Link>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-3xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="h-14 w-14 text-green-400 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-ink mb-2">Check your email</h2>
              <p className="font-body text-sm text-ink/60 mb-6">
                We sent a password reset link to <span className="text-ink font-semibold">{email}</span>.
                Check your inbox (and spam folder).
              </p>
              <Link href="/login">
                <Button variant="secondary" className="w-full">Back to Sign In</Button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-ink mb-1">Reset your password</h1>
              <p className="font-body text-sm text-ink/60 mb-6">
                Enter your email and we&apos;ll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-ink/70 font-body mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-dark-surface border border-dark-border rounded-xl pl-10 pr-4 py-3 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60 transition-colors"
                    />
                  </div>
                </div>
                <Button type="submit" loading={loading} className="w-full">Send Reset Link</Button>
              </form>
              <Link href="/login" className="flex items-center justify-center gap-1.5 mt-6 text-sm text-ink/50 hover:text-ink font-body transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
