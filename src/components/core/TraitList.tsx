'use client';

import { useCharacterStore } from '@/stores/characterStore';
import { skills as skillDefinitions } from '@/data/skills';
import TraitItem from './TraitItem';

export default function TraitList({ type, title }: { type: 'attributes' | 'skills'; title: string }) {
  const character = useCharacterStore((state) => state.character);

  const traits = type === 'attributes' 
    ? Object.entries(character.attributes).map(([id, trait]) => ({
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        trait
      }))
    : character.skills.map(s => ({
        id: s.skillId,
        name: skillDefinitions.find(sd => sd.id === s.skillId)?.name || s.skillId,
        trait: s.trait
      }));

  return (
    <div className="parchment-card p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-3 border-b border-sepia-mid pb-1">{title}</h2>
      <div className="space-y-2">
        {traits.map(t => (
          <TraitItem key={t.id} name={t.name} trait={t.trait} />
        ))}
      </div>
    </div>
  );
}
