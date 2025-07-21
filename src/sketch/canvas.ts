import { AppConfig, Point } from '../types';

export class CanvasManager {
  private config: AppConfig;
  private points: Point[] = [];

  constructor(config: AppConfig) {
    this.config = config;
    this.calculatePoints();
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
}