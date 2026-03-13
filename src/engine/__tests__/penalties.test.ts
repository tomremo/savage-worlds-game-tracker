import { describe, it, expect } from 'vitest';
import { calculateGlobalPenalty } from '../penalties';

describe('Penalty Engine', () => {
  describe('calculateGlobalPenalty', () => {
    it('should return 0 for a character with no penalties', () => {
      const penalty = calculateGlobalPenalty({
        wounds: 0,
        fatigue: 0,
        isDistracted: false,
      });
      expect(penalty).toBe(0);
    });

    it('should correctly sum wound penalties (max 3)', () => {
      expect(calculateGlobalPenalty({ wounds: 1, fatigue: 0, isDistracted: false })).toBe(-1);
      expect(calculateGlobalPenalty({ wounds: 3, fatigue: 0, isDistracted: false })).toBe(-3);
      // Even if wounds somehow exceed 3 (e.g. data error), it should cap at -3 for rolls usually, 
      // but let's see what we want. The tracker should probably just show the raw sum.
      // Rulebook: "Each wound... inflicts a -1 penalty... to a maximum of -3".
      expect(calculateGlobalPenalty({ wounds: 4, fatigue: 0, isDistracted: false })).toBe(-3);
    });

    it('should correctly sum fatigue penalties', () => {
      expect(calculateGlobalPenalty({ wounds: 0, fatigue: 1, isDistracted: false })).toBe(-1);
      expect(calculateGlobalPenalty({ wounds: 0, fatigue: 2, isDistracted: false })).toBe(-2);
    });

    it('should apply distracted penalty', () => {
      expect(calculateGlobalPenalty({ wounds: 0, fatigue: 0, isDistracted: true })).toBe(-2);
    });

    it('should sum all penalties correctly', () => {
      expect(calculateGlobalPenalty({
        wounds: 2,
        fatigue: 1,
        isDistracted: true,
      })).toBe(-5); // -2 -1 -2
    });
  });
});
