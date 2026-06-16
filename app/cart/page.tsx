'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, Trash2, Tag, ChevronRight, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useCart } from '@/lib/context/CartContext'
import { useAuth } from '@/lib/hooks/useAuth'
import { getCouponByCode, applyCoupon, createOrder, createEnrollment } from '@/lib/firebase/firestore'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { user, profile, loading } = useAuth()
  const { items, coupon, discount, subtotal, total, removeItem, updateDuration, setCoupon, clearCart } = useCart()
  const router = useRouter()

  const [couponCode, setCouponCode] = useState('')
  const [applyingCoupon, setApplyingCoupon] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online')
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && user && profile?.registrationStatus !== 'active') {
      toast.error('Complete registration before adding classes.')
      router.push('/onboarding')
    }
  }, [user, profile, loading, router])

  if (loading) return <PageLoader />
  if (!user) return null

  async function handleApplyCoupon() {
    if (!couponCode.trim() || !user) return
    setApplyingCoupon(true)
    try {
      const c = await getCouponByCode(couponCode.trim().toUpperCase())
      if (!c) { toast.error('Invalid coupon code'); return }
      const result = applyCoupon(c, subtotal, user.uid, items)
      if (result.error) { toast.error(result.error); return }
      setCoupon(c, result.discount)
      toast.success(`Coupon applied! You save ₹${result.discount.toLocaleString()}`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to apply coupon')
    } finally {
      setApplyingCoupon(false)
    }
  }

  async function handleCheckout() {
    if (items.length === 0 || !user) return
    setCheckingOut(true)
    try {
      const orderId = await createOrder({
        userId: user.uid,
        userName: profile?.displayName || '',
        userEmail: user.email || undefined,
        userPhone: profile?.phone || undefined,
        items,
        subtotal,
        discountAmount: discount,
        couponCode: coupon?.code,
        totalAmount: total,
        paymentMethod,
        paymentStatus: 'pending',
      })

      // Create enrollment records for class items
      const now = new Date()
      for (const item of items.filter(i => i.type === 'class')) {
        const months = item.durationMonths || 1
        const endDate = new Date(now)
        endDate.setMonth(endDate.getMonth() + months)
        await createEnrollment({
          userId: user.uid,
          classId: item.id,
          className: item.name,
          orderId,
          durationMonths: months,
          startDate: now as any,
          endDate: endDate as any,
          status: paymentMethod === 'cash' ? 'paused' : 'active',
        })
      }

      clearCart()

      if (paymentMethod === 'cash') {
        toast.success('Order placed! Pay at studio to activate your classes.')
      } else {
        // In production: initiate Razorpay here
        toast.success('Payment successful! Classes enrolled.')
      }
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.message || 'Checkout failed')
    } finally {
      setCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-dark flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="h-20 w-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-10 w-10 text-primary-dark" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink mb-2">Your cart is empty</h1>
          <p className="font-body text-sm text-ink/60 mb-6">Browse classes and add them to your cart to enroll.</p>
          <Link href="/classes"><Button>Browse Classes</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl font-bold text-ink mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <Card key={`${item.type}-${item.id}`} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={item.type === 'class' ? 'primary' : 'warning'} className="text-[10px] capitalize">{item.type}</Badge>
                      <h3 className="font-display font-bold text-ink">{item.name}</h3>
                    </div>
                    <p className="font-body text-sm text-ink/50 mb-3">₹{item.pricePerUnit.toLocaleString()}/month</p>

                    {item.type === 'class' && item.durationMonths !== undefined && (
                      <div className="flex items-center gap-3">
                        <span className="font-body text-xs text-ink/60">Duration:</span>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 6, 12].filter(m => m <= (item.maxDurationMonths || 12)).map(m => (
                            <button key={m} onClick={() => updateDuration(item.id, m)}
                              className={`px-3 py-1 rounded-lg text-xs font-body font-medium transition-all ${
                                item.durationMonths === m
                                  ? 'bg-primary text-ink border border-primary-dark'
                                  : 'bg-dark-surface border border-dark-border text-ink/60 hover:border-primary/40'
                              }`}>
                              {m}mo
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.classesPerMonth && item.durationMonths && (
                      <p className="font-body text-xs text-ink/40 mt-2">
                        {item.classesPerMonth * item.durationMonths} total classes over {item.durationMonths} month{item.durationMonths > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="font-display font-bold text-ink mb-2">
                      ₹{(item.pricePerUnit * (item.durationMonths || 1) * item.quantity).toLocaleString()}
                    </p>
                    <button onClick={() => removeItem(item.id, item.type)} className="text-red-400 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Coupon */}
            <Card className="p-5">
              <h3 className="font-display font-semibold text-ink mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary-dark" /> Coupon Code
              </h3>
              {coupon ? (
                <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
                  <div>
                    <span className="font-body text-sm font-medium text-ink">{coupon.code}</span>
                    <p className="font-body text-xs text-ink/50">
                      {coupon.type === 'flat' ? `₹${coupon.value} off` : `${coupon.value}% off`}
                      {coupon.maxDiscount ? ` (max ₹${coupon.maxDiscount})` : ''}
                    </p>
                  </div>
                  <button onClick={() => setCoupon(null, 0)} className="text-xs text-red-400 hover:text-red-500 font-body">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-ink placeholder-ink/30 font-body text-sm focus:outline-none focus:border-primary/60"
                  />
                  <Button size="sm" variant="outline" onClick={handleApplyCoupon} loading={applyingCoupon}>Apply</Button>
                </div>
              )}
            </Card>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-display font-bold text-ink mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-ink/60">Subtotal</span>
                  <span className="text-ink">₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm font-body text-emerald-600">
                    <span>Discount</span>
                    <span>−₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-dark-border pt-2 flex justify-between font-body">
                  <span className="font-semibold text-ink">Total</span>
                  <span className="font-display font-bold text-ink text-lg">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment method */}
              <div className="space-y-2 mb-4">
                <p className="font-body text-xs text-ink/60 uppercase tracking-wide">Payment Method</p>
                {(['online', 'cash'] as const).map(m => (
                  <button key={m} onClick={() => setPaymentMethod(m)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      paymentMethod === m ? 'border-primary bg-primary/10' : 'border-dark-border'
                    }`}>
                    <div className={`h-3.5 w-3.5 rounded-full border-2 flex-shrink-0 ${paymentMethod === m ? 'border-primary bg-primary' : 'border-ink/30'}`} />
                    <div>
                      <p className="font-body text-xs font-medium text-ink">{m === 'online' ? 'Online Payment' : 'Pay at Studio'}</p>
                      <p className="font-body text-[10px] text-ink/40">{m === 'online' ? 'Instant activation' : 'Pending activation'}</p>
                    </div>
                  </button>
                ))}
              </div>

              {paymentMethod === 'cash' && (
                <div className="flex gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="font-body text-xs text-amber-700">Classes will be activated after you pay at the studio.</p>
                </div>
              )}

              <Button onClick={handleCheckout} loading={checkingOut} className="w-full">
                {checkingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {paymentMethod === 'online' ? `Pay ₹${total.toLocaleString()}` : 'Place Order'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Card>

            <Link href="/classes">
              <Button variant="outline" className="w-full text-sm">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
