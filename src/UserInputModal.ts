import { App, Modal } from 'obsidian';

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
        } else if (this.inputType === 'number') {
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
        } else if (this.inputType === 'boolean') {
            this.inputEl = contentEl.createEl('input', { type: 'checkbox' });
        } else if (this.inputType === 'date') {
            this.inputEl = contentEl.createEl('input', { type: 'date' });
        }

        const submitButton = contentEl.createEl('button', { text: 'Submit' });
        submitButton.addEventListener('click', () => {
            if (this.inputEl) {
                let inputValue: any;
                if (this.inputType === 'boolean') {
                    inputValue = (this.inputEl as HTMLInputElement).checked;
                } else {
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
