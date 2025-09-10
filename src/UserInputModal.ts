// --- src/UserInputModal.ts ---
import { App, Modal, Notice } from 'obsidian'; // Import Notice here
import { t } from './lang/translations'; // Import the translation function

// Modal class for requesting user input
export default class UserInputModal extends Modal {
  scriptName: string;
  inputType: string;
  message: string;
  validationRegex?: string;
  minValue?: number;
  maxValue?: number;
  step?: number;
  onSubmit: (input: any) => void;
  inputEl: HTMLInputElement | undefined;

  constructor(
    app: App,
    scriptName: string,
    inputType: string,
    message: string,
    onSubmit: (input: any) => void,
    validationRegex?: string,
    minValue?: number,
    maxValue?: number,
    step?: number
  ) {
    super(app);
    this.scriptName = scriptName; // Comes from Python, not translated here
    this.inputType = inputType;
    this.message = message; // Comes from Python, not translated here
    this.onSubmit = onSubmit;
    this.validationRegex = validationRegex;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.step = step;
  }

  onOpen() {
    const { contentEl } = this;
    // Title and message come from the Python script via payload
    contentEl.createEl('h2', { text: this.scriptName });
    contentEl.createEl('p', { text: this.message });

    // Create input element based on type
    if (this.inputType === 'text') this.inputEl = contentEl.createEl('input', { type: 'text' });
    else if (this.inputType === 'number' || this.inputType === 'range') {
      // Treat 'number' and 'range' similarly for input element
      this.inputEl = contentEl.createEl('input', {
        type: this.inputType === 'range' ? 'range' : 'number',
      }); // Use 'range' or 'number' type
      if (this.minValue !== undefined) this.inputEl.setAttribute('min', this.minValue.toString());
      if (this.maxValue !== undefined) this.inputEl.setAttribute('max', this.maxValue.toString());
      if (this.step !== undefined) this.inputEl.setAttribute('step', this.step.toString());
      // Optionally add a display for the current value for range inputs
      if (this.inputType === 'range') {
        const valueDisplay = contentEl.createEl('span', { text: this.inputEl.value });
        valueDisplay.style.marginLeft = '10px'; // Add some spacing
        this.inputEl.addEventListener('input', () => {
          valueDisplay.textContent = (this.inputEl as HTMLInputElement).value;
        });
      }
    } else if (this.inputType === 'boolean' || this.inputType === 'checkbox')
      this.inputEl = contentEl.createEl('input', { type: 'checkbox' }); // Accept both 'boolean' and 'checkbox'
    else if (this.inputType === 'date')
      this.inputEl = contentEl.createEl('input', { type: 'date' });
    else {
      contentEl.createEl('p', { text: `Error: Unknown input type '${this.inputType}' requested.` });
      return;
    } // Handle unknown input types gracefully // Don't add submit button if input type is invalid

    // Add some spacing before the button
    contentEl.createEl('div', { attr: { style: 'margin-top: 1em;' } });

    // Use translation for the submit button text
    const submitButton = contentEl.createEl('button', {
      text: t('MODAL_USER_INPUT_SUBMIT_BUTTON'),
    });
    submitButton.addEventListener('click', () => {
      if (this.inputEl) {
        let inputValue: any;
        let validationPassed = true; // Flag to track validation status

        // Handle different input types to get the correct value
        if (this.inputType === 'boolean' || this.inputType === 'checkbox') {
          inputValue = (this.inputEl as HTMLInputElement).checked;
          this.inputEl.classList.remove('python-bridge-input-error'); // Reset border for checkbox/boolean
          this.inputEl.style.borderColor = ''; // Reset border for checkbox/boolean
        } else if (this.inputType === 'number' || this.inputType === 'range') {
          inputValue = parseFloat(this.inputEl.value);
          // Basic validation if min/max are set
          if (this.minValue !== undefined && inputValue < this.minValue) inputValue = this.minValue;
          if (this.maxValue !== undefined && inputValue > this.maxValue) inputValue = this.maxValue;
          // Check if the result is a valid number (e.g., if input was empty or non-numeric)
          if (isNaN(inputValue)) {
            // Handle potential NaN if input is cleared or invalid for number/range
            // Decide on behavior: default value? error? For now, let's show notice and prevent submit
            new Notice('Invalid number input.'); // Consider translating this if needed
            this.inputEl.classList.add('python-bridge-input-error');
            this.inputEl.focus();
            validationPassed = false; // Mark validation as failed
          } else {
            this.inputEl.classList.remove('python-bridge-input-error');
          }
        } else {
          // Includes 'text', 'date', etc.
          inputValue = this.inputEl.value;
          // Optional: Add regex validation here if needed for 'text' type
          if (this.inputType === 'text' && this.validationRegex) {
            try {
              const regex = new RegExp(this.validationRegex);
              if (!regex.test(inputValue)) {
                this.inputEl.classList.add('python-bridge-input-error');
                this.inputEl.focus(); // Set focus back to the input field
                new Notice(t('NOTICE_INPUT_VALIDATION_FAILED')); // Show translated error
                validationPassed = false; // Mark validation as failed
              } else {
                this.inputEl.classList.remove('python-bridge-input-error');
              }
            } catch (e) {
              console.error(
                'UserInputModal: Invalid validation regex provided:',
                this.validationRegex,
                e
              );
              this.inputEl.classList.remove('python-bridge-input-error');
              // Proceed without validation if regex itself is bad
            }
          } else {
            // Reset border for other types like 'date' or 'text' without regex
            this.inputEl.classList.remove('python-bridge-input-error');
          }
        }

        // Only submit and close if validation passed
        if (validationPassed) {
          this.onSubmit(inputValue);
          this.close();
        }
        // If validationPassed is false, the modal remains open due to the logic above
      }
    });

    // Allow submitting with Enter key on text/number/date inputs
    if (
      this.inputEl &&
      (this.inputType === 'text' || this.inputType === 'number' || this.inputType === 'date')
    ) {
      this.inputEl.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
          event.preventDefault(); // Prevent default form submission behavior
          submitButton.click(); // Trigger the submit button's click handler
        }
      });
      this.inputEl.focus(); // Focus the input element when the modal opens
    }
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
