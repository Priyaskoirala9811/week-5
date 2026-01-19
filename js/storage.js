// js/storage.js
// handles journal entries: save, load, filter, word count

document.addEventListener("DOMContentLoaded", () => {
  setupEntryCounter();
  displayEntries(); // show entries when the page loads
});

// save a new entry to LocalStorage
function saveEntry() {
  const entryInput = document.getElementById("journalEntry");
  const entryTagDropdown = document.getElementById("tagSelect");

  if (!entryInput) return;

  const entryText = entryInput.value.trim();
  if (entryText === "") {
    showSaveStatus("Please write something before saving.");
    return;
  }

  const chosenTag = entryTagDropdown ? entryTagDropdown.value : "Other";
  const currentDate = new Date().toLocaleDateString();

  // one journal entry object
  const newJournalEntry = {
    text: entryText,
    tag: chosenTag,
    date: currentDate
  };

  const savedEntries = getEntriesFromStorage();
  savedEntries.push(newJournalEntry);
  localStorage.setItem("journalEntries", JSON.stringify(savedEntries));

  entryInput.value = "";
  updateWordCounter(0);
  showSaveStatus("Entry saved.");

  // refresh the list
  displayEntries();

  // show notification if available
  if (typeof notifyUser === "function") {
    notifyUser();
  }
}

// read entries from LocalStorage
function getEntriesFromStorage() {
  return JSON.parse(localStorage.getItem("journalEntries")) || [];
}

// show entries in the <ul>
function displayEntries(filterTag = "all") {
  const listElement = document.getElementById("entriesList");
  if (!listElement) return;

  listElement.innerHTML = "";

  let savedEntries = getEntriesFromStorage();

  // filter by tag if needed
  if (filterTag !== "all") {
    savedEntries = savedEntries.filter(entry => entry.tag === filterTag);
  }

  savedEntries.forEach(journalEntry => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <strong>${journalEntry.tag}</strong> — ${journalEntry.date}<br>
      ${journalEntry.text}
    `;
    listItem.classList.add("entry-item");
    listElement.appendChild(listItem);
  });
}

// when user changes filter dropdown
function filterEntries() {
  const filterDropdown = document.getElementById("filterSelect");
  if (!filterDropdown) return;

  const selectedTag = filterDropdown.value;
  displayEntries(selectedTag);
}

// small status text under the buttons
function showSaveStatus(msg) {
  const statusText = document.getElementById("saveStatus");
  if (!statusText) return;

  statusText.textContent = msg;
}

// word counter for the textarea
function setupEntryCounter() {
  const entryInput = document.getElementById("journalEntry");
  if (!entryInput) return;

  entryInput.addEventListener("input", () => {
    const text = entryInput.value.trim();
    const wordCount = text ? text.split(/\s+/).length : 0;
    updateWordCounter(wordCount);
  });
}

function updateWordCounter(count) {
  const counterElement = document.getElementById("entryCounter");
  if (!counterElement) return;

  counterElement.textContent = `${count} word${count === 1 ? "" : "s"}`;
}
