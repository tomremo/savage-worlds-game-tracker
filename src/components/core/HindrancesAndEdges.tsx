'use client';

import { useCharacterStore } from '@/stores/characterStore';
import { edges } from '@/data/edges';
import { hindrances } from '@/data/hindrances';
import { Fragment } from 'react';

export default function HindrancesAndEdges() {
  const character = useCharacterStore((state) => state.character);
  
  const charEdges = edges.filter(e => character.edgeIds.includes(e.id));
  const charHindrances = hindrances.filter(h => character.hindranceIds.includes(h.id));

  const DotsDivider = () => (
    <div className="w-full flex justify-center text-xl font-black tracking-[0.3em] overflow-hidden whitespace-nowrap select-none py-1">
      . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="section-container">
        <div className="section-header">Hindrances</div>
        <div className="p-3 space-y-1">
          {charHindrances.map((h, i) => (
            <Fragment key={h.id}>
              <div className="text-[0.8rem] tex t-center leading-snug">
                <span className="font-bold">{h.name}</span><br/>
                <span className="text-gray-900">{h.summary}</span>
              </div>
              {i < charHindrances.length - 1 && <DotsDivider />}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="section-container">
        <div className="section-header">Edges</div>
        <div className="p-3 space-y-1">
          {charEdges.map((e, i) => (
            <Fragment key={e.id}>
              <div className="text-[0.8rem] text-center leading-snug">
                <span className="font-bold">{e.name}</span><br/>
                <span className="text-gray-900">{e.summary}</span>
              </div>
              {i < charEdges.length - 1 && <DotsDivider />}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
