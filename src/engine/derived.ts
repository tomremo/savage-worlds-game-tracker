import { TraitRollRequest } from './dice';

export const calculateParry = (fighting: TraitRollRequest, bonus: number = 0): number => {
  const base = 2 + fighting.dieType / 2;
  const modBonus = Math.floor(fighting.modifier / 2);
  return base + modBonus + bonus;
};

export const calculateToughness = (vigor: TraitRollRequest, armor: number = 0, size: number = 0): number => {
  const base = 2 + vigor.dieType / 2;
  const modBonus = Math.floor(vigor.modifier / 2);
  return base + modBonus + armor + size;
};
