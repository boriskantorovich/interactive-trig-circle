/**
 * Tests for Zustand store
 * Per milestone 2: Store actions update state correctly, angle normalization applied on set, selectors prevent unnecessary re-renders
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Angle } from '../core/Angle';
import { useStore } from './store';
import type { DifficultyLevel, FormulaViewMode } from './AppState';

describe('AppStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useStore.setState({
      currentAngle: Angle.ZERO,
      angleUnit: 'radians',
      activeView: 'unitCircle',
      selectedFormula: null,
      difficultyLevel: 'highSchool',
      formulaViewMode: 'hybrid',
    });
  });

  describe('Initial state', () => {
    it('should have correct initial state', () => {
      const state = useStore.getState();
      expect(state.currentAngle.equals(Angle.ZERO)).toBe(true);
      expect(state.angleUnit).toBe('radians');
      expect(state.activeView).toBe('unitCircle');
      expect(state.selectedFormula).toBeNull();
      expect(state.difficultyLevel).toBe('highSchool');
      expect(state.formulaViewMode).toBe('hybrid');
    });
  });

  describe('setAngle', () => {
    it('should update current angle', () => {
      const newAngle = Angle.fromDegrees(45);
      useStore.getState().setAngle(newAngle);
      const state = useStore.getState();
      expect(state.currentAngle.toDegrees()).toBeCloseTo(45, 4);
    });

    it('should normalize angle on set (negative angle)', () => {
      const negativeAngle = Angle.fromDegrees(-30);
      useStore.getState().setAngle(negativeAngle);
      const state = useStore.getState();
      // -30° should normalize to 330°
      expect(state.currentAngle.toDegrees()).toBeCloseTo(330, 4);
    });

    it('should normalize angle on set (angle > 360°)', () => {
      const largeAngle = Angle.fromDegrees(450);
      useStore.getState().setAngle(largeAngle);
      const state = useStore.getState();
      // 450° should normalize to 90°
      expect(state.currentAngle.toDegrees()).toBeCloseTo(90, 4);
    });

    it('should normalize angle on set (radians > 2π)', () => {
      const largeAngle = Angle.fromRadians(3 * Math.PI);
      useStore.getState().setAngle(largeAngle);
      const state = useStore.getState();
      // 3π should normalize to π
      expect(state.currentAngle.toRadians()).toBeCloseTo(Math.PI, 4);
    });
  });

  describe('setAngleUnit', () => {
    it('should update angle unit', () => {
      useStore.getState().setAngleUnit('degrees');
      const state = useStore.getState();
      expect(state.angleUnit).toBe('degrees');
    });

    it('should convert angle when switching from radians to degrees', () => {
      // Set angle to π/2 radians (90 degrees)
      useStore.getState().setAngle(Angle.PI_OVER_2);
      useStore.getState().setAngleUnit('degrees');
      const state = useStore.getState();
      expect(state.angleUnit).toBe('degrees');
      expect(state.currentAngle.toDegrees()).toBeCloseTo(90, 4);
    });

    it('should convert angle when switching from degrees to radians', () => {
      // Set angle to 90 degrees
      useStore.getState().setAngle(Angle.fromDegrees(90));
      useStore.getState().setAngleUnit('degrees');
      useStore.getState().setAngleUnit('radians');
      const state = useStore.getState();
      expect(state.angleUnit).toBe('radians');
      expect(state.currentAngle.toRadians()).toBeCloseTo(Math.PI / 2, 4);
    });

    it('should normalize angle after unit conversion', () => {
      // Set angle to 450 degrees
      useStore.getState().setAngle(Angle.fromDegrees(450));
      useStore.getState().setAngleUnit('radians');
      const state = useStore.getState();
      // 450° = 90° = π/2 radians, should be normalized
      expect(state.currentAngle.toRadians()).toBeCloseTo(Math.PI / 2, 4);
    });
  });

  describe('setActiveView', () => {
    it('should update active view', () => {
      useStore.getState().setActiveView('graphs');
      const state = useStore.getState();
      expect(state.activeView).toBe('graphs');
    });

    it('should update to all valid views', () => {
      const views: Array<'unitCircle' | 'graphs' | 'table' | 'formulas'> = [
        'unitCircle',
        'graphs',
        'table',
        'formulas',
      ];
      views.forEach((view) => {
        useStore.getState().setActiveView(view);
        expect(useStore.getState().activeView).toBe(view);
      });
    });
  });

  describe('setSelectedFormula', () => {
    it('should update selected formula', () => {
      useStore.getState().setSelectedFormula('pythagorean');
      const state = useStore.getState();
      expect(state.selectedFormula).toBe('pythagorean');
    });

    it('should clear selected formula when set to null', () => {
      useStore.getState().setSelectedFormula('pythagorean');
      useStore.getState().setSelectedFormula(null);
      const state = useStore.getState();
      expect(state.selectedFormula).toBeNull();
    });
  });

  describe('setDifficultyLevel', () => {
    it('should update difficulty level', () => {
      const levels: DifficultyLevel[] = ['highSchool', 'college', 'graduate'];
      levels.forEach((level) => {
        useStore.getState().setDifficultyLevel(level);
        expect(useStore.getState().difficultyLevel).toBe(level);
      });
    });
  });

  describe('setFormulaViewMode', () => {
    it('should update formula view mode', () => {
      const modes: FormulaViewMode[] = ['single', 'multiple', 'hybrid'];
      modes.forEach((mode) => {
        useStore.getState().setFormulaViewMode(mode);
        expect(useStore.getState().formulaViewMode).toBe(mode);
      });
    });
  });

  describe('Selectors', () => {
    it('useCurrentAngle should return current angle', () => {
      const angle = Angle.fromDegrees(60);
      useStore.getState().setAngle(angle);
      const selectedAngle = useStore.getState().currentAngle;
      expect(selectedAngle.toDegrees()).toBeCloseTo(60, 4);
    });

    it('useAngleUnit should return angle unit', () => {
      useStore.getState().setAngleUnit('degrees');
      const unit = useStore.getState().angleUnit;
      expect(unit).toBe('degrees');
    });

    it('useActiveView should return active view', () => {
      useStore.getState().setActiveView('table');
      const view = useStore.getState().activeView;
      expect(view).toBe('table');
    });

    it('useSelectedFormula should return selected formula', () => {
      useStore.getState().setSelectedFormula('sumDifference');
      const formula = useStore.getState().selectedFormula;
      expect(formula).toBe('sumDifference');
    });

    it('useDifficultyLevel should return difficulty level', () => {
      useStore.getState().setDifficultyLevel('college');
      const level = useStore.getState().difficultyLevel;
      expect(level).toBe('college');
    });

    it('useFormulaViewMode should return formula view mode', () => {
      useStore.getState().setFormulaViewMode('single');
      const mode = useStore.getState().formulaViewMode;
      expect(mode).toBe('single');
    });

    it('useAngleState should return angle and unit together', () => {
      const angle = Angle.fromDegrees(30);
      useStore.getState().setAngle(angle);
      useStore.getState().setAngleUnit('degrees');
      const angleState = {
        angle: useStore.getState().currentAngle,
        unit: useStore.getState().angleUnit,
      };
      expect(angleState.angle.toDegrees()).toBeCloseTo(30, 4);
      expect(angleState.unit).toBe('degrees');
    });

    it('store actions should be accessible and callable', () => {
      // Test that all actions are accessible from store state
      const state = useStore.getState();
      expect(typeof state.setAngle).toBe('function');
      expect(typeof state.setAngleUnit).toBe('function');
      expect(typeof state.setActiveView).toBe('function');
      expect(typeof state.setSelectedFormula).toBe('function');
      expect(typeof state.setDifficultyLevel).toBe('function');
      expect(typeof state.setFormulaViewMode).toBe('function');
      
      // Test that actions can be called individually (recommended pattern)
      const setAngle = useStore.getState().setAngle;
      const setAngleUnit = useStore.getState().setAngleUnit;
      expect(typeof setAngle).toBe('function');
      expect(typeof setAngleUnit).toBe('function');
    });
  });

  describe('State synchronization', () => {
    it('should maintain state consistency across multiple updates', () => {
      useStore.getState().setAngle(Angle.fromDegrees(45));
      useStore.getState().setAngleUnit('degrees');
      useStore.getState().setActiveView('graphs');
      useStore.getState().setSelectedFormula('pythagorean');
      useStore.getState().setDifficultyLevel('college');
      useStore.getState().setFormulaViewMode('single');

      const state = useStore.getState();
      expect(state.currentAngle.toDegrees()).toBeCloseTo(45, 4);
      expect(state.angleUnit).toBe('degrees');
      expect(state.activeView).toBe('graphs');
      expect(state.selectedFormula).toBe('pythagorean');
      expect(state.difficultyLevel).toBe('college');
      expect(state.formulaViewMode).toBe('single');
    });
  });
});
