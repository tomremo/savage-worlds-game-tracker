import { describe, it, expect, beforeEach } from 'vitest';
import { useCharacterStore } from '../characterStore';
import { astreusHelvetica } from '../../data/sampleCharacter';

describe('Character Store', () => {
  beforeEach(() => {
    // Reset store before each test if possible, or just re-hydrate with sample
    useCharacterStore.setState({ character: astreusHelvetica });
  });

  it('should initialize with the current character', () => {
    const state = useCharacterStore.getState();
    expect(state.character.name).toBe('Astreus Helvetica');
  });

  it('should update wounds correctly', () => {
    useCharacterStore.getState().updateWounds(1);
    expect(useCharacterStore.getState().character.wounds).toBe(1);

    useCharacterStore.getState().updateWounds(2); // total 3
    expect(useCharacterStore.getState().character.wounds).toBe(3);

    useCharacterStore.getState().updateWounds(5); // should cap at 3 (or whatever max)
    // Actually, usually in SW it can go higher for incapacitated, but let's stick to 3 for now.
    expect(useCharacterStore.getState().character.wounds).toBe(3);
  });

  it('should update fatigue correctly', () => {
    useCharacterStore.getState().updateFatigue(1);
    expect(useCharacterStore.getState().character.fatigue).toBe(1);
  });

  it('should spend and add bennies', () => {
    useCharacterStore.getState().spendBennie();
    expect(useCharacterStore.getState().character.bennies).toBe(2);

    useCharacterStore.getState().addBennie();
    expect(useCharacterStore.getState().character.bennies).toBe(3);
  });

  it('should toggle status conditions', () => {
    useCharacterStore.getState().toggleStatus('Shaken');
    expect(useCharacterStore.getState().character.statuses).toContain('Shaken');

    useCharacterStore.getState().toggleStatus('Shaken');
    expect(useCharacterStore.getState().character.statuses).not.toContain('Shaken');
  });

  it('should update character partials', () => {
    useCharacterStore.getState().updateCharacter({ name: 'New Name', luck: 5 } as any);
    expect(useCharacterStore.getState().character.name).toBe('New Name');
  });

  it('should not spend bennies if none available', () => {
    useCharacterStore.setState({ character: { ...astreusHelvetica, bennies: 0 } });
    useCharacterStore.getState().spendBennie();
    expect(useCharacterStore.getState().character.bennies).toBe(0);
  });
});
