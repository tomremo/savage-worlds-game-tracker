'use client';

import { useCharacterStore } from '@/stores/characterStore';
import { edges } from '@/data/edges';
import { hindrances } from '@/data/hindrances';
import { Fragment } from 'react';

export default function HindrancesAndEdges() {
  const character = useCharacterStore((state) => state.character);
  
  // Page 1 contains exactly these 3 hindrances
  const charHindrances = hindrances.filter(h => character.hindranceIds.includes(h.id));

  // Page 1 contains Alertness, Ambidextrous, and Fleet-Footed.
  const page1EdgeIds = ['alertness', 'ambidextrous', 'fleet-footed'];
  const charEdges = edges.filter(e => page1EdgeIds.includes(e.id) && character.edgeIds.includes(e.id));

  const DotsDivider = () => (
    <div className="w-full flex justify-center text-[10px] font-bold tracking-[0.2em] overflow-hidden whitespace-nowrap select-none py-2 text-black">
      ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Hindrances Block */}
      <div className="section-container bg-white text-black">
        <div className="section-header">Hindrances</div>
        <div className="p-3 space-y-2">
          {charHindrances.map((h, i) => (
            <Fragment key={h.id}>
              <div className="text-center leading-normal text-xs px-2 select-none">
                <div className="font-extrabold text-sm mb-1">{h.name}</div>
                <div className="text-gray-900 leading-relaxed">{h.summary}</div>
              </div>
              {i < charHindrances.length - 1 && <DotsDivider />}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Edges Block */}
      <div className="section-container bg-white text-black">
        <div className="section-header">Edges</div>
        <div className="p-3 space-y-2">
          {charEdges.map((e, i) => (
            <Fragment key={e.id}>
              <div className="text-center leading-normal text-xs px-2 select-none">
                <div className="font-extrabold text-sm mb-1">{e.name}</div>
                <div className="text-gray-900 leading-relaxed">{e.summary}</div>
              </div>
              {i < charEdges.length - 1 && <DotsDivider />}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
