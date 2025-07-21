export interface Layer {
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