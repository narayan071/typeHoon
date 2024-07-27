const words = 'A paragraph is defined as “a group of sentences or a single sentence that forms a unit” (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long.A paragraph is defined as “a group of sentences or a single sentence that forms a unit” (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long A paragraph is defined as “a group of sentences or a single sentence that forms a unit” (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long A paragraph is defined as “a group of sentences or a single sentence that forms a unit” (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long A paragraph is defined as “a group of sentences or a single sentence that forms a unit” (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long or a single sentence that forms a unit” (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long A paragraph is defined as “a group of sentences or a single sentence that forms a unit” (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long '.split(' ');
const wordCount = words.length;
function randomWord(){
    const randomIndex = Math.ceil(Math.random()*wordCount);
    return words[randomIndex-1];
}

function addClass(el, name){
    el.className += ' '+name;

}
function removeClass(el, name){
    el.className = el.className.replace(name, '');
}

function formatWord(word) {
    return `<div class="word"><span class="letter">${word.split('').join(`</span><span class="letter">`)}</span></div>`;
}

function newGame(){
    document.getElementById('words').innerHTML='';
    for(let i = 0; i<200; i++){
        document.getElementById('words').innerHTML += formatWord(randomWord());
    }
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
}

document.getElementById('game').addEventListener('keyup', function(e){
    const key = e.key;
    const currentLetter = document.querySelector('.letter.current');
    const currentWord = document.querySelector('.word.current');
    const expected = currentLetter ?.innerHTML || ' ';
    console.log({key, expected})

    const isSpace = key === ' ';
    const isLetter = key.length === 1 && key !== ' ';
    if(isLetter){
        if(currentLetter){
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');
            if(currentLetter.nextSibling){
                addClass(currentLetter.nextSibling, 'current');
            }
        }
    }

    if(isSpace){
        if(expected !== ' '){
            const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
            })
        }
        removeClass(currentWord, 'current');
        addClass(currentWord.nextElementSibling, 'current');
        if(currentLetter){
            removeClass(currentLetter, 'current');
        }
        addClass(currentWord.nextElementSibling.firstChild, 'current');
    }

})

