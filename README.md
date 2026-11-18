# 🌸 BlushNotes

> An aesthetic, feature-rich pastel notes web application with dashboard analytics, smart filters, adjustable typography, dark mode, and seamless JSON backups.

![BlushNotes Preview](https://img.shields.io/badge/BlushNotes-v1.0-ff69b4.svg)
![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## ✨ Features Checklist

- [x] **Dashboard with Statistics**:
  - Live metric cards: Active Notes, Pinned Notes, Favorites, Recycle Bin count, Total Words.
  - Interactive **Category Distribution** progress bars with percentage breakdown.
  - **Pastel Palette Usage** tracker displaying note counts for each of the 5 pastel shades.
  - **Recently Modified Notes** preview list with instant edit access.
  - Time-of-day personalized greeting (morning, afternoon, evening).
- [x] **My Notes (Create, Edit & Delete)**:
  - Clean distraction-free note modal with auto-focus.
  - Title input and auto-resizing content area.
  - Interactive markdown formatting toolbar (**Bold**, *Italic*, ~~Strikethrough~~, Heading H3, Bullet points, Checklist tasks, Inline Code).
  - Live word and character counters.
  - Clickable interactive task checklists `[ ]` & `[x]` that can be ticked directly on note cards!
  - Duplicate note option for quick templating.
- [x] **Favorites & Pinned Notes**:
  - Pinned notes stay at the top in a dedicated pinned section in "All Notes" view.
  - Dedicated "📌 Pinned" view in the sidebar.
  - Dedicated "⭐ Favorites" view in the sidebar.
  - Quick toggle pin and star buttons directly on note cards.
- [x] **Recycle Bin with Restore**:
  - Soft-delete workflow to prevent accidental loss.
  - Dedicated "🗑️ Recycle Bin" view.
  - Single-click "Restore" to move note back to active notes.
  - "Delete Forever" for permanent removal.
  - "Empty Trash" button to wipe deleted notes at once with confirmation.
  - "Restore All" button to recover all deleted notes instantly.
- [x] **Search, Sorting & Category Filters**:
  - Instant live full-text search across titles, contents, and category tags.
  - Search keyword highlighting in titles and body text.
  - 5 Sorting options:
    - *Recently Updated*
    - *Newest Created*
    - *Oldest Created*
    - *Title: A to Z*
    - *Title: Z to A*
  - Category manager: filter by category, view note counts per category, and create custom categories on the fly.
  - Removable active filter chips for search and color filters.
- [x] **Five Signature Pastel Colors**:
  1. 🌸 **Blush Pink** (`rose`)
  2. 🪻 **Soft Lavender** (`lavender`)
  3. 🌿 **Mint Green** (`mint`)
  4. 🍑 **Peach Cream** (`peach`)
  5. 🌊 **Sky Blue** (`sky`)
  - Filter notes instantly by clicking the color swatches in the top toolbar.
  - Dual-mode color palette: bright and airy in Light Mode; deeply tinted with high-contrast borders in Dark Mode.
- [x] **Grid and List Views**:
  - Instant toggle between Masonry/Grid cards view and streamlined List view.
  - Preference persisted in `localStorage`.
- [x] **Dark Mode**:
  - Elegant deep-slate theme (`#0f172a` base) engineered for nighttime writing without eye strain.
  - Smooth CSS variable transitions.
  - Automatically respects system preferences if no custom setting is saved.
- [x] **Adjustable Font Size**:
  - Quick-switch font size pills in header:
    - **A-** (Small, 13.5px)
    - **A** (Medium, 15px - default)
    - **A+** (Large, 16.5px)
    - **A++** (Extra Large, 18.5px)
  - Persisted in user preferences.
- [x] **Automatic LocalStorage Saving**:
  - All notes and UI preferences auto-save automatically.
  - Live storage usage meter showing kilobytes used and bar percentage.
  - Pre-seeded with 6 aesthetic sample notes on initial load.
- [x] **Import and Export JSON Backups**:
  - Single-click JSON backup export with timestamped filenames (`blushnotes_backup_YYYY-MM-DD.json`).
  - Drag-and-drop or file picker JSON import.
  - Smart import dialog offering to **Merge** with existing notes or **Replace** completely.
  - Option to restore default demo notes at any time.
- [x] **Responsive Layout**:
  - Mobile slide-out drawer sidebar with overlay backdrop.
  - Adaptive grid and list cards for screens of all sizes (mobile, tablet, ultra-wide).
  - Floating action button and touch-friendly tap targets.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl + N` / `Cmd + N` | Create a new note |
| `Ctrl + K` or `/` | Focus search bar |
| `Ctrl + S` / `Cmd + S` | Save current note (inside editor modal) |
| `Esc` | Close active modal |

---

## 🚀 How to Run

No build step or Node.js server required! BlushNotes runs in any modern browser:

1. Double click `index.html` to open it directly in Chrome, Edge, Firefox, Safari, or Brave.
2. Alternatively, serve it via any static local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or npx
   npx serve
   ```
3. Open `http://localhost:8000` in your web browser.

---

## 📂 Project Architecture

```
BlushNotes/
│
├── index.html            # Semantic application structure & modals
├── css/
│   └── styles.css        # Pastel palette tokens, dark theme, responsive CSS
├── js/
│   └── app.js            # State management, LocalStorage, filter/sort engine
└── README.md             # Documentation
```
