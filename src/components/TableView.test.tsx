/**
 * TableView component tests
 * Per milestone 10: Table view tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TableView } from './TableView';
import { useCurrentAngle, useAngleUnit, useStore } from '../state/store';
import { Angle } from '../core/Angle';

// Mock the store hooks
vi.mock('../state/store', () => ({
  useCurrentAngle: vi.fn(),
  useAngleUnit: vi.fn(),
  useStore: vi.fn(),
}));

describe('TableView', () => {
  const mockSetAngle = vi.fn();

  beforeEach(() => {
    vi.mocked(useCurrentAngle).mockReturnValue(new Angle(0, 'radians'));
    vi.mocked(useAngleUnit).mockReturnValue('radians');
    vi.mocked(useStore).mockReturnValue(mockSetAngle);
    mockSetAngle.mockClear();
  });

  it('renders table view with title', () => {
    render(<TableView />);
    expect(screen.getByText('Common Angle Values')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(<TableView />);
    expect(screen.getByText('Angle')).toBeInTheDocument();
    expect(screen.getByText('sin(θ)')).toBeInTheDocument();
    expect(screen.getByText('cos(θ)')).toBeInTheDocument();
    expect(screen.getByText('tan(θ)')).toBeInTheDocument();
    expect(screen.getByText('cot(θ)')).toBeInTheDocument();
    expect(screen.getByText('sec(θ)')).toBeInTheDocument();
    expect(screen.getByText('csc(θ)')).toBeInTheDocument();
  });

  it('renders common angles in table', () => {
    render(<TableView />);
    // Check for some common angles (using getAllByText since values like "0" appear multiple times)
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
    expect(screen.getByText('π/6')).toBeInTheDocument();
    expect(screen.getByText('π/4')).toBeInTheDocument();
    expect(screen.getByText('π/2')).toBeInTheDocument();
    expect(screen.getByText('π')).toBeInTheDocument();
  });

  it('displays exact values for common angles', () => {
    render(<TableView />);
    // Check for exact values (using getAllByText since values like "1/2" appear multiple times)
    expect(screen.getAllByText('1/2').length).toBeGreaterThan(0); // sin(30°) and cos(60°)
    expect(screen.getAllByText('√3/2').length).toBeGreaterThan(0); // cos(30°) and sin(60°)
    expect(screen.getAllByText('√2/2').length).toBeGreaterThan(0); // sin/cos(45°)
    expect(screen.getAllByText('1').length).toBeGreaterThan(0); // sin(90°), cos(0°), etc.
  });

  it('displays undefined values correctly', () => {
    render(<TableView />);
    // tan(90°) should be undefined
    const undefinedCells = screen.getAllByText('undefined');
    expect(undefinedCells.length).toBeGreaterThan(0);
  });

  it('displays angles in radians when angleUnit is radians', () => {
    vi.mocked(useAngleUnit).mockReturnValue('radians');
    render(<TableView />);
    expect(screen.getByText('π/6')).toBeInTheDocument();
  });

  it('displays angles in degrees when angleUnit is degrees', () => {
    vi.mocked(useAngleUnit).mockReturnValue('degrees');
    render(<TableView />);
    expect(screen.getByText('30°')).toBeInTheDocument();
    expect(screen.getByText('45°')).toBeInTheDocument();
  });

  it('highlights row nearest to current angle', () => {
    // Set current angle to π/4 (45°)
    vi.mocked(useCurrentAngle).mockReturnValue(new Angle(Math.PI / 4, 'radians'));
    const { container } = render(<TableView />);
    
    // Find the row with π/4
    const rows = container.querySelectorAll('.table-view__row');
    let highlightedRow: Element | null = null;
    
    rows.forEach((row) => {
      if (row.classList.contains('table-view__row--highlighted')) {
        highlightedRow = row;
      }
    });
    
    expect(highlightedRow).not.toBeNull();
    expect((highlightedRow as unknown as Element).textContent).toContain('π/4');
  });

  it('calls setAngle when row is clicked', () => {
    render(<TableView />);
    
    // Find and click a row (e.g., the row with π/4)
    const rowWithPiOver4 = screen.getByText('π/4').closest('tr');
    expect(rowWithPiOver4).not.toBeNull();
    
    if (rowWithPiOver4) {
      fireEvent.click(rowWithPiOver4);
      expect(mockSetAngle).toHaveBeenCalledTimes(1);
      // Verify it was called with an Angle object
      const callArg = mockSetAngle.mock.calls[0][0];
      expect(callArg).toBeInstanceOf(Angle);
    }
  });

  it('calls setAngle when row is activated with Enter key', () => {
    render(<TableView />);
    
    const rowWithPiOver4 = screen.getByText('π/4').closest('tr');
    expect(rowWithPiOver4).not.toBeNull();
    
    if (rowWithPiOver4) {
      fireEvent.keyDown(rowWithPiOver4, { key: 'Enter' });
      expect(mockSetAngle).toHaveBeenCalledTimes(1);
    }
  });

  it('calls setAngle when row is activated with Space key', () => {
    render(<TableView />);
    
    const rowWithPiOver4 = screen.getByText('π/4').closest('tr');
    expect(rowWithPiOver4).not.toBeNull();
    
    if (rowWithPiOver4) {
      fireEvent.keyDown(rowWithPiOver4, { key: ' ' });
      expect(mockSetAngle).toHaveBeenCalledTimes(1);
    }
  });

  it('displays hint text', () => {
    render(<TableView />);
    expect(
      screen.getByText(/Click a row to set the angle/i)
    ).toBeInTheDocument();
  });

  it('highlights correct row when angle is close to 30 degrees', () => {
    // Set current angle to approximately 30° (π/6)
    vi.mocked(useCurrentAngle).mockReturnValue(
      new Angle(Math.PI / 6 + 0.01, 'radians')
    );
    const { container } = render(<TableView />);
    
    const rows = container.querySelectorAll('.table-view__row');
    let highlightedRow: Element | null = null;
    
    rows.forEach((row) => {
      if (row.classList.contains('table-view__row--highlighted')) {
        highlightedRow = row;
      }
    });
    
    expect(highlightedRow).not.toBeNull();
    expect((highlightedRow as unknown as Element).textContent).toContain('π/6');
  });

  it('renders all 8 common angles', () => {
    render(<TableView />);
    const table = screen.getByRole('table');
    const rows = table.querySelectorAll('tbody tr');
    expect(rows.length).toBe(8); // 0°, 30°, 45°, 60°, 90°, 180°, 270°, 360°
  });
});
