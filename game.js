/* game.js
   Гол тоглоомын логик: canvas-д шувуу, саад, scoring, collision.
   Тоглоомийн физик: gravity, lift (press -> up).
   Саадууд canvas-ийн баруун талд үүсээд зүүн тийш урсана (шууд өмнө рүү биш).
*/

(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d', { alpha: false });

  // internal resolution for consistent physics (use canvas.width/height as set in HTML attributes)
  const W = canvas.width;
  const H = canvas.height;

  // scaling to CSS size
  function cssScale() {
    const rect = canvas.getBoundingClientRect();
    return { sx: W / rect.width, sy: H / rect.height };
  }

  // Game state
  let running = false;
  let lastTime = 0;
  let elapsed = 0;
  let score = 0;
  let best = Number(localStorage.getItem('best') || 0);
  document.getElementById('bestValue').textContent = best;

  // Player
  const player = {
    x: W * 0.5,
    y: H * 0.65,
    vy: 0,
    radius: 36,
    lift: -12,      // upward impulse when pressing
    gravity: 0.55,  // pull down
    maxVy: 18,
    skinSrc: 'assets/bird.png', // default (menu.js can change)
    draw: function (ctx) {
      // draw a circle and image
      ctx.save();
      ctx.translate(this.x, this.y);

      // tilt slightly by velocity
      const tilt = Math.max(-0.5, Math.min(0.9, -this.vy / 30));
      ctx.rotate(tilt);

      // body
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      // image
      if (playerImage.complete) {
        ctx.drawImage(playerImage, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
      }
      ctx.restore();
    }
  };

  // load player image
  const playerImage = new Image();
  playerImage.src = player.skinSrc;

  // Obstacles (vertical columns with a gap, move left)
  const obstacles = [];
  const OB_SPEED_BASE = 4;
  let obSpeed = OB_SPEED_BASE;
  const SPAWN_INTERVAL = 1400; // ms
  let spawnTimer = 0;

  // spawn function
  function spawnObstacle() {
    const gap = 220; // px
    const minY = 160;
    const maxY = H - minY - gap;
    const gapY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

    const width = 90;
    const ob = {
      x: W + width,
      y: 0,
      width,
      gapY,
      gap,
      passed: false
    };
    obstacles.push(ob);
  }

  // Input
  let pressing = false;
  function onPointerDown(e) {
    pressing = true;
    player.vy = Math.max(player.vy + player.lift, -player.maxVy);
  }
  function onPointerUp(e) {
    pressing = false;
  }

  // Keyboard
  function onKeyDown(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      onPointerDown();
    }
    if (e.code === 'KeyP') togglePause();
  }
  function onKeyUp(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      onPointerUp();
    }
  }

  // Collision detection (circle vs rect)
  function circleRectCollide(cx, cy, r, rx, ry, rw, rh) {
    const closestX = Math.max(rx, Math.min(cx, rx + rw));
    const closestY = Math.max(ry, Math.min(cy, ry + rh));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return (dx * dx + dy * dy) < (r * r);
  }

  // Game loop
  function update(dt) {
    // physics
    if (pressing) {
      // subtle continuous lift while holding (so user can hold for steady rise)
      player.vy += player.lift * 0.015;
    }
    player.vy += player.gravity;
    player.vy = Math.max(-player.maxVy, Math.min(30, player.vy));
    player.y += player.vy;

    // clamp to screen
    if (player.y > H - player.radius) {
      player.y = H - player.radius;
      player.vy = 0;
      gameOver();
    }
    if (player.y < player.radius) {
      player.y = player.radius;
      player.vy = 0;
    }

    // obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const ob = obstacles[i];
      ob.x -= obSpeed;

      // scoring: when passed center
      if (!ob.passed && ob.x + ob.width < player.x) {
        ob.passed = true;
        score += 1;
        document.getElementById('scoreValue').textContent = score;
        if (score > best) {
          best = score;
          document.getElementById('bestValue').textContent = best;
          localStorage.setItem('best', best);
        }
        // slightly increase speed occasionally
        if (score % 5 === 0) obSpeed += 0.4;
      }

      // collision: top rect and bottom rect
      const topRect = { x: ob.x, y: 0, w: ob.width, h: ob.gapY };
      const bottomRect = { x: ob.x, y: ob.gapY + ob.gap, w: ob.width, h: H - (ob.gapY + ob.gap) };
      if (circleRectCollide(player.x, player.y, player.radius - 4, topRect.x, topRect.y, topRect.w, topRect.h) ||
          circleRectCollide(player.x, player.y, player.radius - 4, bottomRect.x, bottomRect.y, bottomRect.w, bottomRect.h)) {
        gameOver();
      }

      // remove offscreen
      if (ob.x + ob.width < -50) obstacles.splice(i, 1);
    }

    // spawn timer
    spawnTimer += dt;
    if (spawnTimer > SPAWN_INTERVAL) {
      spawnTimer = 0;
      spawnObstacle();
    }
  }

  function draw() {
    // background
    ctx.clearRect(0, 0, W, H);

    // simple clouds/background decoration
    drawBackground();

    // draw obstacles
    obstacles.forEach(ob => {
      // top
      ctx.fillStyle = '#2b5f3a';
      ctx.fillRect(ob.x, 0, ob.width, ob.gapY);

      // bottom
      ctx.fillRect(ob.x, ob.gapY + ob.gap, ob.width, H - (ob.gapY + ob.gap));
    });

    // draw player
    player.draw(ctx);
  }

  function drawBackground() {
    // sky gradient already set by CSS, but in canvas we'll add simple hills
    // small parallax ground
    ctx.fillStyle = '#1f6f3f';
    ctx.fillRect(0, H - 120, W, 120);
    // coin-like decorations (optional)
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc((i * 200 + (Date.now() / 60) % 200) % W, H - 80 + Math.sin((i + Date.now()/500)%10)*8, 8, 0, Math.PI*2);
      ctx.fillStyle = '#ffd166';
      ctx.fill();
    }
  }

  function gameOver() {
    if (!running) return;
    running = false;
    showOverlay('Game Over');
  }

  function showOverlay(title) {
    document.getElementById('overlay').classList.remove('hidden');
    document.getElementById('overlayTitle').textContent = title;
  }
  function hideOverlay() {
    document.getElementById('overlay').classList.add('hidden');
  }

  function tick(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    if (running) {
      update(dt);
      draw();
    } else {
      // draw a paused/frozen frame so that the user sees the state
      draw();
    }

    requestAnimationFrame(tick);
  }

  // controls for start/stop from menu.js
  window.GameAPI = {
    start: function () {
      obstacles.length = 0;
      player.y = H * 0.65;
      player.vy = 0;
      score = 0;
      obSpeed = OB_SPEED_BASE;
      spawnTimer = 0;
      document.getElementById('scoreValue').textContent = score;
      running = true;
      hideOverlay();
      lastTime = 0;
    },
    pause: function () {
      running = false;
      showOverlay('Paused');
    },
    resume: function () {
      running = true;
      hideOverlay();
    },
    restart: function () {
      this.start();
    },
    setSkin: function (src) {
      player.skinSrc = src;
      playerImage.src = src;
      // update preview image
      const preview = document.getElementById('playerImg');
      if (preview) preview.src = src;
    }
  };

  // attach input events (pointer & keyboard)
  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  // overlay buttons
  document.getElementById('resumeBtn').addEventListener('click', () => { if(!running) GameAPI.resume();});
  document.getElementById('restartBtn').addEventListener('click', () => GameAPI.restart());

  // start animation loop
  requestAnimationFrame(tick);

  // expose debug for console
  window.__game = { player, obstacles };
})();