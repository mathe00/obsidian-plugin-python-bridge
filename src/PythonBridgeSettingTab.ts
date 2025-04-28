// --- src/PythonBridgeSettingTab.ts ---
import { App, PluginSettingTab, Setting } from 'obsidian';
import ObsidianPythonBridge from './main'; // Adjust path as needed

// Plugin settings tab
export default class PythonBridgeSettingTab extends PluginSettingTab {
    plugin: ObsidianPythonBridge;

    constructor(app: App, plugin: ObsidianPythonBridge) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();
        containerEl.createEl('h2', { text: 'Obsidian Python Bridge Settings' });

        // Setting for Python Scripts Folder
        new Setting(containerEl)
            .setName('Python Scripts Folder')
            .setDesc('Path to the folder containing your Python scripts (absolute or relative to the vault).')
            .addText((text) =>
                text
                    .setPlaceholder('/path/to/your/scripts or ./scripts-python')
                    .setValue(this.plugin.settings.pythonScriptsFolder)
                    .onChange(async (value) => {
                        this.plugin.settings.pythonScriptsFolder = value.trim(); // Trim whitespace
                        await this.plugin.saveSettings();
                    })
            );

        // Setting for HTTP Server Port
        new Setting(containerEl)
            .setName('HTTP Server Port')
            .setDesc('Port for the local HTTP server (1024-65535). Requires restart or settings save to apply.')
            .addText((text) =>
                text
                    .setPlaceholder(String(27123)) // Default port placeholder
                    .setValue(String(this.plugin.settings.httpPort)) // Store as number, display as string
                    .onChange(async (value) => {
                        const port = parseInt(value, 10);
                        if (!isNaN(port) && port > 1023 && port <= 65535) {
                            this.plugin.settings.httpPort = port;
                            await this.plugin.saveSettings();
                            // Optionally add visual feedback for valid input
                            text.inputEl.style.borderColor = ""; // Reset border
                        } else {
                            // Optionally add visual feedback for invalid input
                            text.inputEl.style.borderColor = "red";
                            // Do not save invalid port
                            console.warn(`Invalid port entered: ${value}. Must be between 1024 and 65535.`);
                            // Optionally show a notice, but might be annoying during typing
                            // new Notice("Invalid port number. Please enter a value between 1024 and 65535.");
                        }
                    })
            );

        // Setting to disable Python cache (__pycache__)
        new Setting(containerEl)
            .setName('Disable Python Cache (__pycache__)')
            .setDesc('Run Python with the "-B" flag to prevent writing .pyc files.')
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.disablePyCache)
                    .onChange(async (value) => {
                        this.plugin.settings.disablePyCache = value;
                        await this.plugin.saveSettings();
                    })
            );

        // Optional: Add a button to test connection? (More complex)
        // new Setting(containerEl)
        //     .setName('Test Connection')
        //     .setDesc('Attempt to connect to the running server.')
        //     .addButton(button => button
        //         .setButtonText('Test')
        //         .onClick(async () => {
        //             // Logic to send a test request (e.g., a 'ping' action)
        //             // Would likely require adding a 'ping' action to handleAction
        //             // and calling it from the Python client library's test method.
        //             new Notice('Test functionality not yet implemented.');
        //         }));
    }
}
