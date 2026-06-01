const questions = [
  {
    question: 'Choose the correct sentence in Present Simple:',
    options: ['She go to school every day.', 'She goes to school every day.', 'She is go to school every day.', 'She going to school every day.'],
    answer: 1
  },
  {
    question: 'What is the meaning of "improve"?',
    options: ['Làm tệ hơn', 'Cải thiện', 'Bỏ qua', 'So sánh'],
    answer: 1
  },
  {
    question: 'Choose the correct passive voice:',
    options: ['The homework do by Tom.', 'The homework was done by Tom.', 'The homework done by Tom is.', 'The homework was do by Tom.'],
    answer: 1
  },
  {
    question: 'Which word is a synonym of "big"?',
    options: ['Tiny', 'Large', 'Weak', 'Cold'],
    answer: 1
  },
  {
    question: 'If I ____ enough time, I will join the club.',
    options: ['have', 'has', 'had', 'having'],
    answer: 0
  }
];

const quizForm = document.getElementById('quiz-form');
const quizContainer = document.getElementById('quiz-container');
const quizResult = document.getElementById('quiz-result');

function renderQuiz() {
  if (!quizContainer) return;

  quizContainer.innerHTML = questions
    .map((q, qIndex) => {
      const optionsHtml = q.options
        .map((option, oIndex) => `
          <label>
            <input type="radio" name="q${qIndex}" value="${oIndex}" required />
            ${option}
          </label>
        `)
        .join('');

      return `
        <div class="card question">
          <p>${qIndex + 1}. ${q.question}</p>
          <div class="options">${optionsHtml}</div>
        </div>
      `;
    })
    .join('');
}

function saveScore(score, total) {
  const key = 'englishSprintHistory';
  const raw = localStorage.getItem(key);
  const history = raw ? JSON.parse(raw) : [];

  history.unshift({
    date: new Date().toLocaleString('vi-VN'),
    score,
    total
  });

  const trimmed = history.slice(0, 20);
  localStorage.setItem(key, JSON.stringify(trimmed));
}

if (quizForm) {
  renderQuiz();

  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let score = 0;
    questions.forEach((q, i) => {
      const selected = quizForm.querySelector(`input[name="q${i}"]:checked`);
      if (selected && Number(selected.value) === q.answer) {
        score += 1;
      }
    });

    const total = questions.length;
    const percent = Math.round((score / total) * 100);
    saveScore(score, total);

    if (quizResult) {
      quizResult.className = 'result ' + (percent >= 60 ? 'good' : 'bad');
      quizResult.textContent = `Bạn đạt ${score}/${total} câu đúng (${percent}%). Kết quả đã được lưu ở trang Progress.`;
    }
  });
}
