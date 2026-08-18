import React, { useState, useEffect, useCallback } from 'react';
import HeaderNav from './components/HeaderNav.jsx';
import VoiceCopilotHUD from './components/VoiceCopilotHUD.jsx';
import VisualStepCard from './components/VisualStepCard.jsx';
import ManagerKBStudio from './components/ManagerKBStudio.jsx';
import PreShiftWarmup from './components/PreShiftWarmup.jsx';
import SettingsModal from './components/SettingsModal.jsx';

import { searchSOP, getActiveSOPs } from './services/ragEngine.js';
import { askCopilot } from './services/geminiService.js';
import { speechEngine } from './services/speechEngine.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('worker');
  const [voiceState, setVoiceState] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [spokenAnswer, setSpokenAnswer] = useState('');
  const [activeCard, setActiveCard] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings State
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('shiftflow_gemini_key') || '');
  const [elevenKey, setElevenKey] = useState(() => localStorage.getItem('shiftflow_eleven_key') || '');
  const [speechSpeed, setSpeechSpeed] = useState(() => parseFloat(localStorage.getItem('shiftflow_speech_speed') || '1.0'));

  // Initialize with initial search on default SOP
  useEffect(() => {
    const sops = getActiveSOPs();
    if (sops.length > 0) {
      const defaultSop = sops[0];
      setActiveCard({
        title: defaultSop.title,
        category: defaultSop.category,
        steps: defaultSop.metadata?.steps || [],
        warning: defaultSop.metadata?.warning || null,
        ingredients: defaultSop.metadata?.ingredients || []
      });
      setSpokenAnswer("Ready on shift! Ask any recipe, machine repair error code, or sanitization SOP.");
    }
    speechEngine.setElevenLabsKey(elevenKey);
  }, [elevenKey]);

  // Execute Voice Query Processing
  const processVoiceQuery = useCallback(async (queryText) => {
    if (!queryText || queryText.trim() === '') return;

    setVoiceState('processing');
    setTranscript(queryText);

    // 1. Search local RAG index
    const searchResult = searchSOP(queryText);

    // 2. Generate structured response with Gemini API / Local Smart Fallback
    const result = await askCopilot(queryText, searchResult, geminiKey);

    // 3. Update Visual Step Card UI
    setActiveCard(result.visualCard);
    setSpokenAnswer(result.spokenAnswer);

    // 4. Trigger Hands-Free Voice Audio Output
    setVoiceState('speaking');
    speechEngine.speakText(
      result.spokenAnswer,
      (newState) => setVoiceState(newState),
      speechSpeed
    );
  }, [geminiKey, speechSpeed]);

  // Handle Microphone Button Click
  const handleMicClick = () => {
    if (voiceState === 'listening') {
      speechEngine.stopListening();
      setVoiceState('idle');
    } else if (voiceState === 'speaking') {
      speechEngine.cancelSpeech();
      setVoiceState('idle');
    } else {
      speechEngine.startListening(
        (interimText, isFinal) => {
          setTranscript(interimText);
          if (isFinal && interimText.trim() !== '') {
            processVoiceQuery(interimText);
          }
        },
        (newState) => setVoiceState(newState)
      );
    }
  };

  // Keyboard shortcut: Spacebar to trigger voice listening
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && activeTab === 'worker' && !isSettingsOpen) {
        if (['input', 'textarea', 'select'].includes(document.activeElement.tagName.toLowerCase())) {
          return; // Don't trigger if user is typing in input
        }
        e.preventDefault();
        if (voiceState === 'idle') {
          handleMicClick();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, isSettingsOpen, voiceState]);

  const handleReplayAudio = () => {
    if (spokenAnswer) {
      setVoiceState('speaking');
      speechEngine.speakText(
        spokenAnswer,
        (newState) => setVoiceState(newState),
        speechSpeed
      );
    }
  };

  return (
    <div className="app-container">
      {/* Header Navbar */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isApiKeySet={Boolean(geminiKey || elevenKey)}
      />

      {/* Worker View: Voice HUD & Step Cards */}
      {activeTab === 'worker' && (
        <main className="main-layout worker-mode">
          <VoiceCopilotHUD
            voiceState={voiceState}
            onMicClick={handleMicClick}
            transcript={transcript}
            spokenAnswer={spokenAnswer}
            onQuickChipClick={processVoiceQuery}
          />

          <VisualStepCard
            cardData={activeCard}
            spokenAnswer={spokenAnswer}
            onReplayAudio={handleReplayAudio}
          />
        </main>
      )}

      {/* Pre-Shift 1-Minute Warmup Quiz View */}
      {activeTab === 'quiz' && (
        <main className="main-layout">
          <PreShiftWarmup onCompleteWarmup={() => setActiveTab('worker')} />
        </main>
      )}

      {/* Manager KB Studio View */}
      {activeTab === 'manager' && (
        <main className="main-layout">
          <ManagerKBStudio onSOPsUpdated={() => setActiveTab('manager')} />
        </main>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        geminiKey={geminiKey}
        setGeminiKey={setGeminiKey}
        elevenKey={elevenKey}
        setElevenKey={setElevenKey}
        speechSpeed={speechSpeed}
        setSpeechSpeed={setSpeechSpeed}
      />
    </div>
  );
}
