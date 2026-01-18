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

**In Progress / Future:**
- Milestone 14: College-level expansions (inverse functions, polar coordinates, complex numbers)
- Milestone 15: Graduate modules (Fourier series, Taylor series, etc.)
- Milestone 16: Polish, performance optimization, and documentation

## References

See `../docs/spec.md` for detailed specification and `../docs/project_plan.md` for implementation milestones.
