
const quoteDisplay = document.getElementById('quote-display');
const quoteInput = document.getElementById('quote-input');
const timerEl = document.getElementById('timer');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const resultsEl = document.getElementById('results');
const restartButton = document.getElementById('restart-button');

const WORD_LIST = [
    'the','be','to','of','and','a','in','that','have','I','it','for','not','on','with',
    'he','as','you','do','at','this','but','his','by','from','they','we','say','her',
    'she','or','an','will','my','one','all','would','there','their','what','so','up',
    'out','if','about','who','get','which','go','me','when','make','can','like','time',
    'no','just','him','know','take','person','into','year','your','good','some','could',
    'them','see','other','than','then','now','look','only','come','its','over','think',
    'also','back','after','use','two','how','our','work','first','well','way','even',
    'new','want','because','any','these','give','day','most','us'
];

const NUMBER_OF_WORDS = 40;

let timer;
let timeLimit = 60;
let timeLeft = timeLimit;
let timerStarted = false;
let correctChars = 0;
let totalChars = 0;
let currentQuote = "";

function getNewQuote() {
    let words = [];
    for (let i = 0; i < NUMBER_OF_WORDS; i++) {
        words.push(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
    }

    currentQuote = words.join(" ");

    quoteDisplay.innerHTML = "";
    quoteInput.value = "";

    currentQuote.split("").forEach(char => {
        const span = document.createElement("span");
        span.innerText = char;
        quoteDisplay.appendChild(span);
    });

    quoteDisplay.querySelector("span").classList.add("active");

    resetGame();
}

function resetGame() {
    clearInterval(timer);
    timerStarted = false;
    timeLeft = timeLimit;

    timerEl.innerText = timeLeft;
    wpmEl.innerText = "0";
    accuracyEl.innerText = "0%";

    correctChars = 0;
    totalChars = 0;

    resultsEl.className = "results-hidden";
    quoteInput.disabled = false;
}

function handleInput() {
    if (!timerStarted) startTimer();

    const quoteChars = quoteDisplay.querySelectorAll("span");
    const inputChars = quoteInput.value.split("");

    totalChars = inputChars.length;
    let localCorrect = 0;

    quoteChars.forEach(span => span.classList.remove("active"));

    quoteChars.forEach((charSpan, index) => {
        const typed = inputChars[index];

        if (typed == null) {
            charSpan.classList.remove("correct", "incorrect");
        } else if (typed === charSpan.innerText) {
            charSpan.classList.add("correct");
            localCorrect++;
        } else {
            charSpan.classList.add("incorrect");
        }
    });

    correctChars = localCorrect;
    accuracyEl.innerText = totalChars > 0
        ? Math.round((correctChars / totalChars) * 100) + "%"
        : "0%";
    if (inputChars.length < quoteChars.length) {
        quoteChars[inputChars.length].classList.add("active");
    }
}

function startTimer() {
    timerStarted = true;
    timer = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft;
        if (timeLeft <= 0) endGame();
    }, 1000);
}
function endGame() {
    clearInterval(timer);
    quoteInput.disabled = true;

    const wpm = Math.round((correctChars / 5) / (timeLimit / 60));
    wpmEl.innerText = wpm;

    resultsEl.innerText = `Game Over! Your WPM: ${wpm}`;
    resultsEl.className = "results-show";
}

quoteInput.addEventListener("input", handleInput);
restartButton.addEventListener("click", getNewQuote);

getNewQuote();
