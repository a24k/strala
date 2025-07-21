export interface LayerData {
  id: string;
  name: string;
  visible: boolean;
  startPoint: number;
  stepSize: number;
  color: {
    type: 'solid' | 'gradient';
    primary: string;
    secondary?: string;
    alpha: number;
  };
  lineWidth: number;
}

export class Layer implements LayerData {
  public id: string;
  public name: string;
  public visible: boolean;
  public startPoint: number;
  public stepSize: number;
  public color: {
    type: 'solid' | 'gradient';
    primary: string;
    secondary?: string;
    alpha: number;
  };
  public lineWidth: number;

  constructor(data: LayerData) {
    this.id = data.id;
    this.name = data.name;
    this.visible = data.visible;
    this.startPoint = data.startPoint;
    this.stepSize = data.stepSize;
    this.color = { ...data.color };
    this.lineWidth = data.lineWidth;
  }

  public static generateId(): string {
    return `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public static generateName(existingLayers: Layer[]): string {
    const layerNumbers = existingLayers
      .map(layer => {
        const match = layer.name.match(/^Layer (\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => num > 0);
    
    const nextNumber = layerNumbers.length > 0 ? Math.max(...layerNumbers) + 1 : 1;
    return `Layer ${nextNumber}`;
  }

  public clone(): Layer {
    return new Layer({
      id: Layer.generateId(),
      name: this.name + ' Copy',
      visible: this.visible,
      startPoint: this.startPoint,
      stepSize: this.stepSize,
      color: { ...this.color },
      lineWidth: this.lineWidth
    });
  }

  public update(updates: Partial<LayerData>): Layer {
    return new Layer({
      id: updates.id ?? this.id,
      name: updates.name ?? this.name,
      visible: updates.visible ?? this.visible,
      startPoint: updates.startPoint ?? this.startPoint,
      stepSize: updates.stepSize ?? this.stepSize,
      color: updates.color ? { ...this.color, ...updates.color } : { ...this.color },
      lineWidth: updates.lineWidth ?? this.lineWidth
    });
  }

  public validate(maxPoints: number): boolean {
    if (this.startPoint < 0 || this.startPoint >= maxPoints) return false;
    if (this.stepSize <= 0 || this.stepSize >= maxPoints) return false;
    if (this.lineWidth <= 0 || this.lineWidth > 10) return false;
    if (this.color.alpha < 0 || this.color.alpha > 1) return false;
    return true;
  }
}


export interface AppConfig {
  circlePoints: number;
  backgroundColor: string;
  canvasSize: {
    width: number;
    height: number;
  };
}

export interface Point {
  x: number;
  y: number;
  angle: number;
}