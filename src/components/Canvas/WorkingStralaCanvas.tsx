import React, { useRef, useEffect, useCallback } from 'react';
import p5 from 'p5';
import { useCanvasStoreSimple } from '../../stores/canvasStoreSimple';
import { useLayersStoreSimple } from '../../stores/layersStoreSimple';

interface WorkingStralaCanvasProps {
  className?: string;
}

export const WorkingStralaCanvas: React.FC<WorkingStralaCanvasProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const lastConfigRef = useRef<any>(null);
  const lastLayersRef = useRef<any[]>([]);

  // Get current store values
  const { config } = useCanvasStoreSimple();
  const { layers } = useLayersStoreSimple();
  const visibleLayers = layers.filter(layer => layer.visible);

  // Shared points array and calculation function
  const pointsRef = useRef<Array<{ x: number; y: number }>>([]);
  
  const calculatePoints = useCallback((circlePoints: number, canvasWidth: number, canvasHeight: number) => {
    pointsRef.current = [];
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const radius = Math.min(canvasWidth, canvasHeight) * 0.45;

    for (let i = 0; i < circlePoints; i++) {
      const angle = (Math.PI * 2 / circlePoints) * i;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      pointsRef.current.push({ x, y });
    }
  }, []);

  // Memoize the sketch function
  const sketch = useCallback((p: p5) => {

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 26, g: 26, b: 46 };
    };

    p.setup = () => {
      // Use parent container's dimensions for responsive canvas
      const container = containerRef.current;
      if (container) {
        // Calculate 90% of the viewport's short side
        const viewportWidth = window.innerWidth - 320; // Subtract sidebar width
        const viewportHeight = window.innerHeight;
        const shortSide = Math.min(viewportWidth, viewportHeight);
        const size = Math.max(shortSide * 0.9, 400); // Minimum 400px
        p.createCanvas(size, size);
      } else {
        p.createCanvas(500, 500);
      }
      calculatePoints(config.circlePoints, p.width, p.height);
      lastConfigRef.current = { ...config };
      lastLayersRef.current = [...visibleLayers];
    };

    p.draw = () => {
      // Check if we need to recalculate points
      if (lastConfigRef.current?.circlePoints !== config.circlePoints) {
        calculatePoints(config.circlePoints, p.width, p.height);
        lastConfigRef.current = { ...config };
      }

      // Background
      const bg = hexToRgb(config.backgroundColor);
      p.background(bg.r, bg.g, bg.b);

      // Draw string connections for each visible layer
      visibleLayers.forEach(layer => {
        if (pointsRef.current.length === 0 || layer.stepSize <= 0 || layer.stepSize >= pointsRef.current.length) {
          return;
        }

        const colorRgb = hexToRgb(layer.color.primary);
        p.stroke(colorRgb.r, colorRgb.g, colorRgb.b, layer.color.alpha * 255);
        p.strokeWeight(layer.lineWidth);

        // Simple string art pattern
        let currentIndex = layer.startPoint % pointsRef.current.length;
        const visited = new Set<number>();
        
        while (!visited.has(currentIndex) && visited.size < pointsRef.current.length) {
          visited.add(currentIndex);
          const nextIndex = (currentIndex + layer.stepSize) % pointsRef.current.length;
          
          const from = pointsRef.current[currentIndex];
          const to = pointsRef.current[nextIndex];
          
          p.line(from.x, from.y, to.x, to.y);
          currentIndex = nextIndex;
        }
      });

      // Draw circle points (nails) - ON TOP of strings
      pointsRef.current.forEach(point => {
        // Outer ring (nail head shadow)
        p.fill(0, 0, 0, 80);
        p.noStroke();
        p.circle(point.x + 1, point.y + 1, 8);
        
        // Main nail head
        p.fill(220, 220, 235, 255);
        p.stroke(180, 180, 200, 200);
        p.strokeWeight(0.5);
        p.circle(point.x, point.y, 6);
        
        // Inner highlight
        p.fill(255, 255, 255, 150);
        p.noStroke();
        p.circle(point.x - 0.5, point.y - 0.5, 3);
      });

      // Update layer reference
      lastLayersRef.current = [...visibleLayers];
    };
  }, [config, visibleLayers]);

  useEffect(() => {
    if (containerRef.current && !p5InstanceRef.current) {
      try {
        p5InstanceRef.current = new p5(sketch, containerRef.current);
      } catch (error) {
        console.error('P5.js initialization error:', error);
      }
    }

    return () => {
      try {
        if (p5InstanceRef.current) {
          p5InstanceRef.current.remove();
          p5InstanceRef.current = null;
        }
      } catch (error) {
        console.error('P5.js cleanup error:', error);
      }
    };
  }, [sketch]);

  // Handle responsive canvas resizing
  useEffect(() => {
    const resizeCanvas = () => {
      if (p5InstanceRef.current && containerRef.current) {
        // Calculate 90% of the viewport's short side
        const viewportWidth = window.innerWidth - 320; // Subtract sidebar width
        const viewportHeight = window.innerHeight;
        const shortSide = Math.min(viewportWidth, viewportHeight);
        const size = Math.max(shortSide * 0.9, 400); // Minimum 400px
        p5InstanceRef.current.resizeCanvas(size, size);
        
        // Recalculate points after canvas resize
        calculatePoints(config.circlePoints, size, size);
      }
    };

    // Window resize handler
    const handleWindowResize = () => {
      resizeCanvas();
    };

    // ResizeObserver for container size changes
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
      });
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', handleWindowResize);
    
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      if (resizeObserver && containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
        resizeObserver.disconnect();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    />
  );
};