import SignaturePad from 'signature_pad';

class SignatureTool {
  // Define the toolbox icon and title
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

  constructor({ data, config, api }) {
    console.log("🚀 ~ SignatureTool ~ constructor ~ data, api:", data, api)
    this.api = api;
    this.data = data || {};
    this.wrapper = null;
    this.config = config;
    this.signaturePad = null;
    this.penColor = '#000000'; // Default pen color
    this.isPopupOpen = false; // To track if the popup is open
  }

  // Render the tool
  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.style.padding = '10px';

    this.renderEditable();

    return this.wrapper;
  }

  renderEditable() {
    const signatureBox = document.createElement('div');
    signatureBox.style.width = '300px'; // Set box width to 300px
    signatureBox.style.height = '70px';
    signatureBox.style.border = '1px solid #ccc';
    signatureBox.style.display = 'flex';
    signatureBox.style.alignItems = 'center';
    signatureBox.style.justifyContent = 'center';
    signatureBox.style.cursor = 'pointer';
    signatureBox.style.color = '#aaa';

    if (this.data.signature) {
      // Show the image if a signature exists
      const img = document.createElement('img');
      img.src = this.data.signature;
      img.style.width = '300px'; // Set image width to 300px
      img.style.height = 'auto';
      img.style.border = '1px solid #ccc';
      img.style.cursor = 'pointer';
      
      // Make the image clickable to edit the signature
      img.onclick = () => this.openSignaturePad();
      this.wrapper.appendChild(img);
    } else {
      // Show placeholder if no signature is added
      signatureBox.textContent = 'Click to sign';
      signatureBox.onclick = () => this.openSignaturePad();
      this.wrapper.appendChild(signatureBox);
    }
  }

  // Open the signature pad in a dropdown-like popup
  openSignaturePad() {
    if (this.isPopupOpen) return; // Prevent opening popup if it's already open
  
    this.isPopupOpen = true;
    
    // Get the position of the signature box
    const signatureBoxRect = this.wrapper.getBoundingClientRect();
  
    const popup = document.createElement('div');
    popup.style.position = 'absolute';
    popup.style.top = `${signatureBoxRect.top - 100}px`; // Position the popup above the box
    popup.style.left = `${signatureBoxRect.left + (signatureBoxRect.width / 2) - 150}px`; // Center the popup horizontally above the box
    popup.style.padding = '10px';
    popup.style.background = '#fff';
    popup.style.border = '1px solid #ccc';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    popup.style.zIndex = '1000';
    
    // Create canvas for drawing
    const canvas = document.createElement('canvas');
    canvas.width = 300; // Set canvas width to 300px
    canvas.height = 70;
    canvas.style.border = '1px solid #ccc';
  
    // Initialize the signature pad
    this.signaturePad = new SignaturePad(canvas, {
      penColor: this.penColor,
    });
  
    // Create a <br> element to add a line break before the button
    const lineBreak = document.createElement('br');


    // Create the insert button
    const insertButton = document.createElement('button');
    insertButton.textContent = 'Insert';
    insertButton.style.marginTop = '10px';
    insertButton.style.marginleft = '1px';
    insertButton.style.padding = '5px 10px';
    insertButton.style.background = '#4CAF50';
    insertButton.style.border = 'none';
    insertButton.style.borderRadius = '5px';
    insertButton.style.color = '#fff';
    insertButton.style.cursor = 'pointer';
    insertButton.onclick = () => this.insertSignature(popup);
  
    // Add canvas and insert button to the popup
    popup.appendChild(canvas);
    popup.appendChild(lineBreak); // Add the line break first
    popup.appendChild(insertButton);
  
    // Append the popup to the body
    document.body.appendChild(popup);
  
    // Close the popup when clicking outside
    document.addEventListener('click', (event) => {
      if (!popup.contains(event.target) && !this.wrapper.contains(event.target)) {
        this.closePopup(popup);
      }
    });
  }
  

  // Insert the signature into the box
  insertSignature(popup) {
    const signatureDataUrl = this.signaturePad.toDataURL();
    this.data.signature = signatureDataUrl; // Save the signature
    this.wrapper.textContent = ''; // Clear the placeholder text
    const img = document.createElement('img');
    img.src = signatureDataUrl;
    img.style.width = '300px'; // Set image width to 300px
    img.style.height = 'auto';
    img.style.border = '1px solid #ccc';
    img.style.cursor = 'pointer';

    // Make the inserted signature image clickable to edit it
    img.onclick = () => this.openSignaturePad();

    this.wrapper.appendChild(img); // Insert the signature as an image
    this.closePopup(popup); // Close the popup
  }

  // Close the popup
  closePopup(popup) {
    document.body.removeChild(popup);
    this.isPopupOpen = false;
  }

  // Save the data
  save() {
    return {
      signature: this.data.signature || '', // Save the signature URL
    };
  }

  // Validate the saved data (ensure a signature exists)
  validate(savedData) {
    return !!savedData.signature && savedData.signature.length > 0;
  }
}

export default SignatureTool;
