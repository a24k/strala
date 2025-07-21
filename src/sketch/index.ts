import p5 from 'p5';
import { CanvasManager } from './canvas';
import { AppConfig } from '../types';

let canvasManager: CanvasManager;

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
      
      p.background(26, 26, 46);
      
      console.log('Strala initialized with Vite + TypeScript');
      console.log(`Canvas size: ${canvasManager.getConfig().canvasSize.width} x ${canvasManager.getConfig().canvasSize.height}`);
      
      // Add real-time controls for testing
      addTestControls();
    };

    p.draw = () => {
      p.background(26, 26, 46);
      
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
  
  // Draw string connections for each visible layer
  layers.forEach(layer => {
    if (!layer.visible) return;
    
    const connections = canvasManager.calculateStringConnections(layer);
    
    // Parse color and apply alpha
    const color = hexToRgb(layer.color.primary);
    if (!color) return;
    
    p.stroke(color.r, color.g, color.b, layer.color.alpha * 255);
    p.strokeWeight(layer.lineWidth);
    
    connections.forEach(connection => {
      p.line(
        connection.from.x, connection.from.y,
        connection.to.x, connection.to.y
      );
    });
  });
  
  // Draw points on top
  p.fill(255, 180);
  p.noStroke();
  points.forEach(point => {
    p.ellipse(point.x, point.y, 3);
  });
}

function hexToRgb(hex: string): {r: number, g: number, b: number} | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function addTestControls(): void {
  // Add keyboard shortcuts for real-time testing
  document.addEventListener('keydown', (event) => {
    const layers = canvasManager.getLayers();
    const activeLayer = canvasManager.getActiveLayer();
    
    switch (event.key) {
      case 'ArrowUp':
        // Increase start point for active layer
        if (activeLayer) {
          const maxPoints = canvasManager.getConfig().circlePoints;
          const newStartPoint = (activeLayer.startPoint + 1) % maxPoints;
          canvasManager.updateLayer(activeLayer.id, { startPoint: newStartPoint });
          console.log(`${activeLayer.name} start point: ${newStartPoint}`);
        }
        break;
        
      case 'ArrowDown':
        // Decrease start point for active layer
        if (activeLayer) {
          const maxPoints = canvasManager.getConfig().circlePoints;
          const newStartPoint = (activeLayer.startPoint - 1 + maxPoints) % maxPoints;
          canvasManager.updateLayer(activeLayer.id, { startPoint: newStartPoint });
          console.log(`${activeLayer.name} start point: ${newStartPoint}`);
        }
        break;
        
      case 'ArrowRight':
        // Increase step size for active layer
        if (activeLayer) {
          const newStepSize = activeLayer.stepSize + 1;
          if (newStepSize < canvasManager.getConfig().circlePoints) {
            canvasManager.updateLayer(activeLayer.id, { stepSize: newStepSize });
          }
        }
        break;
        
      case 'ArrowLeft':
        // Decrease step size for active layer
        if (activeLayer) {
          const newStepSize = activeLayer.stepSize - 1;
          if (newStepSize > 0) {
            canvasManager.updateLayer(activeLayer.id, { stepSize: newStepSize });
          }
        }
        break;
        
      case '1':
        // Set first layer as active
        if (layers.length > 0) {
          canvasManager.setActiveLayer(layers[0].id);
          console.log(`Active layer: ${layers[0].name}`);
        }
        break;
        
      case '2':
        // Set second layer as active
        if (layers.length > 1) {
          canvasManager.setActiveLayer(layers[1].id);
          console.log(`Active layer: ${layers[1].name}`);
        }
        break;
        
      case 'v':
        // Toggle active layer visibility
        if (activeLayer) {
          canvasManager.updateLayer(activeLayer.id, { visible: !activeLayer.visible });
          console.log(`${activeLayer.name} visibility: ${!activeLayer.visible}`);
        }
        break;
        
      case 'n':
        // Create new layer
        const newLayer = canvasManager.createLayer();
        console.log(`Created new layer: ${newLayer.name}`);
        break;
        
      case 'd':
        // Duplicate active layer
        if (activeLayer) {
          const duplicated = canvasManager.duplicateLayer(activeLayer.id);
          if (duplicated) {
            console.log(`Duplicated layer: ${duplicated.name}`);
          }
        }
        break;
        
      case 'Delete':
      case 'Backspace':
        // Delete active layer
        if (activeLayer && layers.length > 1) {
          canvasManager.removeLayer(activeLayer.id);
          console.log(`Deleted layer: ${activeLayer.name}`);
        }
        break;
        
      case 'PageUp':
        // Move active layer up
        if (activeLayer) {
          canvasManager.moveLayerUp(activeLayer.id);
          console.log(`Moved ${activeLayer.name} up`);
        }
        break;
        
      case 'PageDown':
        // Move active layer down
        if (activeLayer) {
          canvasManager.moveLayerDown(activeLayer.id);
          console.log(`Moved ${activeLayer.name} down`);
        }
        break;
    }
  });
  
  console.log('=== Layer Management Test Controls ===');
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

// Export canvasManager for external control
export function getCanvasManager(): CanvasManager {
  return canvasManager;
}