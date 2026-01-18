import { ErrorBoundary } from './components/ErrorBoundary';
import { UnitCircleView } from './components/UnitCircleView';
import { AngleControls } from './components/AngleControls';
import { TrigonometricValuesDisplay } from './components/TrigonometricValuesDisplay';
import { GraphView } from './components/GraphView';
import { TableView } from './components/TableView';
import { DifficultySelector } from './components/DifficultySelector';
import { FormulaView } from './components/FormulaView';
import './App.css';

/**
 * Main React application component
 * Per spec Section 4.2.1
 */
function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <header className="app__header">
          <h1>Trigonometry Learning Tool</h1>
          <p>Interactive exploration of the unit circle and trigonometric functions</p>
        </header>
        <main className="app__main">
          {/* Difficulty Selector - Milestone 11 */}
          <section className="app__difficulty-selector">
            <DifficultySelector />
          </section>
          {/* Angle Controls - Milestone 6 */}
          <section className="app__angle-controls">
            <AngleControls />
          </section>
          <section className="app__unit-circle">
            <h2>Unit Circle View</h2>
            <UnitCircleView />
          </section>
          <section className="app__trigonometric-values">
            <TrigonometricValuesDisplay />
          </section>
          <section className="app__graph-view">
            <GraphView />
          </section>
          <section className="app__table-view">
            <TableView />
          </section>
          {/* Formula Visualizations - Milestone 11 */}
          <section className="app__formula-view">
            <FormulaView />
          </section>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
