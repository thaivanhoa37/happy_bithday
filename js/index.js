// Khôi phục lời chúc từ localStorage hoặc bắt đầu với danh sách trống
let wishes = JSON.parse(localStorage.getItem('current_wishes')) || [];

function saveWishesToStorage() {
    localStorage.setItem('current_wishes', JSON.stringify(wishes));
}

function renderWishes() {
    const wishesList = document.getElementById('wishesList');
    wishesList.innerHTML = '';
    wishes.forEach((wish, idx) => {
        const div = document.createElement('div');
        div.className = 'wish-item';
        div.innerHTML = `<input type="text" value="${wish.replace(/"/g, '&quot;')}" data-index="${idx}" required placeholder='Nhập lời chúc...'>` +
            `<button type="button" class="remove-wish-btn" onclick="removeWish(${idx})"><i class='fas fa-trash'></i></button>`;
        wishesList.appendChild(div);

        // Gắn event listener cho input
        const input = div.querySelector('input');
        input.addEventListener('input', function () {
            wishes[idx] = this.value;
            saveWishesToStorage(); // Lưu ngay khi thay đổi
        });
    });
}

function addWish() {
    wishes.push("");
    saveWishesToStorage();
    renderWishes();
    // Focus vào input mới được thêm
    setTimeout(() => {
        const inputs = document.querySelectorAll('#wishesList input');
        if (inputs.length > 0) {
            inputs[inputs.length - 1].focus();
        }
    }, 100);
}

function removeWish(idx) {
    wishes.splice(idx, 1);
    saveWishesToStorage();
    renderWishes();
}

renderWishes();

// Form submit
document.getElementById('birthdayForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const age = document.getElementById('age').value.trim();
    const date = document.getElementById('date').value.trim();
    const title = document.getElementById('title').value.trim();

    // Debug: In ra console để kiểm tra
    console.log('Form values:', { name, age, date, title });
    console.log('Current wishes array:', wishes);

    // Lấy lời chúc từ các input hiện tại
    const wishInputs = document.querySelectorAll('#wishesList input');
    const wishesFiltered = [];
    wishInputs.forEach((input, index) => {
        const wish = input.value.trim();
        console.log(`Wish ${index}:`, wish);
        if (wish.length > 0) {
            wishesFiltered.push(wish);
        }
    });

    console.log('Filtered wishes:', wishesFiltered);

    if (!name || !age || !date || !title) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }

    if (wishesFiltered.length === 0) {
        alert('Vui lòng thêm ít nhất 1 lời chúc! Nhấn nút "Thêm lời chúc" và nhập nội dung.');
        return;
    }

    // Tạo shortId
    const shortId = generateShortId();

    // Lấy link pháo hoa (nếu có)
    const fireworkLink = document.getElementById('fireworkLink').value.trim();

    // Lưu vào Firebase
    const data = { name, age, date, title, wishes: wishesFiltered, fireworkLink: fireworkLink || null, createdAt: Date.now() };
    console.log('Data to save:', data);

    // Sử dụng window.db đã khởi tạo trong HTML
    window.db.ref('birthdays/' + shortId).set(data)
        .then(() => {
            console.log('[Firebase] Saved data successfully');
        })
        .catch((error) => {
            console.error('[Firebase] Save failed', error);
            alert('Lỗi lưu dữ liệu lên Firebase! Vui lòng thử lại.');
            return;
        });

    // Xóa lời chúc tạm thời sau khi tạo thành công
    localStorage.removeItem('current_wishes');

    // Tạo link
    const url = `${window.location.origin}${window.location.pathname.replace('/index.html', '')}/home.html?id=${shortId}`;
    document.getElementById('result-content').innerHTML = `<b>🎉 Link trang sinh nhật đã được tạo:</b><br><br><a href='${url}' target='_blank'>${url}</a><br><br><small>ID: ${shortId}</small>`;
    document.getElementById('result').style.display = 'block';
    document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
});

function generateShortId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function clearAllData() {
    if (confirm('Bạn có chắc muốn xóa tất cả dữ liệu (bao gồm lời chúc và các trang sinh nhật đã tạo)?')) {
        // Xóa tất cả dữ liệu birthday
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('birthday_') || key === 'current_wishes') {
                localStorage.removeItem(key);
            }
        });

        // Reset form
        document.getElementById('birthdayForm').reset();
        wishes = [];
        renderWishes();

        // Ẩn kết quả
        document.getElementById('result').style.display = 'none';

        alert('Đã xóa tất cả dữ liệu!');
    }
}

// ===== FIREWORK SECTION =====

// Load dữ liệu pháo hoa từ localStorage
let fireworkWishes = JSON.parse(localStorage.getItem('happynewyear_wishes')) || [];
let fireworkImages = JSON.parse(localStorage.getItem('happynewyear_images')) || [];
let fireworkVideos = JSON.parse(localStorage.getItem('happynewyear_videos')) || [];

// Render danh sách lời chúc pháo hoa
function renderFireworkWishes() {
    const list = document.getElementById('fireworkWishesList');
    if (!list) return;
    list.innerHTML = '';

    fireworkWishes.forEach((wish, idx) => {
        const div = document.createElement('div');
        div.className = 'wish-item';
        div.innerHTML = `
            <input type="text" value="${wish.replace(/"/g, '&quot;')}" data-index="${idx}" placeholder="Nhập lời chúc năm mới...">
            <button type="button" class="remove-wish-btn" onclick="removeFireworkWish(${idx})"><i class='fas fa-trash'></i></button>
        `;
        list.appendChild(div);

        const input = div.querySelector('input');
        input.addEventListener('input', function () {
            fireworkWishes[idx] = this.value;
            localStorage.setItem('happynewyear_wishes', JSON.stringify(fireworkWishes));
        });
    });
}

function addFireworkWish() {
    fireworkWishes.push("");
    localStorage.setItem('happynewyear_wishes', JSON.stringify(fireworkWishes));
    renderFireworkWishes();
    setTimeout(() => {
        const inputs = document.querySelectorAll('#fireworkWishesList input');
        if (inputs.length > 0) inputs[inputs.length - 1].focus();
    }, 100);
}

function removeFireworkWish(idx) {
    fireworkWishes.splice(idx, 1);
    localStorage.setItem('happynewyear_wishes', JSON.stringify(fireworkWishes));
    renderFireworkWishes();
}

function clearFireworkWishes() {
    if (confirm('Xóa tất cả lời chúc năm mới?')) {
        fireworkWishes = [];
        localStorage.setItem('happynewyear_wishes', JSON.stringify(fireworkWishes));
        renderFireworkWishes();
    }
}

// Render danh sách hình ảnh pháo hoa
function renderFireworkImages() {
    const list = document.getElementById('fireworkImagesList');
    if (!list) return;
    list.innerHTML = '';

    fireworkImages.forEach((img, idx) => {
        const div = document.createElement('div');
        div.className = 'wish-item';

        const isBase64 = img.startsWith('data:image');
        const previewSrc = img;

        div.innerHTML = `
            <img src="${previewSrc}" class="image-preview" onerror="this.src='https://via.placeholder.com/60?text=Error'">
            <input type="text" class="image-url-input" value="${isBase64 ? '[Ảnh đã tải lên]' : img}" ${isBase64 ? 'readonly' : ''} data-index="${idx}" placeholder="URL hình ảnh...">
            <button type="button" class="remove-wish-btn" onclick="removeFireworkImage(${idx})"><i class='fas fa-trash'></i></button>
        `;
        list.appendChild(div);

        if (!isBase64) {
            const input = div.querySelector('input');
            input.addEventListener('input', function () {
                fireworkImages[idx] = this.value;
                localStorage.setItem('happynewyear_images', JSON.stringify(fireworkImages));
                div.querySelector('.image-preview').src = this.value;
            });
        }
    });
}

function addFireworkImageUrl() {
    fireworkImages.push("");
    localStorage.setItem('happynewyear_images', JSON.stringify(fireworkImages));
    renderFireworkImages();
    setTimeout(() => {
        const inputs = document.querySelectorAll('#fireworkImagesList .image-url-input');
        if (inputs.length > 0) inputs[inputs.length - 1].focus();
    }, 100);
}

// Chuyển đổi link Google Drive/Dropbox thành link ảnh trực tiếp
function convertToDirectImageUrl(url) {
    if (!url) return url;

    // Google Drive: https://drive.google.com/file/d/FILE_ID/view... -> https://drive.google.com/uc?export=view&id=FILE_ID
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
        return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
    }

    // Google Drive uc link (đã đúng format)
    if (url.includes('drive.google.com/uc')) {
        return url;
    }

    // Dropbox: thay dl=0 thành raw=1
    if (url.includes('dropbox.com')) {
        return url.replace('dl=0', 'raw=1').replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    }

    return url;
}

function handleImageUpload(event) {
    const files = event.target.files;
    if (!files.length) return;

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
            fireworkImages.push(e.target.result);
            localStorage.setItem('happynewyear_images', JSON.stringify(fireworkImages));
            renderFireworkImages();
        };
        reader.readAsDataURL(file);
    });
    event.target.value = '';
}

function removeFireworkImage(idx) {
    fireworkImages.splice(idx, 1);
    localStorage.setItem('happynewyear_images', JSON.stringify(fireworkImages));
    renderFireworkImages();
}

function clearFireworkImages() {
    if (confirm('Xóa tất cả hình ảnh pháo hoa?')) {
        fireworkImages = [];
        localStorage.setItem('happynewyear_images', JSON.stringify(fireworkImages));
        renderFireworkImages();
    }
}

// ===== VIDEO FUNCTIONS =====

// Render danh sách video pháo hoa
function renderFireworkVideos() {
    const list = document.getElementById('fireworkVideosList');
    if (!list) return;
    list.innerHTML = '';

    fireworkVideos.forEach((videoUrl, idx) => {
        const div = document.createElement('div');
        div.className = 'wish-item';

        // Kiểm tra xem có phải link Catbox.moe không
        const isCatbox = videoUrl.includes('catbox.moe') || videoUrl.includes('files.catbox.moe');
        const warningIcon = !isCatbox && videoUrl.length > 0 ? '<i class="fas fa-exclamation-triangle" style="color: #f59e0b; margin-right: 4px;" title="Không phải link Catbox.moe"></i>' : '';

        div.innerHTML = `
            <video class="image-preview" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" ${videoUrl ? `src="${videoUrl}"` : ''} muted></video>
            ${warningIcon}
            <input type="text" class="image-url-input" value="${videoUrl}" data-index="${idx}" placeholder="https://files.catbox.moe/xxxxx.mp4">
            <button type="button" class="remove-wish-btn" onclick="removeFireworkVideo(${idx})"><i class='fas fa-trash'></i></button>
        `;
        list.appendChild(div);

        const input = div.querySelector('input');
        const video = div.querySelector('video');

        input.addEventListener('input', function () {
            fireworkVideos[idx] = this.value;
            localStorage.setItem('happynewyear_videos', JSON.stringify(fireworkVideos));
            if (this.value) {
                video.src = this.value;
            }
        });
    });
}

function addFireworkVideoUrl() {
    fireworkVideos.push("");
    localStorage.setItem('happynewyear_videos', JSON.stringify(fireworkVideos));
    renderFireworkVideos();
    setTimeout(() => {
        const inputs = document.querySelectorAll('#fireworkVideosList .image-url-input');
        if (inputs.length > 0) inputs[inputs.length - 1].focus();
    }, 100);
}

function removeFireworkVideo(idx) {
    fireworkVideos.splice(idx, 1);
    localStorage.setItem('happynewyear_videos', JSON.stringify(fireworkVideos));
    renderFireworkVideos();
}

function clearFireworkVideos() {
    if (confirm('Xóa tất cả video pháo hoa?')) {
        fireworkVideos = [];
        localStorage.setItem('happynewyear_videos', JSON.stringify(fireworkVideos));
        renderFireworkVideos();
    }
}

// LƯU PHÁO HOA LÊN FIREBASE
async function saveFireworkData() {
    // Lấy lời chúc từ input
    const wishInputs = document.querySelectorAll('#fireworkWishesList input');
    const filteredWishes = [];
    wishInputs.forEach(input => {
        const val = input.value.trim();
        if (val.length > 0 && val !== '[Ảnh đã tải lên]') filteredWishes.push(val);
    });

    // Lấy ảnh URL (không lấy base64) và chuyển đổi link Google Drive
    const filteredImages = fireworkImages
        .filter(img => {
            if (!img || img.trim().length === 0) return false;
            if (img.startsWith('data:image')) return false; // Bỏ qua base64
            return true;
        })
        .map(img => convertToDirectImageUrl(img)); // Chuyển đổi link Google Drive

    // Lấy video URL (chỉ lấy link Catbox.moe)
    const filteredVideos = fireworkVideos
        .filter(video => {
            if (!video || video.trim().length === 0) return false;
            // Chỉ chấp nhận link Catbox.moe
            return video.includes('catbox.moe') || video.includes('files.catbox.moe');
        });

    if (filteredWishes.length === 0 && filteredImages.length === 0 && filteredVideos.length === 0) {
        alert('Vui lòng thêm ít nhất 1 lời chúc, 1 URL ảnh, hoặc 1 URL video!');
        return;
    }

    const shortId = generateShortId();
    const data = {
        wishes: filteredWishes,
        images: filteredImages,
        videos: filteredVideos,
        createdAt: Date.now()
    };

    try {
        // Lưu lên Firebase
        await window.db.ref('fireworks/' + shortId).set(data);
        console.log('[Firebase] Đã lưu firework:', shortId, data);

        // Tạo link share
        const shareUrl = `${window.location.origin}${window.location.pathname.replace('/index.html', '')}/HappyNewYeah/index.html?id=${shortId}`;

        showFireworkShareResult(shareUrl, filteredWishes.length, filteredImages.length, filteredVideos.length);

    } catch (error) {
        console.error('[Firebase] Lỗi lưu firework:', error);
        alert('Lỗi khi lưu! Vui lòng thử lại.');
    }
}

function showFireworkShareResult(shareUrl, wishCount, imageCount, videoCount = 0) {
    let resultDiv = document.getElementById('firework-result');
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'firework-result';
        resultDiv.className = 'result';
        resultDiv.style.marginTop = '20px';
        document.querySelector('.firework-section').appendChild(resultDiv);
    }

    // Tạo text hiển thị số lượng
    const counts = [];
    if (wishCount > 0) counts.push(`<strong>${wishCount}</strong> lời chúc`);
    if (imageCount > 0) counts.push(`<strong>${imageCount}</strong> hình ảnh`);
    if (videoCount > 0) counts.push(`<strong>${videoCount}</strong> video`);
    const countsText = counts.join(' • ');

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3><i class="fas fa-check-circle"></i> Đã lưu lên Firebase!</h3>
        <p style="margin: 12px 0; opacity: 0.9;">
            ${countsText}
        </p>
        <div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px; margin-bottom: 12px;">
            <input type="text" id="firework-share-url" value="${shareUrl}" readonly 
                style="width: 100%; padding: 10px; border: none; border-radius: 8px; font-size: 0.85rem; background: rgba(255,255,255,0.9); color: #333;">
        </div>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button onclick="copyFireworkUrl()" style="background: #fff; color: #059669; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-weight: 600;">
                <i class="fas fa-copy"></i> Copy Link
            </button>
            <a href="${shareUrl}" target="_blank" style="background: rgba(255,255,255,0.2); color: #fff; border: 2px solid rgba(255,255,255,0.5); padding: 10px 20px; border-radius: 10px; text-decoration: none; font-weight: 600;">
                <i class="fas fa-external-link-alt"></i> Mở thử
            </a>
        </div>
    `;
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function copyFireworkUrl() {
    const input = document.getElementById('firework-share-url');
    input.select();
    navigator.clipboard.writeText(input.value).then(() => {
        alert('Đã copy link!');
    });
}

// Khởi tạo khi load trang
document.addEventListener('DOMContentLoaded', function () {
    renderFireworkWishes();
    renderFireworkImages();
    renderFireworkVideos();
});
