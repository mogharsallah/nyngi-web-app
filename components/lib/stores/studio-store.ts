import { createStore } from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'
import { SessionPlan } from '@/common/types/session'

// ============================================================================
// Types
// ============================================================================

export interface StudioState {
  currentSessionPlan: SessionPlan | null
  currentSessionId: string | null
}

export interface StudioActions {
  setSessionPlan: (plan: SessionPlan | null) => void
  setSessionId: (id: string | null) => void
  reset: () => void
}

export type StudioStore = StudioState & StudioActions

// ============================================================================
// Initial State
// ============================================================================

export const defaultStudioState: StudioState = {
  currentSessionPlan: null,
  currentSessionId: null,
}

// ============================================================================
// Store Factory
// ============================================================================

export const createStudioStore = (initState: StudioState = defaultStudioState) => {
  return createStore<StudioStore>()(
    devtools(
      (set) => ({
        ...initState,
        setSessionPlan: (plan) => set({ currentSessionPlan: plan }, false, 'setSessionPlan'),
        setSessionId: (id) => set({ currentSessionId: id }, false, 'setSessionId'),
        reset: () => set(defaultStudioState, false, 'reset'),
      }),
      { name: 'StudioStore', enabled: process.env.NODE_ENV === 'development' }
    )
  )
}

// ============================================================================
// Store Type Export
// ============================================================================

export type StudioStoreApi = ReturnType<typeof createStudioStore>
