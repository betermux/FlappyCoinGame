// game.js
class MainScene extends Phaser.Scene {
  constructor() { super({ key: 'MainScene' }); }
  preload() {
    // replace with your actual assets
    this.load.image('ship','assets/sprites.png'); // simple ship image placeholder
    this.load.image('coin','assets/coin.png');
    this.load.image('bg','assets/bg-layer1.png');
    this.load.audio('thrust','assets/sound/thrust.wav');
    this.load.audio('coin_s','assets/sound/coin.wav');
  }
  create() {
    // background
    this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'bg').setOrigin(0).setScrollFactor(0);
    // physics world
    this.physics.world.setBounds(0, 0, 999999, this.scale.height);
    // player
    this.player = this.physics.add.sprite(100, this.scale.height/2, 'ship').setScale(0.6);
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(300);
    // input
    this.input.on('pointerdown', () => { this.player.setVelocityY(-220); this.sound.play('thrust'); });
    // coins group
    this.coins = this.physics.add.group();
    // spawn initial coins
    this.coinTimer = this.time.addEvent({ delay: 900, callback: this.spawnCoin, callbackScope: this, loop: true });
    // collisions
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    // score
    this.score = 0;
    this.updateScoreDisplay();
    // game over condition: fall below screen or collide with obstacle (not implemented here)
    this.isGameOver = false;
  }
  spawnCoin() {
    const x = this.cameras.main.scrollX + this.scale.width + 50;
    const y = Phaser.Math.Between(60, this.scale.height - 60);
    const c = this.coins.create(x, y, 'coin');
    c.setVelocityX(-150);
    c.setImmovable(true);
    c.body.allowGravity = false;
    // cleanup when off-screen
    c.checkWorldBounds = true;
    c.outOfBoundsKill = true;
  }
  collectCoin(player, coin) {
    coin.destroy();
    this.sound.play('coin_s');
    this.score += 1;
    this.updateScoreDisplay();
  }
  updateScoreDisplay() {
    const el = document.getElementById('score');
    if (el) el.textContent = 'Score: ' + this.score;
  }
  update(time, delta) {
    // simple infinite scroll effect
    this.cameras.main.scrollX += 1.6;
    // if player falls or goes off bottom => game over
    if (this.player.y > this.scale.height + 50 && !this.isGameOver) {
      this.endGame();
    }
  }
  endGame() {
    this.isGameOver = true;
    this.coinTimer.remove();
    // show simple alert or screen — then send score to bot
    setTimeout(()=> {
      // call telegram helper
      if (window.sendScoreToBot) {
        try { window.sendScoreToBot({ event: 'gameover', score: this.score }); }
        catch(e){ console.warn(e); }
      }
      alert('Game Over — score: ' + this.score);
    }, 200);
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: window.innerWidth,
  height: window.innerHeight,
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [MainScene],
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }
};

window.game = new Phaser.Game(config);