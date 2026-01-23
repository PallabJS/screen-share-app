import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-white px-6">
      <div className="max-w-2xl text-center space-y-6">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Screen Share Annotation Tool
        </h1>

        {/* Subtitle */}
        <p className="text-zinc-400 text-lg leading-relaxed">
          A frontend-only screen sharing experience with real-time canvas
          annotations — built to demonstrate media handling, canvas rendering,
          and scalable frontend architecture.
        </p>

        {/* CTA */}
        <div className="pt-4">
          <Link
            href="/connect"
            className="inline-flex items-center justify-center rounded-lg bg-white text-black px-6 py-3 font-medium hover:bg-zinc-200 transition"
          >
            Launch App →
          </Link>
        </div>

        {/* Footer hint */}
        <p className="text-xs text-zinc-500 pt-8">
          React • Canvas API • MediaDevices • Redux • Redux-Saga
        </p>
      </div>
    </main>
  );
}
