import { Hindrance } from '../types/resources';

export const hindrances: Hindrance[] = [
  {
    id: 'driven',
    name: 'Driven',
    type: 'Major',
    summary: 'Character is obsessed with a goal.',
    description: 'A character with this Hindrance has a single-minded goal. It should be significant enough that it affects his life on a regular basis.'
  },
  {
    id: 'quirk',
    name: 'Quirk',
    type: 'Minor',
    summary: 'A minor personality oddity.',
    description: 'Your character has some minor personality oddity. While usually harmless, it might occasionally cause a -1 penalty to social interaction rolls if the Quirk is besonders relevant.'
  },
  {
    id: 'clueless',
    name: 'Clueless',
    type: 'Major',
    summary: '-2 to Common Knowledge and Notice rolls.',
    description: 'Your hero doesn’t pay much attention to the world around him. He suffers a -2 penalty to Common Knowledge and Notice rolls.'
  }
];
