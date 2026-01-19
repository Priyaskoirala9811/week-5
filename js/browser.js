// js/browser.js
// browser APIs: notifications and clipboard

// show a notification when an entry is saved
function notifyUser() {
  if (!("Notification" in window)) {
    // browser doesn't support notifications
    return;
  }

  if (Notification.permission === "granted") {
    new Notification("Your journal entry was saved.");
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("Your journal entry was saved.");
      }
    });
  }
}

// copy the last entry text to clipboard
function copyLastEntry() {
  const savedEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];

  if (savedEntries.length === 0) {
    showSaveStatus("No entries to copy yet.");
    return;
  }

  const lastSavedEntry = savedEntries[savedEntries.length - 1];

  navigator.clipboard.writeText(lastSavedEntry.text)
    .then(() => {
      showSaveStatus("Last entry copied to clipboard.");
    })
    .catch(error => {
      console.error(error);
      showSaveStatus("Could not copy to clipboard.");
    });
}
