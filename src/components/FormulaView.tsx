/**
 * Formula view component
 * Per milestone 11: Formula view modes (single/multiple/hybrid)
 * Per spec Section 2.3.8: Formula Visualization Modes
 */

import { useMemo, useEffect } from 'react';
import './FormulaView.css';
import { useStore } from '../state/store';
import { useCurrentAngle } from '../state/store';
import { formulaRegistry } from '../formulas/formulaRegistry';
import { KaTeXRenderer } from './KaTeXRenderer';
import type { FormulaViewMode } from '../state/AppState';

/**
 * FormulaView component
 * Displays formula visualizations based on view mode and difficulty level
 * Default: hybrid mode (per spec Section 2.3.8)
 */
export function FormulaView() {
  // Use individual selectors to ensure reactivity
  const difficultyLevel = useStore((state) => state.difficultyLevel);
  const formulaViewMode = useStore((state) => state.formulaViewMode);
  const selectedFormula = useStore((state) => state.selectedFormula);
  const enabledFormulas = useStore((state) => state.enabledFormulas);
  const setSelectedFormula = useStore((state) => state.setSelectedFormula);
  const setFormulaViewMode = useStore((state) => state.setFormulaViewMode);
  const toggleFormula = useStore((state) => state.toggleFormula);
  const setFormulaEnabled = useStore((state) => state.setFormulaEnabled);
  const currentAngle = useCurrentAngle();

  // Get available formulas for current difficulty level
  const availableFormulas = useMemo(() => {
    return formulaRegistry.getByDifficultyLevel(difficultyLevel);
  }, [difficultyLevel]);

  // Initialize enabled formulas in hybrid mode (enable all by default)
  useEffect(() => {
    if (formulaViewMode === 'hybrid' && availableFormulas.length > 0) {
      // Check if any formulas are missing from enabledFormulas
      const missingFormulas = availableFormulas.filter(
        (f) => !enabledFormulas.has(f.id)
      );
      if (missingFormulas.length > 0) {
        // Enable all available formulas by default
        missingFormulas.forEach((formula) => {
          setFormulaEnabled(formula.id, true);
        });
      }
    }
  }, [formulaViewMode, availableFormulas, enabledFormulas, setFormulaEnabled]);

  // Determine which formulas to display based on view mode
  const formulasToDisplay = useMemo(() => {
    if (formulaViewMode === 'single') {
      // Single mode: show only selected formula
      if (selectedFormula) {
        const formula = formulaRegistry.get(selectedFormula);
        return formula ? [formula] : [];
      }
      return [];
    } else if (formulaViewMode === 'multiple') {
      // Multiple mode: show all available formulas (no toggling)
      return availableFormulas;
    } else {
      // Hybrid mode: show only enabled formulas (individually toggleable)
      return availableFormulas.filter((formula) => enabledFormulas.has(formula.id));
    }
  }, [formulaViewMode, selectedFormula, availableFormulas, enabledFormulas]);

  if (availableFormulas.length === 0) {
    return (
      <section className="formula-view">
        <h2>Formula Visualizations</h2>
        <p className="formula-view__empty">
          No formulas available for the current difficulty level.
        </p>
      </section>
    );
  }

  return (
    <section className="formula-view">
      <div className="formula-view__header">
        <h2>Formula Visualizations</h2>
        <div className="formula-view__mode-selector">
          <label htmlFor="view-mode-select">View Mode:</label>
          <select
            id="view-mode-select"
            value={formulaViewMode}
            onChange={(e) =>
              setFormulaViewMode(e.target.value as FormulaViewMode)
            }
            aria-label="Select formula view mode"
          >
            <option value="single">Single</option>
            <option value="multiple">Multiple</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {formulaViewMode === 'single' && (
        <div className="formula-view__formula-selector">
          <label htmlFor="formula-select">Select Formula:</label>
          <select
            id="formula-select"
            value={selectedFormula || ''}
            onChange={(e) => setSelectedFormula(e.target.value || null)}
            aria-label="Select formula"
          >
            <option value="">-- Select a formula --</option>
            {availableFormulas.map((formula) => (
              <option key={formula.id} value={formula.id}>
                {formula.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {formulaViewMode === 'hybrid' && (
        <div className="formula-view__formula-toggles">
          <h3>Toggle Formulas:</h3>
          <div className="formula-view__toggle-list">
            {availableFormulas.map((formula) => (
              <label key={formula.id} className="formula-view__toggle-item">
                <input
                  type="checkbox"
                  checked={enabledFormulas.has(formula.id)}
                  onChange={() => toggleFormula(formula.id)}
                  aria-label={`Toggle ${formula.name}`}
                />
                <span>{formula.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="formula-view__formulas">
        {formulasToDisplay.length === 0 ? (
          <p className="formula-view__empty">
            {formulaViewMode === 'single'
              ? 'Please select a formula to display.'
              : 'No formulas to display.'}
          </p>
        ) : (
          formulasToDisplay.map((formula) => (
            <div key={formula.id} className="formula-view__formula-card">
              <div className="formula-view__formula-header">
                <h3 className="formula-view__formula-name">{formula.name}</h3>
                {formula.description && (
                  <p className="formula-view__formula-description">{formula.description}</p>
                )}
              </div>
              <div className="formula-view__formula-katex">
                <KaTeXRenderer formula={formula.katexFormula} displayMode={true} />
              </div>
              <div className="formula-view__formula-visualization">
                {formula.render(currentAngle)}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
