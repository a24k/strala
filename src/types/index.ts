// Connection type for string patterns
export type StringConnectionType = 'single-point' | 'two-point';

export interface LayerData {
  id: string;
  name: string;
  visible: boolean;
  connectionType?: StringConnectionType; // Optional for backward compatibility
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

// Two-point layer data structure
export interface TwoPointLayerData extends Omit<LayerData, 'startPoint' | 'stepSize' | 'connectionType'> {
  connectionType: 'two-point';
  pointA: {
    initialPosition: number;  // 0 to circlePoints-1
    stepSize: number;        // 1 to 50
  };
  pointB: {
    relativeOffset: number;  // Relative offset from pointA (-circlePoints+1 to circlePoints-1)
    stepSize: number;        // 1 to 50
  };
  maxIterations?: number;    // Optional: limit pattern iterations for partial designs
}

// Extended layer data union type
export type ExtendedLayerData = LayerData | TwoPointLayerData;

// Type guard functions
export function isTwoPointLayer(layer: ExtendedLayerData): layer is TwoPointLayerData {
  return layer.connectionType === 'two-point';
}

// Helper function to calculate actual position of pointB from relative offset
export function calculatePointBPosition(pointAPosition: number, relativeOffset: number, circlePoints: number): number {
  return (pointAPosition + relativeOffset + circlePoints) % circlePoints;
}

export function convertSingleToTwoPoint(layer: LayerData): TwoPointLayerData {
  return {
    id: layer.id,
    name: layer.name,
    visible: layer.visible,
    connectionType: 'two-point',
    pointA: {
      initialPosition: layer.startPoint,
      stepSize: layer.stepSize
    },
    pointB: {
      relativeOffset: 1, // Default: point B at position A+1
      stepSize: 2
    },
    color: { ...layer.color },
    lineWidth: layer.lineWidth
  };
}

export class Layer implements LayerData {
  public id: string;
  public name: string;
  public visible: boolean;
  public connectionType?: StringConnectionType;
  public startPoint: number;
  public stepSize: number;
  // Two-point properties (optional, only used when connectionType is 'two-point')
  public pointA?: {
    initialPosition: number;
    stepSize: number;
  };
  public pointB?: {
    relativeOffset: number;
    stepSize: number;
  };
  public maxIterations?: number;  // Optional: limit pattern iterations for partial designs
  public color: {
    type: 'solid' | 'gradient';
    primary: string;
    secondary?: string;
    alpha: number;
  };
  public lineWidth: number;

  constructor(data: LayerData | TwoPointLayerData) {
    this.id = data.id;
    this.name = data.name;
    this.visible = data.visible;
    this.connectionType = data.connectionType ?? 'single-point';
    
    if (this.connectionType === 'two-point') {
      const twoPointData = data as TwoPointLayerData;
      this.pointA = { ...twoPointData.pointA };
      this.pointB = { ...twoPointData.pointB };
      this.maxIterations = twoPointData.maxIterations;
      // Set default single-point values for backward compatibility
      this.startPoint = twoPointData.pointA.initialPosition;
      this.stepSize = twoPointData.pointA.stepSize;
    } else {
      const singlePointData = data as LayerData;
      this.startPoint = singlePointData.startPoint;
      this.stepSize = singlePointData.stepSize;
    }
    
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
    if (this.connectionType === 'two-point') {
      return new Layer({
        id: Layer.generateId(),
        name: this.name + ' Copy',
        visible: this.visible,
        connectionType: 'two-point',
        pointA: this.pointA ? { ...this.pointA } : { initialPosition: 0, stepSize: 1 },
        pointB: this.pointB ? { ...this.pointB } : { relativeOffset: 1, stepSize: 2 },
        maxIterations: this.maxIterations,
        color: { ...this.color },
        lineWidth: this.lineWidth
      } as TwoPointLayerData);
    } else {
      return new Layer({
        id: Layer.generateId(),
        name: this.name + ' Copy',
        visible: this.visible,
        connectionType: this.connectionType,
        startPoint: this.startPoint,
        stepSize: this.stepSize,
        color: { ...this.color },
        lineWidth: this.lineWidth
      });
    }
  }

  public update(updates: Partial<LayerData | TwoPointLayerData>): Layer {
    // Check if we're updating TO two-point or staying in two-point
    const isUpdatingToTwoPoint = updates.connectionType === 'two-point';
    const isUpdatingToSinglePoint = updates.connectionType === 'single-point';
    const isCurrentlyTwoPoint = this.connectionType === 'two-point';
    
    // If explicitly converting to single-point, use single-point logic
    if (isUpdatingToSinglePoint) {
      const singlePointUpdates = updates as Partial<LayerData>;
      return new Layer({
        id: updates.id ?? this.id,
        name: updates.name ?? this.name,
        visible: updates.visible ?? this.visible,
        connectionType: 'single-point',
        startPoint: singlePointUpdates.startPoint ?? this.startPoint,
        stepSize: singlePointUpdates.stepSize ?? this.stepSize,
        color: updates.color ? { ...this.color, ...updates.color } : { ...this.color },
        lineWidth: updates.lineWidth ?? this.lineWidth
      });
    }
    // If updating to two-point or currently two-point and not explicitly converting
    else if (isUpdatingToTwoPoint || (isCurrentlyTwoPoint && !isUpdatingToSinglePoint)) {
      const twoPointUpdates = updates as Partial<TwoPointLayerData>;
      // If converting from single-point to two-point, use current values as defaults
      const defaultPointA = this.pointA ?? { 
        initialPosition: this.startPoint ?? 0, 
        stepSize: 1 
      };
      const defaultPointB = this.pointB ?? { 
        relativeOffset: 1, 
        stepSize: 2 
      };
      
      return new Layer({
        id: updates.id ?? this.id,
        name: updates.name ?? this.name,
        visible: updates.visible ?? this.visible,
        connectionType: 'two-point',
        pointA: twoPointUpdates.pointA ? { ...defaultPointA, ...twoPointUpdates.pointA } : defaultPointA,
        pointB: twoPointUpdates.pointB ? { ...defaultPointB, ...twoPointUpdates.pointB } : defaultPointB,
        maxIterations: twoPointUpdates.maxIterations !== undefined ? twoPointUpdates.maxIterations : this.maxIterations,
        color: updates.color ? { ...this.color, ...updates.color } : { ...this.color },
        lineWidth: updates.lineWidth ?? this.lineWidth
      } as TwoPointLayerData);
    } else {
      const singlePointUpdates = updates as Partial<LayerData>;
      return new Layer({
        id: updates.id ?? this.id,
        name: updates.name ?? this.name,
        visible: updates.visible ?? this.visible,
        connectionType: updates.connectionType ?? this.connectionType,
        startPoint: singlePointUpdates.startPoint ?? this.startPoint,
        stepSize: singlePointUpdates.stepSize ?? this.stepSize,
        color: updates.color ? { ...this.color, ...updates.color } : { ...this.color },
        lineWidth: updates.lineWidth ?? this.lineWidth
      });
    }
  }

  public validate(maxPoints: number): boolean {
    if (this.connectionType === 'two-point') {
      if (!this.pointA || !this.pointB) return false;
      if (this.pointA.initialPosition < 0 || this.pointA.initialPosition >= maxPoints) return false;
      if (this.pointB.relativeOffset < -(maxPoints - 1) || this.pointB.relativeOffset > (maxPoints - 1)) return false;
      if (this.pointA.stepSize <= 0 || this.pointA.stepSize >= maxPoints) return false;
      if (this.pointB.stepSize <= 0 || this.pointB.stepSize >= maxPoints) return false;
    } else {
      if (this.startPoint < 0 || this.startPoint >= maxPoints) return false;
      if (this.stepSize <= 0 || this.stepSize >= maxPoints) return false;
    }
    
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

// Color system types

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface ColorStop {
  color: string;
  position: number; // 0-1
}

// Color harmony types
export type HarmonyType = 'complementary' | 'triadic' | 'analogous' | 'split-complementary' | 'tetradic';

// Preset palette interface
export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  description?: string;
}

// Color utility functions
export class ColorUtils {
  static hexToRgb(hex: string): RGB | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  static rgbToHex(rgb: RGB): string {
    const toHex = (c: number) => {
      const hex = Math.round(Math.max(0, Math.min(255, c))).toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    };
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  static rgbToHsl(rgb: RGB): HSL {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const sum = max + min;
    
    const l = sum / 2;
    
    if (diff === 0) {
      return { h: 0, s: 0, l: l * 100 };
    }
    
    const s = l > 0.5 ? diff / (2 - sum) : diff / sum;
    
    let h: number;
    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
    
    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  static hslToRgb(hsl: HSL): RGB {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    if (s === 0) {
      const val = Math.round(l * 255);
      return { r: val, g: val, b: val };
    }

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    return {
      r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
    };
  }

  static hexToHsl(hex: string): HSL | null {
    const rgb = this.hexToRgb(hex);
    return rgb ? this.rgbToHsl(rgb) : null;
  }

  static hslToHex(hsl: HSL): string {
    const rgb = this.hslToRgb(hsl);
    return this.rgbToHex(rgb);
  }

  static interpolateColor(color1: string, color2: string, t: number): string {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return color1;
    
    const clamp = (val: number) => Math.max(0, Math.min(255, val));
    
    const interpolatedRgb: RGB = {
      r: clamp(rgb1.r + (rgb2.r - rgb1.r) * t),
      g: clamp(rgb1.g + (rgb2.g - rgb1.g) * t),
      b: clamp(rgb1.b + (rgb2.b - rgb1.b) * t)
    };
    
    return this.rgbToHex(interpolatedRgb);
  }

  static generateColorHarmony(baseColor: string, type: HarmonyType): string[] {
    const hsl = this.hexToHsl(baseColor);
    if (!hsl) return [baseColor];
    
    const colors = [baseColor];
    
    switch (type) {
      case 'complementary':
        colors.push(this.hslToHex({ ...hsl, h: (hsl.h + 180) % 360 }));
        break;
      
      case 'triadic':
        colors.push(this.hslToHex({ ...hsl, h: (hsl.h + 120) % 360 }));
        colors.push(this.hslToHex({ ...hsl, h: (hsl.h + 240) % 360 }));
        break;
      
      case 'analogous':
        colors.push(this.hslToHex({ ...hsl, h: (hsl.h + 30) % 360 }));
        colors.push(this.hslToHex({ ...hsl, h: (hsl.h - 30 + 360) % 360 }));
        break;
      
      case 'split-complementary':
        colors.push(this.hslToHex({ ...hsl, h: (hsl.h + 150) % 360 }));
        colors.push(this.hslToHex({ ...hsl, h: (hsl.h + 210) % 360 }));
        break;
      
      case 'tetradic':
        colors.push(this.hslToHex({ ...hsl, h: (hsl.h + 90) % 360 }));
        colors.push(this.hslToHex({ ...hsl, h: (hsl.h + 180) % 360 }));
        colors.push(this.hslToHex({ ...hsl, h: (hsl.h + 270) % 360 }));
        break;
    }
    
    return colors;
  }
}

// Palette categories
export interface PaletteCategory {
  id: string;
  name: string;
  palettes: ColorPalette[];
}

// Expanded preset palettes organized by category
export const PALETTE_CATEGORIES: PaletteCategory[] = [
  {
    id: 'traditional',
    name: 'Traditional',
    palettes: [
      {
        id: 'japanese-zen',
        name: 'Japanese Zen',
        colors: ['#D4AF37', '#8B4513'],
        description: 'Serene gold and deep brown harmony'
      },
      {
        id: 'chinese-ink',
        name: 'Chinese Ink',
        colors: ['#2F4F4F', '#DC143C'],
        description: 'Elegant slate and vermillion red'
      },
      {
        id: 'indian-spice',
        name: 'Indian Spice',
        colors: ['#FF6347', '#DAA520'],
        description: 'Warm turmeric and saffron tones'
      },
      {
        id: 'tibetan-prayer',
        name: 'Tibetan Prayer',
        colors: ['#8B0000', '#FFD700'],
        description: 'Deep maroon and sacred gold'
      },
      {
        id: 'persian-carpet',
        name: 'Persian Carpet',
        colors: ['#8B0000', '#191970'],
        description: 'Rich crimson and royal blue'
      },
      {
        id: 'arabic-gold',
        name: 'Arabic Gold',
        colors: ['#FFD700', '#2E8B57'],
        description: 'Desert gold and emerald green'
      },
      {
        id: 'aztec-sun',
        name: 'Aztec Sun',
        colors: ['#FF4500', '#8B4513'],
        description: 'Blazing orange and earth brown'
      },
      {
        id: 'african-earth',
        name: 'African Earth',
        colors: ['#CD853F', '#8B0000'],
        description: 'Sandy beige and deep rust'
      },
      {
        id: 'celtic-forest',
        name: 'Celtic Forest',
        colors: ['#228B22', '#DAA520'],
        description: 'Forest green and ancient gold'
      },
      {
        id: 'byzantine-purple',
        name: 'Byzantine Purple',
        colors: ['#4B0082', '#FFD700'],
        description: 'Imperial purple and golden glory'
      },
      {
        id: 'mayan-jade',
        name: 'Mayan Jade',
        colors: ['#00CED1', '#8B4513'],
        description: 'Sacred turquoise and earth brown'
      },
      {
        id: 'nordic-runes',
        name: 'Nordic Runes',
        colors: ['#4682B4', '#C0C0C0'],
        description: 'Steel blue and silver wisdom'
      }
    ]
  },
  {
    id: 'nature',
    name: 'Nature',
    palettes: [
      {
        id: 'forest-canopy',
        name: 'Forest Canopy',
        colors: ['#228B22', '#ADFF2F'],
        description: 'Deep forest and bright lime green'
      },
      {
        id: 'ocean-depths',
        name: 'Ocean Depths',
        colors: ['#000080', '#87CEEB'],
        description: 'Navy blue to sky blue depths'
      },
      {
        id: 'desert-sunset',
        name: 'Desert Sunset',
        colors: ['#FF4500', '#FFD700'],
        description: 'Blazing orange to golden sun'
      },
      {
        id: 'cherry-blossom',
        name: 'Cherry Blossom',
        colors: ['#FFB6C1', '#FF1493'],
        description: 'Soft pink to deep magenta bloom'
      },
      {
        id: 'autumn-leaves',
        name: 'Autumn Leaves',
        colors: ['#8B4513', '#F4A460'],
        description: 'Rich brown to sandy autumn'
      },
      {
        id: 'arctic-ice',
        name: 'Arctic Ice',
        colors: ['#F0F8FF', '#4682B4'],
        description: 'Pure ice white to steel blue'
      },
      {
        id: 'coral-reef',
        name: 'Coral Reef',
        colors: ['#FF7F50', '#00CED1'],
        description: 'Coral orange to turquoise sea'
      },
      {
        id: 'mountain-mist',
        name: 'Mountain Mist',
        colors: ['#708090', '#F5F5DC'],
        description: 'Slate grey to misty beige'
      },
      {
        id: 'prairie-gold',
        name: 'Prairie Gold',
        colors: ['#DAA520', '#F0E68C'],
        description: 'Golden rod to khaki grass'
      },
      {
        id: 'volcanic-fire',
        name: 'Volcanic Fire',
        colors: ['#8B0000', '#FF6347'],
        description: 'Deep maroon to fiery tomato'
      },
      {
        id: 'bamboo-grove',
        name: 'Bamboo Grove',
        colors: ['#6B8E23', '#98FB98'],
        description: 'Olive green to pale mint'
      },
      {
        id: 'lavender-field',
        name: 'Lavender Field',
        colors: ['#9370DB', '#E6E6FA'],
        description: 'Rich purple to soft lavender'
      }
    ]
  },
  {
    id: 'modern',
    name: 'Modern',
    palettes: [
      {
        id: 'neon-nights',
        name: 'Neon Nights',
        colors: ['#FF00FF', '#00FFFF'],
        description: 'Electric magenta and cyan pulse'
      },
      {
        id: 'minimalist',
        name: 'Minimalist',
        colors: ['#2C3E50', '#ECF0F1'],
        description: 'Sophisticated charcoal and light grey'
      },
      {
        id: 'pastel-dream',
        name: 'Pastel Dream',
        colors: ['#FFB6C1', '#E6E6FA'],
        description: 'Gentle rose and lavender mist'
      },
      {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        colors: ['#FF0080', '#00FFFF'],
        description: 'Hot pink and electric cyan clash'
      },
      {
        id: 'corporate',
        name: 'Corporate',
        colors: ['#003366', '#4682B4'],
        description: 'Professional navy and steel blue'
      },
      {
        id: 'art-deco',
        name: 'Art Deco',
        colors: ['#FFD700', '#000000'],
        description: 'Glamorous gold and jet black'
      },
      {
        id: 'scandinavian',
        name: 'Scandinavian',
        colors: ['#F5F5DC', '#2F4F4F'],
        description: 'Warm beige and dark slate grey'
      },
      {
        id: 'urban-concrete',
        name: 'Urban Concrete',
        colors: ['#696969', '#D3D3D3'],
        description: 'Industrial grey tones'
      },
      {
        id: 'electric-blue',
        name: 'Electric Blue',
        colors: ['#0080FF', '#FFFF00'],
        description: 'Brilliant blue and neon yellow'
      },
      {
        id: 'monochrome',
        name: 'Monochrome',
        colors: ['#000000', '#FFFFFF'],
        description: 'Pure black and white contrast'
      },
      {
        id: 'retro-wave',
        name: 'Retro Wave',
        colors: ['#FF1493', '#9370DB'],
        description: 'Deep pink and medium orchid'
      },
      {
        id: 'industrial',
        name: 'Industrial',
        colors: ['#B22222', '#708090'],
        description: 'Fire brick and slate grey'
      }
    ]
  },
  {
    id: 'gemstone',
    name: 'Gemstone',
    palettes: [
      {
        id: 'emerald-depths',
        name: 'Emerald Depths',
        colors: ['#50C878', '#006400'],
        description: 'Brilliant emerald to deep forest'
      },
      {
        id: 'sapphire-blues',
        name: 'Sapphire Blues',
        colors: ['#0F52BA', '#191970'],
        description: 'Royal sapphire to midnight blue'
      },
      {
        id: 'ruby-fire',
        name: 'Ruby Fire',
        colors: ['#E0115F', '#8B0000'],
        description: 'Bright ruby to deep wine red'
      },
      {
        id: 'amethyst-dreams',
        name: 'Amethyst Dreams',
        colors: ['#9966CC', '#4B0082'],
        description: 'Medium orchid to deep indigo'
      },
      {
        id: 'golden-topaz',
        name: 'Golden Topaz',
        colors: ['#FFD700', '#B8860B'],
        description: 'Pure gold to dark golden rod'
      },
      {
        id: 'turquoise-sky',
        name: 'Turquoise Sky',
        colors: ['#40E0D0', '#008B8B'],
        description: 'Bright turquoise to dark cyan'
      },
      {
        id: 'garnet-deep',
        name: 'Garnet Deep',
        colors: ['#722F37', '#B22222'],
        description: 'Dark burgundy to fire brick'
      },
      {
        id: 'opal-rainbow',
        name: 'Opal Rainbow',
        colors: ['#FFEFD5', '#DA70D6'],
        description: 'Papaya whip to medium orchid'
      },
      {
        id: 'peridot-green',
        name: 'Peridot Green',
        colors: ['#9ACD32', '#228B22'],
        description: 'Yellow green to forest green'
      },
      {
        id: 'moonstone-glow',
        name: 'Moonstone Glow',
        colors: ['#F8F8FF', '#4169E1'],
        description: 'Ghost white to royal blue'
      },
      {
        id: 'citrine-sun',
        name: 'Citrine Sun',
        colors: ['#E4D00A', '#FF8C00'],
        description: 'Bright yellow to dark orange'
      },
      {
        id: 'aquamarine-sea',
        name: 'Aquamarine Sea',
        colors: ['#7FFFD4', '#006666'],
        description: 'Light aqua to dark teal'
      }
    ]
  },
  {
    id: 'seasonal',
    name: 'Seasonal',
    palettes: [
      {
        id: 'spring-awakening',
        name: 'Spring Awakening',
        colors: ['#98FB98', '#32CD32'],
        description: 'Fresh spring green and lime'
      },
      {
        id: 'summer-warmth',
        name: 'Summer Warmth',
        colors: ['#FFD700', '#FF6347'],
        description: 'Golden sun and warm terracotta'
      },
      {
        id: 'autumn-harvest',
        name: 'Autumn Harvest',
        colors: ['#D2691E', '#8B4513'],
        description: 'Burnt orange and rich brown'
      },
      {
        id: 'winter-frost',
        name: 'Winter Frost',
        colors: ['#4682B4', '#F0F8FF'],
        description: 'Steel blue and icy white'
      },
      {
        id: 'monsoon',
        name: 'Monsoon',
        colors: ['#2F4F4F', '#87CEEB'],
        description: 'Dark slate and sky blue'
      },
      {
        id: 'tropical-storm',
        name: 'Tropical Storm',
        colors: ['#008080', '#FFFF00'],
        description: 'Teal depth and lightning yellow'
      },
      {
        id: 'golden-hour',
        name: 'Golden Hour',
        colors: ['#FF8C00', '#FFEFD5'],
        description: 'Dark orange to papaya whip'
      },
      {
        id: 'northern-lights',
        name: 'Northern Lights',
        colors: ['#00FF7F', '#9370DB'],
        description: 'Spring green and medium purple'
      },
      {
        id: 'sunset-glow',
        name: 'Sunset Glow',
        colors: ['#DC143C', '#FFD700'],
        description: 'Crimson to golden sunset'
      },
      {
        id: 'morning-dew',
        name: 'Morning Dew',
        colors: ['#F0F8FF', '#98FB98'],
        description: 'Alice blue to pale green'
      },
      {
        id: 'starlit-night',
        name: 'Starlit Night',
        colors: ['#191970', '#FFD700'],
        description: 'Midnight blue and gold stars'
      },
      {
        id: 'forest-twilight',
        name: 'Forest Twilight',
        colors: ['#4B0082', '#228B22'],
        description: 'Indigo dusk and forest green'
      }
    ]
  }
];

// Flatten all palettes for backward compatibility
export const DEFAULT_PALETTES: ColorPalette[] = PALETTE_CATEGORIES.flatMap(category => category.palettes);