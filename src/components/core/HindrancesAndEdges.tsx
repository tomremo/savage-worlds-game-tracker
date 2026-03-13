'use client';

import { useCharacterStore } from '@/stores/characterStore';
import { edges } from '@/data/edges';
import { hindrances } from '@/data/hindrances';

export default function HindrancesAndEdges() {
  const character = useCharacterStore((state) => state.character);
  
  const charEdges = edges.filter(e => character.edgeIds.includes(e.id));
  const charHindrances = hindrances.filter(h => character.hindranceIds.includes(h.id));

  return (
    <div className="space-y-4">
      <div className="section-container">
        <div className="section-header">Hindrances</div>
        <div className="p-2 space-y-2">
          {charHindrances.map(h => (
            <div key={h.id} className="text-xs">
              <span className="font-bold uppercase">{h.name}</span>
              <p className="text-[0.7rem] text-gray-700 leading-tight">{h.summary}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section-container">
        <div className="section-header">Edges</div>
        <div className="p-2 space-y-2">
          {charEdges.map(e => (
            <div key={e.id} className="text-xs">
              <span className="font-bold uppercase">{e.name}</span>
              <p className="text-[0.7rem] text-gray-700 leading-tight">{e.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
