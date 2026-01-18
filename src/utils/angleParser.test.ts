/**
 * Tests for angleParser utilities
 * Per milestone 6: Angle input parsing
 */

import { describe, it, expect } from 'vitest';
import { Angle, PI } from '../core/Angle';
import { parseAngleInput, formatAngleForInput, detectNormalization } from './angleParser';

describe('parseAngleInput', () => {
  describe('plain numbers (assumes current unit)', () => {
    it('should parse number in degrees when current unit is degrees', () => {
      const result = parseAngleInput('30', 'degrees');
      expect(result.error).toBeNull();
      expect(result.angle).not.toBeNull();
      expect(result.angle?.toDegrees()).toBeCloseTo(30, 4);
    });

    it('should parse number in radians when current unit is radians', () => {
      const result = parseAngleInput('1.5', 'radians');
      expect(result.error).toBeNull();
      expect(result.angle).not.toBeNull();
      expect(result.angle?.toRadians()).toBeCloseTo(1.5, 4);
    });

    it('should parse negative numbers', () => {
      const result = parseAngleInput('-45', 'degrees');
      expect(result.error).toBeNull();
      expect(result.angle).not.toBeNull();
      expect(result.angle?.toDegrees()).toBeCloseTo(-45, 4);
    });

    it('should parse decimal numbers', () => {
      const result = parseAngleInput('30.5', 'degrees');
      expect(result.error).toBeNull();
      expect(result.angle).not.toBeNull();
      expect(result.angle?.toDegrees()).toBeCloseTo(30.5, 4);
    });
  });

  describe('numbers with unit', () => {
    it('should parse degrees with "deg" suffix', () => {
      const result = parseAngleInput('30deg', 'radians');
      expect(result.error).toBeNull();
      expect(result.angle).not.toBeNull();
      expect(result.angle?.toDegrees()).toBeCloseTo(30, 4);
    });

    it('should parse degrees with "degrees" suffix', () => {
      const result = parseAngleInput('45degrees', 'radians');
      expect(result.error).toBeNull();
      expect(result.angle).not.toBeNull();
      expect(result.angle?.toDegrees()).toBeCloseTo(45, 4);
    });

    it('should parse degrees with "°" symbol', () => {
      const result = parseAngleInput('60°', 'radians');
      expect(result.error).toBeNull();
      expect(result.angle).not.toBeNull();
      expect(result.angle?.toDegrees()).toBeCloseTo(60, 4);
    });

    it('should parse radians with "rad" suffix', () => {
      const result = parseAngleInput('1.2rad', 'degrees');
      expect(result.error).toBeNull();
      expect(result.angle).not.toBeNull();
      expect(result.angle?.toRadians()).toBeCloseTo(1.2, 4);
    });

    it('should parse radians with "radians" suffix', () => {
      const result = parseAngleInput('2.5radians', 'degrees');
      expect(result.error).toBeNull();
      expect(result.angle).not.toBeNull();
      expect(result.angle?.toRadians()).toBeCloseTo(2.5, 4);
    });

    it('should handle whitespace around unit', () => {
      const result = parseAngleInput('30 deg', 'radians');
      expect(result.error).toBeNull();
      expect(result.angle).not.toBeNull();
      expect(result.angle?.toDegrees()).toBeCloseTo(30, 4);
    });
  });

  describe('fractions of π', () => {
    it('should parse π/6', () => {
      const result = parseAngleInput('π/6', 'degrees');
      expect(result.error).toBeNull();
      expect(result.angle).not.toBeNull();
      expect(result.angle?.toRadians()).toBeCloseTo(PI / 6, 4);
    });

    it('should parse pi/6 (lowercase)', () => {
      const result = parseAngleInput('pi/6', 'degrees');
      expect(result.error).toBeNull();
      expect(result.angle).not.toBeNull();
      expect(result.angle?.toRadians()).toBeCloseTo(PI / 6, 4);
    });

    it('should parse PI/4 (uppercase)', () => {
      const result = parseAngleInput('PI/4', 'degrees');
      expect(result.error).toBeNull();
      expect(result.angle).not.toBeNull();
      expect(result.angle?.toRadians()).toBeCloseTo(PI / 4, 4);
    });

    it('should parse π/3', () => {
      const result = parseAngleInput('π/3', 'degrees');
      expect(result.error).toBeNull();
      expect(result.angle).not.toBeNull();
      expect(result.angle?.toRadians()).toBeCloseTo(PI / 3, 4);
    });

    it('should parse π/2', () => {
      const result = parseAngleInput('π/2', 'degrees');
      expect(result.error).toBeNull();
      expect(result.angle).not.toBeNull();
      expect(result.angle?.toRadians()).toBeCloseTo(PI / 2, 4);
    });

    it('should handle whitespace in fraction', () => {
      const result = parseAngleInput('π / 6', 'degrees');
      expect(result.error).toBeNull();
      expect(result.angle).not.toBeNull();
      expect(result.angle?.toRadians()).toBeCloseTo(PI / 6, 4);
    });

    it('should reject division by zero', () => {
      const result = parseAngleInput('π/0', 'degrees');
      expect(result.angle).toBeNull();
      expect(result.error).toContain('Cannot divide by zero');
    });

    it('should parse decimal denominators', () => {
      const result = parseAngleInput('π/2.5', 'degrees');
      expect(result.error).toBeNull();
      expect(result.angle).not.toBeNull();
      expect(result.angle?.toRadians()).toBeCloseTo(PI / 2.5, 4);
    });
  });

  describe('error cases', () => {
    it('should reject empty input', () => {
      const result = parseAngleInput('', 'degrees');
      expect(result.angle).toBeNull();
      expect(result.error).toContain('cannot be empty');
    });

    it('should reject whitespace-only input', () => {
      const result = parseAngleInput('   ', 'degrees');
      expect(result.angle).toBeNull();
      expect(result.error).toBeTruthy();
    });

    it('should reject invalid format', () => {
      const result = parseAngleInput('abc', 'degrees');
      expect(result.angle).toBeNull();
      expect(result.error).toContain('Invalid angle format');
    });

    it('should reject unknown unit', () => {
      const result = parseAngleInput('30xyz', 'degrees');
      expect(result.angle).toBeNull();
      expect(result.error).toContain('Invalid angle format');
    });
  });
});

describe('formatAngleForInput', () => {
  it('should format degrees correctly', () => {
    const angle = Angle.fromDegrees(30);
    const formatted = formatAngleForInput(angle, 'degrees');
    expect(formatted).toBe('30.00');
  });

  it('should format radians correctly', () => {
    const angle = Angle.fromRadians(1.5);
    const formatted = formatAngleForInput(angle, 'radians');
    expect(formatted).toBe('1.5000');
  });

  it('should format common angles as fractions of π', () => {
    expect(formatAngleForInput(Angle.ZERO, 'radians')).toBe('0');
    expect(formatAngleForInput(Angle.PI, 'radians')).toBe('π');
    expect(formatAngleForInput(Angle.TWO_PI, 'radians')).toBe('2π');
    expect(formatAngleForInput(Angle.PI_OVER_2, 'radians')).toBe('π/2');
    expect(formatAngleForInput(Angle.THREE_PI_OVER_2, 'radians')).toBe('3π/2');
    expect(formatAngleForInput(Angle.PI_OVER_3, 'radians')).toBe('π/3');
    expect(formatAngleForInput(Angle.PI_OVER_4, 'radians')).toBe('π/4');
    expect(formatAngleForInput(Angle.PI_OVER_6, 'radians')).toBe('π/6');
  });
});

describe('detectNormalization', () => {
  describe('degrees', () => {
    it('should detect normalization for large positive angles', () => {
      const original = 20000;
      const normalized = Angle.fromDegrees(200); // 20000 % 360 = 200
      const info = detectNormalization(original, normalized, 'degrees');
      
      expect(info.wasNormalized).toBe(true);
      expect(info.rotations).toBe(55); // 20000 / 360 = 55.55... → 55
      expect(info.message).toContain('20000.00°');
      expect(info.message).toContain('200.00°');
      expect(info.message).toContain('55 full rotations');
    });

    it('should detect normalization for angles just over 360', () => {
      const original = 450;
      const normalized = Angle.fromDegrees(90); // 450 % 360 = 90
      const info = detectNormalization(original, normalized, 'degrees');
      
      expect(info.wasNormalized).toBe(true);
      expect(info.rotations).toBe(1);
      expect(info.message).toContain('1 full rotation');
    });

    it('should not detect normalization for angles within range', () => {
      const original = 200;
      const normalized = Angle.fromDegrees(200);
      const info = detectNormalization(original, normalized, 'degrees');
      
      expect(info.wasNormalized).toBe(false);
      expect(info.rotations).toBe(0);
      expect(info.message).toBe('');
    });

    it('should handle negative angles', () => {
      const original = -30;
      const normalized = Angle.fromDegrees(330); // -30 normalized to 330
      const info = detectNormalization(original, normalized, 'degrees');
      
      expect(info.wasNormalized).toBe(true);
      expect(info.rotations).toBe(-1); // -30 / 360 = -0.083... → Math.floor = -1
      expect(info.message).toContain('-30.00°');
      expect(info.message).toContain('330.00°');
    });

    it('should handle exactly 360 degrees', () => {
      const original = 360;
      const normalized = Angle.fromDegrees(0); // 360 % 360 = 0
      const info = detectNormalization(original, normalized, 'degrees');
      
      expect(info.wasNormalized).toBe(true);
      expect(info.rotations).toBe(1);
    });
  });

  describe('radians', () => {
    it('should detect normalization for large positive angles', () => {
      const original = 20000;
      const normalized = Angle.fromRadians(0.6212); // 20000 % (2π) ≈ 0.6212
      const info = detectNormalization(original, normalized, 'radians');
      
      expect(info.wasNormalized).toBe(true);
      expect(info.rotations).toBeGreaterThan(0);
      expect(info.message).toContain('20000.0000 rad');
      expect(info.message).toContain('0.6212 rad');
      expect(info.message).toContain('full rotations');
    });

    it('should detect normalization for angles just over 2π', () => {
      const original = 3 * PI;
      const normalized = Angle.fromRadians(PI); // 3π % 2π = π
      const info = detectNormalization(original, normalized, 'radians');
      
      expect(info.wasNormalized).toBe(true);
      expect(info.rotations).toBe(1);
      expect(info.message).toContain('1 full rotation');
    });

    it('should not detect normalization for angles within range', () => {
      const original = PI / 2;
      const normalized = Angle.fromRadians(PI / 2);
      const info = detectNormalization(original, normalized, 'radians');
      
      expect(info.wasNormalized).toBe(false);
      expect(info.rotations).toBe(0);
      expect(info.message).toBe('');
    });

    it('should handle negative angles', () => {
      const original = -PI / 2;
      const normalized = Angle.fromRadians((3 * PI) / 2); // -π/2 % 2π = 3π/2
      const info = detectNormalization(original, normalized, 'radians');
      
      expect(info.wasNormalized).toBe(true);
      expect(info.rotations).toBe(-1);
      expect(info.message).toContain('full rotation'); // Singular because Math.abs(-1) = 1
    });
  });
});
