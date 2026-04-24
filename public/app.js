const input = document.getElementById("referenceInput");
const searchBtn = document.getElementById("searchBtn");
const favoriteBtn = document.getElementById("favoriteBtn");
const resultBox = document.getElementById("resultBox");
const translationSelect = document.getElementById("translationSelect");
const bookSelect = document.getElementById("bookSelect");
const chapterSelect = document.getElementById("chapterSelect");
const verseSelect = document.getElementById("verseSelect");
const passageMeta = document.getElementById("passageMeta");
const buildBtn = document.getElementById("buildBtn");
const bibleSubjectInput = document.getElementById("bibleSubjectInput");
const bibleSearchBtn = document.getElementById("bibleSearchBtn");
const bibleSearchClearBtn = document.getElementById("bibleSearchClearBtn");
const topicSelect = document.getElementById("topicSelect");
const topicSearchBtn = document.getElementById("topicSearchBtn");
const topicResultsBox = document.getElementById("topicResultsBox");
const opinionSubjectInput = document.getElementById("opinionSubjectInput");
const opinionSearchBtn = document.getElementById("opinionSearchBtn");
const opinionLinksBox = document.getElementById("opinionLinksBox");
const customTopicName = document.getElementById("customTopicName");
const customTopicDescription = document.getElementById(
  "customTopicDescription",
);
const customTopicRefs = document.getElementById("customTopicRefs");
const saveCustomTopicBtn = document.getElementById("saveCustomTopicBtn");
const cancelCustomTopicEditBtn = document.getElementById(
  "cancelCustomTopicEditBtn",
);
const deleteCustomTopicBtn = document.getElementById("deleteCustomTopicBtn");
const exportCustomTopicsBtn = document.getElementById("exportCustomTopicsBtn");
const importCustomTopicsInput = document.getElementById(
  "importCustomTopicsInput",
);
const importCustomTopicsLabel = document.getElementById(
  "importCustomTopicsLabel",
);
const replaceCustomTopicsMode = document.getElementById(
  "replaceCustomTopicsMode",
);
const replaceConfirmInput = document.getElementById("replaceConfirmInput");
const customEditorState = document.getElementById("customEditorState");
const customTopicStatus = document.getElementById("customTopicStatus");
const customTopicList = document.getElementById("customTopicList");
const historyList = document.getElementById("historyList");
const favoriteList = document.getElementById("favoriteList");
const historyEmpty = document.getElementById("historyEmpty");
const favoriteEmpty = document.getElementById("favoriteEmpty");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const clearFavoritesBtn = document.getElementById("clearFavoritesBtn");
const undoToast = document.getElementById("undoToast");
const undoToastText = document.getElementById("undoToastText");
const undoToastActionBtn = document.getElementById("undoToastActionBtn");
const undoToastCloseBtn = document.getElementById("undoToastCloseBtn");
const headerMeta = document.getElementById("headerMeta");
const mobileHeaderControlsToggleBtn = document.getElementById(
  "mobileHeaderControlsToggleBtn",
);
const compactModeBtn = document.getElementById("compactModeBtn");
const comfortableModeBtn = document.getElementById("comfortableModeBtn");
const focusModeBtn = document.getElementById("focusModeBtn");
const spacingModeBtn = document.getElementById("spacingModeBtn");
const themePresetSelect = document.getElementById("themePresetSelect");
const themeBgInput = document.getElementById("themeBgInput");
const themeCardInput = document.getElementById("themeCardInput");
const themeCardStrongInput = document.getElementById("themeCardStrongInput");
const themeTextInput = document.getElementById("themeTextInput");
const themeMutedInput = document.getElementById("themeMutedInput");
const themeAccentInput = document.getElementById("themeAccentInput");
const themeAccent2Input = document.getElementById("themeAccent2Input");
const themeLineInput = document.getElementById("themeLineInput");
const themeBtnInput = document.getElementById("themeBtnInput");
const themeBtnActiveInput = document.getElementById("themeBtnActiveInput");
const resetThemeBtn = document.getElementById("resetThemeBtn");
const exportThemeBtn = document.getElementById("exportThemeBtn");
const importThemeInput = document.getElementById("importThemeInput");
const themeStatus = document.getElementById("themeStatus");
const themeSwatchBg = document.getElementById("themeSwatchBg");
const themeSwatchText = document.getElementById("themeSwatchText");
const themeSwatchBtn = document.getElementById("themeSwatchBtn");
const themeSwatchBgValue = document.getElementById("themeSwatchBgValue");
const themeSwatchTextValue = document.getElementById("themeSwatchTextValue");
const themeSwatchBtnValue = document.getElementById("themeSwatchBtnValue");
const themeHexValueElements = [
  themeSwatchBgValue,
  themeSwatchTextValue,
  themeSwatchBtnValue,
];

const HISTORY_KEY = "bibleVerseHistory";
const FAVORITES_KEY = "bibleVerseFavorites";
const CUSTOM_TOPICS_KEY = "bibleCustomTopics";
const READING_MODE_KEY = "bibleReadingMode";
const FOCUS_MODE_KEY = "bibleFocusMode";
const SPACING_MODE_KEY = "bibleSpacingMode";
const THEME_KEY = "bibleTheme";
const ALLOWED_TRANSLATIONS = new Set(["web", "kjv", "asv", "bbe"]);
const ALLOWED_READING_MODES = new Set(["compact", "comfortable"]);
const ALLOWED_SPACING_MODES = new Set(["normal", "relaxed"]);
let themeHexCopyStatusTimer = null;

const DEFAULT_THEME = {
  bg: "#f4efe4",
  card: "#fffcf5",
  cardStrong: "#fffaf1",
  text: "#201c17",
  muted: "#655f55",
  accent: "#8c4a2f",
  accent2: "#315e49",
  line: "#dfd1bb",
  btnBg: "#fffcf5",
  btnBgActive: "#fbf8f1",
};

const PRESET_THEMES = {
  warm: {
    ...DEFAULT_THEME,
  },
  forest: {
    bg: "#edf1ea",
    card: "#f9fcf8",
    cardStrong: "#f4f9f2",
    text: "#1f271f",
    muted: "#50604f",
    accent: "#4f6d45",
    accent2: "#315e49",
    line: "#cdd8c6",
    btnBg: "#f9fcf8",
    btnBgActive: "#edf4ea",
  },
  ocean: {
    bg: "#e9f1f4",
    card: "#f7fcff",
    cardStrong: "#eff7fb",
    text: "#18222a",
    muted: "#4d6170",
    accent: "#2f628c",
    accent2: "#2d6d76",
    line: "#c6d8e2",
    btnBg: "#f7fcff",
    btnBgActive: "#edf6fb",
  },
  contrast: {
    bg: "#f1f1f1",
    card: "#ffffff",
    cardStrong: "#ffffff",
    text: "#111111",
    muted: "#393939",
    accent: "#8b2d00",
    accent2: "#004c43",
    line: "#bdbdbd",
    btnBg: "#ffffff",
    btnBgActive: "#f0f0f0",
  },
};

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

const BOOK_VERSE_TOTALS = {
  Genesis: 1533,
  Exodus: 1213,
  Leviticus: 859,
  Numbers: 1288,
  Deuteronomy: 959,
  Joshua: 658,
  Judges: 618,
  Ruth: 85,
  "1 Samuel": 810,
  "2 Samuel": 695,
  "1 Kings": 816,
  "2 Kings": 719,
  "1 Chronicles": 942,
  "2 Chronicles": 822,
  Ezra: 280,
  Nehemiah: 406,
  Esther: 167,
  Job: 1070,
  Psalms: 2461,
  Proverbs: 915,
  Ecclesiastes: 222,
  "Song of Solomon": 117,
  Isaiah: 1292,
  Jeremiah: 1364,
  Lamentations: 154,
  Ezekiel: 1273,
  Daniel: 357,
  Hosea: 197,
  Joel: 73,
  Amos: 146,
  Obadiah: 21,
  Jonah: 48,
  Micah: 105,
  Nahum: 47,
  Habakkuk: 56,
  Zephaniah: 53,
  Haggai: 38,
  Zechariah: 211,
  Malachi: 55,
  Matthew: 1071,
  Mark: 678,
  Luke: 1151,
  John: 879,
  Acts: 1007,
  Romans: 433,
  "1 Corinthians": 437,
  "2 Corinthians": 257,
  Galatians: 149,
  Ephesians: 155,
  Philippians: 104,
  Colossians: 95,
  "1 Thessalonians": 89,
  "2 Thessalonians": 47,
  "1 Timothy": 113,
  "2 Timothy": 83,
  Titus: 46,
  Philemon: 25,
  Hebrews: 303,
  James: 108,
  "1 Peter": 105,
  "2 Peter": 61,
  "1 John": 105,
  "2 John": 13,
  "3 John": 14,
  Jude: 25,
  Revelation: 404,
};

let history = loadSaved(HISTORY_KEY);
let favorites = loadSaved(FAVORITES_KEY);
let lastResult = null;
let availableTopics = [];
let builtinTopics = [];
let customTopics = loadCustomTopics();
let editingCustomTopicId = "";
let readingMode = loadReadingMode();
let focusMode = loadFocusMode();
let spacingMode = loadSpacingMode();
let theme = loadTheme();
let themeLiveSyncTimer = null;
let activeThemeColorInput = null;
let savedUndoSnapshot = null;
let savedUndoTimer = null;
const SAVED_UNDO_TIMEOUT_MS = 6000;
let mobileHeaderControlsOpen = false;

function updateMobileHeaderControls() {
  if (!headerMeta || !mobileHeaderControlsToggleBtn) {
    return;
  }

  const isCollapsibleViewport =
    window.matchMedia("(max-width: 640px)").matches && focusMode !== "on";

  mobileHeaderControlsToggleBtn.hidden = !isCollapsibleViewport;

  if (!isCollapsibleViewport) {
    headerMeta.classList.add("header-meta-open");
    mobileHeaderControlsToggleBtn.setAttribute("aria-expanded", "true");
    return;
  }

  headerMeta.classList.toggle("header-meta-open", mobileHeaderControlsOpen);
  mobileHeaderControlsToggleBtn.setAttribute(
    "aria-expanded",
    String(mobileHeaderControlsOpen),
  );
  mobileHeaderControlsToggleBtn.textContent = mobileHeaderControlsOpen
    ? "Hide Quick Controls"
    : "Show Quick Controls";
}

function toggleMobileHeaderControls() {
  mobileHeaderControlsOpen = !mobileHeaderControlsOpen;
  updateMobileHeaderControls();
}

function normalizeHexColor(value, fallback) {
  const color = String(value || "").trim();
  return /^#[0-9a-f]{6}$/i.test(color) ? color.toLowerCase() : fallback;
}

function loadTheme() {
  try {
    const raw = JSON.parse(localStorage.getItem(THEME_KEY) || "null");
    if (!raw || typeof raw !== "object") {
      return { ...DEFAULT_THEME };
    }

    return {
      bg: normalizeHexColor(raw.bg, DEFAULT_THEME.bg),
      card: normalizeHexColor(raw.card, DEFAULT_THEME.card),
      cardStrong: normalizeHexColor(raw.cardStrong, DEFAULT_THEME.cardStrong),
      text: normalizeHexColor(raw.text, DEFAULT_THEME.text),
      muted: normalizeHexColor(raw.muted, DEFAULT_THEME.muted),
      accent: normalizeHexColor(raw.accent, DEFAULT_THEME.accent),
      accent2: normalizeHexColor(raw.accent2, DEFAULT_THEME.accent2),
      line: normalizeHexColor(raw.line, DEFAULT_THEME.line),
      btnBg: normalizeHexColor(raw.btnBg, DEFAULT_THEME.btnBg),
      btnBgActive: normalizeHexColor(
        raw.btnBgActive,
        DEFAULT_THEME.btnBgActive,
      ),
    };
  } catch {
    return { ...DEFAULT_THEME };
  }
}

function themesEqual(a, b) {
  return (
    a.bg === b.bg &&
    a.card === b.card &&
    a.cardStrong === b.cardStrong &&
    a.text === b.text &&
    a.muted === b.muted &&
    a.accent === b.accent &&
    a.accent2 === b.accent2 &&
    a.line === b.line &&
    a.btnBg === b.btnBg &&
    a.btnBgActive === b.btnBgActive
  );
}

function inferThemePreset(themeValue) {
  if (themesEqual(themeValue, PRESET_THEMES.warm)) {
    return "warm";
  }
  if (themesEqual(themeValue, PRESET_THEMES.forest)) {
    return "forest";
  }
  if (themesEqual(themeValue, PRESET_THEMES.ocean)) {
    return "ocean";
  }
  if (themesEqual(themeValue, PRESET_THEMES.contrast)) {
    return "contrast";
  }
  return "custom";
}

function syncThemeInputs(themeValue) {
  if (themeBgInput) {
    themeBgInput.value = themeValue.bg;
  }
  if (themeCardInput) {
    themeCardInput.value = themeValue.card;
  }
  if (themeCardStrongInput) {
    themeCardStrongInput.value = themeValue.cardStrong;
  }
  if (themeTextInput) {
    themeTextInput.value = themeValue.text;
  }
  if (themeMutedInput) {
    themeMutedInput.value = themeValue.muted;
  }
  if (themeAccentInput) {
    themeAccentInput.value = themeValue.accent;
  }
  if (themeAccent2Input) {
    themeAccent2Input.value = themeValue.accent2;
  }
  if (themeLineInput) {
    themeLineInput.value = themeValue.line;
  }
  if (themeBtnInput) {
    themeBtnInput.value = themeValue.btnBg;
  }
  if (themeBtnActiveInput) {
    themeBtnActiveInput.value = themeValue.btnBgActive;
  }
  if (themePresetSelect) {
    themePresetSelect.value = inferThemePreset(themeValue);
  }
}

function setThemeStatus(text) {
  if (!themeStatus) {
    return;
  }
  themeStatus.textContent = text;
}

function updateThemePreview(themeValue) {
  const previewPairs = [
    [themeSwatchBg, themeSwatchBgValue, themeValue.bg],
    [themeSwatchText, themeSwatchTextValue, themeValue.text],
    [themeSwatchBtn, themeSwatchBtnValue, themeValue.btnBg],
  ];

  previewPairs.forEach(([chipElement, valueElement, colorValue]) => {
    if (chipElement) {
      chipElement.style.backgroundColor = colorValue;
      chipElement.setAttribute("title", colorValue);
      chipElement.setAttribute("aria-label", colorValue);
    }
    if (valueElement) {
      valueElement.textContent = colorValue;
    }
  });
}

async function copyTextToClipboard(text) {
  const value = String(text || "").trim();
  if (!value) {
    return false;
  }

  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall back to the legacy copy approach.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

function setupThemeHexCopy() {
  themeHexValueElements.forEach((valueElement) => {
    if (!valueElement) {
      return;
    }

    valueElement.tabIndex = 0;
    valueElement.setAttribute("role", "button");
    valueElement.setAttribute("title", "Click to copy hex value");
    valueElement.setAttribute("aria-label", "Copy hex value");

    const copyHexValue = async () => {
      const colorValue = String(valueElement.textContent || "").trim();
      if (!colorValue) {
        return;
      }

      const didCopy = await copyTextToClipboard(colorValue);
      setThemeStatus(
        didCopy ? `Copied ${colorValue}` : "Could not copy color.",
      );

      if (themeHexCopyStatusTimer) {
        window.clearTimeout(themeHexCopyStatusTimer);
      }

      if (didCopy) {
        themeHexCopyStatusTimer = window.setTimeout(() => {
          if (
            themeStatus &&
            themeStatus.textContent === `Copied ${colorValue}`
          ) {
            setThemeStatus("Theme ready.");
          }
          themeHexCopyStatusTimer = null;
        }, 1400);
      }
    };

    valueElement.addEventListener("click", () => {
      void copyHexValue();
    });

    valueElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        void copyHexValue();
      }
    });
  });
}

function darkenHex(hex, amount) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const r = Math.max(0, parseInt(full.slice(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(full.slice(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(full.slice(4, 6), 16) - amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function lightenHex(hex, amount) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const r = Math.min(255, parseInt(full.slice(0, 2), 16) + amount);
  const g = Math.min(255, parseInt(full.slice(2, 4), 16) + amount);
  const b = Math.min(255, parseInt(full.slice(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function mixHex(hexA, hexB, ratioToB = 0.5) {
  const clampedRatio = Math.min(1, Math.max(0, ratioToB));
  const parseRgb = (hex) => {
    const h = String(hex || "").replace("#", "");
    const full =
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h;
    return [
      parseInt(full.slice(0, 2), 16),
      parseInt(full.slice(2, 4), 16),
      parseInt(full.slice(4, 6), 16),
    ];
  };

  const a = parseRgb(hexA);
  const b = parseRgb(hexB);
  const mixed = a.map((channel, index) => {
    const value = Math.round(
      channel * (1 - clampedRatio) + b[index] * clampedRatio,
    );
    return Math.min(255, Math.max(0, value));
  });

  return `#${mixed[0].toString(16).padStart(2, "0")}${mixed[1].toString(16).padStart(2, "0")}${mixed[2].toString(16).padStart(2, "0")}`;
}

function buildDerivedTheme(baseTheme, currentTheme) {
  const bg = normalizeHexColor(
    baseTheme.bg,
    currentTheme.bg || DEFAULT_THEME.bg,
  );
  const text = normalizeHexColor(
    baseTheme.text,
    currentTheme.text || DEFAULT_THEME.text,
  );
  const btnBg = normalizeHexColor(
    baseTheme.btnBg,
    currentTheme.btnBg || DEFAULT_THEME.btnBg,
  );

  return {
    ...currentTheme,
    bg,
    text,
    btnBg,
    card: lightenHex(bg, 10),
    cardStrong: lightenHex(bg, 16),
    muted: mixHex(text, bg, 0.45),
    accent: darkenHex(btnBg, 18),
    accent2: darkenHex(btnBg, 30),
    line: darkenHex(bg, 18),
    btnBgActive: darkenHex(btnBg, 8),
  };
}

function applyTheme(themeValue, options = {}) {
  const nextTheme = {
    bg: normalizeHexColor(themeValue.bg, DEFAULT_THEME.bg),
    card: normalizeHexColor(themeValue.card, DEFAULT_THEME.card),
    cardStrong: normalizeHexColor(
      themeValue.cardStrong,
      DEFAULT_THEME.cardStrong,
    ),
    text: normalizeHexColor(themeValue.text, DEFAULT_THEME.text),
    muted: normalizeHexColor(themeValue.muted, DEFAULT_THEME.muted),
    accent: normalizeHexColor(themeValue.accent, DEFAULT_THEME.accent),
    accent2: normalizeHexColor(themeValue.accent2, DEFAULT_THEME.accent2),
    line: normalizeHexColor(themeValue.line, DEFAULT_THEME.line),
    btnBg: normalizeHexColor(themeValue.btnBg, DEFAULT_THEME.btnBg),
    btnBgActive: normalizeHexColor(
      themeValue.btnBgActive,
      DEFAULT_THEME.btnBgActive,
    ),
  };

  theme = nextTheme;

  const root = document.documentElement;
  root.style.setProperty("--bg", nextTheme.bg);
  root.style.setProperty("--card", nextTheme.card);
  root.style.setProperty("--card-strong", nextTheme.cardStrong);
  root.style.setProperty("--text", nextTheme.text);
  root.style.setProperty("--muted", nextTheme.muted);
  root.style.setProperty("--accent", nextTheme.accent);
  root.style.setProperty("--accent-2", nextTheme.accent2);
  root.style.setProperty("--line", nextTheme.line);
  root.style.setProperty("--accent-soft", `${nextTheme.accent}22`);
  root.style.setProperty("--btn-bg", nextTheme.btnBg);
  root.style.setProperty("--btn-bg-active", nextTheme.btnBgActive);

  syncThemeInputs(nextTheme);
  updateThemePreview(nextTheme);

  try {
    localStorage.setItem(THEME_KEY, JSON.stringify(nextTheme));
  } catch {
    // Ignore local storage write failures.
  }

  if (!options.silent) {
    setThemeStatus("Theme updated.");
  }
}

function applyThemePreset(presetId) {
  const preset = PRESET_THEMES[presetId] || PRESET_THEMES.warm;
  applyTheme(preset);
  setThemeStatus("Preset applied.");
}

function updateThemeFromInputs() {
  const nextTheme = {
    ...theme,
    bg: normalizeHexColor(themeBgInput?.value, theme.bg),
    card: normalizeHexColor(themeCardInput?.value, theme.card),
    cardStrong: normalizeHexColor(
      themeCardStrongInput?.value,
      theme.cardStrong,
    ),
    text: normalizeHexColor(themeTextInput?.value, theme.text),
    muted: normalizeHexColor(themeMutedInput?.value, theme.muted),
    accent: normalizeHexColor(themeAccentInput?.value, theme.accent),
    accent2: normalizeHexColor(themeAccent2Input?.value, theme.accent2),
    line: normalizeHexColor(themeLineInput?.value, theme.line),
    btnBg: normalizeHexColor(themeBtnInput?.value, theme.btnBg),
    btnBgActive: normalizeHexColor(
      themeBtnActiveInput?.value,
      theme.btnBgActive,
    ),
  };

  applyTheme(nextTheme);
}

function stopThemeColorLiveSync() {
  if (themeLiveSyncTimer) {
    window.clearInterval(themeLiveSyncTimer);
    themeLiveSyncTimer = null;
  }
  activeThemeColorInput = null;
}

function startThemeColorLiveSync(inputElement) {
  if (!inputElement) {
    return;
  }

  activeThemeColorInput = inputElement;
  let lastValue = inputElement.value;

  if (themeLiveSyncTimer) {
    window.clearInterval(themeLiveSyncTimer);
  }

  themeLiveSyncTimer = window.setInterval(() => {
    if (!activeThemeColorInput) {
      stopThemeColorLiveSync();
      return;
    }

    const currentValue = activeThemeColorInput.value;
    if (currentValue !== lastValue) {
      lastValue = currentValue;
      updateThemeFromInputs();
    }
  }, 80);
}

function resetTheme() {
  applyTheme(DEFAULT_THEME);
  setThemeStatus("Theme reset to default.");
}

function exportTheme() {
  const payload = {
    exportedAt: new Date().toISOString(),
    version: 1,
    theme,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateTag = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `bible-theme-${dateTag}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  setThemeStatus("Theme exported.");
}

async function importThemeFromFile(event) {
  const inputElement = event.target;
  const file = inputElement.files && inputElement.files[0];

  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const candidateTheme =
      parsed && typeof parsed === "object" && parsed.theme
        ? parsed.theme
        : parsed;

    if (!candidateTheme || typeof candidateTheme !== "object") {
      setThemeStatus("Invalid theme file.");
      return;
    }

    applyTheme(candidateTheme);
    setThemeStatus("Theme imported.");
  } catch {
    setThemeStatus("Could not import theme. Use a valid JSON file.");
  } finally {
    inputElement.value = "";
  }
}

function loadReadingMode() {
  try {
    const value = String(localStorage.getItem(READING_MODE_KEY) || "")
      .trim()
      .toLowerCase();
    return ALLOWED_READING_MODES.has(value) ? value : "comfortable";
  } catch {
    return "comfortable";
  }
}

function loadFocusMode() {
  try {
    return localStorage.getItem(FOCUS_MODE_KEY) === "on" ? "on" : "off";
  } catch {
    return "off";
  }
}

function loadSpacingMode() {
  try {
    const value = String(localStorage.getItem(SPACING_MODE_KEY) || "")
      .trim()
      .toLowerCase();
    return ALLOWED_SPACING_MODES.has(value) ? value : "normal";
  } catch {
    return "normal";
  }
}

function updateReadingModeButtons() {
  const isCompact = readingMode === "compact";

  if (compactModeBtn) {
    compactModeBtn.classList.toggle("reading-mode-btn-active", isCompact);
    compactModeBtn.setAttribute("aria-pressed", String(isCompact));
  }

  if (comfortableModeBtn) {
    comfortableModeBtn.classList.toggle("reading-mode-btn-active", !isCompact);
    comfortableModeBtn.setAttribute("aria-pressed", String(!isCompact));
  }
}

function applyReadingMode(mode) {
  const normalizedMode = ALLOWED_READING_MODES.has(mode) ? mode : "comfortable";

  readingMode = normalizedMode;
  document.body.dataset.readingMode = normalizedMode;
  try {
    localStorage.setItem(READING_MODE_KEY, normalizedMode);
  } catch {
    // Ignore storage write failures and still apply the mode locally.
  }
  updateReadingModeButtons();
}

function updateFocusModeButton() {
  if (!focusModeBtn) {
    return;
  }

  const isFocused = focusMode === "on";
  focusModeBtn.classList.toggle("focus-mode-btn-active", isFocused);
  focusModeBtn.setAttribute("aria-pressed", String(isFocused));
  focusModeBtn.textContent = isFocused ? "Exit Focus" : "Focus Reading";
}

function applyFocusMode(mode) {
  focusMode = mode === "on" ? "on" : "off";
  document.body.dataset.focusMode = focusMode;
  try {
    localStorage.setItem(FOCUS_MODE_KEY, focusMode);
  } catch {
    // Ignore storage failures and still apply the mode locally.
  }
  updateFocusModeButton();
  updateMobileHeaderControls();
}

function toggleFocusMode() {
  applyFocusMode(focusMode === "on" ? "off" : "on");
}

function updateSpacingModeButton() {
  if (!spacingModeBtn) {
    return;
  }

  const isRelaxed = spacingMode === "relaxed";
  spacingModeBtn.classList.toggle("spacing-mode-btn-active", isRelaxed);
  spacingModeBtn.setAttribute("aria-pressed", String(isRelaxed));
  spacingModeBtn.textContent = isRelaxed
    ? "Relaxed Spacing: On"
    : "Relaxed Spacing";
}

function applySpacingMode(mode) {
  spacingMode = ALLOWED_SPACING_MODES.has(mode) ? mode : "normal";
  document.body.dataset.spacingMode = spacingMode;

  try {
    localStorage.setItem(SPACING_MODE_KEY, spacingMode);
  } catch {
    // Ignore storage failures and still apply the mode locally.
  }

  updateSpacingModeButton();
}

function toggleSpacingMode() {
  applySpacingMode(spacingMode === "relaxed" ? "normal" : "relaxed");
}

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

function loadCustomTopics() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CUSTOM_TOPICS_KEY) || "[]");
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        id: String(item.id || "").trim(),
        name: String(item.name || "").trim(),
        description: String(item.description || "").trim(),
        references: Array.isArray(item.references)
          ? item.references
              .map((ref) => normalizeReference(ref))
              .filter(Boolean)
          : [],
        custom: true,
      }))
      .filter(
        (item) =>
          /^custom-[a-z0-9-]{2,40}$/i.test(item.id) &&
          item.name &&
          item.references.length,
      );
  } catch {
    return [];
  }
}

function saveCustomTopics() {
  const payload = customTopics.map((topic) => ({
    id: topic.id,
    name: topic.name,
    description: topic.description,
    references: topic.references,
  }));
  localStorage.setItem(CUSTOM_TOPICS_KEY, JSON.stringify(payload));
}

function normalizeImportedCustomTopic(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const name = sanitizeTopicName(item.name || "");
  if (!name) {
    return null;
  }

  const description = sanitizeTopicDescription(item.description || "");
  const references = Array.isArray(item.references)
    ? item.references.map((ref) => normalizeReference(ref)).filter(Boolean)
    : [];

  if (!references.length) {
    return null;
  }

  const idBase = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 30);

  return {
    id: `custom-${idBase || "topic"}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    description,
    references: references.slice(0, 20),
    custom: true,
  };
}

function sanitizeTopicName(name) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 60);
}

function sanitizeTopicDescription(description) {
  return String(description || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 160);
}

function parseTopicReferences(value) {
  const pieces = String(value || "")
    .split(/\n|,/g)
    .map((item) => normalizeReference(item))
    .filter(Boolean);

  const deduped = [];
  const seen = new Set();
  pieces.forEach((item) => {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(item);
    }
  });
  return deduped.slice(0, 20);
}

function setCustomTopicStatus(text, isError = false) {
  if (!customTopicStatus) {
    return;
  }
  customTopicStatus.textContent = text;
  customTopicStatus.className = isError ? "error" : "meta";
}

function updateCustomEditorState() {
  if (saveCustomTopicBtn) {
    saveCustomTopicBtn.textContent = editingCustomTopicId
      ? "Update Custom Topic"
      : "Save Custom Topic";
  }

  if (cancelCustomTopicEditBtn) {
    cancelCustomTopicEditBtn.style.display = editingCustomTopicId
      ? "inline-flex"
      : "none";
  }

  if (customEditorState) {
    if (editingCustomTopicId) {
      const topic = customTopics.find(
        (item) => item.id === editingCustomTopicId,
      );
      customEditorState.textContent = topic
        ? `Editing custom topic: ${topic.name}`
        : "Editing custom topic.";
    } else {
      customEditorState.textContent = "Creating a new custom topic.";
    }
  }
}

function beginCustomTopicEdit(topicId) {
  const topic = customTopics.find((item) => item.id === topicId);
  if (!topic) {
    setCustomTopicStatus("That custom topic was not found.", true);
    return;
  }

  editingCustomTopicId = topic.id;
  if (customTopicName) {
    customTopicName.value = topic.name;
  }
  if (customTopicDescription) {
    customTopicDescription.value = topic.description;
  }
  if (customTopicRefs) {
    customTopicRefs.value = topic.references.join("\n");
  }
  if (topicSelect) {
    topicSelect.value = topic.id;
  }

  updateCustomEditorState();
  setCustomTopicStatus("Loaded custom topic into the editor.");
}

function dedupeTopics(topics) {
  const deduped = [];
  const seen = new Set();

  topics.forEach((topic) => {
    const key = `${String(topic.name || "").toLowerCase()}|${Array.isArray(topic.references) ? topic.references.join("|").toLowerCase() : ""}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(topic);
    }
  });

  return deduped;
}

function getReplaceConfirmationText() {
  return String(replaceConfirmInput?.value || "").trim();
}

function canOpenImportPicker() {
  if (!replaceCustomTopicsMode?.checked) {
    return true;
  }

  return getReplaceConfirmationText() === "REPLACE";
}

function syncImportControlState() {
  const enabled = canOpenImportPicker();

  if (importCustomTopicsInput) {
    importCustomTopicsInput.disabled = !enabled;
  }

  if (importCustomTopicsLabel) {
    importCustomTopicsLabel.classList.toggle("file-btn-disabled", !enabled);
    importCustomTopicsLabel.setAttribute("aria-disabled", String(!enabled));
    importCustomTopicsLabel.title = enabled
      ? "Import topics from a JSON file"
      : "Type REPLACE exactly to enable destructive import";
  }
}

function renderCustomTopicList() {
  if (!customTopicList) {
    return;
  }

  customTopicList.textContent = "";

  if (!customTopics.length) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No custom topics yet.";
    customTopicList.appendChild(li);
    return;
  }

  customTopics.forEach((topic, index) => {
    const li = document.createElement("li");
    li.className = "custom-topic-row";

    const main = document.createElement("div");
    main.className = "custom-topic-main";

    const useBtn = document.createElement("button");
    useBtn.type = "button";
    useBtn.className = "outline-btn custom-topic-main-btn";
    useBtn.dataset.customTopicId = topic.id;
    useBtn.dataset.customTopicAction = "edit";
    useBtn.textContent = topic.name;

    const refsList = document.createElement("ul");
    refsList.className = "custom-topic-ref-list";
    topic.references.forEach((reference) => {
      const item = document.createElement("li");
      item.textContent = reference;
      refsList.appendChild(item);
    });

    const controls = document.createElement("div");
    controls.className = "custom-topic-controls";

    const upBtn = document.createElement("button");
    upBtn.type = "button";
    upBtn.className = "outline-btn custom-topic-move-btn";
    upBtn.dataset.customTopicId = topic.id;
    upBtn.dataset.customTopicAction = "move-up";
    upBtn.textContent = "↑";
    upBtn.disabled = index === 0;
    upBtn.setAttribute("aria-label", `Move ${topic.name} up`);

    const downBtn = document.createElement("button");
    downBtn.type = "button";
    downBtn.className = "outline-btn custom-topic-move-btn";
    downBtn.dataset.customTopicId = topic.id;
    downBtn.dataset.customTopicAction = "move-down";
    downBtn.textContent = "↓";
    downBtn.disabled = index === customTopics.length - 1;
    downBtn.setAttribute("aria-label", `Move ${topic.name} down`);

    controls.appendChild(upBtn);
    controls.appendChild(downBtn);
    main.appendChild(useBtn);
    main.appendChild(refsList);
    li.appendChild(main);
    li.appendChild(controls);
    customTopicList.appendChild(li);
  });
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

function normalizeOpinionSubject(value) {
  const normalized = String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 140);

  return /^[a-z0-9\s,.:;\-?'"()!/&]+$/i.test(normalized) ? normalized : "";
}

function clearOpinionLinks() {
  if (!opinionLinksBox) {
    return;
  }
  opinionLinksBox.textContent = "";
}

function renderOpinionLinks(subject) {
  if (!opinionLinksBox) {
    return;
  }

  opinionLinksBox.textContent = "";
  const safeSubject = normalizeOpinionSubject(subject);

  if (!safeSubject) {
    const helper = document.createElement("div");
    helper.className = "meta";
    helper.textContent = "Enter a valid Bible-related subject to search.";
    opinionLinksBox.appendChild(helper);
    return;
  }

  const queryBase = `${safeSubject} Bible Christian viewpoints`;
  const searches = [
    {
      label: "DuckDuckGo: Diverse discussions",
      href: `https://duckduckgo.com/?q=${encodeURIComponent(queryBase)}`,
    },
    {
      label: "Google: Articles and commentary",
      href: `https://www.google.com/search?q=${encodeURIComponent(queryBase)}`,
    },
    {
      label: "Bing: News and long-form resources",
      href: `https://www.bing.com/search?q=${encodeURIComponent(queryBase)}`,
    },
    {
      label: "Reddit: Community discussion threads",
      href: `https://www.reddit.com/search/?q=${encodeURIComponent(`${safeSubject} Bible`)}`,
    },
    {
      label: "YouTube: Debates and teaching videos",
      href: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${safeSubject} Bible debate`)}`,
    },
  ];

  searches.forEach((item) => {
    const link = document.createElement("a");
    link.className = "opinion-link";
    link.href = item.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = item.label;
    opinionLinksBox.appendChild(link);
  });

  const helper = document.createElement("div");
  helper.className = "meta";
  helper.textContent = `Showing web search sources for: ${safeSubject}`;
  opinionLinksBox.appendChild(helper);
}

function searchOpinionSubject() {
  const subject = normalizeOpinionSubject(opinionSubjectInput?.value || "");

  if (!subject) {
    renderOpinionLinks("");
    return;
  }

  if (opinionSubjectInput) {
    opinionSubjectInput.value = subject;
  }

  renderOpinionLinks(subject);
}

function populateBookSelect() {
  bookSelect.innerHTML = BOOKS.map(
    (book) => `<option value="${book.name}">${book.name}</option>`,
  ).join("");
  bookSelect.value = "John";
}

function populateChapterSelect(preferredChapter = "") {
  const selected =
    BOOKS.find((book) => book.name === bookSelect.value) || BOOKS[0];
  const chapterOptions = [];

  for (let index = 1; index <= selected.chapters; index += 1) {
    chapterOptions.push(`<option value="${index}">${index}</option>`);
  }

  chapterSelect.innerHTML = chapterOptions.join("");
  const fallbackChapter = selected.name === "John" ? 3 : 1;
  const normalizedPreferredChapter = Number(preferredChapter);
  const resolvedChapter = Number.isInteger(normalizedPreferredChapter)
    ? Math.min(Math.max(normalizedPreferredChapter, 1), selected.chapters)
    : fallbackChapter;

  chapterSelect.value = String(resolvedChapter);
  updatePassageMeta();
}

function populateVerseSelect(verseCount = 50, preferredVerse = "") {
  const options = [];

  for (let index = 1; index <= verseCount; index += 1) {
    options.push(`<option value="${index}">${index}</option>`);
  }

  verseSelect.innerHTML = options.join("");
  const fallbackVerse = verseCount >= 16 ? 16 : 1;
  const normalizedPreferredVerse = Number(preferredVerse);
  const resolvedVerse = Number.isInteger(normalizedPreferredVerse)
    ? Math.min(Math.max(normalizedPreferredVerse, 1), verseCount)
    : fallbackVerse;

  verseSelect.value = String(resolvedVerse);
}

function buildReferenceFromSelectors() {
  input.value = `${bookSelect.value} ${chapterSelect.value}:${verseSelect.value}`;
}

function updatePassageMeta(selectedChapterVerseCount = null) {
  if (!passageMeta) {
    return;
  }

  const selectedBook =
    BOOKS.find((book) => book.name === bookSelect.value) || BOOKS[0];
  const totalVerses = BOOK_VERSE_TOTALS[selectedBook.name];
  const chapter = Number(chapterSelect.value) || 1;
  const chapterCountLabel =
    selectedBook.chapters === 1
      ? "1 chapter"
      : `${selectedBook.chapters} chapters`;
  const totalVersesLabel = Number.isFinite(totalVerses)
    ? `${totalVerses.toLocaleString()} verses`
    : "verse count unavailable";

  if (Number.isFinite(selectedChapterVerseCount)) {
    passageMeta.textContent = `${selectedBook.name}: ${chapterCountLabel}, ${totalVersesLabel}. Chapter ${chapter} has ${selectedChapterVerseCount} verses.`;
    return;
  }

  passageMeta.textContent = `${selectedBook.name}: ${chapterCountLabel}, ${totalVersesLabel}.`;
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

    populateVerseSelect(verseCount, currentVerse);

    updatePassageMeta(verseCount);
  } catch {
    populateVerseSelect(50);
    updatePassageMeta();
  }

  buildReferenceFromSelectors();
}

function renderVerse(payload) {
  const verses =
    Array.isArray(payload.verses) && payload.verses.length > 0
      ? payload.verses
      : null;
  let textHtml;
  if (verses) {
    textHtml = verses
      .map(
        (v) =>
          `<span class="verse-number">${escapeHtml(String(v.verse))}</span>${escapeHtml(v.text)}`,
      )
      .join(" ");
  } else {
    textHtml = escapeHtml(payload.text);
  }
  resultBox.innerHTML = `
    <h2 class="result-heading">Verse Result</h2>
    <div class="reference">${escapeHtml(payload.canonicalReference)}</div>
    <div class="text">${textHtml}</div>
    <div class="meta">Translation: ${escapeHtml(payload.translation || "Unknown")}</div>
  `;
}

function renderError(message) {
  resultBox.innerHTML = `
    <h2 class="result-heading">Verse Result</h2>
    <div class="error">${escapeHtml(message)}</div>
  `;
}

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function renderTopicResults(payload) {
  if (!topicResultsBox) {
    return;
  }

  const topicName = escapeHtml(payload.topic?.name || "Topic");
  const topicDescription = escapeHtml(payload.topic?.description || "");
  const verses = Array.isArray(payload.verses) ? payload.verses : [];

  if (verses.length === 0) {
    topicResultsBox.innerHTML = `
      <h2 class="result-heading">Topic Passages</h2>
      <div class="reference">${topicName}</div>
      <div class="meta">${topicDescription}</div>
      <div class="meta">No verses were found for this topic in the selected translation.</div>
    `;
    return;
  }

  const listHtml = verses
    .map((verse, index) => {
      const ref = escapeHtml(
        verse.canonicalReference || verse.query || "Unknown reference",
      );
      return `
        <article class="topic-item">
          <a
            href="#"
            class="topic-ref-link"
            data-topic-reference="${ref}"
            data-topic-index="${index}"
          >
            ${ref}
          </a>
        </article>
      `;
    })
    .join("");

  topicResultsBox.innerHTML = `
    <h2 class="result-heading">Topic Passages</h2>
    <div class="reference">${topicName}</div>
    <div class="meta">${topicDescription}</div>
    <div class="topic-result-list">${listHtml}</div>
  `;
}

function populateTopicSelect(topics) {
  if (!topicSelect) {
    return;
  }

  const selected = topicSelect.value;
  topicSelect.innerHTML = '<option value="">Select a Bible subject...</option>';

  topics.forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic.id;
    option.textContent = topic.name;
    topicSelect.appendChild(option);
  });

  if (selected && topics.some((topic) => topic.id === selected)) {
    topicSelect.value = selected;
  }
}

function resetTopicSelectToPrompt() {
  if (!topicSelect) {
    return;
  }

  if (Array.from(topicSelect.options).some((option) => option.value === "")) {
    topicSelect.value = "";
    return;
  }

  const promptOption = document.createElement("option");
  promptOption.value = "";
  promptOption.textContent = "Select a Bible subject...";
  topicSelect.prepend(promptOption);
  topicSelect.value = "";
}

function getFilteredTopics(filterValue = "") {
  const q = String(filterValue || "")
    .trim()
    .toLowerCase();
  const merged = [...builtinTopics, ...customTopics];

  if (!q) {
    return merged;
  }

  return merged.filter((topic) => {
    return (
      String(topic.name || "")
        .toLowerCase()
        .includes(q) ||
      String(topic.description || "")
        .toLowerCase()
        .includes(q)
    );
  });
}

async function loadTopics(filterValue = "") {
  if (!topicSelect) {
    return;
  }

  try {
    const response = await fetch("/api/topics");
    const payload = await parseJsonSafe(response);

    if (!response.ok || !payload || !Array.isArray(payload.topics)) {
      return;
    }

    builtinTopics = payload.topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      description: topic.description,
      custom: false,
    }));

    availableTopics = getFilteredTopics(filterValue);
    populateTopicSelect(availableTopics);
  } catch {
    availableTopics = getFilteredTopics(filterValue);
    populateTopicSelect(availableTopics);
  }
}

async function loadTopicVerses() {
  if (!topicSelect || !topicResultsBox) {
    return;
  }

  const topicId = String(topicSelect.value || "").trim();
  const translation = normalizeTranslation(translationSelect.value);

  if (!topicId) {
    topicResultsBox.innerHTML =
      '<h2 class="result-heading">Topic Passages</h2><div class="error">Please select a topic first.</div>';
    return;
  }

  topicResultsBox.innerHTML =
    '<h2 class="result-heading">Topic Passages</h2><div class="meta">Loading topic passages...</div>';

  resetTopicSelectToPrompt();

  const selectedCustomTopic = customTopics.find(
    (topic) => topic.id === topicId,
  );

  if (selectedCustomTopic) {
    try {
      const results = await Promise.all(
        selectedCustomTopic.references.map(async (reference) => {
          const response = await fetch(
            `/api/verse?reference=${encodeURIComponent(reference)}&translation=${encodeURIComponent(translation)}`,
          );
          const payload = await parseJsonSafe(response);
          if (!response.ok || !payload) {
            return null;
          }
          return {
            query: reference,
            canonicalReference: payload.canonicalReference,
            translation: payload.translation,
            translationId: payload.translationId,
            text: payload.text,
          };
        }),
      );

      renderTopicResults({
        topic: {
          id: selectedCustomTopic.id,
          name: selectedCustomTopic.name,
          description: selectedCustomTopic.description,
        },
        verses: results.filter(Boolean),
      });
      return;
    } catch (error) {
      topicResultsBox.innerHTML = `<h2 class="result-heading">Topic Passages</h2><div class="error">${escapeHtml(`Network error. ${error.message || "Please try again."}`)}</div>`;
      return;
    }
  }

  try {
    const response = await fetch(
      `/api/topic-verses?topic=${encodeURIComponent(topicId)}&translation=${encodeURIComponent(translation)}`,
    );
    const payload = await parseJsonSafe(response);

    if (!response.ok || !payload) {
      const message =
        (payload && payload.error) ||
        `Topic request failed (HTTP ${response.status}). Please try again.`;
      topicResultsBox.innerHTML = `<h2 class="result-heading">Topic Passages</h2><div class="error">${escapeHtml(message)}</div>`;
      return;
    }

    renderTopicResults(payload);
  } catch (error) {
    topicResultsBox.innerHTML = `<h2 class="result-heading">Topic Passages</h2><div class="error">${escapeHtml(`Network error. ${error.message || "Please try again."}`)}</div>`;
  }
}

async function searchBibleSubject() {
  if (!bibleSubjectInput || !topicResultsBox) {
    return;
  }

  const searchQuery = String(bibleSubjectInput.value || "").trim();
  const translation = normalizeTranslation(translationSelect.value);

  if (!searchQuery) {
    topicResultsBox.innerHTML =
      '<h2 class="result-heading">Bible Subject Search</h2><div class="error">Please enter a subject to search.</div>';
    return;
  }

  topicResultsBox.innerHTML =
    '<h2 class="result-heading">Bible Subject Search</h2><div class="meta">Searching Bible topics for "' +
    escapeHtml(searchQuery) +
    '"...</div>';

  try {
    // Fetch all available topics
    const topicsResponse = await fetch("/api/topics");
    const topicsPayload = await parseJsonSafe(topicsResponse);

    if (
      !topicsResponse.ok ||
      !topicsPayload ||
      !Array.isArray(topicsPayload.topics)
    ) {
      topicResultsBox.innerHTML = `<h2 class="result-heading">Bible Subject Search</h2><div class="error">Could not fetch topics. Please try again.</div>`;
      return;
    }

    // Filter topics by keyword match
    const queryLower = searchQuery.toLowerCase();
    const matchingTopics = topicsPayload.topics.filter((topic) => {
      return (
        topic.name.toLowerCase().includes(queryLower) ||
        topic.description.toLowerCase().includes(queryLower)
      );
    });

    if (matchingTopics.length === 0) {
      topicResultsBox.innerHTML = `<h2 class="result-heading">Bible Subject Search</h2><div class="meta">No Bible topics match "${escapeHtml(searchQuery)}". Try a different search term.</div>`;
      return;
    }

    // Fetch verses for all matching topics and group by topic
    const topicResults = [];

    for (const topic of matchingTopics) {
      try {
        const verseResponse = await fetch(
          `/api/topic-verses?topic=${encodeURIComponent(topic.id)}&translation=${encodeURIComponent(translation)}`,
        );
        const versePayload = await parseJsonSafe(verseResponse);

        if (
          verseResponse.ok &&
          versePayload &&
          versePayload.verses &&
          versePayload.verses.length > 0
        ) {
          topicResults.push({
            topic,
            verses: versePayload.verses,
          });
        }
      } catch {
        // Skip this topic if fetch fails
      }
    }

    if (topicResults.length === 0) {
      topicResultsBox.innerHTML = `<h2 class="result-heading">Bible Subject Search</h2><div class="meta">Topics found but no verses available for "${escapeHtml(searchQuery)}".</div>`;
      return;
    }

    // Build HTML with grouped topics and verses
    let totalVersesCount = 0;
    const groupsHtml = topicResults
      .map((result) => {
        totalVersesCount += result.verses.length;
        const topicName = escapeHtml(result.topic.name);
        const topicDesc = escapeHtml(result.topic.description);

        const versesHtml = result.verses
          .map((verse) => {
            const ref = escapeHtml(
              verse.canonicalReference || verse.query || "Unknown",
            );
            const text = escapeHtml(verse.text || "");
            return `
          <article class="topic-item">
            <div class="topic-item-reference">${ref}</div>
            <div class="text">${text}</div>
          </article>
        `;
          })
          .join("");

        return `
        <div class="search-result-group">
          <h3 class="result-heading" style="font-size: 1.1rem; margin-top: 1.2rem; margin-bottom: 0.5rem;">${topicName}</h3>
          <div class="meta" style="margin-bottom: 1rem;">${topicDesc}</div>
          <div class="topic-result-list">${versesHtml}</div>
        </div>
      `;
      })
      .join("");

    const headerHtml = `<h2 class="result-heading">Bible Subject Search: "${escapeHtml(searchQuery)}"</h2><div class="meta">${topicResults.length} topic(s) found with ${totalVersesCount} verse(s).</div>`;

    topicResultsBox.innerHTML = headerHtml + groupsHtml;
    if (bibleSearchClearBtn) {
      bibleSearchClearBtn.style.display = "block";
    }
  } catch (error) {
    topicResultsBox.innerHTML = `<h2 class="result-heading">Bible Subject Search</h2><div class="error">${escapeHtml(`Network error. ${error.message || "Please try again."}`)}</div>`;
    if (bibleSearchClearBtn) {
      bibleSearchClearBtn.style.display = "block";
    }
  }
}

function clearBibleSearch() {
  if (!bibleSubjectInput || !topicResultsBox) {
    return;
  }

  bibleSubjectInput.value = "";
  topicResultsBox.innerHTML =
    '<h2 class="result-heading">Topic Passages</h2><div class="meta">Pick a topic to view related passages.</div>';
  if (bibleSearchClearBtn) {
    bibleSearchClearBtn.style.display = "none";
  }
  bibleSubjectInput.focus();
}

function loadTopicVerseFromButton(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const trigger = target.closest("[data-topic-reference]");
  if (!(trigger instanceof HTMLElement)) {
    return;
  }

  event.preventDefault();

  if (!trigger.dataset.topicReference) {
    return;
  }

  input.value = trigger.dataset.topicReference;
  getVerse();
}

function clearCustomTopicForm() {
  if (customTopicName) {
    customTopicName.value = "";
  }
  if (customTopicDescription) {
    customTopicDescription.value = "";
  }
  if (customTopicRefs) {
    customTopicRefs.value = "";
  }
}

function resetCustomTopicEditor() {
  editingCustomTopicId = "";
  clearCustomTopicForm();
  updateCustomEditorState();
}

function refreshTopicsUi(filterValue = "") {
  renderCustomTopicList();
  availableTopics = getFilteredTopics(filterValue);
  populateTopicSelect(availableTopics);
  updateCustomEditorState();
}

function moveCustomTopic(topicId, direction) {
  const index = customTopics.findIndex((topic) => topic.id === topicId);
  if (index === -1) {
    setCustomTopicStatus("That custom topic was not found.", true);
    return;
  }

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= customTopics.length) {
    return;
  }

  const reordered = [...customTopics];
  const [topic] = reordered.splice(index, 1);
  reordered.splice(targetIndex, 0, topic);
  customTopics = reordered;
  saveCustomTopics();
  refreshTopicsUi("");
  if (topicSelect) {
    topicSelect.value = topicId;
  }
  setCustomTopicStatus(
    `Moved custom topic ${direction === "up" ? "up" : "down"}.`,
  );
}

function saveCustomTopic() {
  const name = sanitizeTopicName(customTopicName?.value || "");
  const description = sanitizeTopicDescription(
    customTopicDescription?.value || "",
  );
  const references = parseTopicReferences(customTopicRefs?.value || "");

  if (!name) {
    setCustomTopicStatus("Custom topic name is required.", true);
    return;
  }

  if (!references.length) {
    setCustomTopicStatus("Add at least one valid verse reference.", true);
    return;
  }

  let id = editingCustomTopicId;

  if (editingCustomTopicId) {
    const existingIndex = customTopics.findIndex(
      (topic) => topic.id === editingCustomTopicId,
    );

    if (existingIndex === -1) {
      setCustomTopicStatus("That custom topic was not found.", true);
      resetCustomTopicEditor();
      return;
    }

    customTopics[existingIndex] = {
      ...customTopics[existingIndex],
      name,
      description,
      references,
      custom: true,
    };
  } else {
    const idBase = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 30);
    id = `custom-${idBase || "topic"}-${Date.now().toString(36)}`;

    customTopics.unshift({
      id,
      name,
      description,
      references,
      custom: true,
    });
  }

  customTopics = customTopics.slice(0, 40);
  saveCustomTopics();
  refreshTopicsUi("");
  topicSelect.value = id;
  setCustomTopicStatus(
    editingCustomTopicId ? "Custom topic updated." : "Custom topic saved.",
  );
  resetCustomTopicEditor();
}

function cancelCustomTopicEdit() {
  if (!editingCustomTopicId) {
    clearCustomTopicForm();
    setCustomTopicStatus("Editor cleared.");
    return;
  }

  resetCustomTopicEditor();
  setCustomTopicStatus("Edit canceled.");
}

function deleteSelectedCustomTopic() {
  if (!topicSelect) {
    return;
  }

  const selectedId = String(topicSelect.value || "").trim();
  if (!selectedId.startsWith("custom-")) {
    setCustomTopicStatus("Select a custom topic first to delete it.", true);
    return;
  }

  const before = customTopics.length;
  customTopics = customTopics.filter((topic) => topic.id !== selectedId);

  if (customTopics.length === before) {
    setCustomTopicStatus("That custom topic was not found.", true);
    return;
  }

  saveCustomTopics();
  refreshTopicsUi("");
  topicResultsBox.innerHTML =
    '<div class="meta">Pick a topic to view related passages.</div>';
  if (editingCustomTopicId === selectedId) {
    resetCustomTopicEditor();
  }
  setCustomTopicStatus("Custom topic deleted.");
}

function exportCustomTopics() {
  if (!customTopics.length) {
    setCustomTopicStatus("There are no custom topics to export.", true);
    return;
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    version: 1,
    topics: customTopics.map((topic) => ({
      name: topic.name,
      description: topic.description,
      references: topic.references,
    })),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `bible-custom-topics-${timestamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  setCustomTopicStatus("Custom topics exported.");
}

async function importCustomTopicsFromFile(event) {
  const inputElement = event.target;
  const file = inputElement.files && inputElement.files[0];

  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const sourceTopics = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed.topics)
        ? parsed.topics
        : null;

    if (!sourceTopics) {
      setCustomTopicStatus(
        "Invalid file format. Expected a topics array.",
        true,
      );
      return;
    }

    const normalized = sourceTopics
      .map((item) => normalizeImportedCustomTopic(item))
      .filter(Boolean);

    if (!normalized.length) {
      setCustomTopicStatus("No valid topics found in that file.", true);
      return;
    }

    const shouldReplace = Boolean(replaceCustomTopicsMode?.checked);

    if (shouldReplace) {
      if (getReplaceConfirmationText() !== "REPLACE") {
        setCustomTopicStatus(
          'Type REPLACE exactly to enable "replace existing" import.',
          true,
        );
        return;
      }

      const confirmed = window.confirm(
        "Replace all existing custom topics with imported topics? This cannot be undone.",
      );

      if (!confirmed) {
        setCustomTopicStatus("Import canceled.");
        return;
      }
    }

    const candidateTopics = shouldReplace
      ? normalized
      : [...normalized, ...customTopics];
    const deduped = dedupeTopics(candidateTopics);
    const previousCount = customTopics.length;

    customTopics = deduped.slice(0, 40);
    saveCustomTopics();
    refreshTopicsUi("");

    if (shouldReplace) {
      setCustomTopicStatus(
        `Replaced ${previousCount} topic(s) with ${customTopics.length} imported topic(s).`,
      );
      if (replaceConfirmInput) {
        replaceConfirmInput.value = "";
      }
    } else {
      setCustomTopicStatus(`Imported ${normalized.length} topic(s).`);
    }
  } catch {
    setCustomTopicStatus(
      "Could not read that file. Make sure it is valid JSON.",
      true,
    );
  } finally {
    inputElement.value = "";
  }
}

function selectCustomTopicFromList(event) {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const customId = String(target.dataset.customTopicId || "").trim();
  const action = String(target.dataset.customTopicAction || "edit").trim();
  if (!customId) {
    return;
  }

  if (action === "move-up") {
    moveCustomTopic(customId, "up");
    return;
  }

  if (action === "move-down") {
    moveCustomTopic(customId, "down");
    return;
  }

  beginCustomTopicEdit(customId);
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

function cloneSavedItems(items) {
  return Array.isArray(items)
    ? items.map((item) => ({
        reference: item.reference,
        translation: normalizeTranslation(item.translation),
      }))
    : [];
}

function captureSavedSnapshot() {
  return {
    history: cloneSavedItems(history),
    favorites: cloneSavedItems(favorites),
  };
}

function hideSavedUndoToast() {
  if (savedUndoTimer) {
    window.clearTimeout(savedUndoTimer);
    savedUndoTimer = null;
  }

  if (undoToast) {
    undoToast.classList.remove("undo-toast-show");
  }
}

function showSavedUndoToast(message, snapshot) {
  if (!undoToast || !undoToastText || !undoToastActionBtn) {
    return;
  }

  savedUndoSnapshot = snapshot;
  undoToastText.textContent = message;
  undoToast.classList.add("undo-toast-show");

  if (savedUndoTimer) {
    window.clearTimeout(savedUndoTimer);
  }

  savedUndoTimer = window.setTimeout(() => {
    savedUndoSnapshot = null;
    hideSavedUndoToast();
  }, SAVED_UNDO_TIMEOUT_MS);
}

function restoreSavedSnapshot(snapshot) {
  history = cloneSavedItems(snapshot?.history);
  favorites = cloneSavedItems(snapshot?.favorites);
  saveSaved(HISTORY_KEY, history);
  saveSaved(FAVORITES_KEY, favorites);
  renderSavedLists();
}

function undoSavedListChange() {
  if (!savedUndoSnapshot) {
    hideSavedUndoToast();
    return;
  }

  restoreSavedSnapshot(savedUndoSnapshot);
  savedUndoSnapshot = null;
  hideSavedUndoToast();
}

function clearHistory() {
  if (!history.length) {
    return;
  }

  const snapshot = captureSavedSnapshot();

  const confirmed = window.confirm(
    "Clear all recent searches? This cannot be undone.",
  );
  if (!confirmed) {
    return;
  }

  history = [];
  saveSaved(HISTORY_KEY, history);
  renderSavedLists();
  showSavedUndoToast("Recent searches cleared.", snapshot);
}

function clearFavorites() {
  if (!favorites.length) {
    return;
  }

  const snapshot = captureSavedSnapshot();

  const confirmed = window.confirm(
    "Clear all favorites? This cannot be undone.",
  );
  if (!confirmed) {
    return;
  }

  favorites = [];
  saveSaved(FAVORITES_KEY, favorites);
  renderSavedLists();
  showSavedUndoToast("Favorites cleared.", snapshot);
}

function renderSavedLists() {
  historyList.textContent = "";
  favoriteList.textContent = "";

  history.forEach((item) => {
    const li = document.createElement("li");
    li.className = "saved-item-row";

    const button = document.createElement("button");
    button.className = "chip";
    button.type = "button";
    button.dataset.reference = item.reference;
    button.dataset.translation = item.translation;
    button.textContent = `${item.reference} (${item.translation.toUpperCase()})`;

    const removeBtn = document.createElement("button");
    removeBtn.className = "chip-remove-btn";
    removeBtn.type = "button";
    removeBtn.dataset.action = "remove-saved";
    removeBtn.dataset.listType = "history";
    removeBtn.dataset.reference = item.reference;
    removeBtn.dataset.translation = item.translation;
    removeBtn.textContent = "×";
    removeBtn.setAttribute(
      "aria-label",
      `Remove ${item.reference} (${item.translation.toUpperCase()}) from recent searches`,
    );

    li.appendChild(button);
    li.appendChild(removeBtn);
    historyList.appendChild(li);
  });

  favorites.forEach((item) => {
    const li = document.createElement("li");
    li.className = "saved-item-row";

    const button = document.createElement("button");
    button.className = "chip";
    button.type = "button";
    button.dataset.reference = item.reference;
    button.dataset.translation = item.translation;
    button.textContent = `${item.reference} (${item.translation.toUpperCase()})`;

    const removeBtn = document.createElement("button");
    removeBtn.className = "chip-remove-btn";
    removeBtn.type = "button";
    removeBtn.dataset.action = "remove-saved";
    removeBtn.dataset.listType = "favorites";
    removeBtn.dataset.reference = item.reference;
    removeBtn.dataset.translation = item.translation;
    removeBtn.textContent = "×";
    removeBtn.setAttribute(
      "aria-label",
      `Remove ${item.reference} (${item.translation.toUpperCase()}) from favorites`,
    );

    li.appendChild(button);
    li.appendChild(removeBtn);
    favoriteList.appendChild(li);
  });

  historyEmpty.style.display = history.length ? "none" : "block";
  favoriteEmpty.style.display = favorites.length ? "none" : "block";

  if (clearHistoryBtn) {
    clearHistoryBtn.disabled = !history.length;
  }

  if (clearFavoritesBtn) {
    clearFavoritesBtn.disabled = !favorites.length;
  }
}

function applySavedSelection(event) {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  if (target.dataset.action === "remove-saved") {
    const snapshot = captureSavedSnapshot();
    const listType = String(target.dataset.listType || "").trim();
    const reference = normalizeReference(target.dataset.reference || "");
    const translation = normalizeTranslation(
      target.dataset.translation || "web",
    );

    if (!reference || (listType !== "history" && listType !== "favorites")) {
      return;
    }

    if (listType === "history") {
      history = history.filter(
        (item) =>
          !(
            item.reference === reference &&
            normalizeTranslation(item.translation) === translation
          ),
      );
      saveSaved(HISTORY_KEY, history);
    } else {
      favorites = favorites.filter(
        (item) =>
          !(
            item.reference === reference &&
            normalizeTranslation(item.translation) === translation
          ),
      );
      saveSaved(FAVORITES_KEY, favorites);
    }

    renderSavedLists();
    showSavedUndoToast(
      listType === "history" ? "Recent search removed." : "Favorite removed.",
      snapshot,
    );
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

  resultBox.innerHTML =
    '<h2 class="result-heading">Verse Result</h2><div class="meta">Loading verse...</div>';

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
  const currentChapter = chapterSelect.value;
  populateChapterSelect(currentChapter);
  updatePassageMeta();
  await syncVerseDropdown();
});

chapterSelect.addEventListener("change", syncVerseDropdown);
verseSelect.addEventListener("change", buildReferenceFromSelectors);
translationSelect.addEventListener("change", syncVerseDropdown);
historyList.addEventListener("click", applySavedSelection);
favoriteList.addEventListener("click", applySavedSelection);

if (topicSearchBtn) {
  topicSearchBtn.addEventListener("click", loadTopicVerses);
}

if (bibleSearchBtn) {
  bibleSearchBtn.addEventListener("click", searchBibleSubject);
}

if (bibleSubjectInput) {
  bibleSubjectInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchBibleSubject();
    }
  });
}

if (bibleSearchClearBtn) {
  bibleSearchClearBtn.addEventListener("click", clearBibleSearch);
}

if (opinionSearchBtn) {
  opinionSearchBtn.addEventListener("click", searchOpinionSubject);
}

if (opinionSubjectInput) {
  opinionSubjectInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchOpinionSubject();
    }
  });

  opinionSubjectInput.addEventListener("input", () => {
    if (!String(opinionSubjectInput.value || "").trim()) {
      clearOpinionLinks();
    }
  });
}

if (topicResultsBox) {
  topicResultsBox.addEventListener("click", loadTopicVerseFromButton);
}

if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener("click", clearHistory);
}

if (clearFavoritesBtn) {
  clearFavoritesBtn.addEventListener("click", clearFavorites);
}

if (undoToastActionBtn) {
  undoToastActionBtn.addEventListener("click", undoSavedListChange);
}

if (undoToastCloseBtn) {
  undoToastCloseBtn.addEventListener("click", () => {
    savedUndoSnapshot = null;
    hideSavedUndoToast();
  });
}

if (saveCustomTopicBtn) {
  saveCustomTopicBtn.addEventListener("click", saveCustomTopic);
}

if (cancelCustomTopicEditBtn) {
  cancelCustomTopicEditBtn.addEventListener("click", cancelCustomTopicEdit);
}

if (deleteCustomTopicBtn) {
  deleteCustomTopicBtn.addEventListener("click", deleteSelectedCustomTopic);
}

if (exportCustomTopicsBtn) {
  exportCustomTopicsBtn.addEventListener("click", exportCustomTopics);
}

if (importCustomTopicsInput) {
  importCustomTopicsInput.addEventListener(
    "change",
    importCustomTopicsFromFile,
  );
}

if (replaceCustomTopicsMode) {
  replaceCustomTopicsMode.addEventListener("change", syncImportControlState);
}

if (replaceConfirmInput) {
  replaceConfirmInput.addEventListener("input", syncImportControlState);
}

if (customTopicList) {
  customTopicList.addEventListener("click", selectCustomTopicFromList);
}

if (compactModeBtn) {
  compactModeBtn.addEventListener("click", () => applyReadingMode("compact"));
}

if (comfortableModeBtn) {
  comfortableModeBtn.addEventListener("click", () =>
    applyReadingMode("comfortable"),
  );
}

if (focusModeBtn) {
  focusModeBtn.addEventListener("click", toggleFocusMode);
}

if (spacingModeBtn) {
  spacingModeBtn.addEventListener("click", toggleSpacingMode);
}

if (mobileHeaderControlsToggleBtn) {
  mobileHeaderControlsToggleBtn.addEventListener(
    "click",
    toggleMobileHeaderControls,
  );
}

window.addEventListener("resize", updateMobileHeaderControls);

if (themePresetSelect) {
  themePresetSelect.addEventListener("change", () => {
    const presetId = String(themePresetSelect.value || "").trim();
    if (presetId === "custom") {
      return;
    }
    applyThemePreset(presetId);
  });
}

[
  themeBgInput,
  themeCardInput,
  themeCardStrongInput,
  themeTextInput,
  themeMutedInput,
  themeAccentInput,
  themeAccent2Input,
  themeLineInput,
  themeBtnInput,
  themeBtnActiveInput,
].forEach((inputElement) => {
  if (inputElement) {
    inputElement.addEventListener("input", updateThemeFromInputs);
    inputElement.addEventListener("change", updateThemeFromInputs);
    inputElement.addEventListener("focus", () =>
      startThemeColorLiveSync(inputElement),
    );
    inputElement.addEventListener("blur", stopThemeColorLiveSync);
    inputElement.addEventListener("pointerdown", () =>
      startThemeColorLiveSync(inputElement),
    );
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible") {
    stopThemeColorLiveSync();
  }
});

if (resetThemeBtn) {
  resetThemeBtn.addEventListener("click", resetTheme);
}

if (exportThemeBtn) {
  exportThemeBtn.addEventListener("click", exportTheme);
}

if (importThemeInput) {
  importThemeInput.addEventListener("change", importThemeFromFile);
}

setupThemeHexCopy();

populateBookSelect();
populateChapterSelect();
populateVerseSelect(50);
renderSavedLists();
applyReadingMode(readingMode);
applyFocusMode(focusMode);
applySpacingMode(spacingMode);
applyTheme(theme, { silent: true });
setThemeStatus("Theme ready.");
updateMobileHeaderControls();
syncVerseDropdown();
loadTopics();
renderCustomTopicList();
syncImportControlState();
updateCustomEditorState();
