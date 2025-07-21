import { AppConfig, Point, Layer } from '../types';

export class CanvasManager {
  private config: AppConfig;
  private points: Point[] = [];
  private layers: Layer[] = [];

  constructor(config: AppConfig) {
    this.config = config;
    this.calculatePoints();
    this.initializeDefaultLayers();
  }

  public updateConfig(newConfig: Partial<AppConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.circlePoints !== undefined) {
      this.calculatePoints();
    }
  }

  public getConfig(): AppConfig {
    return { ...this.config };
  }

  public getPoints(): Point[] {
    return [...this.points];
  }

  private calculatePoints(): void {
    this.points = [];
    const centerX = this.config.canvasSize.width / 2;
    const centerY = this.config.canvasSize.height / 2;
    const radius = Math.min(this.config.canvasSize.width, this.config.canvasSize.height) * 0.35;

    for (let i = 0; i < this.config.circlePoints; i++) {
      const angle = (Math.PI * 2 / this.config.circlePoints) * i;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      this.points.push({ x, y, angle });
    }
  }

  public updateCanvasSize(width: number, height: number): void {
    this.config.canvasSize = { width, height };
    this.calculatePoints();
  }

  public getLayers(): Layer[] {
    return [...this.layers];
  }

  public addLayer(layer: Layer): void {
    this.layers.push(layer);
  }

  public updateLayer(layerId: string, updates: Partial<Layer>): void {
    const index = this.layers.findIndex(layer => layer.id === layerId);
    if (index !== -1 && this.validateLayer(updates)) {
      this.layers[index] = { ...this.layers[index], ...updates };
    }
  }

  public removeLayer(layerId: string): void {
    this.layers = this.layers.filter(layer => layer.id !== layerId);
  }

  private initializeDefaultLayers(): void {
    this.layers = [
      {
        id: 'layer-1',
        name: 'Layer 1',
        visible: true,
        startPoint: 0,
        stepSize: 7,
        color: {
          type: 'solid',
          primary: '#3498db',
          alpha: 0.6
        },
        lineWidth: 1
      },
      {
        id: 'layer-2',
        name: 'Layer 2',
        visible: true,
        startPoint: 12,
        stepSize: 11,
        color: {
          type: 'solid',
          primary: '#e74c3c',
          alpha: 0.4
        },
        lineWidth: 1
      }
    ];
  }

  public calculateStringConnections(layer: Layer): Array<{from: Point, to: Point}> {
    const connections: Array<{from: Point, to: Point}> = [];
    const pointCount = this.points.length;
    
    // Edge case handling
    if (pointCount === 0 || layer.stepSize <= 0 || layer.stepSize >= pointCount) {
      return connections;
    }

    // Ensure start point is within valid range
    const startPoint = Math.max(0, Math.min(layer.startPoint, pointCount - 1));
    
    const visited = new Set<number>();
    let currentIndex = startPoint;
    
    // Calculate connections until we complete the pattern
    const maxIterations = pointCount; // One iteration per point maximum
    let iterations = 0;
    
    while (iterations < maxIterations) {
      const nextIndex = (currentIndex + layer.stepSize) % pointCount;
      
      // Always add the connection
      connections.push({
        from: this.points[currentIndex],
        to: this.points[nextIndex]
      });
      
      // Mark current point as visited
      visited.add(currentIndex);
      
      // Move to next point
      currentIndex = nextIndex;
      iterations++;
      
      // Stop if we've returned to start point (completed the cycle)
      if (currentIndex === startPoint) {
        break;
      }
    }
    
    return connections;
  }

  public validateLayer(layer: Partial<Layer>): boolean {
    const pointCount = this.points.length;
    
    if (layer.startPoint !== undefined && (layer.startPoint < 0 || layer.startPoint >= pointCount)) {
      return false;
    }
    
    if (layer.stepSize !== undefined && (layer.stepSize <= 0 || layer.stepSize >= pointCount)) {
      return false;
    }
    
    if (layer.lineWidth !== undefined && (layer.lineWidth <= 0 || layer.lineWidth > 10)) {
      return false;
    }
    
    if (layer.color?.alpha !== undefined && (layer.color.alpha < 0 || layer.color.alpha > 1)) {
      return false;
    }
    
    return true;
  }
}