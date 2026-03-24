let s = 40;

function setup() {
    createCanvas(windowWidth, windowHeight);
    stroke("#3cab45");
    noFill();
}

function draw() {
    background(255);

    for (let y = 0; y <= height; y += s) {
        beginShape();
        for (let x = 0; x <= width; x += s) {
            let p = warp(x, y);
            vertex(p.x, p.y);
        }
        endShape();
    }

    for (let x = 0; x <= width; x += s) {
        beginShape();
        for (let y = 0; y <= height; y += s) {
            let p = warp(x, y);
            vertex(p.x, p.y);
        }
        endShape();
    }
}

function warp(x, y) {
    let dx = x - mouseX;
    let dy = y - mouseY;
    let d = sqrt(dx * dx + dy * dy);

    let r = 320;
    let k = max(0, 1 - d / r);
    k = k * k * (3 - 2 * k);

    let a = atan2(dy, dx);
    let n = noise(x * 0.008, y * 0.008, frameCount * 0.008) - 0.5;

    let swirl = k * 42;
    let bend = k * 22 + n * 6;

    return {
        x: x + cos(a + HALF_PI) * swirl + cos(a) * bend,
        y: y + sin(a + HALF_PI) * swirl + sin(a) * bend
    };
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
