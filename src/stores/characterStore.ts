import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Character } from '../types/character';
import { astreusHelvetica } from '../data/sampleCharacter';
import { useLogStore } from './logStore';

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
          const oldWounds = state.character.wounds || 0;
          const newWounds = Math.max(0, Math.min(3, oldWounds + delta));
          if (newWounds !== oldWounds) {
            const diff = newWounds - oldWounds;
            useLogStore.getState().addLogEntry({
              category: 'mechanic',
              type: 'wounds_fatigue',
              title: diff > 0 ? `Took ${diff} Wound(s)` : `Healed ${Math.abs(diff)} Wound(s)`,
              details: `Current Wounds: ${newWounds}/3 (Penalty: -${newWounds})`,
            });
          }
          return { character: { ...state.character, wounds: newWounds } };
        }),
      updateFatigue: (delta) =>
        set((state) => {
          const oldFatigue = state.character.fatigue || 0;
          const newFatigue = Math.max(0, Math.min(2, oldFatigue + delta));
          if (newFatigue !== oldFatigue) {
            const diff = newFatigue - oldFatigue;
            useLogStore.getState().addLogEntry({
              category: 'mechanic',
              type: 'wounds_fatigue',
              title: diff > 0 ? `Took ${diff} Fatigue` : `Recovered ${Math.abs(diff)} Fatigue`,
              details: `Current Fatigue: ${newFatigue}/2 (Penalty: -${newFatigue})`,
            });
          }
          return { character: { ...state.character, fatigue: newFatigue } };
        }),
      spendBennie: () =>
        set((state) => {
          if (state.character.bennies > 0) {
            const remaining = state.character.bennies - 1;
            useLogStore.getState().addLogEntry({
              category: 'mechanic',
              type: 'bennies',
              title: 'Spent 1 Bennie',
              details: `Bennies Remaining: ${remaining}`,
            });
            return { character: { ...state.character, bennies: remaining } };
          }
          return state;
        }),
      addBennie: () =>
        set((state) => {
          const newBennies = state.character.bennies + 1;
          useLogStore.getState().addLogEntry({
            category: 'mechanic',
            type: 'bennies',
            title: 'Added 1 Bennie',
            details: `Current Bennies: ${newBennies}`,
          });
          return { character: { ...state.character, bennies: newBennies } };
        }),
      toggleStatus: (status) =>
        set((state) => {
          const isActive = state.character.statuses.includes(status);
          const statuses = isActive
            ? state.character.statuses.filter((s) => s !== status)
            : [...state.character.statuses, status];
          useLogStore.getState().addLogEntry({
            category: 'mechanic',
            type: 'statuses',
            title: `Status ${isActive ? 'Removed' : 'Applied'}: ${status}`,
            details: `Active Statuses: ${statuses.join(', ') || 'None'}`,
          });
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
        set((state) => {
          const maxPP = state.character.maxPowerPoints || 0;
          useLogStore.getState().addLogEntry({
            category: 'mechanic',
            type: 'spells_cast',
            title: 'Reset Power Points',
            details: `Restored Power Points to max (${maxPP} PP)`,
          });
          return {
            character: {
              ...state.character,
              currentPowerPoints: maxPP,
            },
          };
        }),
      castPower: (powerId, cost) => {
        const char = get().character;
        const currentPP = char.currentPowerPoints ?? 0;
        if (currentPP >= cost) {
          get().updatePowerPoints(-cost);
          const name = powerId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
          useLogStore.getState().addLogEntry({
            category: 'mechanic',
            type: 'spells_cast',
            title: `Cast Power: ${name}`,
            details: `Deducted ${cost} PP. Remaining PP: ${currentPP - cost}/${char.maxPowerPoints}`,
          });
          return true;
        }
        return false;
      },
      toggleActivePower: (powerId) =>
        set((state) => {
          const activeList = state.character.activePowerIds || [];
          const isActive = activeList.includes(powerId);
          const updatedActive = isActive
            ? activeList.filter((id) => id !== powerId)
            : [...activeList, powerId];
          const name = powerId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
          useLogStore.getState().addLogEntry({
            category: 'mechanic',
            type: 'spells_cast',
            title: `Power Maintenance: ${name}`,
            details: isActive ? `Deactivated ${name}` : `Activated & Maintained ${name}`,
          });
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
