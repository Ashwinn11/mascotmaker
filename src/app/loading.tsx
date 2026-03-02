export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-dotted">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-candy-pink/20" />
          <div
            className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-candy-pink"
            style={{ animationDuration: "1s" }}
          />
        </div>
        <p className="font-display text-sm text-warm-gray">Loading...</p>
      </div>
    </div>
  );
}
