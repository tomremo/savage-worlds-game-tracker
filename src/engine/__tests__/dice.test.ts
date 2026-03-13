import { describe, it, expect, vi } from 'vitest';
import { rollTrait } from '../dice';

describe('Dice Engine', () => {
  describe('rollTrait', () => {
    it('should roll a single trait die and return the result', () => {
      // Mock random to return a fixed value
      // d6 roll: 0.5 * 6 = 3
      vi.spyOn(crypto, 'getRandomValues').mockImplementation((buffer) => {
        if (buffer instanceof Uint32Array) {
          buffer[0] = Math.floor(0.5 * 0xffffffff);
        }
        return buffer;
      });

      const result = rollTrait({ dieType: 6, modifier: 0 });
      expect(result.traitDie.initial).toBe(3);
      vi.restoreAllMocks();
    });

    it('should ace when the max value is rolled', () => {
      let callCount = 0;
      vi.spyOn(crypto, 'getRandomValues').mockImplementation((buffer) => {
        if (buffer instanceof Uint32Array) {
          if (callCount === 0) {
            buffer[0] = 0xffffffff; // Max value -> 6
          } else {
            buffer[0] = Math.floor(0.4 * 0xffffffff); // 0.4 * 6 -> 3
          }
          callCount++;
        }
        return buffer;
      });

      const result = rollTrait({ dieType: 6, modifier: 0 });
      expect(result.traitDie.total).toBe(9); // 6 + 3
      expect(result.traitDie.aces).toBe(1);
      vi.restoreAllMocks();
    });

    it('should roll a wild die alongside the trait die', () => {
      // Mock random to return 4 for trait (d8) and 6 for wild (d6)
      let callCount = 0;
      vi.spyOn(crypto, 'getRandomValues').mockImplementation((buffer) => {
        if (buffer instanceof Uint32Array) {
          if (callCount === 0) buffer[0] = Math.floor(0.5 * 0xffffffff); // d8 -> 4
          if (callCount === 1) buffer[0] = 0xffffffff; // Wild d6 -> 6 (Ace)
          if (callCount === 2) buffer[0] = Math.floor(0.2 * 0xffffffff); // Wild d6 Ace -> 2
          callCount++;
        }
        return buffer;
      });

      const result = rollTrait({ dieType: 8, modifier: 0 }, true);
      expect(result.traitDie.total).toBe(4);
      expect(result.wildDie?.total).toBe(8); // 6 + 2
      expect(result.finalResult).toBe(8);
      vi.restoreAllMocks();
    });

    it('should apply modifiers after taking the better of two dice', () => {
      // Trait d8 -> 4, Wild d6 -> 2. Result 4. Modifier +2. Final 6.
      let callCount = 0;
      vi.spyOn(crypto, 'getRandomValues').mockImplementation((buffer) => {
        if (buffer instanceof Uint32Array) {
          if (callCount === 0) buffer[0] = Math.floor(0.5 * 0xffffffff); // d8 -> 4
          if (callCount === 1) buffer[0] = Math.floor(0.2 * 0xffffffff); // d6 -> 2
          callCount++;
        }
        return buffer;
      });

      const result = rollTrait({ dieType: 8, modifier: 2 }, true);
      expect(result.finalResult).toBe(6);
      vi.restoreAllMocks();
    });

    it('should detect critical failure (natural 1 on both)', () => {
      let callCount = 0;
      vi.spyOn(crypto, 'getRandomValues').mockImplementation((buffer) => {
        if (buffer instanceof Uint32Array) {
          buffer[0] = 0; // Natural 1
          callCount++;
        }
        return buffer;
      });

      const result = rollTrait({ dieType: 6, modifier: 0 }, true);
      expect(result.isCriticalFailure).toBe(true);
      vi.restoreAllMocks();
    });
  });
});
