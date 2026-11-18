/**
 * BlushNotes - Modern Pastel Notes App
 * Core Application Engine
 */

// Initial Seed Data for first-time visitors
const SAMPLE_NOTES = [
  {
    id: "seed-1",
    title: "✨ Welcome to BlushNotes!",
    content: "BlushNotes is your aesthetic, distraction-free digital notebook.\n\nHere are a few quick tips:\n[x] Explore the 5 pastel color swatches\n[x] Pin your priority notes to keep them on top\n[ ] Star important notes to find them under Favorites\n[ ] Try switching between Grid and List views in the top bar\n[ ] Switch between Light and Dark mode\n\nEnjoy writing with clarity and pastel elegance!",
    category: "Personal",
    color: "rose",
    isPinned: true,
    isFavorite: true,
    isDeleted: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "seed-2",
    title: "🎨 Creative Project Ideas",
    content: "Brainstorming for Q4 Design Sprint:\n• Minimalist pastel UI kit for Notion users\n• Ambient lofi soundboard for study sessions\n• Daily gratitude journal web widget\n• Micro-interactions guide for modern CSS",
    category: "Ideas",
    color: "lavender",
    isPinned: true,
    isFavorite: false,
    isDeleted: false,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "seed-3",
    title: "🌱 Weekly Wellness Routine",
    content: "Morning Mindset:\n[x] 15 mins sunrise stretching\n[x] Matcha green tea with oat milk\n[ ] 10 pages of mindful reading\n[ ] Walk 6,000 steps in the evening park\n\n'Small daily habits create gentle life-long transformations.'",
    category: "Health",
    color: "mint",
    isPinned: false,
    isFavorite: true,
    isDeleted: false,
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "seed-4",
    title: "📚 Book Summary: Atomic Habits",
    content: "Core takeaways by James Clear:\n1. 1% better every day leads to 37x growth over a year.\n2. Forget about goals, focus on your systems instead.\n3. Make cues obvious, attractive, easy, and satisfying.\n4. Never miss twice.",
    category: "Study",
    color: "peach",
    isPinned: false,
    isFavorite: false,
    isDeleted: false,
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
  },
  {
    id: "seed-5",
    title: "💼 Client Meeting Agenda",
    content: "Discussion points for Thursday 2 PM:\n- Review sprint timeline & design deliverables\n- Demo interactive prototype on mobile viewport\n- Feedback on typography & font scale\n- Final sign-off on JSON backup & export system",
    category: "Work",
    color: "sky",
    isPinned: false,
    isFavorite: true,
    isDeleted: false,
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: "seed-6",
    title: "🧁 Sweet Cinnamon Roll Recipe",
    content: "Ingredients:\n- 2 cups warm milk\n- 1/2 cup melted butter\n- 1 packet active dry yeast\n- 1 tbsp ground Ceylon cinnamon\n- Brown sugar glaze for the topping\n\nBake at 350°F (175°C) for 22 minutes until golden brown!",
    category: "Personal",
    color: "peach",
    isPinned: false,
    isFavorite: false,
    isDeleted: false,
    createdAt: new Date(Date.now() - 3600000 * 150).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 40).toISOString(),
  }
];

class BlushNotesApp {
  constructor() {
    this.STORAGE_KEY_NOTES = "blushnotes_data_v1";
    this.STORAGE_KEY_PREFS = "blushnotes_prefs_v1";

    // Application State
    this.notes = [];
    this.categories = ["Personal", "Work", "Study", "Ideas", "Health"];
    this.currentView = "all"; // 'dashboard', 'all', 'pinned', 'favorites', 'trash', 'category'
    this.selectedCategory = null;
    this.searchQuery = "";
    this.filterColor = "all";
    this.sortBy = "updated-desc";
    this.viewMode = "grid"; // 'grid' or 'list'
    this.fontSize = "md"; // 'sm', 'md', 'lg', 'xl'
    this.darkMode = false;

    // Active editing state
    this.editingNoteId = null;
    this.selectedEditorColor = "rose";

    this.init();
  }

  init() {
    this.loadPreferences();
    this.loadNotes();
    this.applyTheme();
    this.applyFontSize();
    this.cacheDOM();
    this.bindEvents();
    this.render();
    this.updateStorageMeter();
  }

  // --- Storage & State Management ---
  loadPreferences() {
    try {
      const prefs = JSON.parse(localStorage.getItem(this.STORAGE_KEY_PREFS));
      if (prefs) {
        this.darkMode = prefs.darkMode ?? false;
        this.viewMode = prefs.viewMode ?? "grid";
        this.fontSize = prefs.fontSize ?? "md";
        this.sortBy = prefs.sortBy ?? "updated-desc";
        if (prefs.categories && Array.isArray(prefs.categories)) {
          this.categories = [...new Set([...this.categories, ...prefs.categories])];
        }
      } else {
        // System preference detection for dark mode
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          this.darkMode = true;
        }
      }
    } catch (e) {
      console.warn("Could not load preferences from LocalStorage", e);
    }
  }

  savePreferences() {
    try {
      const prefs = {
        darkMode: this.darkMode,
        viewMode: this.viewMode,
        fontSize: this.fontSize,
        sortBy: this.sortBy,
        categories: this.categories
      };
      localStorage.setItem(this.STORAGE_KEY_PREFS, JSON.stringify(prefs));
    } catch (e) {
      console.error("Could not save preferences", e);
    }
  }

  loadNotes() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_NOTES);
      if (stored) {
        this.notes = JSON.parse(stored);
        // Extract any custom categories from notes
        this.notes.forEach(note => {
          if (note.category && !this.categories.includes(note.category)) {
            this.categories.push(note.category);
          }
        });
      } else {
        // First run: load initial sample notes
        this.notes = [...SAMPLE_NOTES];
        this.saveNotes(false);
      }
    } catch (e) {
      console.error("Error reading notes from LocalStorage:", e);
      this.notes = [...SAMPLE_NOTES];
    }
  }

  saveNotes(showToast = false) {
    try {
      localStorage.setItem(this.STORAGE_KEY_NOTES, JSON.stringify(this.notes));
      this.updateStorageMeter();
      if (showToast) {
        this.showToast("Changes saved automatically", "success");
      }
    } catch (e) {
      this.showToast("Storage error: LocalStorage may be full", "error");
    }
  }

  updateStorageMeter() {
    try {
      const notesJson = localStorage.getItem(this.STORAGE_KEY_NOTES) || "";
      const prefsJson = localStorage.getItem(this.STORAGE_KEY_PREFS) || "";
      const totalBytes = new Blob([notesJson, prefsJson]).size;
      const totalKB = (totalBytes / 1024).toFixed(1);
      // Assume typical 5MB limit
      const percentage = Math.min(100, Math.max(1, ((totalBytes / (5 * 1024 * 1024)) * 100).toFixed(1)));
      
      const fillEl = document.getElementById("storageBarFill");
      const textEl = document.getElementById("storageUsageText");
      if (fillEl && textEl) {
        fillEl.style.width = `${percentage}%`;
        textEl.textContent = `${totalKB} KB used`;
      }
    } catch (e) {
      // Ignore calculation error
    }
  }

  // --- Themes & UI Preferences ---
  applyTheme() {
    if (this.darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    const themeBtnText = document.getElementById("themeBtnText");
    const themeBtnIcon = document.getElementById("themeBtnIcon");
    if (themeBtnText && themeBtnIcon) {
      themeBtnText.textContent = this.darkMode ? "Light Mode" : "Dark Mode";
      themeBtnIcon.innerHTML = this.darkMode ? "☀️" : "🌙";
    }
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    this.applyTheme();
    this.savePreferences();
    this.showToast(`Switched to ${this.darkMode ? "Dark" : "Light"} mode`, "info");
  }

  applyFontSize() {
    document.documentElement.setAttribute("data-font-size", this.fontSize);
    document.querySelectorAll(".font-size-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.size === this.fontSize);
    });
  }

  setFontSize(size) {
    this.fontSize = size;
    this.applyFontSize();
    this.savePreferences();
  }

  setViewMode(mode) {
    this.viewMode = mode;
    this.savePreferences();
    this.renderNotes();
    const gridBtn = document.getElementById("viewGridBtn");
    const listBtn = document.getElementById("viewListBtn");
    if (gridBtn && listBtn) {
      gridBtn.classList.toggle("active", mode === "grid");
      listBtn.classList.toggle("active", mode === "list");
    }
  }

  // --- DOM Caching & Event Binding ---
  cacheDOM() {
    this.dom = {
      // Layout
      sidebar: document.getElementById("sidebar"),
      sidebarBackdrop: document.getElementById("sidebarBackdrop"),
      mobileMenuBtn: document.getElementById("mobileMenuBtn"),
      sidebarNav: document.getElementById("sidebarNav"),
      categoryList: document.getElementById("categoryList"),
      newCategoryBtn: document.getElementById("newCategoryBtn"),
      themeToggleBtn: document.getElementById("themeToggleBtn"),
      backupModalOpenBtn: document.getElementById("backupModalOpenBtn"),

      // Content & Views
      dashboardView: document.getElementById("dashboardView"),
      notesView: document.getElementById("notesView"),
      viewTitle: document.getElementById("viewTitle"),
      viewCountBadge: document.getElementById("viewCountBadge"),
      pinnedSection: document.getElementById("pinnedSection"),
      pinnedNotesContainer: document.getElementById("pinnedNotesContainer"),
      otherSection: document.getElementById("otherSection"),
      otherSectionLabel: document.getElementById("otherSectionLabel"),
      notesContainer: document.getElementById("notesContainer"),
      emptyState: document.getElementById("emptyState"),
      trashBanner: document.getElementById("trashBanner"),
      emptyTrashBtn: document.getElementById("emptyTrashBtn"),
      restoreAllBtn: document.getElementById("restoreAllBtn"),

      // Search & Filters
      searchInput: document.getElementById("searchInput"),
      searchClearBtn: document.getElementById("searchClearBtn"),
      sortSelect: document.getElementById("sortSelect"),
      colorFilterButtons: document.querySelectorAll(".color-filter-btn"),
      activeFiltersBar: document.getElementById("activeFiltersBar"),
      viewGridBtn: document.getElementById("viewGridBtn"),
      viewListBtn: document.getElementById("viewListBtn"),

      // Editor Modal
      editorModal: document.getElementById("editorModal"),
      editorForm: document.getElementById("editorForm"),
      modalTitle: document.getElementById("modalTitle"),
      noteTitleInput: document.getElementById("noteTitleInput"),
      noteCategorySelect: document.getElementById("noteCategorySelect"),
      noteContentInput: document.getElementById("noteContentInput"),
      modalColorSwatches: document.querySelectorAll(".swatch-btn"),
      editorPinBtn: document.getElementById("editorPinBtn"),
      editorFavBtn: document.getElementById("editorFavBtn"),
      editorDeleteBtn: document.getElementById("editorDeleteBtn"),
      editorWordCount: document.getElementById("editorWordCount"),
      editorCharCount: document.getElementById("editorCharCount"),
      closeEditorBtn: document.getElementById("closeEditorBtn"),
      cancelEditorBtn: document.getElementById("cancelEditorBtn"),
      saveNoteBtn: document.getElementById("saveNoteBtn"),
      newNoteBtn: document.getElementById("newNoteBtn"),
      dashboardNewNoteBtn: document.getElementById("dashboardNewNoteBtn"),

      // Backup Modal
      backupModal: document.getElementById("backupModal"),
      closeBackupBtn: document.getElementById("closeBackupBtn"),
      exportJsonBtn: document.getElementById("exportJsonBtn"),
      importFileInput: document.getElementById("importFileInput"),
      dropZone: document.getElementById("dropZone"),
      resetSampleBtn: document.getElementById("resetSampleBtn"),

      // Toast
      toastContainer: document.getElementById("toastContainer"),
    };
  }

  bindEvents() {
    // Sidebar Navigation
    document.querySelectorAll(".nav-item[data-view]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const view = btn.dataset.view;
        this.navigateTo(view);
        this.closeMobileSidebar();
      });
    });

    // Mobile Sidebar Drawer
    if (this.dom.mobileMenuBtn) {
      this.dom.mobileMenuBtn.addEventListener("click", () => this.toggleMobileSidebar());
    }
    if (this.dom.sidebarBackdrop) {
      this.dom.sidebarBackdrop.addEventListener("click", () => this.closeMobileSidebar());
    }

    // Add Category Button
    if (this.dom.newCategoryBtn) {
      this.dom.newCategoryBtn.addEventListener("click", () => this.promptNewCategory());
    }

    // Theme Toggle
    if (this.dom.themeToggleBtn) {
      this.dom.themeToggleBtn.addEventListener("click", () => this.toggleTheme());
    }

    // View Mode buttons
    if (this.dom.viewGridBtn) {
      this.dom.viewGridBtn.addEventListener("click", () => this.setViewMode("grid"));
    }
    if (this.dom.viewListBtn) {
      this.dom.viewListBtn.addEventListener("click", () => this.setViewMode("list"));
    }

    // Font size controls
    document.querySelectorAll(".font-size-btn").forEach(btn => {
      btn.addEventListener("click", () => this.setFontSize(btn.dataset.size));
    });

    // Search input
    if (this.dom.searchInput) {
      this.dom.searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim();
        this.dom.searchClearBtn.style.display = this.searchQuery ? "block" : "none";
        this.renderNotes();
        this.renderActiveFilterChips();
      });
    }

    if (this.dom.searchClearBtn) {
      this.dom.searchClearBtn.addEventListener("click", () => {
        this.dom.searchInput.value = "";
        this.searchQuery = "";
        this.dom.searchClearBtn.style.display = "none";
        this.renderNotes();
        this.renderActiveFilterChips();
        this.dom.searchInput.focus();
      });
    }

    // Sort Select
    if (this.dom.sortSelect) {
      this.dom.sortSelect.value = this.sortBy;
      this.dom.sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.savePreferences();
        this.renderNotes();
      });
    }

    // Color Filter Buttons
    this.dom.colorFilterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        this.dom.colorFilterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.filterColor = btn.dataset.color;
        this.renderNotes();
        this.renderActiveFilterChips();
      });
    });

    // New Note buttons
    const triggerNewNote = () => this.openNoteEditor();
    if (this.dom.newNoteBtn) this.dom.newNoteBtn.addEventListener("click", triggerNewNote);
    if (this.dom.dashboardNewNoteBtn) this.dom.dashboardNewNoteBtn.addEventListener("click", triggerNewNote);

    // Editor Modal Swatches
    this.dom.modalColorSwatches.forEach(swatch => {
      swatch.addEventListener("click", () => {
        this.setSelectedEditorColor(swatch.dataset.color);
      });
    });

    // Editor Pin & Favorite toggles
    if (this.dom.editorPinBtn) {
      this.dom.editorPinBtn.addEventListener("click", () => {
        this.dom.editorPinBtn.classList.toggle("is-pinned");
      });
    }
    if (this.dom.editorFavBtn) {
      this.dom.editorFavBtn.addEventListener("click", () => {
        this.dom.editorFavBtn.classList.toggle("is-favorite");
      });
    }

    // Editor Content Typing stats update
    if (this.dom.noteContentInput) {
      this.dom.noteContentInput.addEventListener("input", () => this.updateEditorStats());
    }

    // Editor formatting toolbar buttons
    document.querySelectorAll(".format-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.applyTextFormatting(btn.dataset.format);
      });
    });

    // Editor Save & Close
    if (this.dom.saveNoteBtn) {
      this.dom.saveNoteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.saveCurrentEditorNote();
      });
    }
    if (this.dom.closeEditorBtn) {
      this.dom.closeEditorBtn.addEventListener("click", () => this.closeNoteEditor());
    }
    if (this.dom.cancelEditorBtn) {
      this.dom.cancelEditorBtn.addEventListener("click", () => this.closeNoteEditor());
    }
    if (this.dom.editorDeleteBtn) {
      this.dom.editorDeleteBtn.addEventListener("click", () => {
        if (this.editingNoteId) {
          this.deleteNote(this.editingNoteId);
          this.closeNoteEditor();
        }
      });
    }

    // Trash actions
    if (this.dom.emptyTrashBtn) {
      this.dom.emptyTrashBtn.addEventListener("click", () => this.promptEmptyTrash());
    }
    if (this.dom.restoreAllBtn) {
      this.dom.restoreAllBtn.addEventListener("click", () => this.restoreAllTrash());
    }

    // Backup & Import/Export Modal
    if (this.dom.backupModalOpenBtn) {
      this.dom.backupModalOpenBtn.addEventListener("click", () => this.openBackupModal());
    }
    if (this.dom.closeBackupBtn) {
      this.dom.closeBackupBtn.addEventListener("click", () => this.closeBackupModal());
    }
    if (this.dom.exportJsonBtn) {
      this.dom.exportJsonBtn.addEventListener("click", () => this.exportBackupJSON());
    }
    if (this.dom.resetSampleBtn) {
      this.dom.resetSampleBtn.addEventListener("click", () => this.resetToSampleNotes());
    }

    // Drag and Drop for JSON Import
    if (this.dom.dropZone && this.dom.importFileInput) {
      this.dom.dropZone.addEventListener("click", () => this.dom.importFileInput.click());
      this.dom.importFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) this.processImportFile(file);
      });

      this.dom.dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        this.dom.dropZone.classList.add("dragover");
      });
      this.dom.dropZone.addEventListener("dragleave", () => {
        this.dom.dropZone.classList.remove("dragover");
      });
      this.dom.dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        this.dom.dropZone.classList.remove("dragover");
        const file = e.dataTransfer.files[0];
        if (file) this.processImportFile(file);
      });
    }

    // Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + N: New Note
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        this.openNoteEditor();
      }
      // Ctrl/Cmd + K or /: Focus Search (when not in editor)
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") || 
          (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA")) {
        e.preventDefault();
        this.dom.searchInput.focus();
        this.dom.searchInput.select();
      }
      // Escape: Close Modals
      if (e.key === "Escape") {
        if (this.dom.editorModal.classList.contains("active")) {
          this.closeNoteEditor();
        } else if (this.dom.backupModal.classList.contains("active")) {
          this.closeBackupModal();
        }
      }
      // Ctrl/Cmd + S: Save note when inside editor
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s" && this.dom.editorModal.classList.contains("active")) {
        e.preventDefault();
        this.saveCurrentEditorNote();
      }
    });

    // Close modal on clicking outside backdrop
    this.dom.editorModal.addEventListener("click", (e) => {
      if (e.target === this.dom.editorModal) this.closeNoteEditor();
    });
    this.dom.backupModal.addEventListener("click", (e) => {
      if (e.target === this.dom.backupModal) this.closeBackupModal();
    });
  }

  // --- Mobile Drawer Helpers ---
  toggleMobileSidebar() {
    this.dom.sidebar.classList.toggle("open");
    this.dom.sidebarBackdrop.classList.toggle("active");
  }

  closeMobileSidebar() {
    this.dom.sidebar.classList.remove("open");
    this.dom.sidebarBackdrop.classList.remove("active");
  }

  // --- Navigation & Views ---
  navigateTo(view, category = null) {
    this.currentView = view;
    this.selectedCategory = category;

    // Update active nav button
    document.querySelectorAll(".nav-item").forEach(item => {
      const match = category ? (item.dataset.category === category) : (item.dataset.view === view);
      item.classList.toggle("active", match);
    });

    this.render();
  }

  render() {
    this.renderSidebarCounts();
    this.renderCategoryList();

    if (this.currentView === "dashboard") {
      this.dom.dashboardView.style.display = "block";
      this.dom.notesView.style.display = "none";
      this.renderDashboard();
    } else {
      this.dom.dashboardView.style.display = "none";
      this.dom.notesView.style.display = "block";
      this.renderNotesViewHeader();
      this.renderNotes();
      this.renderActiveFilterChips();
    }
  }

  renderSidebarCounts() {
    const activeNotes = this.notes.filter(n => !n.isDeleted);
    const pinnedCount = activeNotes.filter(n => n.isPinned).length;
    const favCount = activeNotes.filter(n => n.isFavorite).length;
    const trashCount = this.notes.filter(n => n.isDeleted).length;

    const setBadge = (id, count) => {
      const el = document.getElementById(id);
      if (el) el.textContent = count;
    };

    setBadge("badgeAll", activeNotes.length);
    setBadge("badgePinned", pinnedCount);
    setBadge("badgeFav", favCount);
    setBadge("badgeTrash", trashCount);
  }

  renderCategoryList() {
    if (!this.dom.categoryList) return;
    this.dom.categoryList.innerHTML = "";

    const activeNotes = this.notes.filter(n => !n.isDeleted);

    this.categories.forEach(cat => {
      const count = activeNotes.filter(n => n.category === cat).length;
      const item = document.createElement("button");
      item.className = `nav-item ${this.currentView === "category" && this.selectedCategory === cat ? "active" : ""}`;
      item.dataset.category = cat;

      const dotColor = this.getCategoryColorHex(cat);

      item.innerHTML = `
        <div class="nav-item-content">
          <span class="category-dot" style="background-color: ${dotColor}"></span>
          <span>${this.escapeHTML(cat)}</span>
        </div>
        <span class="nav-badge">${count}</span>
      `;

      item.addEventListener("click", () => {
        this.navigateTo("category", cat);
        this.closeMobileSidebar();
      });

      this.dom.categoryList.appendChild(item);
    });
  }

  getCategoryColorHex(category) {
    const map = {
      "Personal": "#ec4899",
      "Work": "#0284c7",
      "Study": "#ea580c",
      "Ideas": "#7c3aed",
      "Health": "#059669"
    };
    return map[category] || "#94a3b8";
  }

  promptNewCategory() {
    const name = prompt("Enter new category name:")?.trim();
    if (name) {
      if (!this.categories.includes(name)) {
        this.categories.push(name);
        this.savePreferences();
        this.renderCategoryList();
        this.showToast(`Category "${name}" added`, "success");
      } else {
        this.showToast("Category already exists", "info");
      }
    }
  }

  // --- Dashboard Rendering ---
  renderDashboard() {
    const activeNotes = this.notes.filter(n => !n.isDeleted);
    const trashNotes = this.notes.filter(n => n.isDeleted);
    const pinnedNotes = activeNotes.filter(n => n.isPinned);
    const favNotes = activeNotes.filter(n => n.isFavorite);

    // Compute Word Counts
    let totalWords = 0;
    let totalChars = 0;
    activeNotes.forEach(n => {
      const text = `${n.title} ${n.content}`;
      totalChars += text.length;
      const words = text.trim().split(/\s+/).filter(Boolean);
      totalWords += words.length;
    });

    // Populate KPI numbers
    document.getElementById("statTotalNotes").textContent = activeNotes.length;
    document.getElementById("statPinnedNotes").textContent = pinnedNotes.length;
    document.getElementById("statFavNotes").textContent = favNotes.length;
    document.getElementById("statTrashNotes").textContent = trashNotes.length;
    document.getElementById("statTotalWords").textContent = totalWords.toLocaleString();

    // Greeting by time of day
    const hour = new Date().getHours();
    let greeting = "Good morning";
    if (hour >= 12 && hour < 17) greeting = "Good afternoon";
    else if (hour >= 17) greeting = "Good evening";

    const greetingEl = document.getElementById("dashboardGreeting");
    if (greetingEl) {
      greetingEl.textContent = `${greeting}, Creator!`;
    }

    // Category Distribution Bars
    const catContainer = document.getElementById("dashboardCategoryStats");
    if (catContainer) {
      catContainer.innerHTML = "";
      if (activeNotes.length === 0) {
        catContainer.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted);">No notes created yet.</p>`;
      } else {
        this.categories.forEach(cat => {
          const count = activeNotes.filter(n => n.category === cat).length;
          if (count > 0) {
            const pct = Math.round((count / activeNotes.length) * 100);
            const colorHex = this.getCategoryColorHex(cat);
            const div = document.createElement("div");
            div.className = "category-stat-item";
            div.innerHTML = `
              <div class="category-stat-info">
                <span class="category-stat-name">
                  <span class="category-dot" style="background-color: ${colorHex}"></span>
                  ${this.escapeHTML(cat)}
                </span>
                <span class="category-stat-count">${count} notes (${pct}%)</span>
              </div>
              <div class="stat-progress-bar">
                <div class="stat-progress-fill" style="width: ${pct}%; background-color: ${colorHex}"></div>
              </div>
            `;
            catContainer.appendChild(div);
          }
        });
      }
    }

    // Pastel Palette Distribution
    const colorStatGrid = document.getElementById("dashboardColorStats");
    if (colorStatGrid) {
      colorStatGrid.innerHTML = "";
      const colors = [
        { key: "rose", name: "Blush Pink", bg: "var(--pastel-rose-bg)", border: "var(--pastel-rose-border)", accent: "var(--pastel-rose-accent)" },
        { key: "lavender", name: "Lavender", bg: "var(--pastel-lavender-bg)", border: "var(--pastel-lavender-border)", accent: "var(--pastel-lavender-accent)" },
        { key: "mint", name: "Mint Green", bg: "var(--pastel-mint-bg)", border: "var(--pastel-mint-border)", accent: "var(--pastel-mint-accent)" },
        { key: "peach", name: "Peach Cream", bg: "var(--pastel-peach-bg)", border: "var(--pastel-peach-border)", accent: "var(--pastel-peach-accent)" },
        { key: "sky", name: "Sky Blue", bg: "var(--pastel-sky-bg)", border: "var(--pastel-sky-border)", accent: "var(--pastel-sky-accent)" }
      ];

      colors.forEach(col => {
        const count = activeNotes.filter(n => n.color === col.key).length;
        const box = document.createElement("div");
        box.className = "color-stat-box";
        box.style.backgroundColor = col.bg;
        box.style.borderColor = col.border;
        box.innerHTML = `
          <div class="color-stat-header" style="color: ${col.accent}">
            <span>●</span>
            <span>${col.name}</span>
          </div>
          <div class="color-stat-count" style="color: ${col.accent}">${count}</div>
        `;
        box.addEventListener("click", () => {
          this.navigateTo("all");
          this.filterColor = col.key;
          this.dom.colorFilterButtons.forEach(b => b.classList.toggle("active", b.dataset.color === col.key));
          this.renderNotes();
          this.renderActiveFilterChips();
        });
        colorStatGrid.appendChild(box);
      });
    }

    // Recent Notes Preview in Dashboard
    const recentContainer = document.getElementById("dashboardRecentNotes");
    if (recentContainer) {
      recentContainer.innerHTML = "";
      const sortedByRecent = [...activeNotes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3);

      if (sortedByRecent.length === 0) {
        recentContainer.innerHTML = `
          <div class="empty-state" style="padding: 30px;">
            <p>No notes written yet. Create your first pastel note!</p>
          </div>
        `;
      } else {
        recentContainer.className = "notes-container grid-view";
        sortedByRecent.forEach(note => {
          recentContainer.appendChild(this.createNoteCardElement(note));
        });
      }
    }
  }

  // --- Notes View Rendering ---
  renderNotesViewHeader() {
    let title = "My Notes";
    if (this.currentView === "pinned") title = "📌 Pinned Notes";
    else if (this.currentView === "favorites") title = "⭐ Favorite Notes";
    else if (this.currentView === "trash") title = "🗑️ Recycle Bin";
    else if (this.currentView === "category") title = `📁 Category: ${this.selectedCategory}`;

    this.dom.viewTitle.textContent = title;

    // Show trash banner only in trash view
    if (this.dom.trashBanner) {
      this.dom.trashBanner.style.display = this.currentView === "trash" ? "flex" : "none";
    }
  }

  getFilteredAndSortedNotes() {
    let list = [...this.notes];

    // Filter by view
    if (this.currentView === "trash") {
      list = list.filter(n => n.isDeleted);
    } else {
      list = list.filter(n => !n.isDeleted);
      if (this.currentView === "pinned") {
        list = list.filter(n => n.isPinned);
      } else if (this.currentView === "favorites") {
        list = list.filter(n => n.isFavorite);
      } else if (this.currentView === "category" && this.selectedCategory) {
        list = list.filter(n => n.category === this.selectedCategory);
      }
    }

    // Filter by Color
    if (this.filterColor !== "all") {
      list = list.filter(n => n.color === this.filterColor);
    }

    // Filter by Search Query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(n => 
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.content && n.content.toLowerCase().includes(q)) ||
        (n.category && n.category.toLowerCase().includes(q))
      );
    }

    // Sorting
    list.sort((a, b) => {
      switch (this.sortBy) {
        case "created-desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "created-asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "title-asc":
          return (a.title || "").localeCompare(b.title || "");
        case "title-desc":
          return (b.title || "").localeCompare(a.title || "");
        case "updated-desc":
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });

    return list;
  }

  renderNotes() {
    const list = this.getFilteredAndSortedNotes();
    this.dom.viewCountBadge.textContent = `${list.length} note${list.length === 1 ? "" : "s"}`;

    this.dom.notesContainer.className = `notes-container ${this.viewMode}-view`;
    this.dom.pinnedNotesContainer.className = `notes-container ${this.viewMode}-view`;

    // Handle Empty State
    if (list.length === 0) {
      this.dom.pinnedSection.style.display = "none";
      this.dom.otherSection.style.display = "none";
      this.dom.emptyState.style.display = "flex";

      const emptyTitle = document.getElementById("emptyStateTitle");
      const emptyDesc = document.getElementById("emptyStateDesc");
      if (this.currentView === "trash") {
        if (emptyTitle) emptyTitle.textContent = "Recycle bin is clean!";
        if (emptyDesc) emptyDesc.textContent = "Deleted notes will appear here with the option to restore.";
      } else if (this.searchQuery) {
        if (emptyTitle) emptyTitle.textContent = "No matching notes found";
        if (emptyDesc) emptyDesc.textContent = `No notes matched "${this.searchQuery}". Try different keywords.`;
      } else {
        if (emptyTitle) emptyTitle.textContent = "No notes yet";
        if (emptyDesc) emptyDesc.textContent = "Create your first pastel note to capture your thoughts.";
      }
      return;
    }

    this.dom.emptyState.style.display = "none";

    // Split pinned vs others when in "all" view and not filtering by single status
    const shouldSplitPinned = (this.currentView === "all" || this.currentView === "category") && !this.searchQuery;

    if (shouldSplitPinned) {
      const pinned = list.filter(n => n.isPinned);
      const others = list.filter(n => !n.isPinned);

      if (pinned.length > 0) {
        this.dom.pinnedSection.style.display = "block";
        this.dom.pinnedNotesContainer.innerHTML = "";
        pinned.forEach(n => this.dom.pinnedNotesContainer.appendChild(this.createNoteCardElement(n)));
        
        this.dom.otherSection.style.display = "block";
        this.dom.otherSectionLabel.style.display = "flex";
        this.dom.notesContainer.innerHTML = "";
        others.forEach(n => this.dom.notesContainer.appendChild(this.createNoteCardElement(n)));
      } else {
        this.dom.pinnedSection.style.display = "none";
        this.dom.otherSection.style.display = "block";
        this.dom.otherSectionLabel.style.display = "none";
        this.dom.notesContainer.innerHTML = "";
        list.forEach(n => this.dom.notesContainer.appendChild(this.createNoteCardElement(n)));
      }
    } else {
      this.dom.pinnedSection.style.display = "none";
      this.dom.otherSection.style.display = "block";
      this.dom.otherSectionLabel.style.display = "none";
      this.dom.notesContainer.innerHTML = "";
      list.forEach(n => this.dom.notesContainer.appendChild(this.createNoteCardElement(n)));
    }
  }

  renderActiveFilterChips() {
    if (!this.dom.activeFiltersBar) return;
    this.dom.activeFiltersBar.innerHTML = "";

    const chips = [];

    if (this.searchQuery) {
      chips.push({
        label: `Search: "${this.searchQuery}"`,
        onRemove: () => {
          this.searchQuery = "";
          this.dom.searchInput.value = "";
          this.dom.searchClearBtn.style.display = "none";
          this.renderNotes();
          this.renderActiveFilterChips();
        }
      });
    }

    if (this.filterColor !== "all") {
      chips.push({
        label: `Color: ${this.filterColor}`,
        onRemove: () => {
          this.filterColor = "all";
          this.dom.colorFilterButtons.forEach(b => b.classList.toggle("active", b.dataset.color === "all"));
          this.renderNotes();
          this.renderActiveFilterChips();
        }
      });
    }

    if (chips.length > 0) {
      chips.forEach(c => {
        const span = document.createElement("span");
        span.className = "filter-chip";
        span.innerHTML = `
          <span>${this.escapeHTML(c.label)}</span>
          <button title="Remove filter">✕</button>
        `;
        span.querySelector("button").addEventListener("click", c.onRemove);
        this.dom.activeFiltersBar.appendChild(span);
      });

      const clearAll = document.createElement("span");
      clearAll.className = "clear-all-filters";
      clearAll.textContent = "Clear filters";
      clearAll.addEventListener("click", () => {
        this.searchQuery = "";
        this.dom.searchInput.value = "";
        this.dom.searchClearBtn.style.display = "none";
        this.filterColor = "all";
        this.dom.colorFilterButtons.forEach(b => b.classList.toggle("active", b.dataset.color === "all"));
        this.renderNotes();
        this.renderActiveFilterChips();
      });
      this.dom.activeFiltersBar.appendChild(clearAll);
    }
  }

  // --- Note Card Component ---
  createNoteCardElement(note) {
    const card = document.createElement("div");
    card.className = `note-card color-${note.color || "rose"}`;
    card.dataset.id = note.id;

    const formattedDate = this.formatRelativeDate(note.updatedAt || note.createdAt);
    const categoryColor = this.getCategoryColorHex(note.category);

    // Title with highlight
    const highlightedTitle = this.highlightText(note.title || "Untitled Note", this.searchQuery);

    // Body preview with checklists rendered
    const highlightedContent = this.renderContentPreview(note.content || "", this.searchQuery);

    // Word count calculation
    const words = (note.content || "").trim().split(/\s+/).filter(Boolean).length;

    // Is it in Recycle Bin?
    const isTrashed = note.isDeleted;

    card.innerHTML = `
      <div class="note-card-header">
        <span class="note-category-badge">
          <span class="category-dot" style="background-color: ${categoryColor}"></span>
          ${this.escapeHTML(note.category || "General")}
        </span>
        <div class="note-top-actions">
          ${!isTrashed ? `
            <button class="action-icon-btn ${note.isPinned ? "is-pinned" : ""}" data-action="pin" title="${note.isPinned ? "Unpin note" : "Pin to top"}">
              📌
            </button>
            <button class="action-icon-btn ${note.isFavorite ? "is-favorite" : ""}" data-action="favorite" title="${note.isFavorite ? "Remove favorite" : "Mark favorite"}">
              ⭐
            </button>
          ` : ""}
        </div>
      </div>

      <div class="note-card-body">
        <h3 class="note-title">${highlightedTitle}</h3>
        <div class="note-preview-content">${highlightedContent}</div>
      </div>

      <div class="note-card-footer">
        <div class="note-meta">
          <span>${formattedDate}</span>
          <span>•</span>
          <span>${words} word${words === 1 ? "" : "s"}</span>
        </div>
        <div class="note-card-actions">
          ${!isTrashed ? `
            <button class="action-icon-btn" data-action="duplicate" title="Duplicate note">📋</button>
            <button class="action-icon-btn" data-action="delete" title="Move to trash">🗑️</button>
          ` : `
            <button class="action-icon-btn" data-action="restore" title="Restore note" style="color: var(--accent-success)">♻️</button>
            <button class="action-icon-btn" data-action="perm-delete" title="Delete permanently" style="color: var(--accent-trash)">❌</button>
          `}
        </div>
      </div>
    `;

    // Interactivity
    card.addEventListener("click", (e) => {
      const actionBtn = e.target.closest("button[data-action]");
      if (actionBtn) {
        e.stopPropagation();
        const action = actionBtn.dataset.action;
        this.handleCardAction(note.id, action);
        return;
      }

      // Checkbox click in preview
      const checkItem = e.target.closest(".preview-check-box");
      if (checkItem) {
        e.stopPropagation();
        const index = parseInt(checkItem.dataset.index, 10);
        this.toggleChecklistItem(note.id, index);
        return;
      }

      // If note is active, clicking card opens editor
      if (!isTrashed) {
        this.openNoteEditor(note.id);
      }
    });

    return card;
  }

  handleCardAction(noteId, action) {
    switch (action) {
      case "pin":
        this.togglePin(noteId);
        break;
      case "favorite":
        this.toggleFavorite(noteId);
        break;
      case "duplicate":
        this.duplicateNote(noteId);
        break;
      case "delete":
        this.deleteNote(noteId);
        break;
      case "restore":
        this.restoreNote(noteId);
        break;
      case "perm-delete":
        this.permanentDeleteNote(noteId);
        break;
    }
  }

  // --- CRUD Operations ---
  openNoteEditor(noteId = null) {
    this.editingNoteId = noteId;
    this.populateCategorySelect();

    if (noteId) {
      const note = this.notes.find(n => n.id === noteId);
      if (!note) return;
      this.dom.modalTitle.textContent = "Edit Note";
      this.dom.noteTitleInput.value = note.title || "";
      this.dom.noteCategorySelect.value = note.category || this.categories[0];
      this.dom.noteContentInput.value = note.content || "";
      this.setSelectedEditorColor(note.color || "rose");
      this.dom.editorPinBtn.classList.toggle("is-pinned", !!note.isPinned);
      this.dom.editorFavBtn.classList.toggle("is-favorite", !!note.isFavorite);
      this.dom.editorDeleteBtn.style.display = "inline-flex";
    } else {
      this.dom.modalTitle.textContent = "Create Note";
      this.dom.noteTitleInput.value = "";
      this.dom.noteCategorySelect.value = (this.currentView === "category" && this.selectedCategory) ? this.selectedCategory : this.categories[0];
      this.dom.noteContentInput.value = "";
      this.setSelectedEditorColor("rose");
      this.dom.editorPinBtn.classList.toggle("is-pinned", this.currentView === "pinned");
      this.dom.editorFavBtn.classList.toggle("is-favorite", this.currentView === "favorites");
      this.dom.editorDeleteBtn.style.display = "none";
    }

    this.updateEditorStats();
    this.dom.editorModal.classList.add("active");
    setTimeout(() => this.dom.noteTitleInput.focus(), 100);
  }

  closeNoteEditor() {
    this.dom.editorModal.classList.remove("active");
    this.editingNoteId = null;
  }

  setSelectedEditorColor(color) {
    this.selectedEditorColor = color;
    const windowEl = this.dom.editorModal.querySelector(".modal-window");
    if (windowEl) {
      windowEl.className = `modal-window color-${color}`;
    }
    this.dom.modalColorSwatches.forEach(swatch => {
      swatch.classList.toggle("active", swatch.dataset.color === color);
    });
  }

  populateCategorySelect() {
    if (!this.dom.noteCategorySelect) return;
    this.dom.noteCategorySelect.innerHTML = "";
    this.categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      this.dom.noteCategorySelect.appendChild(opt);
    });
  }

  updateEditorStats() {
    const text = this.dom.noteContentInput.value || "";
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;

    this.dom.editorWordCount.textContent = `${words} word${words === 1 ? "" : "s"}`;
    this.dom.editorCharCount.textContent = `${chars} character${chars === 1 ? "" : "s"}`;
  }

  applyTextFormatting(type) {
    const textarea = this.dom.noteContentInput;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    let replacement = "";

    switch (type) {
      case "bold":
        replacement = `**${selected || "bold text"}**`;
        break;
      case "italic":
        replacement = `*${selected || "italic text"}*`;
        break;
      case "strike":
        replacement = `~~${selected || "strikethrough text"}~~`;
        break;
      case "heading":
        replacement = `\n### ${selected || "Heading"}\n`;
        break;
      case "bullet":
        replacement = `\n• ${selected || "List item"}`;
        break;
      case "task":
        replacement = `\n[ ] ${selected || "New task item"}`;
        break;
      case "code":
        replacement = `\`${selected || "code"}\``;
        break;
      default:
        replacement = selected;
    }

    textarea.setRangeText(replacement, start, end, "end");
    textarea.focus();
    this.updateEditorStats();
  }

  saveCurrentEditorNote() {
    const title = this.dom.noteTitleInput.value.trim();
    const content = this.dom.noteContentInput.value;
    const category = this.dom.noteCategorySelect.value;
    const color = this.selectedEditorColor;
    const isPinned = this.dom.editorPinBtn.classList.contains("is-pinned");
    const isFavorite = this.dom.editorFavBtn.classList.contains("is-favorite");

    if (!title && !content.trim()) {
      this.showToast("Please enter a title or note content", "error");
      return;
    }

    if (this.editingNoteId) {
      // Update existing note
      const index = this.notes.findIndex(n => n.id === this.editingNoteId);
      if (index !== -1) {
        this.notes[index] = {
          ...this.notes[index],
          title: title || "Untitled Note",
          content,
          category,
          color,
          isPinned,
          isFavorite,
          updatedAt: new Date().toISOString()
        };
        this.showToast("Note updated successfully", "success");
      }
    } else {
      // Create new note
      const newNote = {
        id: "note-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6),
        title: title || "Untitled Note",
        content,
        category,
        color,
        isPinned,
        isFavorite,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.notes.unshift(newNote);
      this.showToast("New note created", "success");
    }

    this.saveNotes(false);
    this.closeNoteEditor();
    this.render();
  }

  togglePin(noteId) {
    const note = this.notes.find(n => n.id === noteId);
    if (note) {
      note.isPinned = !note.isPinned;
      note.updatedAt = new Date().toISOString();
      this.saveNotes();
      this.render();
      this.showToast(note.isPinned ? "Note pinned to top" : "Note unpinned", "info");
    }
  }

  toggleFavorite(noteId) {
    const note = this.notes.find(n => n.id === noteId);
    if (note) {
      note.isFavorite = !note.isFavorite;
      note.updatedAt = new Date().toISOString();
      this.saveNotes();
      this.render();
      this.showToast(note.isFavorite ? "Added to Favorites" : "Removed from Favorites", "info");
    }
  }

  duplicateNote(noteId) {
    const source = this.notes.find(n => n.id === noteId);
    if (source) {
      const clone = {
        ...source,
        id: "note-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6),
        title: `${source.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.notes.unshift(clone);
      this.saveNotes();
      this.render();
      this.showToast("Note duplicated", "success");
    }
  }

  deleteNote(noteId) {
    const note = this.notes.find(n => n.id === noteId);
    if (note) {
      note.isDeleted = true;
      note.deletedAt = new Date().toISOString();
      this.saveNotes();
      this.render();
      this.showToast("Note moved to Recycle Bin", "info");
    }
  }

  restoreNote(noteId) {
    const note = this.notes.find(n => n.id === noteId);
    if (note) {
      note.isDeleted = false;
      delete note.deletedAt;
      note.updatedAt = new Date().toISOString();
      this.saveNotes();
      this.render();
      this.showToast("Note restored successfully", "success");
    }
  }

  permanentDeleteNote(noteId) {
    if (confirm("Permanently delete this note? This action cannot be undone.")) {
      this.notes = this.notes.filter(n => n.id !== noteId);
      this.saveNotes();
      this.render();
      this.showToast("Note permanently deleted", "error");
    }
  }

  promptEmptyTrash() {
    const count = this.notes.filter(n => n.isDeleted).length;
    if (count === 0) return;

    if (confirm(`Empty Recycle Bin? All ${count} deleted note(s) will be permanently lost.`)) {
      this.notes = this.notes.filter(n => !n.isDeleted);
      this.saveNotes();
      this.render();
      this.showToast("Recycle bin emptied", "info");
    }
  }

  restoreAllTrash() {
    let count = 0;
    this.notes.forEach(n => {
      if (n.isDeleted) {
        n.isDeleted = false;
        delete n.deletedAt;
        count++;
      }
    });
    if (count > 0) {
      this.saveNotes();
      this.render();
      this.showToast(`Restored ${count} note(s)`, "success");
    }
  }

  toggleChecklistItem(noteId, itemIndex) {
    const note = this.notes.find(n => n.id === noteId);
    if (!note) return;

    const lines = note.content.split("\n");
    let currentCheckIdx = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s*\[( |x|X)\]/.test(line)) {
        if (currentCheckIdx === itemIndex) {
          if (line.includes("[x]") || line.includes("[X]")) {
            lines[i] = line.replace(/^\s*\[(x|X)\]/, "[ ]");
          } else {
            lines[i] = line.replace(/^\s*\[ \]/, "[x]");
          }
          break;
        }
        currentCheckIdx++;
      }
    }

    note.content = lines.join("\n");
    note.updatedAt = new Date().toISOString();
    this.saveNotes();
    this.render();
  }

  // --- Backup & JSON Import / Export ---
  openBackupModal() {
    this.dom.backupModal.classList.add("active");
  }

  closeBackupModal() {
    this.dom.backupModal.classList.remove("active");
  }

  exportBackupJSON() {
    const backupData = {
      app: "BlushNotes",
      version: "1.0",
      exportedAt: new Date().toISOString(),
      preferences: {
        darkMode: this.darkMode,
        viewMode: this.viewMode,
        fontSize: this.fontSize,
        sortBy: this.sortBy,
        categories: this.categories
      },
      notes: this.notes
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split("T")[0];
    const link = document.createElement("a");
    link.href = url;
    link.download = `blushnotes_backup_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.showToast("Backup exported successfully", "success");
  }

  processImportFile(file) {
    if (!file.name.endsWith(".json")) {
      this.showToast("Please select a valid .json backup file", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const importedNotes = Array.isArray(data) ? data : data.notes;

        if (!Array.isArray(importedNotes)) {
          throw new Error("Invalid backup structure: notes array missing.");
        }

        const validNotes = importedNotes.filter(n => n.id && (n.title || n.content));
        if (validNotes.length === 0) {
          this.showToast("No valid notes found in this backup", "error");
          return;
        }

        const mode = confirm(
          `Found ${validNotes.length} notes in backup.\n\nClick OK to MERGE with current notes.\nClick CANCEL to REPLACE all current notes.`
        );

        if (mode) {
          // Merge: avoid duplicating IDs
          const existingIds = new Set(this.notes.map(n => n.id));
          let added = 0;
          validNotes.forEach(note => {
            if (existingIds.has(note.id)) {
              note.id = "imported-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5);
            }
            this.notes.unshift(note);
            added++;
          });
          this.showToast(`Merged ${added} notes from backup`, "success");
        } else {
          // Replace
          this.notes = validNotes;
          this.showToast(`Replaced notes with ${validNotes.length} notes from backup`, "success");
        }

        // Import categories & preferences if present
        if (data.preferences && Array.isArray(data.preferences.categories)) {
          this.categories = [...new Set([...this.categories, ...data.preferences.categories])];
        }

        this.saveNotes();
        this.savePreferences();
        this.render();
        this.closeBackupModal();
      } catch (err) {
        console.error("Import error:", err);
        this.showToast("Failed to parse JSON backup file", "error");
      }
    };
    reader.readAsText(file);
  }

  resetToSampleNotes() {
    if (confirm("Reset notes to the default aesthetic sample notes? Current notes will be replaced.")) {
      this.notes = [...SAMPLE_NOTES];
      this.saveNotes();
      this.render();
      this.closeBackupModal();
      this.showToast("Restored sample notes", "info");
    }
  }

  // --- Text & Preview Formatting Utilities ---
  escapeHTML(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  highlightText(text, query) {
    const escaped = this.escapeHTML(text);
    if (!query) return escaped;
    const regex = new RegExp(`(${this.escapeRegExp(query)})`, "gi");
    return escaped.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  renderContentPreview(content, query) {
    if (!content) return "<em>Empty note</em>";

    const lines = content.split("\n");
    let checkCounter = 0;
    const renderedLines = lines.map(line => {
      const checkMatch = line.match(/^\s*\[( |x|X)\]\s*(.*)/);
      if (checkMatch) {
        const isChecked = checkMatch[1] === "x" || checkMatch[1] === "X";
        const text = checkMatch[2];
        const highlighted = this.highlightText(text, query);
        const currentIndex = checkCounter++;
        return `
          <div class="preview-check ${isChecked ? "checked" : ""}">
            <input type="checkbox" class="preview-check-box" data-index="${currentIndex}" ${isChecked ? "checked" : ""} />
            <span>${highlighted}</span>
          </div>
        `;
      }
      return this.highlightText(line, query);
    });

    return renderedLines.join("\n");
  }

  formatRelativeDate(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);

    if (diffSeconds < 60) return "Just now";
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffSeconds < 86400 * 7) return `${Math.floor(diffSeconds / 86400)}d ago`;

    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  showToast(message, type = "info") {
    if (!this.dom.toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "⚠️";

    toast.innerHTML = `<span>${icon}</span><span>${this.escapeHTML(message)}</span>`;
    this.dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-hide");
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }
}

// Instantiate App on Document Ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new BlushNotesApp();
});
