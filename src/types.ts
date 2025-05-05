// --- src/types.ts ---
// Contains shared type definitions for the Obsidian Python Bridge plugin.

// Type for dropdown options in settings
export type DropdownOption = string | { value: string; display: string };

// Definition for a single setting discovered from a Python script
export interface ScriptSettingDefinition {
	key: string;
	type: "text" | "textarea" | "number" | "toggle" | "dropdown" | "slider";
	label: string;
	description: string;
	default: any;
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
	/** Cache of settings definitions discovered from Python scripts. Key: relative script path */
	scriptSettingsDefinitions: Record<string, ScriptSettingDefinition[]>;
	/** User-configured values for script settings. Key: relative script path, Value: { settingKey: value } */
	scriptSettingsValues: Record<string, Record<string, any>>;
	/** User-configured activation status for scripts. Key: relative script path, Value: boolean (true=active, false=inactive) */
	scriptActivationStatus: Record<string, boolean>;
	/** User-configured auto-start status for scripts. Key: relative script path, Value: boolean (true=auto-start) */
	scriptAutoStartStatus: Record<string, boolean>;
	/** User-configured auto-start delay (in seconds) for scripts. Key: relative script path, Value: number */
	scriptAutoStartDelay: Record<string, number>;
}

// Structure for JSON responses sent TO the Python client
export interface JsonResponse {
	status: "success" | "error";
	data?: any;
	error?: string;
}

// Structure for JSON requests received FROM the Python client
export interface JsonRequest {
	action: string;
	payload?: any;
}
