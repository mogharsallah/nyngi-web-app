import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PlanSelection } from '@/components/features/onboarding/plan-selection'
import * as studioActions from '@/server/actions/studio'
import { toast } from 'sonner'

vi.mock('@/server/actions/studio', () => ({
  createNamingSession: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

describe('PlanSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders both plans', () => {
    render(<PlanSelection />)

    expect(screen.getByText('Velocity Plan')).toBeDefined()
    expect(screen.getByText('Legacy Plan')).toBeDefined()
  })

  it('selects velocity plan and calls createNamingSession', async () => {
    vi.spyOn(studioActions, 'createNamingSession').mockResolvedValue(undefined)

    render(<PlanSelection />)

    const velocityButton = screen.getByText('Select Velocity')
    fireEvent.click(velocityButton)

    await waitFor(() => {
      expect(studioActions.createNamingSession).toHaveBeenCalledWith({ plan: 'velocity' })
    })
  })

  it('selects legacy plan and calls createNamingSession', async () => {
    vi.spyOn(studioActions, 'createNamingSession').mockResolvedValue(undefined)

    render(<PlanSelection />)

    const legacyButton = screen.getByText('Select Legacy')
    fireEvent.click(legacyButton)

    await waitFor(() => {
      expect(studioActions.createNamingSession).toHaveBeenCalledWith({ plan: 'legacy' })
    })
  })

  it('shows error toast when createNamingSession fails', async () => {
    vi.spyOn(studioActions, 'createNamingSession').mockRejectedValue(new Error('Network error'))

    render(<PlanSelection />)

    const velocityButton = screen.getByText('Select Velocity')
    fireEvent.click(velocityButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to create session. Please try again.')
    })
  })
})
