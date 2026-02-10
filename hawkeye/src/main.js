import './style.css'
import { initStage1 } from './stage1.js'
import { initStage2 } from './stage2.js'
import { initStage3 } from './stage3.js'
import { initAudio } from './audio.js'

export const gameState = {
    currentStage: 1,
    binaryCode: [],
};

const app = document.querySelector('#app');
const cursor = document.querySelector('#cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.9)';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
});

const startOverlay = document.createElement('div');
startOverlay.id = 'start-overlay';
startOverlay.innerHTML = `
    <div style="text-align: center; color: #b026ff; font-family: 'Orbitron', sans-serif;">
        <h1>HAWKEYE PROTOCOL</h1>
        <p>CLICK TO INITIALIZE SYSTEMS</p>
    </div>
`;
startOverlay.style.position = 'fixed';
startOverlay.style.top = '0';
startOverlay.style.left = '0';
startOverlay.style.width = '100vw';
startOverlay.style.height = '100vh';
startOverlay.style.background = 'rgba(0,0,0,0.9)';
startOverlay.style.zIndex = '100000';
startOverlay.style.display = 'flex';
startOverlay.style.justifyContent = 'center';
startOverlay.style.alignItems = 'center';
startOverlay.style.cursor = 'pointer';

document.body.appendChild(startOverlay);

startOverlay.addEventListener('click', () => {
    initAudio();
    startOverlay.style.opacity = '0';
    setTimeout(() => startOverlay.remove(), 500);
    const osc = new (window.AudioContext || window.webkitAudioContext)().createOscillator();
    osc.start();
    osc.stop();

    switchStage(1);
});

export function switchStage(stageNum) {
    document.querySelectorAll('.stage').forEach(el => el.classList.remove('active'));

    const stageEl = document.querySelector(`#stage-${stageNum}`);
    if (stageEl) {
        stageEl.classList.add('active');
        gameState.currentStage = stageNum;

        if (stageNum === 1) initStage1();
        if (stageNum === 2) initStage2();
        if (stageNum === 3) initStage3();
    }
}

function init() {
}

init();
