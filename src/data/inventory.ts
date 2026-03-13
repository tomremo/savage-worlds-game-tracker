import { Gear } from '../types/resources';

export const gear: Gear[] = [
  {
    id: 'bastard-sword',
    name: 'Bastard Sword',
    type: 'Weapon',
    cost: 50,
    weight: 6,
    summary: 'Str+d8 damage, AP 1.',
    stats: { damage: 'Str+d8', ap: 1 }
  },
  {
    id: 'composite-bow',
    name: 'Composite Bow',
    type: 'Weapon',
    cost: 100,
    weight: 2,
    summary: 'Str+d6 damage, Range 12/24/48, AP 1.',
    stats: { damage: 'Str+d6', range: '12/24/48', ap: 1 }
  },
  {
    id: 'aegis-breastplate',
    name: 'Aegis Breastplate',
    type: 'Armor',
    cost: 200,
    weight: 20,
    summary: '+5 Protection, Torso.',
    stats: { protection: 5, coverage: 'Torso' }
  },
  {
    id: 'leather-cap',
    name: 'Leather Cap',
    type: 'Armor',
    cost: 10,
    weight: 1,
    summary: '+2 Protection, Head.',
    stats: { protection: 2, coverage: 'Head' }
  }
];
