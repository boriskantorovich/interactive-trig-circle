/**
 * Difficulty selector component
 * Per milestone 11: Difficulty selector UI
 * Per spec Section 2.7: Difficulty Level Toggle
 */

import './DifficultySelector.css';
import { useStore } from '../state/store';
import type { DifficultyLevel } from '../state/AppState';

/**
 * Difficulty level options
 */
const DIFFICULTY_OPTIONS: { value: DifficultyLevel; label: string }[] = [
  { value: 'highSchool', label: 'High School' },
  { value: 'college', label: 'College' },
  { value: 'graduate', label: 'Graduate' },
];

/**
 * DifficultySelector component
 * Allows users to switch between difficulty levels
 */
export function DifficultySelector() {
  const { difficultyLevel, setDifficultyLevel } = useStore();

  return (
    <div className="difficulty-selector">
      <label htmlFor="difficulty-select" className="difficulty-selector__label">
        Difficulty Level:
      </label>
      <select
        id="difficulty-select"
        className="difficulty-selector__select"
        value={difficultyLevel}
        onChange={(e) => setDifficultyLevel(e.target.value as DifficultyLevel)}
        aria-label="Select difficulty level"
      >
        {DIFFICULTY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
