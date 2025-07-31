interface AiToolLevelDistributionProps {
  levels: Record<string, number>;
}

export function AiToolLevelDistribution({
  levels,
}: AiToolLevelDistributionProps) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-2 sm:gap-4">
        {Object.entries(levels).map(([level, count]) => (
          <div key={level} className="text-center">
            <div className="text-xs text-gray-600 mb-2 font-medium uppercase tracking-wide">
              {level}
            </div>
            <div className="rounded-lg sm:rounded-xl px-2 py-2 sm:px-4 sm:py-3 font-bold text-sm sm:text-lg transition-all bg-blue-100 shadow">
              {count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
