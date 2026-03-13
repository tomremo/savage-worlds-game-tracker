export type DieType = 4 | 6 | 8 | 10 | 12;

export interface TraitRollRequest {
  dieType: DieType;
  modifier: number;
}

export interface DieResult {
  sides: number;
  initial: number;
  total: number;
  aces: number;
  rolls: number[];
}

export interface TraitRollResult {
  traitDie: DieResult;
  wildDie?: DieResult;
  finalResult: number;
  isCriticalFailure: boolean;
}

const rollSingleDie = (sides: number): number => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return Math.floor((array[0] / (0xffffffff + 1)) * sides) + 1;
};

const rollAcingDie = (sides: number): DieResult => {
  const rolls: number[] = [];
  let currentRoll = rollSingleDie(sides);
  rolls.push(currentRoll);
  
  while (currentRoll === sides) {
    currentRoll = rollSingleDie(sides);
    rolls.push(currentRoll);
  }
  
  const initial = rolls[0];
  const total = rolls.reduce((sum, r) => sum + r, 0);
  const aces = rolls.length - 1;
  
  return { sides, initial, total, aces, rolls };
};

export const rollTrait = (request: TraitRollRequest, includeWildDie: boolean = false): TraitRollResult => {
  const traitRes = rollAcingDie(request.dieType);
  let wildRes: DieResult | undefined;
  
  if (includeWildDie) {
    wildRes = rollAcingDie(6); // Wild die is always d6
  }
  
  const isCriticalFailure = includeWildDie && traitRes.initial === 1 && wildRes?.initial === 1;
  
  const bestTotal = wildRes ? Math.max(traitRes.total, wildRes.total) : traitRes.total;
  const finalResult = bestTotal + request.modifier;
  
  return {
    traitDie: traitRes,
    wildDie: wildRes,
    finalResult,
    isCriticalFailure,
  };
};
