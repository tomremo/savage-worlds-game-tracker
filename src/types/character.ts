import { Rank, Trait } from './resources';

export interface Character {
  id: string;
  name: string;
  ancestry: string;
  className: string;
  rank: Rank;
  experience: number;
  size: number;

  attributes: {
    agility: Trait;
    smarts: Trait;
    spirit: Trait;
    strength: Trait;
    vigor: Trait;
  };

  skills: {
    skillId: string;
    trait: Trait;
  }[];

  wounds: number;
  fatigue: number;
  bennies: number;
  statuses: string[];

  edgeIds: string[];
  hindranceIds: string[];
  powerIds: string[];
  inventoryIds: string[];

  // For active tracking
  currentPowerPoints: number;
  maxPowerPoints: number;
  wealth: number;
  languages: string[];
}
