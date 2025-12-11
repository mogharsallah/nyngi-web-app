import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PlanSelection } from '@/components/features/onboarding/plan-selection'
import * as sessionStoreProvider from '@/components/providers/studio-store-provider'
import * as namingActions from '@/server/actions/studio'

// Mock dependencies
vi.mock('@/components/providers/session-store-provider', () => ({
  useSessionStore: vi.fn(),
}))

vi.mock('@/server/actions/naming', () => ({
  createNamingSession: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

describe('PlanSelection', () => {
  const mockSetSessionPlan = vi.fn()
  const mockSetSessionId = vi.fn()
  const mockOnComplete = vi.fn()
  const initialData = { industry: 'Tech', description: 'AI Startup' }

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock store selector
    vi.spyOn(sessionStoreProvider, 'useSessionStore').mockImplementation((selector) => {
      const state = {
        setSessionPlan: mockSetSessionPlan,
        setSessionId: mockSetSessionId,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return selector(state as any)
    })
  })

  it('renders both plans', () => {
    render(<PlanSelection initialData={initialData} onComplete={mockOnComplete} />)

    expect(screen.getByText('Velocity Plan')).toBeDefined()
    expect(screen.getByText('Legacy Plan')).toBeDefined()
  })

  it('selects velocity plan and calls API', async () => {
    vi.spyOn(namingActions, 'createNamingSession').mockResolvedValue({
      data: { sessionId: 'session-123' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    render(<PlanSelection initialData={initialData} onComplete={mockOnComplete} />)

    const velocityButton = screen.getByText('Select Velocity')
    fireEvent.click(velocityButton)

    await waitFor(() => {
      expect(mockSetSessionPlan).toHaveBeenCalledWith('velocity')
      expect(namingActions.createNamingSession).toHaveBeenCalledWith({
        ...initialData,
        plan: 'velocity',
      })
      expect(mockSetSessionId).toHaveBeenCalledWith('session-123')
      expect(mockOnComplete).toHaveBeenCalled()
    })
  })

  it('selects legacy plan and calls API', async () => {
    vi.spyOn(namingActions, 'createNamingSession').mockResolvedValue({
      data: { sessionId: 'session-456' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    render(<PlanSelection initialData={initialData} onComplete={mockOnComplete} />)

    const legacyButton = screen.getByText('Select Legacy')
    fireEvent.click(legacyButton)

    await waitFor(() => {
      expect(mockSetSessionPlan).toHaveBeenCalledWith('legacy')
      expect(namingActions.createNamingSession).toHaveBeenCalledWith({
        ...initialData,
        plan: 'legacy',
      })
      expect(mockSetSessionId).toHaveBeenCalledWith('session-456')
      expect(mockOnComplete).toHaveBeenCalled()
    })
  })
})
