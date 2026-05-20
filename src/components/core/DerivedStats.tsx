'use client';

import { useCharacterStore } from '@/stores/characterStore';
import { calculateParry, calculateToughness } from '@/engine/derived';

export default function DerivedStats() {
  const character = useCharacterStore((state) => state.character);
  
  const fightingSkill = character.skills.find(s => s.skillId === 'fighting');
  const parry = calculateParry({ 
    dieType: fightingSkill?.trait.dieType || 4, 
    modifier: fightingSkill?.trait.modifier || 0 
  });

  const toughness = calculateToughness({
    dieType: character.attributes.vigor.dieType,
    modifier: character.attributes.vigor.modifier
  });

  return (
    <div className="section-container">
      <div className="section-header">Derived</div>
      <div className="flex justify-between items-stretch gap-2 p-2 bg-[#f4f4f4]">
        <div className="flex-1 flex flex-col border-2 border-black bg-white">
          <div className="bg-black text-white text-center font-bold text-sm py-1 border-b-2 border-black tracking-wide">Pace</div>
          <div className="text-center text-4xl font-sans py-3 bg-white flex-1 flex items-center justify-center">6</div>
        </div>
        <div className="flex-1 flex flex-col border-2 border-black bg-white">
          <div className="bg-black text-white text-center font-bold text-sm py-1 border-b-2 border-black tracking-wide">Parry</div>
          <div className="text-center text-4xl font-sans py-3 bg-white flex-1 flex items-center justify-center">{parry}</div>
        </div>
        <div className="flex-1 flex flex-col border-2 border-black bg-white">
          <div className="bg-black text-white text-center font-bold text-sm py-1 border-b-2 border-black tracking-wide">Toughness</div>
          <div className="text-center text-4xl font-sans py-3 bg-white flex-1 flex items-center justify-center">{toughness} (5)</div>
        </div>
      </div>
    </div>
  );
}
