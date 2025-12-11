'use client'

import { useCallback, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createNamingSession } from '@/server/actions/studio'
import { toast } from 'sonner'

export function PlanSelection() {
  const [pending, setPending] = useState(false)
  const selectPlan = useCallback(async (plan: 'velocity' | 'legacy') => {
    try {
      setPending(true)
      await createNamingSession({ plan })
    } catch (error) {
      toast.error('Failed to create session. Please try again.')
    } finally {
      setPending(false)
    }
  }, [])
  return (
    <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto p-4">
      {/* Velocity Plan */}
      <Card
        className="border-2 border-teal-400 bg-teal-50/10 dark:bg-teal-900/10 hover:shadow-lg transition-all cursor-pointer"
        onClick={() => selectPlan('velocity')}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-teal-600 dark:text-teal-400">Velocity Plan</CardTitle>
          <CardDescription>For the Lean Entrepreneur</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium mb-4">"Name it. Claim it. Launch it."</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Rapid name generation</li>
            <li>Instant domain checks</li>
            <li>Focus on speed and availability</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              selectPlan('velocity')
            }}
            disabled={pending}
          >
            Select Velocity
          </Button>
        </CardFooter>
      </Card>

      {/* Legacy Plan */}
      <Card
        className="border-2 border-indigo-500 bg-indigo-50/10 dark:bg-indigo-900/10 hover:shadow-lg transition-all cursor-pointer"
        onClick={() => selectPlan('velocity')}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Legacy Plan</CardTitle>
          <CardDescription>For the High-Stakes Founder</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium mb-4">"Build a Brand That Lasts."</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Deep linguistic analysis</li>
            <li>Trademark risk assessment</li>
            <li>Focus on defensibility and safety</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              selectPlan('legacy')
            }}
            disabled={pending}
          >
            Select Legacy
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
