export default function GalleryLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-dotted">
      <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-candy-purple/5 via-candy-blue/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 pt-12 pb-8 text-center">
          <div className="mx-auto h-12 w-64 animate-pulse rounded-2xl bg-muted" />
          <div className="mx-auto mt-4 h-6 w-80 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div
                className="aspect-square animate-pulse rounded-3xl bg-muted"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
              <div className="space-y-2 px-1">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
