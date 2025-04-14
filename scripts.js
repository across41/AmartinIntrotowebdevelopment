/* declare constant, pull function from HTML  */
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");
const resultDiv = document.getElementById("result");

let shuffledQuestions, currentQuestionIndex, score;

/* questions with answers */
const questions = [
  {
    question: "______ are text files that websites send to your browser",
    answers: [
      { text: "Cookies", correct: true },
      { text: "Third-Party", correct: false },
      { text: "Cross-Site Scripting", correct: false },
      { text: "First-Party", correct: false },
    ],
  },
  {
    question: "What is one type of Cross site scripting?",
    answers: [
      { text: "Reflective", correct: true },
      { text: "HyperText Markup", correct: false },
      { text: "Stored", correct: true },
      { text: "Hackers", correct: false },
    ],
  },
  {
    question: "What is the best way to describe a Third-Party Cookie?",
    answers: [
      { text: "trail of candy", correct: false },
      { text: "trail of cake", correct: false },
      { text: "trail of crumbs", correct: true },
      { text: "trail of cookies", correct: false },
    ],
  },
  {
    question: "Who should weigh the risk of using cookies?",
    answers: [
      { text: "the company", correct: false },
      { text: "the computer", correct: false },
      { text: "the user", correct: true },
      { text: "anyone", correct: false },
    ],
  },
];

startQuiz();

/* start function, sorts quiz question so they are random */
function startQuiz() {
  score = 0;
  questionContainer.style.display = "flex";
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  nextButton.classList.remove("hide");
  restartButton.classList.add("hide");
  resultDiv.classList.add("hide");
  setNextQuestion();
}

/* hows each question one by one */
function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  question.answers.forEach((answer, index) => {
    const inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group");

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.id = "answer" + index;
    radio.name = "answer";
    radio.value = index;

    const label = document.createElement("label");
    label.htmlFor = "answer" + index;
    label.innerText = answer.text;

    inputGroup.appendChild(radio);
    inputGroup.appendChild(label);
    answerButtons.appendChild(inputGroup);
  });
}

function resetState() {
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}
/* next button, if user does not select one asks user to select one */
nextButton.addEventListener("click", () => {
  const answerIndex = Array.from(
    answerButtons.querySelectorAll("input")
  ).findIndex((radio) => radio.checked);
  if (answerIndex !== -1) {
    if (shuffledQuestions[currentQuestionIndex].answers[answerIndex].correct) {
      score++;
    }
    currentQuestionIndex++;
    if (shuffledQuestions.length > currentQuestionIndex) {
      setNextQuestion();
    } else {
      endQuiz();
    }
  } else {
    alert("Please select an answer.");
  }
});

restartButton.addEventListener("click", startQuiz);

/* shows final score */
function endQuiz() {
  questionContainer.style.display = "none";
  nextButton.classList.add("hide");
  restartButton.classList.remove("hide");
  resultDiv.classList.remove("hide");
  resultDiv.innerText = `Your final score: ${score} / ${shuffledQuestions.length}`;
  showQuestion;
}