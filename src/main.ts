// --- src/main.ts ---
import {
  App,
  Notice,
  Plugin,
  TFile,
  MarkdownView,
  FileSystemAdapter,
  PluginSettingTab,
  Setting, // Import Setting here
} from "obsidian";
import { spawn, ChildProcess } from "child_process";
import * as fs from "fs";
import * as http from "http"; // Use http instead of net
import * as path from "path";
import * as os from "os"; // Needed for default port logic maybe

// Import other components
import PythonBridgeSettingTab from "./PythonBridgeSettingTab";
import UserInputModal from "./UserInputModal";
import ScriptSelectionModal from "./ScriptSelectionModal";

// --- Interfaces ---
interface PythonBridgeSettings {
  pythonScriptsFolder: string;
  httpPort: number; // Changed from socketPath to httpPort
  disablePyCache: boolean;
}

const DEFAULT_PORT = 27123; // Default HTTP port

const DEFAULT_SETTINGS: PythonBridgeSettings = {
  pythonScriptsFolder: "",
  httpPort: DEFAULT_PORT, // Use port number
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
  server: http.Server | null = null; // Changed from net.Server to http.Server
  initialHttpPort: number = 0; // Track initial port for restart notice

  async onload() {
    console.log("Loading Obsidian Python Bridge plugin...");
    await this.loadSettings();
    this.initialHttpPort = this.settings.httpPort;

    this.addSettingTab(new PythonBridgeSettingTab(this.app, this));
    this.addCommands();
    this.startHttpServer(); // Renamed function

    this.registerEvent(
      this.app.workspace.on("quit", () => {
        this.stopHttpServer(); // Renamed function
      }),
    );
    console.log("Obsidian Python Bridge plugin loaded.");
  }

  onunload() {
    console.log("Unloading Obsidian Python Bridge plugin...");
    this.stopHttpServer(); // Renamed function
    console.log("Obsidian Python Bridge plugin unloaded.");
  }

  // --- Settings Management ---
  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData(),
    );
    // Ensure port is a number
    if (typeof this.settings.httpPort !== "number") {
      console.warn(
        `Invalid httpPort loaded (${this.settings.httpPort}), resetting to default ${DEFAULT_PORT}`,
      );
      this.settings.httpPort = DEFAULT_PORT;
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
    // Check if port changed and restart server if needed
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
      this.initialHttpPort = this.settings.httpPort; // Update tracked port
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
    this.stopHttpServer(); // Ensure clean state

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

        // Basic routing and method check
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

        req.on("end", async () => {
          let request: JsonRequest;
          let response: JsonResponse;

          try {
            console.log(`Attempting to parse JSON request body: ${body}`);
            request = JSON.parse(body);

            // Basic validation of parsed request
            if (
              !request ||
              typeof request !== "object" ||
              typeof request.action !== "string"
            ) {
              throw new Error("Invalid JSON request structure. 'action' field is missing or invalid.");
            }

            console.log(`Handling action: ${request.action}`);
            response = await this.handleAction(request); // Process the action
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

          // Send the response back
          const responseJson = JSON.stringify(response);
          res.writeHead(response.status === "success" ? 200 : 500, { // Use 500 for server-side errors during processing
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
      this.server = null; // Ensure server is marked as stopped
    });

    try {
      // Listen only on localhost for security
      this.server.listen(this.settings.httpPort, "127.0.0.1", () => {
        console.log(
          `HTTP server listening on http://127.0.0.1:${this.settings.httpPort}`,
        );
        // No chmod needed for HTTP ports
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

  // handleAction remains largely the same, as it deals with application logic, not transport
  async handleAction(request: JsonRequest): Promise<JsonResponse> {
    const { action, payload } = request;
    console.log(`Executing action: ${action} with payload:`, payload);

    try {
      switch (action) {
        case "get_all_note_paths":
          const paths = this.getAllNotePaths();
          return { status: "success", data: paths };

        case "get_active_note_content":
          const content = await this.getActiveNoteContent();
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
          const frontmatter = await this.getActiveNoteFrontmatter();
          return { status: "success", data: frontmatter }; // null is a valid success case

        case "show_notification":
          if (typeof payload?.content !== "string") {
            return {
              status: "error",
              error: "Invalid payload: 'content' (string) required.",
            };
          }
          const duration =
            typeof payload?.duration === "number" ? payload.duration : 4000;
          console.log(
            `Showing notification: "${payload.content}", duration: ${duration}`,
          );
          this.showNotification(payload.content, duration);
          console.log("Notification shown.");
          return { status: "success", data: null };

        case "modify_note_content":
          if (
            typeof payload?.filePath !== "string" ||
            typeof payload?.content !== "string"
          ) {
            return {
              status: "error",
              error:
                "Invalid payload: 'filePath' and 'content' (strings) required.",
            };
          }
          // modifyNoteContent now needs to handle potential errors better
          try {
              await this.modifyNoteContent(payload.filePath, payload.content);
              return { status: "success", data: null };
          } catch (modifyError) {
              const errorMsg = modifyError instanceof Error ? modifyError.message : String(modifyError);
              console.error(`Error in modifyNoteContent for ${payload.filePath}: ${errorMsg}`);
              return { status: "error", error: `Failed to modify note: ${errorMsg}` };
          }


        case "request_user_input":
          if (
            typeof payload?.scriptName !== "string" ||
            typeof payload?.inputType !== "string" ||
            typeof payload?.message !== "string"
          ) {
            return {
              status: "error",
              error:
                "Invalid payload: 'scriptName', 'inputType', 'message' (strings) required.",
            };
          }
          const userInput = await this.requestUserInput(
            payload.scriptName,
            payload.inputType,
            payload.message,
            payload.validationRegex,
            payload.minValue,
            payload.maxValue,
            payload.step,
          );
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
    } catch (error) {
      // Catch errors from the specific action handlers (e.g., file system errors)
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`Error executing action "${action}":`, errorMessage);
      return {
        status: "error",
        error: `Failed to execute action "${action}": ${errorMessage}`,
      };
    }
  }

  // --- Obsidian Interaction Helpers (Unchanged) ---
  getActiveNoteFile(): TFile | null {
    const activeLeaf = this.app.workspace.activeLeaf;
    return activeLeaf?.view instanceof MarkdownView
      ? activeLeaf.view.file
      : null;
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
    // Ensure vaultPath doesn't have trailing slash for cleaner joining
    const cleanVaultPath = vaultPath.replace(/[\\/]$/, "");
    return path.join(cleanVaultPath, file.path);
  }

  getActiveNoteTitle(): string | null {
    return this.getActiveNoteFile()?.basename ?? null;
  }

  getCurrentVaultAbsolutePath(): string | null {
    const adapter = this.app.vault.adapter;
    return adapter instanceof FileSystemAdapter ? adapter.getBasePath() : null;
  }

  async getActiveNoteFrontmatter(): Promise<Record<string, any> | null> {
    const file = this.getActiveNoteFile();
    if (!file) return null;
    const metadata = this.app.metadataCache.getFileCache(file);
    // Return Obsidian's parsed frontmatter directly, or null if none
    return metadata?.frontmatter ?? null;
  }

  showNotification(message: string, duration: number = 4000) {
    new Notice(message, duration);
  }

  async modifyNoteContent(
    absoluteFilePath: string,
    newContent: string,
  ): Promise<void> {
    const vaultPath = this.getCurrentVaultAbsolutePath();
    if (!vaultPath) {
      throw new Error(
        "Cannot modify note: Vault path is unavailable (non-filesystem adapter?).",
      );
    }

    // Ensure input path is absolute
    if (!path.isAbsolute(absoluteFilePath)) {
        throw new Error(`Cannot modify note: Provided path is not absolute: ${absoluteFilePath}`);
    }

    // Calculate relative path carefully
    const relativePath = path.relative(vaultPath, absoluteFilePath);

    // Prevent path traversal attempts (e.g., ../../..)
    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
        throw new Error(`Cannot modify note: Path is outside the current vault: ${absoluteFilePath}`);
    }

    // Normalize to forward slashes for Obsidian API
    const normalizedPath = relativePath.replace(/\\/g, "/");

    const file = this.app.vault.getAbstractFileByPath(normalizedPath);
    if (!(file instanceof TFile)) {
      throw new Error(
        `Cannot modify note: File not found in vault at normalized path: ${normalizedPath} (derived from ${absoluteFilePath})`,
      );
    }
    console.log(`Attempting to modify note via Vault API: ${normalizedPath}`);
    await this.app.vault.modify(file, newContent);
    console.log(`Note modified successfully: ${normalizedPath}`);
  }

  async requestUserInput(
    scriptName: string,
    inputType: string,
    message: string,
    validationRegex?: string,
    minValue?: number,
    maxValue?: number,
    step?: number,
  ): Promise<any> { // Returns null if cancelled
    return new Promise((resolve) => {
      const modal = new UserInputModal(
        this.app,
        scriptName,
        inputType,
        message,
        (input) => resolve(input), // Resolve with input or null on cancel
        validationRegex,
        minValue,
        maxValue,
        step,
      );
      modal.open();
    });
  }

  getAllNotePaths(): string[] {
    return this.app.vault.getMarkdownFiles().map((f) => f.path);
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
    // Check if port changed since load (less critical now, but good practice)
    if (this.settings.httpPort !== this.initialHttpPort) {
      new Notice(
        `⚠️ Python Bridge: HTTP Port changed (${this.initialHttpPort} -> ${this.settings.httpPort}). Scripts might target the old port until Obsidian restarts or settings are saved again.`,
        8000,
      );
      // Optionally force restart server here if desired, but saving settings already does
    }

    if (!fs.existsSync(scriptPath)) {
      new Notice(`Python script not found: ${scriptPath}`);
      console.error(`Python script not found: ${scriptPath}`);
      return;
    }

    console.log(`Running Python script: ${scriptPath}`);
    const pythonExecutable = "python3"; // Consider making this configurable
    const pythonArgs = this.settings.disablePyCache
      ? ["-B", scriptPath]
      : [scriptPath];
    const scriptName = path.basename(scriptPath);

    try {
      // Pass HTTP port via environment variable
      const env = {
        ...process.env,
        OBSIDIAN_HTTP_PORT: String(this.settings.httpPort),
      };
      const pythonProcess: ChildProcess = spawn(pythonExecutable, pythonArgs, {
        env,
      });

      pythonProcess.stdout?.on("data", (data: Buffer) => {
        console.log(`[Output ${scriptName}]:\n${data.toString().trim()}`);
        // Optionally show output in a notice? Could be noisy.
        // new Notice(`Output from ${scriptName}:\n${data.toString().trim()}`, 5000);
      });

      pythonProcess.stderr?.on("data", (data: Buffer) => {
        const errorMsg = data.toString().trim();
        console.error(`[Error ${scriptName}]:\n${errorMsg}`);
        // Show stderr output prominently as it likely indicates script errors
        new Notice(`Error in ${scriptName}:\n${errorMsg}`, 10000);
      });

      pythonProcess.on("close", (code: number | null) => {
        const exitMsg = `${scriptName} finished with exit code ${
          code ?? "unknown"
        }.`;
        console.log(exitMsg);
        if (code !== 0) {
          new Notice(exitMsg, 5000); // Notify if script exited with an error code
        }
      });

      pythonProcess.on("error", (err: Error) => {
        // Errors spawning the process itself
        console.error(`Failed starting ${scriptName}:`, err.message);
        new Notice(`Failed to start ${scriptName}: ${err.message}`);
      });
    } catch (error) {
      // Catch errors in the spawn call itself (e.g., executable not found)
      const errorMsg =
        error instanceof Error ? error.message : String(error);
      console.error(`Error spawning ${scriptName}:`, errorMsg);
      new Notice(`Error running ${scriptName}: ${errorMsg}`);
    }
  }

  async chooseAndRunPythonScript() {
    const scriptsFolder = this.getScriptsFolderPath();
    if (!scriptsFolder) { // Already checks existence in getScriptsFolderPath
      new Notice(
        "Python scripts folder not found or invalid. Check plugin settings.",
      );
      return;
    }

    let pythonFiles: string[];
    try {
      pythonFiles = fs
        .readdirSync(scriptsFolder)
        .filter((f) => f.endsWith(".py") && !f.startsWith(".")); // Ignore hidden files
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
      new Notice(
        "Python scripts folder not found or invalid. Check plugin settings.",
      );
      return;
    }

    let pythonFiles: string[];
    try {
      pythonFiles = fs
        .readdirSync(scriptsFolder)
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
    pythonFiles.forEach((file) => {
      const scriptPath = path.join(scriptsFolder, file);
      // Run scripts sequentially with a small delay? Or concurrently?
      // Running concurrently might overwhelm the server or Obsidian API if many scripts run
      // Let's run them concurrently for now, as before.
      this.runPythonScript(scriptPath); // Run without await for concurrency
    });
  }
} // End of class ObsidianPythonBridge
