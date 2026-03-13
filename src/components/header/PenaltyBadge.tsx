'use client';

export default function PenaltyBadge({ penalty }: { penalty: number }) {
  return (
    <div className="flex flex-col items-center justify-center w-12 h-12 border-2 border-black bg-white">
      <span className="text-xl font-extrabold text-black">
        {penalty > 0 ? `+${penalty}` : penalty}
      </span>
      <span className="text-[8px] uppercase font-bold text-black border-t border-black w-full text-center">
        Penalty
      </span>
    </div>
  );
}
