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
  updatePowerPoints: (delta: number) => void;
  setMaxPowerPoints: (max: number) => void;
  resetPowerPoints: () => void;
  castPower: (powerId: string, cost: number) => boolean;
  toggleActivePower: (powerId: string) => void;
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
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
      updatePowerPoints: (delta) =>
        set((state) => {
          const maxPP = state.character.maxPowerPoints || 0;
          const currentPP = state.character.currentPowerPoints ?? maxPP;
          const newPP = Math.max(0, Math.min(maxPP, currentPP + delta));
          return {
            character: { ...state.character, currentPowerPoints: newPP },
          };
        }),
      setMaxPowerPoints: (max) =>
        set((state) => {
          const validMax = Math.max(0, max);
          const currentPP = Math.min(state.character.currentPowerPoints || 0, validMax);
          return {
            character: {
              ...state.character,
              maxPowerPoints: validMax,
              currentPowerPoints: currentPP,
            },
          };
        }),
      resetPowerPoints: () =>
        set((state) => ({
          character: {
            ...state.character,
            currentPowerPoints: state.character.maxPowerPoints || 0,
          },
        })),
      castPower: (powerId, cost) => {
        const char = get().character;
        const currentPP = char.currentPowerPoints ?? 0;
        if (currentPP >= cost) {
          get().updatePowerPoints(-cost);
          return true;
        }
        return false;
      },
      toggleActivePower: (powerId) =>
        set((state) => {
          const activeList = state.character.activePowerIds || [];
          const updatedActive = activeList.includes(powerId)
            ? activeList.filter((id) => id !== powerId)
            : [...activeList, powerId];
          return {
            character: {
              ...state.character,
              activePowerIds: updatedActive,
            },
          };
        }),
    }),
    {
      name: 'savage-character-storage',
    }
  )
);
