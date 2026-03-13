import { describe, it, expect } from 'vitest';
import { calculateParry, calculateToughness } from '../derived';

describe('Derived Stats Engine', () => {
  describe('calculateParry', () => {
    it('should calculate parry as 2 + half Fighting die type', () => {
      expect(calculateParry({ dieType: 4, modifier: 0 })).toBe(4);
      expect(calculateParry({ dieType: 6, modifier: 0 })).toBe(5);
      expect(calculateParry({ dieType: 8, modifier: 0 })).toBe(6);
      expect(calculateParry({ dieType: 12, modifier: 0 })).toBe(8);
    });

    it('should handle d12+x modifiers correctly (half modifier rounded down)', () => {
      expect(calculateParry({ dieType: 12, modifier: 1 })).toBe(8); // 2 + 6 + floor(0.5)
      expect(calculateParry({ dieType: 12, modifier: 2 })).toBe(9); // 2 + 6 + 1
    });

    it('should apply additional bonuses (e.g. Shields)', () => {
      expect(calculateParry({ dieType: 8, modifier: 0 }, 1)).toBe(7); // 6 + 1
    });
  });

  describe('calculateToughness', () => {
    it('should calculate toughness as 2 + half Vigor die type + Armor', () => {
      expect(calculateToughness({ dieType: 4, modifier: 0 }, 0)).toBe(4);
      expect(calculateToughness({ dieType: 8, modifier: 0 }, 2)).toBe(8); // 2 + 4 + 2
    });

    it('should handle d12+x modifiers for Vigor', () => {
      expect(calculateToughness({ dieType: 12, modifier: 1 }, 0)).toBe(8);
      expect(calculateToughness({ dieType: 12, modifier: 2 }, 0)).toBe(9);
    });

    it('should account for character Size', () => {
      expect(calculateToughness({ dieType: 8, modifier: 0 }, 0, 1)).toBe(7); // 2 + 4 + 0 + 1
      expect(calculateToughness({ dieType: 8, modifier: 0 }, 0, -1)).toBe(5); // 2 + 4 + 0 - 1
    });
  });
});
