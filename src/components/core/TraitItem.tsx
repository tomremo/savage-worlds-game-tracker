'use client';

import { Trait } from '@/types/resources';
import { rollTrait } from '@/engine/dice';
import { useUIStore } from '@/stores/uiStore';

export default function TraitItem({ name, trait }: { name: string; trait: Trait }) {
  const setRollResult = useUIStore((state) => state.setRollResult);

  const handleRoll = () => {
    const result = rollTrait(trait, true); // Wild cards always roll wild die
    setRollResult({ name, result });
  };

  return (
    <div 
      onClick={handleRoll}
      className="flex items-center justify-between p-2 hover:bg-sepia-dark/10 rounded cursor-pointer transition-colors border-b border-sepia-light last:border-0"
    >
      <span className="font-semibold text-sm">{name}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono bg-sepia-dark text-white px-2 py-0.5 rounded">
          d{trait.dieType}{trait.modifier !== 0 ? (trait.modifier > 0 ? `+${trait.modifier}` : trait.modifier) : ''}
        </span>
      </div>
    </div>
  );
}
