export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="border-b bg-muted/40 py-8">
        <div className="container">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="mt-4 h-10 w-full max-w-xl bg-muted animate-pulse rounded" />
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <aside className="space-y-6">
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="grid gap-6 sm:grid-cols-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4 border rounded-lg p-4">
                  <div className="aspect-video bg-muted animate-pulse rounded" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
