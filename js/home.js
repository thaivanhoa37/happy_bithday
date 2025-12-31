// Get data from URL parameters and localStorage
const urlParams = new URLSearchParams(window.location.search);
const shortId = urlParams.get('id');

let customData = {
    name: 'Người đặc biệt ❤️',
    age: '22',
    date: '01.01.00',
    title: 'Chúc mừng sinh nhật',
    wishes: [],
    fireworkLink: null,
    music: null
};

// Load dữ liệu từ localStorage
if (shortId) {
    const storedData = localStorage.getItem(`birthday_${shortId}`);
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        customData = {
            name: parsedData.name || customData.name,
            age: parsedData.age || customData.age,
            date: parsedData.date || customData.date,
            title: parsedData.title || customData.title,
            wishes: parsedData.wishes || [],
            fireworkLink: parsedData.fireworkLink || null,
            music: parsedData.music || null
        };
        console.log('[Home] Đã tải dữ liệu từ localStorage:', customData);

        // Cập nhật link icon thư nếu có fireworkLink
        if (customData.fireworkLink) {
            const letterBtn = document.getElementById('letterBtn');
            if (letterBtn) {
                letterBtn.href = customData.fireworkLink;
                console.log('[Home] Đã cập nhật link thư:', customData.fireworkLink);
            }
        }
    } else {
        console.log('[Home] Không tìm thấy dữ liệu với ID:', shortId);
    }
}

document.title = customData.title;

function show_date_time() {
    window.setTimeout("show_date_time()", 1000);
    BirthDay = new Date("04/03/2024 08:30:00");
    today = new Date();
    timeold = (today.getTime() - BirthDay.getTime());
    sectimeold = timeold / 1000;
    secondsold = Math.floor(sectimeold);
    msPerDay = 24 * 60 * 60 * 1000;
    e_daysold = timeold / msPerDay;
    daysold = Math.floor(e_daysold);
    e_hrsold = (e_daysold - daysold) * 24;
    hrsold = Math.floor(e_hrsold);
    e_minsold = (e_hrsold - hrsold) * 60;
    minsold = Math.floor((e_hrsold - hrsold) * 60);
    seconds = Math.floor((e_minsold - minsold) * 60);
    if (document.getElementById('span_dt_dt')) {
        document.getElementById('span_dt_dt').innerHTML = daysold + " Ngày " + hrsold + " Giờ " + minsold + " Phút " + seconds + " Giây ";
    }
}
show_date_time();

// ============ FULLSCREEN FUNCTIONALITY ============
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let hasEnteredFullscreen = false;

function addFullscreenStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .exit-hint {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }
        .exit-hint.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

function enterFullscreen() {
    if (hasEnteredFullscreen) return;

    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }

    hasEnteredFullscreen = true;

    const tapInstruction = document.getElementById('tapInstruction');
    if (tapInstruction) {
        tapInstruction.style.display = 'none';
    }

    showExitHint();
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}

function showExitHint() {
    const oldHint = document.querySelector('.exit-hint');
    if (oldHint) oldHint.remove();

    const hint = document.createElement('div');
    hint.className = 'exit-hint';
    hint.textContent = isMobile ? '👆 Chạm 2 lần để thoát' : '⌨️ Nhấn ESC để thoát';
    document.body.appendChild(hint);

    setTimeout(() => hint.classList.add('show'), 100);
    setTimeout(() => {
        hint.classList.remove('show');
        setTimeout(() => hint.remove(), 300);
    }, 3000);
}

// Click to enter fullscreen
document.addEventListener('click', function (e) {
    if (!hasEnteredFullscreen) {
        enterFullscreen();
    }
});

// Double tap to exit (mobile)
let lastTapTime = 0;
const doubleTapDelay = 300;

document.addEventListener('touchend', function (e) {
    if (!hasEnteredFullscreen) {
        enterFullscreen();
        return;
    }

    if (isFullscreen()) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;

        if (tapLength < doubleTapDelay && tapLength > 0) {
            e.preventDefault();
            exitFullscreen();
            lastTapTime = 0;
        } else {
            lastTapTime = currentTime;
        }
    }
});

// ESC key handling
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isFullscreen()) {
        console.log('Nhấn ESC - Thoát fullscreen');
    }
});

// Fullscreen change events
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    if (!isFullscreen()) {
        console.log('Đã thoát fullscreen');
        const hint = document.querySelector('.exit-hint');
        if (hint) hint.remove();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', addFullscreenStyles);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    addFullscreenStyles();
}
