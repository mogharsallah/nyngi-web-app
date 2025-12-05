'use client'

import { type ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useStore } from 'zustand'

import { type SessionStore, type SessionStoreApi, createSessionStore, defaultSessionState } from '@/components/lib/stores/session-store'

// ============================================================================
// Context
// ============================================================================

const SessionStoreContext = createContext<SessionStoreApi | undefined>(undefined)

// ============================================================================
// Provider
// ============================================================================

export interface SessionStoreProviderProps {
  children: ReactNode
  initialState?: Partial<SessionStore>
}

export function SessionStoreProvider({ children, initialState }: SessionStoreProviderProps) {
  // Use useState with lazy initializer to create store once
  const [store] = useState(() =>
    createSessionStore({
      ...defaultSessionState,
      ...initialState,
    })
  )

  useEffect(() => {
    // Manually rehydrate on client mount
    store.persist.rehydrate()
  }, [store])

  return <SessionStoreContext.Provider value={store}>{children}</SessionStoreContext.Provider>
}

// ============================================================================
// Hook
// ============================================================================

export function useSessionStore<T>(selector: (store: SessionStore) => T): T {
  const context = useContext(SessionStoreContext)

  if (!context) {
    throw new Error('useSessionStore must be used within a SessionStoreProvider')
  }

  return useStore(context, selector)
}

// ============================================================================
// Direct Store Access (for non-React contexts)
// ============================================================================

export { SessionStoreContext }
