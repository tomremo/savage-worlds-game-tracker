'use client';

import { useCharacterStore } from '@/stores/characterStore';
import { calculateGlobalPenalty } from '@/engine/penalties';
import BenniePool from './BenniePool';
import PenaltyBadge from './PenaltyBadge';

export default function VitalHeader() {
  const character = useCharacterStore((state) => state.character);
  const penalty = calculateGlobalPenalty({
    wounds: character.wounds,
    fatigue: character.fatigue,
    isDistracted: character.statuses.includes('Distracted'),
  });

  return (
    <header className="w-full flex flex-col md:flex-row items-stretch justify-between gap-6 mb-2">
      {/* Title Block */}
      <div className="flex-1 border-4 border-black bg-white p-4 md:p-6 flex flex-col justify-center">
        <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-sans text-black tracking-tight leading-none mb-1 text-center md:text-left">
          {character.name}
        </h1>
        <div className="text-xs md:text-sm font-sans text-black mt-2 text-center md:text-left">
          {character.rank} Male {character.ancestry}, {character.className} game warden
        </div>
      </div>

      {/* Logos and Bennies */}
      <div className="flex flex-col items-end justify-between min-w-[300px] gap-2">
        <div className="w-full h-16 md:h-24 border-2 border-dashed border-gray-400 flex items-center justify-center text-sm font-bold text-gray-500 bg-gray-50 uppercase object-contain">
           [ Pathfinder / Savage Worlds Logos ]
        </div>
        
        <div className="flex items-center gap-6 w-full justify-end mt-2 pr-2">
          <div className="flex flex-col items-center">
             <PenaltyBadge penalty={penalty} />
          </div>
          <BenniePool count={character.bennies} />
        </div>
      </div>
    </header>
  );
}
