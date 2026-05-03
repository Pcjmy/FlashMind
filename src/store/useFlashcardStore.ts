import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Deck, Card } from '../types';

interface FlashcardState {
  decks: Deck[];
  cards: Card[];
  
  // Deck actions
  addDeck: (name: string, description: string) => void;
  updateDeck: (id: string, name: string, description: string) => void;
  deleteDeck: (id: string) => void;
  
  // Card actions
  addCard: (deckId: string, question: string, answer: string) => void;
  updateCard: (id: string, question: string, answer: string) => void;
  deleteCard: (id: string) => void;
  toggleMastered: (id: string) => void;
  resetMastery: (deckId: string) => void;
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set) => ({
      decks: [],
      cards: [],
      
      addDeck: (name, description) => set((state) => ({
        decks: [
          ...state.decks,
          {
            id: uuidv4(),
            name,
            description,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ],
      })),
      
      updateDeck: (id, name, description) => set((state) => ({
        decks: state.decks.map((deck) =>
          deck.id === id
            ? { ...deck, name, description, updatedAt: Date.now() }
            : deck
        ),
      })),
      
      deleteDeck: (id) => set((state) => ({
        decks: state.decks.filter((deck) => deck.id !== id),
        cards: state.cards.filter((card) => card.deckId !== id),
      })),
      
      addCard: (deckId, question, answer) => set((state) => ({
        cards: [
          ...state.cards,
          {
            id: uuidv4(),
            deckId,
            question,
            answer,
            mastered: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ],
      })),
      
      updateCard: (id, question, answer) => set((state) => ({
        cards: state.cards.map((card) =>
          card.id === id
            ? { ...card, question, answer, updatedAt: Date.now() }
            : card
        ),
      })),
      
      deleteCard: (id) => set((state) => ({
        cards: state.cards.filter((card) => card.id !== id),
      })),
      
      toggleMastered: (id) => set((state) => ({
        cards: state.cards.map((card) =>
          card.id === id ? { ...card, mastered: !card.mastered } : card
        ),
      })),

      resetMastery: (deckId) => set((state) => ({
        cards: state.cards.map((card) =>
          card.deckId === deckId ? { ...card, mastered: false } : card
        ),
      })),
    }),
    {
      name: 'flashmind-storage',
    }
  )
);
