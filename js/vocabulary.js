// Key lưu trữ localStorage
const STORAGE_KEY = 'englishSprintLearnedWords';

// Tải danh sách từ đã học từ localStorage
function loadLearnedWords() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

// Lưu danh sách từ đã học vào localStorage
function saveLearnedWords(words) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

// Toggle trạng thái học của một từ
function toggleLearnedState(word) {
  const learned = loadLearnedWords();
  const index = learned.indexOf(word);

  if (index > -1) {
    learned.splice(index, 1); // Bỏ đánh dấu nếu đã có
  } else {
    learned.push(word); // Thêm nếu chưa có
  }

  saveLearnedWords(learned);
  updateStats();
  return learned.includes(word);
}

// Cập nhật thống kê từ vựng đã học
function updateStats() {
  const learned = loadLearnedWords();
  const flashcards = document.querySelectorAll('.flashcard');
  const total = flashcards.length;
  const count = learned.filter(word => {
    // Chỉ đếm những từ thực sự có trên trang hiện tại
    return Array.from(flashcards).some(card => card.querySelector('h3').textContent.trim() === word);
  }).length;

  const statsEl = document.getElementById('vocab-stats');
  if (statsEl) {
    statsEl.textContent = `Tiến độ: Đã học thuộc ${count}/${total} từ (${total > 0 ? Math.round((count / total) * 100) : 0}%)`;

    // Thêm class để tạo màu sắc nếu hoàn thành
    if (count === total && total > 0) {
      statsEl.className = 'result good tight';
    } else {
      statsEl.className = 'badge';
      statsEl.style.marginTop = '0';
      statsEl.style.marginBottom = '20px';
    }
  }
}

// Khởi tạo các tương tác trên trang Vocabulary
function initVocabulary() {
  const flashcards = document.querySelectorAll('.flashcard');
  const learned = loadLearnedWords();

  // Tạo element hiển thị thống kê nếu chưa có
  const container = document.querySelector('main .container');
  const pageImage = document.querySelector('.page-hero') || document.querySelector('.page-image');

  if (container && pageImage && !document.getElementById('vocab-stats')) {
    const statsContainer = document.createElement('div');
    statsContainer.style.display = 'flex';
    statsContainer.style.justifyContent = 'flex-start';
    statsContainer.style.alignItems = 'center';

    const statsEl = document.createElement('span');
    statsEl.id = 'vocab-stats';
    statsEl.className = 'badge';
    statsEl.style.marginTop = '0';
    statsEl.style.marginBottom = '20px';

    statsContainer.appendChild(statsEl);
    // Chèn sau ảnh banner của trang
    pageImage.parentNode.insertBefore(statsContainer, pageImage.nextSibling);
  }

  flashcards.forEach(card => {
    const word = card.querySelector('h3').textContent.trim();

    // Đảm bảo card có position relative để định vị badge tuyệt đối
    card.style.position = 'relative';

    // Thêm badge "✓ Đã thuộc" vào góc trên bên phải
    const badge = document.createElement('span');
    badge.className = 'learned-badge';
    badge.textContent = '✓ Đã thuộc';
    card.appendChild(badge);

    // Tạo nút đánh dấu
    const button = document.createElement('button');
    button.className = 'btn outline learn-btn';
    button.textContent = learned.includes(word) ? 'Bỏ học thuộc' : 'Đánh dấu đã học';

    // Thêm gợi ý "Click để xem nghĩa"
    const hint = document.createElement('span');
    hint.className = 'click-hint';
    hint.textContent = '💡 Click để xem nghĩa';

    const answerDiv = card.querySelector('.answer');
    if (answerDiv) {
      // Chèn gợi ý trước phần nghĩa
      card.insertBefore(hint, answerDiv);
      // Chèn nút vào sau div answer để dễ bấm
      answerDiv.parentNode.insertBefore(button, answerDiv.nextSibling);
    } else {
      card.appendChild(hint);
      card.appendChild(button);
    }

    // Nếu từ này đã được học trước đó, thêm class 'learned'
    if (learned.includes(word)) {
      card.classList.add('learned');
    }

    // Lắng nghe sự kiện click trên nút "Đã học"
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // Ngăn sự kiện click làm lật thẻ (flashcard toggle open)

      const isNowLearned = toggleLearnedState(word);

      if (isNowLearned) {
        card.classList.add('learned');
        button.textContent = 'Bỏ học thuộc';
      } else {
        card.classList.remove('learned');
        button.textContent = 'Đánh dấu đã học';
      }
    });
  });

  // Cập nhật thống kê ban đầu
  updateStats();
}

// Mini-game Ghép Từ Vựng
function initWordMatchingGame() {
  const gameBoard = document.getElementById('game-board');
  const gameCongrats = document.getElementById('game-congrats');
  const restartBtn = document.getElementById('game-restart-btn');
  
  if (!gameBoard) return;

  const vocabData = [
    { id: 0, eng: 'Achievement', vie: 'Thành tựu' },
    { id: 1, eng: 'Deadline', vie: 'Hạn chót' },
    { id: 2, eng: 'Journey', vie: 'Hành trình' },
    { id: 3, eng: 'Improve', vie: 'Cải thiện' },
    { id: 4, eng: 'Confident', vie: 'Tự tin' },
    { id: 5, eng: 'Opportunity', vie: 'Cơ hội' }
  ];

  let selectedTiles = [];
  let matchedCount = 0;

  function startGame() {
    gameBoard.innerHTML = '';
    gameCongrats.classList.add('hidden');
    selectedTiles = [];
    matchedCount = 0;

    // Chọn ngẫu nhiên 4 cặp từ trong 6 cặp để tăng độ thú vị
    const shuffledPairs = [...vocabData].sort(() => 0.5 - Math.random());
    const selectedPairs = shuffledPairs.slice(0, 4);

    // Tạo danh sách 8 thẻ (4 tiếng Anh, 4 tiếng Việt)
    let tilesData = [];
    selectedPairs.forEach(pair => {
      tilesData.push({ id: pair.id, text: pair.eng, type: 'eng' });
      tilesData.push({ id: pair.id, text: pair.vie, type: 'vie' });
    });

    // Trộn ngẫu nhiên 8 thẻ
    tilesData.sort(() => 0.5 - Math.random());

    // Tạo HTML cho các thẻ
    tilesData.forEach(data => {
      const tile = document.createElement('div');
      tile.className = 'game-tile';
      tile.textContent = data.text;
      tile.dataset.id = data.id;
      tile.dataset.type = data.type;
      
      tile.addEventListener('click', () => handleTileClick(tile));
      gameBoard.appendChild(tile);
    });
  }

  function handleTileClick(tile) {
    // Không làm gì nếu thẻ đã chọn hoặc đã khớp
    if (tile.classList.contains('selected') || tile.classList.contains('matched') || selectedTiles.length >= 2) {
      return;
    }

    // Chọn thẻ
    tile.classList.add('selected');
    selectedTiles.push(tile);

    // Nếu chọn đủ 2 thẻ
    if (selectedTiles.length === 2) {
      const tile1 = selectedTiles[0];
      const tile2 = selectedTiles[1];

      const isMatch = (tile1.dataset.id === tile2.dataset.id) && (tile1.dataset.type !== tile2.dataset.type);

      if (isMatch) {
        // Đúng: chuyển sang trạng thái đã khớp
        setTimeout(() => {
          tile1.classList.remove('selected');
          tile2.classList.remove('selected');
          tile1.classList.add('matched');
          tile2.classList.add('matched');
          selectedTiles = [];
          matchedCount++;

          if (matchedCount === 4) {
            gameCongrats.classList.remove('hidden');
          }
        }, 300);
      } else {
        // Sai: rung đỏ cảnh báo
        setTimeout(() => {
          tile1.classList.add('incorrect');
          tile2.classList.add('incorrect');
        }, 150);

        setTimeout(() => {
          tile1.classList.remove('selected', 'incorrect');
          tile2.classList.remove('selected', 'incorrect');
          selectedTiles = [];
        }, 700);
      }
    }
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', startGame);
  }

  startGame();
}

// Chạy khởi tạo khi tài liệu được tải xong
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.flashcard')) {
    initVocabulary();
    initWordMatchingGame();
  }
});
