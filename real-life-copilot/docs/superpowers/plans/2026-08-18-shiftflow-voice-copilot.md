# ShiftFlow Voice Copilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-performance, responsive Voice-First AI Copilot and Micro-Learning Web App for frontline shift workers (pre-configured with Barista Coffee Shop SOPs).

**Architecture:** Client-side React + Vite web application utilizing browser Web Speech API for voice recognition/synthesis, Gemini API for intelligence and structured RAG output, and a client-side in-memory RAG indexer with LocalStorage persistence.

**Tech Stack:** React 18, Vite, Vanilla CSS (Glassmorphism design system), Web Speech API (`SpeechRecognition` & `SpeechSynthesis`), Gemini API (`gemini-1.5-flash`), Lucide React icons.

## Global Constraints

- **Single Command Dev**: Must start cleanly with `npm run dev`.
- **Zero Cost Baseline**: Default functionality uses Web Speech API and free Gemini API key without requiring paid infrastructure.
- **High Visual Quality**: Premium, vibrant dark UI with glowing neon accents, responsive audio visualizer animations, and clean step-by-step visual cards.
- **No Heavy Framework Overhead**: Vanilla CSS for design tokens and utilities; no external heavy styling libraries.

---

### Task 1: Project Setup & CSS Design System

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/index.css`

**Interfaces:**
- Consumes: None
- Produces: Base React app with CSS variables, typography, keyframe animations for audio waves, and glassmorphism container classes.

- [ ] **Step 1: Create package.json & vite.config.js**
- [ ] **Step 2: Create index.html with Google Fonts (Outfit & Inter) and SEO meta tags**
- [ ] **Step 3: Create src/index.css containing full design system (colors, glassmorphism, animations, audio orb styles)**
- [ ] **Step 4: Install dependencies using `npm install`**
- [ ] **Step 5: Verify build/dev server configuration**

---

### Task 2: Default Knowledge Base & RAG Engine

**Files:**
- Create: `src/data/defaultSOPs.js`
- Create: `src/services/ragEngine.js`

**Interfaces:**
- Consumes: Local storage & user uploaded document text.
- Produces: `ragEngine.searchSOP(query)` returning top matching SOP chunks and context metadata.

- [ ] **Step 1: Define pre-loaded Barista SOPs in `src/data/defaultSOPs.js` (Matcha Latte M/L recipe, Espresso Machine E-02 error troubleshooting, Closing Sanitization SOP)**
- [ ] **Step 2: Implement `src/services/ragEngine.js` with text chunking, keyword frequency weighting, cosine similarity calculation, and LocalStorage persistence**
- [ ] **Step 3: Export `getRelevantContext(query)` function**

---

### Task 3: Gemini AI & Speech Engine Integration

**Files:**
- Create: `src/services/geminiService.js`
- Create: `src/services/speechEngine.js`

**Interfaces:**
- Consumes: RAG context, user speech text, API keys from settings.
- Produces: `askCopilot(userQuery, context)` returning structured JSON response (spoken text + step card data) and `speechEngine` controls (`startListening`, `stopListening`, `speakText`).

- [ ] **Step 1: Implement `src/services/geminiService.js` to prompt Gemini Flash API with worker questions + RAG context and return structured answer & step cards**
- [ ] **Step 2: Implement `generatePreShiftQuiz(sops)` in `geminiService.js` for 1-minute quiz generation**
- [ ] **Step 3: Implement `src/services/speechEngine.js` handling `webkitSpeechRecognition` STT and `speechSynthesis` TTS with callbacks for transcript, audio state, and errors**

---

### Task 4: Navigation, Settings & Manager KB Studio Components

**Files:**
- Create: `src/components/HeaderNav.jsx`
- Create: `src/components/SettingsModal.jsx`
- Create: `src/components/ManagerKBStudio.jsx`

**Interfaces:**
- Consumes: App view state, API key state, active SOP list.
- Produces: Navigation header, API key configuration modal, and Manager document upload & preview panel.

- [ ] **Step 1: Build `HeaderNav.jsx` with logo, active tab indicator, persona switcher, and settings gear**
- [ ] **Step 2: Build `SettingsModal.jsx` for Gemini API Key and optional ElevenLabs Key input**
- [ ] **Step 3: Build `ManagerKBStudio.jsx` with file uploader (PDF/TXT), pre-loaded SOP toggles, and chunk inspector**

---

### Task 5: Worker Voice HUD & Visual Step Card Components

**Files:**
- Create: `src/components/AudioVisualizer.jsx`
- Create: `src/components/VoiceCopilotHUD.jsx`
- Create: `src/components/VisualStepCard.jsx`
- Create: `src/components/PreShiftWarmup.jsx`

**Interfaces:**
- Consumes: Voice state (`isListening`, `isSpeaking`, `isProcessing`), current query result, quiz state.
- Produces: Interactive voice HUD, audio waveform orb, visual step card breakdown, and pre-shift quiz modal.

- [ ] **Step 1: Build `AudioVisualizer.jsx` with CSS-animated glowing orb reacting to voice state**
- [ ] **Step 2: Build `VoiceCopilotHUD.jsx` with push-to-talk button, real-time live transcript, and quick-action voice chips**
- [ ] **Step 3: Build `VisualStepCard.jsx` displaying step-by-step cards, ingredient ratios, safety warning badges, and progress steps**
- [ ] **Step 4: Build `PreShiftWarmup.jsx` for 1-minute interactive safety quiz with instant feedback and "Shift Ready" unlock**

---

### Task 6: Main Application Integration, Keyboard Shortcuts & Verification

**Files:**
- Create: `src/App.jsx`

**Interfaces:**
- Consumes: All UI components and service modules.
- Produces: Complete, seamless end-to-end voice-first copilot application.

- [ ] **Step 1: Connect all components in `src/App.jsx` with centralized state management**
- [ ] **Step 2: Add global spacebar push-to-talk keyboard shortcut and quick demo preset trigger**
- [ ] **Step 3: Test app execution via `npm run dev` and verify build via `npm run build`**
- [ ] **Step 4: Audit design against guidelines, verify animations, and polish visual layout**
