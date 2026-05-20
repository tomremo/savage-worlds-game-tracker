import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore, CombatModifiers } from '../uiStore';
import { calculateParry } from '../../engine/derived';

describe('Encounter Modifiers Logic', () => {
  beforeEach(() => {
    useUIStore.getState().resetModifiers();
  });

  describe('Zustand Store Modifiers', () => {
    it('should initialize with default modifier values', () => {
      const { modifiers } = useUIStore.getState();
      expect(modifiers.gangUp).toBe(0);
      expect(modifiers.wildAttack).toBe(false);
      expect(modifiers.enemyVulnerable).toBe(false);
      expect(modifiers.cover).toBe('none');
      expect(modifiers.range).toBe('short');
      expect(modifiers.illumination).toBe('normal');
      expect(modifiers.customModifier).toBe(0);
    });

    it('should update specific modifiers correctly', () => {
      const store = useUIStore.getState();
      
      store.updateModifier('gangUp', 3);
      expect(useUIStore.getState().modifiers.gangUp).toBe(3);

      store.updateModifier('wildAttack', true);
      expect(useUIStore.getState().modifiers.wildAttack).toBe(true);

      store.updateModifier('cover', 'heavy');
      expect(useUIStore.getState().modifiers.cover).toBe('heavy');

      store.updateModifier('customModifier', -3);
      expect(useUIStore.getState().modifiers.customModifier).toBe(-3);
    });

    it('should reset all modifiers to defaults', () => {
      const store = useUIStore.getState();
      store.updateModifier('gangUp', 4);
      store.updateModifier('wildAttack', true);
      store.updateModifier('cover', 'total');
      store.updateModifier('customModifier', 5);

      store.resetModifiers();

      const { modifiers } = useUIStore.getState();
      expect(modifiers.gangUp).toBe(0);
      expect(modifiers.wildAttack).toBe(false);
      expect(modifiers.cover).toBe('none');
      expect(modifiers.customModifier).toBe(0);
    });
  });

  describe('Calculations - Melee & Ranged Live Summary', () => {
    const getMeleeTotal = (mods: CombatModifiers) => {
      return (
        mods.gangUp + 
        (mods.wildAttack ? 2 : 0) + 
        (mods.enemyVulnerable ? 2 : 0) + 
        (mods.illumination === 'dim' ? -2 : mods.illumination === 'dark' ? -4 : mods.illumination === 'pitch-black' ? -6 : 0) +
        mods.customModifier
      );
    };

    const getRangedTotal = (mods: CombatModifiers) => {
      const coverPenalty = 
        mods.cover === 'light' ? -2 : 
        mods.cover === 'medium' ? -4 : 
        mods.cover === 'heavy' ? -6 : 
        mods.cover === 'total' ? -8 : 0;

      const rangePenalty = 
        mods.range === 'medium' ? -2 : 
        mods.range === 'long' ? -4 : 
        mods.range === 'extreme' ? -6 : 0;

      const lightPenalty = 
        mods.illumination === 'dim' ? -2 : 
        mods.illumination === 'dark' ? -4 : 
        mods.illumination === 'pitch-black' ? -6 : 0;

      return (
        coverPenalty + 
        rangePenalty + 
        lightPenalty + 
        (mods.enemyVulnerable ? 2 : 0) + 
        mods.customModifier
      );
    };

    it('should calculate correct melee total with various combinations', () => {
      const store = useUIStore.getState();
      
      // Default: 0
      expect(getMeleeTotal(useUIStore.getState().modifiers)).toBe(0);

      // Gang Up + Wild Attack: 3 + 2 = 5
      store.updateModifier('gangUp', 3);
      store.updateModifier('wildAttack', true);
      expect(getMeleeTotal(useUIStore.getState().modifiers)).toBe(5);

      // Add Vulnerable and Custom penalty: 5 + 2 - 1 = 6
      store.updateModifier('enemyVulnerable', true);
      store.updateModifier('customModifier', -1);
      expect(getMeleeTotal(useUIStore.getState().modifiers)).toBe(6);

      // Add Illumination penalty (Dark): 6 - 4 = 2
      store.updateModifier('illumination', 'dark');
      expect(getMeleeTotal(useUIStore.getState().modifiers)).toBe(2);
    });

    it('should calculate correct ranged total with various combinations', () => {
      const store = useUIStore.getState();
      
      // Default: 0
      expect(getRangedTotal(useUIStore.getState().modifiers)).toBe(0);

      // Medium Cover + Long Range: -4 - 4 = -8
      store.updateModifier('cover', 'medium');
      store.updateModifier('range', 'long');
      expect(getRangedTotal(useUIStore.getState().modifiers)).toBe(-8);

      // Add Vulnerable and Custom bonus: -8 + 2 + 1 = -5
      store.updateModifier('enemyVulnerable', true);
      store.updateModifier('customModifier', 1);
      expect(getRangedTotal(useUIStore.getState().modifiers)).toBe(-5);

      // Add Dim Light: -5 - 2 = -7
      store.updateModifier('illumination', 'dim');
      expect(getRangedTotal(useUIStore.getState().modifiers)).toBe(-7);
    });
  });

  describe('Derived Stats Parry Interaction', () => {
    const calculateParryWithWildAttack = (fightingDie: number, fightingMod: number, wildAttack: boolean) => {
      const baseParry = calculateParry({ dieType: fightingDie, modifier: fightingMod });
      return baseParry + (wildAttack ? -2 : 0);
    };

    it('should return base parry when Wild Attack is inactive', () => {
      // d8 fighting skill parry = 2 + 8/2 = 6
      expect(calculateParryWithWildAttack(8, 0, false)).toBe(6);
    });

    it('should subtract 2 from parry when Wild Attack is active', () => {
      // d8 fighting skill parry under Wild Attack = 6 - 2 = 4
      expect(calculateParryWithWildAttack(8, 0, true)).toBe(4);
      
      // d12 fighting skill parry under Wild Attack = (2 + 6) - 2 = 6
      expect(calculateParryWithWildAttack(12, 0, true)).toBe(6);
    });
  });

  describe('Dice Roll Engine Modifier Application', () => {
    const getRollCombatModifiers = (name: string, mods: CombatModifiers) => {
      const rollNameLower = name.toLowerCase();
      const isFighting = rollNameLower.includes('fighting');
      const isRanged = rollNameLower.includes('shooting') || rollNameLower.includes('athletics') || rollNameLower.includes('throwing') || rollNameLower.includes('bow');

      const activeMods: { label: string; value: number }[] = [];

      // 1. Illumination (dim -2, dark -4, pitch-black -6)
      if (mods.illumination === 'dim') activeMods.push({ label: 'Illumination (Dim)', value: -2 });
      else if (mods.illumination === 'dark') activeMods.push({ label: 'Illumination (Dark)', value: -4 });
      else if (mods.illumination === 'pitch-black') activeMods.push({ label: 'Illumination (Black)', value: -6 });

      // 2. Custom Modifier
      if (mods.customModifier !== 0) {
        activeMods.push({ label: 'Custom Situational', value: mods.customModifier });
      }

      // 3. Enemy Vulnerable (+2)
      if (mods.enemyVulnerable && (isFighting || isRanged)) {
        activeMods.push({ label: 'Enemy Vulnerable', value: 2 });
      }

      // 4. Melee Specific Modifiers
      if (isFighting) {
        if (mods.gangUp > 0) {
          activeMods.push({ label: `Gang Up (+${mods.gangUp})`, value: mods.gangUp });
        }
        if (mods.wildAttack) {
          activeMods.push({ label: 'Wild Attack', value: 2 });
        }
      }

      // 5. Ranged Specific Modifiers
      if (isRanged) {
        if (mods.cover !== 'none') {
          const val = mods.cover === 'light' ? -2 : mods.cover === 'medium' ? -4 : mods.cover === 'heavy' ? -6 : -8;
          const capCover = mods.cover.charAt(0).toUpperCase() + mods.cover.slice(1);
          activeMods.push({ label: `${capCover} Cover`, value: val });
        }
        if (mods.range !== 'short') {
          const val = mods.range === 'medium' ? -2 : mods.range === 'long' ? -4 : -6;
          const capRange = mods.range.charAt(0).toUpperCase() + mods.range.slice(1);
          activeMods.push({ label: `${capRange} Range`, value: val });
        }
      }

      return activeMods;
    };

    it('should apply Fighting-specific modifiers to Fighting rolls', () => {
      const store = useUIStore.getState();
      store.updateModifier('wildAttack', true);
      store.updateModifier('gangUp', 2);
      store.updateModifier('enemyVulnerable', true);

      // Melee Fighting roll
      const mods = getRollCombatModifiers('Fighting Roll', useUIStore.getState().modifiers);
      
      expect(mods).toContainEqual({ label: 'Wild Attack', value: 2 });
      expect(mods).toContainEqual({ label: 'Gang Up (+2)', value: 2 });
      expect(mods).toContainEqual({ label: 'Enemy Vulnerable', value: 2 });
      
      const totalSum = mods.reduce((sum, m) => sum + m.value, 0);
      expect(totalSum).toBe(6); // +2 wild, +2 gang, +2 vulnerable
    });

    it('should NOT apply melee-specific modifiers to Ranged rolls', () => {
      const store = useUIStore.getState();
      store.updateModifier('wildAttack', true);
      store.updateModifier('gangUp', 2);

      const mods = getRollCombatModifiers('Shooting Roll', useUIStore.getState().modifiers);
      expect(mods.some(m => m.label.includes('Wild Attack'))).toBe(false);
      expect(mods.some(m => m.label.includes('Gang Up'))).toBe(false);
    });

    it('should apply ranged cover and range modifiers to Shooting rolls', () => {
      const store = useUIStore.getState();
      store.updateModifier('cover', 'heavy');
      store.updateModifier('range', 'medium');

      const mods = getRollCombatModifiers('Shooting Roll', useUIStore.getState().modifiers);
      expect(mods).toContainEqual({ label: 'Heavy Cover', value: -6 });
      expect(mods).toContainEqual({ label: 'Medium Range', value: -2 });

      const totalSum = mods.reduce((sum, m) => sum + m.value, 0);
      expect(totalSum).toBe(-8);
    });

    it('should apply general illumination modifiers to any roll', () => {
      const store = useUIStore.getState();
      store.updateModifier('illumination', 'pitch-black');

      const fightingMods = getRollCombatModifiers('Fighting Roll', useUIStore.getState().modifiers);
      expect(fightingMods).toContainEqual({ label: 'Illumination (Black)', value: -6 });

      const shootingMods = getRollCombatModifiers('Shooting Roll', useUIStore.getState().modifiers);
      expect(shootingMods).toContainEqual({ label: 'Illumination (Black)', value: -6 });

      const noticeMods = getRollCombatModifiers('Notice Roll', useUIStore.getState().modifiers);
      expect(noticeMods).toContainEqual({ label: 'Illumination (Black)', value: -6 });
    });
  });
});
