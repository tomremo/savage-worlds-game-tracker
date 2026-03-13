export interface PenaltyState {
  wounds: number;
  fatigue: number;
  isDistracted: boolean;
}

export const calculateGlobalPenalty = (state: PenaltyState): number => {
  const woundPenalty = -Math.min(3, state.wounds);
  const fatiguePenalty = -state.fatigue;
  const distractedPenalty = state.isDistracted ? -2 : 0;
  
  return woundPenalty + fatiguePenalty + distractedPenalty;
};
