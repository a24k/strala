# Strala - String Art Mandala Simulator

A web-based tool for creating and simulating string art mandalas (糸掛曼荼羅). Create beautiful mathematical art patterns by connecting points on a circle with strings using a powerful layered system.

## ✨ Features

### Core Functionality
- **Interactive Canvas**: Real-time string art rendering with p5.js
- **Flexible Points**: 8-100 adjustable points on circle circumference  
- **Layer System**: Multiple pattern layers with advanced composition
- **Connection Modes**: Single-point and two-point connection patterns
- **Live Preview**: Instant parameter adjustment and rendering

### Advanced Controls
- **Color System**: Solid colors and gradients with split-complementary harmony
- **Visual Properties**: Opacity, line width, and gradient controls
- **Layer Management**: Create, duplicate, delete, reorder, and rename layers
- **Auto-save**: Automatic persistence with schema versioning
- **Export/Import**: JSON configuration backup and sharing

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation
```bash
git clone <repository-url>
cd strala
npm install
```

### Development
```bash
npm run dev
```
Visit `http://localhost:5173` to start creating string art!

### Build for Production
```bash
npm run build
npm run preview
```

## 🎨 Default Preset - "Luminous Mandala"

Strala comes with a beautiful default configuration:
- **54 points** for mathematically rich patterns
- **3 gradient layers** with cosmic color scheme
- **Deep space background** (#0a0a18)

## 🛠️ Tech Stack

- **Vite** - Fast development and optimized builds
- **TypeScript** - Type safety and better development experience  
- **React 18** - Component-based UI architecture
- **Tailwind CSS** - Modern, responsive design system
- **p5.js** - Mathematical visualization and graphics
- **Zustand** - Lightweight state management

## 📱 Browser Support

- Chrome, Firefox, Safari, Edge (modern versions)
- Responsive design (desktop and tablet optimized)
- Memory efficient (supports up to 50,000 lines at 60fps)

## 🔧 Development

### Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

### Debug Tools
Available in browser console as `window.StralaDebug`:
- `StralaDebug.exportState()` - Export application state
- `StralaDebug.importState(data)` - Import state data  
- `StralaDebug.clearCache()` - Clear storage data
- `StralaDebug.inspectStorage()` - Examine localStorage

## 🎯 Roadmap

- **Export Functionality**: PNG, SVG, PDF export with high resolution
- **Animation System**: Timeline-based parameter animations
- **3D Visualization**: WebGL-based 3D string art rendering
- **Pattern Sharing**: Cloud-based gallery and community features
- **Advanced Color Harmonies**: Triadic, analogous, tetradic modes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

[Contributing guidelines to be added]