'use client';

import { useCharacterStore } from '@/stores/characterStore';
import { gear as gearDefinitions } from '@/data/inventory';

export default function InventoryTab() {
  const character = useCharacterStore((state) => state.character);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <section className="parchment-card p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4 border-b border-sepia-mid pb-1">Equipment & Wealth</h2>
        <div className="flex justify-between items-center mb-6 bg-sepia-light/20 p-2 rounded border border-sepia-light">
          <span className="text-xs font-bold uppercase">Gold Pieces</span>
          <span className="text-lg font-black text-sepia-dark">{character.wealth}gp</span>
        </div>

        <div className="space-y-4">
          {character.inventoryIds.map((id) => {
            const item = gearDefinitions.find((g) => g.id === id);
            if (!item) return null;
            return (
              <div key={id} className="flex justify-between items-start border-b border-sepia-light pb-2 last:border-0">
                <div>
                  <h3 className="font-bold text-sm">{item.name}</h3>
                  <p className="text-[10px] text-sepia-mid">{item.summary}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] block font-mono text-sepia-mid">{item.weight} lbs</span>
                  {item.type === 'Weapon' && <span className="text-[10px] font-bold text-accent-red">Weapon</span>}
                  {item.type === 'Armor' && <span className="text-[10px] font-bold text-sepia-dark">Armor</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
