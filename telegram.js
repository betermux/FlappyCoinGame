// telegram.js
window.addEventListener('DOMContentLoaded', () => {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.expand(); // expand to full height if possible
    window.Telegram.WebApp.MainButton.hide(); // start hidden
    // expose helper for game to call on gameover
    window.sendScoreToBot = (score) => {
      try {
        // sendData sends a string to the bot (bot receives via update)
        window.Telegram.WebApp.sendData(JSON.stringify({ score: score }));
      } catch (e) {
        console.warn('Telegram sendData failed', e);
      }
    };
  } else {
    // not running inside Telegram — fallback (useful for local dev)
    window.sendScoreToBot = (score) => {
      console.log('Score (local):', score);
      alert('Score: ' + score);
    };
  }

  // optional UI bindings
  document.getElementById('btn-share').addEventListener('click', () => {
    // example: share best score via Telegram WebApp? We just call sendData for bot
    const scoreText = document.getElementById('score').textContent;
    if (window.Telegram && window.Telegram.WebApp) {
      // You can also use Telegram.WebApp.openLink(...) if needed
      window.sendScoreToBot({ action: 'share', text: scoreText });
    } else {
      alert(scoreText);
    }
  });
});