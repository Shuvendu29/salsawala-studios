'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { CartItem, Coupon } from '../types'

interface CartContextValue {
  items: CartItem[]
  coupon: Coupon | null
  discount: number
  addItem: (item: CartItem) => void
  removeItem: (id: string, type: string) => void
  updateDuration: (id: string, months: number) => void
  setCoupon: (c: Coupon | null, discount: number) => void
  clearCart: () => void
  subtotal: number
  total: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [coupon, setCouponState] = useState<Coupon | null>(null)
  const [discount, setDiscount] = useState(0)

  const subtotal = items.reduce(
    (sum, i) => sum + i.pricePerUnit * (i.durationMonths || 1) * i.quantity,
    0
  )
  const total = Math.max(0, subtotal - discount)

  function addItem(item: CartItem) {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id && i.type === item.type)
      if (exists) return prev
      return [...prev, item]
    })
  }

  function removeItem(id: string, type: string) {
    setItems(prev => prev.filter(i => !(i.id === id && i.type === type)))
  }

  function updateDuration(id: string, months: number) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, durationMonths: months } : i))
  }

  function setCoupon(c: Coupon | null, d: number) {
    setCouponState(c)
    setDiscount(d)
  }

  function clearCart() {
    setItems([])
    setCouponState(null)
    setDiscount(0)
  }

  return (
    <CartContext.Provider value={{ items, coupon, discount, addItem, removeItem, updateDuration, setCoupon, clearCart, subtotal, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
