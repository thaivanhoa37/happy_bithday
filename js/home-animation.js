var S = {
    init: function () {
        S.Drawing.init();
        document.body.classList.add('body--ready');
        let sequence = `|#countdown 3|HAPPY BIRTHDAY|${customData.name.toUpperCase()}|${customData.date}|HAPPY ${customData.age}+`;
        customData.wishes.forEach(wish => { sequence += `|${wish}`; });
        S.UI.simulate(sequence);
        S.Drawing.loop(function () { S.Shape.render(); });
    }
};

S.Drawing = (function () {
    var canvas, context, renderFn,
        requestFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); };
    return {
        init: function (el) { canvas = document.createElement('canvas'); canvas.className = 'canvas'; document.body.appendChild(canvas); context = canvas.getContext('2d'); this.adjustCanvas(); window.addEventListener('resize', function (e) { S.Drawing.adjustCanvas(); }); },
        loop: function (fn) { renderFn = !renderFn ? fn : renderFn; this.clearFrame(); renderFn(); requestFrame.call(window, this.loop.bind(this)); },
        adjustCanvas: function () { canvas.width = window.innerWidth; canvas.height = window.innerHeight; },
        clearFrame: function () { context.clearRect(0, 0, canvas.width, canvas.height); },
        getArea: function () { return { w: canvas.width, h: canvas.height }; },
        getContext: function () { return context; },
        drawCircle: function (p, c) { context.fillStyle = c.render(); context.beginPath(); context.arc(p.x, p.y, p.z, 0, 2 * Math.PI, true); context.closePath(); context.fill(); }
    };
}());

S.UI = (function () {
    var interval, currentAction, time, maxShapeSize = 30, sequence = [], cmd = '#', isSequenceComplete = false;
    function formatTime(date) { var h = date.getHours(), m = date.getMinutes(); m = m < 10 ? '0' + m : m; return h + ':' + m; }
    function getValue(value) { return value && value.split(' ')[1]; }
    function getAction(value) { value = value && value.split(' ')[0]; return value && value[0] === cmd && value.substring(1); }
    function timedAction(fn, delay, max, reverse) {
        clearInterval(interval); currentAction = reverse ? max : 1; fn(currentAction);
        if (!max || (!reverse && currentAction < max) || (reverse && currentAction > 0)) {
            interval = setInterval(function () {
                currentAction = reverse ? currentAction - 1 : currentAction + 1; fn(currentAction);
                if ((!reverse && max && currentAction === max) || (reverse && currentAction === 0)) {
                    clearInterval(interval);
                    if (sequence.length === 0 && !isSequenceComplete) { isSequenceComplete = true; setTimeout(function () { S.Shape.scatterDots(); setTimeout(function () { startHeartAnimation(); }, 1500); }, 2000); }
                }
            }, delay);
        }
    }
    function performAction(value) {
        var action, current;
        sequence = typeof (value) === 'object' ? value : sequence.concat(value.split('|'));
        timedAction(function (index) {
            current = sequence.shift(); action = getAction(current); value = getValue(current);
            switch (action) {
                case 'countdown': value = parseInt(value) || 10; value = value > 0 ? value : 10; timedAction(function (index) { if (index === 0) { if (sequence.length === 0) { S.Shape.switchShape(S.ShapeBuilder.letter('')); } else { performAction(sequence); } } else { S.Shape.switchShape(S.ShapeBuilder.letter(index), true); } }, 2000, value, true); break;
                case 'rectangle': value = value && value.split('x'); value = (value && value.length === 2) ? value : [maxShapeSize, maxShapeSize / 2]; S.Shape.switchShape(S.ShapeBuilder.rectangle(Math.min(maxShapeSize, parseInt(value[0])), Math.min(maxShapeSize, parseInt(value[1])))); break;
                case 'circle': value = parseInt(value) || maxShapeSize; value = Math.min(value, maxShapeSize); S.Shape.switchShape(S.ShapeBuilder.circle(value)); break;
                case 'wishes': S.Shape.switchShape(S.ShapeBuilder.letter(current, true)); break;
                case 'time': var t = formatTime(new Date()); if (sequence.length > 0) { S.Shape.switchShape(S.ShapeBuilder.letter(t)); } else { timedAction(function () { t = formatTime(new Date()); if (t !== time) { time = t; S.Shape.switchShape(S.ShapeBuilder.letter(time)); } }, 1000); } break;
                default: S.Shape.switchShape(S.ShapeBuilder.letter(current[0] === cmd ? 'HacPai' : current));
            }
        }, 3500, sequence.length);
        setTimeout(function () { if (sequence.length === 0 && !isSequenceComplete) { isSequenceComplete = true; setTimeout(function () { S.Shape.scatterDots(); setTimeout(function () { startHeartAnimation(); }, 1500); }, 2000); } }, 3500 * sequence.length + 2000);
    }
    return { simulate: function (action) { performAction(action); } };
}());

function startHeartAnimation() {
    const heartCanvas = document.createElement('canvas'); heartCanvas.id = 'heartCanvas'; heartCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:5;pointer-events:none;'; document.body.appendChild(heartCanvas);
    const wishText = document.createElement('div'); wishText.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#FF1493;font-size:24px;font-weight:bold;text-align:center;z-index:6;text-shadow:2px 2px 4px rgba(0,0,0,0.8);font-family:Arial,sans-serif;max-width:300px;line-height:1.4;'; document.body.appendChild(wishText);
    const context = heartCanvas.getContext('2d'); const particles = new ParticlePool(1500); const particleRate = 750; let time;
    const wishes = customData.wishes && customData.wishes.length > 0 ? customData.wishes : ["Hãy thêm lời chúc từ trang tạo!"]; let currentWishIndex = 0;
    function updateWishText() { wishText.style.opacity = '0'; setTimeout(() => { wishText.innerHTML = wishes[currentWishIndex]; wishText.style.opacity = '1'; currentWishIndex = (currentWishIndex + 1) % wishes.length; }, 300); }
    wishText.style.transition = 'opacity 0.3s ease-in-out'; updateWishText(); setInterval(updateWishText, 3000);
    // Tính scale dựa vào kích thước màn hình (responsive)
    const screenScale = Math.min(window.innerWidth, window.innerHeight) / 500;
    const heartScale = Math.max(0.5, Math.min(1.5, screenScale)); // Giới hạn từ 0.5 đến 1.5
    function pointOnHeart(t) {
        const baseX = 200 * heartScale;
        const baseY = 160 * heartScale;
        return {
            x: baseX * Math.pow(Math.sin(t), 3),
            y: baseY * Math.cos(t) - (baseY * 0.38) * Math.cos(2 * t) - (baseY * 0.15) * Math.cos(3 * t) - (baseY * 0.08) * Math.cos(4 * t) + (baseY * 0.19)
        };
    }
    const image = createHeartImage();
    function onResize() { heartCanvas.width = window.innerWidth; heartCanvas.height = window.innerHeight; }
    function render() { requestAnimationFrame(render); const newTime = new Date().getTime() / 1000; const deltaTime = newTime - (time || newTime); time = newTime; context.clearRect(0, 0, heartCanvas.width, heartCanvas.height); const amount = particleRate * deltaTime; for (let i = 0; i < amount; i++) { const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random()); const dir = normalizePoint(pos, 80); particles.add(heartCanvas.width / 2 + pos.x, heartCanvas.height / 2 - pos.y, dir.x, -dir.y); } particles.update(deltaTime); particles.draw(context, image); }
    window.addEventListener('resize', onResize); onResize(); render();
}

function createHeartImage() { const canvas = document.createElement('canvas'); const context = canvas.getContext('2d'); canvas.width = 13; canvas.height = 13; function to(t) { const point = { x: 160 * Math.pow(Math.sin(t), 3), y: 130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25 }; point.x = 13 / 2 + point.x * 13 / 350; point.y = 13 / 2 - point.y * 13 / 350; return point; } context.beginPath(); let t = -Math.PI; let point = to(t); context.moveTo(point.x, point.y); while (t < Math.PI) { t += 0.01; point = to(t); context.lineTo(point.x, point.y); } context.closePath(); context.fillStyle = '#FF5CA4'; context.fill(); const image = new Image(); image.src = canvas.toDataURL(); return image; }
function normalizePoint(point, length) { const currentLength = Math.sqrt(point.x * point.x + point.y * point.y); return { x: (point.x / currentLength) * length, y: (point.y / currentLength) * length }; }

function Particle() { this.position = { x: 0, y: 0 }; this.velocity = { x: 0, y: 0 }; this.acceleration = { x: 0, y: 0 }; this.age = 0; }
Particle.prototype.initialize = function (x, y, dx, dy) { this.position.x = x; this.position.y = y; this.velocity.x = dx; this.velocity.y = dy; this.acceleration.x = dx * -1.3; this.acceleration.y = dy * -1.3; this.age = 0; };
Particle.prototype.update = function (deltaTime) { this.position.x += this.velocity.x * deltaTime; this.position.y += this.velocity.y * deltaTime; this.velocity.x += this.acceleration.x * deltaTime; this.velocity.y += this.acceleration.y * deltaTime; this.age += deltaTime; };
Particle.prototype.draw = function (context, image) { function ease(t) { return (--t) * t * t + 1; } const size = image.width * ease(this.age / 2); context.globalAlpha = 1 - this.age / 2; context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size); };

function ParticlePool(length) { this.particles = new Array(length); for (let i = 0; i < this.particles.length; i++) { this.particles[i] = new Particle(); } this.firstActive = 0; this.firstFree = 0; this.duration = 2; }
ParticlePool.prototype.add = function (x, y, dx, dy) { this.particles[this.firstFree].initialize(x, y, dx, dy); this.firstFree++; if (this.firstFree == this.particles.length) this.firstFree = 0; if (this.firstActive == this.firstFree) this.firstActive++; if (this.firstActive == this.particles.length) this.firstActive = 0; };
ParticlePool.prototype.update = function (deltaTime) { let i; if (this.firstActive < this.firstFree) { for (i = this.firstActive; i < this.firstFree; i++) this.particles[i].update(deltaTime); } if (this.firstFree < this.firstActive) { for (i = this.firstActive; i < this.particles.length; i++) this.particles[i].update(deltaTime); for (i = 0; i < this.firstFree; i++) this.particles[i].update(deltaTime); } while (this.particles[this.firstActive].age >= this.duration && this.firstActive != this.firstFree) { this.firstActive++; if (this.firstActive == this.particles.length) this.firstActive = 0; } };
ParticlePool.prototype.draw = function (context, image) { let i; if (this.firstActive < this.firstFree) { for (i = this.firstActive; i < this.firstFree; i++) this.particles[i].draw(context, image); } if (this.firstFree < this.firstActive) { for (i = this.firstActive; i < this.particles.length; i++) this.particles[i].draw(context, image); for (i = 0; i < this.firstFree; i++) this.particles[i].draw(context, image); } };

S.Point = function (args) { this.x = args.x; this.y = args.y; this.z = args.z; this.a = args.a; this.h = args.h; };
S.Color = function (r, g, b, a) { this.r = r; this.g = g; this.b = b; this.a = a; };
S.Color.prototype = { render: function () { return 'rgba(' + this.r + ',' + +this.g + ',' + this.b + ',' + this.a + ')'; } };
S.Dot = function (x, y) { this.p = new S.Point({ x: x, y: y, z: 8, a: 1, h: 0 }); this.e = 0.15; this.s = true; this.c = new S.Color(255, 255, 255, this.p.a); this.t = this.clone(); this.q = []; };
S.Dot.prototype = {
    clone: function () { return new S.Point({ x: this.x, y: this.y, z: this.z, a: this.a, h: this.h }); },
    _draw: function () { this.c.a = this.p.a; S.Drawing.drawCircle(this.p, this.c); },
    _moveTowards: function (n) { var details = this.distanceTo(n, true), dx = details[0], dy = details[1], d = details[2], e = this.e * d; if (this.p.h === -1) { this.p.x = n.x; this.p.y = n.y; return true; } if (d > 1) { this.p.x -= ((dx / d) * e); this.p.y -= ((dy / d) * e); } else { if (this.p.h > 0) { this.p.h--; } else { return true; } } return false; },
    _update: function () { if (this._moveTowards(this.t)) { var p = this.q.shift(); if (p) { this.t.x = p.x || this.p.x; this.t.y = p.y || this.p.y; this.t.z = p.z || this.p.z; this.t.a = p.a || this.p.a; this.p.h = p.h || 0; } else { if (this.s) { this.p.x -= Math.sin(Math.random() * 3.142); this.p.y -= Math.sin(Math.random() * 3.142); } else { this.move(new S.Point({ x: this.p.x + (Math.random() * 50) - 25, y: this.p.y + (Math.random() * 50) - 25 })); } } } d = this.p.a - this.t.a; this.p.a = Math.max(0.1, this.p.a - (d * 0.05)); d = this.p.z - this.t.z; this.p.z = Math.max(1, this.p.z - (d * 0.05)); },
    distanceTo: function (n, details) { var dx = this.p.x - n.x, dy = this.p.y - n.y, d = Math.sqrt(dx * dx + dy * dy); return details ? [dx, dy, d] : d; },
    move: function (p, avoidStatic) { if (!avoidStatic || (avoidStatic && this.distanceTo(p) > 1)) { this.q.push(p); } },
    render: function () { this._update(); this._draw(); }
};

S.ShapeBuilder = (function () {
    var gap = 8, shapeCanvas = document.createElement('canvas'), shapeContext = shapeCanvas.getContext('2d'), fontSize = 800, fontFamily = 'Arial, sans-serif';
    function fit() { shapeCanvas.width = Math.floor(window.innerWidth / gap) * gap; shapeCanvas.height = Math.floor(window.innerHeight / gap) * gap; shapeContext.fillStyle = 'red'; shapeContext.textBaseline = 'middle'; shapeContext.textAlign = 'center'; }
    function processCanvas() { var pixels = shapeContext.getImageData(0, 0, shapeCanvas.width, shapeCanvas.height).data; dots = [], x = 0, y = 0, fx = shapeCanvas.width, fy = shapeCanvas.height, w = 0, h = 0; for (var p = 0; p < pixels.length; p += (4 * gap)) { if (pixels[p + 3] > 0) { dots.push(new S.Point({ x: x, y: y })); w = x > w ? x : w; h = y > h ? y : h; fx = x < fx ? x : fx; fy = y < fy ? y : fy; } x += gap; if (x >= shapeCanvas.width) { x = 0; y += gap; p += gap * 4 * shapeCanvas.width; } } return { dots: dots, w: w + fx, h: h + fy }; }
    function setFontSize(s) { shapeContext.font = 'bold ' + s + 'px ' + fontFamily; }
    function isNumber(n) { return !isNaN(parseFloat(n)) && isFinite(n); }
    function init() { fit(); window.addEventListener('resize', fit); }
    init();
    return {
        imageFile: function (url, callback) { var image = new Image(), a = S.Drawing.getArea(); image.onload = function () { shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height); shapeContext.drawImage(this, 0, 0, a.h * 0.6, a.h * 0.6); callback(processCanvas()); }; image.onerror = function () { callback(S.ShapeBuilder.letter('What?')); }; image.src = url; },
        circle: function (d) { var r = Math.max(0, d) / 2; shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height); shapeContext.beginPath(); shapeContext.arc(r * gap, r * gap, r * gap, 0, 2 * Math.PI, false); shapeContext.fill(); shapeContext.closePath(); return processCanvas(); },
        letter: function (l, isWish = false) { var s = 0; setFontSize(fontSize); s = Math.min(fontSize, (shapeCanvas.width / shapeContext.measureText(l).width) * 0.9 * fontSize, (shapeCanvas.height / fontSize) * (isNumber(l) ? 0.7 : 0.6) * fontSize); setFontSize(s); shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height); shapeContext.fillText(l, shapeCanvas.width / 2, shapeCanvas.height / 2); return processCanvas(); },
        rectangle: function (w, h) { var dots = [], width = gap * w, height = gap * h; for (var y = 0; y < height; y += gap) { for (var x = 0; x < width; x += gap) { dots.push(new S.Point({ x: x, y: y })); } } return { dots: dots, w: width, h: height }; }
    };
}());

S.Shape = (function () {
    var dots = [], width = 0, height = 0, cx = 0, cy = 0;
    function compensate() { var a = S.Drawing.getArea(); cx = a.w / 2 - width / 2; cy = a.h / 2 - height / 2; }
    return {
        shuffleIdle: function () { var a = S.Drawing.getArea(); for (var d = 0; d < dots.length; d++) { if (!dots[d].s) { dots[d].move({ x: Math.random() * a.w, y: Math.random() * a.h }); } } },
        switchShape: function (n, fast) { var size, a = S.Drawing.getArea(); width = n.w; height = n.h; compensate(); if (n.dots.length > dots.length) { size = n.dots.length - dots.length; for (var d = 1; d <= size; d++) { dots.push(new S.Dot(a.w / 2, a.h / 2)); } } var d = 0, i = 0; while (n.dots.length > 0) { i = Math.floor(Math.random() * n.dots.length); dots[d].e = fast ? 0.3 : (dots[d].s ? 0.2 : 0.15); if (dots[d].s) { dots[d].move(new S.Point({ z: Math.random() * 20 + 10, a: Math.random(), h: 15 })); } else { dots[d].move(new S.Point({ z: Math.random() * 5 + 5, h: fast ? 15 : 25 })); } dots[d].s = true; dots[d].move(new S.Point({ x: n.dots[i].x + cx, y: n.dots[i].y + cy, a: 1, z: 5, h: 0 })); n.dots = n.dots.slice(0, i).concat(n.dots.slice(i + 1)); d++; } for (var i = d; i < dots.length; i++) { if (dots[i].s) { dots[i].move(new S.Point({ z: Math.random() * 20 + 10, a: Math.random(), h: 30 })); dots[i].s = false; dots[i].e = 0.03; dots[i].move(new S.Point({ x: Math.random() * a.w, y: Math.random() * a.h, a: 0.3, z: Math.random() * 4, h: 0 })); } } },
        render: function () { for (var d = 0; d < dots.length; d++) { dots[d].render(); } },
        scatterDots: function () { var a = S.Drawing.getArea(); for (var d = 0; d < dots.length; d++) { if (dots[d].s) { dots[d].e = 0.01; dots[d].move(new S.Point({ x: Math.random() * a.w, y: Math.random() * a.h, a: 0.1, z: Math.random() * 2 + 1, h: Math.random() * 200 + 100 })); dots[d].s = false; } } setTimeout(function () { for (var d = 0; d < dots.length; d++) { dots[d].move(new S.Point({ a: 0, z: 0, h: 50 })); } }, 3000); },
        getDots: function () { return dots; }
    };
}());

S.init();
