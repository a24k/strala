# Strala - String Art Mandala Simulation Tool

## Project Overview
Strala is a web-based tool for creating and simulating string art mandalas (糸掛曼荼羅). The tool allows users to create beautiful mathematical art patterns by connecting points on a circle with strings, using a layered approach for complex compositions.

## Technical Stack
- **Build Tool**: Vite (for fast development and optimized builds)
- **Language**: TypeScript (for type safety and better development experience)
- **Frontend Framework**: React 18 (for component-based UI architecture)
- **Styling**: Tailwind CSS (for modern, responsive design system)
- **Canvas Rendering**: p5.js (for mathematical visualization and graphics)
- **State Management**: Zustand (for simple, lightweight state management)
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

### Default Preset - "Luminous Mandala"
```
Initial Settings:
- Circle Points: 56 (high resolution for complex patterns)
- Background: Deep Cosmic Black (#0a0a18)

Layer 1 "Radiance" (Top Layer):
- Type: Single-point connection
- Start: 3, Step: 13 (prime creates intricate top overlay)
- Color: Blue→Cyan Gradient (#3b82f6→#06b6d4, 80% opacity)

Layer 2 "Harmony" (Middle Layer):
- Type: Two-point connection
- Point A: Position 14, Step 1 (quarter position for optimal flow)
- Point B: Offset 22, Step 2 (creates dynamic spiral motion)
- Max Iterations: 84
- Color: Amber→Coral Gradient (#f59e0b→#ef4444, 70% opacity)

Layer 3 "Mystique" (Foundation Layer):
- Type: Single-point connection
- Start: 7, Step: 17 (high-frequency foundational texture)
- Color: Violet→Magenta Gradient (#8b5cf6→#ec4899, 60% opacity)
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

## Development Server Management
**Important Workflow Notes:**
- After starting `npm run dev` (especially with `&` for background), immediately check server readiness
- Use `curl -s http://localhost:PORT > /dev/null && echo "Ready"` to verify before browser access
- Don't leave server startup hanging without immediate follow-up action
- Always have clear next steps after server operations

## Data Persistence & Storage

### Schema-Based Versioning System
- **Current schema**: v3 (React + Tailwind migration planned)
- **Versioning**: Integer-based schema versions (1, 2, 3...)
- **Automatic migration**: Sequential migration chain with backwards compatibility
- **Cache key management**: Versioned localStorage keys (`strala-v3-*`)

### Auto-Save System
```typescript
// Debounced writes (500ms) to localStorage
const migrations = {
  1: migrateLegacyToV1,    // Legacy → v1
  2: migrateV1ToV2,        // v1 → v2 
  3: migrateV2ToV3         // v2 → v3 (React migration)
};
```

### Storage Architecture
- **Persistent stores**: Config, layers, and active layer state
- **Auto-save**: Debounced writes (500ms) to localStorage
- **Data validation**: Schema validation before loading
- **Backwards compatibility**: Automatic migration from older versions
- **Storage cleanup**: Auto-removal of old version data

### Development Tools
Available in browser console as `window.StralaDebug`:
```javascript
StralaDebug.currentSchema        // Current schema version
StralaDebug.clearCache()         // Clear current version data  
StralaDebug.clearAllVersions()   // Clear all Strala data
StralaDebug.forceSchemaUpdate()  // Force schema refresh
StralaDebug.inspectStorage()     // Inspect localStorage contents
StralaDebug.exportState()        // Export current state
StralaDebug.importState(data)    // Import state data
```

## Implementation Status
- [x] Requirements gathering
- [x] Technical stack selection (Vite + TypeScript + React + Tailwind)
- [x] UI/UX design and implementation
- [x] Data structure design and implementation
- [x] Vite + TypeScript setup and p5.js integration
- [x] React 18 component architecture
- [x] Tailwind CSS styling system
- [x] Basic circle and point rendering
- [x] Layer system implementation (comprehensive layer management)
- [x] String drawing algorithm (mathematical rendering engine)
- [x] Advanced UI controls (single-point and two-point connection modes)
- [x] Color and gradient system (advanced palette and harmony system)
- [x] Two-point connection system (Issues #13, #14 completed)
- [x] React + Tailwind migration (Issue #19 completed)
- [x] Responsive design implementation
- [x] Component library (RangeSlider, ColorPicker, etc.)
- [ ] Export functionality
- [ ] Color harmony generation
- [ ] Advanced pattern presets

## UI Features
### Connection Modes
- **Single-Point Mode**: Traditional string art with start point and step size
- **Two-Point Mode**: Advanced patterns using two synchronized points
  - Point A: Position and step size
  - Point B: Relative offset and independent step size
  - Max iterations control for pattern complexity

### Layer Management
- Create, duplicate, delete layers with modern UI
- Show/hide individual layers with visual indicators
- Reorder layers (rendering order) with drag-like interface
- Active layer selection with modern card-based design
- Real-time layer preview with color indicators

### Color & Visual System
- Advanced color picker with live preview
- Solid colors and gradient support
- Advanced color input with hex code editing
- Color harmony generation button (UI ready)
- Opacity and line width controls with live sliders
- Glass morphism design with backdrop blur effects

## UI Architecture

### UI Components
- **RangeSlider**: Range slider with live input and gradient styling
- **ColorPicker**: Advanced color picker with harmony generation
- **StyledSelect**: Styled dropdown with gradient indicators
- **LayerCard**: Interactive layer cards with hover animations
- **WorkingStralaCanvas**: p5.js integration within React

### Design System
- **Glass Morphism**: Backdrop blur effects and transparency
- **Gradient Accents**: Blue → Purple → Pink color scheme
- **Micro-interactions**: Hover animations, scale effects, shadows
- **Responsive Layout**: Desktop and mobile optimized
- **Typography**: Consistent spacing and hierarchy

### Legacy Keyboard Controls (Still Available)
*Note: These are primarily for development/power users*
- `↑/↓`: Change start point for active layer
- `←/→`: Change step size for active layer
- `v`: Toggle active layer visibility
- `1/2`: Set active layer
- `n`: Create new layer
- `d`: Duplicate active layer
- `Delete/Backspace`: Remove active layer
- `PageUp/PageDown`: Move layer up/down in rendering order

## Future Extensions
- **Export Functionality**: PNG, SVG, PDF export with high resolution
- **Color Harmony**: Automatic color palette generation (UI ready)
- **Advanced Patterns**: More preset configurations beyond "Luminous Mandala"
- **Animation System**: Timeline-based parameter animations
- **3D Visualization**: WebGL-based 3D string art rendering
- **Pattern Sharing**: Cloud-based gallery and community features
- **Mathematical Analysis**: Pattern complexity metrics and analysis tools
- **Touch Gestures**: Enhanced mobile interaction patterns
- **Undo/Redo System**: State history management
- **Custom Themes**: User-defined color schemes and UI themes