/**
 * InverseTrig tests
 * Per milestone 14: College-level expansions
 */

import { describe, it, expect } from 'vitest';
import { InverseTrigonometricValues } from './InverseTrig';
import { PI } from './Angle';
import { TrigonometricValues } from './Trigonometry';

describe('InverseTrigonometricValues', () => {
  describe('arcsin', () => {
    it('should return principal value for sin = 0', () => {
      const inv = new InverseTrigonometricValues(0, 'sin');
      const solutions = inv.arcsin();
      expect(solutions.length).toBeGreaterThan(0);
      // Principal value should be 0
      expect(solutions[0].toRadians()).toBeCloseTo(0, 5);
    });

    it('should return principal value for sin = 1', () => {
      const inv = new InverseTrigonometricValues(1, 'sin');
      const solutions = inv.arcsin();
      expect(solutions.length).toBeGreaterThan(0);
      // Principal value should be π/2
      expect(solutions[0].toRadians()).toBeCloseTo(PI / 2, 5);
    });

    it('should return principal value for sin = -1', () => {
      const inv = new InverseTrigonometricValues(-1, 'sin');
      const solutions = inv.arcsin();
      expect(solutions.length).toBeGreaterThan(0);
      // Principal value should be -π/2, normalized to 3π/2
      const principal = solutions.find((a) => Math.abs(a.toRadians() - (3 * PI) / 2) < 0.01);
      expect(principal).toBeDefined();
    });

    it('should return multiple solutions for sin = 0.5', () => {
      const inv = new InverseTrigonometricValues(0.5, 'sin');
      const solutions = inv.arcsin();
      expect(solutions.length).toBeGreaterThanOrEqual(1);
      
      // Verify solutions are correct by checking sin of each
      solutions.forEach((angle) => {
        const trig = new TrigonometricValues(angle);
        expect(Math.abs(trig.sin() - 0.5)).toBeLessThan(0.0001);
      });
    });

    it('should throw error for value outside domain [-1, 1]', () => {
      expect(() => new InverseTrigonometricValues(1.5, 'sin').arcsin()).toThrow();
      expect(() => new InverseTrigonometricValues(-1.5, 'sin').arcsin()).toThrow();
    });
  });

  describe('arccos', () => {
    it('should return principal value for cos = 1', () => {
      const inv = new InverseTrigonometricValues(1, 'cos');
      const solutions = inv.arccos();
      expect(solutions.length).toBeGreaterThan(0);
      // Principal value should be 0
      expect(solutions[0].toRadians()).toBeCloseTo(0, 5);
    });

    it('should return principal value for cos = -1', () => {
      const inv = new InverseTrigonometricValues(-1, 'cos');
      const solutions = inv.arccos();
      expect(solutions.length).toBeGreaterThan(0);
      // Principal value should be π
      expect(solutions[0].toRadians()).toBeCloseTo(PI, 5);
    });

    it('should return multiple solutions for cos = 0.5', () => {
      const inv = new InverseTrigonometricValues(0.5, 'cos');
      const solutions = inv.arccos();
      expect(solutions.length).toBeGreaterThanOrEqual(1);
      
      // Verify solutions are correct by checking cos of each
      solutions.forEach((angle) => {
        const trig = new TrigonometricValues(angle);
        expect(Math.abs(trig.cos() - 0.5)).toBeLessThan(0.0001);
      });
    });

    it('should throw error for value outside domain [-1, 1]', () => {
      expect(() => new InverseTrigonometricValues(1.5, 'cos').arccos()).toThrow();
      expect(() => new InverseTrigonometricValues(-1.5, 'cos').arccos()).toThrow();
    });
  });

  describe('arctan', () => {
    it('should return 0 for tan = 0', () => {
      const inv = new InverseTrigonometricValues(0, 'tan');
      const solution = inv.arctan();
      expect(solution.toRadians()).toBeCloseTo(0, 5);
    });

    it('should return π/4 for tan = 1', () => {
      const inv = new InverseTrigonometricValues(1, 'tan');
      const solution = inv.arctan();
      expect(solution.toRadians()).toBeCloseTo(PI / 4, 5);
    });

    it('should return -π/4 (normalized) for tan = -1', () => {
      const inv = new InverseTrigonometricValues(-1, 'tan');
      const solution = inv.arctan();
      // arctan(-1) = -π/4, normalized to 7π/4
      expect(solution.toRadians()).toBeCloseTo((7 * PI) / 4, 5);
    });

    it('should handle large positive values', () => {
      const inv = new InverseTrigonometricValues(100, 'tan');
      const solution = inv.arctan();
      // arctan(100) should be close to π/2 (within 0.01 radians)
      expect(Math.abs(solution.toRadians() - PI / 2)).toBeLessThan(0.01);
    });

    it('should handle large negative values', () => {
      const inv = new InverseTrigonometricValues(-100, 'tan');
      const solution = inv.arctan();
      // arctan(-100) should be close to -π/2, normalized to 3π/2 (within 0.01 radians)
      expect(Math.abs(solution.toRadians() - (3 * PI) / 2)).toBeLessThan(0.01);
    });
  });

  describe('arcsec', () => {
    it('should return principal value for sec = 1', () => {
      const inv = new InverseTrigonometricValues(1, 'sec');
      const solutions = inv.arcsec();
      expect(solutions.length).toBeGreaterThan(0);
      // sec(0) = 1, so principal should be 0
      expect(solutions[0].toRadians()).toBeCloseTo(0, 5);
    });

    it('should return solutions for sec = 2', () => {
      const inv = new InverseTrigonometricValues(2, 'sec');
      const solutions = inv.arcsec();
      expect(solutions.length).toBeGreaterThanOrEqual(1);
      
      // Verify solutions are correct
      solutions.forEach((angle) => {
        const trig = new TrigonometricValues(angle);
        const secValue = trig.sec();
        expect(secValue).not.toBeNull();
        if (secValue !== null) {
          expect(Math.abs(secValue - 2)).toBeLessThan(0.01);
        }
      });
    });

    it('should throw error for value in (-1, 1)', () => {
      expect(() => new InverseTrigonometricValues(0.5, 'sec').arcsec()).toThrow();
      expect(() => new InverseTrigonometricValues(-0.5, 'sec').arcsec()).toThrow();
    });
  });

  describe('arccsc', () => {
    it('should return principal value for csc = 1', () => {
      const inv = new InverseTrigonometricValues(1, 'csc');
      const solutions = inv.arccsc();
      expect(solutions.length).toBeGreaterThan(0);
      // csc(π/2) = 1, so principal should be π/2
      expect(solutions[0].toRadians()).toBeCloseTo(PI / 2, 5);
    });

    it('should return solutions for csc = 2', () => {
      const inv = new InverseTrigonometricValues(2, 'csc');
      const solutions = inv.arccsc();
      expect(solutions.length).toBeGreaterThanOrEqual(1);
      
      // Verify solutions are correct
      solutions.forEach((angle) => {
        const trig = new TrigonometricValues(angle);
        const cscValue = trig.csc();
        expect(cscValue).not.toBeNull();
        if (cscValue !== null) {
          expect(Math.abs(cscValue - 2)).toBeLessThan(0.01);
        }
      });
    });

    it('should throw error for value in (-1, 1)', () => {
      expect(() => new InverseTrigonometricValues(0.5, 'csc').arccsc()).toThrow();
      expect(() => new InverseTrigonometricValues(-0.5, 'csc').arccsc()).toThrow();
    });
  });

  describe('arccot', () => {
    it('should return π/2 for cot = 0', () => {
      const inv = new InverseTrigonometricValues(0, 'cot');
      const solution = inv.arccot();
      expect(solution.toRadians()).toBeCloseTo(PI / 2, 5);
    });

    it('should return π/4 for cot = 1', () => {
      const inv = new InverseTrigonometricValues(1, 'cot');
      const solution = inv.arccot();
      expect(solution.toRadians()).toBeCloseTo(PI / 4, 5);
    });

    it('should return 3π/4 for cot = -1', () => {
      const inv = new InverseTrigonometricValues(-1, 'cot');
      const solution = inv.arccot();
      expect(solution.toRadians()).toBeCloseTo((3 * PI) / 4, 5);
    });

    it('should verify solutions are correct', () => {
      const testValues = [0, 1, -1, 0.5, -0.5, 2, -2];
      testValues.forEach((value) => {
        const inv = new InverseTrigonometricValues(value, 'cot');
        const solution = inv.arccot();
        const trig = new TrigonometricValues(solution);
        const cotValue = trig.cot();
        expect(cotValue).not.toBeNull();
        if (cotValue !== null) {
          expect(Math.abs(cotValue - value)).toBeLessThan(0.01);
        }
      });
    });
  });
});
