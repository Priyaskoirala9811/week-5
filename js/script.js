// js/script.js
// basic stuff that runs on all pages

document.addEventListener("DOMContentLoaded", () => {
  setupHeader();
  setupTheme();     // load saved theme
  showTodayDate();  // only does anything on home page
  setFooterYear();
  loadEntries();    // ✅ load journal entries (only works on journal page)
});

// create the header with nav + theme toggle
function setupHeader() {
  const headerSection = document.getElementById("site-header");
  if (!headerSection) return;

  headerSection.innerHTML = `
    <div class="header-inner">
      <div class="brand">Learning Journal</div>
      <button id="themeToggle" type="button" class="btn small">Light</button>
      <nav class="nav">
        <a href="index.html">Home</a>
        <a href="journal.html">Journal</a>
        <a href="projects.html">Projects</a>
      </nav>
    </div>
  `;

  const themeButton = document.getElementById("themeToggle");
  if (themeButton) {
    themeButton.addEventListener("click", toggleTheme);
  }
}

// load theme from localStorage and apply it
function setupTheme() {
  const savedTheme = localStorage.getItem("theme");
  const body = document.body;
  const themeButton = document.getElementById("themeToggle");

  // default theme: dark
  const themeToUse = savedTheme || "dark";

  if (themeToUse === "light") {
    body.classList.add("theme-light");
    body.classList.remove("theme-dark");
    if (themeButton) themeButton.textContent = "Dark";
  } else {
    body.classList.add("theme-dark");
    body.classList.remove("theme-light");
    if (themeButton) themeButton.textContent = "Light";
  }
}

// toggle theme when user clicks button
function toggleTheme() {
  const body = document.body;
  const themeButton = document.getElementById("themeToggle");
  let newTheme;

  if (body.classList.contains("theme-light")) {
    // switch to dark
    body.classList.remove("theme-light");
    body.classList.add("theme-dark");
    newTheme = "dark";
    if (themeButton) themeButton.textContent = "Light";
  } else {
    // switch to light
    body.classList.remove("theme-dark");
    body.classList.add("theme-light");
    newTheme = "light";
    if (themeButton) themeButton.textContent = "Dark";
  }

  localStorage.setItem("theme", newTheme);
}

// show date on home page
function showTodayDate() {
  const dateDisplay = document.getElementById("current-date");
  if (!dateDisplay) return;

  const today = new Date();
  dateDisplay.textContent = today.toDateString();
}

// update footer year everywhere
function setFooterYear() {
  const yearSpan = document.getElementById("year");
  if (!yearSpan) return;

  yearSpan.textContent = new Date().getFullYear();
}

// ===============================
// JOURNAL: LOAD REFLECTIONS
// ===============================
async function loadEntries() {
  const list = document.getElementById("entriesList");
  if (!list) return; // only runs on journal.html

  try {
    const response = await fetch("reflections.json");
    const entries = await response.json();

    list.innerHTML = "";

    if (entries.length === 0) {
      list.innerHTML = "<li>No journal entries yet.</li>";
      return;
    }

    // show newest first
    entries.slice().reverse().forEach((entry) => {
      const li = document.createElement("li");
      li.className = "entry";

      li.innerHTML = `
        <div class="entry-date"><strong>${entry.date}</strong></div>
        <div class="entry-text">${entry.reflection}</div>
      `;

      list.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading reflections:", error);
    list.innerHTML =
      "<li>Could not load reflections.json. Make sure you opened the site using Live Server.</li>";
  }
}
