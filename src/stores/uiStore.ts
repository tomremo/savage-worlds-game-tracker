import { create } from 'zustand';
import { TraitRollResult } from '@/engine/dice';

export type TabType = 'skills' | 'abilities' | 'inventory' | 'powers' | 'log' | 'history';
export type ViewModeType = 'front' | 'back' | 'dual';

export interface CombatModifiers {
  gangUp: number;             // Melee: 0 to 4 (+1 per level, max +4)
  wildAttack: boolean;        // Melee: true/false (+2 Fighting/damage, -2 Parry)
  enemyVulnerable: boolean;   // All Attacks: true/false (+2 attack bonus)
  cover: 'none' | 'light' | 'medium' | 'heavy' | 'total'; // Ranged: none (0), light (-2), medium (-4), heavy (-6), total (-8)
  range: 'short' | 'medium' | 'long' | 'extreme';        // Ranged: short (0), medium (-2), long (-4), extreme (-6)
  illumination: 'normal' | 'dim' | 'dark' | 'pitch-black'; // All: normal (0), dim (-2), dark (-4), pitch-black (-6)
  customModifier: number;     // Custom situational modifier
}

const DEFAULT_MODIFIERS: CombatModifiers = {
  gangUp: 0,
  wildAttack: false,
  enemyVulnerable: false,
  cover: 'none',
  range: 'short',
  illumination: 'normal',
  customModifier: 0,
};

export interface RollResultInfo {
  name: string;
  result: TraitRollResult;
  isRunningRoll?: boolean;
}

interface UIState {
  activeTab: TabType;
  viewMode: ViewModeType;
  rollOverlayVisible: boolean;
  activeRollResult?: RollResultInfo;
  modifiers: CombatModifiers;
  setActiveTab: (tab: TabType) => void;
  setViewMode: (mode: ViewModeType) => void;
  setRollOverlayVisible: (visible: boolean) => void;
  setRollResult: (result: RollResultInfo | null) => void;
  updateModifier: <K extends keyof CombatModifiers>(key: K, value: CombatModifiers[K]) => void;
  resetModifiers: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'skills',
  viewMode: 'front',
  rollOverlayVisible: false,
  modifiers: { ...DEFAULT_MODIFIERS },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setRollOverlayVisible: (visible) => set({ rollOverlayVisible: visible }),
  setRollResult: (result) => set({ activeRollResult: result || undefined, rollOverlayVisible: !!result }),
  updateModifier: (key, value) => set((state) => ({
    modifiers: { ...state.modifiers, [key]: value }
  })),
  resetModifiers: () => set({ modifiers: { ...DEFAULT_MODIFIERS } }),
}));
