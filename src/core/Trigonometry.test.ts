import { describe, it, expect } from 'vitest';
import { TrigonometricValues, formatTrigValue, approximatelyEqual } from './Trigonometry';
import { Angle, PI } from './Angle';

/**
 * Reference table validation per spec Section 6.4.5
 * Tolerance: ±0.0001 for floating-point comparisons
 */

describe('TrigonometricValues', () => {
  describe('Reference table validation (spec Section 6.4.5)', () => {
    it('calculates values for 0° (0 radians)', () => {
      const angle = new Angle(0, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.sin()).toBeCloseTo(0, 4);
      expect(trig.cos()).toBeCloseTo(1, 4);
      expect(trig.tan()).toBeCloseTo(0, 4);
    });

    it('calculates values for 30° (π/6)', () => {
      const angle = new Angle(PI / 6, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.sin()).toBeCloseTo(0.5, 4);
      expect(trig.cos()).toBeCloseTo(Math.sqrt(3) / 2, 4);
      expect(trig.tan()).toBeCloseTo(1 / Math.sqrt(3), 4);
    });

    it('calculates values for 45° (π/4)', () => {
      const angle = new Angle(PI / 4, 'radians');
      const trig = new TrigonometricValues(angle);
      const sqrt2over2 = Math.sqrt(2) / 2;
      expect(trig.sin()).toBeCloseTo(sqrt2over2, 4);
      expect(trig.cos()).toBeCloseTo(sqrt2over2, 4);
      expect(trig.tan()).toBeCloseTo(1, 4);
    });

    it('calculates values for 60° (π/3)', () => {
      const angle = new Angle(PI / 3, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.sin()).toBeCloseTo(Math.sqrt(3) / 2, 4);
      expect(trig.cos()).toBeCloseTo(0.5, 4);
      expect(trig.tan()).toBeCloseTo(Math.sqrt(3), 4);
    });

    it('calculates values for 90° (π/2)', () => {
      const angle = new Angle(PI / 2, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.sin()).toBeCloseTo(1, 4);
      expect(trig.cos()).toBeCloseTo(0, 4);
      expect(trig.tan()).toBeNull(); // undefined
    });

    it('calculates values for 180° (π)', () => {
      const angle = new Angle(PI, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.sin()).toBeCloseTo(0, 4);
      expect(trig.cos()).toBeCloseTo(-1, 4);
      expect(trig.tan()).toBeCloseTo(0, 4);
    });

    it('calculates values for 270° (3π/2)', () => {
      const angle = new Angle((3 * PI) / 2, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.sin()).toBeCloseTo(-1, 4);
      expect(trig.cos()).toBeCloseTo(0, 4);
      expect(trig.tan()).toBeNull(); // undefined
    });

    it('calculates values for 360° (2π)', () => {
      const angle = new Angle(2 * PI, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.sin()).toBeCloseTo(0, 4);
      expect(trig.cos()).toBeCloseTo(1, 4);
      expect(trig.tan()).toBeCloseTo(0, 4);
    });
  });

  describe('All six trigonometric functions', () => {
    it('calculates sin correctly', () => {
      const angle = new Angle(PI / 4, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.sin()).toBeCloseTo(Math.sqrt(2) / 2, 10);
    });

    it('calculates cos correctly', () => {
      const angle = new Angle(PI / 3, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.cos()).toBeCloseTo(0.5, 10);
    });

    it('calculates tan correctly', () => {
      const angle = new Angle(PI / 4, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.tan()).toBeCloseTo(1, 10);
    });

    it('calculates cot correctly', () => {
      const angle = new Angle(PI / 4, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.cot()).toBeCloseTo(1, 10);
    });

    it('calculates sec correctly', () => {
      const angle = new Angle(0, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.sec()).toBeCloseTo(1, 10);
    });

    it('calculates csc correctly', () => {
      const angle = new Angle(PI / 2, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.csc()).toBeCloseTo(1, 10);
    });
  });

  describe('Edge cases - undefined values', () => {
    it('returns null for tan(π/2)', () => {
      const angle = new Angle(PI / 2, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.tan()).toBeNull();
    });

    it('returns null for tan(3π/2)', () => {
      const angle = new Angle((3 * PI) / 2, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.tan()).toBeNull();
    });

    it('returns null for cot(0)', () => {
      const angle = new Angle(0, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.cot()).toBeNull();
    });

    it('returns null for cot(π)', () => {
      const angle = new Angle(PI, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.cot()).toBeNull();
    });

    it('returns null for sec(π/2)', () => {
      const angle = new Angle(PI / 2, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.sec()).toBeNull();
    });

    it('returns null for csc(0)', () => {
      const angle = new Angle(0, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.csc()).toBeNull();
    });
  });

  describe('Edge cases - negative angles', () => {
    it('handles negative angles correctly', () => {
      const angle = new Angle(-PI / 4, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.sin()).toBeCloseTo(-Math.sqrt(2) / 2, 10);
      expect(trig.cos()).toBeCloseTo(Math.sqrt(2) / 2, 10);
    });
  });

  describe('Edge cases - angles > 2π', () => {
    it('handles angles greater than 2π', () => {
      const angle = new Angle(5 * PI / 4, 'radians');
      const trig = new TrigonometricValues(angle);
      // Should be equivalent to 5π/4 = π + π/4
      expect(trig.sin()).toBeCloseTo(-Math.sqrt(2) / 2, 10);
      expect(trig.cos()).toBeCloseTo(-Math.sqrt(2) / 2, 10);
    });
  });

  describe('Edge cases - near asymptotes', () => {
    it('handles angles very close to π/2', () => {
      const angle = new Angle(PI / 2 - 0.0001, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.tan()).not.toBeNull();
      expect(trig.tan()!).toBeGreaterThan(1000); // Very large value
    });

    it('handles angles very close to 0', () => {
      const angle = new Angle(0.0001, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.cot()).not.toBeNull();
      expect(trig.cot()!).toBeGreaterThan(1000); // Very large value
    });
  });

  describe('Single source of truth', () => {
    it('all values calculated from same angle', () => {
      const angle = new Angle(PI / 6, 'radians');
      const trig = new TrigonometricValues(angle);
      
      // Verify all values are consistent
      const sin = trig.sin();
      const cos = trig.cos();
      const tan = trig.tan();
      
      // Pythagorean identity: sin² + cos² = 1
      expect(sin * sin + cos * cos).toBeCloseTo(1, 10);
      
      // tan = sin / cos
      if (tan !== null) {
        expect(tan).toBeCloseTo(sin / cos, 10);
      }
    });
  });

  describe('angle getter', () => {
    it('returns the angle used for calculations', () => {
      const angle = new Angle(PI / 4, 'radians');
      const trig = new TrigonometricValues(angle);
      expect(trig.angle.equals(angle)).toBe(true);
    });
  });
});

describe('formatTrigValue', () => {
  it('formats regular values', () => {
    expect(formatTrigValue(0.5)).toBe('0.5000');
    expect(formatTrigValue(1.234567)).toBe('1.2346');
  });

  it('returns "undefined" for null', () => {
    expect(formatTrigValue(null)).toBe('undefined');
  });

  it('clamps tiny values to 0', () => {
    expect(formatTrigValue(1e-15)).toBe('0');
    expect(formatTrigValue(-1e-15)).toBe('0');
  });
});

describe('approximatelyEqual', () => {
  it('returns true for equal values', () => {
    expect(approximatelyEqual(1.0, 1.0)).toBe(true);
  });

  it('returns true for values within tolerance', () => {
    expect(approximatelyEqual(1.0, 1.00005, 0.0001)).toBe(true);
  });

  it('returns false for values outside tolerance', () => {
    expect(approximatelyEqual(1.0, 1.0002, 0.0001)).toBe(false);
  });
});
