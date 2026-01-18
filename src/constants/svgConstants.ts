/**
 * SVG coordinate system constants
 * 
 * These constants define the SVG viewBox and coordinate system:
 * - viewBox is 400×400
 * - Center is at (200, 200)
 * - Unit circle radius = 1 in math coordinates = 150 pixels in SVG
 * 
 * These values must be consistent across all files that perform
 * coordinate conversions between mathematical and SVG coordinates.
 */

/**
 * X coordinate of the SVG center (half of SVG_SIZE)
 */
export const SVG_CENTER_X = 200;

/**
 * Y coordinate of the SVG center (half of SVG_SIZE)
 */
export const SVG_CENTER_Y = 200;

/**
 * Unit circle radius in SVG pixels
 * Unit circle radius = 1 in math coordinates = 150 pixels in SVG
 */
export const SVG_RADIUS = 150;

/**
 * SVG viewBox size (width and height)
 */
export const SVG_SIZE = 400;
