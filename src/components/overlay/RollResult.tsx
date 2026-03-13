'use client';

import { useUIStore } from '@/stores/uiStore';
import { useCharacterStore } from '@/stores/characterStore';
import { calculateGlobalPenalty } from '@/engine/penalties';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm parchment-card p-6 rounded-xl border-2 border-sepia-dark shadow-2xl space-y-4 transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold">{name} Roll</h2>
          <button 
            onClick={() => setRollOverlayVisible(false)}
            className="text-sepia-mid hover:text-accent-red text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-6 bg-sepia-light/20 rounded-lg border border-sepia-light shadow-inner">
          <span className={`text-6xl font-black ${result.isCriticalFailure ? 'text-accent-red animate-bounce' : 'text-sepia-dark'}`}>
            {result.isCriticalFailure ? '!!' : finalTotal}
          </span>
          <span className="text-sm font-bold uppercase mt-2">
            {result.isCriticalFailure ? 'Critical Failure' : isSuccess ? (raises > 0 ? `Success with ${raises} Raise${raises > 1 ? 's' : ''}` : 'Success') : 'Failure'}
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono text-sepia-mid">
          <div className="flex justify-between border-b border-sepia-light pb-1">
            <span>Trait Die (d{result.traitDie.initial})</span>
            <span>{result.traitDie.total} ({result.traitDie.rolls.join(' + ')})</span>
          </div>
          {result.wildDie && (
            <div className="flex justify-between border-b border-sepia-light pb-1">
              <span>Wild Die (d6)</span>
              <span>{result.wildDie.total} ({result.wildDie.rolls.join(' + ')})</span>
            </div>
          )}
          <div className="flex justify-between border-b border-sepia-light pb-1">
            <span>Base Total (Higher)</span>
            <span>{Math.max(result.traitDie.total, result.wildDie?.total || 0)}</span>
          </div>
          {penalty !== 0 && (
            <div className="flex justify-between text-accent-red font-bold">
              <span>Global Penalty</span>
              <span>{penalty}</span>
            </div>
          )}
        </div>

        <button 
          onClick={() => setRollOverlayVisible(false)}
          className="w-full py-3 bg-sepia-dark text-white font-bold rounded-lg hover:bg-sepia-mid transition-colors shadow-lg active:scale-95"
        >
          Close
        </button>
      </div>
    </div>
  );
}
