import { DieType } from '../engine/dice';

export type Rank = 'Novice' | 'Seasoned' | 'Veteran' | 'Heroic' | 'Legendary';

export interface Trait {
  dieType: DieType;
  modifier: number;
}

export interface SkillDefinition {
  id: string;
  name: string;
  linkedAttribute: string;
  isCore: boolean;
}

export type EdgeType = 'Class' | 'Background' | 'Combat' | 'Social' | 'Professional' | 'Power' | 'Weird';

export interface Edge {
  id: string;
  name: string;
  type: EdgeType;
  requirements: {
    rank: Rank;
    attributes?: Record<string, number>;
    skills?: Record<string, number>;
    edges?: string[];
    special?: string;
  };
  summary: string;
  description: string;
}

export interface Hindrance {
  id: string;
  name: string;
  type: 'Major' | 'Minor' | 'Both';
  summary: string;
  description: string;
}

export interface Power {
  id: string;
  name: string;
  rank: Rank;
  ppCost: string;
  range: string;
  duration: string;
  summary: string;
  description: string;
}

export type GearType = 'Mundane' | 'Weapon' | 'Armor' | 'Shield';

export interface Gear {
  id: string;
  name: string;
  type: GearType;
  cost: number;
  weight: number;
  summary: string;
  stats?: {
    damage?: string;
    ap?: number;
    range?: string;
    protection?: number;
    coverage?: string;
    parry?: number;
  };
}
