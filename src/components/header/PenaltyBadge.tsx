'use client';

export default function PenaltyBadge({ penalty }: { penalty: number }) {
  const isPositive = penalty > 0;
  const isZero = penalty === 0;

  return (
    <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg border-2 shadow-inner ${
      isZero ? 'border-sepia-mid bg-sepia-light/30' : 'border-accent-red bg-accent-red/10'
    }`}>
      <span className={`text-lg font-bold ${isZero ? 'text-sepia-dark' : 'text-accent-red'}`}>
        {penalty > 0 ? `+${penalty}` : penalty}
      </span>
      <span className="text-[8px] uppercase font-bold text-sepia-mid">Penalty</span>
    </div>
  );
}
