const wordsArray = 'A paragraph is defined as "a group of sentences or a single sentence that forms a unit" (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long.A paragraph is defined as "a group of sentences or a single sentence that forms a unit" (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long A paragraph is defined as "a group of sentences or a single sentence that forms a unit" (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long A paragraph is defined as "a group of sentences or a single sentence that forms a unit" (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long A paragraph is defined as "a group of sentences or a single sentence that forms a unit" (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long or a single sentence that forms a unit" (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long A paragraph is defined as "a group of sentences or a single sentence that forms a unit" (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long '.split(' ');
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
