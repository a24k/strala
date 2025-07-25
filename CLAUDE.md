# Strala - String Art Mandala Simulation Tool

## Project Overview
Strala is a web-based tool for creating and simulating string art mandalas (糸掛曼荼羅). The tool allows users to create beautiful mathematical art patterns by connecting points on a circle with strings, using a layered approach for complex compositions.

## Technical Stack
- **Build Tool**: Vite (for fast development and optimized builds)
- **Language**: TypeScript (for type safety and better development experience)
- **Framework**: p5.js (chosen for mathematical visualization capabilities)
- **Target**: Web browsers (modern browsers support)
- **Purpose**: Art creation and educational tool

## Core Features

### Basic Functionality
- **Circle Points**: 8-100 adjustable points on circumference
- **Layer System**: Multiple pattern layers with overlay composition
- **String Rules**: Skip-number based connections (extensible for future complex rules)
- **Real-time Preview**: Live parameter adjustment and rendering

### Layer System
Each layer contains:
- **Connection Type**: Single-point or two-point connection mode
- **Start Point**: Configurable starting position (0-99)
- **Step Size**: Skip number for string connections (1-50)
- **Two-Point Support**: Point A position/step, Point B relative offset/step, max iterations
- **Visual Properties**: Color, transparency, gradients
- **Visibility**: Show/hide individual layers
- **Ordering**: Layer reordering (up/down buttons)
- **Management**: Create, duplicate, delete, rename layers
- **Active Selection**: Single active layer for editing

### Data Structure
```typescript
// Layer class with validation and utility methods
export class Layer {
  id: string
  name: string          // "Layer 1", "Layer 2"...
  visible: boolean
  startPoint: number    // 0-99 (depends on circle point count)
  stepSize: number      // skip number 1-50
  color: {
    type: 'solid' | 'gradient'
    primary: string     // #rrggbb
    secondary?: string  // for gradients
    alpha: number       // 0.0-1.0
  }
  lineWidth: number     // 1-10px

  // Methods: clone(), update(), validate(), toData()
  // Static: generateId(), generateName()
}
```

### UI Layout
```
[Canvas (Main Drawing Area)] [Control Panel]
                            ├─ Global Settings
                            │  ├─ Circle Points: 8-100
                            │  └─ Background Color
                            ├─ Layer Management
                            │  ├─ Add/Remove Layers
                            │  ├─ Show/Hide
                            │  └─ Reorder
                            └─ Selected Layer Settings
                               ├─ Start Point
                               ├─ Step Size
                               ├─ Color & Transparency
                               └─ Gradient
```

### Default Preset
```
Initial Settings:
- Circle Points: 24
- Layer 1: Start 0, Step 7, Semi-transparent Blue (#3498db, 60%)
- Layer 2: Start 12, Step 11, Semi-transparent Red (#e74c3c, 40%)
- Background: Deep Navy (#1a1a2e)
```

## Development Guidelines

### Language Policy
- **All documentation**: English (CLAUDE.md, README, comments)
- **All commits & PRs**: English messages
- **Code**: English variable/function names

### Workflow
- **Always create branches** for new features/implementations
- **Never commit directly** to main branch
- **Use descriptive branch names**: `feature/layer-system`, `fix/canvas-rendering`

### Performance Targets
- Support up to 50,000 lines (100 points × 5 layers × 100 lines)
- 60fps real-time rendering
- Memory usage: <10MB

### Browser Support
- Chrome, Firefox, Safari, Edge (modern versions)
- Responsive design (tablet compatible, mobile consideration)

## Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run type-check` - Run TypeScript type checking

## Implementation Status
- [x] Requirements gathering
- [x] Technical stack selection (updated to Vite + TypeScript)
- [x] UI/UX design
- [x] Data structure design
- [x] Vite + TypeScript setup and p5.js integration
- [x] Basic circle and point rendering
- [x] Layer system implementation (comprehensive layer management)
- [x] String drawing algorithm (mathematical rendering engine)
- [x] UI controls (single-point and two-point connection modes)
- [x] Color and gradient system (advanced palette and harmony system)
- [x] Two-point connection system (Issues #13, #14 completed)
- [ ] Export functionality

## UI Features
### Connection Modes
- **Single-Point Mode**: Traditional string art with start point and step size
- **Two-Point Mode**: Advanced patterns using two synchronized points
  - Point A: Position and step size
  - Point B: Relative offset and independent step size
  - Max iterations control for pattern complexity

### Layer Management
- Create, duplicate, delete layers
- Show/hide individual layers
- Reorder layers (rendering order)
- Active layer selection with visual feedback

### Color & Visual System
- Solid colors and gradient support
- Advanced color palette categories
- Color harmony generation
- Opacity and line width controls

## Current Test Controls (Development Mode)
### Basic Controls
- `↑/↓`: Change start point for active layer (0 to circle points-1)
- `←/→`: Change step size for active layer
- `v`: Toggle active layer visibility

### Layer Management
- `1/2`: Set active layer
- `n`: Create new layer
- `d`: Duplicate active layer
- `Delete/Backspace`: Remove active layer (minimum 1 layer)
- `PageUp/PageDown`: Move layer up/down in rendering order

## Future Extensions
- Complex string rules beyond skip-numbers
- Animation sequences
- 3D visualization
- Pattern sharing/gallery
- Mathematical analysis tools