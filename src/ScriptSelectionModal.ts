// --- src/ScriptSelectionModal.ts ---
import { App, SuggestModal } from 'obsidian';
import { t } from './lang/translations'; // Import the translation function

// Interface for script choices shown in the modal
interface ScriptChoice {
  label: string; // Filename displayed to the user
  value: string; // Full path used for execution
}

/**
 * Modal for selecting a Python script from a list.
 */
export default class ScriptSelectionModal extends SuggestModal<ScriptChoice> {
  scriptChoices: ScriptChoice[];
  onChoose: (result: string | null) => void; // Callback with the selected script's full path or null

  /**
   * Creates an instance of ScriptSelectionModal.
   * @param app The Obsidian App instance.
   * @param scriptChoices Array of script choices { label, value }.
   * @param onChoose Callback function executed with the selected script path or null if cancelled.
   */
  constructor(app: App, scriptChoices: ScriptChoice[], onChoose: (result: string | null) => void) {
    super(app);
    this.scriptChoices = scriptChoices;
    this.onChoose = onChoose;
    // Use translation for the placeholder
    this.setPlaceholder(t('MODAL_SELECT_SCRIPT_PLACEHOLDER'));
  }

  /**
   * Returns suggestions matching the user's query.
   * Filters the choices based on the label (filename).
   * @param query The text entered by the user.
   * @returns An array of matching ScriptChoice objects.
   */
  getSuggestions(query: string): ScriptChoice[] {
    const lowerCaseQuery = query.toLowerCase();
    return this.scriptChoices.filter(choice => choice.label.toLowerCase().includes(lowerCaseQuery));
  }

  /**
   * Renders a single suggestion item in the modal list.
   * Displays the script filename (label).
   * @param choice The ScriptChoice object to render.
   * @param el The HTML element to render into.
   */
  renderSuggestion(choice: ScriptChoice, el: HTMLElement) {
    el.createEl('div', { text: choice.label });
  }

  /**
   * Called when the user selects a suggestion from the list.
   * Executes the onChoose callback with the full path (value) of the selected script.
   * @param choice The selected ScriptChoice object.
   * @param evt The mouse or keyboard event that triggered the selection.
   */
  onChooseSuggestion(choice: ScriptChoice) {
    this.onChoose(choice.value); // Pass the full path back
  }

  /**
   * Called when the modal is closed (e.g., by pressing Esc or clicking outside).
   * Note: SuggestModal typically handles not calling onChooseSuggestion in this case.
   * If explicit cancellation handling is needed, it might require overriding onClose
   * and checking if a suggestion was chosen. For now, we rely on the default behavior.
   */
  // onClose() {
  //   // If necessary, add logic here to explicitly call this.onChoose(null)
  //   // if the modal is closed without a selection.
  // }
}
