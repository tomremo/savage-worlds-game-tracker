'use client';

import { useCharacterStore } from '@/stores/characterStore';
import { edges } from '@/data/edges';
import { Fragment } from 'react';

export default function MoreEdges() {
  const character = useCharacterStore((state) => state.character);

  // More Edges contains the remaining edges: Quarry, Quick, Ranger, Trademark Weapon, Two-Weapon Fighting.
  const moreEdgeIds = ['quarry', 'quick', 'ranger', 'trademark-weapon', 'two-weapon-fighting'];
  const charEdges = edges.filter(e => moreEdgeIds.includes(e.id) && character.edgeIds.includes(e.id));

  const DotsDivider = () => (
    <div className="w-full flex justify-center text-[9px] font-bold tracking-[0.2em] overflow-hidden whitespace-nowrap select-none py-1.5 text-black">
      ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
    </div>
  );

  return (
    <div className="section-container bg-white text-black">
      <div className="section-header">More Edges</div>
      <div className="p-3 space-y-2 select-none">
        {charEdges.map((e, idx) => (
          <Fragment key={e.id}>
            <div className="text-center leading-normal text-xs px-2">
              <div className="font-extrabold text-sm mb-1">{e.name}</div>
              <div className="text-gray-900 leading-relaxed text-[0.75rem]">{e.summary}</div>
            </div>
            {idx < charEdges.length - 1 && <DotsDivider />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
