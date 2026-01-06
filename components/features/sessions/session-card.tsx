'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type SessionCardProps = {
  session: {
    id: string
    status: string
    createdAt: Date | string
    updatedAt: Date | string
  }
}

function getStatusVariant(status: string): 'default' | 'secondary' | 'outline' {
  switch (status) {
    case 'criteria':
      return 'default'
    case 'brainstorming':
      return 'secondary'
    case 'completed':
      return 'outline'
    default:
      return 'default'
  }
}

function formatDate(date: Date | string): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

export function SessionCard({ session }: SessionCardProps) {
  return (
    <Link href={`/studio/${session.id}`} className="block">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">Session {session.id.slice(0, 8)}</CardTitle>
            <Badge variant={getStatusVariant(session.status)}>{session.status}</Badge>
          </div>
          <CardDescription>Created {formatDate(session.createdAt)}</CardDescription>
        </CardHeader>

        <CardFooter className="text-sm text-muted-foreground">
          Updated {formatDate(session.updatedAt)}
        </CardFooter>
      </Card>
    </Link>
  )
}
