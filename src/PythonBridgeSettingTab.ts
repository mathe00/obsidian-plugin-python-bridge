import { App, PluginSettingTab, Setting } from 'obsidian';
import ObsidianPythonBridge from './main';

// Plugin settings
export default class PythonBridgeSettingTab extends PluginSettingTab {
    plugin: ObsidianPythonBridge;

    constructor(app: App, plugin: ObsidianPythonBridge) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();
        containerEl.createEl('h2', { text: 'Obsidian Python Bridge Plugin Settings' });

        new Setting(containerEl)
            .setName('Python Scripts Folder')
            .setDesc('Path to the folder containing your Python scripts (absolute or relative to the vault).')
            .addText((text) =>
                text
                    .setPlaceholder('/path/to/your/scripts or ./scripts-python')
                    .setValue(this.plugin.settings.pythonScriptsFolder)
                    .onChange(async (value) => {
                        this.plugin.settings.pythonScriptsFolder = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName('Unix Socket Path')
            .setDesc('Path to the Unix socket file (default: /tmp/obsidian-python.sock).')
            .addText((text) =>
                text
                    .setPlaceholder('/tmp/obsidian-python.sock')
                    .setValue(this.plugin.settings.socketPath)
                    .onChange(async (value) => {
                        this.plugin.settings.socketPath = value;
                        await this.plugin.saveSettings();
                    })
            );

        // New option to disable Python cache (__pycache__)
        new Setting(containerEl)
            .setName('Disable Python Cache (__pycache__)')
            .setDesc('Disable the generation of __pycache__ files when running Python scripts.')
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.disablePyCache)
                    .onChange(async (value) => {
                        this.plugin.settings.disablePyCache = value;
                        await this.plugin.saveSettings();
                    })
            );
    }
}
