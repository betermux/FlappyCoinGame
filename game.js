const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.85;

let bird = { x: canvas.width / 2 - 25, y: canvas.height / 2, width: 50, height: 50, speed: 5 };
let obstacles = [];
let isPlaying = false;
let score = 0;

// Bird image
const birdImg = new Image();
birdImg.src = "https://upload.wikimedia.org/wikipedia/commons/7/7a/Bird_silhouette.svg";

// Play button
document.getElementById("playBtn").addEventListener("click", () => {
  startGame();
});

function startGame() {
  obstacles = [];
  score = 0;
  bird.y = canvas.height / 2;
  isPlaying = true;
  requestAnimationFrame(gameLoop);
}

function spawnObstacle() {
  const width = 50;
  const height = 50;
  const x = Math.random() * (canvas.width - width);
  obstacles.push({ x: x, y: -height, width: width, height: height, speed: 3 });
}

function update() {
  if (!isPlaying) return;

  // Move obstacles
  obstacles.forEach((ob) => {
    ob.y += ob.speed;
  });

  // Remove passed obstacles
  obstacles = obstacles.filter(ob => ob.y < canvas.height);

  // Spawn new obstacle
  if (Math.random() < 0.02) {
    spawnObstacle();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  // Obstacles
  ctx.fillStyle = "red";
  obstacles.forEach(ob => {
    ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
  });

  // Score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function gameLoop() {
  if (!isPlaying) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Touch controls
canvas.addEventListener("touchstart", (e) => {
  const touchX = e.touches[0].clientX;
  if (touchX < canvas.width / 2) {
    bird.x -= bird.speed * 3; // left
  } else {
    bird.x += bird.speed * 3; // right
  }
});