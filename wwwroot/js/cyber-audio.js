// ==========================================================================
// VAULTCODE — Synthetic Web Audio Engine (Zero Asset Dependency)
// ==========================================================================

window.CyberAudio = {
    audioCtx: null,
    enabled: true,

    init() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioCtx = new AudioContext();
            }
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    },

    toggleSound() {
        this.enabled = !this.enabled;
        return this.enabled;
    },

    playTone(freq, type, duration, gainValue = 0.08) {
        if (!this.enabled) return;
        try {
            this.init();
            if (!this.audioCtx) return;

            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

            gain.gain.setValueAtTime(gainValue, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + duration);
        } catch (e) {
            // Audio policy or unsupported
        }
    },

    playKeyPress() {
        // High crisp tactile tech click
        this.playTone(1200, 'sine', 0.04, 0.06);
    },

    playDelete() {
        // Low backspace blip
        this.playTone(420, 'triangle', 0.06, 0.08);
    },

    playSubmit() {
        // Dual cyber chirp
        if (!this.enabled) return;
        this.playTone(880, 'sine', 0.06, 0.08);
        setTimeout(() => this.playTone(1320, 'sine', 0.09, 0.08), 60);
    },

    playWarningTick() {
        // Urgent digital sonar ping
        if (!this.enabled) return;
        this.playTone(950, 'sawtooth', 0.05, 0.05);
    },

    playAccessGranted() {
        // Triumphant cyber arpeggio (C - E - G - C)
        if (!this.enabled) return;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.22, 0.12);
            }, idx * 90);
        });
    },

    playLockout() {
        // Heavy descending malfunction buzz
        if (!this.enabled) return;
        const notes = [440, 370, 310, 180];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sawtooth', 0.18, 0.1);
            }, idx * 100);
        });
    }
};
