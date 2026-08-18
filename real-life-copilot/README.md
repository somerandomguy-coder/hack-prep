# ⚡ ShiftFlow - Voice-First AI Copilot & Micro-Learning Platform

> **Real-Time AI Assistant for Physical & Frontline Work (Barista & Coffee Shop Demo)**

ShiftFlow is an on-demand voice-first AI copilot designed to help frontline workers (baristas, warehouse technicians, repair crews) access workplace SOPs hands-free while on shift, alongside 1-minute pre-shift safety quizzes.

---

## ✨ Features

- 🎧 **Hands-Free Voice HUD**: Ask recipe, machine repair, or sanitization questions using your headset or phone microphone. Speaks back 1-2 sentence answers in ~2 seconds.
- 📋 **Synchronized Visual Step Cards**: Displays step-by-step visual cards, safety warning badges, and ingredient ratio tables on screen.
- 📁 **Manager KB Studio**: Upload workplace SOP manuals (PDF/TXT) or use pre-loaded Coffee Shop guides with instant client-side RAG indexing ($0 infrastructure cost).
- 🛡️ **1-Minute Pre-Shift Quiz**: Auto-generates micro-learning safety quizzes before every shift to ensure quality and compliance.
- ⌨️ **Push-to-Talk Shortcut**: Press `Spacebar` anytime while on shift to ask questions instantly.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Make sure you have **Node.js** (v18+ recommended) installed.

### 2. Installation

```bash
# Clone or navigate to the project subfolder
cd real-life-copilot

# Install dependencies
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open your browser at **`http://localhost:3000`**.

> **Note on Voice API**: Speech recognition works natively on Google Chrome and Microsoft Edge. By default, it operates completely free without requiring an API key. You can optionally add a Gemini API key in **Settings (⚙️)** for enhanced live RAG intelligence.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide React Icons.
- **Styling**: Vanilla CSS Design System with Glassmorphism, Google Fonts (Outfit & Inter), and CSS keyframe audio visualizer animations.
- **Voice Engine**: Web Speech API (`SpeechRecognition` STT + `SpeechSynthesis` TTS).
- **AI & RAG**: Client-side TF-IDF/semantic cosine indexer + Gemini 1.5/2.0 Flash API (with zero-cost offline fallback).

---

## 📦 Project Structure

```
real-life-copilot/
├── src/
│   ├── components/       # HeaderNav, VoiceCopilotHUD, VisualStepCard, ManagerKBStudio, PreShiftWarmup, SettingsModal
│   ├── data/             # Pre-loaded Barista Coffee Shop SOP dataset
│   ├── services/         # RAG Engine, Gemini Service, Web Speech Engine
│   ├── App.jsx           # Main state & shortcut orchestration
│   ├── index.css         # Custom Glassmorphism design system
│   └── main.jsx          # Vite React entrypoint
├── docs/                 # Design specs and implementation plans
├── public/
├── package.json
└── vite.config.js
```
