export interface Deck {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}

export interface Card {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  mastered: boolean;
  createdAt: number;
  updatedAt: number;
}

export type AiMode = 'basic' | 'deep';

export type AiDraftCard = {
  id: string;
  question: string;
  answer: string;
  isEditing: boolean;
  editQuestion: string;
  editAnswer: string;
  isRegenerating: boolean;
};

export type OpenAiChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };
