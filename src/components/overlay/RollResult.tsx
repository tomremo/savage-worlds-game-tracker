'use client';

import { useUIStore } from '@/stores/uiStore';
import { useCharacterStore } from '@/stores/characterStore';
import { calculateGlobalPenalty } from '@/engine/penalties';
import DieIcon from '../core/DieIcon';

export default function RollResult() {
  const { rollOverlayVisible, activeRollResult, setRollOverlayVisible } = useUIStore();
  const character = useCharacterStore(state => state.character);

  if (!rollOverlayVisible || !activeRollResult) return null;

  const { name, result } = activeRollResult;
  const penalty = calculateGlobalPenalty({
    wounds: character.wounds,
    fatigue: character.fatigue,
    isDistracted: character.statuses.includes('Distracted'),
  });

  const finalTotal = result.finalResult + penalty;
  const isSuccess = finalTotal >= 4;
  const raises = Math.floor((finalTotal - 4) / 4);

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
            <span className={`text-8xl font-black leading-none ${result.isCriticalFailure ? 'text-red-600 animate-pulse' : 'text-black'}`}>
              {result.isCriticalFailure ? '!!' : finalTotal}
            </span>
          </div>
          
          <div className={`mt-4 px-6 py-1 border-2 border-black font-black uppercase tracking-tighter text-xl ${
            result.isCriticalFailure ? 'bg-red-600 text-white' : 
            isSuccess ? 'bg-black text-white' : 'bg-white text-black'
          }`}>
            {result.isCriticalFailure ? 'Critical Failure' : 
             isSuccess ? (raises > 0 ? `Success +${raises} Raise${raises > 1 ? 's' : ''}` : 'Success') : 
             'Failure'}
          </div>
        </div>

        {/* Breakdown */}
        <div className="p-6 space-y-3 bg-white">
          <div className="space-y-2">
            <div className="flex justify-between items-center pb-1 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-[0.7rem] font-bold uppercase text-gray-500">Trait Die</span>
                <DieIcon type={result.traitDie.sides as any} className="w-5 h-5 text-black" />
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
                  <DieIcon type={result.wildDie.sides as any} className="w-5 h-5 text-black" />
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
