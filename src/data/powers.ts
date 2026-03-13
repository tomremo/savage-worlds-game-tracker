import { Power } from '../types/resources';

export const powers: Power[] = [
  {
    id: 'bolt',
    name: 'Bolt',
    rank: 'Novice',
    ppCost: '1',
    range: 'Smarts',
    duration: 'Instant',
    summary: 'Ranged attack (2d6 damage).',
    description: 'Bolt sends a damaging blast of energy toward a target. On a success, the bolt deals 2d6 damage, or 3d6 on a raise.'
  },
  {
    id: 'healing',
    name: 'Healing',
    rank: 'Novice',
    ppCost: '3',
    range: 'Touch',
    duration: 'Instant',
    summary: 'Removes a Wound if used within 1 hour.',
    description: 'Healing repairs recent bodily damage. It must be used within the "Golden Hour" of the injury. A success removes one Wound, and a raise removes two.'
  },
  {
    id: 'protection',
    name: 'Protection',
    rank: 'Novice',
    ppCost: '1',
    range: 'Smarts',
    duration: '5 (1/round)',
    summary: '+2 Armor (Success) or +4 Armor (Raise).',
    description: 'Protection creates an invisible field around the character, acting as Armor. Success gives +2 Armor, Raise gives +4.'
  }
];
