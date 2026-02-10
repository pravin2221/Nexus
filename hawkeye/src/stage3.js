import { gameState } from './main.js';
import { SFX } from './audio.js';

let humStop;

export function initStage3() {
    const container = document.querySelector('#stage-3');
    container.innerHTML = `
        <div class="soul-stone-container">
            <div class="stone-wrapper">
                <img src="/assets/hawkeye_soul_stone.png" alt="Soul Stone" class="soul-stone" />
                <div class="stone-glow"></div>
            </div>
            
            <div class="reward-text">
                <h1>SOUL STONE ACQUIRED</h1>
                <p style="color: #fff; font-family: 'Times New Roman', serif; font-style: italic; text-shadow: 2px 2px 4px #000; letter-spacing: 1px; font-size: 1.5rem; background: rgba(0,0,0,0.6); padding: 10px; border: 1px solid #444;">
                    "I cannot grant the truth you seek,<br>
                    Ask the one in <span style="color: #ff0000; text-shadow: 0 0 10px #ff0000; font-weight: bold;">red</span>, cursed to speak."
                </p>
            </div>
        </div>
    `;

    humStop = SFX.hum();
    SFX.success();

    const stone = document.querySelector('.soul-stone');
    stone.animate([
        { transform: 'scale(0) rotate(0deg)', opacity: 0 },
        { transform: 'scale(1) rotate(360deg)', opacity: 1 }
    ], {
        duration: 2000,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
}
