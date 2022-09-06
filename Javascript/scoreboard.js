let p1Cell = document.getElementById('player1-scorecell');
let p2Cell = document.getElementById('player2-scorecell');
let newGameBtn = document.getElementById('new-game');
let switchServerBtn = document.getElementById('switch-server');
let maxScoreSelect = document.getElementById('max-score-drop-down');
let maxServesSelect = document.getElementById('max-serves-drop-down');

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
let player1 = new PingPongPlayer(p1Cell, 'Player 1', true);
let player2 = new PingPongPlayer(p2Cell, 'Player 2');

let totalServes = 0;
let maxScore = 0;
let maxServes = 0;

reinitialize();

function gameIsOver(){
    return player1.score == maxScore || player2.score == maxScore;
}

function player1Clicked(e) {
    e.preventDefault();

    if (gameIsOver())
        return;

    player1.setscore(player1.score += 1);
    updateTotalServes(player1, 'player1-score')

    toggleEnabled();
}

function player2Clicked(e) {
    e.preventDefault();

    if (gameIsOver())
        return;

    player2.setscore(player2.score += 1);
    updateTotalServes(player2, 'player2-score')

    toggleEnabled();
}

function updateTotalServes(player, id){
    totalServes += 1;

    if (totalServes % maxServes == 0){
        player1.setisserving(!player1.isserving);
        player2.setisserving(!player2.isserving);
    }
}

function newGame(e) {
    e.preventDefault();
    reinitialize();
}

function reinitialize() {
    player1.reinitialize(true);
    player2.reinitialize();

    totalServes = 0;

    toggleEnabled();

    maxScore = parseInt(maxScoreSelect.value);
    maxServes = parseInt(maxServesSelect.value);
}

function toggleEnabled(){
    let disabled = (player1.score > 0 || player2.score > 0);
    document.getElementById('switch-server').disabled = disabled;
    document.getElementById('max-score-drop-down').disabled = disabled;
    document.getElementById('max-serves-drop-down').disabled = disabled;
}

function switchServer(e){
    e.preventDefault();

    player1.setisserving(!player1.isserving);
    player2.setisserving(!player2.isserving);
}

function maxScoreChanged(e) {
    e.preventDefault();

    maxScore = parseInt(e.target.value);
}

function maxServesChanged(e) {
    e.preventDefault();
    
    maxServes = parseInt(e.target.value);
}