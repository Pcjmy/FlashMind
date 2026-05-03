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
