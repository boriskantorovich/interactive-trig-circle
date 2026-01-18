import { describe, it, expect } from 'vitest';
import { Point } from './Point';
import { Angle, PI } from './Angle';

describe('Point', () => {
  describe('constructor', () => {
    it('creates point with x and y coordinates', () => {
      const point = new Point(1, 2);
      expect(point.x).toBe(1);
      expect(point.y).toBe(2);
    });

    it('throws error for non-finite coordinates', () => {
      expect(() => new Point(NaN, 0)).toThrow();
      expect(() => new Point(0, Infinity)).toThrow();
      expect(() => new Point(0, -Infinity)).toThrow();
    });
  });

  describe('distanceTo', () => {
    it('calculates distance to another point', () => {
      const p1 = new Point(0, 0);
      const p2 = new Point(3, 4);
      expect(p1.distanceTo(p2)).toBe(5);
    });

    it('calculates distance to origin', () => {
      const point = new Point(3, 4);
      expect(point.distanceTo(Point.ORIGIN)).toBe(5);
    });

    it('returns 0 for same point', () => {
      const point = new Point(1, 1);
      expect(point.distanceTo(point)).toBe(0);
    });
  });

  describe('angle', () => {
    it('calculates angle from origin', () => {
      const point = new Point(1, 0);
      const angle = point.angle();
      expect(angle.toRadians()).toBeCloseTo(0, 10);
    });

    it('calculates angle for point on positive y-axis', () => {
      const point = new Point(0, 1);
      const angle = point.angle();
      expect(angle.toRadians()).toBeCloseTo(PI / 2, 10);
    });

    it('calculates angle for point on negative x-axis', () => {
      const point = new Point(-1, 0);
      const angle = point.angle();
      expect(angle.toRadians()).toBeCloseTo(PI, 10);
    });

    it('calculates angle for point on negative y-axis', () => {
      const point = new Point(0, -1);
      const angle = point.angle();
      expect(angle.toRadians()).toBeCloseTo(-PI / 2, 10);
    });

    it('calculates angle for point at 45 degrees', () => {
      const point = new Point(1, 1);
      const angle = point.angle();
      expect(angle.toDegrees()).toBeCloseTo(45, 10);
    });
  });

  describe('onUnitCircle', () => {
    it('returns true for point on unit circle', () => {
      const point = new Point(1, 0);
      expect(point.onUnitCircle()).toBe(true);
    });

    it('returns true for point on unit circle at 45 degrees', () => {
      const sqrt2over2 = Math.sqrt(2) / 2;
      const point = new Point(sqrt2over2, sqrt2over2);
      expect(point.onUnitCircle()).toBe(true);
    });

    it('returns false for point not on unit circle', () => {
      const point = new Point(2, 0);
      expect(point.onUnitCircle()).toBe(false);
    });

    it('returns false for point at origin', () => {
      const point = new Point(0, 0);
      expect(point.onUnitCircle()).toBe(false);
    });

    it('uses custom tolerance', () => {
      const point = new Point(1.0002, 0);
      expect(point.onUnitCircle(0.001)).toBe(true);
      expect(point.onUnitCircle(0.0001)).toBe(false);
    });
  });

  describe('fromAngle', () => {
    it('creates point on unit circle at given angle', () => {
      const angle = new Angle(0, 'radians');
      const point = Point.fromAngle(angle);
      expect(point.x).toBeCloseTo(1, 10);
      expect(point.y).toBeCloseTo(0, 10);
      expect(point.onUnitCircle()).toBe(true);
    });

    it('creates point at π/2', () => {
      const angle = new Angle(PI / 2, 'radians');
      const point = Point.fromAngle(angle);
      expect(point.x).toBeCloseTo(0, 10);
      expect(point.y).toBeCloseTo(1, 10);
    });

    it('creates point at π', () => {
      const angle = new Angle(PI, 'radians');
      const point = Point.fromAngle(angle);
      expect(point.x).toBeCloseTo(-1, 10);
      expect(point.y).toBeCloseTo(0, 10);
    });

    it('creates point from degrees', () => {
      const angle = new Angle(90, 'degrees');
      const point = Point.fromAngle(angle);
      expect(point.x).toBeCloseTo(0, 10);
      expect(point.y).toBeCloseTo(1, 10);
    });
  });

  describe('ORIGIN constant', () => {
    it('defines origin point', () => {
      expect(Point.ORIGIN.x).toBe(0);
      expect(Point.ORIGIN.y).toBe(0);
    });
  });
});
