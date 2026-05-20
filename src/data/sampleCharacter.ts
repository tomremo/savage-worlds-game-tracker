import { Character } from '../types/character';
import { adaptSwadeCharacter } from './characterAdapter';
import rawAstreus from './astreus.json';
import { SwadeCharacter } from '../types/swade';

export const astreusHelvetica: Character = adaptSwadeCharacter(rawAstreus as unknown as SwadeCharacter);
