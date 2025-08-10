const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas-ын хэмжээг responsive болгох
canvas.width = Math.min(window.innerWidth, window.innerWidth >= 768 ? 600 : 400);
canvas.height = Math.min(window.innerHeight - 70, window.innerWidth >= 768 ? 800 : 600);

// Шувууны тохиргоо
let bird = { x: canvas.width * 0.25, y: canvas.height / 2, velocity: 0, gravity: 0.5, jump: -10 };
let birdImg = new Image();
birdImg.src = 'assets/bird.png';
let score = 0;

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, canvas.width * 0.075, canvas.width * 0.075);
}

function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Дэлгэцээс гарахаас сэргийлэх
    if (bird.y > canvas.height - canvas.width * 0.075) {
        bird.y = canvas.height - canvas.width * 0.075;
        bird.velocity = 0;
    }
    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    requestAnimationFrame(update);
}

// Мэдрэгчтэй болон хулганы удирдлага
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    bird.velocity = bird.jump;
});
canvas.addEventListener('click', () => {
    bird.velocity = bird.jump;
});

// Дэлгэцийн хэмжээ өөрчлөгдвөл canvas-г шинэчлэх
window.addEventListener('resize', () => {
    canvas.width = Math.min(window.innerWidth, window.innerWidth >= 768 ? 600 : 400);
    canvas.height = Math.min(window.innerHeight - 70, window.innerWidth >= 768 ? 800 : 600);
    bird.x = canvas.width * 0.25;
});

// Telegram WebApp интеграци
window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

birdImg.onload = () => {
    update();
};

// Алдаа шалгахын тулд консолд лог хэвлэх
console.log('Game initialized');