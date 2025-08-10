// Canvas болон контекстийг тодорхойлох
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas-ын хэмжээг дэлгэцэд тохируулах
canvas.width = Math.min(window.innerWidth, 400);
canvas.height = Math.min(window.innerHeight, 600);

// Шувууны тохиргоо
let bird = { x: 100, y: canvas.height / 2, velocity: 0, gravity: 0.5, jump: -10 };
let birdImg = new Image();
birdImg.src = 'assets/bird.png';
let score = 0;

// Шувууг зурах
function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, 30, 30);
}

// Тоглоомын шинэчлэл
function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Дэлгэцээс гарахаас сэргийлэх
    if (bird.y > canvas.height - 30) bird.y = canvas.height - 30, bird.velocity = 0;
    if (bird.y < 0) bird.y = 0, bird.velocity = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    requestAnimationFrame(update);
}

// Мэдрэгчтэй удирдлага
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Дэлгэц гүйлгэхээс сэргийлнэ
    bird.velocity = bird.jump; // Дээш үсрэх
});

// Telegram WebApp интеграци
window.Telegram.WebApp.ready(); // Telegram WebApp бэлэн боллоо
window.Telegram.WebApp.expand(); // Бүтэн дэлгэцээр нээх

birdImg.onload = () => {
    update();
};