import { describe, it, expect } from 'vitest';
import { adaptSwadeCharacter } from '../characterAdapter';
import { SwadeCharacter } from '../../types/swade';

describe('Character Adapter', () => {
  const baseMockSwadeCharacter: SwadeCharacter = {
    saveID: 12345,
    id: 1,
    name: 'Test Character',
    attributes: [
      { name: 'Agility', label: 'AGI', value: 'd8', mod: 0, dieValue: 8 },
      { name: 'Smarts', label: 'SMT', value: 'd6', mod: 0, dieValue: 6 },
      { name: 'Spirit', label: 'SPR', value: 'd6', mod: 0, dieValue: 6 },
      { name: 'Strength', label: 'STR', value: 'd6', mod: 0, dieValue: 6 },
      { name: 'Vigor', label: 'VIG', value: 'd6', mod: 0, dieValue: 6 }
    ]
  };

  it('should map runningDie when it is present in the raw data', () => {
    const raw: SwadeCharacter = {
      ...baseMockSwadeCharacter,
      runningDie: 'd8'
    };
    const adapted = adaptSwadeCharacter(raw);
    expect(adapted.runningDie).toBe('d8');
  });

  it('should default runningDie to d6 when it is not present in the raw data', () => {
    const raw: SwadeCharacter = {
      ...baseMockSwadeCharacter
    };
    const adapted = adaptSwadeCharacter(raw);
    expect(adapted.runningDie).toBe('d6');
  });
});
