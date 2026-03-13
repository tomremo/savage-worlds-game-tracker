import { Edge } from '../types/resources';

export const edges: Edge[] = [
  {
    id: 'alertness',
    name: 'Alertness',
    type: 'Background',
    requirements: { rank: 'Novice' },
    summary: '+2 to Notice rolls.',
    description: 'Your hero is very observant and has a knack for noticing even the smallest details. He adds +2 to his Notice rolls.'
  },
  {
    id: 'ambidextrous',
    name: 'Ambidextrous',
    type: 'Background',
    requirements: { rank: 'Novice', attributes: { agility: 8 } },
    summary: 'Ignore -2 penalty when using off-hand.',
    description: 'Your warrior is as deft with his left hand as he is with his right. He ignores the −2 penalty when using his off-hand (see Off-Hand Weapons, page 126).'
  },
  {
    id: 'quick',
    name: 'Quick',
    type: 'Combat',
    requirements: { rank: 'Novice', attributes: { agility: 8 } },
    summary: 'Discard Action Cards of 5 or lower.',
    description: 'Quick characters have lightning-fast reflexes. When Action Cards are dealt for initiative, if he receives a card of 5 or less, he may discard it and draw again until he gets a card higher than 5.'
  },
  {
    id: 'ranger',
    name: 'Ranger',
    type: 'Class',
    requirements: { rank: 'Novice' },
    summary: 'Wilderness survival and combat specialist.',
    description: 'Rangers are experts in the wilderness. They gain Favored Enemy, Favored Terrain, and Wilderness Stride.'
  },
  {
    id: 'two-weapon-fighting',
    name: 'Two-Weapon Fighting',
    type: 'Combat',
    requirements: { rank: 'Novice', attributes: { agility: 8 } },
    summary: 'Reduce multi-action penalty when using two weapons.',
    description: 'When a character with this Edge makes a Fighting attack with a weapon in each hand, he reduces the Multi-Action penalty by 2.'
  }
];
