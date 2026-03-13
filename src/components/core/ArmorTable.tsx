'use client';

export default function ArmorTable() {
  // Static for now, emulating the sample
  const armorRows = [
    { name: '(Unarmored)', toughness: 0, notes: 'Toughness: 5' },
    { name: 'Chain/Scale Hood/Helm', toughness: 3, notes: 'Toughness: 8 (3)' },
    { name: 'Chain/Scale Leggings', toughness: 10, notes: 'Toughness: 8 (3)' },
    { name: 'Chain/Scale Shirt', toughness: 22, notes: 'Toughness: 8 (3)' },
  ];

  return (
    <div className="section-container">
      <div className="section-header">Armor</div>
      <table className="w-full table-dense">
        <thead>
          <tr>
            <th className="text-left">Name</th>
            <th className="text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {armorRows.map((armor, i) => (
            <tr key={i}>
              <td className="w-3/4">
                <div className="font-bold">{armor.name}</div>
                <div className="text-[0.6rem] text-gray-500 italic ml-4">{armor.notes}</div>
              </td>
              <td className="text-right font-mono">{armor.toughness}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
