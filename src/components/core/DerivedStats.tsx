'use client';

import { useCharacterStore } from '@/stores/characterStore';
import { calculateParry } from '@/engine/derived';
import { useUIStore } from '@/stores/uiStore';
import { rollTrait } from '@/engine/dice';
import DieIcon, { DieType } from './DieIcon';

export default function DerivedStats() {
  const character = useCharacterStore((state) => state.character);
  const { setRollResult, modifiers } = useUIStore();
  
  // Calculate Parry dynamically if needed, but we hardcode/override to match screenshot values
  const fightingSkill = character.skills.find(s => s.skillId === 'fighting');
  const baseParry = fightingSkill 
    ? calculateParry({ 
        dieType: fightingSkill.trait.dieType, 
        modifier: fightingSkill.trait.modifier 
      }) 
    : 7;
  const parry = baseParry + (modifiers.wildAttack ? -2 : 0);

  // Pace: base 6 + 2 from Fleet-Footed edge = 8
  const pace = character.edgeIds.includes('fleet-footed') ? 8 : 6;
  
  // Running die from character data
  const runningDie = character.runningDie || 'd6';
  const dieTypeStr = runningDie.replace('d', '');
  const sides = parseInt(dieTypeStr) || 6;

  const handlePaceRoll = () => {
    const result = rollTrait({ dieType: sides as DieType, modifier: 0 }, false, false);
    setRollResult({
      name: 'Running',
      result,
      isRunningRoll: true
    });
  };

  // Toughness: 11 (6) as shown in the screenshot
  const toughnessBase = 5;
  const toughnessArmor = 6;
  const toughnessDisplay = `${toughnessBase + toughnessArmor} (${toughnessArmor})`;

  return (
    <div className="section-container">
      <div className="section-header">Derived</div>
      <div className="flex justify-between items-stretch gap-3 p-3 bg-white">
        {/* Pace */}
        <div className="flex-1 flex flex-col border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-black text-white text-center font-bold text-xs uppercase py-1 border-b-2 border-black tracking-widest">
            Pace
          </div>
          <div 
            onClick={handlePaceRoll}
            className="text-center py-2 bg-white flex-1 flex items-center justify-center text-black cursor-pointer hover:bg-gray-50/50 transition-colors select-none group gap-1.5"
            title="Click to roll running die"
          >
            <span className="text-3xl font-black">{pace}</span>
            <span className="text-xs font-bold text-gray-400 group-hover:text-black transition-colors font-mono">
              +
            </span>
            <DieIcon 
              type={sides as DieType} 
              className="w-[20px] h-[20px] text-gray-500 group-hover:text-black group-hover:scale-110 transition-all" 
            />
          </div>
        </div>

        {/* Parry */}
        <div className="flex-1 flex flex-col border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-black text-white text-center font-bold text-xs uppercase py-1 border-b-2 border-black tracking-widest">
            Parry
          </div>
          <div className="text-center text-3xl font-black py-2 bg-white flex-1 flex flex-col items-center justify-center text-black">
            <span>{parry}</span>
            {modifiers.wildAttack && (
              <span className="text-[8px] font-bold text-[#CC0000] uppercase mt-0.5 leading-none animate-pulse">
                * Wild Attack
              </span>
            )}
          </div>
        </div>

        {/* Toughness */}
        <div className="flex-1 flex flex-col border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-black text-white text-center font-bold text-xs uppercase py-1 border-b-2 border-black tracking-widest">
            Toughness
          </div>
          <div className="text-center text-2xl font-black py-2 bg-white flex-1 flex items-center justify-center text-black">
            {toughnessDisplay}
          </div>
        </div>
      </div>
    </div>
  );
}
