"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePractice } from "@/hooks/usePractice";

export default function PracticePage() {
  const router = useRouter();
  const {
    state,
    currentPrompt,
    currentPromptIndex,
    totalPrompts,
    timeLeft,
    timerDuration,
    start,
    pause,
    resume,
    nextPrompt,
    endSession,
  } = usePractice();

  // Auto-start when entering the page
  useEffect(() => {
    if (state === "idle") {
      start();
    }
  }, [state, start]);

  const handleEnd = () => {
    endSession();
    router.push("/");
  };

  if (state === "idle") {
    return (
      <div className="flex items-center justify-center min-h-[80dvh]">
        <p className="text-indigo-300">Loading...</p>
      </div>
    );
  }

  const progressPercent =
    totalPrompts > 0
      ? ((currentPromptIndex + 1) / totalPrompts) * 100
      : 0;

  return (
    <div className="flex flex-col min-h-[80dvh] gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-indigo-300 text-sm">
          {currentPromptIndex + 1} / {totalPrompts}
        </span>
        <span className="text-indigo-300 text-sm">
          {state === "paused" ? "Paused" : `${timeLeft}s`}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-indigo-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Timer ring */}
      <div className="flex items-center justify-center py-4">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r="44"
              fill="none"
              stroke="rgb(49, 46, 129)"
              strokeWidth="6"
            />
            <circle
              cx="48"
              cy="48"
              r="44"
              fill="none"
              stroke="rgb(129, 140, 248)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(timeLeft / timerDuration) * 276.46} 276.46`}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
            {timeLeft}
          </span>
        </div>
      </div>

      {/* Prompt text */}
      <div className="flex-1 flex items-center justify-center text-center">
        <p className="text-xl leading-relaxed text-indigo-100">
          {currentPrompt?.text ?? ""}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 pb-4">
        {state === "active" ? (
          <button
            onClick={pause}
            className="w-16 h-16 rounded-full bg-indigo-800 hover:bg-indigo-700 active:bg-indigo-600 flex items-center justify-center text-sm font-medium transition-colors"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={resume}
            className="w-16 h-16 rounded-full bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-300 flex items-center justify-center text-sm font-medium transition-colors"
          >
            Resume
          </button>
        )}

        <button
          onClick={nextPrompt}
          className="w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-400 flex items-center justify-center text-sm font-bold transition-colors shadow-lg shadow-indigo-600/30"
        >
          Next
        </button>

        <button
          onClick={handleEnd}
          className="w-16 h-16 rounded-full bg-red-900/50 hover:bg-red-800 active:bg-red-700 flex items-center justify-center text-sm font-medium transition-colors"
        >
          Stop
        </button>
      </div>
    </div>
  );
}