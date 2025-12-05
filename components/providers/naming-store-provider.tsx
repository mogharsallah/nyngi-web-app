'use client'

import { type ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useStore } from 'zustand'

import { type NamingStore, type NamingStoreApi, createNamingStore, defaultNamingState } from '@/components/lib/stores/naming-store'

// ============================================================================
// Context
// ============================================================================

const NamingStoreContext = createContext<NamingStoreApi | undefined>(undefined)

// ============================================================================
// Provider
// ============================================================================

export interface NamingStoreProviderProps {
  children: ReactNode
  initialState?: Partial<NamingStore>
}

export function NamingStoreProvider({ children, initialState }: NamingStoreProviderProps) {
  // Use useState with lazy initializer to create store once
  const [store] = useState(() =>
    createNamingStore({
      ...defaultNamingState,
      ...initialState,
    })
  )

  useEffect(() => {
    // Manually rehydrate on client mount
    store.persist.rehydrate()
  }, [store])

  return <NamingStoreContext.Provider value={store}>{children}</NamingStoreContext.Provider>
}

// ============================================================================
// Hook
// ============================================================================

export function useNamingStore<T>(selector: (store: NamingStore) => T): T {
  const context = useContext(NamingStoreContext)

  if (!context) {
    throw new Error('useNamingStore must be used within a NamingStoreProvider')
  }

  return useStore(context, selector)
}

// ============================================================================
// Direct Store Access (for non-React contexts)
// ============================================================================

export { NamingStoreContext }
