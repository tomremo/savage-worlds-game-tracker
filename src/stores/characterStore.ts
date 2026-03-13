import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Character } from '../types/character';
import { astreusHelvetica } from '../data/sampleCharacter';

interface CharacterState {
  character: Character;
  updateWounds: (delta: number) => void;
  updateFatigue: (delta: number) => void;
  spendBennie: () => void;
  addBennie: () => void;
  toggleStatus: (status: string) => void;
  updateCharacter: (updates: Partial<Character>) => void;
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set) => ({
      character: astreusHelvetica,
      updateWounds: (delta) =>
        set((state) => {
          const newWounds = Math.max(0, Math.min(3, state.character.wounds + delta));
          return { character: { ...state.character, wounds: newWounds } };
        }),
      updateFatigue: (delta) =>
        set((state) => {
          const newFatigue = Math.max(0, Math.min(2, state.character.fatigue + delta));
          return { character: { ...state.character, fatigue: newFatigue } };
        }),
      spendBennie: () =>
        set((state) => {
          if (state.character.bennies > 0) {
            return { character: { ...state.character, bennies: state.character.bennies - 1 } };
          }
          return state;
        }),
      addBennie: () =>
        set((state) => ({
          character: { ...state.character, bennies: state.character.bennies + 1 },
        })),
      toggleStatus: (status) =>
        set((state) => {
          const statuses = state.character.statuses.includes(status)
            ? state.character.statuses.filter((s) => s !== status)
            : [...state.character.statuses, status];
          return { character: { ...state.character, statuses } };
        }),
      updateCharacter: (updates) =>
        set((state) => ({
          character: { ...state.character, ...updates },
        })),
    }),
    {
      name: 'savage-character-storage',
    }
  )
);
