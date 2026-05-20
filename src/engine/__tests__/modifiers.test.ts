import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../../stores/uiStore';
import { calculateUnifiedModifiers, getRollCategory } from '../modifiers';
import { calculateParry } from '../derived';

describe('Unified Modifier Engine', () => {
  beforeEach(() => {
    useUIStore.getState().resetModifiers();
  });

  describe('getRollCategory', () => {
    it('should identify fighting as melee', () => {
      expect(getRollCategory('Fighting')).toBe('melee');
      expect(getRollCategory('fighting roll')).toBe('melee');
    });

    it('should identify shooting, athletics, throwing, and bow as ranged', () => {
      expect(getRollCategory('Shooting')).toBe('ranged');
      expect(getRollCategory('Athletics')).toBe('ranged');
      expect(getRollCategory('Throwing')).toBe('ranged');
      expect(getRollCategory('Bow Roll')).toBe('ranged');
    });

    it('should identify notice, persuasion, stealth etc. as general_trait', () => {
      expect(getRollCategory('Notice')).toBe('general_trait');
      expect(getRollCategory('Persuasion')).toBe('general_trait');
      expect(getRollCategory('Stealth')).toBe('general_trait');
      expect(getRollCategory('Strength')).toBe('general_trait');
    });
  });

  describe('calculateUnifiedModifiers', () => {
    it('should bypass all modifiers for Running Movement rolls', () => {
      const combatModifiers = useUIStore.getState().modifiers;
      const res = calculateUnifiedModifiers({
        wounds: 2,
        fatigue: 1,
        statuses: ['Distracted'],
        combatModifiers,
        rollName: 'Running Movement',
        isRunningRoll: true
      });
      expect(res.total).toBe(0);
      expect(res.breakdown).toHaveLength(0);
    });

    it('should calculate global penalties correctly (Wounds, Fatigue, Distracted)', () => {
      const combatModifiers = useUIStore.getState().modifiers;

      // 1 wound, 0 fatigue, not distracted
      let res = calculateUnifiedModifiers({
        wounds: 1,
        fatigue: 0,
        statuses: [],
        combatModifiers,
        rollName: 'Notice'
      });
      expect(res.total).toBe(-1);
      expect(res.breakdown).toContainEqual({ label: 'Wounds', value: -1, type: 'penalty' });

      // 3 wounds (max capacity cap), 1 fatigue, distracted
      res = calculateUnifiedModifiers({
        wounds: 4, // exceeds standard 3, should cap at -3
        fatigue: 1,
        statuses: ['Distracted'],
        combatModifiers,
        rollName: 'Notice'
      });
      expect(res.total).toBe(-6); // -3 wounds, -1 fatigue, -2 distracted
      expect(res.breakdown).toContainEqual({ label: 'Wounds', value: -3, type: 'penalty' });
      expect(res.breakdown).toContainEqual({ label: 'Fatigue', value: -1, type: 'penalty' });
      expect(res.breakdown).toContainEqual({ label: 'Distracted Status', value: -2, type: 'penalty' });
    });

    it('should apply general illumination and custom modifiers to all rolls', () => {
      const store = useUIStore.getState();
      store.updateModifier('illumination', 'dark');
      store.updateModifier('customModifier', 3);

      const combatModifiers = useUIStore.getState().modifiers;

      // General Trait
      let res = calculateUnifiedModifiers({
        wounds: 0,
        fatigue: 0,
        statuses: [],
        combatModifiers,
        rollName: 'Notice'
      });
      expect(res.total).toBe(-1); // -4 dark + 3 custom = -1
      expect(res.breakdown).toContainEqual({ label: 'Illumination (Dark)', value: -4, type: 'situational' });
      expect(res.breakdown).toContainEqual({ label: 'Custom Situational', value: 3, type: 'situational' });

      // Melee
      res = calculateUnifiedModifiers({
        wounds: 0,
        fatigue: 0,
        statuses: [],
        combatModifiers,
        rollName: 'Fighting'
      });
      expect(res.total).toBe(-1);

      // Ranged
      res = calculateUnifiedModifiers({
        wounds: 0,
        fatigue: 0,
        statuses: [],
        combatModifiers,
        rollName: 'Shooting'
      });
      expect(res.total).toBe(-1);
    });

    it('should merge melee modifiers (Gang Up, Wild Attack, Vulnerable) with global penalties correctly', () => {
      const store = useUIStore.getState();
      store.updateModifier('gangUp', 3);
      store.updateModifier('wildAttack', true);
      store.updateModifier('enemyVulnerable', true);
      store.updateModifier('illumination', 'dim'); // -2
      store.updateModifier('customModifier', -1); // -1

      const combatModifiers = useUIStore.getState().modifiers;

      const res = calculateUnifiedModifiers({
        wounds: 2, // -2
        fatigue: 1, // -1
        statuses: ['Distracted'], // -2
        combatModifiers,
        rollName: 'Fighting'
      });

      // Expected items in breakdown:
      // Global: Wounds (-2), Fatigue (-1), Distracted (-2) -> -5
      // General: Illumination (Dim) (-2), Custom (-1) -> -3
      // Melee: Gang Up (+3), Wild Attack (+2), Enemy Vulnerable (+2) -> +7
      // Total: -5 -3 +7 = -1
      expect(res.total).toBe(-1);
      expect(res.breakdown).toContainEqual({ label: 'Wounds', value: -2, type: 'penalty' });
      expect(res.breakdown).toContainEqual({ label: 'Fatigue', value: -1, type: 'penalty' });
      expect(res.breakdown).toContainEqual({ label: 'Distracted Status', value: -2, type: 'penalty' });
      expect(res.breakdown).toContainEqual({ label: 'Illumination (Dim)', value: -2, type: 'situational' });
      expect(res.breakdown).toContainEqual({ label: 'Custom Situational', value: -1, type: 'situational' });
      expect(res.breakdown).toContainEqual({ label: 'Gang Up (+3)', value: 3, type: 'bonus' });
      expect(res.breakdown).toContainEqual({ label: 'Wild Attack', value: 2, type: 'bonus' });
      expect(res.breakdown).toContainEqual({ label: 'Enemy Vulnerable', value: 2, type: 'bonus' });
    });

    it('should merge ranged modifiers (Cover, Range, Vulnerable) with global penalties correctly', () => {
      const store = useUIStore.getState();
      store.updateModifier('cover', 'heavy'); // -6
      store.updateModifier('range', 'medium'); // -2
      store.updateModifier('enemyVulnerable', true); // +2
      store.updateModifier('customModifier', 1); // +1

      const combatModifiers = useUIStore.getState().modifiers;

      const res = calculateUnifiedModifiers({
        wounds: 1, // -1
        fatigue: 0,
        statuses: [],
        combatModifiers,
        rollName: 'Shooting'
      });

      // Expected items:
      // Wounds (-1), Custom (+1), Cover (-6), Range (-2), Vulnerable (+2)
      // Total: -1 + 1 - 6 - 2 + 2 = -6
      expect(res.total).toBe(-6);
      expect(res.breakdown).toContainEqual({ label: 'Wounds', value: -1, type: 'penalty' });
      expect(res.breakdown).toContainEqual({ label: 'Custom Situational', value: 1, type: 'situational' });
      expect(res.breakdown).toContainEqual({ label: 'Heavy Cover', value: -6, type: 'situational' });
      expect(res.breakdown).toContainEqual({ label: 'Medium Range', value: -2, type: 'situational' });
      expect(res.breakdown).toContainEqual({ label: 'Enemy Vulnerable', value: 2, type: 'bonus' });
    });

    it('should NOT apply melee-specific modifiers to ranged rolls or vice-versa', () => {
      const store = useUIStore.getState();
      store.updateModifier('wildAttack', true);
      store.updateModifier('cover', 'light');

      const combatModifiers = useUIStore.getState().modifiers;

      // Fighting (Melee) should have Wild Attack (+2) but NOT Cover (-2)
      const meleeRes = calculateUnifiedModifiers({
        wounds: 0,
        fatigue: 0,
        statuses: [],
        combatModifiers,
        rollName: 'Fighting'
      });
      expect(meleeRes.total).toBe(2);
      expect(meleeRes.breakdown.some(i => i.label.includes('Wild Attack'))).toBe(true);
      expect(meleeRes.breakdown.some(i => i.label.includes('Cover'))).toBe(false);

      // Shooting (Ranged) should have Cover (-2) but NOT Wild Attack (+2)
      const rangedRes = calculateUnifiedModifiers({
        wounds: 0,
        fatigue: 0,
        statuses: [],
        combatModifiers,
        rollName: 'Shooting'
      });
      expect(rangedRes.total).toBe(-2);
      expect(rangedRes.breakdown.some(i => i.label.includes('Wild Attack'))).toBe(false);
      expect(rangedRes.breakdown.some(i => i.label.includes('Cover'))).toBe(true);
    });
  });

  describe('Derived Stats Parry Wild Attack Interaction', () => {
    it('should correctly calculate base parry vs. wild attack penalty', () => {
      const baseParry = calculateParry({ dieType: 8, modifier: 0 });
      expect(baseParry).toBe(6);
      
      const parryWithWildAttack = baseParry + -2;
      expect(parryWithWildAttack).toBe(4);
    });
  });
});
