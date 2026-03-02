import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-dotted px-6 text-center">
      <div className="animate-float text-8xl mb-6">🔍</div>
      <h1 className="font-display text-3xl sm:text-4xl text-foreground mb-3">
        This mascot wandered off
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        We couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="rounded-2xl border-2 border-border bg-white px-8 py-3 text-base font-bold text-warm-gray shadow-sm transition-all hover:border-candy-pink/40 hover:text-foreground active:scale-[0.98]"
        >
          Home
        </Link>
        <Link
          href="/create"
          className="rounded-2xl bg-gradient-to-r from-candy-pink to-candy-orange px-8 py-3 text-base font-bold text-white shadow-lg shadow-candy-pink/25 transition-all hover:shadow-xl hover:brightness-105 active:scale-[0.98]"
        >
          Create a Mascot
        </Link>
      </div>
    </div>
  );
}
