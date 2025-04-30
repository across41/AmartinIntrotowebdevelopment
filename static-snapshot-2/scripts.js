/* declare constant, pull function from HTML  */
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");
const resultDiv = document.getElementById("result");

let shuffledQuestions, currentQuestionIndex, score;
let userAnswers = [];

/* questions with answers */
const questions = [
  {
    type: "single",
    question: "______ are text files that websites send to your browser",
    answers: [
      { text: "Cookies", correct: true },
      { text: "Third-Party", correct: false },
      { text: "Cross-Site Scripting", correct: false },
      { text: "First-Party", correct: false },
    ],
  },
  {
    type: "multi",
    question: "Which are types of Cross-site scripting (XSS)?",
    answers: [
      { text: "Reflective", correct: true },
      { text: "HyperText Markup", correct: false },
      { text: "Stored", correct: true },
      { text: "Hackers", correct: false },
    ],
  },
  {
    type: "single",
    question: "What is the best way to describe a Third-Party Cookie?",
    answers: [
      { text: "trail of candy", correct: false },
      { text: "trail of cake", correct: false },
      { text: "trail of crumbs", correct: true },
      { text: "trail of cookies", correct: false },
    ],
  },
  {
    type: "single",
    question: "Who should weigh the risk of using cookies?",
    answers: [
      { text: "the company", correct: false },
      { text: "the computer", correct: false },
      { text: "the user", correct: true },
      { text: "anyone", correct: false },
    ],
  },
  {
    type: "text",
    question: "Fill in the blank: The acronym for Cross-Site Scripting is ______",
    correctAnswer: "XSS",
  },
];
/* start function, sorts quiz question so they are random */
startQuiz();

function startQuiz() {
  score = 0;
  userAnswers = [];
  questionContainer.style.display = "flex";
  shuffledQuestions = questions; 
  currentQuestionIndex = 0;
  nextButton.classList.remove("hide");
  restartButton.classList.add("hide");
  resultDiv.classList.add("hide");
  setNextQuestion();
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}
/* shows next question */
function showQuestion(question) {
  questionElement.innerText = question.question;
  if (question.type === "single") {
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
  } else if (question.type === "multi") {
    question.answers.forEach((answer, index) => {
      const inputGroup = document.createElement("div");
      inputGroup.classList.add("input-group");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "answer" + index;
      checkbox.name = "answer";
      checkbox.value = index;

      const label = document.createElement("label");
      label.htmlFor = "answer" + index;
      label.innerText = answer.text;

      inputGroup.appendChild(checkbox);
      inputGroup.appendChild(label);
      answerButtons.appendChild(inputGroup);
    });
  } else if (question.type === "text") {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "text-answer";
    input.placeholder = "Your answer";
    answerButtons.appendChild(input);
  }
}
/* reset answers */
function resetState() {
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

nextButton.addEventListener("click", () => {
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  let isCorrect = false;
  let userInput = "";

  if (currentQuestion.type === "single") {
    const selected = answerButtons.querySelector("input[type=radio]:checked");
    if (!selected) {
      alert("Please select an answer.");
      return;
    }
    const answerIndex = parseInt(selected.value);
    isCorrect = currentQuestion.answers[answerIndex].correct;
    userInput = currentQuestion.answers[answerIndex].text;
  }

  else if (currentQuestion.type === "multi") {
    const checkboxes = answerButtons.querySelectorAll("input[type=checkbox]");
    const selectedIndexes = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => parseInt(cb.value));
    const correctIndexes = currentQuestion.answers
      .map((a, i) => a.correct ? i : -1)
      .filter(i => i !== -1);

    isCorrect = selectedIndexes.length === correctIndexes.length &&
                selectedIndexes.every(i => correctIndexes.includes(i));
    userInput = selectedIndexes.map(i => currentQuestion.answers[i].text).join(", ");
  }
/* if answer is not input */
  else if (currentQuestion.type === "text") {
    const textInput = document.getElementById("text-answer");
    if (!textInput.value.trim()) {
      alert("Please enter an answer.");
      return;
    }
    userInput = textInput.value.trim();
    isCorrect = userInput.toUpperCase() === currentQuestion.correctAnswer.toUpperCase();
  }

  if (isCorrect) {
    score++;
  }

  userAnswers.push({
    question: currentQuestion.question,
    userInput,
    isCorrect,
    correctAnswer: currentQuestion.type === "text"
      ? currentQuestion.correctAnswer
      : currentQuestion.answers
          .filter(a => a.correct)
          .map(a => a.text)
          .join(", "),
  });

  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length) {
    setNextQuestion();
  } else {
    endQuiz();
  }
});

restartButton.addEventListener("click", startQuiz);
/* ends quiz */
function endQuiz() {
  questionContainer.style.display = "none";
  nextButton.classList.add("hide");
  restartButton.classList.remove("hide");
  resultDiv.classList.remove("hide");

  const percentage = (score / shuffledQuestions.length) * 100;
  const pass = percentage >= 60;

  let resultHTML = `
    <h3>Quiz Complete!</h3>
    <p>Your final score: ${score} / ${shuffledQuestions.length} (${percentage.toFixed(0)}%)</p>
    <p>RESULT: <strong>${pass ? "PASS" : "FAIL"}</strong></p>
    <h4>Answers:</h4>
    <ul>
  `;

  userAnswers.forEach((ans, i) => {
    resultHTML += `
      <li>
        <strong>Q${i + 1}:</strong> ${ans.question}<br>
        <strong>Your Answer:</strong> ${ans.userInput}<br>
        <strong>Correct Answer:</strong> ${ans.correctAnswer}<br>
        <strong>Result:</strong> ${ans.isCorrect ? "Correct" : "Incorrect"}
      </li><br>
    `;
  });

  resultHTML += `</ul>`;
  resultDiv.innerHTML = resultHTML;
}