import { gameState, switchStage } from './main.js';
import { SFX } from './audio.js';

let currentIndex = 0;
let isProcessing = false;

export function initStage2() {
    const container = document.querySelector('#stage-2');
    container.innerHTML = `
        <div class="stage2-container">
            <div class="target-display">
                <div class="current-bit-display">TARGET: <span id="current-bit">?</span></div>
            </div>
            
            <div class="center-target" id="bullseye-target">
                <div class="reticle-ring"></div>
                <div class="reticle-dot"></div>
            </div>

            <div class="log-display" id="shot-log">
                <div class="log-title">SHOT LOG</div>
                <button id="clear-log-btn" style="position: absolute; bottom: 10px; right: 10px; font-size: 0.8rem; padding: 5px 10px; border: 1px solid #b026ff; background: rgba(0,0,0,0.5); color: #fff; cursor: pointer; pointer-events: auto;">CLEAR</button>
            </div>
            
            <div class="instruction-hint">
                <p>"A true marksman knows when NOT to hit."</p>
            </div>
        </div>
    `;

    currentIndex = 0;
    isProcessing = false;
    updateDisplay();

    const bullseye = document.getElementById('bullseye-target');
    const stageContainer = document.querySelector('#stage-2');
    const clearBtn = document.getElementById('clear-log-btn');

    bullseye.onclick = (e) => {
        e.stopPropagation();
        handleShot(true);
    };

    stageContainer.onclick = (e) => {
        handleShot(false);
    };

    clearBtn.onclick = (e) => {
        e.stopPropagation();

        currentIndex = 0;

        const log = document.getElementById('shot-log');
        const entries = log.querySelectorAll('.log-entry');
        entries.forEach(entry => entry.remove());

        if (!SFX.isMuted) SFX.click();
    };
}

function handleShot(hitCenter) {
    if (isProcessing) return;

    const actionValue = hitCenter ? 1 : 0;
    const expectedValue = gameState.binaryCode[currentIndex];

    if (hitCenter) {
        logShot("IMPACT: BULLSEYE", 'neutral');
        if (!SFX.isMuted) SFX.hit();
        animateRecoil();
    } else {
        logShot("IMPACT: WIDE", 'neutral');
        if (!SFX.isMuted) SFX.error();
        triggerGlitch();
    }

    if (actionValue === expectedValue) {
        currentIndex++;

        if (currentIndex >= gameState.binaryCode.length) {
            isProcessing = true;
            logShot("ACCESS GRANTED", 'good');
            if (!SFX.isMuted) SFX.success();
            setTimeout(() => switchStage(3), 1500);
        }
    } else {
        currentIndex = 0;
    }
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

function logShot(status, type = 'neutral') {
    const log = document.getElementById('shot-log');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerText = `>> ${status}`;
    log.insertBefore(entry, log.firstChild);
}

function updateDisplay() {
    const display = document.getElementById('current-bit');
    if (display) {
        display.innerText = "?";
        display.style.color = "#fff";
    }
}

function animateRecoil() {
    const app = document.getElementById('app');
    app.style.transform = "scale(0.99)";
    setTimeout(() => app.style.transform = "scale(1)", 50);
}

function triggerGlitch() {
    const container = document.querySelector('.stage2-container');
    container.classList.add('glitch');
    setTimeout(() => container.classList.remove('glitch'), 500);
}
