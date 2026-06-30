'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, CheckCircle, ChevronRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/lib/hooks/useAuth'
import { updateUserProfile } from '@/lib/firebase/auth'
import { uploadProfilePicture } from '@/lib/firebase/storage'
import { setupRecaptcha, sendPhoneOTP, verifyPhoneOTP } from '@/lib/firebase/auth'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import toast from 'react-hot-toast'
import type { ConfirmationResult } from 'firebase/auth'

const STEPS = ['Profile', 'Verify Phone', 'Done']

export default function OnboardingPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  // Step 0 — Profile
  const [form, setForm] = useState({ name: '', dob: '', gender: '', yearsOfDancing: '', phone: '' })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // Step 1 — OTP
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null)
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (profile?.profileComplete && profile.registrationStatus === 'active') {
      router.push('/dashboard')
    }
    if (profile) {
      setForm(f => ({
        ...f,
        name: profile.displayName || '',
        phone: profile.phone || '',
      }))
      if (profile.phone) setPhoneVerified(true)
    }
  }, [user, profile, loading, router])

  if (loading) return <PageLoader />
  if (!user) return null

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatar(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function saveProfile() {
    if (!form.name || !form.dob || !form.gender || !user) {
      toast.error('Please fill all required fields')
      return
    }
    setSaving(true)
    try {
      let profilePicture = profile?.profilePicture || ''
      if (avatar) {
        profilePicture = await uploadProfilePicture(avatar, user.uid)
      }
      await updateUserProfile(user.uid, {
        displayName: form.name,
        dob: form.dob,
        gender: form.gender as any,
        yearsOfDancing: Number(form.yearsOfDancing) || 0,
        phone: form.phone,
        profilePicture,
        profileComplete: true,
        registrationStatus: 'active',
        role: 'student',
      })
      setStep(1)
    } catch (err: any) {
      toast.error(err.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  async function handleSendOTP() {
    if (!form.phone || form.phone.length < 10) {
      toast.error('Enter a valid phone number')
      return
    }
    setSendingOtp(true)
    try {
      const phone = form.phone.startsWith('+') ? form.phone : `+91${form.phone}`
      const result = await sendPhoneOTP(phone)
      setConfirmation(result)
      setOtpSent(true)
      toast.success('OTP sent!')
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
      setPhoneVerified(true)
      toast.success('Phone verified!')
      setStep(2)
    } catch {
      toast.error('Invalid OTP. Please try again.')
    } finally {
      setVerifyingOtp(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-20">
      <div id="recaptcha-container" />
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold border-2 transition-all ${
                i < step ? 'bg-primary border-primary text-ink' :
                i === step ? 'border-primary text-primary bg-transparent' :
                'border-dark-border text-ink/30 bg-transparent'
              }`}>
                {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${i < step ? 'bg-primary' : 'bg-dark-border'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-dark-card border border-dark-border rounded-3xl p-8">

          {/* Step 0 — Profile */}
          {step === 0 && (
            <div>
              <h1 className="font-display text-2xl font-bold text-ink mb-1">Complete Your Profile</h1>
              <p className="font-body text-sm text-ink/60 mb-6">Tell us about yourself to get started.</p>

              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <button onClick={() => fileRef.current?.click()} className="relative group">
                  <div className="h-24 w-24 rounded-full bg-primary/20 border-2 border-primary/40 overflow-hidden flex items-center justify-center">
                    {avatarPreview
                      ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                      : <Camera className="h-8 w-8 text-primary-dark" />
                    }
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-ink/70 font-body mb-1.5">Full Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name"
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-ink/70 font-body mb-1.5">Date of Birth *</label>
                    <input type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-ink font-body text-sm focus:outline-none focus:border-primary/60" />
                  </div>
                  <div>
                    <label className="block text-sm text-ink/70 font-body mb-1.5">Gender *</label>
                    <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-ink font-body text-sm focus:outline-none focus:border-primary/60">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-ink/70 font-body mb-1.5">Mobile Number *</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98xxx xxxxx"
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60" />
                  </div>
                  <div>
                    <label className="block text-sm text-ink/70 font-body mb-1.5">Years of Dancing</label>
                    <input type="number" min="0" max="50" value={form.yearsOfDancing} onChange={e => setForm(f => ({ ...f, yearsOfDancing: e.target.value }))} placeholder="0"
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60" />
                  </div>
                </div>
                <Button onClick={saveProfile} loading={saving} className="w-full mt-2">
                  Save & Continue <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 1 — Phone OTP */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-primary-dark" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold text-ink">Verify Phone</h1>
                  <p className="font-body text-sm text-ink/60">One-time verification for your account</p>
                </div>
              </div>

              {phoneVerified ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                  <p className="font-body text-ink font-medium">Phone already verified!</p>
                  <Button className="mt-4" onClick={() => setStep(2)}>Continue</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-ink/70 font-body mb-1.5">Phone Number</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98xxx xxxxx"
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60" />
                  </div>
                  {!otpSent ? (
                    <Button onClick={handleSendOTP} loading={sendingOtp} className="w-full">Send OTP</Button>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm text-ink/70 font-body mb-1.5">Enter 6-digit OTP</label>
                        <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/, ''))} placeholder="• • • • • •"
                          className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-ink placeholder-ink/30 font-body text-sm text-center tracking-widest focus:outline-none focus:border-primary/60" />
                      </div>
                      <Button onClick={handleVerifyOTP} loading={verifyingOtp} disabled={otp.length !== 6} className="w-full">Verify OTP</Button>
                      <button onClick={handleSendOTP} className="w-full text-center text-xs text-primary-dark font-body hover:text-primary transition-colors">
                        Resend OTP
                      </button>
                    </>
                  )}
                  <button onClick={() => setStep(2)} className="w-full text-center text-xs text-ink/40 font-body hover:text-ink/60 mt-2">
                    Skip for now (verify later)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2 — Done */}
          {step === 2 && (
            <div className="text-center py-4">
              <div className="h-20 w-20 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-primary-dark" />
              </div>
              <h1 className="font-display text-2xl font-bold text-ink mb-2">
                Welcome to Salsawala!
              </h1>
              <p className="font-body text-sm text-ink/60 mb-4">
                Your profile is complete. You are now a Student — explore classes and start your dance journey!
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="font-body text-sm font-medium text-ink">Badge: Student</span>
              </div>
              <Button onClick={() => router.push('/dashboard')} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
