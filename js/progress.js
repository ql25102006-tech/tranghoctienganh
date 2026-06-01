const historyList = document.getElementById('history-list');
const attemptsEl = document.getElementById('attempts');
const bestScoreEl = document.getElementById('best-score');
const averageScoreEl = document.getElementById('average-score');
const clearBtn = document.getElementById('clear-progress');

function loadHistory() {
  const raw = localStorage.getItem('englishSprintHistory');
  return raw ? JSON.parse(raw) : [];
}

function renderProgress() {
  const history = loadHistory();

  attemptsEl.textContent = history.length;

  if (history.length === 0) {
    bestScoreEl.textContent = '0%';
    averageScoreEl.textContent = '0%';
    historyList.innerHTML = '<li class="card">Chưa có dữ liệu. Hãy làm Quiz để lưu kết quả.</li>';
    return;
  }

  const percentages = history.map((item) => Math.round((item.score / item.total) * 100));
  const best = Math.max(...percentages);
  const average = Math.round(percentages.reduce((sum, p) => sum + p, 0) / percentages.length);

  bestScoreEl.textContent = `${best}%`;
  averageScoreEl.textContent = `${average}%`;

  historyList.innerHTML = history
    .map((item, index) => {
      const percent = Math.round((item.score / item.total) * 100);
      return `
        <li class="history-item">
          <span>Lần ${index + 1}: ${item.score}/${item.total} (${percent}%)</span>
          <span>${item.date}</span>
        </li>
      `;
    })
    .join('');
}

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    localStorage.removeItem('englishSprintHistory');
    renderProgress();
  });
}

renderProgress();
