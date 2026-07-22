/**
 * CampusAI - Voice Assistant Integration
 * Uses HTML5 SpeechRecognition and SpeechSynthesis APIs
 */

class VoiceAssistant {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isMuted = true; // Start muted by default
        this.onResultCallback = null;
        this.onStatusChangeCallback = null;
        
        this.initSpeechRecognition();
    }

    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition API not supported in this browser.");
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.triggerStatusChange("listening");
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.triggerStatusChange("idle");
        };

        this.recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            this.isListening = false;
            this.triggerStatusChange("error", event.error);
        };

        this.recognition.onresult = (event) => {
            const resultText = event.results[0][0].transcript;
            if (this.onResultCallback) {
                this.onResultCallback(resultText);
            }
        };
    }

    toggleListening() {
        if (!this.recognition) {
            alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            try {
                this.synthesis.cancel(); // Stop any ongoing text-to-speech before listening
                this.recognition.start();
            } catch (e) {
                console.error("Failed to start speech recognition:", e);
            }
        }
    }

    speak(text) {
        if (this.isMuted || !this.synthesis) return;

        // Clean text of HTML tags for clean speech
        const cleanText = text.replace(/<[^>]*>/g, '').replace(/&bull;/g, '•').replace(/&nbsp;/g, ' ');

        // Cancel current speeches
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        // Find a natural English voice if possible
        const voices = this.synthesis.getVoices();
        const preferredVoice = voices.find(voice => voice.lang.includes('en-US') && voice.name.includes('Natural')) || 
                               voices.find(voice => voice.lang.includes('en')) || 
                               voices[0];
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        this.synthesis.speak(utterance);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted && this.synthesis) {
            this.synthesis.cancel();
        }
        return this.isMuted;
    }

    triggerStatusChange(status, detail = '') {
        if (this.onStatusChangeCallback) {
            this.onStatusChangeCallback({ status, isListening: this.isListening, detail });
        }
    }
}

// Bind to window
window.VoiceAssistant = new VoiceAssistant();
