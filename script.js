const cardImages = [
    './assets/cherry.svg',
    './assets/banana.svg',
    './assets/eggplant.svg',
    './assets/lime.svg',
    './assets/peach.svg',
    './assets/popcorn.svg',
    './assets/strawberry.svg',
    './assets/watermelon.svg',
];

const cards = [...cardImages, ...cardImages];

function shuffle(array) {
    const shuffledArray = [...array];

    for (let i = shuffledArray.length - 1; i > 0; i -= 1) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [shuffledArray[i], shuffledArray[randomIndex]] = [
            shuffledArray[randomIndex],
            shuffledArray[i],
        ];
    }

    return shuffledArray;
}

const app = document.createElement('div');
app.classList.add('app');

const header = document.createElement('header');
header.classList.add('header');

const title = document.createElement('h1');
title.textContent = 'Memory Game';

const newGameButton = document.createElement('button');
newGameButton.type = 'button';
newGameButton.textContent = 'New Game';

const leaderboardButton = document.createElement('button');
leaderboardButton.type = 'button';
leaderboardButton.textContent = 'Leaderboard';

header.append(title, newGameButton, leaderboardButton);

const main = document.createElement('main');
main.classList.add('main');

const counters = document.createElement('div');
counters.classList.add('counters');

const movesCounter = document.createElement('p');
movesCounter.textContent = 'Moves: 0';

const pairsCounter = document.createElement('p');
pairsCounter.textContent = 'Pairs: 0 / 8';

counters.append(movesCounter, pairsCounter);

const gameBoard = document.createElement('div');
gameBoard.classList.add('game-board');

main.append(counters, gameBoard);

app.append(header, main);
document.body.append(app);

function createCards() {
    const shuffledCards = shuffle(cards);

    shuffledCards.forEach((image) => {
        const card = document.createElement('button');

        card.type = 'button';
        card.classList.add('card');
        card.dataset.image = image;

        const cardBack = document.createElement('span');
        cardBack.classList.add('card-back');
        cardBack.textContent = '?';

        const cardContent = document.createElement('span');
        cardContent.classList.add('card-content');

        const imageElement = document.createElement('img');
        imageElement.src = image;
        imageElement.alt = 'Card image';

        cardContent.append(imageElement);
        card.append(cardBack, cardContent);
        gameBoard.append(card);
    });
}

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;

function updateCounters() {
    movesCounter.textContent = `Moves: ${moves}`;
    pairsCounter.textContent = `Pairs: ${matchedPairs} / 8`;
}

function resetCards() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function handleCardClick(event) {
    const card = event.target.closest('.card');

    if (!card) {
        return;
    }

    if (
        lockBoard
        || card.classList.contains('open')
        || card.classList.contains('matched')
    ) {
        return;
    }

    card.classList.add('open');

    if (firstCard === null) {
        firstCard = card;
        return;
    }

    secondCard = card;
    moves += 1;
    updateCounters();
    lockBoard = true;

    if (firstCard.dataset.image === secondCard.dataset.image) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        matchedPairs += 1;
        updateCounters();

        resetCards();
        return;
    }

    setTimeout(() => {
        firstCard.classList.remove('open');
        secondCard.classList.remove('open');

        resetCards();
    }, 1000);
}

gameBoard.addEventListener('click', handleCardClick);

createCards();