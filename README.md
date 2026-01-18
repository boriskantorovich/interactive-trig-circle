# Trigonometry Learning Tool

An interactive web-based learning tool for high school and college students to deeply understand trigonometry through visual, interactive exploration of the unit circle and trigonometric functions.

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
├── core/              # Core math calculations (Angle, Trigonometry, Point, etc.)
├── interactions/      # User interaction handlers (Drag, Click, Slider)
├── visualizations/    # Rendering utilities (Triangle, FunctionLine, Arc)
├── formulas/          # Formula visualizations (basic, advanced, graduate)
├── components/        # React components (UnitCircleView, GraphView, etc.)
├── state/             # Zustand store and state management
├── error/             # Error handling utilities
└── App.tsx            # Main application component
```

### Technology Stack

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Zustand** - State management
- **KaTeX** - Math formula rendering
- **Vitest** - Testing framework
- **ESLint** - Linting
- **Prettier** - Code formatting

### Milestone Status

- ✅ **Milestone 0**: Project setup and foundation complete

## References

See `../docs/spec.md` for detailed specification and `../docs/project_plan.md` for implementation milestones.
