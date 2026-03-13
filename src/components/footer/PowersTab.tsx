'use client';

export default function PowersTab() {
  return (
    <div className="parchment-card p-4 rounded-lg animate-in fade-in duration-300">
      <h2 className="text-xl font-bold mb-4 border-b border-sepia-mid pb-1">Powers</h2>
      <div className="text-center py-10">
        <p className="text-sepia-mid italic text-sm">No active powers for this character.</p>
        <p className="text-[10px] uppercase font-bold text-sepia-mid mt-2">Novice Rank required for new powers</p>
      </div>
    </div>
  );
}
