/**
 * Tests for FunctionLineRenderer
 * Per milestone 8: Geometric visuals for all 6 functions
 */

import { describe, it, expect } from 'vitest';
import { Angle } from '../core/Angle';
import { TrigonometricValues } from '../core/Trigonometry';
import { renderFunctionLines } from './FunctionLineRenderer';

describe('FunctionLineRenderer', () => {
  describe('renderFunctionLines', () => {
    it('should render sin line correctly', () => {
      const angle = Angle.fromDegrees(30);
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);

      expect(result.sin).toBeDefined();
      expect(result.sin.path).toBeTruthy();
      expect(result.sin.isUndefined).toBe(false);
      expect(result.sin.value).toBeCloseTo(0.5, 4);
    });

    it('should render cos line correctly', () => {
      const angle = Angle.fromDegrees(60);
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);

      expect(result.cos).toBeDefined();
      expect(result.cos.path).toBeTruthy();
      expect(result.cos.isUndefined).toBe(false);
      expect(result.cos.value).toBeCloseTo(0.5, 4);
    });

    it('should handle tan at π/2 (undefined)', () => {
      const angle = Angle.PI_OVER_2; // 90 degrees
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);

      expect(result.tan).toBeDefined();
      expect(result.tan.isUndefined).toBe(true);
      expect(result.tan.value).toBeNull();
      expect(result.tan.path).toBeTruthy(); // Should show asymptote
    });

    it('should handle tan at 3π/2 (undefined)', () => {
      const angle = Angle.THREE_PI_OVER_2; // 270 degrees
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);

      expect(result.tan).toBeDefined();
      expect(result.tan.isUndefined).toBe(true);
      expect(result.tan.value).toBeNull();
      expect(result.tan.path).toBeTruthy(); // Should show asymptote
    });

    it('should render tan line correctly when defined', () => {
      const angle = Angle.fromDegrees(45);
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);

      expect(result.tan).toBeDefined();
      expect(result.tan.path).toBeTruthy();
      expect(result.tan.isUndefined).toBe(false);
      expect(result.tan.value).toBeCloseTo(1, 4);
    });

    it('should verify tan line length matches tan value', () => {
      const angle = Angle.fromDegrees(30);
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);
      const secValue = trigValues.sec()!;
      const point = { x: Math.cos(angle.toRadians()), y: Math.sin(angle.toRadians()) };

      // tan line should be from (sec(θ), 0) to (cos(θ), sin(θ))
      // Length should be |tan(θ)| (the distance along the tangent line)
      if (result.tan.start && result.tan.end) {
        const dx = result.tan.end.x - result.tan.start.x;
        const dy = result.tan.end.y - result.tan.start.y;
        const lengthInSvg = Math.sqrt(dx * dx + dy * dy);
        // Convert SVG length to math coordinates (divide by SVG_RADIUS)
        const lengthInMath = lengthInSvg / 150; // SVG_RADIUS = 150
        // Calculate expected length: distance from (sec(θ), 0) to (cos(θ), sin(θ))
        const expectedLength = Math.sqrt(Math.pow(point.x - secValue, 2) + Math.pow(point.y - 0, 2));
        expect(lengthInMath).toBeCloseTo(expectedLength, 2);
      }
    });

    it('should handle cot at 0 (undefined)', () => {
      const angle = Angle.ZERO;
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);

      expect(result.cot).toBeDefined();
      expect(result.cot.isUndefined).toBe(true);
      expect(result.cot.value).toBeNull();
      expect(result.cot.path).toBeTruthy(); // Should show asymptote
    });

    it('should handle cot at π (undefined)', () => {
      const angle = Angle.PI; // 180 degrees
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);

      expect(result.cot).toBeDefined();
      expect(result.cot.isUndefined).toBe(true);
      expect(result.cot.value).toBeNull();
      expect(result.cot.path).toBeTruthy(); // Should show asymptote
    });

    it('should render cot line correctly when defined', () => {
      const angle = Angle.fromDegrees(45);
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);

      expect(result.cot).toBeDefined();
      expect(result.cot.path).toBeTruthy();
      expect(result.cot.isUndefined).toBe(false);
      expect(result.cot.value).toBeCloseTo(1, 4);
    });

    it('should verify cot line length matches cot value', () => {
      const angle = Angle.fromDegrees(60);
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);
      const cscValue = trigValues.csc()!;
      const point = { x: Math.cos(angle.toRadians()), y: Math.sin(angle.toRadians()) };

      // cot line should be from (0, csc(θ)) to (cos(θ), sin(θ))
      // Length should be the distance along the tangent line
      if (result.cot.start && result.cot.end) {
        const dx = result.cot.end.x - result.cot.start.x;
        const dy = result.cot.end.y - result.cot.start.y;
        const lengthInSvg = Math.sqrt(dx * dx + dy * dy);
        // Convert SVG length to math coordinates (divide by SVG_RADIUS)
        const lengthInMath = lengthInSvg / 150; // SVG_RADIUS = 150
        // Calculate expected length: distance from (0, csc(θ)) to (cos(θ), sin(θ))
        const expectedLength = Math.sqrt(Math.pow(point.x - 0, 2) + Math.pow(point.y - cscValue, 2));
        expect(lengthInMath).toBeCloseTo(expectedLength, 2);
      }
    });

    it('should handle sec at π/2 (undefined)', () => {
      const angle = Angle.PI_OVER_2; // 90 degrees
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);

      expect(result.sec).toBeDefined();
      expect(result.sec.isUndefined).toBe(true);
      expect(result.sec.value).toBeNull();
      expect(result.sec.path).toBeTruthy(); // Should show asymptote
    });

    it('should render sec line correctly when defined', () => {
      const angle = Angle.ZERO;
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);

      expect(result.sec).toBeDefined();
      expect(result.sec.path).toBeTruthy();
      expect(result.sec.isUndefined).toBe(false);
      expect(result.sec.value).toBeCloseTo(1, 4);
    });

    it('should verify sec line length matches sec value', () => {
      const angle = Angle.fromDegrees(60);
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);
      const secValue = trigValues.sec()!;

      // sec line should be along x-axis from origin to (sec(θ), 0)
      // Length should be |sec(θ)|
      if (result.sec.start && result.sec.end) {
        const dx = result.sec.end.x - result.sec.start.x;
        const dy = result.sec.end.y - result.sec.start.y;
        const lengthInSvg = Math.sqrt(dx * dx + dy * dy);
        // Convert SVG length to math coordinates (divide by SVG_RADIUS)
        const lengthInMath = lengthInSvg / 150; // SVG_RADIUS = 150
        expect(lengthInMath).toBeCloseTo(Math.abs(secValue), 2);
      }
    });

    it('should handle csc at 0 (undefined)', () => {
      const angle = Angle.ZERO;
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);

      expect(result.csc).toBeDefined();
      expect(result.csc.isUndefined).toBe(true);
      expect(result.csc.value).toBeNull();
      expect(result.csc.path).toBeTruthy(); // Should show asymptote
    });

    it('should render csc line correctly when defined', () => {
      const angle = Angle.PI_OVER_2; // 90 degrees
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);

      expect(result.csc).toBeDefined();
      expect(result.csc.path).toBeTruthy();
      expect(result.csc.isUndefined).toBe(false);
      expect(result.csc.value).toBeCloseTo(1, 4);
    });

    it('should verify csc line length matches csc value', () => {
      const angle = Angle.fromDegrees(30);
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);
      const cscValue = trigValues.csc()!;

      // csc line should be along y-axis from origin to (0, csc(θ))
      // Length should be |csc(θ)|
      if (result.csc.start && result.csc.end) {
        const dx = result.csc.end.x - result.csc.start.x;
        const dy = result.csc.end.y - result.csc.start.y;
        const lengthInSvg = Math.sqrt(dx * dx + dy * dy);
        // Convert SVG length to math coordinates (divide by SVG_RADIUS)
        const lengthInMath = lengthInSvg / 150; // SVG_RADIUS = 150
        expect(lengthInMath).toBeCloseTo(Math.abs(cscValue), 2);
      }
    });

    it('should render all functions for a typical angle', () => {
      const angle = Angle.fromDegrees(30);
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);

      // All functions should be defined at 30 degrees
      expect(result.sin.path).toBeTruthy();
      expect(result.cos.path).toBeTruthy();
      expect(result.tan.path).toBeTruthy();
      expect(result.cot.path).toBeTruthy();
      expect(result.sec.path).toBeTruthy();
      expect(result.csc.path).toBeTruthy();

      // None should be undefined
      expect(result.sin.isUndefined).toBe(false);
      expect(result.cos.isUndefined).toBe(false);
      expect(result.tan.isUndefined).toBe(false);
      expect(result.cot.isUndefined).toBe(false);
      expect(result.sec.isUndefined).toBe(false);
      expect(result.csc.isUndefined).toBe(false);
    });

    it('should respect options for functions to render', () => {
      const angle = Angle.fromDegrees(45);
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues, {
        functionsToRender: ['sin', 'cos'],
      });

      // All functions should still be calculated, but we can check options
      expect(result.options.functionsToRender).toEqual(['sin', 'cos']);
    });

    it('should handle options for opacity', () => {
      const angle = Angle.fromDegrees(45);
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues, {
        opacity: 0.5,
        undefinedOpacity: 0.2,
      });

      expect(result.options.opacity).toBe(0.5);
      expect(result.options.undefinedOpacity).toBe(0.2);
    });

    it('should handle edge case near asymptote (tan near π/2)', () => {
      // Angle very close to π/2 but not exactly
      const angle = new Angle(Math.PI / 2 - 0.001, 'radians');
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);

      // Should still be defined (not undefined) but value will be very large
      expect(result.tan.isUndefined).toBe(false);
      expect(result.tan.value).toBeGreaterThan(100); // Very large positive value
    });

    it('should handle edge case near asymptote (cot near 0)', () => {
      // Angle very close to 0 but not exactly
      const angle = new Angle(0.001, 'radians');
      const trigValues = new TrigonometricValues(angle);
      const result = renderFunctionLines(angle, trigValues);

      // Should still be defined (not undefined) but value will be very large
      expect(result.cot.isUndefined).toBe(false);
      expect(result.cot.value).toBeGreaterThan(100); // Very large positive value
    });
  });
});
