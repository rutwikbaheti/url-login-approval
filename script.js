// Simulated decryption function (replace with your actual decryption algorithm)
function decrypt(encrypted) {
  return atob(encrypted); // Decodes Base64-encoded strings
}

// Capture the full URL path
const path = window.location.pathname.split('/').filter(Boolean);  // Split the URL into segments

// Get the response element and status message elements
const responseElement = document.getElementById('jsonResponse');
const statusMessageElement = document.getElementById('statusMessage');
const doneMessageElement = document.getElementById('doneMessage');  // Done message element

// Check if the URL has the required segments
if (path.length === 5) {
  const encryptedUniqueCode = path[0];
  const encryptedEmailId = path[1];
  const encryptedTimestamp = path[2];
  const encryptedAction = path[3];

  // Decrypt the values
  let uniqueCode, emailId, sentTimestamp, action;

  try {
    uniqueCode = decrypt(encryptedUniqueCode);
    emailId = decrypt(encryptedEmailId);
    sentTimestamp = new Date(decrypt(encryptedTimestamp)); // Convert decrypted timestamp to Date object
    action = decrypt(encryptedAction); // Decrypt the action (approve or reject)

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
    { error: 'Invalid URL structure' },
    null,
    2
  );
  statusMessageElement.style.display = 'none';  // Hide "Processing..." message
  doneMessageElement.textContent = 'Failed: Invalid URL structure';
  doneMessageElement.style.display = 'block';  // Display "Failed" message
}
