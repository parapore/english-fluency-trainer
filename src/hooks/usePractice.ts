"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Prompt, PracticeState } from "@/types";
import { getShuffledPrompts } from "@/lib/prompts";
import { useSpeech } from "./useSpeech";

const STORAGE_KEY_SESSION_COUNT = "eft-session-count";
const STORAGE_KEY_TIMER_DURATION = "eft-timer-duration";
const DEFAULT_TIMER_DURATION = 5;

export function usePractice() {
  const [state, setState] = useState<PracticeState>("idle");
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [sessionCount, setSessionCount] = useState(0);
  const [timerDuration, setTimerDuration] = useState(DEFAULT_TIMER_DURATION);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMER_DURATION);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { speak, stop } = useSpeech();

  // Load saved settings on mount
  useEffect(() => {
    const savedCount = localStorage.getItem(STORAGE_KEY_SESSION_COUNT);
    if (savedCount) {
      setSessionCount(parseInt(savedCount, 10));
    }

    const savedDuration = localStorage.getItem(STORAGE_KEY_TIMER_DURATION);
    if (savedDuration) {
      const duration = parseInt(savedDuration, 10);
      setTimerDuration(duration);
      setTimeLeft(duration);
    }
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (duration: number) => {
      clearTimer();
      setTimeLeft(duration);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clearTimer]
  );

  const advancePrompt = useCallback(() => {
    setCurrentPromptIndex((prev) => {
      const next = prev + 1;
      if (next >= prompts.length) {
        // Reshuffle and restart
        setPrompts(getShuffledPrompts());
        return 0;
      }
      return next;
    });
  }, [prompts.length]);

  // Speak current prompt when index changes (during active state)
  useEffect(() => {
    if (state === "active" && prompts.length > 0) {
      const prompt = prompts[currentPromptIndex];
      if (prompt) {
        speak(prompt.text);
        startTimer(timerDuration);
      }
    }
  }, [state, currentPromptIndex, prompts, speak, startTimer, timerDuration]);

  // Auto-advance when timer reaches 0
  useEffect(() => {
    if (state === "active" && timeLeft === 0) {
      advancePrompt();
    }
  }, [state, timeLeft, advancePrompt]);

  const start = useCallback(() => {
    const shuffled = getShuffledPrompts();
    setPrompts(shuffled);
    setCurrentPromptIndex(0);
    setState("active");
  }, []);

  const pause = useCallback(() => {
    setState("paused");
    clearTimer();
    stop();
  }, [clearTimer, stop]);

  const resume = useCallback(() => {
    setState("active");
    if (prompts.length > 0) {
      const prompt = prompts[currentPromptIndex];
      if (prompt) {
        speak(prompt.text);
        startTimer(timeLeft > 0 ? timeLeft : timerDuration);
      }
    }
  }, [prompts, currentPromptIndex, speak, startTimer, timeLeft, timerDuration]);

  const nextPrompt = useCallback(() => {
    clearTimer();
    stop();
    advancePrompt();
  }, [clearTimer, stop, advancePrompt]);

  const endSession = useCallback(() => {
    clearTimer();
    stop();
    setState("idle");
    const newCount = sessionCount + 1;
    setSessionCount(newCount);
    localStorage.setItem(STORAGE_KEY_SESSION_COUNT, newCount.toString());
  }, [clearTimer, stop, sessionCount]);

  const updateTimerDuration = useCallback((duration: number) => {
    setTimerDuration(duration);
    setTimeLeft(duration);
    localStorage.setItem(STORAGE_KEY_TIMER_DURATION, duration.toString());
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      stop();
    };
  }, [clearTimer, stop]);

  return {
    state,
    currentPrompt: prompts[currentPromptIndex] ?? null,
    currentPromptIndex,
    totalPrompts: prompts.length,
    sessionCount,
    timerDuration,
    timeLeft,
    start,
    pause,
    resume,
    nextPrompt,
    endSession,
    updateTimerDuration,
  };
}