const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let gameRunning = false;
let obstacles = [];
let obstacleTimer = 0;
let bird = {
  width: 50,
  height: 50,
  x: window.innerWidth / 2 - 25,
  y: window.innerHeight - 150,
  speed: 7
};

// Саад үүсгэх функц
function spawnObstacle() {
  let size = 40;
  let x = Math.random() * (canvas.width - size);
  obstacles.push({ x, y: -size, size, speed: 4 });
}

// Саад зурах
function drawObstacles() {
  ctx.fillStyle = 'red';
  obstacles.forEach(o => {
    ctx.fillRect(o.x, o.y, o.size, o.size);
  });
}

// Саад хөдөлгөх
function updateObstacles() {
  obstacles.forEach(o => {
    o.y += o.speed;
  });
  obstacles = obstacles.filter(o => o.y < canvas.height + 50);
}

// Тоглоомын үндсэн цикл
function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Шувуу зурах
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  updateObstacles();
  drawObstacles();

  requestAnimationFrame(gameLoop);
}

// Гар хөдөлгөөн
window.addEventListener('touchstart', (e) => {
  if (!gameRunning) return;
  let touchX = e.touches[0].clientX;
  if (touchX < canvas.width / 2) {
    bird.x -= bird.speed;
  } else {
    bird.x += bird.speed;
  }
  // Хязгаарлалтыг хийх
  if (bird.x < 0) bird.x = 0;
  if (bird.x + bird.width > canvas.width) bird.x = canvas.width - bird.width;
});

// Тоглоом эхлүүлэх функц
function startGame() {
  obstacles = [];
  bird.x = canvas.width / 2 - bird.width / 2;
  bird.y = canvas.height - bird.height - 50;
  gameRunning = true;
  spawnObstacle();
  obstacleTimer = 0;
  canvas.style.display = 'block';
  requestAnimationFrame(gameLoop);
  // Саад үүсгэх давтамж
  setInterval(spawnObstacle, 1500);
}