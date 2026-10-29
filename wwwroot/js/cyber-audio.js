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

    playWarningTick(secondsRemaining = 5) {
        // Urgent digital sonar ping with dynamic pitch scaling
        if (!this.enabled) return;
        try {
            this.init();
            if (!this.audioCtx) return;

            const sec = (typeof secondsRemaining === 'number' && !isNaN(secondsRemaining))
                ? Math.max(1, Math.min(10, secondsRemaining))
                : 5;
            // Frequency scales upward as secondsRemaining decreases (10s -> 800Hz, 1s -> 1600Hz)
            const freq = 800 + (10 - sec) * (800 / 9);

            const now = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.04);

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.05);
        } catch (e) {
            this.playTone(1000, 'sawtooth', 0.05, 0.06);
        }
    },

    playPenaltyGlitch() {
        // Crunchy synthetic glitch/malfunction buzz using a distorted wave and frequency sweeps
        if (!this.enabled) return;
        try {
            this.init();
            if (!this.audioCtx) return;

            const now = this.audioCtx.currentTime;
            const duration = 0.22;

            // WaveShaper distortion curve for crunchy digital clip
            const n_samples = 256;
            const curve = new Float32Array(n_samples);
            const deg = Math.PI / 180;
            const k = 40; // distortion intensity
            for (let i = 0; i < n_samples; ++i) {
                const x = (i * 2) / n_samples - 1;
                curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
            }

            const distortion = this.audioCtx.createWaveShaper();
            distortion.curve = curve;
            distortion.oversample = '2x';

            // Fast modulated primary sawtooth sweep
            const osc = this.audioCtx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.linearRampToValueAtTime(75, now + 0.07);
            osc.frequency.setValueAtTime(420, now + 0.08);
            osc.frequency.exponentialRampToValueAtTime(40, now + duration);

            // Sub-frequency square for aggressive binary crunch
            const subOsc = this.audioCtx.createOscillator();
            subOsc.type = 'square';
            subOsc.frequency.setValueAtTime(110, now);
            subOsc.frequency.linearRampToValueAtTime(45, now + duration);

            // Gain envelope with rapid glitch stutter
            const gain = this.audioCtx.createGain();
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.setValueAtTime(0.01, now + 0.06);
            gain.gain.setValueAtTime(0.14, now + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            osc.connect(distortion);
            subOsc.connect(distortion);
            distortion.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(now);
            subOsc.start(now);
            osc.stop(now + duration);
            subOsc.stop(now + duration);
        } catch (e) {
            this.playTone(160, 'sawtooth', 0.18, 0.1);
        }
    },

    playAccessGranted() {
        // Richer, triumphant multi-stage cyber chords & arpeggios
        if (!this.enabled) return;
        try {
            this.init();
            if (!this.audioCtx) return;

            const baseTime = this.audioCtx.currentTime;

            // Stage 1: Ascending crisp cyber arpeggio
            const arpeggio = [
                { freq: 523.25, time: 0, dur: 0.16, type: 'sine', gain: 0.09 },     // C5
                { freq: 659.25, time: 0.07, dur: 0.16, type: 'sine', gain: 0.10 },  // E5
                { freq: 783.99, time: 0.14, dur: 0.16, type: 'sine', gain: 0.11 },  // G5
                { freq: 987.77, time: 0.21, dur: 0.18, type: 'sine', gain: 0.12 },  // B5
                { freq: 1046.50, time: 0.28, dur: 0.24, type: 'sine', gain: 0.14 }, // C6
                { freq: 1318.51, time: 0.35, dur: 0.32, type: 'triangle', gain: 0.13 } // E6
            ];

            arpeggio.forEach(n => {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                osc.type = n.type;
                osc.frequency.setValueAtTime(n.freq, baseTime + n.time);
                gain.gain.setValueAtTime(n.gain, baseTime + n.time);
                gain.gain.exponentialRampToValueAtTime(0.0001, baseTime + n.time + n.dur);
                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                osc.start(baseTime + n.time);
                osc.stop(baseTime + n.time + n.dur);
            });

            // Stage 2: Triumphant sustained multi-voice power chord (C - G - C - E)
            const chordNotes = [523.25, 783.99, 1046.50, 1567.98, 2093.00]; // C5, G5, C6, G6, C7
            const chordStart = baseTime + 0.44;
            const chordDuration = 0.95;

            chordNotes.forEach((freq, i) => {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                osc.type = i === chordNotes.length - 1 ? 'sine' : 'triangle';
                osc.frequency.setValueAtTime(freq, chordStart);

                // Rich swell and sustain
                gain.gain.setValueAtTime(0.001, chordStart);
                gain.gain.linearRampToValueAtTime(0.06, chordStart + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.0001, chordStart + chordDuration);

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                osc.start(chordStart);
                osc.stop(chordStart + chordDuration);
            });
        } catch (e) {
            // Fallback simple arpeggio
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, idx) => {
                setTimeout(() => this.playTone(freq, 'sine', 0.22, 0.12), idx * 90);
            });
        }
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
