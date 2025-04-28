'use strict';

var obsidian = require('obsidian');
var child_process = require('child_process');
var fs = require('fs');
var http = require('http');
var path = require('path');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);
var http__namespace = /*#__PURE__*/_interopNamespaceDefault(http);
var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

// Plugin settings tab
class PythonBridgeSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Obsidian Python Bridge Settings' });
        // Setting for Python Scripts Folder
        new obsidian.Setting(containerEl)
            .setName('Python Scripts Folder')
            .setDesc('Path to the folder containing your Python scripts (absolute or relative to the vault).')
            .addText((text) => text
            .setPlaceholder('/path/to/your/scripts or ./scripts-python')
            .setValue(this.plugin.settings.pythonScriptsFolder)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.pythonScriptsFolder = value.trim(); // Trim whitespace
            yield this.plugin.saveSettings();
        })));
        // Setting for HTTP Server Port
        new obsidian.Setting(containerEl)
            .setName('HTTP Server Port')
            .setDesc('Port for the local HTTP server (1024-65535). Requires restart or settings save to apply.')
            .addText((text) => text
            .setPlaceholder(String(27123)) // Default port placeholder
            .setValue(String(this.plugin.settings.httpPort)) // Store as number, display as string
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            const port = parseInt(value, 10);
            if (!isNaN(port) && port > 1023 && port <= 65535) {
                this.plugin.settings.httpPort = port;
                yield this.plugin.saveSettings();
                // Optionally add visual feedback for valid input
                text.inputEl.style.borderColor = ""; // Reset border
            }
            else {
                // Optionally add visual feedback for invalid input
                text.inputEl.style.borderColor = "red";
                // Do not save invalid port
                console.warn(`Invalid port entered: ${value}. Must be between 1024 and 65535.`);
                // Optionally show a notice, but might be annoying during typing
                // new Notice("Invalid port number. Please enter a value between 1024 and 65535.");
            }
        })));
        // Setting to disable Python cache (__pycache__)
        new obsidian.Setting(containerEl)
            .setName('Disable Python Cache (__pycache__)')
            .setDesc('Run Python with the "-B" flag to prevent writing .pyc files.')
            .addToggle((toggle) => toggle
            .setValue(this.plugin.settings.disablePyCache)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.disablePyCache = value;
            yield this.plugin.saveSettings();
        })));
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

// Modal class for requesting user input
class UserInputModal extends obsidian.Modal {
    constructor(app, scriptName, inputType, message, onSubmit, validationRegex, minValue, maxValue, step) {
        super(app);
        this.scriptName = scriptName;
        this.inputType = inputType;
        this.message = message;
        this.onSubmit = onSubmit;
        this.validationRegex = validationRegex;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.step = step;
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: this.scriptName });
        contentEl.createEl('p', { text: this.message });
        if (this.inputType === 'text') {
            this.inputEl = contentEl.createEl('input', { type: 'text' });
        }
        else if (this.inputType === 'number') {
            this.inputEl = contentEl.createEl('input', { type: 'range' });
            if (this.minValue !== undefined) {
                this.inputEl.setAttribute('min', this.minValue.toString());
            }
            if (this.maxValue !== undefined) {
                this.inputEl.setAttribute('max', this.maxValue.toString());
            }
            if (this.step !== undefined) {
                this.inputEl.setAttribute('step', this.step.toString());
            }
        }
        else if (this.inputType === 'boolean') {
            this.inputEl = contentEl.createEl('input', { type: 'checkbox' });
        }
        else if (this.inputType === 'date') {
            this.inputEl = contentEl.createEl('input', { type: 'date' });
        }
        const submitButton = contentEl.createEl('button', { text: 'Submit' });
        submitButton.addEventListener('click', () => {
            if (this.inputEl) {
                let inputValue;
                if (this.inputType === 'boolean') {
                    inputValue = this.inputEl.checked;
                }
                else {
                    inputValue = this.inputEl.value;
                }
                this.onSubmit(inputValue);
                this.close();
            }
        });
    }
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

/**
 * Modal for selecting a Python script from a list.
 */
class ScriptSelectionModal extends obsidian.SuggestModal {
    /**
     * Creates an instance of ScriptSelectionModal.
     * @param app The Obsidian App instance.
     * @param scriptChoices Array of script choices { label, value }.
     * @param onChoose Callback function executed with the selected script path or null if cancelled.
     */
    constructor(app, scriptChoices, onChoose) {
        super(app);
        this.scriptChoices = scriptChoices;
        this.onChoose = onChoose;
        this.setPlaceholder("Select a Python script to run...");
    }
    /**
     * Returns suggestions matching the user's query.
     * Filters the choices based on the label (filename).
     * @param query The text entered by the user.
     * @returns An array of matching ScriptChoice objects.
     */
    getSuggestions(query) {
        const lowerCaseQuery = query.toLowerCase();
        return this.scriptChoices.filter((choice) => choice.label.toLowerCase().includes(lowerCaseQuery));
    }
    /**
     * Renders a single suggestion item in the modal list.
     * Displays the script filename (label).
     * @param choice The ScriptChoice object to render.
     * @param el The HTML element to render into.
     */
    renderSuggestion(choice, el) {
        el.createEl("div", { text: choice.label });
    }
    /**
     * Called when the user selects a suggestion from the list.
     * Executes the onChoose callback with the full path (value) of the selected script.
     * @param choice The selected ScriptChoice object.
     * @param evt The mouse or keyboard event that triggered the selection.
     */
    onChooseSuggestion(choice, evt) {
        this.onChoose(choice.value); // Pass the full path back
    }
}

const DEFAULT_PORT = 27123; // Default HTTP port
const DEFAULT_SETTINGS = {
    pythonScriptsFolder: "",
    httpPort: DEFAULT_PORT,
    disablePyCache: true,
};
// --- Main Plugin Class ---
class ObsidianPythonBridge extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.server = null; // Changed from net.Server to http.Server
        this.initialHttpPort = 0; // Track initial port for restart notice
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Loading Obsidian Python Bridge plugin...");
            yield this.loadSettings();
            this.initialHttpPort = this.settings.httpPort;
            this.addSettingTab(new PythonBridgeSettingTab(this.app, this));
            this.addCommands();
            this.startHttpServer(); // Renamed function
            this.registerEvent(this.app.workspace.on("quit", () => {
                this.stopHttpServer(); // Renamed function
            }));
            console.log("Obsidian Python Bridge plugin loaded.");
        });
    }
    onunload() {
        console.log("Unloading Obsidian Python Bridge plugin...");
        this.stopHttpServer(); // Renamed function
        console.log("Obsidian Python Bridge plugin unloaded.");
    }
    // --- Settings Management ---
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
            // Ensure port is a number
            if (typeof this.settings.httpPort !== "number") {
                console.warn(`Invalid httpPort loaded (${this.settings.httpPort}), resetting to default ${DEFAULT_PORT}`);
                this.settings.httpPort = DEFAULT_PORT;
            }
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
            // Check if port changed and restart server if needed
            if (this.server && this.settings.httpPort !== this.initialHttpPort) {
                console.log(`HTTP port changed from ${this.initialHttpPort} to ${this.settings.httpPort}. Restarting server...`);
                new obsidian.Notice(`Python Bridge: HTTP port changed to ${this.settings.httpPort}. Restarting server...`, 3000);
                this.stopHttpServer();
                this.startHttpServer();
                this.initialHttpPort = this.settings.httpPort; // Update tracked port
            }
        });
    }
    // --- Command Registration ---
    addCommands() {
        this.addCommand({
            id: "run-specific-python-script",
            name: "Run a specific Python script",
            callback: () => this.chooseAndRunPythonScript(),
        });
        this.addCommand({
            id: "run-all-python-scripts",
            name: "Run all Python scripts",
            callback: () => this.runAllPythonScripts(),
        });
    }
    // --- HTTP Server Management ---
    stopHttpServer() {
        if (this.server) {
            console.log("Stopping HTTP server...");
            this.server.close((err) => {
                if (err) {
                    console.error("Error closing HTTP server:", err);
                }
                else {
                    console.log("HTTP server stopped.");
                }
                this.server = null;
            });
        }
    }
    startHttpServer() {
        console.log("Attempting to start HTTP server...");
        this.stopHttpServer(); // Ensure clean state
        if (!this.settings.httpPort ||
            typeof this.settings.httpPort !== "number" ||
            this.settings.httpPort <= 0 ||
            this.settings.httpPort > 65535) {
            const errorMsg = `Invalid HTTP port configured: ${this.settings.httpPort}. Server not started.`;
            console.error(errorMsg);
            new obsidian.Notice(`Python Bridge: ${errorMsg}`);
            return;
        }
        this.server = http__namespace.createServer((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { method, url } = req;
            const remoteAddress = req.socket.remoteAddress || "unknown";
            console.log(`HTTP Request received: ${method} ${url} from ${remoteAddress}`);
            // Basic routing and method check
            if (url !== "/" || method !== "POST") {
                console.log(`Ignoring request: Invalid method/path (${method} ${url})`);
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    status: "error",
                    error: "Not Found: Please POST to /",
                }));
                return;
            }
            // Check Content-Type
            if (req.headers["content-type"] !== "application/json") {
                console.log(`Ignoring request: Invalid Content-Type (${req.headers['content-type']})`);
                res.writeHead(415, { "Content-Type": "application/json" }); // Unsupported Media Type
                res.end(JSON.stringify({ status: "error", error: "Invalid Content-Type: application/json required" }));
                return;
            }
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString(); // Collect request body
            });
            req.on("end", () => __awaiter(this, void 0, void 0, function* () {
                let request;
                let response;
                try {
                    console.log(`Attempting to parse JSON request body: ${body}`);
                    request = JSON.parse(body);
                    // Basic validation of parsed request
                    if (!request ||
                        typeof request !== "object" ||
                        typeof request.action !== "string") {
                        throw new Error("Invalid JSON request structure. 'action' field is missing or invalid.");
                    }
                    console.log(`Handling action: ${request.action}`);
                    response = yield this.handleAction(request); // Process the action
                    console.log(`Action ${request.action} handled, sending response:`, response);
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    console.error("Error processing request:", errorMessage);
                    response = {
                        status: "error",
                        error: `Failed to process request: ${errorMessage}`,
                    };
                }
                // Send the response back
                const responseJson = JSON.stringify(response);
                res.writeHead(response.status === "success" ? 200 : 500, {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(responseJson),
                });
                res.end(responseJson);
                console.log("HTTP Response sent.");
            }));
            req.on("error", (err) => {
                console.error("Error reading request stream:", err.message);
                if (!res.writableEnded) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ status: "error", error: "Error reading request data" }));
                }
            });
        }));
        this.server.on("error", (err) => {
            let errorMsg = `HTTP server error: ${err.message}`;
            if (err.code === "EADDRINUSE") {
                errorMsg = `Port ${this.settings.httpPort} is already in use. Please choose another port in settings or close the other application.`;
                console.error(errorMsg);
            }
            else {
                console.error("HTTP server error:", err);
            }
            new obsidian.Notice(`Python Bridge: ${errorMsg}`, 10000);
            this.server = null; // Ensure server is marked as stopped
        });
        try {
            // Listen only on localhost for security
            this.server.listen(this.settings.httpPort, "127.0.0.1", () => {
                console.log(`HTTP server listening on http://127.0.0.1:${this.settings.httpPort}`);
                // No chmod needed for HTTP ports
            });
        }
        catch (listenErr) {
            const errorMsg = listenErr instanceof Error ? listenErr.message : String(listenErr);
            console.error("Failed to listen on HTTP port:", errorMsg);
            new obsidian.Notice(`Python Bridge: Failed to start server on port ${this.settings.httpPort}. ${errorMsg}`);
            this.server = null;
        }
    }
    // handleAction remains largely the same, as it deals with application logic, not transport
    handleAction(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { action, payload } = request;
            console.log(`Executing action: ${action} with payload:`, payload);
            try {
                switch (action) {
                    case "get_all_note_paths":
                        const paths = this.getAllNotePaths();
                        return { status: "success", data: paths };
                    case "get_active_note_content":
                        const content = yield this.getActiveNoteContent();
                        return content !== null
                            ? { status: "success", data: content }
                            : { status: "error", error: "No active Markdown note found." };
                    case "get_active_note_relative_path":
                        const relativePath = this.getActiveNoteRelativePath();
                        return relativePath !== null
                            ? { status: "success", data: relativePath }
                            : { status: "error", error: "No active Markdown note found." };
                    case "get_active_note_absolute_path":
                        const absolutePath = this.getActiveNoteAbsolutePath();
                        return absolutePath !== null
                            ? { status: "success", data: absolutePath }
                            : {
                                status: "error",
                                error: "No active note or vault path unavailable.",
                            };
                    case "get_active_note_title":
                        const title = this.getActiveNoteTitle();
                        return title !== null
                            ? { status: "success", data: title }
                            : { status: "error", error: "No active Markdown note found." };
                    case "get_current_vault_absolute_path":
                        const vaultPath = this.getCurrentVaultAbsolutePath();
                        return vaultPath !== null
                            ? { status: "success", data: vaultPath }
                            : {
                                status: "error",
                                error: "Could not determine vault absolute path.",
                            };
                    case "get_active_note_frontmatter":
                        const frontmatter = yield this.getActiveNoteFrontmatter();
                        return { status: "success", data: frontmatter }; // null is a valid success case
                    case "show_notification":
                        if (typeof (payload === null || payload === void 0 ? void 0 : payload.content) !== "string") {
                            return {
                                status: "error",
                                error: "Invalid payload: 'content' (string) required.",
                            };
                        }
                        const duration = typeof (payload === null || payload === void 0 ? void 0 : payload.duration) === "number" ? payload.duration : 4000;
                        console.log(`Showing notification: "${payload.content}", duration: ${duration}`);
                        this.showNotification(payload.content, duration);
                        console.log("Notification shown.");
                        return { status: "success", data: null };
                    case "modify_note_content":
                        if (typeof (payload === null || payload === void 0 ? void 0 : payload.filePath) !== "string" ||
                            typeof (payload === null || payload === void 0 ? void 0 : payload.content) !== "string") {
                            return {
                                status: "error",
                                error: "Invalid payload: 'filePath' and 'content' (strings) required.",
                            };
                        }
                        // modifyNoteContent now needs to handle potential errors better
                        try {
                            yield this.modifyNoteContent(payload.filePath, payload.content);
                            return { status: "success", data: null };
                        }
                        catch (modifyError) {
                            const errorMsg = modifyError instanceof Error ? modifyError.message : String(modifyError);
                            console.error(`Error in modifyNoteContent for ${payload.filePath}: ${errorMsg}`);
                            return { status: "error", error: `Failed to modify note: ${errorMsg}` };
                        }
                    case "request_user_input":
                        if (typeof (payload === null || payload === void 0 ? void 0 : payload.scriptName) !== "string" ||
                            typeof (payload === null || payload === void 0 ? void 0 : payload.inputType) !== "string" ||
                            typeof (payload === null || payload === void 0 ? void 0 : payload.message) !== "string") {
                            return {
                                status: "error",
                                error: "Invalid payload: 'scriptName', 'inputType', 'message' (strings) required.",
                            };
                        }
                        const userInput = yield this.requestUserInput(payload.scriptName, payload.inputType, payload.message, payload.validationRegex, payload.minValue, payload.maxValue, payload.step);
                        // Check if user cancelled (modal resolves with null)
                        if (userInput === null) {
                            console.log("User cancelled input modal.");
                            return { status: "error", error: "User cancelled input." };
                        }
                        return { status: "success", data: userInput };
                    default:
                        console.warn(`Received unknown action: ${action}`);
                        return { status: "error", error: `Unknown action: ${action}` };
                }
            }
            catch (error) {
                // Catch errors from the specific action handlers (e.g., file system errors)
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error(`Error executing action "${action}":`, errorMessage);
                return {
                    status: "error",
                    error: `Failed to execute action "${action}": ${errorMessage}`,
                };
            }
        });
    }
    // --- Obsidian Interaction Helpers (Unchanged) ---
    getActiveNoteFile() {
        const activeLeaf = this.app.workspace.activeLeaf;
        return (activeLeaf === null || activeLeaf === void 0 ? void 0 : activeLeaf.view) instanceof obsidian.MarkdownView
            ? activeLeaf.view.file
            : null;
    }
    getActiveNoteContent() {
        return __awaiter(this, void 0, void 0, function* () {
            const file = this.getActiveNoteFile();
            return file ? this.app.vault.read(file) : null;
        });
    }
    getActiveNoteRelativePath() {
        var _a, _b;
        return (_b = (_a = this.getActiveNoteFile()) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : null;
    }
    getActiveNoteAbsolutePath() {
        const file = this.getActiveNoteFile();
        const vaultPath = this.getCurrentVaultAbsolutePath();
        if (!file || !vaultPath)
            return null;
        // Ensure vaultPath doesn't have trailing slash for cleaner joining
        const cleanVaultPath = vaultPath.replace(/[\\/]$/, "");
        return path__namespace.join(cleanVaultPath, file.path);
    }
    getActiveNoteTitle() {
        var _a, _b;
        return (_b = (_a = this.getActiveNoteFile()) === null || _a === void 0 ? void 0 : _a.basename) !== null && _b !== void 0 ? _b : null;
    }
    getCurrentVaultAbsolutePath() {
        const adapter = this.app.vault.adapter;
        return adapter instanceof obsidian.FileSystemAdapter ? adapter.getBasePath() : null;
    }
    getActiveNoteFrontmatter() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const file = this.getActiveNoteFile();
            if (!file)
                return null;
            const metadata = this.app.metadataCache.getFileCache(file);
            // Return Obsidian's parsed frontmatter directly, or null if none
            return (_a = metadata === null || metadata === void 0 ? void 0 : metadata.frontmatter) !== null && _a !== void 0 ? _a : null;
        });
    }
    showNotification(message, duration = 4000) {
        new obsidian.Notice(message, duration);
    }
    modifyNoteContent(absoluteFilePath, newContent) {
        return __awaiter(this, void 0, void 0, function* () {
            const vaultPath = this.getCurrentVaultAbsolutePath();
            if (!vaultPath) {
                throw new Error("Cannot modify note: Vault path is unavailable (non-filesystem adapter?).");
            }
            // Ensure input path is absolute
            if (!path__namespace.isAbsolute(absoluteFilePath)) {
                throw new Error(`Cannot modify note: Provided path is not absolute: ${absoluteFilePath}`);
            }
            // Calculate relative path carefully
            const relativePath = path__namespace.relative(vaultPath, absoluteFilePath);
            // Prevent path traversal attempts (e.g., ../../..)
            if (relativePath.startsWith("..") || path__namespace.isAbsolute(relativePath)) {
                throw new Error(`Cannot modify note: Path is outside the current vault: ${absoluteFilePath}`);
            }
            // Normalize to forward slashes for Obsidian API
            const normalizedPath = relativePath.replace(/\\/g, "/");
            const file = this.app.vault.getAbstractFileByPath(normalizedPath);
            if (!(file instanceof obsidian.TFile)) {
                throw new Error(`Cannot modify note: File not found in vault at normalized path: ${normalizedPath} (derived from ${absoluteFilePath})`);
            }
            console.log(`Attempting to modify note via Vault API: ${normalizedPath}`);
            yield this.app.vault.modify(file, newContent);
            console.log(`Note modified successfully: ${normalizedPath}`);
        });
    }
    requestUserInput(scriptName, inputType, message, validationRegex, minValue, maxValue, step) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const modal = new UserInputModal(this.app, scriptName, inputType, message, (input) => resolve(input), // Resolve with input or null on cancel
                validationRegex, minValue, maxValue, step);
                modal.open();
            });
        });
    }
    getAllNotePaths() {
        return this.app.vault.getMarkdownFiles().map((f) => f.path);
    }
    // --- Python Script Execution ---
    getScriptsFolderPath() {
        const { pythonScriptsFolder } = this.settings;
        if (!pythonScriptsFolder)
            return "";
        if (path__namespace.isAbsolute(pythonScriptsFolder)) {
            return fs__namespace.existsSync(pythonScriptsFolder) ? pythonScriptsFolder : "";
        }
        else {
            const vaultPath = this.getCurrentVaultAbsolutePath();
            if (!vaultPath) {
                console.error("Cannot resolve relative script path: Vault path unavailable.");
                return "";
            }
            const resolvedPath = path__namespace.join(vaultPath, pythonScriptsFolder);
            return fs__namespace.existsSync(resolvedPath) ? resolvedPath : "";
        }
    }
    runPythonScript(scriptPath) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // Check if port changed since load (less critical now, but good practice)
            if (this.settings.httpPort !== this.initialHttpPort) {
                new obsidian.Notice(`⚠️ Python Bridge: HTTP Port changed (${this.initialHttpPort} -> ${this.settings.httpPort}). Scripts might target the old port until Obsidian restarts or settings are saved again.`, 8000);
                // Optionally force restart server here if desired, but saving settings already does
            }
            if (!fs__namespace.existsSync(scriptPath)) {
                new obsidian.Notice(`Python script not found: ${scriptPath}`);
                console.error(`Python script not found: ${scriptPath}`);
                return;
            }
            console.log(`Running Python script: ${scriptPath}`);
            const pythonExecutable = "python3"; // Consider making this configurable
            const pythonArgs = this.settings.disablePyCache
                ? ["-B", scriptPath]
                : [scriptPath];
            const scriptName = path__namespace.basename(scriptPath);
            try {
                // Pass HTTP port via environment variable
                const env = Object.assign(Object.assign({}, process.env), { OBSIDIAN_HTTP_PORT: String(this.settings.httpPort) });
                const pythonProcess = child_process.spawn(pythonExecutable, pythonArgs, {
                    env,
                });
                (_a = pythonProcess.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
                    console.log(`[Output ${scriptName}]:\n${data.toString().trim()}`);
                    // Optionally show output in a notice? Could be noisy.
                    // new Notice(`Output from ${scriptName}:\n${data.toString().trim()}`, 5000);
                });
                (_b = pythonProcess.stderr) === null || _b === void 0 ? void 0 : _b.on("data", (data) => {
                    const errorMsg = data.toString().trim();
                    console.error(`[Error ${scriptName}]:\n${errorMsg}`);
                    // Show stderr output prominently as it likely indicates script errors
                    new obsidian.Notice(`Error in ${scriptName}:\n${errorMsg}`, 10000);
                });
                pythonProcess.on("close", (code) => {
                    const exitMsg = `${scriptName} finished with exit code ${code !== null && code !== void 0 ? code : "unknown"}.`;
                    console.log(exitMsg);
                    if (code !== 0) {
                        new obsidian.Notice(exitMsg, 5000); // Notify if script exited with an error code
                    }
                });
                pythonProcess.on("error", (err) => {
                    // Errors spawning the process itself
                    console.error(`Failed starting ${scriptName}:`, err.message);
                    new obsidian.Notice(`Failed to start ${scriptName}: ${err.message}`);
                });
            }
            catch (error) {
                // Catch errors in the spawn call itself (e.g., executable not found)
                const errorMsg = error instanceof Error ? error.message : String(error);
                console.error(`Error spawning ${scriptName}:`, errorMsg);
                new obsidian.Notice(`Error running ${scriptName}: ${errorMsg}`);
            }
        });
    }
    chooseAndRunPythonScript() {
        return __awaiter(this, void 0, void 0, function* () {
            const scriptsFolder = this.getScriptsFolderPath();
            if (!scriptsFolder) { // Already checks existence in getScriptsFolderPath
                new obsidian.Notice("Python scripts folder not found or invalid. Check plugin settings.");
                return;
            }
            let pythonFiles;
            try {
                pythonFiles = fs__namespace
                    .readdirSync(scriptsFolder)
                    .filter((f) => f.endsWith(".py") && !f.startsWith(".")); // Ignore hidden files
            }
            catch (err) {
                const errorMsg = err instanceof Error ? err.message : String(err);
                new obsidian.Notice(`Error reading scripts folder: ${errorMsg}`);
                console.error(`Error reading scripts folder ${scriptsFolder}:`, err);
                return;
            }
            if (pythonFiles.length === 0) {
                new obsidian.Notice("No Python scripts (.py) found in the specified folder.");
                return;
            }
            const scriptChoices = pythonFiles.map((f) => ({
                label: f,
                value: path__namespace.join(scriptsFolder, f),
            }));
            new ScriptSelectionModal(this.app, scriptChoices, (selectedPath) => {
                if (selectedPath) {
                    this.runPythonScript(selectedPath);
                }
                else {
                    console.log("Script selection cancelled.");
                }
            }).open();
        });
    }
    runAllPythonScripts() {
        return __awaiter(this, void 0, void 0, function* () {
            const scriptsFolder = this.getScriptsFolderPath();
            if (!scriptsFolder) {
                new obsidian.Notice("Python scripts folder not found or invalid. Check plugin settings.");
                return;
            }
            let pythonFiles;
            try {
                pythonFiles = fs__namespace
                    .readdirSync(scriptsFolder)
                    .filter((f) => f.endsWith(".py") && !f.startsWith("."));
            }
            catch (err) {
                const errorMsg = err instanceof Error ? err.message : String(err);
                new obsidian.Notice(`Error reading scripts folder: ${errorMsg}`);
                console.error(`Error reading scripts folder ${scriptsFolder}:`, err);
                return;
            }
            if (pythonFiles.length === 0) {
                new obsidian.Notice("No Python scripts (.py) found in the specified folder.");
                return;
            }
            new obsidian.Notice(`Running ${pythonFiles.length} Python script(s)...`);
            pythonFiles.forEach((file) => {
                const scriptPath = path__namespace.join(scriptsFolder, file);
                // Run scripts sequentially with a small delay? Or concurrently?
                // Running concurrently might overwhelm the server or Obsidian API if many scripts run
                // Let's run them concurrently for now, as before.
                this.runPythonScript(scriptPath); // Run without await for concurrency
            });
        });
    }
} // End of class ObsidianPythonBridge

module.exports = ObsidianPythonBridge;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOltdLCJzb3VyY2VzQ29udGVudCI6W10sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
