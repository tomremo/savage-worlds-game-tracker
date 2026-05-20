import { Character } from '../types/character';
import { SwadeCharacter, SwadeAttribute, SwadeGear } from '../types/swade';
import { DieType } from '../engine/dice';
import { Rank, Trait } from '../types/resources';

export const mapSkillId = (name: string): string => {
  const n = name.toLowerCase().trim();
  if (n.includes('athletics')) return 'athletics';
  if (n.includes('common knowledge')) return 'common-knowledge';
  if (n.includes('fighting')) return 'fighting';
  if (n.includes('healing')) return 'healing';
  if (n.includes('notice')) return 'notice';
  if (n.includes('persuasion')) return 'persuasion';
  if (n.includes('shooting')) return 'shooting';
  if (n.includes('stealth')) return 'stealth';
  if (n.includes('survival')) return 'survival';
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export const mapEdgeId = (name: string): string => {
  const n = name.toLowerCase().trim();
  if (n.includes('alertness')) return 'alertness';
  if (n.includes('ambidextrous')) return 'ambidextrous';
  if (n.includes('fleet-footed')) return 'fleet-footed';
  if (n.includes('quarry')) return 'quarry';
  if (n.includes('quick')) return 'quick';
  if (n.includes('ranger')) return 'ranger';
  if (n.includes('trademark weapon')) return 'trademark-weapon';
  if (n.includes('two-weapon fighting')) return 'two-weapon-fighting';
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export const mapHindranceId = (name: string): string => {
  const n = name.toLowerCase().trim();
  if (n.includes('driven')) return 'driven';
  if (n.includes('lightweight')) return 'quirk-lightweight';
  if (n.includes('dogs')) return 'quirk-dogs';
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export const mapGearId = (name: string): string => {
  const n = name.toLowerCase().trim();
  if (n.includes('composite bow') || n === 'bow, composite') return 'composite-bow';
  if (n.includes('bastard sword') || n.includes('sword, bastard')) return 'bastard-sword';
  if (n.includes('long sword') || n.includes('sword, long')) return 'bastard-sword'; // Fallback alias
  if (n.includes('hood/helm')) return 'leather-cap';
  if (n.includes('shirt')) return 'aegis-breastplate';
  if (n.includes('jacket')) return 'aegis-breastplate';
  if (n.includes('damaging electric')) return 'arrows-damaging-electric';
  if (n.includes('backpack')) return 'backpack';
  if (n.includes('climber')) return 'climbers-kit';
  if (n.includes('healer')) return 'healers-kit';
  if (n.includes('adventurer')) return 'adventurers-kit';
  if (n.includes('arrows')) return 'arrows';
  if (n.includes('everburning')) return 'everburning-torch';
  if (n.includes('horse')) return 'horse-light';
  if (n.includes('ring of protection')) return 'ring-of-protection-minor';
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const mapAttribute = (rawAttr: SwadeAttribute | undefined): Trait => {
  const dieType = (rawAttr?.dieValue || 6) as DieType;
  const modifier = rawAttr?.mod || 0;
  return { dieType, modifier };
};

export const adaptSwadeCharacter = (raw: SwadeCharacter): Character => {
  // Map attributes array to structured attributes object
  const findAttribute = (name: string) => raw.attributes?.find(a => a.name.toLowerCase() === name);
  
  const attributes = {
    agility: mapAttribute(findAttribute('agility')),
    smarts: mapAttribute(findAttribute('smarts')),
    spirit: mapAttribute(findAttribute('spirit')),
    strength: mapAttribute(findAttribute('strength')),
    vigor: mapAttribute(findAttribute('vigor'))
  };

  // Map skills list
  const skills = raw.skills?.map(s => {
    const skillId = mapSkillId(s.name);
    const dieType = (s.dieValue || 4) as DieType;
    const modifier = s.mod || 0;
    return {
      skillId,
      trait: { dieType, modifier }
    };
  }) || [];

  // Map special abilities
  const specialAbilities = raw.abilities?.map(a => {
    let description = a.description || '';
    if (a.takenFrom) {
      description += ` / ${a.takenFrom}`;
    }
    return {
      name: a.name || '',
      description,
      source: a.takenFrom || a.from || undefined
    };
  }) || [];

  // Map advances
  const advances = raw.advances?.map(a => {
    const num = a.number || 0;
    let rank = 'Novice';
    if (num > 15) rank = 'Legendary';
    else if (num > 11) rank = 'Heroic';
    else if (num > 7) rank = 'Veteran';
    else if (num > 3) rank = 'Seasoned';
    return {
      rank,
      number: num,
      detail: a.description || a.name || ''
    };
  }) || [];

  // Map Edges and Hindrances
  const edgeIds = raw.edges?.map(e => mapEdgeId(e.name)) || [];
  const hindranceIds = raw.hindrances?.map(h => mapHindranceId(h.name)) || [];

  // Gather unique inventory item IDs recursively from gear, weapons, and armors
  const inventoryIds: string[] = [];
  const addInventoryId = (name: string) => {
    const id = mapGearId(name);
    if (id && !inventoryIds.includes(id)) {
      inventoryIds.push(id);
    }
  };

  const processGearItem = (item: SwadeGear) => {
    if (item.name) {
      addInventoryId(item.name);
    }
    if (item.contains?.gear) {
      item.contains.gear.forEach(processGearItem);
    }
  };
  raw.gear?.forEach(processGearItem);

  raw.weapons?.forEach(w => {
    if (w.name && w.name !== 'Unarmed') {
      addInventoryId(w.name);
    }
  });

  raw.armor?.forEach(a => {
    if (a.name && a.name !== '(Unarmored)') {
      addInventoryId(a.name);
    }
  });

  // Dynamic weapons list for UI rendering
  const weapons = raw.weapons?.map(w => {
    const damage = w.damageWithBrackets || w.damage || 'Str';
    let notes = w.notes || '';
    if (w.profiles && w.profiles[0]?.notes) {
      notes = w.profiles[0].notes;
    }
    if (!notes) notes = '-';

    return {
      name: w.name || '',
      damage,
      range: w.range || 'Melee',
      ap: w.ap !== undefined ? w.ap : '0',
      rof: w.rof !== undefined && w.rof > 0 ? w.rof : '-',
      shots: w.shots !== undefined && w.shots > 0 ? w.shots : '-',
      weight: w.weight !== undefined ? w.weight : '0',
      notes
    };
  }) || [];

  // Dynamic armor list for UI rendering
  const armor = raw.armor?.map(a => {
    let notes = a.notes || '';
    if (a.equippedToughness) {
      notes = `Toughness: ${a.equippedToughness}`;
    }
    return {
      name: a.name || '',
      weight: a.weight || 0,
      notes
    };
  }) || [];

  return {
    id: 'astreus-helvetica',
    name: raw.name || 'Astreus Helvetica',
    ancestry: raw.race || 'Half-Elf',
    className: raw.professionOrTitle?.split(' ')[0] || 'Ranger',
    rank: (raw.rankName || 'Seasoned') as Rank,
    experience: raw.xp || 35,
    size: raw.size !== undefined ? raw.size : 0,
    attributes,
    skills,
    wounds: raw.wounds || 0,
    fatigue: raw.fatigue || 0,
    bennies: raw.bennies !== undefined ? raw.bennies : 3,
    statuses: [],
    edgeIds,
    hindranceIds,
    powerIds: [],
    inventoryIds,
    currentPowerPoints: 0,
    maxPowerPoints: 0,
    wealth: raw.wealth !== undefined ? raw.wealth : 30,
    languages: raw.languages && raw.languages.length > 0 ? raw.languages : ['Common', 'Elven'],
    runningDie: raw.runningDie || 'd6',
    specialAbilities,
    advances,
    backgroundText: raw.background || '',
    weapons,
    armor
  };
};
