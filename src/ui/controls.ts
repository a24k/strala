import { CanvasManager } from '../sketch/canvas';
import { Layer } from '../types';

export class UIControls {
  private canvasManager: CanvasManager;
  private elements: { [key: string]: HTMLElement } = {};

  constructor(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
    this.initializeElements();
    this.setupEventListeners();
    this.updateUI();
  }

  private initializeElements(): void {
    // Global controls
    this.elements.circlePoints = document.getElementById('circle-points')!;
    this.elements.circlePointsInput = document.getElementById('circle-points-input')!;
    this.elements.backgroundColor = document.getElementById('background-color')!;
    this.elements.backgroundColorText = document.getElementById('background-color-text')!;

    // Layer controls
    this.elements.addLayer = document.getElementById('add-layer')!;
    this.elements.layerList = document.getElementById('layer-list')!;

    // Active layer controls
    this.elements.activeLayerName = document.getElementById('active-layer-name')!;
    this.elements.startPoint = document.getElementById('start-point')!;
    this.elements.startPointInput = document.getElementById('start-point-input')!;
    this.elements.stepSize = document.getElementById('step-size')!;
    this.elements.stepSizeInput = document.getElementById('step-size-input')!;
    this.elements.layerColor = document.getElementById('layer-color')!;
    this.elements.layerColorText = document.getElementById('layer-color-text')!;
    this.elements.layerAlpha = document.getElementById('layer-alpha')!;
    this.elements.layerAlphaInput = document.getElementById('layer-alpha-input')!;
    this.elements.lineWidth = document.getElementById('line-width')!;
    this.elements.lineWidthInput = document.getElementById('line-width-input')!;
  }

  private setupEventListeners(): void {
    // Global controls
    this.elements.circlePoints.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (this.validateCirclePoints(value)) {
        this.canvasManager.updateConfig({ circlePoints: value });
        (this.elements.circlePointsInput as HTMLInputElement).value = value.toString();
        this.updateLayerList(); // Update layer controls with new ranges
      }
    });

    this.elements.circlePointsInput.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (this.validateCirclePoints(value)) {
        this.canvasManager.updateConfig({ circlePoints: value });
        (this.elements.circlePoints as HTMLInputElement).value = value.toString();
        this.updateLayerList(); // Update layer controls with new ranges
      }
    });

    this.elements.circlePointsInput.addEventListener('blur', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (!this.validateCirclePoints(value)) {
        const config = this.canvasManager.getConfig();
        (e.target as HTMLInputElement).value = config.circlePoints.toString();
      }
    });

    this.elements.backgroundColor.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      if (this.validateColor(value)) {
        this.canvasManager.updateConfig({ backgroundColor: value });
        (this.elements.backgroundColorText as HTMLInputElement).value = value;
      }
    });

    this.elements.backgroundColorText.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      if (this.validateColor(value)) {
        this.canvasManager.updateConfig({ backgroundColor: value });
        (this.elements.backgroundColor as HTMLInputElement).value = value;
      }
    });

    this.elements.backgroundColorText.addEventListener('blur', (e) => {
      const value = (e.target as HTMLInputElement).value;
      if (!this.validateColor(value)) {
        const config = this.canvasManager.getConfig();
        (e.target as HTMLInputElement).value = config.backgroundColor;
      }
    });

    // Layer management
    this.elements.addLayer.addEventListener('click', () => {
      this.canvasManager.createLayer();
      this.updateLayerList();
      this.updateActiveLayerControls();
    });


    // Active layer controls
    this.setupActiveLayerControls();
  }

  private updateUI(): void {
    this.updateGlobalControls();
    this.updateLayerList();
    this.updateActiveLayerControls();
  }

  private updateGlobalControls(): void {
    const config = this.canvasManager.getConfig();
    
    (this.elements.circlePoints as HTMLInputElement).value = config.circlePoints.toString();
    (this.elements.circlePointsInput as HTMLInputElement).value = config.circlePoints.toString();
    
    (this.elements.backgroundColor as HTMLInputElement).value = config.backgroundColor;
    (this.elements.backgroundColorText as HTMLInputElement).value = config.backgroundColor;
  }

  private updateLayerList(): void {
    const layers = this.canvasManager.getLayers();
    const activeLayerId = this.canvasManager.getActiveLayerId();

    this.elements.layerList.innerHTML = '';

    layers.forEach((layer) => {
      const layerElement = this.createLayerElement(layer, layer.id === activeLayerId);
      this.elements.layerList.appendChild(layerElement);
    });
  }

  private createLayerElement(layer: Layer, isActive: boolean): HTMLElement {
    const layerDiv = document.createElement('div');
    layerDiv.className = `layer-item ${isActive ? 'active' : ''}`;
    
    // Set the active layer colors to match the layer's color
    if (isActive) {
      layerDiv.style.setProperty('--active-border-color', layer.color.primary);
      
      // Convert hex to rgba for background with low opacity
      const hex = layer.color.primary.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      layerDiv.style.setProperty('--active-bg-color', `rgba(${r}, ${g}, ${b}, 0.12)`);
    }

    layerDiv.innerHTML = `
      <div class="layer-header">
        <span class="layer-name">${layer.name}</span>
        <div class="layer-actions">
          <button class="visibility-toggle ${layer.visible ? 'visible' : ''}" data-layer-id="${layer.id}" title="${layer.visible ? 'Hide layer' : 'Show layer'}">
            ${layer.visible ? '◉' : '○'}
          </button>
          <button class="btn btn-secondary btn-mini" data-action="duplicate" data-layer-id="${layer.id}" title="Duplicate layer">⧉</button>
          <button class="btn btn-secondary btn-mini" data-action="move-up" data-layer-id="${layer.id}" title="Move layer up">△</button>
          <button class="btn btn-secondary btn-mini" data-action="move-down" data-layer-id="${layer.id}" title="Move layer down">▽</button>
          <button class="btn btn-secondary btn-mini" data-action="delete" data-layer-id="${layer.id}" title="Delete layer">✕</button>
        </div>
      </div>
      
      <div class="layer-info">
        <div class="layer-color-preview" style="background-color: ${layer.color.primary}"></div>
        <span>Start: ${layer.startPoint}</span>
        <span>Step: ${layer.stepSize}</span>
        <span>Alpha: ${Math.round(layer.color.alpha * 100)}%</span>
      </div>
    `;

    // Add click handler for layer selection
    layerDiv.addEventListener('click', (e) => {
      // Don't trigger if clicking on actions
      if ((e.target as HTMLElement).closest('.layer-actions')) {
        return;
      }
      this.canvasManager.setActiveLayer(layer.id);
      this.updateLayerList();
      this.updateActiveLayerControls();
    });

    // Add event listeners for layer actions
    const visibilityToggle = layerDiv.querySelector('.visibility-toggle') as HTMLElement;
    visibilityToggle.onclick = (e) => {
      e.stopPropagation();
      this.canvasManager.updateLayer(layer.id, { visible: !layer.visible });
      this.updateLayerList();
    };

    const duplicateBtn = layerDiv.querySelector('[data-action="duplicate"]') as HTMLElement;
    duplicateBtn.onclick = (e) => {
      e.stopPropagation();
      this.canvasManager.duplicateLayer(layer.id);
      this.updateLayerList();
      this.updateActiveLayerControls();
    };

    const moveUpBtn = layerDiv.querySelector('[data-action="move-up"]') as HTMLElement;
    moveUpBtn.onclick = (e) => {
      e.stopPropagation();
      this.canvasManager.moveLayerUp(layer.id);
      this.updateLayerList();
    };

    const moveDownBtn = layerDiv.querySelector('[data-action="move-down"]') as HTMLElement;
    moveDownBtn.onclick = (e) => {
      e.stopPropagation();
      this.canvasManager.moveLayerDown(layer.id);
      this.updateLayerList();
    };

    const deleteBtn = layerDiv.querySelector('[data-action="delete"]') as HTMLElement;
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (this.canvasManager.getLayers().length > 1) {
        this.canvasManager.removeLayer(layer.id);
        this.updateLayerList();
        this.updateActiveLayerControls();
      }
    };

    return layerDiv;
  }

  private setupActiveLayerControls(): void {
    // Start point controls
    this.elements.startPoint.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (this.validateStartPoint(value)) {
        this.updateActiveLayerProperty('startPoint', value);
        (this.elements.startPointInput as HTMLInputElement).value = value.toString();
      }
    });

    this.elements.startPointInput.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (this.validateStartPoint(value)) {
        this.updateActiveLayerProperty('startPoint', value);
        (this.elements.startPoint as HTMLInputElement).value = value.toString();
      }
    });

    this.elements.startPointInput.addEventListener('blur', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (!this.validateStartPoint(value)) {
        const activeLayer = this.canvasManager.getActiveLayer();
        if (activeLayer) {
          (e.target as HTMLInputElement).value = activeLayer.startPoint.toString();
        }
      }
    });

    // Step size controls
    this.elements.stepSize.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (this.validateStepSize(value)) {
        this.updateActiveLayerProperty('stepSize', value);
        (this.elements.stepSizeInput as HTMLInputElement).value = value.toString();
      }
    });

    this.elements.stepSizeInput.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (this.validateStepSize(value)) {
        this.updateActiveLayerProperty('stepSize', value);
        (this.elements.stepSize as HTMLInputElement).value = value.toString();
      }
    });

    this.elements.stepSizeInput.addEventListener('blur', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (!this.validateStepSize(value)) {
        const activeLayer = this.canvasManager.getActiveLayer();
        if (activeLayer) {
          (e.target as HTMLInputElement).value = activeLayer.stepSize.toString();
        }
      }
    });

    // Color controls
    this.elements.layerColor.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      if (this.validateColor(value)) {
        this.updateActiveLayerColor(value);
        (this.elements.layerColorText as HTMLInputElement).value = value;
      }
    });

    this.elements.layerColorText.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      if (this.validateColor(value)) {
        this.updateActiveLayerColor(value);
        (this.elements.layerColor as HTMLInputElement).value = value;
      }
    });

    this.elements.layerColorText.addEventListener('blur', (e) => {
      const value = (e.target as HTMLInputElement).value;
      if (!this.validateColor(value)) {
        const activeLayer = this.canvasManager.getActiveLayer();
        if (activeLayer) {
          (e.target as HTMLInputElement).value = activeLayer.color.primary;
        }
      }
    });

    // Alpha controls
    this.elements.layerAlpha.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (this.validateAlpha(value / 100)) {
        this.updateActiveLayerAlpha(value / 100);
        (this.elements.layerAlphaInput as HTMLInputElement).value = value.toString();
      }
    });

    this.elements.layerAlphaInput.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (this.validateAlpha(value / 100)) {
        this.updateActiveLayerAlpha(value / 100);
        (this.elements.layerAlpha as HTMLInputElement).value = value.toString();
      }
    });

    this.elements.layerAlphaInput.addEventListener('blur', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (!this.validateAlpha(value / 100)) {
        const activeLayer = this.canvasManager.getActiveLayer();
        if (activeLayer) {
          const alphaPercent = Math.round(activeLayer.color.alpha * 100);
          (e.target as HTMLInputElement).value = alphaPercent.toString();
        }
      }
    });

    // Line width controls
    this.elements.lineWidth.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (this.validateLineWidth(value)) {
        this.updateActiveLayerProperty('lineWidth', value);
        (this.elements.lineWidthInput as HTMLInputElement).value = value.toString();
      }
    });

    this.elements.lineWidthInput.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (this.validateLineWidth(value)) {
        this.updateActiveLayerProperty('lineWidth', value);
        (this.elements.lineWidth as HTMLInputElement).value = value.toString();
      }
    });

    this.elements.lineWidthInput.addEventListener('blur', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (!this.validateLineWidth(value)) {
        const activeLayer = this.canvasManager.getActiveLayer();
        if (activeLayer) {
          (e.target as HTMLInputElement).value = activeLayer.lineWidth.toString();
        }
      }
    });
  }

  private updateActiveLayerProperty(property: string, value: any): void {
    const activeLayer = this.canvasManager.getActiveLayer();
    if (!activeLayer) return;

    this.canvasManager.updateLayer(activeLayer.id, { [property]: value });
    this.updateLayerList();
  }

  private updateActiveLayerColor(color: string): void {
    const activeLayer = this.canvasManager.getActiveLayer();
    if (!activeLayer) return;

    this.canvasManager.updateLayer(activeLayer.id, {
      color: { ...activeLayer.color, primary: color }
    });
    this.updateLayerList();
  }

  private updateActiveLayerAlpha(alpha: number): void {
    const activeLayer = this.canvasManager.getActiveLayer();
    if (!activeLayer) return;

    this.canvasManager.updateLayer(activeLayer.id, {
      color: { ...activeLayer.color, alpha }
    });
    this.updateLayerList();
  }

  private updateActiveLayerControls(): void {
    const activeLayer = this.canvasManager.getActiveLayer();
    const config = this.canvasManager.getConfig();
    
    if (!activeLayer) {
      (this.elements.activeLayerName as HTMLElement).textContent = 'No layer selected';
      return;
    }

    // Update layer name display
    (this.elements.activeLayerName as HTMLElement).textContent = activeLayer.name;

    // Update start point controls with new max value
    (this.elements.startPoint as HTMLInputElement).max = (config.circlePoints - 1).toString();
    (this.elements.startPointInput as HTMLInputElement).max = (config.circlePoints - 1).toString();
    (this.elements.startPoint as HTMLInputElement).value = activeLayer.startPoint.toString();
    (this.elements.startPointInput as HTMLInputElement).value = activeLayer.startPoint.toString();

    // Update step size controls with new max value
    (this.elements.stepSize as HTMLInputElement).max = (config.circlePoints - 1).toString();
    (this.elements.stepSizeInput as HTMLInputElement).max = (config.circlePoints - 1).toString();
    (this.elements.stepSize as HTMLInputElement).value = activeLayer.stepSize.toString();
    (this.elements.stepSizeInput as HTMLInputElement).value = activeLayer.stepSize.toString();

    // Update color controls
    (this.elements.layerColor as HTMLInputElement).value = activeLayer.color.primary;
    (this.elements.layerColorText as HTMLInputElement).value = activeLayer.color.primary;

    // Update alpha controls
    const alphaPercent = Math.round(activeLayer.color.alpha * 100);
    (this.elements.layerAlpha as HTMLInputElement).value = alphaPercent.toString();
    (this.elements.layerAlphaInput as HTMLInputElement).value = alphaPercent.toString();

    // Update line width controls
    (this.elements.lineWidth as HTMLInputElement).value = activeLayer.lineWidth.toString();
    (this.elements.lineWidthInput as HTMLInputElement).value = activeLayer.lineWidth.toString();
  }


  public refresh(): void {
    this.updateUI();
  }

  // Validation methods
  private validateCirclePoints(value: number): boolean {
    return !isNaN(value) && value >= 8 && value <= 100;
  }

  private validateStartPoint(value: number): boolean {
    const config = this.canvasManager.getConfig();
    return !isNaN(value) && value >= 0 && value < config.circlePoints;
  }

  private validateStepSize(value: number): boolean {
    const config = this.canvasManager.getConfig();
    return !isNaN(value) && value >= 1 && value < config.circlePoints;
  }

  private validateColor(value: string): boolean {
    return /^#[0-9A-F]{6}$/i.test(value);
  }

  private validateAlpha(value: number): boolean {
    return !isNaN(value) && value >= 0 && value <= 1;
  }

  private validateLineWidth(value: number): boolean {
    return !isNaN(value) && value >= 1 && value <= 10;
  }
}