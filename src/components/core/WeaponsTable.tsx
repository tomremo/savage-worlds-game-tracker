'use client';

import { useCharacterStore } from '@/stores/characterStore';

export default function WeaponsTable() {
  const character = useCharacterStore((state) => state.character);
  
  const weapons = character.weapons || [
    { name: 'Unarmed', damage: 'Str[d10]', range: 'Melee', ap: '0', rof: '-', shots: '-', weight: '0', notes: 'Innate Attack' },
    { name: 'Bow, Composite', damage: 'Str[d10]+d6', range: '12/24/48', ap: '1', rof: '1', shots: '-', weight: '3', notes: '-' },
    { name: 'Masterwork Sword, Bastard', damage: 'Str[d10]+d8', range: 'Melee', ap: '2', rof: '-', shots: '-', weight: '6', notes: 'If used Two Hands +1 damage' },
    { name: 'Masterwork Adamantine Sword, Long', damage: 'Str[d10]+d8', range: 'Melee', ap: '2', rof: '-', shots: '-', weight: '4', notes: '+1 to Hit, +1 Parry' },
  ];

  return (
    <div className="section-container col-span-full">
      <div className="section-header">Weapons and Attacks</div>
      <div className="overflow-x-auto">
        <table className="w-full table-dense text-left">
          <thead>
            <tr className="bg-black text-white font-bold text-[0.65rem] uppercase tracking-wider">
              <th className="p-2 border-r border-black">Name</th>
              <th className="p-2 border-r border-black">Damage</th>
              <th className="p-2 border-r border-black">Range</th>
              <th className="p-2 border-r border-black">AP</th>
              <th className="p-2 border-r border-black">ROF</th>
              <th className="p-2 border-r border-black">Shots</th>
              <th className="p-2 border-r border-black">Weight</th>
              <th className="p-2">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black bg-white">
            {weapons.map((w, i) => {
              const apVal = w.ap === 0 || w.ap === '0' || w.ap === undefined ? '0' : w.ap;
              const rofVal = w.rof === 0 || w.rof === '0' || w.rof === undefined || w.rof === '-' ? '-' : w.rof;
              const shotsVal = w.shots === 0 || w.shots === '0' || w.shots === undefined || w.shots === '-' ? '-' : w.shots;

              return (
                <tr key={i} className="hover:bg-gray-50 text-black">
                  <td className="p-2 font-bold text-xs border-r border-black">{w.name}</td>
                  <td className="p-2 font-mono text-xs border-r border-black">{w.damage}</td>
                  <td className="p-2 text-xs border-r border-black">{w.range}</td>
                  <td className="p-2 text-xs border-r border-black text-center">{apVal}</td>
                  <td className="p-2 text-xs border-r border-black text-center">{rofVal}</td>
                  <td className="p-2 text-xs border-r border-black text-center">{shotsVal}</td>
                  <td className="p-2 text-xs border-r border-black text-center">{w.weight}</td>
                  <td className="p-2 text-[10px] italic leading-tight text-gray-800">{w.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
