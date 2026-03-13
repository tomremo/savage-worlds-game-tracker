'use client';

import { useCharacterStore } from '@/stores/characterStore';
import { edges as edgeDefinitions } from '@/data/edges';
import { hindrances as hindranceDefinitions } from '@/data/hindrances';

export default function AbilitiesTab() {
  const character = useCharacterStore((state) => state.character);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <section className="parchment-card p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4 border-b border-sepia-mid pb-1">Edges</h2>
        <div className="space-y-4">
          {character.edgeIds.map((id) => {
            const edge = edgeDefinitions.find((e) => e.id === id);
            if (!edge) return null;
            return (
              <div key={id} className="group">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sepia-dark">{edge.name}</span>
                  <span className="text-[10px] uppercase bg-sepia-mid text-white px-2 rounded">{edge.type}</span>
                </div>
                <p className="text-xs text-sepia-mid leading-relaxed">{edge.summary}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="parchment-card p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4 border-b border-sepia-mid pb-1">Hindrances</h2>
        <div className="space-y-4">
          {character.hindranceIds.map((id) => {
            const hindrance = hindranceDefinitions.find((h) => h.id === id);
            if (!hindrance) return null;
            return (
              <div key={id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-accent-red">{hindrance.name}</span>
                  <span className="text-[10px] uppercase bg-accent-red/20 text-accent-red px-2 rounded border border-accent-red/30">
                    {hindrance.type}
                  </span>
                </div>
                <p className="text-xs text-sepia-mid leading-relaxed">{hindrance.summary}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
