'use client';

export default function WeaponsTable() {
  const weapons = [
    { name: 'Unarmed', damage: 'Str[d10]', range: 'Melee', ap: '0', rof: '-', shots: '-', weight: '0', notes: 'Innate Attack' },
    { name: 'Bow, Composite', damage: 'Str[d10]+d6', range: '12/24/48', ap: '1', rof: '1', shots: '-', weight: '3', notes: '' },
    { name: 'Masterwork Sword, Bastard', damage: 'Str[d10]+d8', range: 'Melee', ap: '2', rof: '-', shots: '-', weight: '6', notes: 'If used Two Hands +1 damage' },
    { name: 'Masterwork Adamantine Sword, Long', damage: 'Str[d10]+d8', range: 'Melee', ap: '2', rof: '-', shots: '-', weight: '4', notes: '' },
  ];

  return (
    <div className="section-container col-span-full">
      <div className="section-header">Weapons and Attacks</div>
      <table className="w-full table-dense">
        <thead>
          <tr>
            <th className="text-left">Name</th>
            <th className="text-left">Damage</th>
            <th className="text-left">Range</th>
            <th className="text-left">AP</th>
            <th className="text-left">ROF</th>
            <th className="text-left">Shots</th>
            <th className="text-left">Weight</th>
            <th className="text-left">Notes</th>
          </tr>
        </thead>
        <tbody>
          {weapons.map((w, i) => (
            <tr key={i}>
              <td className="font-bold">{w.name}</td>
              <td className="font-mono">{w.damage}</td>
              <td>{w.range}</td>
              <td>{w.ap}</td>
              <td>{w.rof}</td>
              <td>{w.shots}</td>
              <td>{w.weight}</td>
              <td className="text-[0.65rem] italic">{w.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
