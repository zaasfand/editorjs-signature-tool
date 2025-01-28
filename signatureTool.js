import SignaturePad from 'signature_pad';

class SignatureTool {
  /**
   * Defines the toolbox icon and title for the tool.
   * @returns {object} Toolbox configuration
   */
  static get toolbox() {
    return {
      title: 'Signature',
      icon: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 20c5-5 8 0 12-5s6 0 8-3"/>
          <path d="M12 16l4-4c2-2 4 2 6 0" />
          <path d="M4 18c0-2 4-6 6-6s3 3 3 4-3 2-4 2-4 0-4 0z"/>
        </svg>
      `,
    };
  }

  /**
   * Constructor for initializing the tool.
   * @param {object} param0 The initialization parameters
   * @param {object} param0.data The initial data
   * @param {object} param0.config The configuration object
   * @param {object} param0.api The API object
   */
  constructor({ data, config, api }) {
    this.api = api;
    this.data = data || {};
    this.wrapper = null;
    this.config = config;
    this.signaturePad = null;
    this.penColor = '#000000'; // Default pen color
    this.isPopupOpen = false; // Tracks if the popup is open
  }

  /**
   * Renders the tool on the page.
   * @returns {HTMLElement} The wrapper element containing the tool
   */
  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.style.padding = '10px';

    this.renderEditable();

    return this.wrapper;
  }

  /**
   * Renders the editable signature box.
   */
  renderEditable() {
    const signatureBox = document.createElement('div');
    signatureBox.style.width = '300px';
    signatureBox.style.height = '70px';
    signatureBox.style.border = '1px solid #ccc';
    signatureBox.style.display = 'flex';
    signatureBox.style.alignItems = 'center';
    signatureBox.style.justifyContent = 'center';
    signatureBox.style.cursor = 'pointer';
    signatureBox.style.color = '#aaa';

    if (this.data.signature) {
      this._renderSignatureImage(signatureBox);
    } else {
      signatureBox.textContent = 'Click to sign';
      signatureBox.onclick = () => this.openSignaturePad();
      this.wrapper.appendChild(signatureBox);
    }
  }

  /**
   * Renders the signature image if it exists in the data.
   * @param {HTMLElement} signatureBox The signature box element
   */
  _renderSignatureImage(signatureBox) {
    const img = document.createElement('img');
    img.src = this.data.signature;
    img.style.width = '300px';
    img.style.height = 'auto';
    img.style.border = '1px solid #ccc';
    img.style.cursor = 'pointer';

    img.onclick = () => this.openSignaturePad();
    this.wrapper.appendChild(img);
  }

  /**
   * Opens the signature pad in a popup to allow the user to draw their signature.
   */
  openSignaturePad() {
    if (this.isPopupOpen) return; // Prevent opening if already open

    this.isPopupOpen = true;

    const signatureBoxRect = this.wrapper.getBoundingClientRect();
    const popup = this._createSignaturePopup(signatureBoxRect);

    // Append the popup to the body
    document.body.appendChild(popup);

    // Close the popup when clicking outside
    document.addEventListener('click', (event) => {
      if (!popup.contains(event.target) && !this.wrapper.contains(event.target)) {
        this.closePopup(popup);
      }
    });
  }

  /**
   * Creates the signature pad popup.
   * @param {DOMRect} signatureBoxRect The bounding rect of the signature box
   * @returns {HTMLElement} The popup element
   */
  _createSignaturePopup(signatureBoxRect) {
    const popup = document.createElement('div');
    popup.style.position = 'absolute';
    popup.style.top = `${signatureBoxRect.top - 100}px`;
    popup.style.left = `${signatureBoxRect.left + (signatureBoxRect.width / 2) - 150}px`;
    popup.style.padding = '10px';
    popup.style.background = '#fff';
    popup.style.border = '1px solid #ccc';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    popup.style.zIndex = '1000';

    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 70;
    canvas.style.border = '1px solid #ccc';

    this.signaturePad = new SignaturePad(canvas, {
      penColor: this.penColor,
    });

    const insertButton = this._createInsertButton(popup);

    popup.appendChild(canvas);
    popup.appendChild(insertButton);

    return popup;
  }

  /**
   * Creates the insert button for the signature pad.
   * @param {HTMLElement} popup The signature pad popup
   * @returns {HTMLElement} The insert button
   */
  _createInsertButton(popup) {
    const insertButton = document.createElement('button');
    insertButton.textContent = 'Insert';
    insertButton.style.marginTop = '10px';
    insertButton.style.padding = '5px 10px';
    insertButton.style.background = '#4CAF50';
    insertButton.style.border = 'none';
    insertButton.style.borderRadius = '5px';
    insertButton.style.color = '#fff';
    insertButton.style.cursor = 'pointer';
    insertButton.onclick = () => this.insertSignature(popup);

    return insertButton;
  }

  /**
   * Inserts the drawn signature into the signature box.
   * @param {HTMLElement} popup The popup element
   */
  insertSignature(popup) {
    const signatureDataUrl = this.signaturePad.toDataURL();
    this.data.signature = signatureDataUrl;
    this.wrapper.textContent = '';
    this._renderSignatureImage(this.wrapper);
    this.closePopup(popup);
  }

  /**
   * Closes the signature pad popup.
   * @param {HTMLElement} popup The popup element to close
   */
  closePopup(popup) {
    document.body.removeChild(popup);
    this.isPopupOpen = false;
  }

  /**
   * Saves the signature data.
   * @returns {object} The saved signature data
   */
  save() {
    return {
      signature: this.data.signature || '',
    };
  }

  /**
   * Validates the saved signature data.
   * @param {object} savedData The saved data to validate
   * @returns {boolean} True if the signature exists, false otherwise
   */
  validate(savedData) {
    return !!savedData.signature && savedData.signature.length > 0;
  }
}

export default SignatureTool;
