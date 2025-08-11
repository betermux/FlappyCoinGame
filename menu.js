/* menu.js
   Меню болон UI логик: Play товч, Skins drawer, skin сонгох, Shop/Upgrade/Leaderboard товчны stub.
*/

(() => {
  const playBtn = document.getElementById('playBtn');
  const shopBtn = document.getElementById('shopBtn');
  const skinsBtn = document.getElementById('skinsBtn');
  const upgradeBtn = document.getElementById('upgradeBtn');
  const leaderBtn = document.getElementById('leaderBtn');

  const skinsPanel = document.getElementById('skinsPanel');
  const skinsList = document.getElementById('skinsList');
  const closeSkins = document.getElementById('closeSkins');

  const overlay = document.getElementById('overlay');

  // available skins (can point to files in assets/)
  const SKINS = [
    { id: 'default', name: 'Default', src: 'assets/bird.png' },
    { id: 'red', name: 'Red', src: 'assets/skin_red.png' },
    { id: 'gold', name: 'Gold', src: 'assets/skin_gold.png' },
    { id: 'robot', name: 'Robot', src: 'assets/skin_robot.png' },
    { id: 'space', name: 'Space', src: 'assets/skin_space.png' }
  ];

  // restore selected skin from localStorage
  const selectedSkinId = localStorage.getItem('selectedSkin') || SKINS[0].id;

  // fill skins list
  function populateSkins() {
    skinsList.innerHTML = '';
    SKINS.forEach(s => {
      const item = document.createElement('div');
      item.className = 'skinItem';
      if (s.id === selectedSkinId) item.classList.add('selected');

      const img = document.createElement('img');
      img.alt = s.name;
      img.src = s.src;
      img.onerror = () => {
        // fallback: draw a colored circle if asset missing
        img.src = createPlaceholderSkin(s.name);
      };

      item.appendChild(img);
      item.addEventListener('click', () => {
        document.querySelectorAll('.skinItem').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        localStorage.setItem('selectedSkin', s.id);
        GameAPI.setSkin(s.src);
      });

      skinsList.appendChild(item);
    });
  }

  function createPlaceholderSkin(name) {
    // small generated data-uri placeholder so missing assets don't break UI
    const c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    const g = c.getContext('2d');
    g.fillStyle = '#f4a261';
    g.fillRect(0,0,128,128);
    g.fillStyle = '#fff';
    g.font = 'bold 36px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(name[0] || 'S', 64,64);
    return c.toDataURL();
  }

  // menu button actions
  playBtn.addEventListener('click', () => {
    // start or resume game
    GameAPI.start();
  });
  shopBtn.addEventListener('click', () => {
    alert('Shop feature not implemented — use this place to buy skins or upgrades.');
  });
  skinsBtn.addEventListener('click', () => {
    skinsPanel.classList.toggle('hidden');
    populateSkins();
  });
  upgradeBtn.addEventListener('click', () => {
    alert('Upgrade screen — stub. Implement power-ups here.');
  });
  leaderBtn.addEventListener('click', () => {
    alert('Leaderboard — stub. Could integrate with your backend or Telegram WebApp data.');
  });
  closeSkins.addEventListener('click', () => skinsPanel.classList.add('hidden'));

  // overlay pause when tapping overlay (optional)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      // if overlay visible, resume
      if (overlay.classList.contains('hidden')) return;
      GameAPI.resume();
    }
  });

  // set initial skin to saved
  const sel = SKINS.find(s => s.id === selectedSkinId) || SKINS[0];
  GameAPI.setSkin(sel.src);

  // small helper: detect if we're inside Telegram WebApp and set theme if available
  if (window.Telegram && window.Telegram.WebApp) {
    try {
      const tg = window.Telegram.WebApp;
      // example: use Telegram theme params (if present)
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        // you could pull user name or id here
      }
      // optional: set background color based on theme
      const bg = tg.themeParams?.bg_color;
      if (bg) document.body.style.background = bg;
    } catch (e) {}
  }

})();