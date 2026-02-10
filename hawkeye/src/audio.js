let audioCtx;

export function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playSFXInternal(freq, type, duration, vol = 0.1) {
    if (!audioCtx) initAudio();

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

export const SFX = {
    isMuted: false,
    toggleMute: function () {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            if (audioCtx) audioCtx.suspend();
        } else {
            if (audioCtx) audioCtx.resume();
        }
        return this.isMuted;
    },
    hover: () => playSFXInternal(200, 'sine', 0.1, 0.05),
    click: () => playSFXInternal(800, 'square', 0.05, 0.1),
    hit: () => playSFXInternal(440, 'triangle', 0.2, 0.2),
    miss: () => playSFXInternal(100, 'sawtooth', 0.3, 0.1),
    error: () => playSFXInternal(50, 'sawtooth', 0.5, 0.3),
    scan: (freq) => playSFXInternal(freq, 'sine', 0.1, 0.1),
    success: () => {
        if (!audioCtx) initAudio();
        let now = audioCtx.currentTime;
        [440, 554, 659, 880].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.frequency.setValueAtTime(freq, now + i * 0.1);
            gain.gain.setValueAtTime(0.1, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.5);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.5);
        });
    },
    hum: () => {
        if (!audioCtx) initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.value = 60;
        gain.gain.value = 0.02;
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        return () => {
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
            osc.stop(audioCtx.currentTime + 1);
        };
    },
    playBGM: (filePath) => {
        const bgm = new Audio(filePath);
        bgm.loop = true;
        bgm.volume = 0.3;
        bgm.play().catch(e => { });

        return {
            stop: () => bgm.pause(),
            play: () => bgm.play(),
            setVolume: (v) => bgm.volume = v,
            element: bgm
        };
    }
};
