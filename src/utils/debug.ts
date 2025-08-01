// Development debug utilities for Strala
import { 
  SCHEMA_VERSION, 
  inspectStorage,
  STORAGE_KEYS 
} from './persistence';

export interface StralaDebugInterface {
  currentSchema: number;
  clearCache: () => void;
  clearAllVersions: () => void;
  forceSchemaUpdate: () => void;
  inspectStorage: () => any;
  exportState: () => string;
  importState: (data: string) => boolean;
  help: () => void;
}

// Debug utilities implementation
const createStralaDebug = (): StralaDebugInterface => ({
  currentSchema: SCHEMA_VERSION,
  
  clearCache: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log(`🧹 Cleared current version (v${SCHEMA_VERSION}) cache`);
      console.log('ℹ️ Refresh the page to see default state');
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
    }
  },
  
  clearAllVersions: () => {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('strala')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`🧹 Cleared ${keysToRemove.length} Strala storage entries across all versions`);
      console.log('ℹ️ Refresh the page to see default state');
    } catch (error) {
      console.error('❌ Failed to clear all versions:', error);
    }
  },
  
  forceSchemaUpdate: () => {
    try {
      localStorage.setItem(STORAGE_KEYS.schema, SCHEMA_VERSION.toString());
      console.log(`🔄 Force updated schema version to v${SCHEMA_VERSION}`);
    } catch (error) {
      console.error('❌ Failed to update schema:', error);
    }
  },
  
  inspectStorage: () => {
    try {
      const inspection = inspectStorage();
      console.log('🔍 Strala Storage Inspection:');
      console.table(inspection);
      return inspection;
    } catch (error) {
      console.error('❌ Failed to inspect storage:', error);
      return null;
    }
  },
  
  exportState: () => {
    try {
      const state: { [key: string]: any } = {};
      
      Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            state[name] = JSON.parse(value);
          } catch {
            state[name] = value;
          }
        }
      });
      
      const exportData = JSON.stringify({
        version: SCHEMA_VERSION,
        timestamp: new Date().toISOString(),
        state
      }, null, 2);
      
      console.log('📤 Current state exported:');
      console.log(exportData);
      
      // Copy to clipboard if available
      if (navigator.clipboard) {
        navigator.clipboard.writeText(exportData).then(() => {
          console.log('📋 State copied to clipboard');
        }).catch(() => {
          console.log('⚠️ Could not copy to clipboard');
        });
      }
      
      return exportData;
    } catch (error) {
      console.error('❌ Failed to export state:', error);
      return '';
    }
  },
  
  importState: (data: string) => {
    try {
      const importData = JSON.parse(data);
      
      if (!importData.version || !importData.state) {
        console.error('❌ Invalid import data format');
        return false;
      }
      
      console.log(`📥 Importing state from v${importData.version}...`);
      
      // Import each piece of state
      Object.entries(importData.state).forEach(([name, value]) => {
        const key = STORAGE_KEYS[name as keyof typeof STORAGE_KEYS];
        if (key && value) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      });
      
      console.log('✅ State imported successfully');
      console.log('ℹ️ Refresh the page to see imported state');
      return true;
    } catch (error) {
      console.error('❌ Failed to import state:', error);
      return false;
    }
  },
  
  help: () => {
    console.log(`
🛠️ Strala Debug Utilities (Schema v${SCHEMA_VERSION})

Available commands:
• StralaDebug.currentSchema     - Show current schema version
• StralaDebug.clearCache()      - Clear current version data
• StralaDebug.clearAllVersions() - Clear all Strala data
• StralaDebug.forceSchemaUpdate() - Force schema version update
• StralaDebug.inspectStorage()  - Inspect localStorage contents
• StralaDebug.exportState()     - Export current state (copies to clipboard)
• StralaDebug.importState(data) - Import state from JSON string
• StralaDebug.help()           - Show this help

Example usage:
  StralaDebug.exportState()     // Export and copy to clipboard
  StralaDebug.clearCache()      // Clear current data
  StralaDebug.inspectStorage()  // See what's stored
    `);
  }
});

// Install debug utilities on window object (development only)
export const installDebugUtilities = () => {
  if (typeof window !== 'undefined') {
    (window as any).StralaDebug = createStralaDebug();
    
    // Show welcome message
    console.log(`
🚀 Strala Debug Utilities (v${SCHEMA_VERSION}) loaded!
Type 'StralaDebug.help()' in console for available commands.
    `);
  }
};

// Auto-install utilities
installDebugUtilities();