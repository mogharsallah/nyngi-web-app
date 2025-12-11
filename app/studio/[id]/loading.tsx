import { Skeleton } from '@/components/ui/skeleton'

export default function StudioLoading() {
  return (
    <>
      {/* Mobile Header Skeleton */}
      <div className="fixed top-0 left-0 right-0 md:hidden bg-background border-b z-50 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between h-14 px-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Desktop/Tablet Split View Skeleton */}
      <div className="hidden md:grid lg:grid-cols-[30%_70%] md:grid-cols-[35%_65%] h-screen">
        {/* Chat Panel Skeleton */}
        <div className="border-r p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas Panel Skeleton */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Single Panel Skeleton */}
      <div className="md:hidden h-screen pt-[calc(env(safe-area-inset-top)+3.5rem)]">
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
