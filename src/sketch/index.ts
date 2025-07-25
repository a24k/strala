import p5 from 'p5';
import { CanvasManager } from './canvas';
import { AppConfig, ColorUtils } from '../types';
import { UIControls } from '../ui/controls';

let canvasManager: CanvasManager;
let uiControls: UIControls;

const initialConfig: AppConfig = {
  circlePoints: 24,
  backgroundColor: '#1a1a2e',
  canvasSize: {
    width: 600,
    height: 600
  }
};

export function initializeSketch(): void {
  const sketch = (p: p5) => {
    p.setup = () => {
      updateCanvasSize();
      canvasManager = new CanvasManager(initialConfig);
      
      const canvas = p.createCanvas(
        canvasManager.getConfig().canvasSize.width,
        canvasManager.getConfig().canvasSize.height
      );
      canvas.parent('sketch-container');
      
      // Enable anti-aliasing for smooth lines
      p.smooth();
      
      console.log('Strala initialized with Vite + TypeScript');
      console.log(`Canvas size: ${canvasManager.getConfig().canvasSize.width} x ${canvasManager.getConfig().canvasSize.height}`);
      
      // Initialize UI controls
      uiControls = new UIControls(canvasManager);
      
      // Add real-time controls for testing (keyboard shortcuts)
      addTestControls();
    };

    p.draw = () => {
      const config = canvasManager.getConfig();
      const bgColor = ColorUtils.hexToRgb(config.backgroundColor);
      if (bgColor) {
        p.background(bgColor.r, bgColor.g, bgColor.b);
      } else {
        p.background(26, 26, 46);
      }
      
      drawCircleAndPoints(p);
    };

    p.windowResized = () => {
      updateCanvasSize();
      canvasManager.updateCanvasSize(
        canvasManager.getConfig().canvasSize.width,
        canvasManager.getConfig().canvasSize.height
      );
      p.resizeCanvas(
        canvasManager.getConfig().canvasSize.width,
        canvasManager.getConfig().canvasSize.height
      );
    };
  };

  new p5(sketch);
}

function updateCanvasSize(): void {
  const container = document.querySelector('.canvas-container') as HTMLElement;
  if (!container) return;
  
  const containerRect = container.getBoundingClientRect();
  const maxWidth = containerRect.width - 40;
  const maxHeight = containerRect.height - 40;
  const size = Math.min(maxWidth, maxHeight, 800);
  
  initialConfig.canvasSize = { width: size, height: size };
}

function drawCircleAndPoints(p: p5): void {
  const config = canvasManager.getConfig();
  const points = canvasManager.getPoints();
  const layers = canvasManager.getLayers();
  
  const centerX = config.canvasSize.width / 2;
  const centerY = config.canvasSize.height / 2;
  const radius = Math.min(config.canvasSize.width, config.canvasSize.height) * 0.35;
  
  // Draw circle (faint guide)
  p.stroke(255, 50);
  p.strokeWeight(1);
  p.noFill();
  p.ellipse(centerX, centerY, radius * 2);
  
  // Draw string connections for each visible layer (reverse order for proper layering)
  // UI top layers appear on top in rendering by drawing them last
  layers.slice().reverse().forEach(layer => {
    if (!layer.visible) return;
    
    const connections = canvasManager.calculateLayerConnections(layer);
    
    if (layer.color.type === 'gradient' && layer.color.secondary) {
      // Draw gradient lines
      drawGradientConnections(p, connections, layer);
    } else {
      // Draw solid color lines
      drawSolidConnections(p, connections, layer);
    }
  });
  
  // Draw points on top
  p.fill(255, 180);
  p.noStroke();
  points.forEach(point => {
    p.ellipse(point.x, point.y, 3);
  });
}


// Draw solid color connections
function drawSolidConnections(p: p5, connections: Array<{from: any, to: any}>, layer: any): void {
  const color = ColorUtils.hexToRgb(layer.color.primary);
  if (!color) return;
  
  // Set stroke cap to round for solid lines (default behavior)
  p.strokeCap(p.ROUND);
  p.stroke(color.r, color.g, color.b, layer.color.alpha * 255);
  p.strokeWeight(layer.lineWidth);
  
  connections.forEach(connection => {
    p.line(
      connection.from.x, connection.from.y,
      connection.to.x, connection.to.y
    );
  });
}

// Draw gradient connections
function drawGradientConnections(p: p5, connections: Array<{from: any, to: any}>, layer: any): void {
  const segments = 20; // Number of segments for gradient interpolation
  
  // Set stroke cap to square to avoid visible dots between segments
  p.strokeCap(p.SQUARE);
  
  connections.forEach(connection => {
    const dx = connection.to.x - connection.from.x;
    const dy = connection.to.y - connection.from.y;
    
    for (let i = 0; i < segments; i++) {
      const t1 = i / segments;
      const t2 = (i + 1) / segments;
      
      const x1 = connection.from.x + dx * t1;
      const y1 = connection.from.y + dy * t1;
      const x2 = connection.from.x + dx * t2;
      const y2 = connection.from.y + dy * t2;
      
      // Interpolate color
      const interpolatedColor = ColorUtils.interpolateColor(
        layer.color.primary,
        layer.color.secondary!,
        t1
      );
      
      const rgb = ColorUtils.hexToRgb(interpolatedColor);
      if (!rgb) continue;
      
      p.stroke(rgb.r, rgb.g, rgb.b, layer.color.alpha * 255);
      p.strokeWeight(layer.lineWidth);
      p.line(x1, y1, x2, y2);
    }
  });
}

function addTestControls(): void {
  document.addEventListener('keydown', (event) => {
    const layers = canvasManager.getLayers();
    const activeLayer = canvasManager.getActiveLayer();
    
    if (!activeLayer && ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft', 'v'].includes(event.key)) {
      return;
    }
    
    const maxPoints = canvasManager.getConfig().circlePoints;
    
    switch (event.key) {
      case 'ArrowUp':
        if (activeLayer!.connectionType === 'two-point' && activeLayer!.pointA) {
          const newPosition = (activeLayer!.pointA.initialPosition + 1) % maxPoints;
          canvasManager.updateLayer(activeLayer!.id, { 
            pointA: { ...activeLayer!.pointA, initialPosition: newPosition } 
          } as any);
          console.log(`${activeLayer!.name} point A position: ${newPosition}`);
        } else {
          const newStartPointUp = (activeLayer!.startPoint + 1) % maxPoints;
          canvasManager.updateLayer(activeLayer!.id, { startPoint: newStartPointUp });
          console.log(`${activeLayer!.name} start point: ${newStartPointUp}`);
        }
        uiControls?.refresh();
        break;
        
      case 'ArrowDown':
        if (activeLayer!.connectionType === 'two-point' && activeLayer!.pointA) {
          const newPosition = (activeLayer!.pointA.initialPosition - 1 + maxPoints) % maxPoints;
          canvasManager.updateLayer(activeLayer!.id, { 
            pointA: { ...activeLayer!.pointA, initialPosition: newPosition } 
          } as any);
          console.log(`${activeLayer!.name} point A position: ${newPosition}`);
        } else {
          const newStartPointDown = (activeLayer!.startPoint - 1 + maxPoints) % maxPoints;
          canvasManager.updateLayer(activeLayer!.id, { startPoint: newStartPointDown });
          console.log(`${activeLayer!.name} start point: ${newStartPointDown}`);
        }
        uiControls?.refresh();
        break;
        
      case 'ArrowRight':
        if (activeLayer!.connectionType === 'two-point' && activeLayer!.pointA) {
          const newStepSize = activeLayer!.pointA.stepSize + 1;
          if (newStepSize < maxPoints) {
            canvasManager.updateLayer(activeLayer!.id, { 
              pointA: { ...activeLayer!.pointA, stepSize: newStepSize } 
            } as any);
            console.log(`${activeLayer!.name} point A step size: ${newStepSize}`);
            uiControls?.refresh();
          }
        } else {
          const newStepSizeUp = activeLayer!.stepSize + 1;
          if (newStepSizeUp < maxPoints) {
            canvasManager.updateLayer(activeLayer!.id, { stepSize: newStepSizeUp });
            console.log(`${activeLayer!.name} step size: ${newStepSizeUp}`);
            uiControls?.refresh();
          }
        }
        break;
        
      case 'ArrowLeft':
        if (activeLayer!.connectionType === 'two-point' && activeLayer!.pointA) {
          const newStepSize = activeLayer!.pointA.stepSize - 1;
          if (newStepSize > 0) {
            canvasManager.updateLayer(activeLayer!.id, { 
              pointA: { ...activeLayer!.pointA, stepSize: newStepSize } 
            } as any);
            console.log(`${activeLayer!.name} point A step size: ${newStepSize}`);
            uiControls?.refresh();
          }
        } else {
          const newStepSizeDown = activeLayer!.stepSize - 1;
          if (newStepSizeDown > 0) {
            canvasManager.updateLayer(activeLayer!.id, { stepSize: newStepSizeDown });
            console.log(`${activeLayer!.name} step size: ${newStepSizeDown}`);
            uiControls?.refresh();
          }
        }
        break;
        
      case '1':
        // Set first layer as active
        if (layers.length > 0) {
          canvasManager.setActiveLayer(layers[0].id);
          console.log(`Active layer: ${layers[0].name}`);
          uiControls?.refresh();
        }
        break;
        
      case '2':
        // Set second layer as active
        if (layers.length > 1) {
          canvasManager.setActiveLayer(layers[1].id);
          console.log(`Active layer: ${layers[1].name}`);
          uiControls?.refresh();
        }
        break;
        
      case 'v':
        const newVisibility = !activeLayer!.visible;
        canvasManager.updateLayer(activeLayer!.id, { visible: newVisibility });
        console.log(`${activeLayer!.name} visibility: ${newVisibility}`);
        uiControls?.refresh();
        break;
        
      case 'n':
        // Create new layer
        const newLayer = canvasManager.createLayer();
        console.log(`Created new layer: ${newLayer.name}`);
        uiControls?.refresh();
        break;
        
      case 'd':
        // Duplicate active layer
        if (activeLayer) {
          const duplicated = canvasManager.duplicateLayer(activeLayer.id);
          if (duplicated) {
            console.log(`Duplicated layer: ${duplicated.name}`);
            uiControls?.refresh();
          }
        }
        break;
        
      case 'Delete':
      case 'Backspace':
        if (activeLayer && layers.length > 1) {
          const layerName = activeLayer.name;
          canvasManager.removeLayer(activeLayer.id);
          console.log(`Deleted layer: ${layerName}`);
          uiControls?.refresh();
        }
        break;
        
      case 'PageUp':
        if (activeLayer) {
          canvasManager.moveLayerUp(activeLayer.id);
          console.log(`Moved ${activeLayer.name} up`);
          uiControls?.refresh();
        }
        break;
        
      case 'PageDown':
        if (activeLayer) {
          canvasManager.moveLayerDown(activeLayer.id);
          console.log(`Moved ${activeLayer.name} down`);
          uiControls?.refresh();
        }
        break;
    }
  });
  
  console.log('=== Layer Management Controls ===');
  console.log('Basic Controls:');
  console.log('  ↑/↓: Change start point (active layer)');
  console.log('  ←/→: Change step size (active layer)');
  console.log('  v: Toggle active layer visibility');
  console.log('');
  console.log('Layer Management:');
  console.log('  1/2: Set active layer');
  console.log('  n: Create new layer');
  console.log('  d: Duplicate active layer');
  console.log('  Delete/Backspace: Remove active layer');
  console.log('  PageUp/PageDown: Move layer up/down');
  console.log('');
  console.log('Active layer:', canvasManager.getActiveLayer()?.name);
}

// Export canvasManager and uiControls for external control
export function getCanvasManager(): CanvasManager {
  return canvasManager;
}

export function getUIControls(): UIControls {
  return uiControls;
}