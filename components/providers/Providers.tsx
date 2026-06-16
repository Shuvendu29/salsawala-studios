'use client'

import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './AuthProvider'
import { CartProvider } from '@/lib/context/CartContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#2d1b69',
              border: '1px solid #ffc6ff',
            },
            success: {
              iconTheme: { primary: '#bdb2ff', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  )
}
