'use client'

import { type ReactNode, createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

import { StudioState, type StudioStore, type StudioStoreApi, createStudioStore, defaultStudioState } from '@/components/lib/stores/studio-store'

// ============================================================================
// Context
// ============================================================================

const StudioStoreContext = createContext<StudioStoreApi | undefined>(undefined)

// ============================================================================
// Provider
// ============================================================================

export interface StudioStoreProviderProps {
  children: ReactNode
  initialState: Partial<StudioState>
}

export function StudioStoreProvider({ children, initialState }: StudioStoreProviderProps) {
  // Use useState with lazy initializer to create store once
  const storeRef = useRef<StudioStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createStudioStore({
      ...defaultStudioState,
      ...initialState,
    })
  }

  // eslint-disable-next-line react-hooks/refs
  return <StudioStoreContext.Provider value={storeRef.current}>{children}</StudioStoreContext.Provider>
}

// ============================================================================
// Hook
// ============================================================================

export function useStudioStore<T>(selector: (store: StudioStore) => T): T {
  const context = useContext(StudioStoreContext)

  if (!context) {
    throw new Error('useStudioStore must be used within a StudioStoreProvider')
  }

  return useStore(context, selector)
}

// ============================================================================
// Direct Store Access (for non-React contexts)
// ============================================================================

export { StudioStoreContext }
