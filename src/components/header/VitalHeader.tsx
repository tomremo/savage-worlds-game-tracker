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
    <header className="fixed top-0 left-0 right-0 h-[15vh] z-50 flex items-center justify-between px-6 parchment-card border-b-2 border-sepia-mid">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold leading-tight truncate max-w-[150px]">
          {character.name}
        </h1>
        <span className="text-xs italic text-sepia-mid">
          {character.ancestry} {character.className}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <PenaltyBadge penalty={penalty} />
        <BenniePool count={character.bennies} />
      </div>
    </header>
  );
}
