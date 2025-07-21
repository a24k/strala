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
      
      p.background(26, 26, 46);
      
      console.log('Strala initialized with Vite + TypeScript');
      console.log(`Canvas size: ${canvasManager.getConfig().canvasSize.width} x ${canvasManager.getConfig().canvasSize.height}`);
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
  
  const centerX = config.canvasSize.width / 2;
  const centerY = config.canvasSize.height / 2;
  const radius = Math.min(config.canvasSize.width, config.canvasSize.height) * 0.35;
  
  // Draw circle
  p.stroke(255, 100);
  p.strokeWeight(1);
  p.fill(255, 20);
  p.ellipse(centerX, centerY, radius * 2);
  
  // Draw points
  p.fill(255);
  p.noStroke();
  points.forEach(point => {
    p.ellipse(point.x, point.y, 4);
  });
}