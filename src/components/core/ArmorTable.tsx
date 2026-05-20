'use client';

import { useCharacterStore } from '@/stores/characterStore';

export default function ArmorTable() {
  const character = useCharacterStore((state) => state.character);
  
  const armorItems = character.armor || [
    { name: '(Unarmored)', weight: 0, notes: 'Toughness: 7 (2)' },
    { name: 'Chain/Scale Hood/Helm', weight: 3, notes: 'Toughness: 10 (5)' },
    { name: 'Chain/Scale Leggings', weight: 10, notes: 'Toughness: 10 (5)' },
    { name: 'Chain/Scale Shirt', weight: 22, notes: 'Toughness: 10 (5)' },
    { name: 'Leather Jacket', weight: 11, notes: 'Toughness: 9 (4)' },
  ];

  return (
    <div className="section-container bg-white">
      <div className="section-header">Armor</div>
      <div className="p-3 space-y-3">
        {armorItems.map((item, index) => (
          <div key={index} className="flex flex-col text-black">
            {/* Header row with name and weight */}
            <div className="flex items-end justify-between leading-none w-full">
              <span className="font-bold text-[0.8rem] bg-white pr-1">
                {item.name}
              </span>
              <div className="flex-grow border-b-2 border-dotted border-black mx-1 mb-[2px]"></div>
              <span className="font-bold text-[0.8rem] bg-white pl-1 font-mono">
                {item.weight}
              </span>
            </div>
            
            {/* Notes / Toughness subtext */}
            <div className="text-[0.65rem] text-gray-700 italic mt-0.5 ml-4">
              {item.notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
