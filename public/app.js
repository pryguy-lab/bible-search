const input = document.getElementById("referenceInput");
const searchBtn = document.getElementById("searchBtn");
const favoriteBtn = document.getElementById("favoriteBtn");
const resultBox = document.getElementById("resultBox");
const translationSelect = document.getElementById("translationSelect");
const bookSelect = document.getElementById("bookSelect");
const chapterSelect = document.getElementById("chapterSelect");
const verseSelect = document.getElementById("verseSelect");
const buildBtn = document.getElementById("buildBtn");
const historyList = document.getElementById("historyList");
const favoriteList = document.getElementById("favoriteList");
const historyEmpty = document.getElementById("historyEmpty");
const favoriteEmpty = document.getElementById("favoriteEmpty");
const adminStatusBadge = document.getElementById("adminStatusBadge");

const HISTORY_KEY = "bibleVerseHistory";
const FAVORITES_KEY = "bibleVerseFavorites";
const ALLOWED_TRANSLATIONS = new Set(["web", "kjv", "asv", "bbe"]);

const BOOKS = [
  { name: "Genesis", chapters: 50 },
  { name: "Exodus", chapters: 40 },
  { name: "Leviticus", chapters: 27 },
  { name: "Numbers", chapters: 36 },
  { name: "Deuteronomy", chapters: 34 },
  { name: "Joshua", chapters: 24 },
  { name: "Judges", chapters: 21 },
  { name: "Ruth", chapters: 4 },
  { name: "1 Samuel", chapters: 31 },
  { name: "2 Samuel", chapters: 24 },
  { name: "1 Kings", chapters: 22 },
  { name: "2 Kings", chapters: 25 },
  { name: "1 Chronicles", chapters: 29 },
  { name: "2 Chronicles", chapters: 36 },
  { name: "Ezra", chapters: 10 },
  { name: "Nehemiah", chapters: 13 },
  { name: "Esther", chapters: 10 },
  { name: "Job", chapters: 42 },
  { name: "Psalms", chapters: 150 },
  { name: "Proverbs", chapters: 31 },
  { name: "Ecclesiastes", chapters: 12 },
  { name: "Song of Solomon", chapters: 8 },
  { name: "Isaiah", chapters: 66 },
  { name: "Jeremiah", chapters: 52 },
  { name: "Lamentations", chapters: 5 },
  { name: "Ezekiel", chapters: 48 },
  { name: "Daniel", chapters: 12 },
  { name: "Hosea", chapters: 14 },
  { name: "Joel", chapters: 3 },
  { name: "Amos", chapters: 9 },
  { name: "Obadiah", chapters: 1 },
  { name: "Jonah", chapters: 4 },
  { name: "Micah", chapters: 7 },
  { name: "Nahum", chapters: 3 },
  { name: "Habakkuk", chapters: 3 },
  { name: "Zephaniah", chapters: 3 },
  { name: "Haggai", chapters: 2 },
  { name: "Zechariah", chapters: 14 },
  { name: "Malachi", chapters: 4 },
  { name: "Matthew", chapters: 28 },
  { name: "Mark", chapters: 16 },
  { name: "Luke", chapters: 24 },
  { name: "John", chapters: 21 },
  { name: "Acts", chapters: 28 },
  { name: "Romans", chapters: 16 },
  { name: "1 Corinthians", chapters: 16 },
  { name: "2 Corinthians", chapters: 13 },
  { name: "Galatians", chapters: 6 },
  { name: "Ephesians", chapters: 6 },
  { name: "Philippians", chapters: 4 },
  { name: "Colossians", chapters: 4 },
  { name: "1 Thessalonians", chapters: 5 },
  { name: "2 Thessalonians", chapters: 3 },
  { name: "1 Timothy", chapters: 6 },
  { name: "2 Timothy", chapters: 4 },
  { name: "Titus", chapters: 3 },
  { name: "Philemon", chapters: 1 },
  { name: "Hebrews", chapters: 13 },
  { name: "James", chapters: 5 },
  { name: "1 Peter", chapters: 5 },
  { name: "2 Peter", chapters: 3 },
  { name: "1 John", chapters: 5 },
  { name: "2 John", chapters: 1 },
  { name: "3 John", chapters: 1 },
  { name: "Jude", chapters: 1 },
  { name: "Revelation", chapters: 22 },
];

let history = loadSaved(HISTORY_KEY);
let favorites = loadSaved(FAVORITES_KEY);
let lastResult = null;

function loadSaved(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((item) => normalizeSavedItem(item))
      .filter(Boolean)
      .slice(0, key === HISTORY_KEY ? 10 : 15);
  } catch {
    return [];
  }
}

function saveSaved(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeTranslation(value) {
  const translation = String(value || "")
    .trim()
    .toLowerCase();
  return ALLOWED_TRANSLATIONS.has(translation) ? translation : "web";
}

function normalizeReference(value) {
  const reference = String(value || "").trim();
  if (!reference || reference.length > 80) {
    return "";
  }
  if (!/^[a-z0-9\s:;,.\-']+$/i.test(reference)) {
    return "";
  }
  return reference;
}

function normalizeSavedItem(item) {
  if (!item || typeof item !== "object") {
    return null;
  }
  const reference = normalizeReference(item.reference);
  if (!reference) {
    return null;
  }
  return {
    reference,
    translation: normalizeTranslation(item.translation),
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function populateBookSelect() {
  bookSelect.innerHTML = BOOKS.map(
    (book) => `<option value="${book.name}">${book.name}</option>`,
  ).join("");
  bookSelect.value = "John";
}

function populateChapterSelect() {
  const selected =
    BOOKS.find((book) => book.name === bookSelect.value) || BOOKS[0];
  const chapterOptions = [];

  for (let index = 1; index <= selected.chapters; index += 1) {
    chapterOptions.push(`<option value="${index}">${index}</option>`);
  }

  chapterSelect.innerHTML = chapterOptions.join("");
  chapterSelect.value = "3";
}

function populateVerseSelect(verseCount = 50) {
  const options = [];

  for (let index = 1; index <= verseCount; index += 1) {
    options.push(`<option value="${index}">${index}</option>`);
  }

  verseSelect.innerHTML = options.join("");
  verseSelect.value = "16";
}

function buildReferenceFromSelectors() {
  input.value = `${bookSelect.value} ${chapterSelect.value}:${verseSelect.value}`;
}

async function syncVerseDropdown() {
  const book = bookSelect.value;
  const chapter = chapterSelect.value;
  const translation = translationSelect.value;

  try {
    const response = await fetch(
      `/api/chapter-meta?book=${encodeURIComponent(book)}&chapter=${encodeURIComponent(chapter)}&translation=${encodeURIComponent(translation)}`,
    );

    if (!response.ok) {
      populateVerseSelect(50);
      buildReferenceFromSelectors();
      return;
    }

    const data = await response.json();
    const verseCount = Number(data.verseCount) || 50;
    const currentVerse = verseSelect.value;

    populateVerseSelect(verseCount);

    if (Number(currentVerse) <= verseCount) {
      verseSelect.value = currentVerse;
    }
  } catch {
    populateVerseSelect(50);
  }

  buildReferenceFromSelectors();
}

function renderVerse(payload) {
  resultBox.innerHTML = `
    <div class="reference">${escapeHtml(payload.canonicalReference)}</div>
    <div class="text">${escapeHtml(payload.text)}</div>
    <div class="meta">Translation: ${escapeHtml(payload.translation || "Unknown")}</div>
  `;
}

function renderError(message) {
  resultBox.innerHTML = `<div class="error">${escapeHtml(message)}</div>`;
}

function setAdminStatusBadge(text, statusClass) {
  if (!adminStatusBadge) {
    return;
  }

  adminStatusBadge.textContent = text;
  adminStatusBadge.className = `status-badge ${statusClass}`;
}

async function loadAdminStatusBadge() {
  if (!adminStatusBadge) {
    return;
  }

  try {
    const response = await fetch("/api/admin/status");
    if (!response.ok) {
      setAdminStatusBadge("Admin Telemetry: Unknown", "status-unknown");
      return;
    }

    const payload = await response.json();
    if (payload && payload.adminTelemetryEnabled === true) {
      setAdminStatusBadge("Admin Telemetry: Enabled", "status-enabled");
      return;
    }

    setAdminStatusBadge("Admin Telemetry: Disabled", "status-disabled");
  } catch {
    setAdminStatusBadge("Admin Telemetry: Unknown", "status-unknown");
  }
}

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function addHistory(reference, translation) {
  const cleanReference = normalizeReference(reference);
  const cleanTranslation = normalizeTranslation(translation);

  if (!cleanReference) {
    return;
  }

  const key = `${cleanReference}__${cleanTranslation}`;
  history = history.filter(
    (item) => `${item.reference}__${item.translation}` !== key,
  );
  history.unshift({ reference: cleanReference, translation: cleanTranslation });
  history = history.slice(0, 10);
  saveSaved(HISTORY_KEY, history);
  renderSavedLists();
}

function addFavorite() {
  if (!lastResult) {
    renderError("Search for a verse first, then save it as a favorite.");
    return;
  }

  const reference = lastResult.canonicalReference;
  const translation = normalizeTranslation(
    lastResult.translationId || translationSelect.value,
  );
  const cleanReference = normalizeReference(reference);

  if (!cleanReference) {
    return;
  }

  const key = `${cleanReference}__${translation}`;

  if (
    favorites.some((item) => `${item.reference}__${item.translation}` === key)
  ) {
    return;
  }

  favorites.unshift({ reference: cleanReference, translation });
  favorites = favorites.slice(0, 15);
  saveSaved(FAVORITES_KEY, favorites);
  renderSavedLists();
}

function renderSavedLists() {
  historyList.textContent = "";
  favoriteList.textContent = "";

  history.forEach((item) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.className = "chip";
    button.type = "button";
    button.dataset.reference = item.reference;
    button.dataset.translation = item.translation;
    button.textContent = `${item.reference} (${item.translation.toUpperCase()})`;
    li.appendChild(button);
    historyList.appendChild(li);
  });

  favorites.forEach((item) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.className = "chip";
    button.type = "button";
    button.dataset.reference = item.reference;
    button.dataset.translation = item.translation;
    button.textContent = `${item.reference} (${item.translation.toUpperCase()})`;
    li.appendChild(button);
    favoriteList.appendChild(li);
  });

  historyEmpty.style.display = history.length ? "none" : "block";
  favoriteEmpty.style.display = favorites.length ? "none" : "block";
}

function applySavedSelection(event) {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const reference = target.dataset.reference || "";
  const translation = normalizeTranslation(target.dataset.translation || "web");
  const cleanReference = normalizeReference(reference);

  if (!cleanReference) {
    return;
  }

  input.value = cleanReference;
  translationSelect.value = translation;
  getVerse();
}

async function getVerse() {
  const reference = normalizeReference(input.value);
  const translation = normalizeTranslation(translationSelect.value);

  if (!reference) {
    renderError("Please enter a valid verse reference.");
    return;
  }

  input.value = reference;
  translationSelect.value = translation;

  resultBox.innerHTML = '<div class="meta">Loading verse...</div>';

  try {
    const response = await fetch(
      `/api/verse?reference=${encodeURIComponent(reference)}&translation=${encodeURIComponent(translation)}`,
    );
    const data = await parseJsonSafe(response);

    if (!response.ok) {
      const message =
        (data && data.error) ||
        `Request failed (HTTP ${response.status}). Please try again.`;
      renderError(message);
      return;
    }

    if (!data) {
      renderError("Received an invalid response from the server.");
      return;
    }

    lastResult = data;
    renderVerse(data);
    addHistory(
      data.canonicalReference || reference,
      data.translationId || translation,
    );
  } catch (error) {
    renderError(`Network error. ${error.message || "Please try again."}`);
  }
}

searchBtn.addEventListener("click", getVerse);
favoriteBtn.addEventListener("click", addFavorite);
buildBtn.addEventListener("click", () => {
  buildReferenceFromSelectors();
  getVerse();
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getVerse();
  }
});

bookSelect.addEventListener("change", async () => {
  populateChapterSelect();
  await syncVerseDropdown();
});

chapterSelect.addEventListener("change", syncVerseDropdown);
verseSelect.addEventListener("change", buildReferenceFromSelectors);
translationSelect.addEventListener("change", syncVerseDropdown);
historyList.addEventListener("click", applySavedSelection);
favoriteList.addEventListener("click", applySavedSelection);

populateBookSelect();
populateChapterSelect();
populateVerseSelect(50);
renderSavedLists();
syncVerseDropdown();
loadAdminStatusBadge();
