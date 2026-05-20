'use client';

import { useUIStore, CombatModifiers } from '@/stores/uiStore';

export default function EncounterModifiers() {
  const { modifiers, updateModifier, resetModifiers } = useUIStore();

  const handleToggle = (key: keyof CombatModifiers) => {
    updateModifier(key, !modifiers[key]);
  };

  const handleSelect = <K extends keyof CombatModifiers>(key: K, value: CombatModifiers[K]) => {
    updateModifier(key, value);
  };

  const adjustCustom = (amount: number) => {
    updateModifier('customModifier', modifiers.customModifier + amount);
  };

  // Compute live sums for reference
  const meleeTotal = 
    modifiers.gangUp + 
    (modifiers.wildAttack ? 2 : 0) + 
    (modifiers.enemyVulnerable ? 2 : 0) + 
    (modifiers.illumination === 'dim' ? -2 : modifiers.illumination === 'dark' ? -4 : modifiers.illumination === 'pitch-black' ? -6 : 0) +
    modifiers.customModifier;

  const coverPenalty = 
    modifiers.cover === 'light' ? -2 : 
    modifiers.cover === 'medium' ? -4 : 
    modifiers.cover === 'heavy' ? -6 : 
    modifiers.cover === 'total' ? -8 : 0;

  const rangePenalty = 
    modifiers.range === 'medium' ? -2 : 
    modifiers.range === 'long' ? -4 : 
    modifiers.range === 'extreme' ? -6 : 0;

  const lightPenalty = 
    modifiers.illumination === 'dim' ? -2 : 
    modifiers.illumination === 'dark' ? -4 : 
    modifiers.illumination === 'pitch-black' ? -6 : 0;

  const rangedTotal = 
    coverPenalty + 
    rangePenalty + 
    lightPenalty + 
    (modifiers.enemyVulnerable ? 2 : 0) + 
    modifiers.customModifier;

  const pillClass = (active: boolean) => 
    `px-2 py-1 text-[0.65rem] border border-black font-bold uppercase transition-all select-none cursor-pointer ${
      active 
        ? 'bg-black text-white scale-[1.03]' 
        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-black'
    }`;

  return (
    <div className="section-container bg-white text-black p-3 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-black pb-1.5 mb-1 select-none">
        <span className="text-[0.7rem] font-black uppercase tracking-wider">Combat Modifiers</span>
        <button 
          onClick={resetModifiers}
          className="text-[0.6rem] border border-black font-extrabold uppercase px-1.5 py-0.5 bg-white hover:bg-red-50 hover:text-red-600 transition-colors shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none"
        >
          Reset
        </button>
      </div>

      {/* Row 1: Gang Up & Custom Modifier */}
      <div className="grid grid-cols-2 gap-3">
        {/* Gang Up */}
        <div className="space-y-1.5">
          <label className="block text-[0.6rem] font-bold uppercase text-gray-600">Gang Up (+1 per Ally)</label>
          <div className="flex gap-0.5 w-full">
            {([0, 1, 2, 3, 4] as const).map((val) => (
              <div 
                key={val} 
                onClick={() => handleSelect('gangUp', val)}
                className={`flex-1 text-center py-1 text-[0.65rem] border border-black font-mono font-bold cursor-pointer transition-all select-none ${
                  modifiers.gangUp === val 
                    ? 'bg-black text-white scale-[1.03]' 
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-black'
                }`}
              >
                {val === 0 ? '0' : `+${val}`}
              </div>
            ))}
          </div>
        </div>

        {/* Custom Modifier */}
        <div className="space-y-1.5">
          <label className="block text-[0.6rem] font-bold uppercase text-gray-600">Custom Situational</label>
          <div className="flex items-center border border-black h-[26px]">
            <button 
              onClick={() => adjustCustom(-1)}
              className="px-2 h-full bg-gray-100 hover:bg-gray-200 border-r border-black text-xs font-black select-none"
            >
              -
            </button>
            <span className="flex-1 text-center font-mono text-[0.7rem] font-black">
              {modifiers.customModifier >= 0 ? `+${modifiers.customModifier}` : modifiers.customModifier}
            </span>
            <button 
              onClick={() => adjustCustom(1)}
              className="px-2 h-full bg-gray-100 hover:bg-gray-200 border-l border-black text-xs font-black select-none"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Wild Attack & Enemy Vulnerable */}
      <div className="grid grid-cols-2 gap-3">
        {/* Wild Attack */}
        <button 
          onClick={() => handleToggle('wildAttack')}
          className={`flex items-center justify-between p-1.5 border border-black text-left select-none transition-all shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] active:translate-y-[0.5px] active:shadow-none ${
            modifiers.wildAttack 
              ? 'bg-[#CC0000]/10 border-[#CC0000] text-black font-extrabold' 
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-black font-bold'
          }`}
        >
          <div className="flex flex-col">
            <span className="text-[0.65rem] uppercase leading-none mb-0.5">Wild Attack</span>
            <span className="text-[8px] text-gray-500 leading-none">Fighting +2, Parry -2</span>
          </div>
          <div className={`w-3.5 h-3.5 border border-black flex items-center justify-center font-black text-[9px] ${modifiers.wildAttack ? 'bg-[#CC0000] text-white' : 'bg-white'}`}>
            {modifiers.wildAttack ? '✓' : ''}
          </div>
        </button>

        {/* Enemy Vulnerable */}
        <button 
          onClick={() => handleToggle('enemyVulnerable')}
          className={`flex items-center justify-between p-1.5 border border-black text-left select-none transition-all shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] active:translate-y-[0.5px] active:shadow-none ${
            modifiers.enemyVulnerable 
              ? 'bg-black text-white font-extrabold' 
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-black font-bold'
          }`}
        >
          <div className="flex flex-col">
            <span className="text-[0.65rem] uppercase leading-none mb-0.5">Enemy Vulnerable</span>
            <span className={`text-[8px] leading-none ${modifiers.enemyVulnerable ? 'text-gray-300' : 'text-gray-500'}`}>Attack Bonus +2</span>
          </div>
          <div className={`w-3.5 h-3.5 border border-black flex items-center justify-center font-black text-[9px] ${modifiers.enemyVulnerable ? 'bg-white text-black' : 'bg-white'}`}>
            {modifiers.enemyVulnerable ? '✓' : ''}
          </div>
        </button>
      </div>

      {/* Row 3: Ranged Modifiers (Cover & Range) */}
      <div className="space-y-3 border-t border-dashed border-gray-300 pt-3">
        {/* Enemy Cover */}
        <div className="space-y-1.5">
          <label className="block text-[0.6rem] font-bold uppercase text-gray-600">Enemy Cover (Ranged)</label>
          <div className="flex gap-0.5 flex-wrap">
            <div 
              onClick={() => handleSelect('cover', 'none')}
              className={pillClass(modifiers.cover === 'none')}
            >
              None
            </div>
            <div 
              onClick={() => handleSelect('cover', 'light')}
              className={pillClass(modifiers.cover === 'light')}
            >
              Light -2
            </div>
            <div 
              onClick={() => handleSelect('cover', 'medium')}
              className={pillClass(modifiers.cover === 'medium')}
            >
              Med -4
            </div>
            <div 
              onClick={() => handleSelect('cover', 'heavy')}
              className={pillClass(modifiers.cover === 'heavy')}
            >
              Heavy -6
            </div>
            <div 
              onClick={() => handleSelect('cover', 'total')}
              className={pillClass(modifiers.cover === 'total')}
            >
              Total -8
            </div>
          </div>
        </div>

        {/* Range */}
        <div className="space-y-1.5">
          <label className="block text-[0.6rem] font-bold uppercase text-gray-600">Range (Ranged)</label>
          <div className="flex gap-0.5">
            <div 
              onClick={() => handleSelect('range', 'short')}
              className={`flex-1 text-center ${pillClass(modifiers.range === 'short')}`}
            >
              Short
            </div>
            <div 
              onClick={() => handleSelect('range', 'medium')}
              className={`flex-1 text-center ${pillClass(modifiers.range === 'medium')}`}
            >
              Med -2
            </div>
            <div 
              onClick={() => handleSelect('range', 'long')}
              className={`flex-1 text-center ${pillClass(modifiers.range === 'long')}`}
            >
              Long -4
            </div>
            <div 
              onClick={() => handleSelect('range', 'extreme')}
              className={`flex-1 text-center ${pillClass(modifiers.range === 'extreme')}`}
            >
              Ext -6
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Lighting / Illumination */}
      <div className="space-y-1.5 border-t border-dashed border-gray-300 pt-3">
        <label className="block text-[0.6rem] font-bold uppercase text-gray-600">Illumination (All Actions)</label>
        <div className="flex gap-0.5">
          <div 
            onClick={() => handleSelect('illumination', 'normal')}
            className={`flex-1 text-center ${pillClass(modifiers.illumination === 'normal')}`}
          >
            Normal
          </div>
          <div 
            onClick={() => handleSelect('illumination', 'dim')}
            className={`flex-1 text-center ${pillClass(modifiers.illumination === 'dim')}`}
          >
            Dim -2
          </div>
          <div 
            onClick={() => handleSelect('illumination', 'dark')}
            className={`flex-1 text-center ${pillClass(modifiers.illumination === 'dark')}`}
          >
            Dark -4
          </div>
          <div 
            onClick={() => handleSelect('illumination', 'pitch-black')}
            className={`flex-1 text-center ${pillClass(modifiers.illumination === 'pitch-black')}`}
          >
            Black -6
          </div>
        </div>
      </div>

      {/* Bottom Summary: Computed Totals */}
      <div className="flex justify-between items-center gap-3 border-t-2 border-black pt-2.5 bg-gray-50 p-2 font-mono text-[0.7rem] select-none">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-gray-500 uppercase text-[9px]">Melee:</span>
          <span className={`font-black text-xs ${meleeTotal > 0 ? 'text-green-700' : meleeTotal < 0 ? 'text-[#CC0000]' : 'text-black'}`}>
            {meleeTotal >= 0 ? `+${meleeTotal}` : meleeTotal}
          </span>
        </div>
        <div className="w-[1px] h-3.5 bg-gray-300"></div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-gray-500 uppercase text-[9px]">Ranged:</span>
          <span className={`font-black text-xs ${rangedTotal > 0 ? 'text-green-700' : rangedTotal < 0 ? 'text-[#CC0000]' : 'text-black'}`}>
            {rangedTotal >= 0 ? `+${rangedTotal}` : rangedTotal}
          </span>
        </div>
      </div>
    </div>
  );
}
