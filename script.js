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

const modalOverlay = document.createElement('div');
modalOverlay.classList.add('modal-overlay');

const modal = document.createElement('div');
modal.classList.add('modal');

const modalTitle = document.createElement('h2');
modalTitle.textContent = 'You won!';

const modalMessage = document.createElement('p');

const modalNewGameButton = document.createElement('button');
modalNewGameButton.type = 'button';
modalNewGameButton.textContent = 'New Game';

const modalCloseButton = document.createElement('button');
modalCloseButton.type = 'button';
modalCloseButton.textContent = 'Close';

modal.append(
    modalTitle,
    modalMessage,
    modalNewGameButton,
    modalCloseButton,
);

modalOverlay.append(modal);

main.append(counters, gameBoard);

app.append(header, main);
document.body.append(app, modalOverlay);

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let closeTimer = null;
const LEADERBOARD_KEY = 'memory-game-results';

function updateCounters() {
    movesCounter.textContent = `Moves: ${moves}`;
    pairsCounter.textContent = `Pairs: ${matchedPairs} / 8`;
}

function getResults() {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
}

function saveResult() {
    const results = getResults();

    results.push({
        moves,
        date: new Date().toISOString(),
    });

    results.sort((a, b) => {
        if (a.moves !== b.moves) {
            return a.moves - b.moves;
        }

        return new Date(a.date) - new Date(b.date);
    });

    localStorage.setItem(
        LEADERBOARD_KEY,
        JSON.stringify(results.slice(0, 10)),
    );
}

function resetCards() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function openModal() {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function createCards() {
    gameBoard.replaceChildren();

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

function startNewGame() {
    clearTimeout(closeTimer);

    closeTimer = null;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    matchedPairs = 0;

    updateCounters();
    createCards();
}

function showVictoryModal() {
    modalMessage.textContent = `You won in ${moves} moves!`;
    openModal();
}

function showLeaderboard() {
    modalTitle.textContent = 'Leaderboard';

    const results = getResults();

    modalMessage.replaceChildren();

    if (results.length === 0) {
        modalMessage.textContent = 'No results yet.';
        openModal();
        return;
    }

    const table = document.createElement('table');

    const headerRow = document.createElement('tr');

    ['Place', 'Moves', 'Date'].forEach((text) => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.append(th);
    });

    table.append(headerRow);

    results.forEach((result, index) => {
        const row = document.createElement('tr');

        const place = document.createElement('td');
        place.textContent = String(index + 1);

        const resultMoves = document.createElement('td');
        resultMoves.textContent = String(result.moves);

        const date = document.createElement('td');
        date.textContent = new Date(result.date).toLocaleDateString('ru-RU');

        row.append(place, resultMoves, date);
        table.append(row);
    });

    modalMessage.append(table);
    openModal();
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

        if (matchedPairs === 8) {
            saveResult();
            showVictoryModal();
        }

        return;
    }

    closeTimer = setTimeout(() => {
        firstCard.classList.remove('open');
        secondCard.classList.remove('open');

        closeTimer = null;
        resetCards();
    }, 1000);
}

gameBoard.addEventListener('click', handleCardClick);

newGameButton.addEventListener('click', startNewGame);

leaderboardButton.addEventListener('click', showLeaderboard);

modalCloseButton.addEventListener('click', closeModal);

modalNewGameButton.addEventListener('click', () => {
    closeModal();
    startNewGame();
});

modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
        closeModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});

createCards();