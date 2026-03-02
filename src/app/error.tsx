"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-dotted px-6 text-center">
      <div className="animate-float text-8xl mb-6">😵</div>
      <h1 className="font-display text-3xl sm:text-4xl text-foreground mb-3">
        Something Went Wrong
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        An unexpected error occurred. Don&apos;t worry — your mascots are safe!
      </p>
      <button
        onClick={reset}
        className="rounded-2xl bg-gradient-to-r from-candy-pink to-candy-orange px-8 py-3 text-base font-bold text-white shadow-lg shadow-candy-pink/25 transition-all hover:shadow-xl hover:brightness-105 active:scale-[0.98]"
      >
        Try Again
      </button>
    </div>
  );
}
