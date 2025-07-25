import { CanvasManager } from '../sketch/canvas';
import { Layer, ColorUtils, PALETTE_CATEGORIES, ColorPalette } from '../types';

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
    this.elements.connectionType = document.getElementById('connection-type')!;
    
    // Single-point controls
    this.elements.singlePointControls = document.getElementById('single-point-controls')!;
    this.elements.startPoint = document.getElementById('start-point')!;
    this.elements.startPointInput = document.getElementById('start-point-input')!;
    this.elements.stepSize = document.getElementById('step-size')!;
    this.elements.stepSizeInput = document.getElementById('step-size-input')!;
    
    // Two-point controls
    this.elements.twoPointControls = document.getElementById('two-point-controls')!;
    this.elements.pointAPosition = document.getElementById('point-a-position')!;
    this.elements.pointAPositionInput = document.getElementById('point-a-position-input')!;
    this.elements.pointAStep = document.getElementById('point-a-step')!;
    this.elements.pointAStepInput = document.getElementById('point-a-step-input')!;
    this.elements.pointBPosition = document.getElementById('point-b-position')!;
    this.elements.pointBPositionInput = document.getElementById('point-b-position-input')!;
    this.elements.pointBStep = document.getElementById('point-b-step')!;
    this.elements.pointBStepInput = document.getElementById('point-b-step-input')!;
    this.elements.maxIterations = document.getElementById('max-iterations')!;
    this.elements.maxIterationsInput = document.getElementById('max-iterations-input')!;
    
    // Color controls
    this.elements.colorType = document.getElementById('color-type')!;
    this.elements.layerColor = document.getElementById('layer-color')!;
    this.elements.layerColorText = document.getElementById('layer-color-text')!;
    this.elements.colorHarmony = document.getElementById('color-harmony')!;
    this.elements.secondaryColorGroup = document.getElementById('secondary-color-group')!;
    this.elements.secondaryColor = document.getElementById('secondary-color')!;
    this.elements.secondaryColorText = document.getElementById('secondary-color-text')!;
    
    this.elements.layerAlpha = document.getElementById('layer-alpha')!;
    this.elements.layerAlphaInput = document.getElementById('layer-alpha-input')!;
    this.elements.lineWidth = document.getElementById('line-width')!;
    this.elements.lineWidthInput = document.getElementById('line-width-input')!;
    this.elements.paletteCategories = document.getElementById('palette-categories')!;
    this.elements.presetsDropdownBtn = document.getElementById('presets-dropdown-btn')!;
    this.elements.presetsDropdownPopup = document.getElementById('presets-dropdown-popup')!;
  }

  private setupEventListeners(): void {
    // Global controls - using helper methods for consistency
    this.setupDualControl(
      'circlePoints', 
      'circlePointsInput', 
      this.validateCirclePoints.bind(this),
      (value) => {
        this.canvasManager.updateConfig({ circlePoints: value });
        this.updateLayerList();
        this.updateActiveLayerControls();
      },
      () => this.canvasManager.getConfig().circlePoints
    );

    this.setupColorControl(
      'backgroundColor',
      'backgroundColorText',
      (value) => this.canvasManager.updateConfig({ backgroundColor: value }),
      () => this.canvasManager.getConfig().backgroundColor
    );

    // Layer management
    this.elements.addLayer.addEventListener('click', () => {
      this.canvasManager.createLayer();
      this.updateLayerList();
      this.updateActiveLayerControls();
    });

    // Connection type selector
    (this.elements.connectionType as HTMLSelectElement).addEventListener('change', (e) => {
      const connectionType = (e.target as HTMLSelectElement).value as 'single-point' | 'two-point';
      this.updateActiveLayerConnectionType(connectionType);
      this.toggleConnectionTypeControls(connectionType);
    });

    // Active layer controls
    this.setupActiveLayerControls();
    
    // Initialize palette categories
    this.initializePaletteCategories();
    
    // Setup presets dropdown
    this.setupPresetsDropdown();
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
        <div class="layer-color-preview ${layer.color.type === 'gradient' ? 'gradient' : ''}" 
             style="${layer.color.type === 'gradient' && layer.color.secondary 
                     ? `--primary-color: ${layer.color.primary}; --secondary-color: ${layer.color.secondary}; background: linear-gradient(45deg, ${layer.color.primary} 0%, ${layer.color.secondary} 100%);`
                     : `background-color: ${layer.color.primary};`}"></div>
        ${layer.connectionType === 'two-point' 
          ? `<span>A: ${layer.pointA?.initialPosition ?? 0}, B: ${layer.pointB?.relativeOffset ? `${layer.pointA?.initialPosition ?? 0}${layer.pointB.relativeOffset >= 0 ? '+' : ''}${layer.pointB.relativeOffset}` : 'N/A'}</span>`
          : `<span>Start: ${layer.startPoint}</span>`}
        <span>Step: ${layer.stepSize}</span>
        <span>Opacity: ${Math.round(layer.color.alpha * 100)}%</span>
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

    // Add event listeners for layer actions using helper method
    this.setupLayerActionHandlers(layerDiv, layer);

    return layerDiv;
  }

  private setupActiveLayerControls(): void {
    // Set up dual controls (slider + number input pairs) using helper method
    this.setupDualControl(
      'startPoint',
      'startPointInput', 
      this.validateStartPoint.bind(this),
      (value) => this.updateActiveLayerProperty('startPoint', value),
      () => this.canvasManager.getActiveLayer()?.startPoint ?? 0
    );

    this.setupDualControl(
      'stepSize',
      'stepSizeInput',
      this.validateStepSize.bind(this), 
      (value) => this.updateActiveLayerProperty('stepSize', value),
      () => this.canvasManager.getActiveLayer()?.stepSize ?? 1
    );

    this.setupDualControl(
      'layerAlpha',
      'layerAlphaInput',
      (value) => this.validateAlpha(value / 100),
      (value) => this.updateActiveLayerAlpha(value / 100),
      () => Math.round((this.canvasManager.getActiveLayer()?.color.alpha ?? 0.6) * 100)
    );

    this.setupDualControl(
      'lineWidth',
      'lineWidthInput',
      this.validateLineWidth.bind(this),
      (value) => this.updateActiveLayerProperty('lineWidth', value),
      () => this.canvasManager.getActiveLayer()?.lineWidth ?? 1
    );

    // Set up color controls
    this.setupColorControl(
      'layerColor',
      'layerColorText',
      (value) => this.updateActiveLayerColor(value),
      () => this.canvasManager.getActiveLayer()?.color.primary ?? '#3498db'
    );

    this.setupColorControl(
      'secondaryColor',
      'secondaryColorText',
      (value) => this.updateActiveLayerSecondaryColor(value),
      () => this.canvasManager.getActiveLayer()?.color.secondary ?? '#f39c12'
    );

    // Color type selector
    (this.elements.colorType as HTMLSelectElement).addEventListener('change', (e) => {
      const colorType = (e.target as HTMLSelectElement).value as 'solid' | 'gradient';
      this.updateActiveLayerColorType(colorType);
      this.toggleSecondaryColorVisibility(colorType === 'gradient');
    });

    // Color harmony button
    this.elements.colorHarmony.addEventListener('click', () => {
      this.generateColorHarmony();
    });

    // Two-point controls
    this.setupDualControl(
      'pointAPosition',
      'pointAPositionInput',
      this.validateStartPoint.bind(this),
      (value) => this.updateActiveLayerTwoPointProperty('pointA', 'initialPosition', value),
      () => this.canvasManager.getActiveLayer()?.pointA?.initialPosition ?? 0
    );

    this.setupDualControl(
      'pointAStep',
      'pointAStepInput',
      this.validateStepSize.bind(this),
      (value) => this.updateActiveLayerTwoPointProperty('pointA', 'stepSize', value),
      () => this.canvasManager.getActiveLayer()?.pointA?.stepSize ?? 1
    );

    this.setupDualControl(
      'pointBPosition',
      'pointBPositionInput',
      this.validateRelativeOffset.bind(this),
      (value) => this.updateActiveLayerTwoPointProperty('pointB', 'relativeOffset', value),
      () => this.canvasManager.getActiveLayer()?.pointB?.relativeOffset ?? 1
    );

    this.setupDualControl(
      'pointBStep',
      'pointBStepInput',
      this.validateStepSize.bind(this),
      (value) => this.updateActiveLayerTwoPointProperty('pointB', 'stepSize', value),
      () => this.canvasManager.getActiveLayer()?.pointB?.stepSize ?? 2
    );

    this.setupDualControl(
      'maxIterations',
      'maxIterationsInput',
      this.validateMaxIterations.bind(this),
      (value) => this.updateActiveLayerMaxIterations(value),
      () => this.getActiveLayerMaxIterations()
    );
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

  private updateActiveLayerConnectionType(connectionType: 'single-point' | 'two-point'): void {
    const activeLayer = this.canvasManager.getActiveLayer();
    if (!activeLayer) return;

    if (connectionType === 'two-point') {
      // Convert single-point to two-point
      const twoPointData = {
        id: activeLayer.id,
        name: activeLayer.name,
        visible: activeLayer.visible,
        connectionType: 'two-point' as const,
        pointA: {
          initialPosition: activeLayer.startPoint,
          stepSize: activeLayer.stepSize
        },
        pointB: {
          relativeOffset: 1,
          stepSize: 2
        },
        color: { ...activeLayer.color },
        lineWidth: activeLayer.lineWidth
      };
      
      this.canvasManager.updateLayer(activeLayer.id, twoPointData as any);
    } else {
      // Convert two-point to single-point (use pointA values)
      this.canvasManager.updateLayer(activeLayer.id, {
        connectionType: 'single-point',
        startPoint: activeLayer.pointA?.initialPosition ?? 0,
        stepSize: activeLayer.pointA?.stepSize ?? 1
      });
    }
    
    this.updateLayerList();
    this.updateActiveLayerControls();
  }

  private updateActiveLayerTwoPointProperty(point: 'pointA' | 'pointB', property: 'initialPosition' | 'stepSize' | 'relativeOffset', value: number): void {
    const activeLayer = this.canvasManager.getActiveLayer();
    if (!activeLayer || activeLayer.connectionType !== 'two-point') return;

    const pointData = activeLayer[point];
    if (!pointData) return;

    const updatedPoint = { ...pointData, [property]: value };
    this.canvasManager.updateLayer(activeLayer.id, {
      [point]: updatedPoint
    } as any);
    
    this.updateLayerList();
  }

  private updateActiveLayerMaxIterations(value: number): void {
    const activeLayer = this.canvasManager.getActiveLayer();
    if (!activeLayer || activeLayer.connectionType !== 'two-point') return;

    // Ensure value is treated as a number
    const numericValue = Number(value);
    
    // If value equals calculated total connections, set to undefined for "complete pattern"
    const totalConnections = this.calculateDisplayPeriod(
      activeLayer.pointA?.stepSize ?? 1,
      activeLayer.pointB?.stepSize ?? 2,
      this.canvasManager.getConfig().circlePoints
    );
    
    // If value equals or exceeds total connections, set to undefined for complete pattern
    const maxIterations = numericValue >= totalConnections ? undefined : numericValue;
    
    this.canvasManager.updateLayer(activeLayer.id, { maxIterations } as any);
    this.updateLayerList();
  }

  private getActiveLayerMaxIterations(): number {
    const activeLayer = this.canvasManager.getActiveLayer();
    if (!activeLayer || activeLayer.connectionType !== 'two-point') return 24;

    // If maxIterations is undefined, return the full pattern total connections
    if (activeLayer.maxIterations === undefined) {
      return this.calculateDisplayPeriod(
        activeLayer.pointA?.stepSize ?? 1,
        activeLayer.pointB?.stepSize ?? 2,
        this.canvasManager.getConfig().circlePoints
      );
    }
    
    return activeLayer.maxIterations;
  }

  private toggleConnectionTypeControls(connectionType: 'single-point' | 'two-point'): void {
    this.elements.singlePointControls.style.display = connectionType === 'single-point' ? 'block' : 'none';
    this.elements.twoPointControls.style.display = connectionType === 'two-point' ? 'block' : 'none';
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

    // Update connection type selector
    (this.elements.connectionType as HTMLSelectElement).value = activeLayer.connectionType ?? 'single-point';
    this.toggleConnectionTypeControls(activeLayer.connectionType === 'two-point' ? 'two-point' : 'single-point');

    if (activeLayer.connectionType === 'two-point') {
      // Update two-point controls
      const maxPoints = config.circlePoints - 1;
      
      // Point A controls
      (this.elements.pointAPosition as HTMLInputElement).max = maxPoints.toString();
      (this.elements.pointAPositionInput as HTMLInputElement).max = maxPoints.toString();
      (this.elements.pointAPosition as HTMLInputElement).value = (activeLayer.pointA?.initialPosition ?? 0).toString();
      (this.elements.pointAPositionInput as HTMLInputElement).value = (activeLayer.pointA?.initialPosition ?? 0).toString();
      
      (this.elements.pointAStep as HTMLInputElement).max = maxPoints.toString();
      (this.elements.pointAStepInput as HTMLInputElement).max = maxPoints.toString();
      (this.elements.pointAStep as HTMLInputElement).value = (activeLayer.pointA?.stepSize ?? 1).toString();
      (this.elements.pointAStepInput as HTMLInputElement).value = (activeLayer.pointA?.stepSize ?? 1).toString();
      
      // Point B controls (relative offset)
      (this.elements.pointBPosition as HTMLInputElement).min = (-(config.circlePoints - 1)).toString();
      (this.elements.pointBPosition as HTMLInputElement).max = (config.circlePoints - 1).toString();
      (this.elements.pointBPositionInput as HTMLInputElement).min = (-(config.circlePoints - 1)).toString();
      (this.elements.pointBPositionInput as HTMLInputElement).max = (config.circlePoints - 1).toString();
      (this.elements.pointBPosition as HTMLInputElement).value = (activeLayer.pointB?.relativeOffset ?? 1).toString();
      (this.elements.pointBPositionInput as HTMLInputElement).value = (activeLayer.pointB?.relativeOffset ?? 1).toString();
      
      (this.elements.pointBStep as HTMLInputElement).max = maxPoints.toString();
      (this.elements.pointBStepInput as HTMLInputElement).max = maxPoints.toString();
      (this.elements.pointBStep as HTMLInputElement).value = (activeLayer.pointB?.stepSize ?? 2).toString();
      (this.elements.pointBStepInput as HTMLInputElement).value = (activeLayer.pointB?.stepSize ?? 2).toString();
      
      // Update maxIterations controls
      const totalConnections = this.calculateDisplayPeriod(
        activeLayer.pointA?.stepSize ?? 1,
        activeLayer.pointB?.stepSize ?? 2,
        config.circlePoints
      );
      (this.elements.maxIterations as HTMLInputElement).max = totalConnections.toString();
      (this.elements.maxIterationsInput as HTMLInputElement).max = totalConnections.toString();
      
      const currentMaxIterations = this.getActiveLayerMaxIterations();
      (this.elements.maxIterations as HTMLInputElement).value = currentMaxIterations.toString();
      (this.elements.maxIterationsInput as HTMLInputElement).value = currentMaxIterations.toString();
    } else {
      // Update single-point controls
      (this.elements.startPoint as HTMLInputElement).max = (config.circlePoints - 1).toString();
      (this.elements.startPointInput as HTMLInputElement).max = (config.circlePoints - 1).toString();
      (this.elements.startPoint as HTMLInputElement).value = activeLayer.startPoint.toString();
      (this.elements.startPointInput as HTMLInputElement).value = activeLayer.startPoint.toString();

      (this.elements.stepSize as HTMLInputElement).max = (config.circlePoints - 1).toString();
      (this.elements.stepSizeInput as HTMLInputElement).max = (config.circlePoints - 1).toString();
      (this.elements.stepSize as HTMLInputElement).value = activeLayer.stepSize.toString();
      (this.elements.stepSizeInput as HTMLInputElement).value = activeLayer.stepSize.toString();
    }

    // Update color type
    (this.elements.colorType as HTMLSelectElement).value = activeLayer.color.type;
    this.toggleSecondaryColorVisibility(activeLayer.color.type === 'gradient');

    // Update color controls
    (this.elements.layerColor as HTMLInputElement).value = activeLayer.color.primary;
    (this.elements.layerColorText as HTMLInputElement).value = activeLayer.color.primary;
    
    // Update secondary color controls
    if (activeLayer.color.secondary) {
      (this.elements.secondaryColor as HTMLInputElement).value = activeLayer.color.secondary;
      (this.elements.secondaryColorText as HTMLInputElement).value = activeLayer.color.secondary;
    }

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

  private validateMaxIterations(value: number): boolean {
    return !isNaN(value) && value >= 1 && value <= 1000;
  }

  private validateRelativeOffset(value: number): boolean {
    const config = this.canvasManager.getConfig();
    return !isNaN(value) && value >= -(config.circlePoints - 1) && value <= (config.circlePoints - 1);
  }

  // Helper methods to reduce code duplication
  private setupDualControl(
    sliderId: string,
    inputId: string, 
    validator: (value: number) => boolean,
    onUpdate: (value: number) => void,
    getCurrentValue: () => number
  ): void {
    const slider = this.elements[sliderId] as HTMLInputElement;
    const input = this.elements[inputId] as HTMLInputElement;

    // Slider input handler
    slider.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (validator(value)) {
        onUpdate(value);
        input.value = value.toString();
      }
    });

    // Number input handler
    input.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (validator(value)) {
        onUpdate(value);
        slider.value = value.toString();
      }
    });

    // Blur handler to reset invalid values
    input.addEventListener('blur', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (!validator(value)) {
        const currentValue = getCurrentValue();
        (e.target as HTMLInputElement).value = currentValue.toString();
      }
    });
  }

  private setupColorControl(
    pickerId: string,
    textId: string,
    onUpdate: (value: string) => void,
    getCurrentValue: () => string
  ): void {
    const picker = this.elements[pickerId] as HTMLInputElement;
    const text = this.elements[textId] as HTMLInputElement;

    // Color picker handler
    picker.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      if (this.validateColor(value)) {
        onUpdate(value);
        text.value = value;
      }
    });

    // Text input handler
    text.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      if (this.validateColor(value)) {
        onUpdate(value);
        picker.value = value;
      }
    });

    // Blur handler to reset invalid values
    text.addEventListener('blur', (e) => {
      const value = (e.target as HTMLInputElement).value;
      if (!this.validateColor(value)) {
        const currentValue = getCurrentValue();
        (e.target as HTMLInputElement).value = currentValue;
      }
    });
  }

  private setupLayerActionHandlers(layerDiv: HTMLElement, layer: Layer): void {
    const visibilityToggle = layerDiv.querySelector('.visibility-toggle') as HTMLElement;
    const duplicateBtn = layerDiv.querySelector('[data-action="duplicate"]') as HTMLElement;
    const moveUpBtn = layerDiv.querySelector('[data-action="move-up"]') as HTMLElement;
    const moveDownBtn = layerDiv.querySelector('[data-action="move-down"]') as HTMLElement;
    const deleteBtn = layerDiv.querySelector('[data-action="delete"]') as HTMLElement;

    const stopPropagationHandler = (handler: () => void) => (e: Event) => {
      e.stopPropagation();
      handler();
    };

    visibilityToggle.onclick = stopPropagationHandler(() => {
      this.canvasManager.updateLayer(layer.id, { visible: !layer.visible });
      this.updateLayerList();
    });

    duplicateBtn.onclick = stopPropagationHandler(() => {
      this.canvasManager.duplicateLayer(layer.id);
      this.updateLayerList();
      this.updateActiveLayerControls();
    });

    moveUpBtn.onclick = stopPropagationHandler(() => {
      this.canvasManager.moveLayerUp(layer.id);
      this.updateLayerList();
    });

    moveDownBtn.onclick = stopPropagationHandler(() => {
      this.canvasManager.moveLayerDown(layer.id);
      this.updateLayerList();
    });

    deleteBtn.onclick = stopPropagationHandler(() => {
      if (this.canvasManager.getLayers().length > 1) {
        this.canvasManager.removeLayer(layer.id);
        this.updateLayerList();
        this.updateActiveLayerControls();
      }
    });
  }

  private updateActiveLayerSecondaryColor(color: string): void {
    const activeLayer = this.canvasManager.getActiveLayer();
    if (!activeLayer) return;

    this.canvasManager.updateLayer(activeLayer.id, {
      color: { ...activeLayer.color, secondary: color }
    });
    this.updateLayerList();
  }

  private updateActiveLayerColorType(type: 'solid' | 'gradient'): void {
    const activeLayer = this.canvasManager.getActiveLayer();
    if (!activeLayer) return;

    const updatedColor = { ...activeLayer.color, type };
    if (type === 'gradient' && !activeLayer.color.secondary) {
      updatedColor.secondary = '#f39c12';
    }

    this.canvasManager.updateLayer(activeLayer.id, { color: updatedColor });
    this.updateLayerList();
  }

  private toggleSecondaryColorVisibility(visible: boolean): void {
    this.elements.secondaryColorGroup.style.display = visible ? 'flex' : 'none';
  }

  private generateColorHarmony(): void {
    const activeLayer = this.canvasManager.getActiveLayer();
    if (!activeLayer) return;

    // Generate complementary colors as default harmony
    const harmonyColors = ColorUtils.generateColorHarmony(
      activeLayer.color.primary,
      'complementary'
    );

    if (harmonyColors.length > 1) {
      this.updateActiveLayerSecondaryColor(harmonyColors[1]);
      (this.elements.secondaryColor as HTMLInputElement).value = harmonyColors[1];
      (this.elements.secondaryColorText as HTMLInputElement).value = harmonyColors[1];

      // Switch to gradient mode if not already
      if (activeLayer.color.type !== 'gradient') {
        (this.elements.colorType as HTMLSelectElement).value = 'gradient';
        this.updateActiveLayerColorType('gradient');
        this.toggleSecondaryColorVisibility(true);
      }
    }
  }

  private initializePaletteCategories(): void {
    this.elements.paletteCategories.innerHTML = '';

    // Create tabs for categories
    const tabContainer = document.createElement('div');
    tabContainer.className = 'palette-tabs';

    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'palette-content';

    PALETTE_CATEGORIES.forEach((category, index) => {
      // Create tab button
      const tabButton = document.createElement('button');
      tabButton.className = `palette-tab ${index === 0 ? 'active' : ''}`;
      tabButton.textContent = category.name;
      tabButton.setAttribute('data-category-id', category.id);
      
      // Create content panel
      const contentPanel = document.createElement('div');
      contentPanel.className = `palette-panel ${index === 0 ? 'active' : ''}`;
      contentPanel.setAttribute('data-category-id', category.id);

      // Add palettes to panel
      category.palettes.forEach(palette => {
        const paletteButton = document.createElement('button');
        paletteButton.className = 'preset-palette-btn';
        paletteButton.title = `${palette.name}: ${palette.description}`;
        paletteButton.setAttribute('data-palette-id', palette.id);

        // Create color preview (show only the 2 colors that will be used)
        const colorPreview = document.createElement('div');
        colorPreview.className = 'palette-preview';
        palette.colors.slice(0, 2).forEach(color => {
          const colorSwatch = document.createElement('div');
          colorSwatch.className = 'palette-swatch';
          colorSwatch.style.backgroundColor = color;
          colorPreview.appendChild(colorSwatch);
        });

        const nameLabel = document.createElement('div');
        nameLabel.className = 'palette-name';
        nameLabel.textContent = palette.name;

        paletteButton.appendChild(colorPreview);
        paletteButton.appendChild(nameLabel);
        paletteButton.addEventListener('click', () => {
          this.applyPresetPalette(palette);
          this.closePresetsDropdown();
        });

        contentPanel.appendChild(paletteButton);
      });

      // Tab click handler
      tabButton.addEventListener('click', () => {
        // Remove active class from all tabs and panels
        tabContainer.querySelectorAll('.palette-tab').forEach(t => t.classList.remove('active'));
        contentContainer.querySelectorAll('.palette-panel').forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding panel
        tabButton.classList.add('active');
        contentPanel.classList.add('active');
      });

      tabContainer.appendChild(tabButton);
      contentContainer.appendChild(contentPanel);
    });

    this.elements.paletteCategories.appendChild(tabContainer);
    this.elements.paletteCategories.appendChild(contentContainer);
  }

  private applyPresetPalette(palette: ColorPalette): void {
    const activeLayer = this.canvasManager.getActiveLayer();
    if (!activeLayer || palette.colors.length < 2) return;

    // Apply primary and secondary colors
    const primaryColor = palette.colors[0];
    const secondaryColor = palette.colors[1];

    this.canvasManager.updateLayer(activeLayer.id, {
      color: {
        type: 'gradient',
        primary: primaryColor,
        secondary: secondaryColor,
        alpha: activeLayer.color.alpha
      }
    });

    // Update UI controls
    (this.elements.colorType as HTMLSelectElement).value = 'gradient';
    (this.elements.layerColor as HTMLInputElement).value = primaryColor;
    (this.elements.layerColorText as HTMLInputElement).value = primaryColor;
    (this.elements.secondaryColor as HTMLInputElement).value = secondaryColor;
    (this.elements.secondaryColorText as HTMLInputElement).value = secondaryColor;
    
    this.toggleSecondaryColorVisibility(true);
    this.updateLayerList();
  }

  private setupPresetsDropdown(): void {
    // Toggle dropdown on button click
    this.elements.presetsDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePresetsDropdown();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.elements.presetsDropdownPopup.contains(e.target as Node) && 
          !this.elements.presetsDropdownBtn.contains(e.target as Node)) {
        this.closePresetsDropdown();
      }
    });

    // Prevent dropdown from closing when clicking inside
    this.elements.presetsDropdownPopup.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  private togglePresetsDropdown(): void {
    const popup = this.elements.presetsDropdownPopup;
    if (popup.classList.contains('show')) {
      this.closePresetsDropdown();
    } else {
      this.openPresetsDropdown();
    }
  }

  private openPresetsDropdown(): void {
    this.elements.presetsDropdownPopup.classList.add('show');
  }

  private closePresetsDropdown(): void {
    this.elements.presetsDropdownPopup.classList.remove('show');
  }


  private calculateDisplayPeriod(stepA: number, stepB: number, pointCount: number): number {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const lcm = (a: number, b: number): number => Math.abs(a * b) / gcd(a, b);
    
    // Calculate period for each point independently
    const periodA = pointCount / gcd(stepA, pointCount);
    const periodB = pointCount / gcd(stepB, pointCount);
    
    // Total period is LCM of both periods
    const patternPeriod = lcm(periodA, periodB);
    const totalConnections = patternPeriod * 2;
    
    // Return total connections (2 connections per period iteration)
    return totalConnections;
  }

}