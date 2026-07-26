import { describe, it, expect, beforeEach } from 'vitest';
import { useCharacterStore } from '../characterStore';

describe('Powers & Power Points Store Actions', () => {
  beforeEach(() => {
    useCharacterStore.setState({
      character: {
        ...useCharacterStore.getState().character,
        currentPowerPoints: 10,
        maxPowerPoints: 10,
        powerIds: ['bolt', 'protection'],
        activePowerIds: [],
      },
    });
  });

  it('should update power points within bounds 0 to maxPP', () => {
    useCharacterStore.getState().updatePowerPoints(-3);
    expect(useCharacterStore.getState().character.currentPowerPoints).toBe(7);

    // Over-deducting should clamp to 0
    useCharacterStore.getState().updatePowerPoints(-15);
    expect(useCharacterStore.getState().character.currentPowerPoints).toBe(0);

    // Adding beyond maxPP should clamp to maxPP (10)
    useCharacterStore.getState().updatePowerPoints(20);
    expect(useCharacterStore.getState().character.currentPowerPoints).toBe(10);
  });

  it('should set max power points and clamp current PP if needed', () => {
    useCharacterStore.getState().setMaxPowerPoints(15);
    expect(useCharacterStore.getState().character.maxPowerPoints).toBe(15);

    useCharacterStore.getState().setMaxPowerPoints(5);
    expect(useCharacterStore.getState().character.maxPowerPoints).toBe(5);
    expect(useCharacterStore.getState().character.currentPowerPoints).toBe(5);
  });

  it('should reset power points to max', () => {
    useCharacterStore.getState().updatePowerPoints(-8);
    expect(useCharacterStore.getState().character.currentPowerPoints).toBe(2);
    useCharacterStore.getState().resetPowerPoints();
    expect(useCharacterStore.getState().character.currentPowerPoints).toBe(10);
  });

  it('should cast power and deduct PP if sufficient', () => {
    const success = useCharacterStore.getState().castPower('bolt', 2);
    expect(success).toBe(true);
    expect(useCharacterStore.getState().character.currentPowerPoints).toBe(8);

    // Failed cast when PP is insufficient
    useCharacterStore.getState().updatePowerPoints(-8); // 0 PP remaining
    const failedCast = useCharacterStore.getState().castPower('healing', 3);
    expect(failedCast).toBe(false);
    expect(useCharacterStore.getState().character.currentPowerPoints).toBe(0);
  });

  it('should toggle active power maintenance status', () => {
    expect(useCharacterStore.getState().character.activePowerIds).not.toContain('protection');

    useCharacterStore.getState().toggleActivePower('protection');
    expect(useCharacterStore.getState().character.activePowerIds).toContain('protection');

    useCharacterStore.getState().toggleActivePower('protection');
    expect(useCharacterStore.getState().character.activePowerIds).not.toContain('protection');
  });
});
