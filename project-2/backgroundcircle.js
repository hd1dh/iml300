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

let cnv = null;
let lastWindowW = 0;
let lastWindowH = 0;
let isVisible = true;

function preload() {
    loadImage("asset/f1.webp", (img) => {
        bgImg = img;
        bgImgLoaded = true;
    });
}

function setup() {
    cnv = createCanvas(windowWidth, windowHeight);

    pixelDensity(1);

    // 给 canvas 加类，便于 CSS 控制（如 .p5-bg-canvas { position:fixed; inset:0; pointer-events:none; }）
    if (cnv && cnv.elt) cnv.elt.classList.add("p5-bg-canvas");

    cnv.style("position", "fixed");
    cnv.style("inset", "0");
    cnv.style("width", "100vw");
    cnv.style("height", "100vh");
    cnv.style("z-index", "-1");
    cnv.style("pointer-events", "none");

    initGrid();

    for (let r = 0; r < rows; r++) {
        seeds[r] = [];
        for (let c = 0; c < cols; c++) seeds[r][c] = random(10000);
    }

    noStroke();

    buildCachedBg();

    if (typeof document !== "undefined") {
        document.addEventListener("visibilitychange", () => {
            isVisible = !document.hidden;
            if (document.hidden) {
                noLoop();
            } else {
                loop();
            }
        });
    }

    lastWindowW = windowWidth;
    lastWindowH = windowHeight;
}

function initGrid() {
    cellW = width / cols;
    cellH = height / rows;
}

function buildCachedBg() {
    if (!cachedBg || cachedBg.width !== width || cachedBg.height !== height) {
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
}

function draw() {
    clear();

    if (!cachedBg || cachedBg.width !== width || cachedBg.height !== height) {
        buildCachedBg();
    } else if (bgImgLoaded && !cachedBg) {
        // 保底：若图片加载后 cachedBg 仍为空，重建
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
            if (cachedBg && cachedBg.canvas) {
                ctx.drawImage(cachedBg.canvas, 0, 0);
            }
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

    if (cachedBg) {
        cachedBg.remove();
        cachedBg = null;
    }

    buildCachedBg();
    lastWindowW = windowWidth;
    lastWindowH = windowHeight;
}
