import { createStore } from 'zustand/vanilla'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

// ============================================================================
// Types
// ============================================================================

export interface SessionState {
  userType: 'lean' | 'high-stakes' | null
  currentSessionId: string | null
}

export interface SessionActions {
  setUserType: (type: 'lean' | 'high-stakes' | null) => void
  setSessionId: (id: string | null) => void
  reset: () => void
}

export type SessionStore = SessionState & SessionActions

// ============================================================================
// Initial State
// ============================================================================

export const defaultSessionState: SessionState = {
  userType: null,
  currentSessionId: null,
}

// ============================================================================
// Store Factory
// ============================================================================

// ============================================================================
// Version & Migration
// ============================================================================

/**
 * Current schema version. Increment when making breaking changes to state shape.
 * Add migration logic in the `migrate` function below.
 */
const CURRENT_VERSION = 1

/**
 * Migrate persisted state from older versions to current version.
 * @param persistedState - The state loaded from storage
 * @param version - The version of the persisted state
 * @returns The migrated state compatible with current version
 */
function migrateSessionState(persistedState: unknown, version: number): SessionState {
  // Start with persisted state, apply migrations incrementally
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let state = persistedState as any

  // Migration from version 0 to 1 (example for future use)
  if (version === 0) {
    // Example: rename a field or add defaults
    // state = { ...state, newField: 'default' }
    state = { ...state }
  }

  return state as SessionState
}

// ============================================================================
// Store Factory
// ============================================================================

export const createSessionStore = (initState: SessionState = defaultSessionState) => {
  return createStore<SessionStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          setUserType: (type) => set({ userType: type }, false, 'setUserType'),
          setSessionId: (id) => set({ currentSessionId: id }, false, 'setSessionId'),
          reset: () => set(defaultSessionState, false, 'reset'),
        }),
        {
          name: 'nyngi-session-storage',
          version: CURRENT_VERSION,
          storage: createJSONStorage(() => localStorage),
          skipHydration: true,
          partialize: (state) => ({
            userType: state.userType,
            currentSessionId: state.currentSessionId,
          }),
          migrate: migrateSessionState,
        }
      ),
      { name: 'SessionStore', enabled: process.env.NODE_ENV === 'development' }
    )
  )
}

// ============================================================================
// Store Type Export
// ============================================================================

export type SessionStoreApi = ReturnType<typeof createSessionStore>
