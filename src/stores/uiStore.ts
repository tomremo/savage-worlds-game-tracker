import { create } from 'zustand';

export type TabType = 'skills' | 'abilities' | 'inventory' | 'powers' | 'log' | 'history';

interface UIState {
  activeTab: TabType;
  rollOverlayVisible: boolean;
  activeRollResult?: any; // Will be typed with TraitRollResult
  setActiveTab: (tab: TabType) => void;
  setRollOverlayVisible: (visible: boolean) => void;
  setRollResult: (result: any) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'skills',
  rollOverlayVisible: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setRollOverlayVisible: (visible) => set({ rollOverlayVisible: visible }),
  setRollResult: (result) => set({ activeRollResult: result, rollOverlayVisible: !!result }),
}));
