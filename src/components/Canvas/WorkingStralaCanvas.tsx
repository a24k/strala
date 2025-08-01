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
  
  const calculatePoints = useCallback((circlePoints: number, canvasWidth: number, canvasHeight: number, rotation: number) => {
    pointsRef.current = [];
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const radius = Math.min(canvasWidth, canvasHeight) * 0.45;

    for (let i = 0; i < circlePoints; i++) {
      // Start from top (12 o'clock position) by subtracting PI/2, then add rotation
      const angle = (Math.PI * 2 / circlePoints) * i - Math.PI / 2 + (rotation * Math.PI) / 180;
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
      calculatePoints(config.circlePoints, p.width, p.height, config.rotation);
      lastConfigRef.current = { ...config };
      lastLayersRef.current = [...visibleLayers];
    };

    p.draw = () => {
      // Check if we need to recalculate points
      if (lastConfigRef.current?.circlePoints !== config.circlePoints || 
          lastConfigRef.current?.rotation !== config.rotation) {
        calculatePoints(config.circlePoints, p.width, p.height, config.rotation);
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

        p.strokeWeight(layer.lineWidth);

        // Draw with gradient or solid color
        const drawLineWithColor = (from: { x: number; y: number }, to: { x: number; y: number }) => {
          if (layer.color.type === 'gradient' && layer.color.secondary) {
            // Draw gradient line using beginShape/endShape for smooth connection
            const segments = 20; // Number of segments for smooth gradient
            const fromRgb = hexToRgb(layer.color.primary);
            const toRgb = hexToRgb(layer.color.secondary);
            
            if (fromRgb && toRgb) {
              // Set stroke cap to square to avoid rounded ends
              p.strokeCap(p.SQUARE);
              
              for (let i = 0; i < segments; i++) {
                const t1 = i / segments;
                const t2 = (i + 1) / segments;
                
                // Interpolate color
                const r = Math.round(fromRgb.r + (toRgb.r - fromRgb.r) * t1);
                const g = Math.round(fromRgb.g + (toRgb.g - fromRgb.g) * t1);
                const b = Math.round(fromRgb.b + (toRgb.b - fromRgb.b) * t1);
                
                p.stroke(r, g, b, layer.color.alpha * 255);
                
                // Calculate segment points with slight overlap to prevent gaps
                const x1 = from.x + (to.x - from.x) * t1;
                const y1 = from.y + (to.y - from.y) * t1;
                const x2 = from.x + (to.x - from.x) * t2;
                const y2 = from.y + (to.y - from.y) * t2;
                
                p.line(x1, y1, x2, y2);
              }
              
              // Reset stroke cap to default
              p.strokeCap(p.ROUND);
            } else {
              // Fallback to primary color if color parsing fails
              const colorRgb = hexToRgb(layer.color.primary);
              p.stroke(colorRgb.r, colorRgb.g, colorRgb.b, layer.color.alpha * 255);
              p.line(from.x, from.y, to.x, to.y);
            }
          } else {
            // Solid color
            const colorRgb = hexToRgb(layer.color.primary);
            p.stroke(colorRgb.r, colorRgb.g, colorRgb.b, layer.color.alpha * 255);
            p.line(from.x, from.y, to.x, to.y);
          }
        };

        // Draw string art pattern based on connection type
        if (layer.connectionType === 'two-point' && layer.pointA && layer.pointB) {
          // Two-point connection pattern with alternating sequence: A1-B1, B1-A2, A2-B2, B2-A3...
          const iterations = layer.iterations || 200;
          const numPoints = pointsRef.current.length;
          
          // Calculate initial positions correctly
          let currentPointA = layer.pointA.initialPosition % numPoints;
          let currentPointB = (layer.pointA.initialPosition + layer.pointB.relativeOffset) % numPoints;
          
          // Ensure Point B is within valid range
          if (currentPointB < 0) {
            currentPointB += numPoints;
          }
          
          // Keep track of visited point pairs to prevent infinite loops
          const visitedPairs = new Set<string>();
          let iterationCount = 0;
          
          while (iterationCount < iterations) {
            // First line: A -> B
            const pairKey1 = `${currentPointA}-${currentPointB}`;
            if (visitedPairs.has(pairKey1)) {
              break; // Pattern completed, avoid infinite loop
            }
            visitedPairs.add(pairKey1);
            
            const fromA = pointsRef.current[currentPointA];
            const toB = pointsRef.current[currentPointB];
            
            drawLineWithColor(fromA, toB);
            
            // Move A to next position
            currentPointA = (currentPointA + layer.pointA.stepSize) % numPoints;
            iterationCount++;
            
            if (iterationCount >= iterations) break;
            
            // Second line: B -> A (new position)
            const pairKey2 = `${currentPointB}-${currentPointA}`;
            if (visitedPairs.has(pairKey2)) {
              break; // Pattern completed, avoid infinite loop
            }
            visitedPairs.add(pairKey2);
            
            const fromB = pointsRef.current[currentPointB];
            const toA = pointsRef.current[currentPointA];
            
            drawLineWithColor(fromB, toA);
            
            // Move B to next position
            currentPointB = (currentPointB + layer.pointB.stepSize) % numPoints;
            iterationCount++;
          }
        } else {
          // Single-point connection pattern (original behavior)
          let currentIndex = layer.startPoint % pointsRef.current.length;
          const visited = new Set<number>();
          
          while (!visited.has(currentIndex) && visited.size < pointsRef.current.length) {
            visited.add(currentIndex);
            const nextIndex = (currentIndex + layer.stepSize) % pointsRef.current.length;
            
            const from = pointsRef.current[currentIndex];
            const to = pointsRef.current[nextIndex];
            
            drawLineWithColor(from, to);
            currentIndex = nextIndex;
          }
        }
      });

      // Draw circle points (nails) - ON TOP of strings
      pointsRef.current.forEach((point, index) => {
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
        
        // Show point numbers if enabled
        if (config.showPointNumbers) {
          // Calculate position outside the nail (radial offset)
          const centerX = p.width / 2;
          const centerY = p.height / 2;
          const angle = Math.atan2(point.y - centerY, point.x - centerX);
          const offset = 20; // Distance from nail center
          const textX = point.x + Math.cos(angle) * offset;
          const textY = point.y + Math.sin(angle) * offset;
          
          // Point number text (0-based numbering to match settings)
          p.fill(255, 255, 255, 255);
          p.noStroke();
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(10);
          p.text(index.toString(), textX, textY);
        }
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
        calculatePoints(config.circlePoints, size, size, config.rotation);
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