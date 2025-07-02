import React from "react";

interface LevelFilterSelectorProps {
  levels?: number[];
  selectedLevel: number | null;
  onSelect: (level: number | null) => void;
  className?: string;
}

export const LevelFilterSelector: React.FC<LevelFilterSelectorProps> = ({
  levels = [4, 3, 2, 1, 0],
  selectedLevel,
  onSelect,
  className = "",
}) => (
  <div
    className={`flex flex-row gap-2 mt-4 mb-4 ${className}`}
    role="group"
    aria-label="Skill level filter"
  >
    {levels.map((level) => (
      <button
        key={level}
        type="button"
        className={`px-3 py-1 rounded font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          selectedLevel === level
            ? "bg-blue-600 text-white border-blue-700"
            : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-blue-100"
        }`}
        aria-pressed={selectedLevel === level}
        onClick={() => onSelect(selectedLevel === level ? null : level)}
      >
        Level {level}
      </button>
    ))}
  </div>
);
