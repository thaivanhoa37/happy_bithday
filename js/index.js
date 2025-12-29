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
