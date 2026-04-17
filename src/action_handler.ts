// --- src/action_handler.ts ---
// Lean dispatcher: looks up the action in the registry, validates, executes,
// and wraps the result in a JsonResponse with audit logging.

import type ObsidianPythonBridge from './main';
import type { JsonRequest, JsonResponse } from './types';
import { actionRegistry } from './action_registry';
import { logApiAction } from './audit_logger';

/**
 * Dispatches an incoming JSON request to the appropriate action handler.
 *
 * Flow:
 *   1. Look up the action in the registry
 *   2. Run the optional payload validator
 *   3. Execute the action (catches errors)
 *   4. Wrap result in JsonResponse and log the outcome
 *
 * @param plugin  - The plugin instance.
 * @param request - The parsed JSON request from the Python client.
 * @returns A JSON response object.
 */
export async function dispatchAction(
  plugin: ObsidianPythonBridge,
  request: JsonRequest
): Promise<JsonResponse> {
  const { action, payload = {} } = request;
  const sourceScript = payload?.scriptPath as string | undefined;

  plugin.logDebug(`Executing action: ${action} with payload:`, payload);

  // --- 1. Look up action ---
  const definition = actionRegistry[action];
  if (!definition) {
    const errorMsg = `Unknown action: ${action}`;
    plugin.logWarn(errorMsg);
    logApiAction(plugin, action, 'error', sourceScript, errorMsg);
    return { status: 'error', error: errorMsg };
  }

  // --- 2. Validate payload ---
  if (definition.validate) {
    const validationError = definition.validate(payload);
    if (validationError) {
      logApiAction(plugin, action, 'error', sourceScript, validationError);
      return { status: 'error', error: validationError };
    }
  }

  // --- 3. Execute action ---
  try {
    const data = await definition.execute(plugin, payload);
    logApiAction(plugin, action, 'success', sourceScript);
    return { status: 'success', data };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    plugin.logError(`Error executing action "${action}":`, errorMsg);
    if (error instanceof Error && error.stack) {
      plugin.logError('Stack trace:', error.stack);
    }
    logApiAction(plugin, action, 'error', sourceScript, errorMsg);
    return {
      status: 'error',
      error: `Failed to execute action "${action}": ${errorMsg}`,
    };
  }
}
