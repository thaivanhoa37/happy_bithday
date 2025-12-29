// Get data from localStorage or URL parameters
const urlParams = new URLSearchParams(window.location.search);
const shortId = urlParams.get('id');

let customData;

if (shortId) {
    const storedData = localStorage.getItem(`birthday_${shortId}`);
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        customData = {
            name: parsedData.name || 'Hòa ❤️',
            age: parsedData.age || '22',
            date: parsedData.date || '20.06.02',
            title: parsedData.title || 'Chúc mừng sinh nhật',
            wishes: parsedData.wishes || [],
            music: parsedData.music || null
        };
    } else {
        customData = { name: 'Hòa ❤️', age: '22', date: '20.06.02', title: 'Chúc mừng sinh nhật', wishes: [], music: null };
    }
} else {
    customData = {
        name: urlParams.get('name') || 'Hòa ❤️',
        age: urlParams.get('age') || '22',
        date: urlParams.get('date') || '20.06.02',
        title: urlParams.get('title') || 'Chúc mừng sinh nhật',
        wishes: urlParams.get('wishes') ? JSON.parse(urlParams.get('wishes')) : [],
        music: null
    };
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
// Kiểm tra thiết bị mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Biến đánh dấu đã vào fullscreen chưa
let hasEnteredFullscreen = false;

// Thêm CSS cho exit hint
function addFullscreenStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Exit hint hiển thị khi đang fullscreen */
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

// Vào fullscreen
function enterFullscreen() {
    if (hasEnteredFullscreen) return; // Đã fullscreen rồi thì không làm gì

    const elem = document.documentElement;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }

    hasEnteredFullscreen = true;

    // Ẩn tap instruction
    const tapInstruction = document.getElementById('tapInstruction');
    if (tapInstruction) {
        tapInstruction.style.display = 'none';
    }

    // Hiển thị hint thoát fullscreen
    showExitHint();
}

// Thoát fullscreen
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}

// Kiểm tra đang fullscreen không
function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}

// Hiển thị hint cách thoát fullscreen
function showExitHint() {
    // Xóa hint cũ nếu có
    const oldHint = document.querySelector('.exit-hint');
    if (oldHint) oldHint.remove();

    const hint = document.createElement('div');
    hint.className = 'exit-hint';
    hint.textContent = isMobile ? '👆 Chạm 2 lần để thoát' : '⌨️ Nhấn ESC để thoát';
    document.body.appendChild(hint);

    // Hiển thị hint
    setTimeout(() => hint.classList.add('show'), 100);

    // Ẩn hint sau 3 giây
    setTimeout(() => {
        hint.classList.remove('show');
        setTimeout(() => hint.remove(), 300);
    }, 3000);
}

// ============ CLICK ANYWHERE TO ENTER FULLSCREEN ============
document.addEventListener('click', function (e) {
    if (!hasEnteredFullscreen) {
        enterFullscreen();
    }
});

document.addEventListener('touchend', function (e) {
    if (!hasEnteredFullscreen) {
        enterFullscreen();
        return;
    }

    // Double tap để thoát fullscreen (chỉ khi đang fullscreen)
    if (isFullscreen()) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;

        if (tapLength < doubleTapDelay && tapLength > 0) {
            // Double tap detected - thoát fullscreen
            e.preventDefault();
            exitFullscreen();
            console.log('Double tap - Thoát fullscreen');
            lastTapTime = 0;
        } else {
            lastTapTime = currentTime;
        }
    }
});

// ============ DOUBLE TAP TO EXIT (MOBILE) ============
let lastTapTime = 0;
const doubleTapDelay = 300; // ms

// ============ ESC KEY TO EXIT (DESKTOP) ============
// Browser tự động xử lý ESC để thoát fullscreen
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isFullscreen()) {
        console.log('Nhấn ESC - Thoát fullscreen');
    }
});

// Lắng nghe sự kiện thay đổi fullscreen
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    if (!isFullscreen()) {
        console.log('Đã thoát fullscreen');
        // Xóa exit hint nếu còn
        const hint = document.querySelector('.exit-hint');
        if (hint) hint.remove();
    }
}

// Khởi tạo styles khi trang load
document.addEventListener('DOMContentLoaded', addFullscreenStyles);

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    addFullscreenStyles();
}
