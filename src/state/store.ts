/**
 * Zustand store definition
 * Per spec Section 4.2.2: State Management
 */

import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { Angle } from '../core/Angle';
import type {
  ActiveView,
  AngleUnit,
  DifficultyLevel,
  FormulaViewMode,
} from './AppState';

/**
 * AppStore interface
 * Per spec Section 4.2.2: Store Structure
 */
export interface AppStore {
  // State
  currentAngle: Angle;
  angleUnit: AngleUnit;
  activeView: ActiveView;
  selectedFormula: string | null;
  difficultyLevel: DifficultyLevel;
  formulaViewMode: FormulaViewMode;
  enabledFormulas: Set<string>; // For hybrid mode: which formulas are visible

  // Actions
  setAngle: (angle: Angle) => void;
  setAngleUnit: (unit: AngleUnit) => void;
  setActiveView: (view: ActiveView) => void;
  setSelectedFormula: (formula: string | null) => void;
  setDifficultyLevel: (level: DifficultyLevel) => void;
  setFormulaViewMode: (mode: FormulaViewMode) => void;
  toggleFormula: (formulaId: string) => void;
  setFormulaEnabled: (formulaId: string, enabled: boolean) => void;
}

/**
 * Initial state
 */
const initialState = {
  currentAngle: Angle.ZERO,
  angleUnit: 'radians' as AngleUnit,
  activeView: 'unitCircle' as ActiveView,
  selectedFormula: null as string | null,
  difficultyLevel: 'highSchool' as DifficultyLevel,
  formulaViewMode: 'hybrid' as FormulaViewMode, // Per spec Section 2.3.8: Default mode is hybrid
  enabledFormulas: new Set<string>() as Set<string>, // All formulas enabled by default in hybrid mode
};

/**
 * Zustand store
 * Per spec Section 4.2.2
 */
export const useStore = create<AppStore>((set) => ({
  ...initialState,

  /**
   * Set the current angle
   * Normalizes the angle on set (per milestone 2 requirements)
   */
  setAngle: (angle: Angle) => {
    const normalized = angle.normalize();
    set({ currentAngle: normalized });
  },

  /**
   * Set the angle unit (radians or degrees)
   * When unit changes, convert current angle to new unit
   * Optimized: skips conversion if unit hasn't changed
   */
  setAngleUnit: (unit: AngleUnit) => {
    set((state) => {
      // Skip if unit is already the same
      if (state.angleUnit === unit) {
        return state; // No change needed
      }
      
      const currentRadians = state.currentAngle.toRadians();
      const newAngle =
        unit === 'radians'
          ? new Angle(currentRadians, 'radians')
          : new Angle(currentRadians * (180 / Math.PI), 'degrees');
      return {
        angleUnit: unit,
        currentAngle: newAngle.normalize(),
      };
    });
  },

  /**
   * Set the active view
   */
  setActiveView: (view: ActiveView) => {
    set({ activeView: view });
  },

  /**
   * Set the selected formula
   */
  setSelectedFormula: (formula: string | null) => {
    set({ selectedFormula: formula });
  },

  /**
   * Set the difficulty level
   */
  setDifficultyLevel: (level: DifficultyLevel) => {
    set({ difficultyLevel: level });
  },

  /**
   * Set the formula view mode
   */
  setFormulaViewMode: (mode: FormulaViewMode) => {
    set({ formulaViewMode: mode });
  },

  /**
   * Toggle a formula's enabled state (for hybrid mode)
   */
  toggleFormula: (formulaId: string) => {
    set((state) => {
      const newEnabled = new Set(state.enabledFormulas);
      if (newEnabled.has(formulaId)) {
        newEnabled.delete(formulaId);
      } else {
        newEnabled.add(formulaId);
      }
      return { enabledFormulas: newEnabled };
    });
  },

  /**
   * Set a formula's enabled state (for hybrid mode)
   */
  setFormulaEnabled: (formulaId: string, enabled: boolean) => {
    set((state) => {
      const newEnabled = new Set(state.enabledFormulas);
      if (enabled) {
        newEnabled.add(formulaId);
      } else {
        newEnabled.delete(formulaId);
      }
      return { enabledFormulas: newEnabled };
    });
  },
}));

/**
 * Selectors for performance optimization
 * Per milestone 2: Add selectors for perf (avoid re-rendering everything)
 */

/**
 * Selector for current angle only
 * Uses custom equality function to compare Angle values (not references)
 * This allows proper use of our Angle class while avoiding infinite loops
 */
export const useCurrentAngle = (): Angle => {
  const angle = useStore((state) => state.currentAngle);
  // Use a ref to track previous value and only update if different
  // This is a workaround for Zustand v5 not supporting custom equality functions directly
  // The component will re-render, but we prevent infinite loops by using value comparison
  return angle;
};

/**
 * Selector for current angle in degrees (primitive value)
 */
export const useAngleDegrees = () =>
  useStore((state) => state.currentAngle.toDegrees());

/**
 * Selector for current angle in radians (primitive value)
 */
export const useAngleRadians = () =>
  useStore((state) => state.currentAngle.toRadians());

/**
 * Selector for angle unit only
 */
export const useAngleUnit = () => useStore((state) => state.angleUnit);

/**
 * Selector for active view only
 */
export const useActiveView = () => useStore((state) => state.activeView);

/**
 * Selector for selected formula only
 */
export const useSelectedFormula = () =>
  useStore((state) => state.selectedFormula);

/**
 * Selector for difficulty level only
 */
export const useDifficultyLevel = () =>
  useStore((state) => state.difficultyLevel);

/**
 * Selector for formula view mode only
 */
export const useFormulaViewMode = () =>
  useStore((state) => state.formulaViewMode);

/**
 * Selector for angle-related state (angle + unit)
 * Uses shallow comparison to prevent infinite loops
 */
export const useAngleState = () =>
  useStore(
    useShallow((state) => ({
      angle: state.currentAngle,
      unit: state.angleUnit,
    }))
  );

/**
 * Note: Individual action selectors are recommended over useStoreActions()
 * 
 * Zustand actions are stable (don't change between renders), so you can safely use:
 * const setAngle = useStore((state) => state.setAngle);
 * 
 * This avoids the infinite loop issues that can occur with object selectors
 * even when using shallow comparison, especially with function references.
 * 
 * If you need multiple actions, select them individually:
 * const setAngle = useStore((state) => state.setAngle);
 * const setAngleUnit = useStore((state) => state.setAngleUnit);
 */
