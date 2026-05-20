'use client';

import { useState, useEffect, useRef } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useCharacterStore } from '@/stores/characterStore';
import { calculateUnifiedModifiers } from '@/engine/modifiers';
import DieIcon, { DieType } from '../core/DieIcon';
import { playDiceRollSound } from '@/engine/diceSound';
import { PhysicsDie, DieSides } from '@/engine/diceRenderer';

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

    // Play synthesized sound
    playDiceRollSound();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Create the dice physical instances
    const dice: PhysicsDie[] = [];
    const result = activeRollResult.result;

    // Trait die
    dice.push(new PhysicsDie(
      result.traitDie.sides as DieSides,
      false,
      result.traitDie.initial,
      canvasWidth * 0.3 + (Math.random() * 20 - 10),
      40
    ));

    // Wild die
    if (result.wildDie) {
      dice.push(new PhysicsDie(
        result.wildDie.sides as DieSides,
        true,
        result.wildDie.initial,
        canvasWidth * 0.7 + (Math.random() * 20 - 10),
        40
      ));
    }

    let animationFrameId: number;
    const startTime = Date.now();
    const duration = 1200; // 1.2 seconds duration

    const loop = () => {
      // Clear canvas with brutalist background
      ctx.fillStyle = '#f9fafb'; // bg-gray-50
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Render subtle brutalist background grid lines
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      for (let x = 20; x < canvasWidth; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
      }
      for (let y = 20; y < canvasHeight; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
      }

      // Update and draw each die
      let allSettled = true;
      dice.forEach((die) => {
        die.update(canvasWidth, canvasHeight, 0.45, -0.6);
        die.draw(ctx, 42);
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
        ctx.fillStyle = '#f9fafb';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        for (let x = 20; x < canvasWidth; x += 20) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvasHeight);
          ctx.stroke();
        }
        for (let y = 20; y < canvasHeight; y += 20) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvasWidth, y);
          ctx.stroke();
        }

        dice.forEach(d => {
          d.rx = 0;
          d.ry = 0;
          d.rz = 0;
          d.draw(ctx, 42);
        });
        setIsAnimating(false);
      } else {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
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

        {/* 3D Projected Canvas */}
        {enable3dDice && (
          <div className="relative border-b-2 border-black bg-gray-50 flex items-center justify-center overflow-hidden h-[180px]">
            <canvas 
              ref={canvasRef} 
              width={350} 
              height={180} 
              className="w-full h-full block" 
            />
          </div>
        )}

        {/* Dynamic Tumbling Indicator Banner */}
        {enable3dDice && isAnimating ? (
          <div className="p-12 flex flex-col items-center justify-center bg-white border-b-2 border-black space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-black animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-3.5 h-3.5 bg-black animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-3.5 h-3.5 bg-black animate-bounce"></span>
            </div>
            <div className="text-xs font-extrabold font-serif uppercase tracking-widest text-black">
              Tumbling Dice...
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
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
    </div>
  );
}

