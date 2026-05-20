import { create } from 'zustand';
import { TraitRollResult } from '@/engine/dice';

export type TabType = 'skills' | 'abilities' | 'inventory' | 'powers' | 'log' | 'history';
export type ViewModeType = 'front' | 'back' | 'dual';

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
  setActiveTab: (tab: TabType) => void;
  setViewMode: (mode: ViewModeType) => void;
  setRollOverlayVisible: (visible: boolean) => void;
  setRollResult: (result: RollResultInfo | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'skills',
  viewMode: 'front',
  rollOverlayVisible: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setRollOverlayVisible: (visible) => set({ rollOverlayVisible: visible }),
  setRollResult: (result) => set({ activeRollResult: result || undefined, rollOverlayVisible: !!result }),
}));
