'use client';

import { calculateGlobalPenalty } from '@/engine/penalties';

interface PenaltyBadgeProps {
  wounds: number;
  fatigue: number;
  isDistracted: boolean;
}

export default function PenaltyBadge({ wounds, fatigue, isDistracted }: PenaltyBadgeProps) {
  const penalty = calculateGlobalPenalty({ wounds, fatigue, isDistracted });

  const woundPenalty = Math.min(3, wounds);
  const fatiguePenalty = fatigue;
  const distractedPenalty = isDistracted ? 2 : 0;

  return (
    <div className="relative group select-none">
      {/* Badge Content */}
      <div className="flex flex-col items-center justify-center w-12 h-12 border-2 border-black bg-white shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-50 transition-colors cursor-help">
        <span className="text-xl font-extrabold text-black leading-none pt-1">
          {penalty > 0 ? `+${penalty}` : penalty}
        </span>
        <span className="text-[8px] uppercase font-bold text-black border-t border-black w-full text-center py-0.5 mt-0.5 tracking-wider bg-gray-50 group-hover:bg-white transition-colors">
          Penalty
        </span>
      </div>

      {/* Tooltip Overlay */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black text-white text-xs border-2 border-white shadow-[4px_4px_0px_rgba(0,0,0,1)] p-3 pointer-events-none opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 origin-bottom z-50">
        <div className="font-black uppercase tracking-wider border-b border-gray-700 pb-1 mb-1.5 text-[10px] text-gray-300">
          Penalty Derivation
        </div>
        <div className="space-y-1 font-mono">
          <div className="flex justify-between">
            <span>Wounds:</span>
            <span className={woundPenalty > 0 ? 'text-red-500 font-bold' : ''}>-{woundPenalty}</span>
          </div>
          <div className="flex justify-between">
            <span>Fatigue:</span>
            <span className={fatiguePenalty > 0 ? 'text-red-500 font-bold' : ''}>-{fatiguePenalty}</span>
          </div>
          <div className="flex justify-between">
            <span>Distracted:</span>
            <span className={distractedPenalty > 0 ? 'text-red-500 font-bold' : ''}>-{distractedPenalty}</span>
          </div>
          <div className="flex justify-between border-t border-gray-700 pt-1 mt-1 font-sans font-extrabold uppercase text-[10px] text-white">
            <span>Total:</span>
            <span className={penalty < 0 ? 'text-red-400' : ''}>{penalty > 0 ? `+${penalty}` : penalty}</span>
          </div>
        </div>
        {/* Tooltip Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black"></div>
      </div>
    </div>
  );
}
