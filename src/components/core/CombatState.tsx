'use client';

import { useCharacterStore } from '@/stores/characterStore';
import StatusGrid from './StatusGrid';

export default function CombatState() {
  const character = useCharacterStore((state) => state.character);
  const updateWounds = useCharacterStore((state) => state.updateWounds);
  const updateFatigue = useCharacterStore((state) => state.updateFatigue);

  const currentWounds = character.wounds;
  const currentFatigue = character.fatigue;

  const isInc = currentWounds >= 3 || currentFatigue >= 2;

  const handleFatigueClick = (level: number) => {
    if (currentFatigue === level) {
      updateFatigue(-1); // Decrement
    } else {
      updateFatigue(level - currentFatigue);
    }
  };

  const handleWoundClick = (level: number) => {
    if (currentWounds === level) {
      updateWounds(-1); // Decrement
    } else {
      updateWounds(level - currentWounds);
    }
  };

  const handleIncClick = () => {
    if (isInc) {
      // Clear
      updateWounds(-currentWounds);
      updateFatigue(-currentFatigue);
    } else {
      // Max out
      updateWounds(3 - currentWounds);
      updateFatigue(2 - currentFatigue);
    }
  };

  const boxClass = (active: boolean, isRed: boolean = false) => 
    `w-9 h-9 border-2 border-black flex flex-col items-center justify-center font-bold text-sm cursor-pointer select-none transition-all ${
      active 
        ? isRed ? 'bg-[#CC0000] text-white scale-105' : 'bg-black text-white scale-105'
        : 'bg-white text-black hover:bg-gray-100'
    } shadow-[1px_1px_0px_rgba(0,0,0,1)]`;

  return (
    <div className="p-3 bg-white space-y-4">
      {/* Unified Tracker Row */}
      <div className="flex flex-col items-center justify-center border-2 border-black p-3 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        
        {/* Cells Grid */}
        <div className="grid grid-cols-6 gap-2 w-full max-w-[280px] mb-2 items-center justify-items-center">
          
          {/* Fatigue: -1 */}
          <div 
            onClick={() => handleFatigueClick(1)}
            className={boxClass(currentFatigue >= 1)}
          >
            <span className="text-[10px] leading-none mb-0.5">-1</span>
          </div>

          {/* Fatigue: -2 */}
          <div 
            onClick={() => handleFatigueClick(2)}
            className={boxClass(currentFatigue >= 2)}
          >
            <span className="text-[10px] leading-none mb-0.5">-2</span>
          </div>

          {/* INC */}
          <div 
            onClick={handleIncClick}
            className={`${boxClass(isInc, true)} border-dashed font-black text-xs`}
          >
            <span>INC</span>
          </div>

          {/* Wound: -3 */}
          <div 
            onClick={() => handleWoundClick(3)}
            className={boxClass(currentWounds >= 3)}
          >
            <span className="text-[10px] leading-none mb-0.5">-3</span>
          </div>

          {/* Wound: -2 */}
          <div 
            onClick={() => handleWoundClick(2)}
            className={boxClass(currentWounds >= 2)}
          >
            <span className="text-[10px] leading-none mb-0.5">-2</span>
          </div>

          {/* Wound: -1 */}
          <div 
            onClick={() => handleWoundClick(1)}
            className={boxClass(currentWounds >= 1)}
          >
            <span className="text-[10px] leading-none mb-0.5">-1</span>
          </div>

        </div>

        {/* Labels Row */}
        <div className="flex justify-between w-full max-w-[280px] text-[0.65rem] font-bold uppercase tracking-wider text-black mt-1 px-1 select-none">
          <div className="text-center w-[30%] border-t border-black pt-1">
            Fatigue
          </div>
          <div className="w-[10%]"></div>
          <div className="text-center w-[45%] border-t border-black pt-1">
            Wounds
          </div>
        </div>

      </div>

      {/* Dynamic Status Badges Grid */}
      <StatusGrid />
    </div>
  );
}
