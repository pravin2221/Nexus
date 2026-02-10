import { gameState, switchStage } from './main.js';
import { SFX } from './audio.js';

let targetX, targetY;
let isLocked = false;
let lastScanTime = 0;
let targetsFound = 0;
const totalTargets = 3;

export function initStage1() {
    isLocked = false;
    targetsFound = 0;
    const container = document.querySelector('#stage-1');
    container.innerHTML = `
        <div class="device-panel">
            <div class="hud-layer">
                <div class="hud-ring ring-1"></div>
                <div class="hud-ring ring-2"></div>
                <div class="hud-ring ring-3"></div>
            </div>
            <img src="/assets/hawkeye_device_panel.png" alt="Device Panel" class="panel-img" />
            <div id="binary-output"></div>
            <div class="instruction">LOCATE SIGNAL SOURCE ALPHA</div>
            <div id="progress-text" style="position:absolute; top: 10px; right: 20px; color: #fff; font-family: monospace;">TARGETS: 0/3</div>
            <button id="transition-btn" style="display: none; margin-top: 20px;">PROCEED TO ROUND 2</button>
        </div>
    `;

    spawnNextTarget();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    if (SFX.playBGM && !window.currentBGM) {
        window.currentBGM = SFX.playBGM('/assets/bgm.mp3');
    }
}

function spawnNextTarget() {
    const padding = 200;
    targetX = padding + Math.random() * (window.innerWidth - 2 * padding);
    targetY = padding + Math.random() * (window.innerHeight - 2 * padding);
    targetX = padding + Math.random() * (window.innerWidth - 2 * padding);
    targetY = padding + Math.random() * (window.innerHeight - 2 * padding);

    const instruction = document.querySelector('.instruction');
    if (instruction) {
        const names = ["ALPHA", "BETA", "GAMMA"];
        instruction.textContent = `LOCATE SIGNAL SOURCE ${names[targetsFound]}`;
        instruction.style.color = "#e0e0e0";
    }
}

function handleMouseMove(e) {
    if (gameState.currentStage !== 1 || isLocked) return;

    const dx = e.clientX - targetX;
    const dy = e.clientY - targetY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const panel = document.querySelector('.panel-img');
    const instruction = document.querySelector('.instruction');
    const cursor = document.querySelector('#cursor');
    const rings = document.querySelectorAll('.hud-ring');
    const now = Date.now();

    if (dist < 20) {
        instruction.textContent = "SIGNAL DETECTED - FIRE";
        instruction.style.color = "#b026ff";
        instruction.style.textShadow = "0 0 20px #b026ff";
        cursor.style.filter = "drop-shadow(0 0 10px #fff)";

        if (now - lastScanTime > 150) {
            if (!SFX.isMuted) SFX.scan(880);
            lastScanTime = now;
        }

        if (navigator.vibrate) navigator.vibrate(5);
        panel.style.transform = `translate(${Math.random() * 2}px, ${Math.random() * 2}px) scale(1.05)`;
        rings.forEach(r => r.style.borderColor = "#b026ff");
        rings.forEach(r => r.style.boxShadow = "0 0 15px #b026ff");

    } else if (dist < 150) {
        instruction.textContent = "SIGNAL STRENGTHENING";
        instruction.style.color = "#00ff00";
        instruction.style.textShadow = "0 0 10px #00ff00";
        cursor.style.filter = "none";
        panel.style.transform = `scale(1.02)`;
        rings.forEach(r => r.style.borderColor = "#00ff00");
        rings.forEach(r => r.style.boxShadow = "0 0 5px #00ff00");

        if (now - lastScanTime > 300) {
            if (!SFX.isMuted) SFX.scan(440);
            lastScanTime = now;
        }
    } else {
        const names = ["ALPHA", "BETA", "GAMMA"];
        instruction.textContent = `LOCATE SIGNAL SOURCE ${names[targetsFound]}`;
        instruction.style.color = "#e0e0e0";
        instruction.style.textShadow = "none";
        cursor.style.filter = "none";
        panel.style.transform = `scale(1)`;
        rings.forEach(r => r.style.borderColor = "rgba(176, 38, 255, 0.3)");
        rings.forEach(r => r.style.boxShadow = "none");

        if (now - lastScanTime > 800) {
            if (!SFX.isMuted) SFX.scan(220);
            lastScanTime = now;
        }
    }
}

function handleClick(e) {
    if (gameState.currentStage !== 1 || isLocked) return;
    const dx = e.clientX - targetX;
    const dy = e.clientY - targetY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 50) {
        targetsFound++;
        const progText = document.querySelector('#progress-text');
        if (progText) progText.textContent = `TARGETS: ${targetsFound}/${totalTargets}`;

        if (targetsFound < totalTargets) {
            if (!SFX.isMuted) SFX.hit();
            spawnNextTarget();
            const panel = document.querySelector('.panel-img');
            panel.classList.add('glitch');
            setTimeout(() => panel.classList.remove('glitch'), 300);
        } else {
            triggerSuccess();
        }
    } else {
        if (!SFX.isMuted) SFX.miss();
        const app = document.querySelector('#app');
        app.style.transform = "translateX(5px)";
        setTimeout(() => app.style.transform = "translateX(0)", 50);
    }
}

function triggerSuccess() {
    isLocked = true;
    if (!SFX.isMuted) SFX.success();

    const instruction = document.querySelector('.instruction');
    const panel = document.querySelector('.panel-img');
    const output = document.querySelector('#binary-output');

    instruction.textContent = "SYSTEM CRITICAL - DUMPING MEMORY";
    instruction.classList.add('glitch');

    panel.style.filter = "hue-rotate(90deg) blur(2px)";
    document.body.style.backgroundColor = "#1a0000";

    const shakeInterval = setInterval(() => {
        panel.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
        output.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px) translate(-50%, -50%)`;
    }, 50);

    const codeLength = 10;
    const binaryArray = Array.from({ length: codeLength }, () => Math.random() > 0.5 ? 1 : 0);
    const binaryString = binaryArray.join('');
    const base64String = btoa(binaryString);

    gameState.binaryCode = binaryArray;

    output.style.display = 'block';

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let iterations = 0;

    const revealInterval = setInterval(() => {
        output.innerText = base64String.split('')
            .map((char, index) => {
                if (index < iterations) return base64String[index];
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

        if (iterations >= base64String.length) {
            clearInterval(revealInterval);
            clearInterval(shakeInterval);

            if (!SFX.isMuted) SFX.success();
            panel.style.transform = "none";
            output.style.transform = "translate(-50%, -50%)";
            document.body.style.backgroundColor = "";
            instruction.textContent = "MEMORY DUMP COMPLETE";
            instruction.classList.remove('glitch');
            instruction.style.color = "#ff8c00";

            const btn = document.getElementById('transition-btn');
            btn.innerText = "PROCEED TO ROUND 2";
            btn.style.display = 'block';
            btn.onclick = () => {
                cleanup();
                switchStage(2);
            };
        }

        if (!SFX.isMuted && Math.random() > 0.7) SFX.click();
        iterations += 1 / 3;
    }, 50);
}

function cleanup() {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('click', handleClick);
}
