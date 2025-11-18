// --- src/types.ts ---
// Contains shared type definitions for the Obsidian Python Bridge plugin.

// Type for dropdown options in settings
export type DropdownOption = string | { value: string; display: string };

// Definition for a single setting discovered from a Python script
export interface ScriptSettingDefinition {
  key: string;
  type: 'text' | 'textarea' | 'number' | 'toggle' | 'dropdown' | 'slider';
  label: string;
  description: string;
  default: string | number | boolean;
  options?: DropdownOption[]; // Only used for 'dropdown' type
  min?: number; // Used for 'number' and 'slider' types
  max?: number; // Used for 'number' and 'slider' types
  step?: number; // Used for 'number' and 'slider' types
}

// Structure for the plugin's overall settings
export interface PythonBridgeSettings {
  pythonScriptsFolder: string;
  httpPort: number;
  disablePyCache: boolean;
  pluginLanguage: string;
  pythonExecutablePath: string; // Path to custom Python/uv executable
  /** Cache of settings definitions discovered from Python scripts. Key: relative script path */
  scriptSettingsDefinitions: Record<string, ScriptSettingDefinition[]>;
  /** User-configured values for script settings. Key: relative script path, Value: { settingKey: value } */
  scriptSettingsValues: Record<
    string,
    Record<string, string | number | boolean>
  >;
  /** User-configured activation status for scripts. Key: relative script path, Value: boolean (true=active, false=inactive) */
  scriptActivationStatus: Record<string, boolean>;
  /** User-configured auto-start status for scripts. Key: relative script path, Value: boolean (true=auto-start) */
  scriptAutoStartStatus: Record<string, boolean>;
  /** User-configured auto-start delay (in seconds) for scripts. Key: relative script path, Value: number */
  scriptAutoStartDelay: Record<string, number>;
  autoSetPYTHONPATH: boolean; // Setting to control automatic PYTHONPATH modification
  /** Audit log settings */
  auditLog: {
    enabled: boolean;
    logFilePath?: string;
    maxLogFileSize?: number; // in bytes
    maxLogFiles?: number;
  };
}

// Structure for JSON responses sent TO the Python client
export interface JsonResponse {
  status: 'success' | 'error';
  data?: unknown;
  error?: string;
}

// Structure for JSON requests received FROM the Python client
export interface JsonRequest {
  action: string;
  payload?: {
    absolute?: boolean; // For get_all_note_paths
    return_format?: string; // For get_active_note_content
    // Add other potential payload structures here as a union if they become more defined
    [key: string]: unknown; // Allow other arbitrary keys for now
  };
}

// Audit log entry structure
export interface AuditLogEntry {
  timestamp: string;
  type: 'script_execution' | 'api_action';
  action?: string;
  scriptName?: string;
  triggerType?: string;
  exitCode?: number;
  status?: 'success' | 'error';
  error?: string;
  sourceScript?: string;
}
