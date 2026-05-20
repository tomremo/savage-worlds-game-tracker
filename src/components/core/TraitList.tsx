'use client';

import { useCharacterStore } from '@/stores/characterStore';
import { skills as skillDefinitions } from '@/data/skills';
import { Trait } from '@/types/resources';
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
          trait: { dieType: 4, modifier: -2 } as Trait 
        },
        ...character.skills
          .filter(s => s.skillId !== 'unskilled' && !s.skillId.includes('unskilled'))
          .map(s => ({
            id: s.skillId,
            name: skillDefinitions.find(sd => sd.id === s.skillId)?.name || s.skillId,
            trait: s.trait
          }))
      ];

  return (
    <div className="section-container !overflow-visible">
      <div className="section-header">{title}</div>
      <div className="divide-y divide-dashed divide-black bg-white">
        {traits.map(t => (
          <TraitItem key={t.id} name={t.name} trait={t.trait} type={type} />
        ))}
      </div>
    </div>
  );
}
