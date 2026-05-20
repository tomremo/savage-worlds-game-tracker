'use client';

import { useState, useEffect, useRef } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useCharacterStore } from '@/stores/characterStore';
import { calculateUnifiedModifiers } from '@/engine/modifiers';
import DieIcon, { DieType } from '../core/DieIcon';
import { playDiceRollSound, playCollisionSound } from '@/engine/diceSound';
import { PhysicsDie, DieSides, DICE_CONFIG } from '@/engine/diceRenderer';

export default function RollResult() {
  const { rollOverlayVisible, activeRollResult, setRollOverlayVisible, modifiers, enable3dDice } = useUIStore();
  const character = useCharacterStore(state => state.character);

  const [prevRoll, setPrevRoll] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(enable3dDice);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Derive unique roll identifier to detect new rolls
  const rollId = activeRollResult ? `${activeRollResult.name}-${activeRollResult.result.finalResult}-${activeRollResult.result.traitDie.rolls.join(',')}` : null;

  if (rollId !== prevRoll) {
    setPrevRoll(rollId);
    setIsAnimating(enable3dDice);
  }

  // Set animating state and run render loop when overlay becomes visible
  useEffect(() => {
    if (!rollOverlayVisible || !activeRollResult) return;

    if (!enable3dDice) return;

    // Play synthesized initial rattle sound
    playDiceRollSound();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to high-DPI Retina resolution
    const dpr = window.devicePixelRatio || 1;
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);

    // Create the dice physical instances
    const dice: PhysicsDie[] = [];
    const result = activeRollResult.result;

    // Spawning sizes: set size in configuration for optimal fullscreen realism
    DICE_CONFIG.size = 90;

    // Trait die rolls (including exploding aces)
    result.traitDie.rolls.forEach((val, idx) => {
      // Offset starting position per additional ace to prevent perfect overlap
      const offsetFactor = idx - (result.traitDie.rolls.length - 1) / 2;
      const startX = canvasWidth * 0.5 - 60 + offsetFactor * 45 + (Math.random() * 30 - 15);
      const startY = canvasHeight * 0.5 + (Math.random() * 40 - 20);
      const die = new PhysicsDie(
        result.traitDie.sides as DieSides,
        false,
        val,
        startX,
        startY
      );
      // Scatter velocity dynamically
      die.vx += offsetFactor * 3.5;
      dice.push(die);
    });

    // Wild die rolls (including exploding aces)
    const wildDie = result.wildDie;
    if (wildDie) {
      wildDie.rolls.forEach((val, idx) => {
        // Offset starting position per additional ace to prevent perfect overlap
        const offsetFactor = idx - (wildDie.rolls.length - 1) / 2;
        const startX = canvasWidth * 0.5 + 60 + offsetFactor * 45 + (Math.random() * 30 - 15);
        const startY = canvasHeight * 0.5 + (Math.random() * 40 - 20);
        const die = new PhysicsDie(
          wildDie.sides as DieSides,
          true,
          val,
          startX,
          startY
        );
        // Scatter velocity dynamically
        die.vx += offsetFactor * 3.5;
        dice.push(die);
      });
    }

    let animationFrameId: number;
    const startTime = Date.now();
    const duration = DICE_CONFIG.duration;

    const handleResize = () => {
      if (!canvas) return;
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      ctx.restore();
      ctx.save();
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    const loop = () => {
      // Clear canvas with transparent background so underlying page elements show
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // 1. Resolve pairwise die-to-die collisions with rigid-body physics and clatter sounds
      for (let i = 0; i < dice.length; i++) {
        for (let j = i + 1; j < dice.length; j++) {
          dice[i].checkDieToDieCollision(dice[j], (type, spd) => {
            playCollisionSound(type, spd);
          });
        }
      }

      // 2. Update and draw each die
      let allSettled = true;
      dice.forEach((die) => {
        die.update(canvasWidth, canvasHeight, (type, spd) => {
          playCollisionSound(type, spd);
        });
        die.draw(ctx, DICE_CONFIG.size);
        if (!die.settled) {
          allSettled = false;
        }
      });

      const elapsed = Date.now() - startTime;
      const forceSettle = elapsed >= duration;

      if (forceSettle) {
        dice.forEach(d => {
          d.settled = true;
        });
        allSettled = true;
      }

      if (allSettled) {
        // Redraw one final frame with perfect frontmost face alignment
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        dice.forEach(d => {
          d.rx = 0;
          d.ry = 0;
          d.rz = 0;
          d.z = 0;
          d.draw(ctx, DICE_CONFIG.size);
        });
        setIsAnimating(false);
      } else {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [rollOverlayVisible, activeRollResult, enable3dDice]);

  if (!rollOverlayVisible || !activeRollResult) return null;

  const { name, result, isRunningRoll } = activeRollResult;

  const { total: combinedModifier, breakdown } = calculateUnifiedModifiers({
    wounds: character.wounds,
    fatigue: character.fatigue,
    statuses: character.statuses,
    combatModifiers: modifiers,
    rollName: name,
    isRunningRoll
  });

  const finalTotal = result.finalResult + combinedModifier;
  const isSuccess = !isRunningRoll && finalTotal >= 4;
  const raises = !isRunningRoll ? Math.floor((finalTotal - 4) / 4) : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      {/* 3D Fullscreen Projected Canvas */}
      {enable3dDice && (
        <canvas 
          ref={canvasRef} 
          className="fixed inset-0 pointer-events-none z-[150] w-full h-full block" 
        />
      )}

      {/* Result Card: Fades in smoothly only after dice have settled */}
      {(!enable3dDice || !isAnimating) && (
        <div 
          className="w-full max-w-sm bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-500 z-[160]"
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

              {breakdown.length > 0 && (
                <div className="border-t border-dashed border-gray-200 mt-2 pt-2 space-y-1">
                  <div className="text-[8px] font-black uppercase text-gray-400 tracking-wider mb-1">Active Roll Modifiers</div>
                  {breakdown.map((mod, index) => (
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
      )}
    </div>
  );
}


