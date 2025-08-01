// Schema-based versioning and persistence utilities for Strala
export const SCHEMA_VERSION = 3; // React migration = v3
export const CACHE_KEY_PREFIX = `strala-v${SCHEMA_VERSION}`;

// Storage keys
export const STORAGE_KEYS = {
  config: `${CACHE_KEY_PREFIX}-config`,
  layers: `${CACHE_KEY_PREFIX}-layers`,
  activeLayer: `${CACHE_KEY_PREFIX}-active-layer`,
  schema: `${CACHE_KEY_PREFIX}-schema`
} as const;

// Legacy data structure interfaces for migrations
interface LegacyLayer {
  id: string;
  name: string;
  visible: boolean;
  startPoint: number;
  stepSize: number;
  color: string;
  alpha: number;
  lineWidth: number;
}

interface V1Layer extends LegacyLayer {
  connectionType?: 'single-point' | 'two-point';
  pointA?: { initialPosition: number; stepSize: number };
  pointB?: { relativeOffset: number; stepSize: number };
  iterations?: number;
}

interface V2Layer extends Omit<V1Layer, 'color'> {
  color: {
    type: 'solid' | 'gradient';
    primary: string;
    secondary?: string;
    alpha: number;
  };
}

// Current layer interface (v3)
export interface CurrentLayer {
  id: string;
  name: string;
  visible: boolean;
  connectionType: 'single-point' | 'two-point';
  startPoint: number;
  stepSize: number;
  color: {
    type: 'solid' | 'gradient';
    primary: string;
    secondary?: string;
    alpha: number;
  };
  lineWidth: number;
  pointA: {
    initialPosition: number;
    stepSize: number;
  };
  pointB: {
    relativeOffset: number;
    stepSize: number;
  };
  iterations: number;
}

// Migration functions
const migrateLegacyToV1 = (legacyData: any): any => {
  if (!legacyData || !Array.isArray(legacyData.layers)) {
    return null;
  }

  return {
    ...legacyData,
    layers: legacyData.layers.map((layer: LegacyLayer) => ({
      ...layer,
      connectionType: 'single-point' as const,
      pointA: {
        initialPosition: 0,
        stepSize: 7
      },
      pointB: {
        relativeOffset: 12,
        stepSize: 7
      },
      iterations: 24
    }))
  };
};

const migrateV1ToV2 = (v1Data: any): any => {
  if (!v1Data || !Array.isArray(v1Data.layers)) {
    return null;
  }

  return {
    ...v1Data,
    layers: v1Data.layers.map((layer: V1Layer) => ({
      ...layer,
      color: {
        type: 'solid' as const,
        primary: typeof layer.color === 'string' ? layer.color : '#3b82f6',
        alpha: layer.alpha || 0.7
      }
    }))
  };
};

const migrateV2ToV3 = (v2Data: any): any => {
  // V2 to V3 is primarily architectural (Svelte → React)
  // Data structure remains the same, just ensure all required fields exist
  if (!v2Data || !Array.isArray(v2Data.layers)) {
    return null;
  }

  return {
    ...v2Data,
    layers: v2Data.layers.map((layer: V2Layer) => ({
      id: layer.id || `layer-${Date.now()}-${Math.random()}`,
      name: layer.name || 'Layer',
      visible: layer.visible !== false,
      connectionType: layer.connectionType || 'single-point',
      startPoint: layer.startPoint || 0,
      stepSize: layer.stepSize || 5,
      color: {
        type: layer.color?.type || 'solid',
        primary: layer.color?.primary || '#3b82f6',
        secondary: layer.color?.secondary,
        alpha: layer.color?.alpha || 0.7
      },
      lineWidth: layer.lineWidth || 1,
      pointA: layer.pointA || {
        initialPosition: 0,
        stepSize: 7
      },
      pointB: layer.pointB || {
        relativeOffset: 12,
        stepSize: 7
      },
      iterations: layer.iterations || 24
    }))
  };
};

// Migration chain
const migrations = {
  1: migrateLegacyToV1,
  2: migrateV1ToV2,
  3: migrateV2ToV3
} as const;

// Auto-migration system
export const migrateData = (data: any, fromVersion: number): any => {
  let migratedData = data;
  
  // Apply migrations sequentially
  for (let version = fromVersion + 1; version <= SCHEMA_VERSION; version++) {
    const migrationFn = migrations[version as keyof typeof migrations];
    if (migrationFn) {
      const result = migrationFn(migratedData);
      if (result !== null) {
        migratedData = result;
      }
    }
  }

  return migratedData;
};

// Storage utilities
export const clearOldVersions = () => {
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('strala-') && !key.startsWith(CACHE_KEY_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  console.log(`🧹 Cleaned up ${keysToRemove.length} old Strala cache entries`);
};

// Detect and migrate legacy data
export const detectAndMigrateLegacyData = (): any => {
  // Check for data from previous versions
  for (let version = 1; version < SCHEMA_VERSION; version++) {
    const oldKey = `strala-v${version}-layers`;
    const oldData = localStorage.getItem(oldKey);
    
    if (oldData) {
      try {
        const parsedData = JSON.parse(oldData);
        console.log(`🔄 Found v${version} data, migrating to v${SCHEMA_VERSION}...`);
        
        const migratedData = migrateData(parsedData, version);
        
        if (migratedData) {
          console.log(`✅ Successfully migrated data from v${version} to v${SCHEMA_VERSION}`);
          clearOldVersions(); // Clean up after successful migration
          return migratedData;
        }
      } catch (error) {
        console.warn(`⚠️ Failed to migrate v${version} data:`, error);
      }
    }
  }
  
  // Check for legacy data (pre-versioning)
  const legacyKeys = ['layers', 'config', 'activeLayerId'];
  const legacyData: any = {};
  let hasLegacyData = false;
  
  legacyKeys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        legacyData[key] = JSON.parse(data);
        hasLegacyData = true;
      } catch (error) {
        console.warn(`⚠️ Failed to parse legacy ${key} data:`, error);
      }
    }
  });
  
  if (hasLegacyData) {
    console.log('🔄 Found legacy data, migrating to v3...');
    const migratedData = migrateData(legacyData, 0);
    
    if (migratedData) {
      console.log('✅ Successfully migrated legacy data to v3');
      // Clean up legacy keys
      legacyKeys.forEach(key => localStorage.removeItem(key));
      return migratedData;
    }
  }
  
  return null;
};

// Set schema version in localStorage
export const setSchemaVersion = () => {
  localStorage.setItem(STORAGE_KEYS.schema, SCHEMA_VERSION.toString());
};

// Get current schema version from localStorage
export const getStoredSchemaVersion = (): number => {
  const stored = localStorage.getItem(STORAGE_KEYS.schema);
  return stored ? parseInt(stored, 10) : 0;
};

// Storage inspection utility
export const inspectStorage = () => {
  const stralaKeys: { [key: string]: string } = {};
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('strala')) {
      const value = localStorage.getItem(key);
      stralaKeys[key] = value ? `${Math.round(value.length / 1024)}KB` : '0KB';
    }
  }
  
  return {
    currentSchema: SCHEMA_VERSION,
    storedSchema: getStoredSchemaVersion(),
    keys: stralaKeys,
    total: Object.keys(stralaKeys).length
  };
};