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
    // Lưu vào localStorage đúng cấu trúc home.html
    const data = { name, age, date, title, wishes: wishesFiltered };
    console.log('Data to save:', data);
    localStorage.setItem(`birthday_${shortId}`, JSON.stringify(data));

    // Test đọc lại để đảm bảo đã lưu đúng
    const savedData = JSON.parse(localStorage.getItem(`birthday_${shortId}`));
    console.log('Saved data verification:', savedData);

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

// ===== FIREWORK MANAGEMENT =====

// Load dữ liệu pháo hoa từ localStorage
let fireworkWishes = JSON.parse(localStorage.getItem('happynewyear_wishes')) || [];
let fireworkImages = JSON.parse(localStorage.getItem('happynewyear_images')) || [];

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

        // Kiểm tra nếu là base64 hay URL
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
                // Cập nhật preview
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

function handleImageUpload(event) {
    const files = event.target.files;
    if (!files.length) return;

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
            fireworkImages.push(e.target.result); // base64
            localStorage.setItem('happynewyear_images', JSON.stringify(fireworkImages));
            renderFireworkImages();
        };
        reader.readAsDataURL(file);
    });

    // Reset input để có thể upload lại cùng file
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

function saveFireworkData() {
    // Lấy lời chúc từ input
    const wishInputs = document.querySelectorAll('#fireworkWishesList input');
    const filteredWishes = [];
    wishInputs.forEach(input => {
        const val = input.value.trim();
        if (val.length > 0) filteredWishes.push(val);
    });

    // Lấy ảnh từ input (chỉ lấy URL - không lấy base64 vì quá dài cho URL)
    const filteredImages = fireworkImages.filter(img => {
        if (!img || img.trim().length === 0) return false;
        // Bỏ qua ảnh base64 vì quá dài cho URL
        if (img.startsWith('data:image')) {
            console.warn('Ảnh upload (base64) sẽ không được share qua URL do quá dài');
            return false;
        }
        return true;
    });

    // Lưu vào localStorage (cho local preview)
    localStorage.setItem('happynewyear_wishes', JSON.stringify(filteredWishes));
    localStorage.setItem('happynewyear_images', JSON.stringify(fireworkImages));

    // Cập nhật biến local
    fireworkWishes = filteredWishes;

    // Tạo URL share được
    const shareUrl = generateFireworkShareUrl(filteredWishes, filteredImages);

    // Hiển thị kết quả với link copy được
    showShareResult(shareUrl, filteredWishes.length, filteredImages.length);
}

// Tạo URL với dữ liệu encoded
function generateFireworkShareUrl(wishes, images) {
    const data = {
        w: wishes,  // wishes
        i: images   // images (chỉ URL, không base64)
    };

    // Encode dữ liệu thành base64
    const jsonStr = JSON.stringify(data);
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));

    // Tạo URL
    const baseUrl = window.location.origin + window.location.pathname.replace('/index.html', '');
    return `${baseUrl}/HappyNewYeah/index.html?data=${encoded}`;
}

// Hiển thị kết quả với link share
function showShareResult(shareUrl, wishCount, imageCount) {
    // Tạo hoặc lấy result element
    let resultDiv = document.getElementById('firework-result');
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.id = 'firework-result';
        resultDiv.className = 'result';
        resultDiv.style.marginTop = '20px';

        const fireworkSection = document.querySelector('.firework-section');
        fireworkSection.appendChild(resultDiv);
    }

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3><i class="fas fa-check-circle"></i> Đã lưu thành công!</h3>
        <p style="margin: 12px 0; opacity: 0.9;">
            <strong>${wishCount}</strong> lời chúc • <strong>${imageCount}</strong> hình ảnh URL
        </p>
        <p style="margin-bottom: 12px; font-size: 0.9rem; opacity: 0.85;">
            ${imageCount === 0 ? '⚠️ Lưu ý: Ảnh upload sẽ không share được, chỉ URL ảnh mới share được' : ''}
        </p>
        <div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px; margin-bottom: 12px;">
            <input type="text" id="share-url-input" value="${shareUrl}" readonly 
                style="width: 100%; padding: 10px; border: none; border-radius: 8px; font-size: 0.85rem; background: rgba(255,255,255,0.9); color: #333;">
        </div>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button onclick="copyShareUrl()" style="background: #fff; color: #059669; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-copy"></i> Copy Link
            </button>
            <a href="${shareUrl}" target="_blank" style="background: rgba(255,255,255,0.2); color: #fff; border: 2px solid rgba(255,255,255,0.5); padding: 10px 20px; border-radius: 10px; text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-external-link-alt"></i> Mở thử
            </a>
        </div>
    `;

    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// Copy URL vào clipboard
function copyShareUrl() {
    const input = document.getElementById('share-url-input');
    input.select();
    input.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(input.value).then(() => {
        // Thay đổi text nút tạm thời
        const btn = event.target.closest('button');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Đã copy!';
        btn.style.background = '#10b981';
        btn.style.color = '#fff';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '#fff';
            btn.style.color = '#059669';
        }, 2000);
    }).catch(err => {
        alert('Không thể copy. Vui lòng copy thủ công.');
    });
}

// Khởi tạo khi load trang
document.addEventListener('DOMContentLoaded', function () {
    renderFireworkWishes();
    renderFireworkImages();
});

