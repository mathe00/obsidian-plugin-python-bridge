// --- src/ActivationWarningModal.ts ---
import { App, Modal, ButtonComponent } from 'obsidian';
import { t } from './lang/translations';

export default class ActivationWarningModal extends Modal {
  scriptName: string;
  onActivate: () => void;

  constructor(app: App, scriptName: string, onActivate: () => void) {
    super(app);
    this.scriptName = scriptName;
    this.onActivate = onActivate;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h2', {
      text: t('ACTIVATION_WARNING_TITLE'),
    });

    const warningText = contentEl.createDiv('python-bridge-warning-text');
    warningText.createEl('p', {
      text: t('ACTIVATION_WARNING_MESSAGE').replace(
        '{scriptName}',
        this.scriptName
      ),
    });

    const risksList = contentEl.createEl('ul');
    risksList.createEl('li', { text: t('ACTIVATION_WARNING_RISK_FILES') });
    risksList.createEl('li', { text: t('ACTIVATION_WARNING_RISK_NETWORK') });
    risksList.createEl('li', { text: t('ACTIVATION_WARNING_RISK_SYSTEM') });

    const securityNote = contentEl.createDiv('python-bridge-security-note');
    securityNote.createEl('p', {
      text: t('ACTIVATION_WARNING_SECURITY_NOTE'),
    });

    // Link to README security section
    const readmeLink = contentEl.createEl('p');
    readmeLink.createEl('a', {
      text: t('ACTIVATION_WARNING_READMORE'),
      href: 'https://github.com/sst/obsidian-python-bridge#security-considerations',
      cls: 'external-link',
    });

    const buttonContainer = contentEl.createDiv('python-bridge-modal-buttons');

    // Cancel button
    const cancelButton = new ButtonComponent(buttonContainer);
    cancelButton.setButtonText(t('ACTIVATION_WARNING_CANCEL')).onClick(() => {
      this.close();
    });

    // Activate Anyway button (prominent)
    const activateButton = new ButtonComponent(buttonContainer);
    activateButton
      .setButtonText(t('ACTIVATION_WARNING_ACTIVATE_ANYWAY'))
      .setCta()
      .onClick(() => {
        this.onActivate();
        this.close();
      });

    // Add some spacing
    contentEl.createEl('div', { attr: { style: 'margin-top: 1em;' } });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
