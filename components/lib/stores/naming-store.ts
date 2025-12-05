import { createStore } from 'zustand/vanilla'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

// ============================================================================
// Types
// ============================================================================

export interface NamingCriteria {
  industry?: string
  description?: string
  tone?: string
  audience?: string
  [key: string]: unknown
}

export interface GeneratedName {
  id: string
  name: string
  rationale?: string
  domainStatus?: {
    com?: boolean
    io?: boolean
    ai?: boolean
    [key: string]: boolean | undefined
  }
  riskStatus?: 'green' | 'amber' | 'red' | 'pending'
}

export interface NamingState {
  criteria: NamingCriteria
  generatedNames: GeneratedName[]
  selectedName: GeneratedName | null
}

export interface NamingActions {
  setCriteria: (criteria: Partial<NamingCriteria>) => void
  addNames: (names: GeneratedName[]) => void
  clearNames: () => void
  selectName: (name: GeneratedName | null) => void
  reset: () => void
}

export type NamingStore = NamingState & NamingActions

// ============================================================================
// Initial State
// ============================================================================

export const defaultNamingState: NamingState = {
  criteria: {},
  generatedNames: [],
  selectedName: null,
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
function migrateNamingState(persistedState: unknown, version: number): NamingState {
  // Start with persisted state, apply migrations incrementally
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let state = persistedState as any

  // Migration from version 0 to 1 (example for future use)
  if (version === 0) {
    // Example: ensure generatedNames have required 'id' field
    // const names = (state.generatedNames as GeneratedName[]) || []
    // state = { ...state, generatedNames: names.map(n => ({ ...n, id: n.id || crypto.randomUUID() })) }
    state = { ...state }
  }

  return state as NamingState
}

// ============================================================================
// Store Factory
// ============================================================================

export const createNamingStore = (initState: NamingState = defaultNamingState) => {
  return createStore<NamingStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          setCriteria: (newCriteria) => set((state) => ({ criteria: { ...state.criteria, ...newCriteria } }), false, 'setCriteria'),
          addNames: (names) => set((state) => ({ generatedNames: [...state.generatedNames, ...names] }), false, 'addNames'),
          clearNames: () => set({ generatedNames: [] }, false, 'clearNames'),
          selectName: (name) => set({ selectedName: name }, false, 'selectName'),
          reset: () => set(defaultNamingState, false, 'reset'),
        }),
        {
          name: 'nyngi-naming-storage',
          version: CURRENT_VERSION,
          storage: createJSONStorage(() => localStorage),
          skipHydration: true,
          partialize: (state) => ({
            criteria: state.criteria,
            generatedNames: state.generatedNames,
            selectedName: state.selectedName,
          }),
          migrate: migrateNamingState,
        }
      ),
      { name: 'NamingStore', enabled: process.env.NODE_ENV === 'development' }
    )
  )
}

// ============================================================================
// Store Type Export
// ============================================================================

export type NamingStoreApi = ReturnType<typeof createNamingStore>
