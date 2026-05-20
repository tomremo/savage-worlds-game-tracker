'use client';

import { useCharacterStore } from '@/stores/characterStore';

export default function Advances() {
  const character = useCharacterStore((state) => state.character);
  const advances = character.advances || [];

  // Group advances by rank
  const noviceAdvances = advances.filter((adv) => adv.rank === 'Novice');
  const seasonedAdvances = advances.filter((adv) => adv.rank === 'Seasoned');

  const renderAdvanceRow = (adv: { number: number; detail: string }) => (
    <div key={adv.number} className="flex items-center text-xs text-black border-b border-gray-400 py-1 last:border-0 select-none">
      <span className="font-extrabold w-6 text-center text-sm">{adv.number}</span>
      <span className="font-medium pl-2 flex-grow underline decoration-gray-400 underline-offset-4 decoration-1">
        {adv.detail}
      </span>
    </div>
  );

  return (
    <div className="section-container bg-white text-black">
      <div className="section-header">Advances</div>
      <div className="p-4 space-y-4">
        {/* Novice Rank */}
        <div className="space-y-2">
          <h3 className="text-center font-extrabold text-sm uppercase tracking-wider text-black border-b-2 border-black pb-1">
            Novice
          </h3>
          <div className="divide-y divide-gray-300">
            {noviceAdvances.map(renderAdvanceRow)}
          </div>
        </div>

        {/* Seasoned Rank */}
        <div className="space-y-2 pt-2">
          <h3 className="text-center font-extrabold text-sm uppercase tracking-wider text-black border-b-2 border-black pb-1">
            Seasoned
          </h3>
          <div className="divide-y divide-gray-300">
            {seasonedAdvances.map(renderAdvanceRow)}
          </div>
        </div>
      </div>
    </div>
  );
}
