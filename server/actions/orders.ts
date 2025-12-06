'use server'

import { z } from 'zod'
import { authenticatedAction } from '@/server/lib/actions/safe-action'

const CreateOrderSchema = z.object({
  nameId: z.string(),
  productType: z.enum(['de-risking-report', 'premium-report']),
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createOrder = authenticatedAction(CreateOrderSchema, async (input, userId) => {
  // Placeholder logic
  return { orderId: 'placeholder-order-id' }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getOrderHistory = authenticatedAction(z.void(), async (_, userId) => {
  // Placeholder logic
  return [{ id: 'order-1', status: 'completed', amount: 799 }]
})
