// Simulated decryption function (replace with your actual decryption algorithm)
function decrypt(encrypted) {
  return atob(encrypted); // Decodes Base64-encoded strings
}

// Get the query string from the URL
const urlParams = new URLSearchParams(window.location.search);

// Get the encrypted query parameter names and values
const encryptedUniqueCode = urlParams.get('dW5pcXVlQ29kZQ==');  // Encrypted "uniqueCode"
const encryptedEmailId = urlParams.get('ZW1haWxJZA==');       // Encrypted "emailId"
const encryptedTimestamp = urlParams.get('dGltZXN0YW1w');       // Encrypted "timestamp"
const encryptedAction = urlParams.get('YWN0aW9u');              // Encrypted "action"

// Get the response element and status message elements
const responseElement = document.getElementById('jsonResponse');
const statusMessageElement = document.getElementById('statusMessage');
const doneMessageElement = document.getElementById('doneMessage');  // Done message element

// Check if the URL has the required parameters
if (encryptedUniqueCode && encryptedEmailId && encryptedTimestamp && encryptedAction) {
  let uniqueCode, emailId, sentTimestamp, action;

  try {
    // Decrypt the values
    uniqueCode = decrypt(encryptedUniqueCode);
    emailId = decrypt(encryptedEmailId);
    sentTimestamp = new Date(decrypt(encryptedTimestamp)); // Convert decrypted timestamp to Date object
    action = decrypt(encryptedAction); // Decrypt the action (approve or reject)
    console.log("uniqueCode : "+uniqueCode+", emailId : "+emailId+", sentTimestamp : "+sentTimestamp+", action : "+action);
    // Get the current timestamp
    const currentTimestamp = new Date();

    // Validate the timestamp (check if it's within 2 minutes)
    const timeDifference = (currentTimestamp - sentTimestamp) / 1000 / 60; // Difference in minutes

    if (timeDifference > 2) {
      // Construct JSON response for expired URL
      const jsonResponse = {
        uniqueCode: uniqueCode,
        emailId: emailId,
        status: 'rejected',  // Set status to 'rejected' if URL expired
        timestamp: sentTimestamp.toISOString(),
        validation: 'URL Expired',
      };

      responseElement.textContent = JSON.stringify(jsonResponse, null, 2);
      doneMessageElement.textContent = 'Failed: URL Expired';
    } else if (action === 'approve' || action === 'reject') {
      // Construct JSON response for approval or rejection
      const jsonResponse = {
        uniqueCode: uniqueCode,
        emailId: emailId,
        status: action === 'approve' ? 'approved' : 'rejected',
        timestamp: sentTimestamp.toISOString(),
        validation: action === 'approve' ? 'URL valid' : 'URL Rejected', // Set status based on action
      };

      responseElement.textContent = JSON.stringify(jsonResponse, null, 2);
      doneMessageElement.textContent = 'Done';  // Success message
    } else {
      throw new Error('Invalid action');
    }

  } catch (error) {
    responseElement.textContent = JSON.stringify(
      { error: 'Invalid URL structure or decryption failure' },
      null,
      2
    );
    doneMessageElement.textContent = 'Failed: ' + error.message;  // Show error message
  }

  // Hide "Processing..." message
  statusMessageElement.style.display = 'none';

  // Display "Done" or "Failed" message
  doneMessageElement.style.display = 'block';

} else {
  responseElement.textContent = JSON.stringify(
    { error: 'Missing URL parameters' },
    null,
    2
  );
  statusMessageElement.style.display = 'none';  // Hide "Processing..." message
  doneMessageElement.textContent = 'Failed: Missing URL parameters';
  doneMessageElement.style.display = 'block';  // Display "Failed" message
}
