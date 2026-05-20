'use client';

import { useCharacterStore } from '@/stores/characterStore';
import { Fragment } from 'react';

export default function SpecialAbilities() {
  const character = useCharacterStore((state) => state.character);
  const abilities = character.specialAbilities || [];

  const DotsDivider = () => (
    <div className="w-full flex justify-center text-[9px] font-bold tracking-[0.2em] overflow-hidden whitespace-nowrap select-none py-1.5 text-black">
      ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
    </div>
  );

  return (
    <div className="section-container bg-white text-black">
      <div className="section-header">Special Abilities</div>
      <div className="p-3 space-y-2 select-none">
        {abilities.map((ability, idx) => (
          <Fragment key={idx}>
            <div className="text-left text-xs leading-normal">
              <div className="font-extrabold text-[0.8rem] mb-0.5">{ability.name}</div>
              <div className="text-gray-900 leading-relaxed text-[0.75rem]">{ability.description}</div>
            </div>
            {idx < abilities.length - 1 && <DotsDivider />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
