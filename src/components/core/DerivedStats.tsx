'use client';

import { useCharacterStore } from '@/stores/characterStore';
import { calculateParry, calculateToughness } from '@/engine/derived';

export default function DerivedStats() {
  const character = useCharacterStore((state) => state.character);
  
  // Calculate Parry (base 2 + half Fighting)
  // Finding fighting skill
  const fightingSkill = character.skills.find(s => s.skillId === 'fighting');
  const parry = calculateParry({ 
    dieType: fightingSkill?.trait.dieType || 4, 
    modifier: fightingSkill?.trait.modifier || 0 
  });

  // Calculate Toughness (base 2 + half Vigor + armor)
  const toughness = calculateToughness({
    dieType: character.attributes.vigor.dieType,
    modifier: character.attributes.vigor.modifier
  });

  return (
    <div className="section-container">
      <div className="section-header">Derived</div>
      <div className="grid grid-cols-3 divide-x divide-black">
        <div className="data-box">
          <div className="data-box-label">Pace</div>
          <div className="data-box-value">6</div>
        </div>
        <div className="data-box">
          <div className="data-box-label">Parry</div>
          <div className="data-box-value">{parry}</div>
        </div>
        <div className="data-box">
          <div className="data-box-label">Toughness</div>
          <div className="data-box-value">{toughness} (0)</div>
        </div>
      </div>
    </div>
  );
}
