"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80dvh] gap-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">English Fluency Trainer</h1>
        <p className="text-indigo-300 text-sm">
          Train your brain to think in English
        </p>
      </div>

      <Link
        href="/practice"
        className="w-40 h-40 rounded-full bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-300 flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-500/30 transition-colors"
      >
        Start
      </Link>

      <Link
        href="/settings"
        className="text-indigo-300 hover:text-indigo-200 text-sm underline underline-offset-4"
      >
        Settings
      </Link>
    </div>
  );
}