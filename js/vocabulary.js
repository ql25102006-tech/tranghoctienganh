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
  const pageImage = document.querySelector('.page-image');

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

// Chạy khởi tạo khi tài liệu được tải xong
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.flashcard')) {
    initVocabulary();
  }
});
