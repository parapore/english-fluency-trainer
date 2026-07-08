export interface Prompt {
  id: number;
  text: string;
  category: string;
}

export type PracticeState = "idle" | "active" | "paused";

export interface PracticeSession {
  state: PracticeState;
  currentPromptIndex: number;
  prompts: Prompt[];
  sessionCount: number;
  timerDuration: number;
}