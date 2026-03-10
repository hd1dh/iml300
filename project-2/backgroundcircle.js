//
let bgImg = null;
let bgImgLoaded = false;
let cachedBg = null;

let rows = 16;
let cols = 24;
let padding = 1;
let seeds = [];
let tSpeed = 0.5;
let cellW, cellH;
let sizeMultiplier = 1.2;

function preload() {
    loadImage("f1.webp", (img) => {
        bgImg = img;
        bgImgLoaded = true;
    });
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    initGrid();
    for (let r = 0; r < rows; r++) {
        seeds[r] = [];
        for (let c = 0; c < cols; c++) seeds[r][c] = random(10000);
    }
    noStroke();
    buildCachedBg();
}

function initGrid() {
    cellW = width / cols;
    cellH = height / rows;
}

function buildCachedBg() {
    if (cachedBg) cachedBg.remove();
    cachedBg = createGraphics(width, height);
    cachedBg.pixelDensity(1);
    if (bgImgLoaded && bgImg) {
        let sx = width / bgImg.width;
        let sy = height / bgImg.height;
        let scale = max(sx, sy);
        let drawW = bgImg.width * scale;
        let drawH = bgImg.height * scale;
        let dx = (width - drawW) / 2;
        let dy = (height - drawH) / 2;
        cachedBg.clear();
        cachedBg.image(bgImg, dx, dy, drawW, drawH);
    } else {
        drawPlaceholderToGraphics(cachedBg);
    }
}

function drawPlaceholderToGraphics(g) {
    let w = g.width,
        h = g.height;
    for (let y = 0; y < h; y++) {
        let t = map(y, 0, h, 0, 1);
        g.stroke(lerpColor(color(250, 250, 250), color(210, 220, 240), t));
        g.line(0, y, w, y);
    }
    g.noStroke();
    g.fill(80);
    g.textAlign(CENTER, CENTER);
    g.textSize(min(w, h) * 0.035);
    g.text("Background image missing: please upload f1.webp", w / 2, h / 2);
}

function draw() {
    background(255);
    if (bgImgLoaded && (!cachedBg || cachedBg.width !== width || cachedBg.height !== height)) {
        buildCachedBg();
    }
    if (bgImgLoaded && cachedBg) {
        buildCachedBg();
    }

    let t = (millis() / 1000) * tSpeed;
    let ctx = drawingContext;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let cx = c * cellW + cellW / 2;
            let cy = r * cellH + cellH / 2;
            let cellHalf = min(cellW, cellH) / 2;
            let maxR = cellHalf - padding;
            let minR = max(4, maxR * 0.18);
            let n = noise(seeds[r][c], t * 0.8);
            let baseRadius = map(n, 0, 1, minR, maxR);
            let radius = min(baseRadius * sizeMultiplier, maxR);
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(cachedBg.canvas, 0, 0);
            ctx.restore();
            push();
            noFill();
            stroke(0, 30);
            strokeWeight(1);
            ellipse(cx, cy, radius * 2);
            pop();
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    initGrid();
    buildCachedBg();
}
