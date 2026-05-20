import { UnifiedModifierInput, UnifiedModifierResult, RollCategory, ModifierItem } from '@/types/modifiers';

/**
 * Categorizes a roll name into Melee, Ranged, or General Trait.
 */
export const getRollCategory = (name: string): RollCategory => {
  const lower = name.toLowerCase();
  if (lower.includes('fighting')) return 'melee';
  if (
    lower.includes('shooting') || 
    lower.includes('athletics') || 
    lower.includes('throwing') || 
    lower.includes('bow')
  ) {
    return 'ranged';
  }
  return 'general_trait';
};

/**
 * Combines global character penalties and combat situational modifiers
 * into a single unified total and details breakdown.
 */
export const calculateUnifiedModifiers = (input: UnifiedModifierInput): UnifiedModifierResult => {
  const { wounds, fatigue, statuses, combatModifiers, rollName, isRunningRoll = false } = input;
  const breakdown: ModifierItem[] = [];

  // 1. Running rolls bypass all penalties and modifiers
  if (isRunningRoll) {
    return { total: 0, breakdown: [] };
  }

  // 2. Apply Global Trait Penalties
  // Wounds (each inflicts -1 penalty, max -3)
  if (wounds > 0) {
    const woundPenalty = -Math.min(3, wounds);
    breakdown.push({ 
      label: 'Wounds', 
      value: woundPenalty, 
      type: 'penalty' 
    });
  }
  // Fatigue (each inflicts -1 penalty)
  if (fatigue > 0) {
    breakdown.push({ 
      label: 'Fatigue', 
      value: -fatigue, 
      type: 'penalty' 
    });
  }
  // Distracted Status (-2 to all Trait rolls)
  if (statuses.includes('Distracted')) {
    breakdown.push({ 
      label: 'Distracted Status', 
      value: -2, 
      type: 'penalty' 
    });
  }

  // 3. Apply General Combat/Situational Modifiers (Applies to all actions)
  // Illumination
  if (combatModifiers.illumination === 'dim') {
    breakdown.push({ label: 'Illumination (Dim)', value: -2, type: 'situational' });
  } else if (combatModifiers.illumination === 'dark') {
    breakdown.push({ label: 'Illumination (Dark)', value: -4, type: 'situational' });
  } else if (combatModifiers.illumination === 'pitch-black') {
    breakdown.push({ label: 'Illumination (Black)', value: -6, type: 'situational' });
  }

  // Custom Situational Modifier
  if (combatModifiers.customModifier !== 0) {
    breakdown.push({ 
      label: 'Custom Situational', 
      value: combatModifiers.customModifier, 
      type: 'situational' 
    });
  }

  // 4. Apply Category-Specific Modifiers
  const category = getRollCategory(rollName);

  // Enemy Vulnerable Attack Bonus (+2 to melee and ranged attacks)
  if (combatModifiers.enemyVulnerable && (category === 'melee' || category === 'ranged')) {
    breakdown.push({ label: 'Enemy Vulnerable', value: 2, type: 'bonus' });
  }

  // Melee-Specific
  if (category === 'melee') {
    if (combatModifiers.gangUp > 0) {
      breakdown.push({ 
        label: `Gang Up (+${combatModifiers.gangUp})`, 
        value: combatModifiers.gangUp, 
        type: 'bonus' 
      });
    }
    if (combatModifiers.wildAttack) {
      breakdown.push({ label: 'Wild Attack', value: 2, type: 'bonus' });
    }
  }

  // Ranged-Specific
  if (category === 'ranged') {
    if (combatModifiers.cover !== 'none') {
      const val = combatModifiers.cover === 'light' ? -2 
                : combatModifiers.cover === 'medium' ? -4 
                : combatModifiers.cover === 'heavy' ? -6 
                : -8;
      const capCover = combatModifiers.cover.charAt(0).toUpperCase() + combatModifiers.cover.slice(1);
      breakdown.push({ label: `${capCover} Cover`, value: val, type: 'situational' });
    }
    if (combatModifiers.range !== 'short') {
      const val = combatModifiers.range === 'medium' ? -2 
                : combatModifiers.range === 'long' ? -4 
                : -6;
      const capRange = combatModifiers.range.charAt(0).toUpperCase() + combatModifiers.range.slice(1);
      breakdown.push({ label: `${capRange} Range`, value: val, type: 'situational' });
    }
  }

  const total = breakdown.reduce((sum, item) => sum + item.value, 0);
  return { total, breakdown };
};
