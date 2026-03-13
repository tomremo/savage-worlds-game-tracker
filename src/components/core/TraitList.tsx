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
    : [
        { 
          id: 'unskilled', 
          name: '(Unskilled)', 
          trait: { dieType: 4, modifier: -2 } as any 
        },
        ...character.skills.map(s => ({
          id: s.skillId,
          name: skillDefinitions.find(sd => sd.id === s.skillId)?.name || s.skillId,
          trait: s.trait
        }))
      ];

  return (
    <div className="section-container">
      <div className="section-header">{title}</div>
      <div className="divide-y divide-dotted divide-gray-400">
        {traits.map(t => (
          <TraitItem key={t.id} name={t.name} trait={t.trait} />
        ))}
      </div>
    </div>
  );
}
