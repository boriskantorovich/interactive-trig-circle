/**
 * Tests for TriangleRenderer
 * Per milestone 5: Reference triangle tests
 */

import { describe, it, expect } from 'vitest';
import { renderReferenceTriangle, getTrianglePathData } from './TriangleRenderer';
import { Angle } from '../core/Angle';
import { TrigonometricValues } from '../core/Trigonometry';

describe('TriangleRenderer', () => {
  it('should render triangle for angle 0', () => {
    const angle = Angle.ZERO;
    const triangle = renderReferenceTriangle(angle);

    expect(triangle.path).toBeTruthy();
    expect(triangle.vertices).toBeDefined();
    expect(triangle.vertices.origin).toBeDefined();
    expect(triangle.vertices.point).toBeDefined();
    expect(triangle.vertices.xAxis).toBeDefined();
  });

  it('should render triangle for angle π/2', () => {
    const angle = Angle.PI_OVER_2;
    const triangle = renderReferenceTriangle(angle);

    expect(triangle.path).toBeTruthy();
    // At π/2, point should be at top (y = 1, x = 0)
    expect(triangle.vertices.point.x).toBeCloseTo(200, 1); // SVG center X
    expect(triangle.vertices.point.y).toBeCloseTo(50, 1); // SVG center Y - radius (200 - 150)
  });

  it('should render triangle for angle π', () => {
    const angle = Angle.PI;
    const triangle = renderReferenceTriangle(angle);

    expect(triangle.path).toBeTruthy();
    // At π, point should be at left (x = -1, y = 0)
    expect(triangle.vertices.point.x).toBeCloseTo(50, 1); // SVG center X - radius (200 - 150)
    expect(triangle.vertices.point.y).toBeCloseTo(200, 1); // SVG center Y
  });

  it('should include labels when showLabels is true', () => {
    const angle = Angle.PI_OVER_4; // 45 degrees
    const triangle = renderReferenceTriangle(angle, { showLabels: true });

    expect(triangle.labels.opposite).toBeDefined();
    expect(triangle.labels.adjacent).toBeDefined();
    expect(triangle.labels.hypotenuse).toBeDefined();

    expect(triangle.labels.opposite?.text).toContain('sin');
    expect(triangle.labels.adjacent?.text).toContain('cos');
  });

  it('should not include labels when showLabels is false', () => {
    const angle = Angle.PI_OVER_4;
    const triangle = renderReferenceTriangle(angle, { showLabels: false });

    expect(triangle.labels.opposite).toBeUndefined();
    expect(triangle.labels.adjacent).toBeUndefined();
    expect(triangle.labels.hypotenuse).toBeUndefined();
  });

  it('should use custom stroke width', () => {
    const angle = Angle.ZERO;
    const triangle = renderReferenceTriangle(angle, { strokeWidth: 3 });

    expect(triangle.options.strokeWidth).toBe(3);
  });

  it('should use custom colors', () => {
    const angle = Angle.ZERO;
    const triangle = renderReferenceTriangle(angle, {
      strokeColor: '#ff0000',
      fillColor: '#00ff00',
    });

    expect(triangle.options.strokeColor).toBe('#ff0000');
    expect(triangle.options.fillColor).toBe('#00ff00');
  });

  it('should calculate correct triangle vertices', () => {
    const angle = Angle.PI_OVER_4; // 45 degrees
    const triangle = renderReferenceTriangle(angle);

    // Origin should be at SVG center
    expect(triangle.vertices.origin.x).toBe(200);
    expect(triangle.vertices.origin.y).toBe(200);

    // Point should be on unit circle
    const distanceFromOrigin = Math.sqrt(
      Math.pow(triangle.vertices.point.x - 200, 2) +
        Math.pow(triangle.vertices.point.y - 200, 2)
    );
    expect(distanceFromOrigin).toBeCloseTo(150, 1); // SVG radius

    // xAxis point should have same x as point, but y = center Y
    expect(triangle.vertices.xAxis.x).toBeCloseTo(triangle.vertices.point.x, 1);
    expect(triangle.vertices.xAxis.y).toBe(200);
  });

  it('should show correct trigonometric values in labels', () => {
    const angle = Angle.PI_OVER_6; // 30 degrees
    const trigValues = new TrigonometricValues(angle);
    const triangle = renderReferenceTriangle(angle, { showLabels: true });

    expect(triangle.labels.opposite?.text).toContain(
      trigValues.sin().toFixed(3)
    );
    expect(triangle.labels.adjacent?.text).toContain(
      trigValues.cos().toFixed(3)
    );
  });

  it('should return path data string', () => {
    const angle = Angle.PI_OVER_3; // 60 degrees
    const pathData = getTrianglePathData(angle);

    expect(pathData).toBeTruthy();
    expect(typeof pathData).toBe('string');
    expect(pathData).toContain('M'); // Move command
    expect(pathData).toContain('L'); // Line command
    expect(pathData).toContain('Z'); // Close path
  });

  it('should handle angle 3π/2', () => {
    const angle = Angle.THREE_PI_OVER_2;
    const triangle = renderReferenceTriangle(angle);

    expect(triangle.path).toBeTruthy();
    // At 3π/2, point should be at bottom (y = -1, x = 0)
    expect(triangle.vertices.point.x).toBeCloseTo(200, 1);
    expect(triangle.vertices.point.y).toBeCloseTo(350, 1); // SVG center Y + radius (200 + 150)
  });

  it('should use default options when none provided', () => {
    const angle = Angle.ZERO;
    const triangle = renderReferenceTriangle(angle);

    expect(triangle.options.strokeWidth).toBe(1.5);
    expect(triangle.options.strokeColor).toBe('var(--color-primary)');
    expect(triangle.options.fillColor).toBe('none');
    expect(triangle.options.fillOpacity).toBe(0.1);
    expect(triangle.options.showLabels).toBe(true);
    expect(triangle.options.labelFontSize).toBe(12);
    expect(triangle.options.labelColor).toBe('var(--color-text-medium)');
  });
});
