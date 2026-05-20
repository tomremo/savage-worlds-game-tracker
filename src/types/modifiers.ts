import { CombatModifiers } from '@/stores/uiStore';

export type RollCategory = 'melee' | 'ranged' | 'general_trait';

export interface UnifiedModifierInput {
  // Global character state
  wounds: number;
  fatigue: number;
  statuses: string[];
  
  // Combat modifiers from Zustand UI store
  combatModifiers: CombatModifiers;
  
  // Context of what trait is being rolled
  rollName: string;
  
  // Whether the roll is a Running Movement roll (which bypasses all modifiers/penalties)
  isRunningRoll?: boolean;
}

export interface ModifierItem {
  label: string;
  value: number;
  type: 'penalty' | 'bonus' | 'situational';
}

export interface UnifiedModifierResult {
  total: number;
  breakdown: ModifierItem[];
}
