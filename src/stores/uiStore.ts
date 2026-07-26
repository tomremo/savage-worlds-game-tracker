import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TraitRollResult } from '@/engine/dice';
import { useLogStore } from './logStore';

export type TabType = 'skills' | 'abilities' | 'inventory' | 'powers' | 'log' | 'history';
export type ViewModeType = 'front' | 'back' | 'dual';

export type FrontModuleId =
  | 'portrait'
  | 'attributes'
  | 'skills'
  | 'derived'
  | 'armor'
  | 'gear'
  | 'damage'
  | 'modifiers'
  | 'hindrances_edges'
  | 'weapons'
  | 'powers'
  | 'session_log'
  | 'adventure_journal';

export type FrontColumnId = 'col1' | 'col2' | 'col3' | 'bottom';

export interface FrontLayout {
  col1: FrontModuleId[];
  col2: FrontModuleId[];
  col3: FrontModuleId[];
  bottom: FrontModuleId[];
}

export const DEFAULT_FRONT_LAYOUT: FrontLayout = {
  col1: ['portrait', 'attributes', 'skills'],
  col2: ['derived', 'armor', 'gear'],
  col3: ['powers', 'session_log', 'damage', 'modifiers', 'hindrances_edges'],
  bottom: ['weapons'],
};

export type BackModuleId =
  | 'special_abilities'
  | 'background'
  | 'more_edges'
  | 'advances'
  | 'powers'
  | 'session_log'
  | 'adventure_journal';

export type BackColumnId = 'col1' | 'col2';

export interface BackLayout {
  col1: BackModuleId[];
  col2: BackModuleId[];
}

export const DEFAULT_BACK_LAYOUT: BackLayout = {
  col1: ['powers', 'adventure_journal', 'special_abilities', 'background'],
  col2: ['session_log', 'more_edges', 'advances'],
};

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
  isEditMode: boolean;
  rollOverlayVisible: boolean;
  activeRollResult?: RollResultInfo;
  modifiers: CombatModifiers;
  enable3dDice: boolean;
  frontLayout: FrontLayout;
  backLayout: BackLayout;
  setActiveTab: (tab: TabType) => void;
  setViewMode: (mode: ViewModeType) => void;
  setIsEditMode: (edit: boolean) => void;
  toggleEditMode: () => void;
  setRollOverlayVisible: (visible: boolean) => void;
  setRollResult: (result: RollResultInfo | null) => void;
  updateModifier: <K extends keyof CombatModifiers>(key: K, value: CombatModifiers[K]) => void;
  resetModifiers: () => void;
  setEnable3dDice: (enabled: boolean) => void;
  moveFrontModule: (
    sourceCol: FrontColumnId,
    sourceIndex: number,
    targetCol: FrontColumnId,
    targetIndex: number
  ) => void;
  moveBackModule: (
    sourceCol: BackColumnId,
    sourceIndex: number,
    targetCol: BackColumnId,
    targetIndex: number
  ) => void;
  resetLayouts: () => void;
}

const ALL_FRONT_MODULES: FrontModuleId[] = [
  'portrait',
  'attributes',
  'skills',
  'derived',
  'armor',
  'gear',
  'damage',
  'modifiers',
  'hindrances_edges',
  'weapons',
  'powers',
  'session_log',
  'adventure_journal',
];

const ALL_BACK_MODULES: BackModuleId[] = [
  'special_abilities',
  'background',
  'more_edges',
  'advances',
  'powers',
  'session_log',
  'adventure_journal',
];

function sanitizeFrontLayout(layout?: FrontLayout): FrontLayout {
  if (!layout || !layout.col1 || !layout.col2 || !layout.col3 || !layout.bottom) {
    return { ...DEFAULT_FRONT_LAYOUT };
  }
  const presentModules = new Set<FrontModuleId>([
    ...layout.col1,
    ...layout.col2,
    ...layout.col3,
    ...layout.bottom,
  ]);
  if (presentModules.size !== ALL_FRONT_MODULES.length) {
    return { ...DEFAULT_FRONT_LAYOUT };
  }
  for (const mod of ALL_FRONT_MODULES) {
    if (!presentModules.has(mod)) {
      return { ...DEFAULT_FRONT_LAYOUT };
    }
  }
  return layout;
}

function sanitizeBackLayout(layout?: BackLayout): BackLayout {
  if (!layout || !layout.col1 || !layout.col2) {
    return { ...DEFAULT_BACK_LAYOUT };
  }
  const presentModules = new Set<BackModuleId>([
    ...layout.col1,
    ...layout.col2,
  ]);
  if (presentModules.size !== ALL_BACK_MODULES.length) {
    return { ...DEFAULT_BACK_LAYOUT };
  }
  for (const mod of ALL_BACK_MODULES) {
    if (!presentModules.has(mod)) {
      return { ...DEFAULT_BACK_LAYOUT };
    }
  }
  return layout;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      activeTab: 'skills',
      viewMode: 'front',
      isEditMode: false,
      rollOverlayVisible: false,
      enable3dDice: true,
      modifiers: { ...DEFAULT_MODIFIERS },
      frontLayout: { ...DEFAULT_FRONT_LAYOUT },
      backLayout: { ...DEFAULT_BACK_LAYOUT },
      setActiveTab: (tab) => set({ activeTab: tab }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setIsEditMode: (edit) => set({ isEditMode: edit }),
      toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
      setRollOverlayVisible: (visible) => set({ rollOverlayVisible: visible }),
      setRollResult: (result) =>
        set(() => {
          if (result) {
            const nameLower = result.name.toLowerCase();
            const isAttack =
              nameLower.includes('fighting') ||
              nameLower.includes('shooting') ||
              nameLower.includes('attack') ||
              nameLower.includes('athletics');
            const type = isAttack ? 'attacks_made' : 'trait_rolls';
            const detailText = result.result
              ? `Final Result: ${result.result.finalResult || 0}${
                  result.result.isCriticalFailure ? ' (CRITICAL FAILURE!)' : ''
                }`
              : 'Roll initiated';

            useLogStore.getState().addLogEntry({
              category: 'mechanic',
              type,
              title: `Dice Roll: ${result.name}`,
              details: detailText,
            });
          }
          return { activeRollResult: result || undefined, rollOverlayVisible: !!result };
        }),
      updateModifier: (key, value) =>
        set((state) => ({
          modifiers: { ...state.modifiers, [key]: value },
        })),
      resetModifiers: () => set({ modifiers: { ...DEFAULT_MODIFIERS } }),
      setEnable3dDice: (enabled) => set({ enable3dDice: enabled }),
      moveFrontModule: (sourceCol, sourceIndex, targetCol, targetIndex) =>
        set((state) => {
          const currentLayout = sanitizeFrontLayout(state.frontLayout);
          const nextLayout: FrontLayout = {
            col1: [...currentLayout.col1],
            col2: [...currentLayout.col2],
            col3: [...currentLayout.col3],
            bottom: [...currentLayout.bottom],
          };

          if (
            sourceIndex < 0 ||
            sourceIndex >= nextLayout[sourceCol].length
          ) {
            return state;
          }

          const [movedItem] = nextLayout[sourceCol].splice(sourceIndex, 1);
          const clampedTargetIndex = Math.max(
            0,
            Math.min(targetIndex, nextLayout[targetCol].length)
          );
          nextLayout[targetCol].splice(clampedTargetIndex, 0, movedItem);

          return { frontLayout: nextLayout };
        }),
      moveBackModule: (sourceCol, sourceIndex, targetCol, targetIndex) =>
        set((state) => {
          const currentLayout = sanitizeBackLayout(state.backLayout);
          const nextLayout: BackLayout = {
            col1: [...currentLayout.col1],
            col2: [...currentLayout.col2],
          };

          if (
            sourceIndex < 0 ||
            sourceIndex >= nextLayout[sourceCol].length
          ) {
            return state;
          }

          const [movedItem] = nextLayout[sourceCol].splice(sourceIndex, 1);
          const clampedTargetIndex = Math.max(
            0,
            Math.min(targetIndex, nextLayout[targetCol].length)
          );
          nextLayout[targetCol].splice(clampedTargetIndex, 0, movedItem);

          return { backLayout: nextLayout };
        }),
      resetLayouts: () =>
        set({
          frontLayout: { ...DEFAULT_FRONT_LAYOUT },
          backLayout: { ...DEFAULT_BACK_LAYOUT },
        }),
    }),
    {
      name: 'savage-ui-storage',
      partialize: (state) => ({
        isEditMode: state.isEditMode,
        frontLayout: sanitizeFrontLayout(state.frontLayout),
        backLayout: sanitizeBackLayout(state.backLayout),
        enable3dDice: state.enable3dDice,
      }),
    }
  )
);
