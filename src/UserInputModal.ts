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

	constructor(app: App, scriptName: string, inputType: string, message: string, onSubmit: (input: any) => void, validationRegex?: string, minValue?: number, maxValue?: number, step?: number) {
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
		if (this.inputType === 'text') {
			this.inputEl = contentEl.createEl('input', { type: 'text' });
		} else if (this.inputType === 'number' || this.inputType === 'range') { // Treat 'number' and 'range' similarly for input element
			this.inputEl = contentEl.createEl('input', { type: this.inputType === 'range' ? 'range' : 'number' }); // Use 'range' or 'number' type
			if (this.minValue !== undefined) {
				this.inputEl.setAttribute('min', this.minValue.toString());
			}
			if (this.maxValue !== undefined) {
				this.inputEl.setAttribute('max', this.maxValue.toString());
			}
			if (this.step !== undefined) {
				this.inputEl.setAttribute('step', this.step.toString());
			}
			// Optionally add a display for the current value for range inputs
			if (this.inputType === 'range') {
				const valueDisplay = contentEl.createEl('span', { text: this.inputEl.value });
				valueDisplay.style.marginLeft = '10px'; // Add some spacing
				this.inputEl.addEventListener('input', () => {
					valueDisplay.textContent = (this.inputEl as HTMLInputElement).value;
				});
			}
		} else if (this.inputType === 'boolean' || this.inputType === 'checkbox') { // Accept both 'boolean' and 'checkbox'
			this.inputEl = contentEl.createEl('input', { type: 'checkbox' });
		} else if (this.inputType === 'date') {
			this.inputEl = contentEl.createEl('input', { type: 'date' });
		} else {
			// Handle unknown input types gracefully
			contentEl.createEl('p', { text: `Error: Unknown input type '${this.inputType}' requested.` });
			return; // Don't add submit button if input type is invalid
		}

		// Add some spacing before the button
		contentEl.createEl('div', { attr: { style: 'margin-top: 1em;' } });

		// Use translation for the submit button text
		const submitButton = contentEl.createEl('button', { text: t('MODAL_USER_INPUT_SUBMIT_BUTTON') });
		submitButton.addEventListener('click', () => {
			if (this.inputEl) {
				let inputValue: any;
				// Handle different input types to get the correct value
				if (this.inputType === 'boolean' || this.inputType === 'checkbox') {
					inputValue = (this.inputEl as HTMLInputElement).checked;
				} else if (this.inputType === 'number' || this.inputType === 'range') {
					// Parse as float or int depending on step? For now, parse as float.
					inputValue = parseFloat(this.inputEl.value);
					// Basic validation if min/max are set
					if (this.minValue !== undefined && inputValue < this.minValue) inputValue = this.minValue;
					if (this.maxValue !== undefined && inputValue > this.maxValue) inputValue = this.maxValue;
				} else {
					inputValue = this.inputEl.value;
					// Optional: Add regex validation here if needed for 'text' type
					if (this.inputType === 'text' && this.validationRegex) {
						try {
							const regex = new RegExp(this.validationRegex);
							if (!regex.test(inputValue)) {
								// Show a translated error message
								new Notice(t("NOTICE_INPUT_VALIDATION_FAILED"));
								return; // Prevent closing if validation fails
							}
						} catch (e) {
							console.error("UserInputModal: Invalid validation regex provided:", this.validationRegex, e);
							// Optionally notify the user about the bad regex? Or just proceed without validation.
							// For now, we proceed without validation if regex is bad.
						}
					}
				}
				this.onSubmit(inputValue);
				this.close();
			}
		});

		// Allow submitting with Enter key on text/number inputs
		if (this.inputEl && (this.inputType === 'text' || this.inputType === 'number' || this.inputType === 'date')) {
			this.inputEl.addEventListener('keypress', (event) => {
				if (event.key === 'Enter') {
					event.preventDefault(); // Prevent default form submission behavior
					submitButton.click(); // Trigger the submit button's click handler
				}
			});
			// Focus the input element when the modal opens
			this.inputEl.focus();
		}
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
