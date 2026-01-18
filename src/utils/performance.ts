/**
 * Performance profiling utilities
 * Per milestone 16: Performance profiling during drag
 * Per spec Section 6.1.4: Performance Tests
 */

/**
 * Frame rate monitor for tracking 60fps target
 * Per spec Section 3.1: 60fps interactions on desktop
 */
export class FrameRateMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fpsHistory: number[] = [];
  private readonly historySize = 60; // Track last 60 frames (1 second at 60fps)

  /**
   * Record a frame
   * Call this in requestAnimationFrame or during drag updates
   */
  recordFrame(): void {
    this.frameCount++;
    const now = performance.now();
    const elapsed = now - this.lastTime;

    // Calculate FPS every second
    if (elapsed >= 1000) {
      const fps = (this.frameCount * 1000) / elapsed;
      this.fpsHistory.push(fps);
      
      // Keep history size limited
      if (this.fpsHistory.length > this.historySize) {
        this.fpsHistory.shift();
      }

      // Reset for next second
      this.frameCount = 0;
      this.lastTime = now;
    }
  }

  /**
   * Get current FPS (average over last second)
   */
  getCurrentFPS(): number {
    if (this.fpsHistory.length === 0) {
      return 0;
    }
    return this.fpsHistory[this.fpsHistory.length - 1];
  }

  /**
   * Get average FPS over history
   */
  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) {
      return 0;
    }
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    return sum / this.fpsHistory.length;
  }

  /**
   * Get minimum FPS in history
   */
  getMinFPS(): number {
    if (this.fpsHistory.length === 0) {
      return 0;
    }
    return Math.min(...this.fpsHistory);
  }

  /**
   * Check if performance meets 60fps target
   * Per spec Section 3.1: 60fps target
   */
  meetsTarget(): boolean {
    const avg = this.getAverageFPS();
    return avg >= 55; // Allow small margin (55fps = acceptable)
  }

  /**
   * Reset monitor
   */
  reset(): void {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
  }

  /**
   * Get performance report
   */
  getReport(): {
    current: number;
    average: number;
    min: number;
    meetsTarget: boolean;
  } {
    return {
      current: this.getCurrentFPS(),
      average: this.getAverageFPS(),
      min: this.getMinFPS(),
      meetsTarget: this.meetsTarget(),
    };
  }
}

/**
 * Performance metrics for Core Web Vitals
 * Per spec Section 6.1.4: Performance Targets
 */
export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint (target: ≤ 1s)
  tti?: number; // Time to Interactive (target: ≤ 2s)
  lcp?: number; // Largest Contentful Paint (target: ≤ 2.5s)
  cls?: number; // Cumulative Layout Shift (target: ≤ 0.1)
}

/**
 * Measure First Contentful Paint
 * Uses PerformanceObserver if available
 */
export function measureFCP(): Promise<number> {
  return new Promise((resolve) => {
    if (typeof PerformanceObserver === 'undefined') {
      resolve(0);
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(
          (entry) => entry.name === 'first-contentful-paint'
        ) as PerformancePaintTiming | undefined;

        if (fcpEntry) {
          resolve(fcpEntry.startTime);
          observer.disconnect();
        }
      });

      observer.observe({ entryTypes: ['paint'] });

      // Timeout after 5 seconds
      setTimeout(() => {
        observer.disconnect();
        resolve(0);
      }, 5000);
    } catch {
      resolve(0);
    }
  });
}

/**
 * Log performance metrics to console
 * Per spec Section 6.1.4: Performance monitoring
 */
export function logPerformanceMetrics(metrics: PerformanceMetrics): void {
  if (import.meta.env.DEV) {
    console.log('[Performance Metrics]', {
      'First Contentful Paint (FCP)': metrics.fcp
        ? `${metrics.fcp.toFixed(2)}ms ${metrics.fcp <= 1000 ? '✅' : '❌'}`
        : 'N/A',
      'Time to Interactive (TTI)': metrics.tti
        ? `${metrics.tti.toFixed(2)}ms ${metrics.tti <= 2000 ? '✅' : '❌'}`
        : 'N/A',
      'Largest Contentful Paint (LCP)': metrics.lcp
        ? `${metrics.lcp.toFixed(2)}ms ${metrics.lcp <= 2500 ? '✅' : '❌'}`
        : 'N/A',
      'Cumulative Layout Shift (CLS)': metrics.cls
        ? `${metrics.cls.toFixed(3)} ${metrics.cls <= 0.1 ? '✅' : '❌'}`
        : 'N/A',
    });
  }
}
