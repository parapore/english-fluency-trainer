"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY_TIMER_DURATION = "eft-timer-duration";
const STORAGE_KEY_SESSION_COUNT = "eft-session-count";
const DEFAULT_TIMER_DURATION = 5;

const TIMER_OPTIONS = [3, 5, 10, 15, 30, 60];

export default function SettingsPage() {
  const [timerDuration, setTimerDuration] = useState(DEFAULT_TIMER_DURATION);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TIMER_DURATION);
    if (saved) {
      setTimerDuration(parseInt(saved, 10));
    }
    const count = localStorage.getItem(STORAGE_KEY_SESSION_COUNT);
    if (count) {
      setSessionCount(parseInt(count, 10));
    }
  }, []);

  const handleTimerChange = (duration: number) => {
    setTimerDuration(duration);
    localStorage.setItem(STORAGE_KEY_TIMER_DURATION, duration.toString());
  };

  return (
    <div className="flex flex-col min-h-[80dvh] gap-8">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-indigo-300 hover:text-indigo-200 text-sm"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Timer duration */}
      <section>
        <h2 className="text-sm font-medium text-indigo-300 mb-3 uppercase tracking-wide">
          Timer Duration (seconds)
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {TIMER_OPTIONS.map((duration) => (
            <button
              key={duration}
              onClick={() => handleTimerChange(duration)}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                timerDuration === duration
                  ? "bg-indigo-500 text-white"
                  : "bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800"
              }`}
            >
              {duration}s
            </button>
          ))}
        </div>
      </section>

      {/* Session count */}
      <section>
        <h2 className="text-sm font-medium text-indigo-300 mb-3 uppercase tracking-wide">
          Sessions Completed
        </h2>
        <p className="text-3xl font-bold">{sessionCount}</p>
      </section>

      {/* Info */}
      <section className="mt-auto">
        <p className="text-xs text-indigo-500 leading-relaxed">
          English Fluency Trainer v0.1.0
          <br />
          Practice forming English sentences in your head.
          <br />
          Use earphones for audio prompts.
        </p>
      </section>
    </div>
  );
}