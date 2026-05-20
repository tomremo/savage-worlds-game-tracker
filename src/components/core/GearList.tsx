'use client';

export default function GearList() {
  const gearItems = [
    { name: '6x Arrows, Damaging Electric', weight: 3 },
    {
      name: 'Backpack',
      weight: 13,
      children: [
        { name: 'Climber\'s Kit (negate 2 penalty)', weight: 10 },
        { name: 'Healer\'s Kit (-1 healing w/o)', weight: 1 },
        { name: 'Adventurer\'s Kit (p107)', weight: 8 },
        { name: '20x Arrows', weight: 3 },
        { name: 'Everburning Torch', weight: 0 },
      ]
    },
    {
      name: 'Horse, light (p248)',
      weight: 0,
      children: [
        { name: '(empty)', weight: 0 }
      ]
    },
    { name: 'Ring of Protection, Minor (+2 Armor)', weight: 0 },
    { name: 'Wealth: 30gp', weight: 0 }
  ];

  return (
    <div className="section-container bg-white text-black">
      <div className="section-header">Gear</div>
      <div className="p-3 space-y-2 select-none">
        
        {gearItems.map((item, index) => (
          <div key={index} className="space-y-1">
            {/* Parent Item */}
            <div className="flex items-end justify-between leading-none w-full">
              <span className="font-bold text-[0.8rem] bg-white pr-1">
                {item.name}
              </span>
              <div className="flex-grow border-b-2 border-dotted border-black mx-1 mb-[2px]"></div>
              <span className="font-bold text-[0.8rem] bg-white pl-1 font-mono">
                {item.weight}
              </span>
            </div>

            {/* Child Items */}
            {item.children && (
              <div className="pl-4 space-y-1">
                {item.children.map((child, cIndex) => (
                  <div key={cIndex} className="flex items-end justify-between leading-none w-full text-[0.75rem]">
                    <span className="text-gray-800 bg-white pr-1 flex items-center">
                      <span className="font-mono text-gray-500 mr-1">└──</span> {child.name}
                    </span>
                    <div className="flex-grow border-b border-dotted border-gray-400 mx-1 mb-[2px]"></div>
                    <span className="font-mono text-gray-700 bg-white pl-1 text-[0.7rem]">
                      {child.weight}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
