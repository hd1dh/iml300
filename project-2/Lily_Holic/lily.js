let imgs = [];
let scales = [1, 1, 1];
let i = 0;
let t = 0;
let dur = 10;
let step = 0.12;

function preload() {
    imgs[0] = loadImage("lily/1.jpg");
    imgs[1] = loadImage("lily/2.jpg");
    imgs[2] = loadImage("lily/3.jpg");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    imageMode(CENTER);
}

function draw() {
    let a = i % 3;
    let b = (i + 1) % 3;
    let c = (i + 2) % 3;

    drawImg(a, scales[a]);
    drawImg(b, scales[b]);
    drawImg(c, scales[c]);

    t++;

    if (t % dur === 0) {
        scales[c] += step;
        i++;
    }
}

function drawImg(idx, s) {
    push();
    translate(width / 2, height / 2);
    scale(s);
    image(imgs[idx], 0, 0);
    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
