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
    
    switch (event.key) {
      case 'ArrowUp':
        // Increase circle points
        const currentPoints = canvasManager.getConfig().circlePoints;
        if (currentPoints < 100) {
          canvasManager.updateConfig({ circlePoints: currentPoints + 1 });
        }
        break;
        
      case 'ArrowDown':
        // Decrease circle points
        const currentPointsDown = canvasManager.getConfig().circlePoints;
        if (currentPointsDown > 8) {
          canvasManager.updateConfig({ circlePoints: currentPointsDown - 1 });
        }
        break;
        
      case 'ArrowRight':
        // Increase step size for first layer
        if (layers.length > 0) {
          const newStepSize = layers[0].stepSize + 1;
          if (newStepSize < canvasManager.getConfig().circlePoints) {
            canvasManager.updateLayer(layers[0].id, { stepSize: newStepSize });
          }
        }
        break;
        
      case 'ArrowLeft':
        // Decrease step size for first layer
        if (layers.length > 0) {
          const newStepSize = layers[0].stepSize - 1;
          if (newStepSize > 0) {
            canvasManager.updateLayer(layers[0].id, { stepSize: newStepSize });
          }
        }
        break;
        
      case '1':
        // Toggle first layer visibility
        if (layers.length > 0) {
          canvasManager.updateLayer(layers[0].id, { visible: !layers[0].visible });
        }
        break;
        
      case '2':
        // Toggle second layer visibility
        if (layers.length > 1) {
          canvasManager.updateLayer(layers[1].id, { visible: !layers[1].visible });
        }
        break;
    }
  });
  
  console.log('Test controls active:');
  console.log('↑/↓: Change circle points');
  console.log('←/→: Change step size');
  console.log('1/2: Toggle layer visibility');
}

// Export canvasManager for external control
export function getCanvasManager(): CanvasManager {
  return canvasManager;
}