const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let obstacles = [];
let gameRunning = false;

function spawnObstacle() {
  const x = Math.random() * (canvas.width - 50);
  obstacles.push({ x: x, y: -50, size: 50 });
}

function drawObstacles() {
  ctx.fillStyle = "red";
  obstacles.forEach(o => {
    ctx.fillRect(o.x, o.y, o.size, o.size);
  });
}

function updateObstacles() {
  obstacles.forEach(o => o.y += 5);
  obstacles = obstacles.filter(o => o.y < canvas.height + 50);
}

function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateObstacles();
  drawObstacles();

  requestAnimationFrame(gameLoop);
}

document.getElementById("btn3").addEventListener("click", () => {
  document.getElementById("menu").style.display = "none";
  document.getElementById("bigBird").style.display = "none";
  canvas.style.display = "block";
  gameRunning = true;

  setInterval(spawnObstacle, 1000);
  gameLoop();
});