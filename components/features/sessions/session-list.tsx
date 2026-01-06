'use client'

import { SessionCard } from './session-card'

type SessionListProps = {
  sessions: Array<{
    id: string
    status: string
    createdAt: Date | string
    updatedAt: Date | string
  }>
}

export function SessionList({ sessions }: SessionListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  )
}
