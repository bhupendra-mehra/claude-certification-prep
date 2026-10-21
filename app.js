const QUIZ_URL = "courses/claude-101/quizzes/lessons-01-05.json";

const courseTitleEl = document.getElementById("courseTitle");
const scoreDisplayEl = document.getElementById("scoreDisplay");
const progressTextEl = document.getElementById("progressText");
const lessonTextEl = document.getElementById("lessonText");
const questionBoxEl = document.getElementById("questionBox");
const optionsBoxEl = document.getElementById("optionsBox");
const feedbackBoxEl = document.getElementById("feedbackBox");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");

const OPTION_LABELS = ["A", "B", "C", "D"];

let quizData = null;
let questions = [];
let currentIndex = 0;
let score = 0;
let selectedAnswer = null;
let answered = false;

function cleanOptionText(optionText) {
  return String(optionText).replace(/^\s*[A-D]\s*[\.):-]\s*/i, "").trim();
}

function renderQuestion() {
  const question = questions[currentIndex];
  const total = questions.length;

  if (!question) {
    renderResults();
    return;
  }

  selectedAnswer = null;
  answered = false;
  nextBtn.classList.add("hidden");
  feedbackBoxEl.classList.add("hidden");
  feedbackBoxEl.innerHTML = "";
  optionsBoxEl.innerHTML = "";

  questionBoxEl.textContent = question.prompt;
  progressTextEl.textContent = `Question ${currentIndex + 1} of ${total}`;
  lessonTextEl.textContent = `Lesson ${question.lesson}`;
  scoreDisplayEl.textContent = String(score);

  question.options.forEach((option, index) => {
    const optionLabel = OPTION_LABELS[index] || "?";
    const optionText = cleanOptionText(option);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.innerHTML = `
      <span class="option-letter">${optionLabel}</span>
      <span class="option-text">${optionText}</span>
    `;

    button.addEventListener("click", () => evaluateAnswer(optionLabel));
    optionsBoxEl.appendChild(button);
  });
}

function evaluateAnswer(chosenAnswer) {
  if (answered) return;

  const question = questions[currentIndex];
  selectedAnswer = chosenAnswer;
  answered = true;

  const buttons = [...optionsBoxEl.querySelectorAll(".option-button")];
  const correctAnswer = String(question.answer || "").trim().toUpperCase();

  buttons.forEach((button) => {
    const label = button.querySelector(".option-letter")?.textContent?.trim() || "";
    button.disabled = true;

    if (label === correctAnswer) {
      button.classList.add("correct");
    }

    if (label === chosenAnswer && label !== correctAnswer) {
      button.classList.add("wrong");
    }
  });

  const isCorrect = chosenAnswer === correctAnswer;
  if (isCorrect) {
    score += 1;
  }

  scoreDisplayEl.textContent = String(score);

  feedbackBoxEl.classList.remove("hidden");
  feedbackBoxEl.innerHTML = `
    <p class="feedback-title">${isCorrect ? "Correct ✅" : "Incorrect ❌"}</p>
    <p>${question.explanation}</p>
    <p class="correct-answer">
      ${isCorrect ? "Great job." : `Correct answer: <strong>${correctAnswer}</strong>`}
    </p>
  `;

  nextBtn.textContent = currentIndex === questions.length - 1 ? "Finish quiz" : "Next question";
  nextBtn.classList.remove("hidden");
}

function renderResults() {
  const total = questions.length;
  const percentage = total ? Math.round((score / total) * 100) : 0;

  questionBoxEl.textContent = "Quiz complete!";
  optionsBoxEl.innerHTML = "";
  progressTextEl.textContent = `Final score: ${score}/${total}`;
  lessonTextEl.textContent = `${percentage}% accuracy`;
  feedbackBoxEl.classList.remove("hidden");
  feedbackBoxEl.innerHTML = `
    <p class="feedback-title">Results</p>
    <p>You scored ${score} out of ${total}.</p>
    <p>${percentage >= 80 ? "Excellent work — you are ready for more practice." : "Nice effort — review the explanations and try again for a stronger score."}</p>
  `;
  nextBtn.classList.add("hidden");
  restartBtn.classList.remove("hidden");
}

function goToNextQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex += 1;
    renderQuestion();
    return;
  }

  renderResults();
}

async function loadQuiz() {
  try {
    const response = await fetch(QUIZ_URL);
    if (!response.ok) {
      throw new Error(`Failed to load quiz: ${response.status}`);
    }

    const data = await response.json();
    quizData = data;
    questions = data.questions || [];
    courseTitleEl.textContent = `${data.course || "Claude"} - ${data.title || "Practice Quiz"}`;

    if (!questions.length) {
      questionBoxEl.textContent = "No questions found in this quiz file.";
      return;
    }

    renderQuestion();
  } catch (error) {
    questionBoxEl.textContent = "Unable to load the quiz. Please check the repository or file path.";
    console.error(error);
  }
}

nextBtn.addEventListener("click", () => {
  if (answered || currentIndex >= questions.length) {
    goToNextQuestion();
  }
});

restartBtn.addEventListener("click", () => {
  currentIndex = 0;
  score = 0;
  scoreDisplayEl.textContent = "0";
  restartBtn.classList.add("hidden");
  renderQuestion();
});

loadQuiz();
