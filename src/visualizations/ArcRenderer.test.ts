/**
 * Tests for ArcRenderer
 * Per milestone 4: Verify angle arc visualization
 */

import { describe, it, expect } from 'vitest';
import { renderAngleArc, getArcPathData } from './ArcRenderer';
import { Angle } from '../core/Angle';

describe('ArcRenderer', () => {
  describe('renderAngleArc', () => {
    it('should render arc for angle 0', () => {
      const result = renderAngleArc(Angle.ZERO);
      expect(result.d).toContain('M 200 200'); // Center
      expect(result.d).toContain('L 245 200'); // Start at positive x-axis
    });

    it('should render arc for π/2 (90 degrees)', () => {
      const result = renderAngleArc(Angle.PI_OVER_2);
      expect(result.d).toContain('M 200 200'); // Center
      expect(result.d).toContain('L 245 200'); // Start at positive x-axis
      // End should be at top (y < 200 in SVG)
      expect(result.d).toContain('200 155'); // Approximately at top
    });

    it('should render arc for π (180 degrees)', () => {
      const result = renderAngleArc(Angle.PI);
      // Should use large-arc-flag = 0 (small arc) since π = 180° exactly
      // sweep-flag = 0 (counter-clockwise)
      expect(result.d).toContain('A 45 45 0 0 0'); // large-arc-flag = 0, sweep-flag = 0
    });

    it('should render arc for 3π/2 (270 degrees)', () => {
      const result = renderAngleArc(Angle.THREE_PI_OVER_2);
      // Should use large-arc-flag = 1 (large arc) since > 180°
      // sweep-flag = 0 (counter-clockwise)
      expect(result.d).toContain('A 45 45 0 1 0'); // large-arc-flag = 1, sweep-flag = 0
    });

    it('should use custom options', () => {
      const result = renderAngleArc(Angle.PI_OVER_4, {
        arcRadius: 0.5,
        strokeWidth: 3,
        strokeColor: 'red',
        fillColor: 'blue',
        opacity: 0.5,
      });
      expect(result.strokeWidth).toBe(3);
      expect(result.stroke).toBe('red');
      expect(result.fill).toBe('blue');
      expect(result.opacity).toBe(0.5);
    });
  });

  describe('getArcPathData', () => {
    it('should return path data string', () => {
      const pathData = getArcPathData(Angle.PI_OVER_2);
      expect(typeof pathData).toBe('string');
      expect(pathData).toContain('M');
      expect(pathData).toContain('A');
      expect(pathData).toContain('Z');
    });
  });
});
