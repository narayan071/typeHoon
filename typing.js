const wordsArray = ` Typing is fun and helps us write quickly. The cat sat on the mat. A dog barked at the moon. She sells seashells by the seashore. He is tall, dark, and handsome. Are you ready to start? It is important to practice typing every day. The quick brown fox jumps over the lazy dog. Typing fast can be very useful. You can type emails, notes, and essays. Remember to keep your fingers on the home row. Use the shift key for capital letters. Don't forget to press the spacebar between words "Hello, how are you?" she asked. "I'm fine, thank you!" he replied. It's important to type accurately. Can you type this sentence without errors? Practice makes perfect, so keep trying. Don't rush; accuracy is key. Take your time and focus on each word. Typing games can help improve your speed. Have you played any typing games? They can be a lot of fun. The sun sets in the west. Birds fly in the sky. Water is essential for life. Plants grow in the soil. The stars twinkle at night. A paragraph is a group of sentences. This is a simple typing test. Keep practicing to improve. Accuracy is more important than speed.`.split(' ');
const wordCount = wordsArray.length;

let gametime = 30000; // 30 seconds
let gameStart = null;
let timer = null;
let animationFrameId;

const timerButtons = document.querySelectorAll('.timer-button');
timerButtons.forEach(button => {
    button.addEventListener('click', () => {
        gametime = parseInt(button.dataset.time);
        newGame();
    });
});

const gameElement = document.getElementById('game');
const wordsElement = document.getElementById('words');
const infoElement = document.getElementById('info');
const cursor = document.getElementById('cursor');
const newGameButton = document.getElementById('newGameButton');

function randomWord() {
    const randomIndex = Math.floor(Math.random() * wordCount);
    return wordsArray[randomIndex];
}

function getWPM() {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord);
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
        const correctLetters = letters.filter(letter => letter.className.includes('correct'));
        return incorrectLetters.length === 0 && correctLetters.length === letters.length;
    });
    return correctWords.length / gametime * 60000;
}

function getAccuracy() {
    const words = [...document.querySelectorAll('.word')];
    const typedWords = words.slice(0, words.indexOf(document.querySelector('.word.current')));
    
    let totalLetters = 0;
    let correctLetters = 0;

    typedWords.forEach(word => {
        const letters = [...word.children];
        letters.forEach(letter => {
            totalLetters++;
            if (letter.classList.contains('correct')) {
                correctLetters++;
            }
        });
    });

    return Math.floor((correctLetters / totalLetters) * 100);
}

function addClass(el, name) {
    el.classList.add(name);
}

function removeClass(el, name) {
    el.classList.remove(name);
}

function formatWord(word) {
    return `<div class="word"><span class="letter">${word.split('').join(`</span><span class="letter">`)}</span></div>`;
}

function newGame() {
    clearInterval(timer);
    cancelAnimationFrame(animationFrameId);
    gameStart = null;
    gameElement.classList.remove('over');
    wordsElement.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 200; i++) {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word';
        wordDiv.innerHTML = randomWord().split('').map(letter => `<span class="letter">${letter}</span>`).join('');
        fragment.appendChild(wordDiv);
    }
    wordsElement.appendChild(fragment);
    infoElement.innerHTML = (gametime / 1000) + '';
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    timer = null;
    //resetting cursor position
    const firstLetter = document.querySelector('.letter');
    cursor.style.top = firstLetter.getBoundingClientRect().top + 2 + 'px';
    cursor.style.left = firstLetter.getBoundingClientRect().left + 'px';
}

function gameOver() {
    cancelAnimationFrame(animationFrameId);
    addClass(gameElement, 'over');
    infoElement.innerHTML = `WPM: ${getWPM()}    ACCURACY: ${getAccuracy()}%`;
}

function startTimer() {
    if (!gameStart) {
        gameStart = (new Date()).getTime();
    }
    const updateTimer = () => {
        const currentTime = (new Date()).getTime();
        const milPassed = currentTime - gameStart;
        const spassed = milPassed / 1000;
        const secondsLeft = Math.ceil(gametime / 1000 - spassed);
        if (secondsLeft <= 0) {
            gameOver();
            return;
        }
        infoElement.innerHTML = secondsLeft + '';
        animationFrameId = requestAnimationFrame(updateTimer);
    };
    updateTimer();
}

function updateCursorPosition(nextLetter, nextWord) {
    if (nextLetter) {
        cursor.style.top = nextLetter.getBoundingClientRect().top + 2 + 'px';
        cursor.style.left = nextLetter.getBoundingClientRect().left + 'px';
    } else {
        cursor.style.top = nextWord.getBoundingClientRect().top + 2 + 'px';
        cursor.style.left = nextWord.getBoundingClientRect().right + 'px';
    }

    const gameRect = gameElement.getBoundingClientRect();
    const nextLetterRect = nextLetter?.getBoundingClientRect();
    const nextWordRect = nextWord?.getBoundingClientRect();

    if (nextLetterRect && (nextLetterRect.bottom > gameRect.bottom || nextLetterRect.top < gameRect.top)) {
        nextLetter.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (nextWordRect && (nextWordRect.bottom > gameRect.bottom || nextWordRect.top < gameRect.top)) {
        nextWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

gameElement.addEventListener('keydown', function(e) {
    const key = e.key;
    const currentLetter = document.querySelector('.letter.current');
    const currentWord = document.querySelector('.word.current');
    const expected = currentLetter?.innerHTML || ' ';

    const isSpace = key === ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isBackSpace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;

    if (document.querySelector('#game.over')) return;

    if (!timer && isLetter) {
        startTimer();
    }

    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, 'current');
            }
        } else {
            const incorrectLetter = document.createElement('span');
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = 'letter incorrect extra';
            currentWord.appendChild(incorrectLetter);
            addClass(incorrectLetter, 'current'); // Mark the new incorrect letter as current
        }
    }

    if (isSpace) {
        if (expected !== ' ') {
            const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
            });
        }
        removeClass(currentWord, 'current');
        addClass(currentWord.nextElementSibling, 'current');
        if (currentLetter) {
            removeClass(currentLetter, 'current');
        }
        addClass(currentWord.nextElementSibling.firstChild, 'current');
    }

    if (isBackSpace) {
        if (currentLetter && isFirstLetter) {
            removeClass(currentWord, 'current');
            addClass(currentWord.previousSibling, 'current');
            removeClass(currentLetter, 'current');
            addClass(currentWord.previousSibling.lastChild, 'current');
            removeClass(currentWord.previousSibling.lastChild, 'correct');
            removeClass(currentWord.previousSibling.lastChild, 'incorrect');
        }
        if (currentLetter && !isFirstLetter) {
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'correct');
            removeClass(currentLetter.previousSibling, 'incorrect');
        }
        if (!currentLetter) {
            addClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'incorrect');
            removeClass(currentWord.lastChild, 'correct');
        }
        if (currentLetter && currentLetter.classList.contains('extra')) {
            currentLetter.remove();
        }
    }
    updateCursorPosition(document.querySelector('.letter.current'), document.querySelector('.word.current'));
});
newGame();
newGameButton.addEventListener('click', newGame);
