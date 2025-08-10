const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = { x: 100, y: 300, velocity: 0, gravity: 0.5, jump: -10 };
let birdImg = new Image();
birdImg.src = 'assets/bird.png';

let score = 0;

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, 30, 30);
}

function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    requestAnimationFrame(update);
}

canvas.addEventListener('click', () => {
    bird.velocity = bird.jump;
});

birdImg.onload = () => {
    update();
};
