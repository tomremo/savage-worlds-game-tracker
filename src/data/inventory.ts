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
  },
  // SWADE JSON Augmented Items
  {
    id: 'arrows-damaging-electric',
    name: 'Arrows, Damaging Electric',
    type: 'Mundane',
    cost: 1,
    weight: 3,
    summary: '6 arrows with damaging electric enchantment. / Custom p.110'
  },
  {
    id: 'backpack',
    name: 'Backpack',
    type: 'Mundane',
    cost: 2,
    weight: 13,
    summary: 'Halves the effective weight of contents. / Pathfinder p.106'
  },
  {
    id: 'climbers-kit',
    name: "Climber's Kit (negate 2 penalty)",
    type: 'Mundane',
    cost: 80,
    weight: 10,
    summary: 'Rope, pitons, crampons, hammer, and other climbing gear. Ignore 2 points penalties when climbing. / Pathfinder p.107'
  },
  {
    id: 'healers-kit',
    name: "Healer's Kit (-1 healing w/o)",
    type: 'Mundane',
    cost: 50,
    weight: 1,
    summary: 'Rudimentary medical equipment including salves and dressings. -1 Healing without it. / Pathfinder p.107'
  },
  {
    id: 'adventurers-kit',
    name: "Adventurer's Kit (p107)",
    type: 'Mundane',
    cost: 50,
    weight: 8,
    summary: 'bedroll, candle, chalk, extra clothing, flint & steel, grappling hook, bullseye lantern, small mirror, hemp rope, oil, shovel, soap, 3x torches, waterskin, whetstone, 1 weeks meals / Custom p.107'
  },
  {
    id: 'arrows',
    name: 'Arrows',
    type: 'Mundane',
    cost: 1,
    weight: 3,
    summary: '20 arrows. / Pathfinder p.110'
  },
  {
    id: 'everburning-torch',
    name: 'Everburning Torch',
    type: 'Mundane',
    cost: 110,
    weight: 0,
    summary: 'Permanently enchanted with light LBT. Does not burn or emit heat. / Custom p.60'
  },
  {
    id: 'horse-light',
    name: 'Horse, light (p248)',
    type: 'Mundane',
    cost: 75,
    weight: 0,
    summary: 'Light riding horse. / Pathfinder p.107'
  },
  {
    id: 'ring-of-protection-minor',
    name: 'Ring of Protection, Minor (+2 Armor)',
    type: 'Mundane',
    cost: 4000,
    weight: 0,
    summary: 'Protection Power does not stack. (+2 Armor) / Pathfinder p.214'
  }
];
