'use client';

import { useCharacterStore } from '@/stores/characterStore';

const STATUSES = ['Shaken', 'Distracted', 'Vulnerable', 'Entangled', 'Bound', 'Stunned'];

const STATUS_DESCRIPTIONS: Record<string, string> = {
  Shaken: 'May only take free actions. Attempt a Spirit roll as a free action at start of turn to recover.',
  Distracted: 'Suffers a -2 penalty to all Trait rolls until the end of their next turn.',
  Vulnerable: 'Actions and attacks against this character are made with a +2 bonus.',
  Entangled: 'Cannot move and is Distracted. May try to break free as an action.',
  Bound: 'Cannot move, is Distracted and Vulnerable. Cannot take physical actions other than trying to break free.',
  Stunned: 'Distracted, Vulnerable, cannot take actions, movement halved. Vigor roll at start of turn to recover.'
};

export default function StatusGrid() {
  const currentStatuses = useCharacterStore((state) => state.character.statuses);
  const toggleStatus = useCharacterStore((state) => state.toggleStatus);

  return (
    <div className="space-y-1">
      <span className="text-[0.65rem] font-bold uppercase">Status Conditions</span>
      <div className="grid grid-cols-3 gap-1">
        {STATUSES.map((status) => {
          const isActive = currentStatuses.includes(status);
          return (
            <div key={status} className="relative group overflow-visible">
              <button
                onClick={() => toggleStatus(status)}
                className={`w-full py-1 px-0.5 text-[0.6rem] border border-black font-bold uppercase transition-all cursor-help ${
                  isActive
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-black'
                }`}
              >
                {status}
              </button>
              
              {/* Tooltip Overlay */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black text-white text-[10px] border-2 border-white shadow-[3px_3px_0px_rgba(0,0,0,1)] p-2 pointer-events-none opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 origin-bottom z-50 normal-case font-normal text-center">
                <div className="font-black uppercase tracking-wider border-b border-gray-700 pb-0.5 mb-1 text-[9px] text-gray-300">
                  {status}
                </div>
                <div className="text-gray-100 leading-normal">
                  {STATUS_DESCRIPTIONS[status]}
                </div>
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
