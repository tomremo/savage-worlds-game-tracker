'use client';

export default function LogTab() {
  return (
    <div className="parchment-card p-4 rounded-lg animate-in fade-in duration-300 h-full min-h-[400px]">
      <h2 className="text-xl font-bold mb-4 border-b border-sepia-mid pb-1">Adventure Log</h2>
      <div className="space-y-6">
        <div className="border-l-4 border-sepia-mid pl-4 py-1">
          <span className="text-[10px] font-mono text-sepia-mid block">Session 1: The Whisperwood Patrol</span>
          <p className="text-sm mt-1">Patrol led us to a secluded part of the forest. Encountered suspicious poachers. They seem well-trained...</p>
        </div>
        
        <div className="border-l-4 border-sepia-light pl-4 py-1 opacity-50">
          <span className="text-[10px] font-mono text-sepia-mid block text-italic">No further entries</span>
        </div>
      </div>
      
      <button className="mt-8 w-full py-2 border-2 border-dashed border-sepia-mid text-sepia-mid text-xs font-bold uppercase hover:bg-sepia-light/10">
        + Add Log Entry
      </button>
    </div>
  );
}
