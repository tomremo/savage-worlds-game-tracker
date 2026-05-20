import { Hindrance } from '../types/resources';

export const hindrances: Hindrance[] = [
  {
    id: 'driven',
    name: 'Driven (major, Design )',
    type: 'Major',
    summary: 'The hero\'s actions are an overriding desire that comes up frequently or causes peril for the hero and companions. / Pathfinder p27',
    description: 'The hero\'s actions are an overriding desire that comes up frequently or causes peril.'
  },
  {
    id: 'quirk-lightweight',
    name: 'Quirk (minor, Lightweight: -1 to vigor checks when drinking or smoking)',
    type: 'Minor',
    summary: 'The individual has some minor but persistent foible that often annoys others. / Pathfinder p30',
    description: 'Minor personality oddity.'
  },
  {
    id: 'quirk-dogs',
    name: 'Quirk (minor, Soft spot for dogs and always needs to stop and pet them.)',
    type: 'Minor',
    summary: 'The individual has some minor but persistent foible that often annoys others. / Pathfinder p30',
    description: 'Minor personality oddity.'
  }
];
