# Interactive Trigonometry Learning Tool

An interactive web-based learning tool for high school and college students to deeply understand trigonometry through visual, interactive exploration of the unit circle and trigonometric functions.

## Features

### Core Functionality
- **Interactive Unit Circle**: Drag, click, or use slider to explore angles
- **Real-time Calculations**: All six trigonometric functions (sin, cos, tan, cot, sec, csc) update in real-time
- **Multiple Input Methods**: 
  - Drag point around the circle
  - Click anywhere on the circle
  - Slider control (0-360° or 0-2π)
  - Text input with flexible parsing (degrees, radians, π notation)
  - Preset angle buttons
- **Visual Representations**:
  - Reference triangle with labeled sides
  - Angle arc visualization
  - Function lines for all six trig functions
  - Graph views synchronized with unit circle
- **Reference Table**: Clickable table of common angles with exact values
- **Formula Visualizations**: Interactive proofs and visualizations for:
  - Pythagorean Identity
  - Sum and Difference Formulas
  - Double Angle Formulas
  - Half Angle Formulas
  - Cofunction Identities
- **Difficulty Levels**: High school, college, and graduate level content
- **Error Handling**: Graceful handling of edge cases (asymptotes, undefined values)

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- pnpm (package manager)

### Installation

```bash
pnpm install
```

### Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm test:ui` - Run tests with UI
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm preview` - Preview production build

### Project Structure

```
src/
├── core/              # Core math calculations (Angle, Trigonometry, Point)
├── interactions/      # User interaction handlers (Drag, Click, Slider)
├── visualizations/    # Rendering utilities (Triangle, FunctionLine, Arc)
├── formulas/          # Formula visualizations
│   ├── base/          # Base formula class
│   └── basic/         # High school level formulas
├── components/        # React components
│   ├── UnitCircleView.tsx      # Main unit circle visualization
│   ├── GraphView.tsx           # Trigonometric function graphs
│   ├── TableView.tsx           # Reference angle table
│   ├── FormulaView.tsx         # Formula visualization container
│   ├── AngleControls.tsx       # Angle input controls
│   ├── DifficultySelector.tsx   # Difficulty level selector
│   └── ...
├── state/             # Zustand store and state management
├── error/             # Error handling utilities
└── utils/             # Utility functions (parsing, coordinates, etc.)
```

### Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Zustand** - State management
- **KaTeX** - Math formula rendering
- **Vitest** - Testing framework
- **ESLint** - Linting
- **Prettier** - Code formatting

### Implementation Status

**Completed Milestones:**
- ✅ **Milestone 0**: Project setup and foundation
- ✅ **Milestone 1**: Core math engine (Angle, Point, Trigonometry)
- ✅ **Milestone 2**: Zustand app state management
- ✅ **Milestone 3**: Unit circle static rendering
- ✅ **Milestone 4**: Click-to-set angle interaction
- ✅ **Milestone 5**: Drag interaction
- ✅ **Milestone 6**: Angle controls (slider, input, presets)
- ✅ **Milestone 7**: Trigonometric values display
- ✅ **Milestone 8**: Geometric visuals for all 6 functions
- ✅ **Milestone 9**: Graph views (all functions)
- ✅ **Milestone 10**: Table view with common angles
- ✅ **Milestone 11**: Formula system with KaTeX integration
- ✅ **Milestone 12**: Interactive Pythagorean identity proof
- ✅ **Milestone 13**: Remaining high school formulas (Sum/Difference, Double Angle, Half Angle, Cofunction)
- ✅ **Milestone 14**: College-level expansions (inverse functions, polar coordinates, complex numbers)
- ✅ **Milestone 15**: Graduate modules (Fourier series, Taylor series, etc.)
- ✅ **Milestone 16**: Polish, performance optimization, and documentation

## Architecture

### Overview

The application follows a clean architecture pattern with clear separation of concerns. The architecture is designed to be maintainable, testable, and extensible. See `../docs/spec.md` Section 4 for detailed technical specifications.

### Core Principles

- **DRY (Don't Repeat Yourself)**: Single source of truth for calculations, reusable components
- **SOLID Principles**: Clear separation of concerns, modular design, extensible structure
- **Type Safety**: Full TypeScript coverage for math calculations and state management
- **Performance**: Optimized for 60fps interactions with selective rendering and memoization

### Architecture Layers

#### 1. Core Math Layer (`src/core/`)
The foundation of the application, providing mathematical primitives and calculations:
- **Angle.ts**: Angle representation, conversion, normalization
- **Point.ts**: 2D point operations, unit circle checks
- **Trigonometry.ts**: Single source of truth for all trigonometric calculations
- **InverseTrig.ts**: Inverse trigonometric function calculations (college level)

All calculations are unit-tested and validated against reference tables.

#### 2. State Management Layer (`src/state/`)
Centralized state management using Zustand:
- **store.ts**: Main Zustand store with actions and selectors
- **AppState.ts**: TypeScript interfaces for application state
- **DifficultyLevel.ts**: Difficulty level configuration

State updates flow: User interaction → Store action → State update → Component re-render

#### 3. Interaction Layer (`src/interactions/`)
Handles user input and interactions:
- **DragHandler.ts**: Drag interaction with 60fps throttling
- **ClickHandler.ts**: Click-to-set-angle interaction
- **SliderHandler.ts**: Slider input handling

All handlers are optimized for performance and tested.

#### 4. Visualization Layer (`src/visualizations/`)
Pure rendering functions for SVG elements:
- **TriangleRenderer.ts**: Reference triangle visualization
- **FunctionLineRenderer.ts**: Geometric function line visualizations
- **ArcRenderer.ts**: Angle arc visualization

Rendering functions are pure and testable.

#### 5. Component Layer (`src/components/`)
React components that compose the UI:
- **UnitCircleView.tsx**: Main unit circle visualization
- **GraphView.tsx**: Trigonometric function graphs
- **TableView.tsx**: Reference angle table
- **FormulaView.tsx**: Formula visualization container
- **AngleControls.tsx**: Angle input controls
- **ErrorBoundary.tsx**: Error boundary for graceful error handling

Components use selectors for efficient re-rendering and memoization for expensive calculations.

#### 6. Formula System (`src/formulas/`)
Extensible formula visualization system:
- **base/FormulaVisualization.ts**: Base interface and class
- **formulaRegistry.ts**: Central registry for all formulas
- **basic/**: High school level formulas
- **advanced/**: College level formulas
- **graduate/**: Graduate level formulas

Formulas are registered at startup and filtered by difficulty level.

#### 7. Error Handling (`src/error/`)
Structured error handling and logging:
- **ErrorHandler.ts**: Centralized error handling with structured logging (DEBUG/INFO/WARN/ERROR/FATAL)
- Error boundaries wrap components for graceful error recovery
- User-friendly error messages with technical details in development

### State Flow

```
User Interaction (drag/click/slider)
    ↓
Interaction Handler (DragHandler/ClickHandler/SliderHandler)
    ↓
Store Action (setAngle)
    ↓
Zustand Store Update
    ↓
Component Re-render (via selectors)
    ↓
Visualization Update (SVG elements)
```

### Performance Optimizations

- **Selective Rendering**: Components use Zustand selectors to subscribe only to relevant state
- **Memoization**: Expensive calculations (trig values, SVG paths) are memoized with `useMemo`
- **Throttling**: Drag interactions throttled to 60fps using `requestAnimationFrame`
- **SVG Optimization**: Only changed SVG elements are updated, not full redraws

## How to Add a Formula Module

The formula system is designed to be easily extensible. Follow these steps to add a new formula visualization:

### Step 1: Create the Formula Class

Create a new file in the appropriate directory:
- `src/formulas/basic/` for high school level
- `src/formulas/advanced/` for college level
- `src/formulas/graduate/` for graduate level

Example: `src/formulas/basic/MyNewFormula.tsx`

```typescript
import { BaseFormulaVisualization } from '../base/FormulaVisualization';
import type { Angle } from '../../core/Angle';
import { TrigonometricValues } from '../../core/Trigonometry';
import './MyNewFormula.css';

export class MyNewFormula extends BaseFormulaVisualization {
  readonly id = 'my-new-formula';
  readonly name = 'My New Formula';
  readonly difficulty = 'highSchool'; // or 'college' or 'graduate'
  readonly katexFormula = '\\sin(\\theta) = \\frac{opposite}{hypotenuse}';
  readonly description = 'A brief description of what this formula demonstrates.';

  render(angle: Angle): JSX.Element | null {
    const trigValues = new TrigonometricValues(angle);
    const sinValue = trigValues.sin();
    const cosValue = trigValues.cos();

    return (
      <div className="my-new-formula">
        <div className="my-new-formula__explanation">
          <p>Explanation of the formula...</p>
        </div>
        <div className="my-new-formula__visualization">
          {/* Your SVG or visual elements here */}
          <p>sin(θ) = {sinValue.toFixed(4)}</p>
          <p>cos(θ) = {cosValue.toFixed(4)}</p>
        </div>
      </div>
    );
  }
}
```

### Step 2: Create CSS File (Optional)

Create a CSS file for styling: `src/formulas/basic/MyNewFormula.css`

```css
.my-new-formula {
  padding: 1em;
}

.my-new-formula__explanation {
  margin-bottom: 1em;
}
```

### Step 3: Register the Formula

Add your formula to the registry in `src/formulas/index.ts`:

```typescript
import { MyNewFormula } from './basic/MyNewFormula';

export function initializeFormulas(): void {
  // ... existing formulas ...
  
  // Add your new formula
  formulaRegistry.register(new MyNewFormula());
}
```

### Step 4: Enable in Difficulty Configuration

If needed, ensure your formula is enabled for the appropriate difficulty level in `src/state/DifficultyLevel.ts`. Most formulas are automatically enabled based on their `difficulty` property.

### Step 5: Test Your Formula

1. Run the development server: `pnpm dev`
2. Navigate to the formula view
3. Select your difficulty level
4. Verify your formula appears and updates correctly as you change the angle

### Formula Interface Requirements

Your formula class must implement the `FormulaVisualization` interface:

- **id**: Unique string identifier (kebab-case recommended)
- **name**: Human-readable display name
- **difficulty**: One of `'highSchool' | 'college' | 'graduate'`
- **katexFormula**: LaTeX string for the formula (will be rendered with KaTeX)
- **description**: Optional explanation text
- **render(angle)**: Function that returns JSX, receives current `Angle` from store

### Best Practices

1. **Use Core Math Classes**: Always use `Angle`, `TrigonometricValues`, `Point` from `src/core/` for calculations
2. **Pure Rendering**: Keep render functions pure - no side effects
3. **Memoization**: If your formula does expensive calculations, consider memoization
4. **Error Handling**: Use `errorHandler` from `src/error/ErrorHandler.ts` for error handling
5. **Styling**: Follow Tufte-inspired design principles (see spec Section 5.2)
6. **Testing**: Consider adding tests for complex calculations

### Example: Complete Formula Implementation

See `src/formulas/basic/PythagoreanIdentity.tsx` for a complete example with:
- SVG visualizations
- Real-time updates
- KaTeX formula rendering
- CSS styling
- Error handling

## References

See `../docs/spec.md` for detailed specification and `../docs/project_plan.md` for implementation milestones.
