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
    <header className="fixed top-0 left-0 right-0 h-[12vh] z-50 flex items-center justify-between px-8 bg-white border-b-4 border-black">
      <div className="flex flex-col">
        <h1 className="text-4xl font-extrabold tracking-tight text-black uppercase">
          {character.name}
        </h1>
        <div className="flex gap-2 text-sm font-bold text-gray-700 mt-1">
          <span>{character.rank}</span>
          <span>Male</span>
          <span>{character.ancestry},</span>
          <span>{character.className} game warden</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center">
           <PenaltyBadge penalty={penalty} />
        </div>
        <BenniePool count={character.bennies} />
        {/* Mock Pathfinder/Savage Worlds Logos would go here */}
        <div className="hidden md:block w-32 h-12 bg-gray-200 border border-gray-400 flex items-center justify-center text-[0.6rem] font-bold text-gray-500 uppercase">
          Logo Placeholder
        </div>
      </div>
    </header>
  );
}
