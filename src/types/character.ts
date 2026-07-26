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
  activePowerIds?: string[];
  inventoryIds: string[];


  // For active tracking
  currentPowerPoints: number;
  maxPowerPoints: number;
  wealth: number;
  languages: string[];
  runningDie?: string;

  // Back page properties
  specialAbilities?: { name: string; description: string; source?: string }[];
  advances?: { rank: string; number: number; detail: string }[];
  backgroundText?: string;

  // Dynamic lists derived from JSON for rendering
  weapons?: {
    name: string;
    damage: string;
    range: string;
    ap: string | number;
    rof: string | number;
    shots: string | number;
    weight: string | number;
    notes: string;
  }[];
  armor?: {
    name: string;
    weight: number;
    notes: string;
  }[];
}

