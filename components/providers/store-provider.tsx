'use client'

import { type ReactNode } from 'react'
import { SessionStoreProvider } from './session-store-provider'
import { NamingStoreProvider } from './naming-store-provider'

// ============================================================================
// Combined Store Provider
// ============================================================================

export interface StoreProviderProps {
  children: ReactNode
}

/**
 * Combined provider that wraps all Zustand store providers.
 * Use this in your root layout to provide all stores to the app.
 */
export function StoreProvider({ children }: StoreProviderProps) {
  return (
    <SessionStoreProvider>
      <NamingStoreProvider>{children}</NamingStoreProvider>
    </SessionStoreProvider>
  )
}
