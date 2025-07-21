import { AppConfig, Point, Layer, LayerData } from '../types';

export class CanvasManager {
  private config: AppConfig;
  private points: Point[] = [];
  private layers: Layer[] = [];
  private activeLayerId: string | null = null;

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

  private findLayerIndex(layerId: string): number {
    return this.layers.findIndex(layer => layer.id === layerId);
  }

  public addLayer(layerData: LayerData): void {
    const layer = new Layer(layerData);
    this.layers.push(layer);
    if (!this.activeLayerId) {
      this.activeLayerId = layer.id;
    }
  }

  public createLayer(): Layer {
    const newLayer = new Layer({
      id: Layer.generateId(),
      name: Layer.generateName(this.layers),
      visible: true,
      startPoint: 0,
      stepSize: 5,
      color: {
        type: 'solid',
        primary: '#ffffff',
        alpha: 0.8
      },
      lineWidth: 1
    });
    
    this.layers.push(newLayer);
    this.activeLayerId = newLayer.id;
    return newLayer;
  }

  public duplicateLayer(layerId: string): Layer | null {
    const index = this.findLayerIndex(layerId);
    if (index === -1) return null;
    
    const duplicatedLayer = this.layers[index].clone();
    this.layers.splice(index + 1, 0, duplicatedLayer);
    this.activeLayerId = duplicatedLayer.id;
    return duplicatedLayer;
  }

  public updateLayer(layerId: string, updates: Partial<LayerData>): void {
    const index = this.findLayerIndex(layerId);
    if (index === -1) return;
    
    const updatedLayer = this.layers[index].update(updates);
    if (updatedLayer.validate(this.points.length)) {
      this.layers[index] = updatedLayer;
    }
  }

  public removeLayer(layerId: string): void {
    if (this.layers.length <= 1) return;
    
    const index = this.findLayerIndex(layerId);
    if (index === -1) return;
    
    this.layers.splice(index, 1);
    
    if (this.activeLayerId === layerId) {
      this.activeLayerId = index < this.layers.length 
        ? this.layers[index].id 
        : this.layers[index - 1].id;
    }
  }

  public moveLayerUp(layerId: string): void {
    const index = this.findLayerIndex(layerId);
    if (index > 0) {
      [this.layers[index], this.layers[index - 1]] = [this.layers[index - 1], this.layers[index]];
    }
  }

  public moveLayerDown(layerId: string): void {
    const index = this.findLayerIndex(layerId);
    if (index >= 0 && index < this.layers.length - 1) {
      [this.layers[index], this.layers[index + 1]] = [this.layers[index + 1], this.layers[index]];
    }
  }

  public setActiveLayer(layerId: string): void {
    if (this.layers.some(layer => layer.id === layerId)) {
      this.activeLayerId = layerId;
    }
  }

  public getActiveLayer(): Layer | null {
    return this.layers.find(layer => layer.id === this.activeLayerId) || null;
  }

  public getActiveLayerId(): string | null {
    return this.activeLayerId;
  }

  public renameLayer(layerId: string, newName: string): void {
    this.updateLayer(layerId, { name: newName });
  }

  private initializeDefaultLayers(): void {
    const layer1 = new Layer({
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
    });

    const layer2 = new Layer({
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
    });

    this.layers = [layer1, layer2];
    this.activeLayerId = layer1.id;
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

}