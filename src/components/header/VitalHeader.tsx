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
    <header className="w-full flex flex-col md:flex-row items-stretch justify-between gap-6 mb-2 text-black">
      {/* Title Block */}
      <div className="flex-1 border-4 border-black bg-white p-4 md:p-6 flex flex-col justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-black text-black tracking-tight leading-none mb-2 text-center md:text-left select-none">
          {character.name}
        </h1>
        <div className="text-xs sm:text-sm font-sans font-extrabold text-black uppercase tracking-wide text-center md:text-left select-none">
          {character.rank} Male {character.ancestry}, {character.className} game warden
        </div>
      </div>

      {/* Pathfinder & Savage Worlds Stylized Logos & Bennies */}
      <div className="flex flex-col items-center md:items-end justify-between min-w-[280px] gap-3">
        {/* Custom SVG/CSS Logo Box */}
        <div className="w-full h-16 md:h-20 border-4 border-black bg-white flex items-center justify-between px-4 py-2 select-none shadow-[3px_3px_0px_rgba(0,0,0,1)]">
          {/* PATHFINDER Text Logo (Stylized Serif Red) */}
          <div className="flex flex-col justify-center">
            <span className="font-serif font-black italic tracking-widest text-[#CC0000] text-lg sm:text-xl leading-none">
              PATHFINDER
            </span>
            <span className="font-sans font-extrabold text-[7px] tracking-[0.25em] text-black leading-none mt-1">
              ROLEPLAYING GAME
            </span>
          </div>

          {/* Divider */}
          <div className="w-[2px] h-10 bg-black mx-2"></div>

          {/* SAVAGE WORLDS Text Logo */}
          <div className="flex flex-col justify-center items-end text-right">
            <span className="font-serif font-black text-xs text-black tracking-wider leading-none">
              FOR SAVAGE
            </span>
            <div className="bg-black text-white font-serif font-black italic text-[9px] px-1 py-0.5 rounded-sm mt-1 tracking-widest leading-none">
              WORLDS
            </div>
          </div>
        </div>
        
        {/* Bennies & Penalty Badges */}
        <div className="flex items-center gap-6 w-full justify-center md:justify-end mt-1 px-1">
          <PenaltyBadge 
            wounds={character.wounds}
            fatigue={character.fatigue}
            isDistracted={character.statuses.includes('Distracted')}
          />
          <BenniePool count={character.bennies} />
        </div>
      </div>
    </header>
  );
}
