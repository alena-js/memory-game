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