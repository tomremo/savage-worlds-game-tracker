export interface SwadeAbility {
  name: string;
  description: string;
  note?: string;
  positive?: boolean;
  from?: string;
  takenFrom?: string;
  bookID?: number;
}

export interface SwadeAdvance {
  name: string;
  number: number;
  description: string;
}

export interface SwadeArmor {
  id: number;
  uuid: string;
  name: string;
  weight: number;
  quantity: number;
  armor: number;
  coversFace?: boolean;
  coversHead?: boolean;
  coversTorso?: boolean;
  coversLegs?: boolean;
  coversArms?: boolean;
  notes?: string;
  takenFrom?: string;
  bookID?: number;
  descriptionHTML?: string;
  bookPublisher?: string;
  bookPublished?: string;
  bookName?: string;
  isShield?: boolean;
  equipped?: boolean;
  cost?: number;
  costBuy?: number;
  minStr?: string;
  equippedToughness?: string;
  equippedStrength?: string;
  heavyArmor?: boolean;
}

export interface SwadeAttribute {
  name: string;
  label: string;
  value: string;
  mod: number;
  dieValue: number;
}

export interface SwadeEdge {
  id: number;
  customDescription?: string;
  name: string;
  description: string;
  note?: string;
  takenFrom?: string;
  bookID?: number;
  isHidden?: boolean;
  descriptionHTML?: string;
}

export interface SwadeHindrance {
  id: number;
  name: string;
  customDescription?: string;
  description: string;
  note?: string;
  major?: boolean;
  takenFrom?: string;
  bookID?: number;
  isHidden?: boolean;
  descriptionHTML?: string;
}

export interface SwadeGear {
  id: number;
  uuid: string;
  name: string;
  weight: number;
  quantity: number;
  contains?: {
    gear: SwadeGear[];
    weapons: any[];
    armor: any[];
    shields: any[];
  };
  notes?: string;
  summary?: string;
  descriptionHTML?: string;
  container?: boolean;
  bookPublished?: string;
  bookPublisher?: string;
  equipped?: boolean;
  cost?: number;
  takenFrom?: string;
  bookID?: number;
  costBuy?: number;
}

export interface SwadeWeaponProfile {
  name: string;
  damage: string;
  damageWithBrackets?: string;
  damage_original?: string;
  parry_modifier?: number;
  range: string;
  reach?: number;
  requires_2_hands?: boolean;
  rof?: number;
  shots?: number;
  heavy_weapon?: boolean;
  melee_only?: boolean;
  notes?: string;
  currentShots?: number;
  additionalDamage?: string;
  damageDiceBasePlus?: number;
  damageDiceBase?: string;
  toHitMod?: number;
  is_shield?: boolean;
  thrown_weapon?: boolean;
  usable_in_melee?: boolean;
  counts_as_innate?: boolean;
  add_strength_to_damage?: boolean;
  ap?: number;
  ap_vs_rigid_armor_only?: number;
  vtt_only?: boolean;
  skillName?: string;
  skillValue?: string;
}

export interface SwadeWeapon {
  id: number;
  uuid: string;
  name: string;
  weight: number;
  range: string;
  damage: string;
  equippedAs?: string;
  descriptionHTML?: string;
  damageWithBrackets?: string;
  rof?: number;
  shots?: number;
  ap?: number;
  bookName?: string;
  bookPublisher?: string;
  bookPublished?: string;
  notes?: string;
  takenFrom?: string;
  thrown?: boolean;
  quantity: number;
  reach?: number;
  innate?: boolean;
  damageDiceBase?: string;
  damageDiceBasePlus?: number;
  equipped?: boolean;
  cost?: number;
  costBuy?: number;
  minStr?: string;
  profiles?: SwadeWeaponProfile[];
  bookID?: number;
  activeProfile?: number;
}

export interface SwadeSkill {
  name: string;
  attribute: string;
  value: string;
  dieValue: number;
  mod: number;
  isCore: boolean;
  bookID?: number;
}

export interface SwadeCharacter {
  saveID: number;
  id: number;
  raceGenderAndProfession?: string;
  playerCharacter?: boolean;
  createdDate?: string;
  updatedDate?: string;
  appVersion?: string;
  abilities?: SwadeAbility[];
  advances?: SwadeAdvance[];
  advancesCount?: number;
  age?: string;
  armor?: SwadeArmor[];
  armorValue?: number;
  attributes: SwadeAttribute[];
  background?: string;
  bennies?: number;
  benniesMax?: number;
  bookName?: string;
  edges?: SwadeEdge[];
  fatigue?: number;
  fatigueMax?: number;
  gear?: SwadeGear[];
  gender?: string;
  hindrances?: SwadeHindrance[];
  name: string;
  languages?: any[];
  paceBase?: number;
  paceMod?: number;
  paceTotal?: number;
  parryBase?: number;
  parryMod?: number;
  parryTotal?: number;
  parryShield?: number;
  parryHR?: string;
  professionOrTitle?: string;
  race?: string;
  rank?: number;
  rankName?: string;
  runningDie?: string;
  sanity?: number;
  size?: number;
  sizeLabel?: string;
  skills?: SwadeSkill[];
  allSkills?: SwadeSkill[];
  toughnessBase?: number;
  toughnessMod?: number;
  toughnessTotal?: number;
  toughnessTotalNoArmor?: number;
  toughnessAsRead?: string;
  toughnessAsReadNoHeavy?: string;
  wealth?: number;
  weapons?: SwadeWeapon[];
  wildcard?: boolean;
  wounds?: number;
  woundsBase?: number;
  woundsMax?: number;
  xp?: number;
}
