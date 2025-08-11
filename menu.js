const menuBar = document.getElementById('menuBar');
const bigBird = document.getElementById('bigBird');
const playBtn = document.getElementById('playBtn');

playBtn.addEventListener('click', () => {
  // Меню болон bird-г нуух
  menuBar.style.display = 'none';
  bigBird.style.display = 'none';
  // Тоглоом эхлүүлэх
  startGame();
});