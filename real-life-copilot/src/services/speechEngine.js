/**
 * Web Speech API Engine wrapper (Speech-to-Text & Text-to-Speech)
 */

class SpeechEngine {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.isSpeaking = false;
    this.onTranscriptCallback = null;
    this.onStateCallback = null;
    this.elevenLabsKey = null;

    this.initRecognition();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.onStateCallback) this.onStateCallback('listening');
      };

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (this.onTranscriptCallback) {
          this.onTranscriptCallback(transcript, event.results[0].isFinal);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        if (this.onStateCallback) this.onStateCallback('idle');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (!this.isSpeaking && this.onStateCallback) {
          this.onStateCallback('idle');
        }
      };
    } else {
      console.warn('Web Speech Recognition API is not supported in this browser.');
    }
  }

  setElevenLabsKey(key) {
    this.elevenLabsKey = key;
  }

  startListening(onTranscript, onStateChange) {
    this.onTranscriptCallback = onTranscript;
    this.onStateCallback = onStateChange;

    if (this.synthesis && this.synthesis.speaking) {
      this.synthesis.cancel();
    }

    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        console.warn('Recognition already started or error', e);
      }
    } else {
      alert('Speech recognition is not supported in your browser. Please try Google Chrome or Microsoft Edge.');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  async speakText(text, onStateChange, voiceSpeed = 1.0) {
    if (!text || text.trim() === '') return;

    if (this.onStateCallback) this.onStateCallback('speaking');
    this.isSpeaking = true;

    // Optional ElevenLabs TTS call if API key provided
    if (this.elevenLabsKey && this.elevenLabsKey.trim() !== '') {
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': this.elevenLabsKey
            },
            body: JSON.stringify({
              text: text,
              model_id: 'eleven_monolingual_v1',
              voice_settings: { stability: 0.5, similarity_boost: 0.75 }
            })
          }
        );

        if (response.ok) {
          const blob = await response.blob();
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audio.onended = () => {
            this.isSpeaking = false;
            if (onStateChange) onStateChange('idle');
          };
          audio.play();
          return;
        }
      } catch (e) {
        console.warn('ElevenLabs API call failed, fallback to native browser SpeechSynthesis', e);
      }
    }

    // Native Browser Speech Synthesis
    if (this.synthesis) {
      this.synthesis.cancel(); // Stop any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceSpeed;
      utterance.pitch = 1.0;

      // Select high quality English voice if available
      const voices = this.synthesis.getVoices();
      const preferredVoice = voices.find(
        v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onStateChange) onStateChange('idle');
      };

      utterance.onerror = (err) => {
        console.warn('Speech synthesis error', err);
        this.isSpeaking = false;
        if (onStateChange) onStateChange('idle');
      };

      this.synthesis.speak(utterance);
    } else {
      this.isSpeaking = false;
      if (onStateChange) onStateChange('idle');
    }
  }

  cancelSpeech() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    this.isSpeaking = false;
  }
}

export const speechEngine = new SpeechEngine();
