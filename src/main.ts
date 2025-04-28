// --- src/main.ts ---
import {
  App,
  Notice,
  Plugin,
  TFile,
  TAbstractFile, // Import TAbstractFile
  MarkdownView,
  FileSystemAdapter,
  PluginSettingTab,
  Setting,
  Editor, // Import Editor
  PaneType, // Import PaneType for openLinkText
  OpenViewState, // Import OpenViewState for openLinkText
} from "obsidian";
import { spawn, ChildProcess } from "child_process";
import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import * as os from "os";

// Import other components
import PythonBridgeSettingTab from "./PythonBridgeSettingTab";
import UserInputModal from "./UserInputModal";
import ScriptSelectionModal from "./ScriptSelectionModal";

// --- Interfaces ---
interface PythonBridgeSettings {
  pythonScriptsFolder: string;
  httpPort: number;
  disablePyCache: boolean;
}

const DEFAULT_PORT = 27123;

const DEFAULT_SETTINGS: PythonBridgeSettings = {
  pythonScriptsFolder: "",
  httpPort: DEFAULT_PORT,
  disablePyCache: true,
};

interface JsonResponse {
  status: "success" | "error";
  data?: any;
  error?: string;
}

interface JsonRequest {
  action: string;
  payload?: any;
}

// --- Main Plugin Class ---
export default class ObsidianPythonBridge extends Plugin {
  settings!: PythonBridgeSettings;
  server: http.Server | null = null;
  initialHttpPort: number = 0;

  async onload() {
    console.log("Loading Obsidian Python Bridge plugin...");
    await this.loadSettings();
    this.initialHttpPort = this.settings.httpPort;

    this.addSettingTab(new PythonBridgeSettingTab(this.app, this));
    this.addCommands();
    this.startHttpServer();

    this.registerEvent(
      this.app.workspace.on("quit", () => {
        this.stopHttpServer();
      }),
    );
    console.log("Obsidian Python Bridge plugin loaded.");
  }

  onunload() {
    console.log("Unloading Obsidian Python Bridge plugin...");
    this.stopHttpServer();
    console.log("Obsidian Python Bridge plugin unloaded.");
  }

  // --- Settings Management ---
  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData(),
    );
    if (typeof this.settings.httpPort !== "number") {
      console.warn(
        `Invalid httpPort loaded (${this.settings.httpPort}), resetting to default ${DEFAULT_PORT}`,
      );
      this.settings.httpPort = DEFAULT_PORT;
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
    if (this.server && this.settings.httpPort !== this.initialHttpPort) {
      console.log(
        `HTTP port changed from ${this.initialHttpPort} to ${this.settings.httpPort}. Restarting server...`,
      );
      new Notice(
        `Python Bridge: HTTP port changed to ${this.settings.httpPort}. Restarting server...`,
        3000,
      );
      this.stopHttpServer();
      this.startHttpServer();
      this.initialHttpPort = this.settings.httpPort;
    }
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
        } else {
          console.log("HTTP server stopped.");
        }
        this.server = null;
      });
    }
  }

  startHttpServer() {
    console.log("Attempting to start HTTP server...");
    this.stopHttpServer();

    if (
      !this.settings.httpPort ||
      typeof this.settings.httpPort !== "number" ||
      this.settings.httpPort <= 0 ||
      this.settings.httpPort > 65535
    ) {
      const errorMsg = `Invalid HTTP port configured: ${this.settings.httpPort}. Server not started.`;
      console.error(errorMsg);
      new Notice(`Python Bridge: ${errorMsg}`);
      return;
    }

    this.server = http.createServer(
      async (req: http.IncomingMessage, res: http.ServerResponse) => {
        const { method, url } = req;
        const remoteAddress =
          req.socket.remoteAddress || "unknown";
        console.log(
          `HTTP Request received: ${method} ${url} from ${remoteAddress}`,
        );

        if (url !== "/" || method !== "POST") {
          console.log(`Ignoring request: Invalid method/path (${method} ${url})`);
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              status: "error",
              error: "Not Found: Please POST to /",
            }),
          );
          return;
        }

        if (req.headers["content-type"] !== "application/json") {
           console.log(`Ignoring request: Invalid Content-Type (${req.headers['content-type']})`);
           res.writeHead(415, { "Content-Type": "application/json" });
           res.end(JSON.stringify({ status: "error", error: "Invalid Content-Type: application/json required" }));
           return;
        }

        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", async () => {
          let request: JsonRequest;
          let response: JsonResponse;

          try {
            console.log(`Attempting to parse JSON request body: ${body}`);
            request = JSON.parse(body);

            if (
              !request ||
              typeof request !== "object" ||
              typeof request.action !== "string"
            ) {
              throw new Error("Invalid JSON request structure. 'action' field is missing or invalid.");
            }

            console.log(`Handling action: ${request.action}`);
            response = await this.handleAction(request);
            console.log(
              `Action ${request.action} handled, sending response:`,
              response,
            );
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            console.error("Error processing request:", errorMessage);
            response = {
              status: "error",
              error: `Failed to process request: ${errorMessage}`,
            };
          }

          const responseJson = JSON.stringify(response);
          res.writeHead(response.status === "success" ? 200 : 500, {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(responseJson),
          });
          res.end(responseJson);
          console.log("HTTP Response sent.");
        });

        req.on("error", (err) => {
          console.error("Error reading request stream:", err.message);
           if (!res.writableEnded) {
               res.writeHead(500, { "Content-Type": "application/json" });
               res.end(JSON.stringify({ status: "error", error: "Error reading request data" }));
           }
        });
      },
    );

    this.server.on("error", (err: NodeJS.ErrnoException) => {
      let errorMsg = `HTTP server error: ${err.message}`;
      if (err.code === "EADDRINUSE") {
        errorMsg = `Port ${this.settings.httpPort} is already in use. Please choose another port in settings or close the other application.`;
        console.error(errorMsg);
      } else {
        console.error("HTTP server error:", err);
      }
      new Notice(`Python Bridge: ${errorMsg}`, 10000);
      this.server = null;
    });

    try {
      this.server.listen(this.settings.httpPort, "127.0.0.1", () => {
        console.log(
          `HTTP server listening on http://127.0.0.1:${this.settings.httpPort}`,
        );
      });
    } catch (listenErr) {
      const errorMsg =
        listenErr instanceof Error ? listenErr.message : String(listenErr);
      console.error("Failed to listen on HTTP port:", errorMsg);
      new Notice(
        `Python Bridge: Failed to start server on port ${this.settings.httpPort}. ${errorMsg}`,
      );
      this.server = null;
    }
  }

  // --- Action Handler ---
  async handleAction(request: JsonRequest): Promise<JsonResponse> {
    const { action, payload } = request;
    console.log(`Executing action: ${action} with payload:`, payload);

    try {
      switch (action) {
        // --- Existing Actions ---
        case "get_all_note_paths":
          return { status: "success", data: this.getAllNotePaths() };

        case "get_active_note_content":
          const activeContent = await this.getActiveNoteContent();
          return activeContent !== null
            ? { status: "success", data: activeContent }
            : { status: "error", error: "No active Markdown note found." };

        case "get_active_note_relative_path":
          const activeRelativePath = this.getActiveNoteRelativePath();
          return activeRelativePath !== null
            ? { status: "success", data: activeRelativePath }
            : { status: "error", error: "No active Markdown note found." };

        case "get_active_note_absolute_path":
          const activeAbsolutePath = this.getActiveNoteAbsolutePath();
          return activeAbsolutePath !== null
            ? { status: "success", data: activeAbsolutePath }
            : {
                status: "error",
                error: "No active note or vault path unavailable.",
              };

        case "get_active_note_title":
          const activeTitle = this.getActiveNoteTitle();
          return activeTitle !== null
            ? { status: "success", data: activeTitle }
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
          const activeFrontmatter = await this.getActiveNoteFrontmatter();
          return { status: "success", data: activeFrontmatter };

        case "show_notification":
          if (typeof payload?.content !== "string") {
            return { status: "error", error: "Invalid payload: 'content' (string) required." };
          }
          const duration = typeof payload?.duration === "number" ? payload.duration : 4000;
          this.showNotification(payload.content, duration);
          return { status: "success", data: null };

        case "modify_note_content":
          if (typeof payload?.filePath !== "string" || typeof payload?.content !== "string") {
            return { status: "error", error: "Invalid payload: 'filePath' and 'content' (strings) required." };
          }
          try {
              await this.modifyNoteContent(payload.filePath, payload.content);
              return { status: "success", data: null };
          } catch (modifyError) {
              const errorMsg = modifyError instanceof Error ? modifyError.message : String(modifyError);
              console.error(`Error in modifyNoteContent for ${payload.filePath}: ${errorMsg}`);
              return { status: "error", error: `Failed to modify note: ${errorMsg}` };
          }

        case "request_user_input":
          if (typeof payload?.scriptName !== "string" || typeof payload?.inputType !== "string" || typeof payload?.message !== "string") {
            return { status: "error", error: "Invalid payload: 'scriptName', 'inputType', 'message' (strings) required." };
          }
          const userInput = await this.requestUserInput(
            payload.scriptName, payload.inputType, payload.message,
            payload.validationRegex, payload.minValue, payload.maxValue, payload.step
          );
          if (userInput === null) {
             console.log("User cancelled input modal.");
             return { status: "error", error: "User cancelled input." };
          }
          return { status: "success", data: userInput };

        // --- NEW Actions ---

        case "get_note_content":
          if (typeof payload?.path !== "string") {
            return { status: "error", error: "Invalid payload: 'path' (string) required." };
          }
          try {
            const content = await this.getNoteContentByPath(payload.path);
            return { status: "success", data: content };
          } catch (error) {
            return { status: "error", error: error instanceof Error ? error.message : String(error) };
          }

        case "get_note_frontmatter":
          if (typeof payload?.path !== "string") {
            return { status: "error", error: "Invalid payload: 'path' (string) required." };
          }
          try {
            const frontmatter = await this.getNoteFrontmatterByPath(payload.path);
            return { status: "success", data: frontmatter };
          } catch (error) {
            return { status: "error", error: error instanceof Error ? error.message : String(error) };
          }

        case "get_selected_text":
          try {
            const selectedText = this.getSelectedText();
            return { status: "success", data: selectedText };
          } catch (error) {
            return { status: "error", error: error instanceof Error ? error.message : String(error) };
          }

        case "replace_selected_text":
          if (typeof payload?.replacement !== "string") {
            return { status: "error", error: "Invalid payload: 'replacement' (string) required." };
          }
          try {
            this.replaceSelectedText(payload.replacement);
            return { status: "success", data: null };
          } catch (error) {
            return { status: "error", error: error instanceof Error ? error.message : String(error) };
          }

        case "open_note":
          if (typeof payload?.path !== "string") {
            return { status: "error", error: "Invalid payload: 'path' (string) required." };
          }
          const newLeaf = typeof payload?.new_leaf === 'boolean' ? payload.new_leaf : false;
          try {
            await this.openNote(payload.path, newLeaf);
            return { status: "success", data: null };
          } catch (error) {
            return { status: "error", error: error instanceof Error ? error.message : String(error) };
          }

        // --- Default ---
        default:
          // Handle the test connection ping gracefully but log it
          if (action === "_test_connection_ping") {
              console.log("Received test connection ping from client.");
              return { status: "error", error: `Unknown action: ${action}` }; // Expected error for test
          }
          console.warn(`Received unknown action: ${action}`);
          return { status: "error", error: `Unknown action: ${action}` };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error executing action "${action}":`, errorMessage);
      return {
        status: "error",
        error: `Failed to execute action "${action}": ${errorMessage}`,
      };
    }
  }

  // --- Obsidian Interaction Helpers ---

  // Helpers for ACTIVE note
  getActiveNoteFile(): TFile | null {
    const activeLeaf = this.app.workspace.activeLeaf;
    return activeLeaf?.view instanceof MarkdownView ? activeLeaf.view.file : null;
  }

  async getActiveNoteContent(): Promise<string | null> {
    const file = this.getActiveNoteFile();
    return file ? this.app.vault.read(file) : null;
  }

  getActiveNoteRelativePath(): string | null {
    return this.getActiveNoteFile()?.path ?? null;
  }

  getActiveNoteAbsolutePath(): string | null {
    const file = this.getActiveNoteFile();
    const vaultPath = this.getCurrentVaultAbsolutePath();
    if (!file || !vaultPath) return null;
    const cleanVaultPath = vaultPath.replace(/[\\/]$/, "");
    return path.join(cleanVaultPath, file.path);
  }

  getActiveNoteTitle(): string | null {
    return this.getActiveNoteFile()?.basename ?? null;
  }

  async getActiveNoteFrontmatter(): Promise<Record<string, any> | null> {
    const file = this.getActiveNoteFile();
    if (!file) return null;
    const metadata = this.app.metadataCache.getFileCache(file);
    return metadata?.frontmatter ?? null;
  }

  // General Helpers
  getCurrentVaultAbsolutePath(): string | null {
    const adapter = this.app.vault.adapter;
    return adapter instanceof FileSystemAdapter ? adapter.getBasePath() : null;
  }

  showNotification(message: string, duration: number = 4000) {
    new Notice(message, duration);
  }

  async modifyNoteContent(absoluteFilePath: string, newContent: string): Promise<void> {
    const vaultPath = this.getCurrentVaultAbsolutePath();
    if (!vaultPath) {
      throw new Error("Cannot modify note: Vault path is unavailable.");
    }
    if (!path.isAbsolute(absoluteFilePath)) {
        throw new Error(`Cannot modify note: Provided path is not absolute: ${absoluteFilePath}`);
    }
    const relativePath = path.relative(vaultPath, absoluteFilePath);
    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
        throw new Error(`Cannot modify note: Path is outside the current vault: ${absoluteFilePath}`);
    }
    const normalizedPath = relativePath.replace(/\\/g, "/");
    const file = this.app.vault.getAbstractFileByPath(normalizedPath);
    if (!(file instanceof TFile)) {
      throw new Error(`Cannot modify note: File not found in vault at path: ${normalizedPath}`);
    }
    console.log(`Attempting to modify note via Vault API: ${normalizedPath}`);
    await this.app.vault.modify(file, newContent);
    console.log(`Note modified successfully: ${normalizedPath}`);
  }

  async requestUserInput(
    scriptName: string, inputType: string, message: string,
    validationRegex?: string, minValue?: number, maxValue?: number, step?: number
  ): Promise<any> {
    return new Promise((resolve) => {
      const modal = new UserInputModal(
        this.app, scriptName, inputType, message,
        (input) => resolve(input),
        validationRegex, minValue, maxValue, step
      );
      modal.open();
    });
  }

  getAllNotePaths(): string[] {
    return this.app.vault.getMarkdownFiles().map((f) => f.path);
  }

  // --- NEW Interaction Helpers ---

  /**
   * Retrieves the full content of a note specified by its vault-relative path.
   * @param relativePath The vault-relative path to the note (e.g., "Folder/My Note.md").
   * @returns The content of the note.
   * @throws Error if the file is not found or is not a Markdown file.
   */
  async getNoteContentByPath(relativePath: string): Promise<string> {
    const file = this.app.vault.getAbstractFileByPath(relativePath);
    if (!(file instanceof TFile)) {
      throw new Error(`File not found or is not a file at path: ${relativePath}`);
    }
    // Optional: Check if it's a markdown file specifically?
    // if (file.extension !== 'md') {
    //   throw new Error(`File is not a Markdown file: ${relativePath}`);
    // }
    return this.app.vault.read(file);
  }

  /**
   * Retrieves the parsed frontmatter of a note specified by its vault-relative path.
   * @param relativePath The vault-relative path to the note.
   * @returns The parsed frontmatter object, or null if no frontmatter exists.
   * @throws Error if the file is not found.
   */
  async getNoteFrontmatterByPath(relativePath: string): Promise<Record<string, any> | null> {
    // Using getFileCache requires a TFile, getCache works directly with path
    const metadata = this.app.metadataCache.getCache(relativePath);
    if (!metadata) {
        // Check if the file exists at all to give a better error
        const fileExists = !!this.app.vault.getAbstractFileByPath(relativePath);
        if (!fileExists) {
            throw new Error(`File not found at path: ${relativePath}`);
        }
        // File exists but no metadata cache (rare, maybe not markdown?)
        console.warn(`No metadata cache found for existing file: ${relativePath}`);
        return null; // Or throw a more specific error if desired
    }
    return metadata.frontmatter ?? null;
  }

  /**
   * Gets the currently selected text in the active Markdown editor.
   * @returns The selected text.
   * @throws Error if no Markdown view is active or no text is selected.
   */
  getSelectedText(): string {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) {
      throw new Error("No active Markdown view found.");
    }
    const editor = view.editor;
    const selection = editor.getSelection();
    // if (!selection) { // Return empty string if nothing is selected, common behavior
    //   throw new Error("No text is currently selected.");
    // }
    return selection;
  }

  /**
   * Replaces the currently selected text in the active Markdown editor.
   * If no text is selected, inserts the text at the cursor position.
   * @param replacement The text to insert or replace the selection with.
   * @throws Error if no Markdown view is active.
   */
  replaceSelectedText(replacement: string): void {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) {
      throw new Error("No active Markdown view found to replace selection in.");
    }
    const editor = view.editor;
    editor.replaceSelection(replacement);
  }

  /**
   * Opens a note in the Obsidian workspace.
   * @param relativePath The vault-relative path of the note to open.
   * @param newLeaf If true, opens the note in a new leaf (tab/split). Defaults to false.
   * @throws Error if the file cannot be opened (e.g., not found).
   */
  async openNote(relativePath: string, newLeaf: boolean = false): Promise<void> {
    console.log(`Requesting to open note: ${relativePath} (newLeaf: ${newLeaf})`);
    // Use openLinkText - it handles finding the file and opening it.
    // It throws an error internally if the link cannot be resolved.
    // The empty string "" for sourcePath is usually sufficient for vault paths.
    await this.app.workspace.openLinkText(relativePath, "", newLeaf);
    console.log(`Successfully requested to open ${relativePath}`);
  }


  // --- Python Script Execution ---
  getScriptsFolderPath(): string {
    const { pythonScriptsFolder } = this.settings;
    if (!pythonScriptsFolder) return "";

    if (path.isAbsolute(pythonScriptsFolder)) {
      return fs.existsSync(pythonScriptsFolder) ? pythonScriptsFolder : "";
    } else {
      const vaultPath = this.getCurrentVaultAbsolutePath();
      if (!vaultPath) {
        console.error("Cannot resolve relative script path: Vault path unavailable.");
        return "";
      }
      const resolvedPath = path.join(vaultPath, pythonScriptsFolder);
      return fs.existsSync(resolvedPath) ? resolvedPath : "";
    }
  }

  async runPythonScript(scriptPath: string) {
    if (this.settings.httpPort !== this.initialHttpPort) {
      new Notice(
        `⚠️ Python Bridge: HTTP Port changed (${this.initialHttpPort} -> ${this.settings.httpPort}). Scripts might target the old port.`,
        8000,
      );
    }

    if (!fs.existsSync(scriptPath)) {
      new Notice(`Python script not found: ${scriptPath}`);
      console.error(`Python script not found: ${scriptPath}`);
      return;
    }

    console.log(`Running Python script: ${scriptPath}`);
    const pythonExecutable = "python3";
    const pythonArgs = this.settings.disablePyCache
      ? ["-B", scriptPath]
      : [scriptPath];
    const scriptName = path.basename(scriptPath);

    try {
      const env = {
        ...process.env,
        OBSIDIAN_HTTP_PORT: String(this.settings.httpPort),
      };
      const pythonProcess: ChildProcess = spawn(pythonExecutable, pythonArgs, { env });

      pythonProcess.stdout?.on("data", (data: Buffer) => {
        console.log(`[Output ${scriptName}]:\n${data.toString().trim()}`);
      });

      pythonProcess.stderr?.on("data", (data: Buffer) => {
        const errorMsg = data.toString().trim();
        console.error(`[Error ${scriptName}]:\n${errorMsg}`);
        new Notice(`Error in ${scriptName}:\n${errorMsg}`, 10000);
      });

      pythonProcess.on("close", (code: number | null) => {
        const exitMsg = `${scriptName} finished with exit code ${code ?? "unknown"}.`;
        console.log(exitMsg);
        if (code !== 0) {
          new Notice(exitMsg, 5000);
        }
      });

      pythonProcess.on("error", (err: Error) => {
        console.error(`Failed starting ${scriptName}:`, err.message);
        new Notice(`Failed to start ${scriptName}: ${err.message}`);
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`Error spawning ${scriptName}:`, errorMsg);
      new Notice(`Error running ${scriptName}: ${errorMsg}`);
    }
  }

  async chooseAndRunPythonScript() {
    const scriptsFolder = this.getScriptsFolderPath();
    if (!scriptsFolder) {
      new Notice("Python scripts folder not found or invalid. Check settings.");
      return;
    }

    let pythonFiles: string[];
    try {
      pythonFiles = fs.readdirSync(scriptsFolder)
        .filter((f) => f.endsWith(".py") && !f.startsWith("."));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      new Notice(`Error reading scripts folder: ${errorMsg}`);
      console.error(`Error reading scripts folder ${scriptsFolder}:`, err);
      return;
    }

    if (pythonFiles.length === 0) {
      new Notice("No Python scripts (.py) found in the specified folder.");
      return;
    }

    const scriptChoices = pythonFiles.map((f) => ({
      label: f,
      value: path.join(scriptsFolder, f),
    }));

    new ScriptSelectionModal(this.app, scriptChoices, (selectedPath) => {
      if (selectedPath) {
        this.runPythonScript(selectedPath);
      } else {
        console.log("Script selection cancelled.");
      }
    }).open();
  }

  async runAllPythonScripts() {
    const scriptsFolder = this.getScriptsFolderPath();
    if (!scriptsFolder) {
      new Notice("Python scripts folder not found or invalid. Check settings.");
      return;
    }

    let pythonFiles: string[];
    try {
      pythonFiles = fs.readdirSync(scriptsFolder)
        .filter((f) => f.endsWith(".py") && !f.startsWith("."));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      new Notice(`Error reading scripts folder: ${errorMsg}`);
      console.error(`Error reading scripts folder ${scriptsFolder}:`, err);
      return;
    }

    if (pythonFiles.length === 0) {
      new Notice("No Python scripts (.py) found in the specified folder.");
      return;
    }

    new Notice(`Running ${pythonFiles.length} Python script(s)...`);
    pythonFiles.forEach(file => {
        const scriptPath = path.join(scriptsFolder, file);
        this.runPythonScript(scriptPath);
    });
  }
} // End of class ObsidianPythonBridge
