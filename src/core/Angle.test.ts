import { describe, it, expect } from 'vitest';
import { Angle, PI, TWO_PI, ANGLE_TOLERANCE } from './Angle';

describe('Angle', () => {
  describe('constructor', () => {
    it('creates angle in radians by default', () => {
      const angle = new Angle(PI);
      expect(angle.value).toBe(PI);
      expect(angle.unit).toBe('radians');
    });

    it('creates angle with specified unit', () => {
      const angle = new Angle(90, 'degrees');
      expect(angle.value).toBe(90);
      expect(angle.unit).toBe('degrees');
    });

    it('throws error for non-finite values', () => {
      expect(() => new Angle(NaN)).toThrow();
      expect(() => new Angle(Infinity)).toThrow();
      expect(() => new Angle(-Infinity)).toThrow();
    });
  });

  describe('toRadians', () => {
    it('returns value for radians', () => {
      const angle = new Angle(PI, 'radians');
      expect(angle.toRadians()).toBe(PI);
    });

    it('converts degrees to radians', () => {
      const angle = new Angle(180, 'degrees');
      expect(angle.toRadians()).toBeCloseTo(PI, 10);
    });

    it('converts 90 degrees to π/2', () => {
      const angle = new Angle(90, 'degrees');
      expect(angle.toRadians()).toBeCloseTo(PI / 2, 10);
    });
  });

  describe('toDegrees', () => {
    it('returns value for degrees', () => {
      const angle = new Angle(90, 'degrees');
      expect(angle.toDegrees()).toBe(90);
    });

    it('converts radians to degrees', () => {
      const angle = new Angle(PI, 'radians');
      expect(angle.toDegrees()).toBeCloseTo(180, 10);
    });

    it('converts π/2 to 90 degrees', () => {
      const angle = new Angle(PI / 2, 'radians');
      expect(angle.toDegrees()).toBeCloseTo(90, 10);
    });
  });

  describe('normalize', () => {
    it('normalizes angles in [0, 2π) for radians', () => {
      const angle1 = new Angle(0, 'radians');
      expect(angle1.normalize().value).toBe(0);

      const angle2 = new Angle(PI, 'radians');
      expect(angle2.normalize().value).toBe(PI);

      const angle3 = new Angle(TWO_PI, 'radians');
      expect(angle3.normalize().value).toBeCloseTo(0, 10);

      const angle4 = new Angle(3 * PI, 'radians');
      expect(angle4.normalize().value).toBeCloseTo(PI, 10);
    });

    it('normalizes negative angles', () => {
      const angle1 = new Angle(-PI / 2, 'radians');
      expect(angle1.normalize().value).toBeCloseTo((3 * PI) / 2, 10);

      const angle2 = new Angle(-PI, 'radians');
      expect(angle2.normalize().value).toBeCloseTo(PI, 10);
    });

    it('normalizes angles in [0°, 360°) for degrees', () => {
      const angle1 = new Angle(0, 'degrees');
      expect(angle1.normalize().value).toBe(0);

      const angle2 = new Angle(180, 'degrees');
      expect(angle2.normalize().value).toBe(180);

      const angle3 = new Angle(360, 'degrees');
      expect(angle3.normalize().value).toBe(0);

      const angle4 = new Angle(450, 'degrees');
      expect(angle4.normalize().value).toBe(90);
    });

    it('normalizes negative degrees', () => {
      const angle1 = new Angle(-90, 'degrees');
      expect(angle1.normalize().value).toBe(270);

      const angle2 = new Angle(-180, 'degrees');
      expect(angle2.normalize().value).toBe(180);
    });
  });

  describe('equals', () => {
    it('returns true for equal angles', () => {
      const angle1 = new Angle(PI, 'radians');
      const angle2 = new Angle(PI, 'radians');
      expect(angle1.equals(angle2)).toBe(true);
    });

    it('returns true for equivalent angles in different units', () => {
      const angle1 = new Angle(180, 'degrees');
      const angle2 = new Angle(PI, 'radians');
      expect(angle1.equals(angle2)).toBe(true);
    });

    it('returns false for different angles', () => {
      const angle1 = new Angle(PI / 2, 'radians');
      const angle2 = new Angle(PI, 'radians');
      expect(angle1.equals(angle2)).toBe(false);
    });

    it('handles angles within tolerance', () => {
      const angle1 = new Angle(PI, 'radians');
      const angle2 = new Angle(PI + ANGLE_TOLERANCE / 2, 'radians');
      expect(angle1.equals(angle2)).toBe(true);
    });
  });

  describe('static methods', () => {
    it('fromRadians creates angle in radians', () => {
      const angle = Angle.fromRadians(PI);
      expect(angle.value).toBe(PI);
      expect(angle.unit).toBe('radians');
    });

    it('fromDegrees creates angle in degrees', () => {
      const angle = Angle.fromDegrees(90);
      expect(angle.value).toBe(90);
      expect(angle.unit).toBe('degrees');
    });
  });

  describe('common angle constants', () => {
    it('defines common angles', () => {
      expect(Angle.ZERO.value).toBe(0);
      expect(Angle.PI_OVER_6.value).toBeCloseTo(PI / 6, 10);
      expect(Angle.PI_OVER_4.value).toBeCloseTo(PI / 4, 10);
      expect(Angle.PI_OVER_3.value).toBeCloseTo(PI / 3, 10);
      expect(Angle.PI_OVER_2.value).toBeCloseTo(PI / 2, 10);
      expect(Angle.PI.value).toBeCloseTo(PI, 10);
      expect(Angle.THREE_PI_OVER_2.value).toBeCloseTo((3 * PI) / 2, 10);
      expect(Angle.TWO_PI.value).toBeCloseTo(TWO_PI, 10);
    });
  });
});
