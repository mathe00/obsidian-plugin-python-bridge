import { App, Notice, Plugin, PluginSettingTab, Setting, TFile, MarkdownView, SuggestModal, FileSystemAdapter, Modal } from 'obsidian';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as net from 'net'; // Use the net module for Unix sockets
import * as path from 'path'; // Import the path module to manipulate paths
import moment from 'moment'; // Use moment.js to handle dates

// Import of other .ts files
import PythonBridgeSettingTab from './PythonBridgeSettingTab';
import UserInputModal from './UserInputModal';



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
    initialSocketPath: string = ''; // Adding the initialSocketPath property

    async onload() {
        console.log('Loading the Obsidian Python Bridge plugin');

        // Load settings
        await this.loadSettings();

        // Store initial socket path
        this.initialSocketPath = this.settings.socketPath;

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
                    // Convert the received data to a string
                    const requestString = data.toString();
                    
                    // Extract action by finding the content between "---BEGIN-" and "-BEGIN---"
                    const actionMatch = requestString.match(/---BEGIN-(.*?)-BEGIN---/);
                    if (!actionMatch) {
                        throw new Error('Invalid request format: Missing action');
                    }
                    const action = actionMatch[1];

                    // Extract the content part by finding the section between the action blocks
                    const contentMatch = requestString.match(/---BEGIN-.*?-BEGIN---\n([\s\S]*?)\n---END-.*?-END---/);
                    const content = contentMatch ? contentMatch[1].trim() : '';

                    // Handle different actions based on the extracted action string
                    if (action === 'get_all_note_paths') {
                        try {
                            const allNotePaths = this.getAllNotePaths();
                    
                            // Send the paths 10 at a time
                            for (let i = 0; i < allNotePaths.length; i += 10) {
                                const chunk = allNotePaths.slice(i, i + 10).join('||'); // Join 10 paths with '||' separator
                                connection.write(`---BEGIN-get_all_note_paths-BEGIN---\n${chunk}\n---END-get_all_note_paths-END---`);
                            }
                    
                            // Indicate end of transmission
                            connection.write(`---BEGIN-get_all_note_paths-END---\nEND\n---END-get_all_note_paths-END---`);
                        } catch (error) {
                            console.error('Error fetching all note paths:', error);
                    
                            // Check if the error has a message property
                            if (error instanceof Error) {
                                connection.write(`---BEGIN-get_all_note_paths-ERROR---\n${error.message}\n---END-get_all_note_paths-ERROR---`);
                            } else {
                                connection.write(`---BEGIN-get_all_note_paths-ERROR---\nUnknown error occurred\n---END-get_all_note_paths-ERROR---`);
                            }
                        }

                    } else if (action === 'get_active_note_content') {
                        try {
                            const noteContent = await this.getActiveNoteContent();
                            connection.write(`---BEGIN-get_active_note_content-BEGIN---\n${noteContent}\n---END-get_active_note_content-END---`);
                        } catch (err) {
                            const errorMessage = (err instanceof Error) ? err.message : 'Unknown error';
                            console.error('Failed to get active note content:', errorMessage);
                            connection.write(`---BEGIN-get_active_note_content-BEGIN---\nsuccess: false||error: ${errorMessage}\n---END-get_active_note_content-END---`);
                        }
                    
                    } else if (action === 'get_active_note_absolute_path') {
                        try {
                            const absolutePath = this.getActiveNoteAbsolutePath();
                            connection.write(`---BEGIN-get_active_note_absolute_path-BEGIN---\n${absolutePath}\n---END-get_active_note_absolute_path-END---`);
                        } catch (err) {
                            const errorMessage = (err instanceof Error) ? err.message : 'Unknown error';
                            console.error('Failed to get active note absolute path:', errorMessage);
                            connection.write(`---BEGIN-get_active_note_absolute_path-BEGIN---\nsuccess: false||error: ${errorMessage}\n---END-get_active_note_absolute_path-END---`);
                        }
                    
                    } else if (action === 'get_active_note_relative_path') {
                        try {
                            const relativePath = this.getActiveNoteRelativePath();
                            connection.write(`---BEGIN-get_active_note_relative_path-BEGIN---\n${relativePath}\n---END-get_active_note_relative_path-END---`);
                        } catch (err) {
                            const errorMessage = (err instanceof Error) ? err.message : 'Unknown error';
                            console.error('Failed to get active note relative path:', errorMessage);
                            connection.write(`---BEGIN-get_active_note_relative_path-BEGIN---\nsuccess: false||error: ${errorMessage}\n---END-get_active_note_relative_path-END---`);
                        }
                    
                    } else if (action === 'get_active_note_title') {
                        try {
                            const title = this.getActiveNoteTitle();
                            connection.write(`---BEGIN-get_active_note_title-BEGIN---\n${title}\n---END-get_active_note_title-END---`);
                        } catch (err) {
                            const errorMessage = (err instanceof Error) ? err.message : 'Unknown error';
                            console.error('Failed to get active note title:', errorMessage);
                            connection.write(`---BEGIN-get_active_note_title-BEGIN---\nsuccess: false||error: ${errorMessage}\n---END-get_active_note_title-END---`);
                        }
                    
                    } else if (action === 'get_current_vault_absolute_path') {
                        try {
                            const vaultPath = this.getCurrentVaultAbsolutePath();
                            connection.write(`---BEGIN-get_current_vault_absolute_path-BEGIN---\n${vaultPath}\n---END-get_current_vault_absolute_path-END---`);
                        } catch (err) {
                            const errorMessage = (err instanceof Error) ? err.message : 'Unknown error';
                            console.error('Failed to get current vault absolute path:', errorMessage);
                            connection.write(`---BEGIN-get_current_vault_absolute_path-BEGIN---\nsuccess: false||error: ${errorMessage}\n---END-get_current_vault_absolute_path-END---`);
                        }                  

                    } else if (action === 'show_notification') {
                        try {
                            this.showNotification(content); // Appelle la fonction showNotification avec le contenu extrait
                            connection.write(`---BEGIN-show_notification-BEGIN---\nsuccess: true||error: \n---END-show_notification-END---`);
                        } catch (err) {
                            const errorMessage = (err instanceof Error) ? err.message : 'Unknown error'; // Gérer les erreurs inconnues
                            console.error('Failed to show notification:', errorMessage);
                            connection.write(`---BEGIN-show_notification-BEGIN---\nsuccess: false||error: ${errorMessage}\n---END-show_notification-END---`);
                        }
                    
                    } else if (action === 'modify_note_content') {
                        const [notePath, newContent] = content.split('||');

                        try {
                            await this.modifyNoteContent(notePath, newContent);
                            connection.write(`---BEGIN-modify_note_content-BEGIN---\nsuccess: true||error: \n---END-modify_note_content-END---`);
                        } catch (err) {
                            const errorMessage = (err instanceof Error) ? err.message : 'Unknown error';
                            console.error('Failed to modify note content:', errorMessage);
                            connection.write(`---BEGIN-modify_note_content-BEGIN---\nsuccess: false||error: ${errorMessage}\n---END-modify_note_content-END---`);
                    }

                    } else if (action === 'get_active_note_frontmatter') {
                        // Get the frontmatter of the active note
                        const frontmatterData = await this.getActiveNoteFrontmatter();
                        connection.write(`---BEGIN-get_active_note_frontmatter-BEGIN---\n${JSON.stringify(frontmatterData)}\n---END-get_active_note_frontmatter-END---`);

                    } else if (action === 'request_user_input') {
                        // Parse additional parameters for user input from the content
                        const [scriptName, inputType, message, validationRegex, minValueStr, maxValueStr, stepStr] = content.split('||');

                        // Convert strings to numbers for parameters that are expected to be numbers
                        const minValue = Number(minValueStr);
                        const maxValue = Number(maxValueStr);
                        const step = Number(stepStr);
                        
                        // Request user input with the correct types
                        const userInput = await this.requestUserInput(
                            scriptName,
                            inputType,
                            message,
                            validationRegex,
                            minValue,   // Now a number
                            maxValue,   // Now a number
                            step        // Now a number
                        );
                        
                        connection.write(`---BEGIN-request_user_input-BEGIN---\n${userInput}\n---END-request_user_input-END---`);

                    } else {
                        // Handle unknown actions
                        connection.write(`---BEGIN-error-BEGIN---\nUnknown action\n---END-error-END---`);
                    }

                } catch (error) {
                    console.error('Error handling socket data:', error);
                    connection.write(`---BEGIN-error-BEGIN---\nInvalid request format\n---END-error-END---`);
                } finally {
                    connection.end(); // End the connection after processing
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

    // Function to get the paths of all notes in the vault
    getAllNotePaths(): string[] {
        const files = this.app.vault.getFiles();
        const notePaths = files.map(file => file.path); // Extract paths of all files
        return notePaths;
    }

    // Function to request user input via a modal
    async requestUserInput(scriptName: string, inputType: string, message: string, validationRegex?: string, minValue?: number, maxValue?: number, step?: number): Promise<any> {
        return new Promise((resolve) => {
            const onSubmit = (input: any) => {
                resolve(input);
            };
            new UserInputModal(this.app, scriptName, inputType, message, onSubmit, validationRegex, minValue, maxValue, step).open();
        });
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

    // Function to modify the content of a note at a specified path.
    async modifyNoteContent(notePath: string, content: string): Promise<void> {
        // Get the absolute path of the vault
        const vaultPath = this.getCurrentVaultAbsolutePath();
        if (!vaultPath) {
            throw new Error('Unable to retrieve the vault path.');
        }

        // Calculate relative path from vault path
        const relativePath = notePath.replace(`${vaultPath}/`, '');
        
        // Use relative path to get file
        const file = this.app.vault.getAbstractFileByPath(relativePath);
        if (file instanceof TFile) {
            await this.app.vault.modify(file, content);
            console.log(`Content modified for the note at path: "${relativePath}"`); // Log success
        } else {
            console.log(`File at path "${relativePath}" not found.`); // Show message in console
            throw new Error(`File at path "${relativePath}" not found.`);
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

    showNotification(notificationText: string) {
        new Notice(notificationText); // Affiche la notification avec le texte reçu
    }
    

    // Function to run a Python script
    async runPythonScript(scriptPath: string) {
        if (this.settings.socketPath !== this.initialSocketPath) {
            new Notice("⚠️ Warning: The socket path has been changed. Please restart Obsidian to avoid malfunctions during script execution.");
        }
        console.log(`Running Python script: ${scriptPath}`);
    
        const pythonArgs = this.settings.disablePyCache ? ['-B', scriptPath] : [scriptPath];
        const process = spawn('python3', pythonArgs);
    
        process.stdout.on('data', (data) => {
            const dataStr = data.toString();
            console.log(`Output from Python script: ${dataStr}`);
    
            try {
                // Si le script Python renvoie une notification
                const actionBeginTag = '---BEGIN-show_notification-BEGIN---';
                const actionEndTag = '---END-show_notification-END---';
    
                if (dataStr.includes(actionBeginTag) && dataStr.includes(actionEndTag)) {
                    const notificationText = dataStr.split(actionBeginTag)[1].split(actionEndTag)[0].trim();
                    this.showNotification(notificationText); // Appelle la fonction dédiée
                } else {
                    console.log('Received non-notification output:', dataStr);
                }
            } catch (error) {
                console.error('Error processing message from Python script:', error);
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
