/* Prototypes */
Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

let players = [new Player('Player 1'), new Player('Player 2')]

let p1Cell = document.getElementById('player1-scorecell');
let p2Cell = document.getElementById('player2-scorecell');
let p1Name = document.getElementById('player1-name');
let p2Name = document.getElementById('player2-name');
let newGameBtn = document.getElementById('new-game');
let newOpponentCb = document.getElementById('new-opponent-cb');
let switchServerBtn = document.getElementById('switch-server');
let maxScoreSelect = document.getElementById('max-score-drop-down');
let maxServesSelect = document.getElementById('max-serves-drop-down');

let totalScoresTable = document.getElementById('games-won-table');

/* Add events */
p1Cell.addEventListener('click', player1Clicked);
p1Cell.addEventListener('touchStart', player1Clicked);

p2Cell.addEventListener('click', player2Clicked);
p2Cell.addEventListener('touchStart', player2Clicked);

newGameBtn.addEventListener('click', newGame);
newGameBtn.addEventListener('touchStart', newGame);

switchServerBtn.addEventListener('click', switchServer);
switchServerBtn.addEventListener('touchStart', switchServer);

maxScoreSelect.addEventListener('change', maxScoreChanged);

maxServesSelect.addEventListener('change', maxServesChanged);

/* create players */
let player1 = players[0];
let player2 = players[1];
let currentServer = null;
let winner = null;

let totalServes = 0;
let maxScore = 0;
let maxServes = 0;

reinitialize();

createGamesWon();

function gameIsOver(){
    return player1.score == maxScore || player2.score == maxScore;
}

function createGamesWon(){
    for (var i = -1; i < players.length; i++){
        let r = document.createElement("tr");

        if (i >= 0){
            let nameCol = document.createElement("td");
            let totalScoreCol = document.createElement("td");
            totalScoreCol.setAttribute('id', i + "-games-won")
            nameCol.innerText = players[i].name;
            totalScoreCol.innerText = players[i].gamesWon
            r.appendChild(nameCol);
            r.appendChild(totalScoreCol);
        }
        else {
            // Add the header
            let nameCol = document.createElement("th");
            let totalScoreCol = document.createElement("th");
            nameCol.innerText = "PLAYER";
            totalScoreCol.innerText = "WINS"
            r.appendChild(nameCol);
            r.appendChild(totalScoreCol);
        }
        totalScoresTable.appendChild(r);
    }
}

function updateGamesWon(){
    let id = null;
    for (var i = 0; i < players.length; i++){
        id = i + "-games-won";
        document.getElementById(id).innerText = players[i].gamesWon;
    }
}

function setWinnerUI(){
    if (player1.score == maxScore){
        winner = player1;
        player1.gamesWon += 1;
        p1Cell.classList.add('winner');
        p1Cell.children[0].innerHTML = "";
        p2Cell.classList.remove('winner');
    }
    else if (player2.score == maxScore){
        winner = player2;
        player2.gamesWon += 1;
        p2Cell.classList.add('winner');
        p2Cell.children[0].innerHTML = "";
        p1Cell.classList.remove('winner');
    }

    updateGamesWon();
}

function player1Clicked(e) {
    e.preventDefault();

    if (gameIsOver())
        return;

    player1.setscore(player1.score += 1);
    updateScore();
    updateTotalServes()

    toggleEnabled();
    
    setWinnerUI();
}

function updateScore(){
    p1Cell.children[0].innerText = player1.score;
    p2Cell.children[0].innerText = player2.score;
}

function player2Clicked(e) {
    e.preventDefault();

    if (gameIsOver())
        return;

    player2.setscore(player2.score += 1);
    updateScore();
    updateTotalServes()

    toggleEnabled();

    setWinnerUI();
}

function updateTotalServes(){
    totalServes += 1;

    if (totalServes % maxServes == 0){
        changeServer();
    }
}

function changeServer(){
    if (currentServer == player1){
        currentServer = player2;
        p2Cell.className = 'score-cell-serving';
        p1Cell.className = 'score-cell';
    }
    else {
        currentServer = player1;
        p1Cell.className = 'score-cell-serving';
        p2Cell.className = 'score-cell';
    }
}

function setServer(player){
    if (currentServer == player2){
        currentServer = player2;
        p2Cell.className = 'score-cell-serving';
        p1Cell.className = 'score-cell';
    }
    else {
        currentServer = player1;
        p1Cell.className = 'score-cell-serving';
        p2Cell.className = 'score-cell';
    }
}

function newGame(e) {
    e.preventDefault();
    shufflePlayers();
    reinitialize();
}

function shufflePlayers(){
    if (newOpponentCb.checked && players.length > 2){
        let newOpponent = players.random();
        while (newOpponent === player1 || newOpponent === player2 || (winner && newOpponent === winner)){
            newOpponent = players.random();
        }

        if (winner){
            if (player2 === winner){
                player1 = newOpponent;
            }
            else {
                player2 = newOpponent;                
            }
        }
        else {
            if (currentServer === player2){
                player1 = newOpponent;
            }
            else {
                player2 = newOpponent;
            }
        }
    }
}

function reinitialize(newGame = false) {
    player1.reinitialize();
    player2.reinitialize();

    p1Name.innerHTML = player1.name;
    p2Name.innerHTML = player2.name;

    maxScore = parseInt(maxScoreSelect.value);
    maxServes = parseInt(maxServesSelect.value);

    totalServes = 0;
    
    if (winner){
        currentServer = winner
    }

    setServer();
    winner = null;
    toggleEnabled();
    updateScore();
}

function toggleEnabled(){
    let disabled = (player1.score > 0 || player2.score > 0);
    switchServerBtn.disabled = disabled;
    maxScoreSelect.disabled = disabled;
    maxServesSelect.disabled = disabled;
}

function switchServer(e){
    e.preventDefault();
    changeServer();
}

function maxScoreChanged(e) {
    e.preventDefault();

    maxScore = parseInt(e.target.value);
}

function maxServesChanged(e) {
    e.preventDefault();
    
    maxServes = parseInt(e.target.value);
}