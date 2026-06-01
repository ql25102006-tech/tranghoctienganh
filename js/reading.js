const readingForm = document.getElementById('reading-form');
const readingResult = document.getElementById('reading-result');

const readingAnswers = {
  r1: 'b',
  r2: 'c',
  r3: 'a'
};

if (readingForm) {
  readingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let score = 0;
    let total = 0;

    Object.keys(readingAnswers).forEach((name) => {
      total += 1;
      const selected = readingForm.querySelector(`input[name="${name}"]:checked`);
      if (selected && selected.value === readingAnswers[name]) {
        score += 1;
      }
    });

    const percent = Math.round((score / total) * 100);
    readingResult.className = 'result ' + (percent >= 67 ? 'good' : 'bad');
    readingResult.textContent = `Bạn đúng ${score}/${total} câu (${percent}%).`;
  });
}
