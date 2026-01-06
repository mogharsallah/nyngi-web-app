import { Button } from '@/components/ui/button'
import { createNamingSession } from '@/server/actions/studio'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="rounded-full bg-secondary p-6 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold mb-2">No sessions yet</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Get started by creating your first naming session. Our AI will guide you through the discovery process.
      </p>
      <form action={createNamingSession}>
        <Button type="submit" size="lg">
          Create Your First Session
        </Button>
      </form>
    </div>
  )
}
