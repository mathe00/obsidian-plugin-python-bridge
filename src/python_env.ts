// --- src/python_env.ts ---
// Centralizes Python process environment construction (PYTHONPATH, env vars, args).
// Eliminates duplication across python_executor.ts and event_handler.ts.

import * as path from 'path';
import * as os from 'os';
import type ObsidianPythonBridge from './main';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Options for building the Python process environment. */
export interface PythonEnvOptions {
  /** Extra environment variables to merge into the base env. */
  extraVars?: Record<string, string>;
  /** Whether this is a settings-discovery invocation (sets OBSIDIAN_BRIDGE_MODE). */
  isDiscovery?: boolean;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Builds the full environment object for spawning a Python child process.
 *
 * Centralizes three previously duplicated concerns:
 *   1. PYTHONPATH construction (script dir + optional plugin dir + existing)
 *   2. Common Obsidian env vars (OBSIDIAN_HTTP_PORT, OBSIDIAN_BRIDGE_ACTIVE, …)
 *   3. Optional overrides (discovery mode, event vars, token, etc.)
 *
 * @param plugin   - The plugin instance (reads settings, port, plugin dir).
 * @param scriptDir - Absolute path to the directory containing the script.
 * @param options  - Optional overrides (extraVars, isDiscovery).
 * @returns A plain object suitable for `spawn(cmd, args, { env })`.
 */
export function buildPythonEnv(
  plugin: ObsidianPythonBridge,
  scriptDir: string,
  options: PythonEnvOptions = {}
): Record<string, string> {
  const { extraVars = {}, isDiscovery = false } = options;

  // --- 1. Build PYTHONPATH ---
  const pythonPathEntries: string[] = [];

  // a) Script's own directory (first, so local imports win)
  pythonPathEntries.push(scriptDir);

  // b) Plugin directory (optional, for importing ObsidianPluginDevPythonToJS.py)
  if (plugin.settings.autoSetPYTHONPATH) {
    if (plugin.pluginDirAbsPath) {
      pythonPathEntries.push(plugin.pluginDirAbsPath);
    } else {
      plugin.logWarn(
        'Plugin directory path not available for PYTHONPATH. Library might not be importable even if autoSetPYTHONPATH is enabled.'
      );
    }
  }

  // c) Preserve any pre-existing PYTHONPATH from the parent process
  let pythonPath = pythonPathEntries.join(path.delimiter);
  if (process.env.PYTHONPATH) {
    pythonPath = `${pythonPath}${path.delimiter}${process.env.PYTHONPATH}`;
  }

  // --- 2. Build base env ---
  const env: Record<string, string> = {
    ...(process.env as Record<string, string>),
    OBSIDIAN_HTTP_PORT: plugin.initialHttpPort.toString(),
    OBSIDIAN_BRIDGE_ACTIVE: 'true',
    PYTHONPATH: pythonPath,
  };

  // --- 3. Optional: discovery mode ---
  if (isDiscovery) {
    env.OBSIDIAN_BRIDGE_MODE = 'discovery';
  }

  // --- 4. Optional: __pycache__ suppression ---
  if (plugin.settings.disablePyCache) {
    // Redirect __pycache__ to a temp directory so script folders stay clean.
    env.PYTHONPYCACHEPREFIX = os.tmpdir();
    // Also set PYTHONDONTWRITEBYTECODE=1 (env var equivalent of Python's -B flag).
    // This is critical for `uv` support: we cannot pass -B as a CLI argument to
    // uv without breaking its dependency resolution (uv run python -B would
    // bypass PEP 723 / pyproject.toml handling). Using the env var achieves the
    // same result for ALL Python commands (uv and non-uv alike).
    env.PYTHONDONTWRITEBYTECODE = '1';
  }

  // --- 5. Merge caller-provided extras (e.g. event vars, script path, token) ---
  return { ...env, ...extraVars };
}

/**
 * Builds the command-line argument array for spawning a Python child process.
 *
 * Handles the two execution modes:
 *   - `uv`      → `uv run script.py [extraArgs…]`
 *   - `python*` → `[-B] script.py [extraArgs…]`
 *
 * For `uv`, we ALWAYS use the `uv run script.py` form (never `uv run python …`).
 * This preserves uv's dependency management features (PEP 723 inline script
 * metadata, pyproject.toml resolution, automatic venv creation). When
 * `disablePyCache` is true and the command is `uv`, the `-B` equivalent is
 * handled via the `PYTHONDONTWRITEBYTECODE` environment variable in
 * `buildPythonEnv()` instead of a CLI flag, because inserting `python -B`
 * between `uv run` and the script path would bypass uv's dependency resolution.
 *
 * @param pythonCmd      - The resolved Python command (e.g. 'python3', 'uv').
 * @param scriptPath     - Absolute path to the script to execute.
 * @param disablePyCache - Whether to suppress .pyc file creation.
 *                         For standard Python: passed as `-B` CLI flag.
 *                         For uv: handled via env var (see buildPythonEnv).
 * @param extraArgs      - Additional arguments to append after the script path.
 * @returns Argument array ready for `spawn(cmd, args)`.
 */
export function buildPythonArgs(
  pythonCmd: string,
  scriptPath: string,
  disablePyCache: boolean,
  extraArgs: string[] = []
): string[] {
  if (pythonCmd === 'uv') {
    // Always use 'uv run script.py' to preserve uv's dependency management.
    // The -B flag is NOT injected here for uv; it's handled via
    // PYTHONDONTWRITEBYTECODE env var in buildPythonEnv() instead.
    return ['run', scriptPath, ...extraArgs];
  }
  // Standard Python interpreter: -B flag suppresses bytecode writing
  const base = disablePyCache ? ['-B'] : [];
  return [...base, scriptPath, ...extraArgs];
}
