'use client';

import { useUIStore } from '@/stores/uiStore';
import { useCharacterStore } from '@/stores/characterStore';
import { calculateGlobalPenalty } from '@/engine/penalties';
import DieIcon, { DieType } from '../core/DieIcon';

export default function RollResult() {
  const { rollOverlayVisible, activeRollResult, setRollOverlayVisible, modifiers } = useUIStore();
  const character = useCharacterStore(state => state.character);

  if (!rollOverlayVisible || !activeRollResult) return null;

  const { name, result, isRunningRoll } = activeRollResult;
  const penalty = isRunningRoll ? 0 : calculateGlobalPenalty({
    wounds: character.wounds,
    fatigue: character.fatigue,
    isDistracted: character.statuses.includes('Distracted'),
  });

  // Determine roll type and applicable modifiers
  const rollNameLower = name.toLowerCase();
  const isFighting = rollNameLower.includes('fighting');
  const isRanged = rollNameLower.includes('shooting') || rollNameLower.includes('athletics') || rollNameLower.includes('throwing') || rollNameLower.includes('bow');

  interface ActiveModifier {
    label: string;
    value: number;
  }
  const activeMods: ActiveModifier[] = [];

  if (!isRunningRoll) {
    // 1. Illumination (dim -2, dark -4, pitch-black -6)
    if (modifiers.illumination === 'dim') activeMods.push({ label: 'Illumination (Dim)', value: -2 });
    else if (modifiers.illumination === 'dark') activeMods.push({ label: 'Illumination (Dark)', value: -4 });
    else if (modifiers.illumination === 'pitch-black') activeMods.push({ label: 'Illumination (Black)', value: -6 });

    // 2. Custom Modifier
    if (modifiers.customModifier !== 0) {
      activeMods.push({ label: 'Custom Situational', value: modifiers.customModifier });
    }

    // 3. Enemy Vulnerable (+2)
    if (modifiers.enemyVulnerable && (isFighting || isRanged)) {
      activeMods.push({ label: 'Enemy Vulnerable', value: 2 });
    }

    // 4. Melee Specific Modifiers
    if (isFighting) {
      if (modifiers.gangUp > 0) {
        activeMods.push({ label: `Gang Up (+${modifiers.gangUp})`, value: modifiers.gangUp });
      }
      if (modifiers.wildAttack) {
        activeMods.push({ label: 'Wild Attack', value: 2 });
      }
    }

    // 5. Ranged Specific Modifiers
    if (isRanged) {
      if (modifiers.cover !== 'none') {
        const val = modifiers.cover === 'light' ? -2 : modifiers.cover === 'medium' ? -4 : modifiers.cover === 'heavy' ? -6 : -8;
        const capCover = modifiers.cover.charAt(0).toUpperCase() + modifiers.cover.slice(1);
        activeMods.push({ label: `${capCover} Cover`, value: val });
      }
      if (modifiers.range !== 'short') {
        const val = modifiers.range === 'medium' ? -2 : modifiers.range === 'long' ? -4 : -6;
        const capRange = modifiers.range.charAt(0).toUpperCase() + modifiers.range.slice(1);
        activeMods.push({ label: `${capRange} Range`, value: val });
      }
    }
  }

  const combatModifierSum = activeMods.reduce((acc, m) => acc + m.value, 0);
  const finalTotal = isRunningRoll ? result.finalResult : result.finalResult + penalty + combatModifierSum;
  const isSuccess = !isRunningRoll && finalTotal >= 4;
  const raises = !isRunningRoll ? Math.floor((finalTotal - 4) / 4) : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="w-full max-w-sm bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-black text-white px-4 py-2 flex justify-between items-center">
          <h2 className="text-sm font-black uppercase tracking-widest">{name} Roll</h2>
          <button 
            onClick={() => setRollOverlayVisible(false)}
            className="hover:text-red-500 transition-colors text-xl font-black leading-none"
          >
            ×
          </button>
        </div>

        {/* Main Result Display */}
        <div className="p-8 flex flex-col items-center justify-center border-b-2 border-black bg-gray-50">
          <div className="relative">
            <span className={`text-8xl font-black leading-none ${!isRunningRoll && result.isCriticalFailure ? 'text-red-600 animate-pulse' : 'text-black'}`}>
              {isRunningRoll ? `+${finalTotal}` : (result.isCriticalFailure ? '!!' : finalTotal)}
            </span>
          </div>
          
          <div className={`mt-4 px-6 py-1 border-2 border-black font-black uppercase tracking-tighter text-xl ${
            (!isRunningRoll && result.isCriticalFailure) ? 'bg-red-600 text-white' : 
            (isRunningRoll || isSuccess) ? 'bg-black text-white' : 'bg-white text-black'
          }`}>
            {isRunningRoll ? 'Running Movement' :
             result.isCriticalFailure ? 'Critical Failure' : 
             isSuccess ? (raises > 0 ? `Success +${raises} Raise${raises > 1 ? 's' : ''}` : 'Success') : 
             'Failure'}
          </div>
        </div>

        {/* Breakdown */}
        <div className="p-6 space-y-3 bg-white">
          <div className="space-y-2">
            <div className="flex justify-between items-center pb-1 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-[0.7rem] font-bold uppercase text-gray-500">
                  {isRunningRoll ? 'Running Die' : 'Trait Die'}
                </span>
                <DieIcon type={result.traitDie.sides as DieType} className="w-5 h-5 text-black" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-400">({result.traitDie.rolls.join(' + ')})</span>
                <span className="text-sm font-black">{result.traitDie.total}</span>
              </div>
            </div>

            {result.wildDie && (
              <div className="flex justify-between items-center pb-1 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-[0.7rem] font-bold uppercase text-gray-500">Wild Die</span>
                  <DieIcon type={result.wildDie.sides as DieType} className="w-5 h-5 text-black" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">({result.wildDie.rolls.join(' + ')})</span>
                  <span className="text-sm font-black">{result.wildDie.total}</span>
                </div>
              </div>
            )}

            {penalty !== 0 && (
              <div className="flex justify-between items-center py-1">
                <span className="text-[0.7rem] font-black uppercase text-red-600 italic">Global Penalty</span>
                <span className="text-sm font-black text-red-600">{penalty > 0 ? `+${penalty}` : penalty}</span>
              </div>
            )}

            {activeMods.length > 0 && (
              <div className="border-t border-dashed border-gray-200 mt-2 pt-2 space-y-1">
                <div className="text-[8px] font-black uppercase text-gray-400 tracking-wider mb-1">Combat Modifiers</div>
                {activeMods.map((mod, index) => (
                  <div key={index} className="flex justify-between items-center py-0.5">
                    <span className="text-[0.65rem] font-bold uppercase text-gray-600">{mod.label}</span>
                    <span className={`text-xs font-mono font-black ${mod.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {mod.value > 0 ? `+${mod.value}` : mod.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-gray-50 border-t-2 border-black">
          <button 
            onClick={() => setRollOverlayVisible(false)}
            className="w-full py-4 bg-black text-white font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-none"
          >
            Accept Result
          </button>
        </div>
      </div>
    </div>
  );
}
