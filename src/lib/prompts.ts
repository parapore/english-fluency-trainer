import { Prompt } from "@/types";
import promptsData from "../../data/prompts.json";

export function getAllPrompts(): Prompt[] {
  return promptsData as Prompt[];
}

export function getShuffledPrompts(): Prompt[] {
  const prompts = getAllPrompts();
  return shuffleArray([...prompts]);
}

export function getPromptsByCategory(category: string): Prompt[] {
  const prompts = getAllPrompts();
  return prompts.filter((p) => p.category === category);
}

export function getCategories(): string[] {
  const prompts = getAllPrompts();
  const categories = new Set(prompts.map((p) => p.category));
  return Array.from(categories).sort();
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}