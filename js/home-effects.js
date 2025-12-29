const canvas = document.getElementById('rainCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const letters = 'HAPPY BIRTHDAY '.split('');
const fontSize = 16;
let columns = Math.floor(window.innerWidth / fontSize);
const drops = Array(columns).fill(1);

function drawRainBackground() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f584b7';
    ctx.font = fontSize + 'px arial';
    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height || Math.random() > 0.95) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawRainBackground, 50);

function createSnowflakes() {
    const snowflakeContainer = document.getElementById('snowflakes');
    const snowflakeSymbols = ['❄', '❅', '❆', '✦', '✧', '✩', '✪', '✫'];
    setInterval(() => {
        if (snowflakeContainer.children.length < 50) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.innerHTML = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.fontSize = (Math.random() * 20 + 10) + 'px';
            snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
            snowflake.style.animationDelay = Math.random() * 2 + 's';
            snowflake.style.opacity = Math.random() * 0.8 + 0.2;
            snowflakeContainer.appendChild(snowflake);
            setTimeout(() => { if (snowflake.parentNode) { snowflake.parentNode.removeChild(snowflake); } }, 8000);
        }
    }, 300);
}
createSnowflakes();

// Music functionality
let audio = document.getElementById('backgroundMusic');
let musicControl = document.getElementById('musicControl');
let tapInstruction = document.getElementById('tapInstruction');
let hasUserInteracted = false;

// Sử dụng nhạc từ customData hoặc nhạc mặc định
const musicSrc = (customData.music && customData.music.data) ? customData.music.data : 'music/hpbd.mp3';
const musicName = (customData.music && customData.music.name) ? customData.music.name : 'Happy Birthday ♪';

audio.src = musicSrc;
audio.volume = 0.5;
tapInstruction.style.display = 'block';

function handleFirstInteraction() {
    if (!hasUserInteracted) {
        hasUserInteracted = true;
        tapInstruction.style.display = 'none';
        audio.play().then(() => {
            musicControl.style.display = 'flex';
            document.getElementById('musicStatus').textContent = musicName;
        }).catch(err => {
            musicControl.innerHTML = '<i class="fas fa-play"></i> Click to play music';
            musicControl.style.display = 'flex';
            musicControl.onclick = () => { audio.play(); musicControl.innerHTML = '<i class="fas fa-music"></i> ' + musicName; musicControl.onclick = toggleMusic; };
        });
    }
}

document.addEventListener('click', handleFirstInteraction, { once: true });
document.addEventListener('touchstart', handleFirstInteraction, { once: true });
document.addEventListener('keydown', handleFirstInteraction, { once: true });

function toggleMusic() {
    if (audio.paused) { audio.play(); document.getElementById('musicStatus').innerHTML = '<i class="fas fa-music"></i> ' + musicName; }
    else { audio.pause(); document.getElementById('musicStatus').innerHTML = '<i class="fas fa-pause"></i> Tạm dừng'; }
}
musicControl.onclick = toggleMusic;
audio.addEventListener('ended', () => { console.log('Music ended, looping...'); });
audio.addEventListener('error', (e) => { musicControl.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Lỗi phát nhạc'; });
