import { App, Notice, Plugin, PluginSettingTab, Setting, TFile, MarkdownView, SuggestModal, FileSystemAdapter } from 'obsidian';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as net from 'net'; // Use the net module for Unix sockets
import * as path from 'path'; // Import the path module to manipulate paths
import moment from 'moment'; // Use moment.js to handle dates

interface PythonBridgeSettings {
    pythonScriptsFolder: string;
    socketPath: string;
    disablePyCache: boolean;  // New option to disable Python cache
}


const DEFAULT_SETTINGS: PythonBridgeSettings = {
    pythonScriptsFolder: '',
    socketPath: '/tmp/obsidian-python.sock',
    disablePyCache: true  // Disable Python cache by default
};


// Function to detect the type of value and convert it
function convertFrontmatterValue(value: any): any {
    if (Array.isArray(value)) {
        // If it's a list, keep the list as is
        return value.map(v => convertFrontmatterValue(v)); // Recursive conversion for lists
    } else if (typeof value === 'string') {
        // If it's a string, try to detect if it's a date or datetime
        if (moment(value, moment.ISO_8601, true).isValid()) {
            if (value.length === 10) {
                // If the string length is 10, it's a date without time
                return value; // Format date "YYYY-MM-DD"
            } else {
                // Otherwise, it's a datetime with time
                return value; // Format datetime "YYYY-MM-DDTHH:mm:ss"
            }
        } else {
            return value; // Otherwise, it's plain text
        }
    } else if (typeof value === 'boolean') {
        // If it's a boolean (checkbox)
        return value;
    } else if (typeof value === 'number') {
        // If it's a number
        return value;
    } else {
        return value; // In all other cases, keep the value as is
    }
}



export default class ObsidianPythonBridge extends Plugin {
    settings!: PythonBridgeSettings;
    server: net.Server | null = null;

    async onload() {
        console.log('Loading the Obsidian Python Bridge plugin');

        // Load settings
        await this.loadSettings();

        // Add a settings tab
        this.addSettingTab(new PythonBridgeSettingTab(this.app, this));

        // Add a command to run a specific Python script
        this.addCommand({
            id: 'run-specific-python-script',
            name: 'Run a specific Python script',
            callback: () => this.chooseAndRunPythonScript(),
        });

        // Add a command to run all Python scripts
        this.addCommand({
            id: 'run-all-python-scripts',
            name: 'Run all Python scripts',
            callback: () => this.runAllPythonScripts(),
        });

        // Start the Unix Socket server
        this.startUnixSocketServer();
    }

    // Unix Socket server to receive requests from Python
    startUnixSocketServer() {
        if (fs.existsSync(this.settings.socketPath)) {
            fs.unlinkSync(this.settings.socketPath); // Remove the old socket if present
        }

        this.server = net.createServer((connection) => {
            connection.on('data', async (data) => {
                try {
                    const request = JSON.parse(data.toString());

                    // Handle different actions from Python requests
                    if (request.action === 'get_active_note_content') {
                        const content = await this.getActiveNoteContent();
                        connection.write(JSON.stringify({ content }));

                    } else if (request.action === 'get_active_note_absolute_path') {
                        const absolutePath = this.getActiveNoteAbsolutePath();
                        connection.write(JSON.stringify({ absolutePath }));

                    } else if (request.action === 'get_active_note_relative_path') {
                        const relativePath = this.getActiveNoteRelativePath();
                        connection.write(JSON.stringify({ relativePath }));

                    } else if (request.action === 'get_active_note_title') {
                        const title = this.getActiveNoteTitle();
                        connection.write(JSON.stringify({ title }));

                    } else if (request.action === 'get_current_vault_absolute_path') {
                        const vaultPath = this.getCurrentVaultAbsolutePath();
                        connection.write(JSON.stringify({ vaultPath }));

                    } else if (request.action === 'show_notification') {
                        new Notice(request.text_for_notif);
                        connection.write(JSON.stringify({ status: 'notification sent' }));

                    } else if (request.action === 'get_frontmatter') {
                        // Get the frontmatter of the active note
                        const frontmatterData = await this.getActiveNoteFrontmatter();
                        connection.write(JSON.stringify(frontmatterData));

                    } else {
                        // Handle unknown actions
                        connection.write(JSON.stringify({ error: 'Unknown action' }));
                    }

                } catch (error) {
                    console.error('Error handling socket data:', error);
                    connection.write(JSON.stringify({ error: 'Invalid request format' }));
                } finally {
                    connection.end();
                }
            });

            connection.on('error', (err) => {
                console.error('Socket error:', err);
            });
        });

        this.server.listen(this.settings.socketPath, () => {
            console.log(`Unix Socket server running at ${this.settings.socketPath}`);
        });

        // Ensure the socket is removed when the plugin is unloaded
        this.registerEvent(
            this.app.workspace.on('quit', () => {
                if (this.server) {
                    this.server.close(() => {
                        console.log('Socket server stopped');
                        if (fs.existsSync(this.settings.socketPath)) {
                            fs.unlinkSync(this.settings.socketPath);
                        }
                    });
                }
            })
        );
    }


    // Function to get the active note's file
    getActiveNote(): TFile | null {
        const activeLeaf = this.app.workspace.activeLeaf;
        if (!activeLeaf || !(activeLeaf.view instanceof MarkdownView)) {
            return null;
        }
        return activeLeaf.view.file;
    }

    // Function to retrieve the content of the current active note
    async getActiveNoteContent(): Promise<string | null> {
        const activeNote = this.getActiveNote();
        if (!activeNote) {
            console.error('No active note found');
            return null;
        }

        const content = await this.app.vault.read(activeNote);
        return content;
    }

    // Function to retrieve the absolute path of the current active note
    getActiveNoteRelativePath(): string | null {
        const activeNote = this.getActiveNote();
        if (!activeNote) {
            console.error('No active note found');
            return null;
        }

        const absolutePath = activeNote.path;
        return absolutePath;
    }

    // Function to retrieve the absolute path of the current active note
    getActiveNoteAbsolutePath(): string | null {
        const activeNote = this.getActiveNote();
        if (!activeNote) {
            console.error('No active note found');
            return null;
        }

        // Retrieve the vault's absolute path
        const vaultPath = this.getCurrentVaultAbsolutePath();
        if (!vaultPath) {
            console.error('Unable to retrieve the vault path');
            return null;
        }

        // Retrieve the note's relative path
        const relativeNotePath = this.getActiveNoteRelativePath();
        if (!relativeNotePath) {
            console.error('Unable to retrieve the relative note path');
            return null;
        }

        // Construct and return the absolute path by combining the vault path and the note's relative path
        const absoluteNotePath = `${vaultPath}/${relativeNotePath}`;
        return absoluteNotePath;
    }

    // Function to retrieve the title of the current active note
    getActiveNoteTitle(): string | null {
        const activeNote = this.getActiveNote();
        if (!activeNote) {
            console.error('No active note found');
            return null;
        }

        const title = activeNote.basename;
        return title;
    }

    // Function to retrieve the absolute path of the current vault
    getCurrentVaultAbsolutePath(): string | null {
        const adapter = this.app.vault.adapter;

        // Ensure the adapter is a FileSystemAdapter (which gives access to the local file system)
        if (adapter instanceof FileSystemAdapter) {
            const vaultPath = adapter.getBasePath(); // Correct method for FileSystemAdapter
            return vaultPath;
        } else {
            return null; // If the adapter is not a FileSystemAdapter (e.g., in a non-file system vault)
        }
    }

    // Function to retrieve the active note's Frontmatter and convert the values
    async getActiveNoteFrontmatter(): Promise<any> {
        const activeNote = this.getActiveNote();
        if (!activeNote) {
            return { error: 'No active note found' };
    }
        const cache = this.app.metadataCache.getFileCache(activeNote);
        if (cache && cache.frontmatter) {
            // Convert each frontmatter value
            const convertedFrontmatter = Object.keys(cache.frontmatter).reduce((result, key) => {
                // Use the ! operator to tell TypeScript that cache.frontmatter[key] is not undefined
                result[key] = convertFrontmatterValue(cache.frontmatter![key]);
                return result;
            }, {} as Record<string, any>);

            return { frontmatter: convertedFrontmatter };
        } else {
            return null;
        }
    }

    // Function to run a Python script
    async runPythonScript(scriptPath: string) {
        console.log(`Running Python script: ${scriptPath}`);

        // If the option to disable Python cache is enabled in settings
        const pythonArgs = this.settings.disablePyCache ? ['-B', scriptPath] : [scriptPath];

        const process = spawn('python3', pythonArgs);

        process.stdout.on('data', (data) => {
            console.log(`Output from Python script: ${data.toString()}`);
            try {
                const message = JSON.parse(data.toString());
                if (message.action === 'show_notification' && message.text) {
                    new Notice(message.text);
                }
            } catch (error) {
                console.error('Error parsing JSON message from Python script:', error);
                console.log('Received non-JSON output:', data.toString());
            }
        });

        process.stderr.on('data', (data) => {
            console.error(`Error from Python script: ${data}`);
        });

        process.on('close', (code) => {
            console.log(`Python script finished with exit code ${code}`);
        });
    }


    // Function to choose a Python script and run it
    async chooseAndRunPythonScript() {
        const scriptsFolder = this.getScriptsFolderPath();

        if (!scriptsFolder || !fs.existsSync(scriptsFolder)) {
            new Notice('Please specify a valid folder for Python scripts in the plugin settings.');
            console.log('Invalid or non-existent Python scripts folder.');
            return;
        }

        const pythonFiles = fs.readdirSync(scriptsFolder).filter((file) => file.endsWith('.py'));

        if (pythonFiles.length === 0) {
            new Notice('No Python scripts found in the specified folder.');
            console.log('No Python files found in the specified folder.');
            return;
        }

        const scriptChoices = pythonFiles.map((file) => ({
            label: file,
            value: path.join(scriptsFolder, file),
        }));

        // Use a modal to allow the user to choose the script
        new ScriptSelectionModal(this.app, scriptChoices, (selectedScript) => {
            if (selectedScript) {
                this.runPythonScript(selectedScript);
            } else {
                new Notice('No script selected.');
            }
        }).open();
    }

    // Function to run all Python scripts in the specified folder
    async runAllPythonScripts() {
        const scriptsFolder = this.getScriptsFolderPath();

        if (!scriptsFolder || !fs.existsSync(scriptsFolder)) {
            new Notice('Please specify a valid folder for Python scripts in the plugin settings.');
            console.log('Invalid or non-existent Python scripts folder.');
            return;
        }

        const pythonFiles = fs.readdirSync(scriptsFolder).filter((file) => file.endsWith('.py'));

        if (pythonFiles.length === 0) {
            new Notice('No Python scripts found in the specified folder.');
            console.log('No Python files found in the specified folder.');
            return;
        }

        for (const file of pythonFiles) {
            const scriptPath = path.join(scriptsFolder, file);
            await this.runPythonScript(scriptPath);
        }
    }

    // Get the path to the Python scripts folder
    getScriptsFolderPath(): string {
        const { pythonScriptsFolder } = this.settings;

        if (!pythonScriptsFolder) {
            return '';
        }

        if (path.isAbsolute(pythonScriptsFolder)) {
            return pythonScriptsFolder;
        } else {
            const adapter = this.app.vault.adapter;
            let basePath: string;

            if (adapter instanceof FileSystemAdapter) {
                basePath = adapter.getBasePath();
            } else {
                // Handle other types of adapters if necessary
                new Notice('Cannot determine base path for non-filesystem vault.');
                console.log('Vault adapter is not a FileSystemAdapter.');
                return '';
            }

            return path.join(basePath, pythonScriptsFolder);
        }
    }

    onunload() {
        console.log('Unloading the Obsidian Python Bridge plugin');
        if (this.server) {
            this.server.close(() => {
                console.log('Socket server stopped');
                if (fs.existsSync(this.settings.socketPath)) {
                    fs.unlinkSync(this.settings.socketPath);
                }
            });
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

// Plugin settings
class PythonBridgeSettingTab extends PluginSettingTab {
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

// Modal class for selecting a Python script from the list
class ScriptSelectionModal extends SuggestModal<string> {
    scriptChoices: { label: string; value: string }[];
    onChoose: (result: string | null) => void;

    constructor(app: App, scriptChoices: { label: string; value: string }[], onChoose: (result: string | null) => void) {
        super(app);
        this.scriptChoices = scriptChoices;
        this.onChoose = onChoose;
    }

    getSuggestions(query: string): string[] {
        return this.scriptChoices
            .filter((choice) => choice.label.toLowerCase().includes(query.toLowerCase()))
            .map((choice) => choice.label);
    }

    renderSuggestion(value: string, el: HTMLElement) {
        el.createEl('div', { text: value });
    }

    onChooseSuggestion(item: string, evt: MouseEvent | KeyboardEvent) {
        const selected = this.scriptChoices.find(choice => choice.label === item);
        if (selected) {
            this.onChoose(selected.value);
        } else {
            this.onChoose(null);
        }
    }
}
