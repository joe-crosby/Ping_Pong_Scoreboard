const MAX_SCORE = 21
const MAX_SERVES = 5

let totalServes = 1;

let p1cell = document.getElementById('player1scorecell');
let p2cell = document.getElementById('player2scorecell');
let newgamebtn = document.getElementById('newgame');

/* Add events */
p1cell.addEventListener('click', player1clicked);
p1cell.addEventListener('touchStart', player1clicked);

p2cell.addEventListener('click', player2clicked);
p2cell.addEventListener('touchStart', player2clicked);

newgamebtn.addEventListener('click', reinitialize);
newgamebtn.addEventListener('touchStart', reinitialize);

/* create players */
let player1 = new PingPongPlayer(p1cell, 'Player 1', true);
let player2 = new PingPongPlayer(p2cell, 'Player 2');

function gameIsOver(){
    return player1.score == MAX_SCORE || player2.score == MAX_SCORE;
}

function player1clicked(e) {
    e.preventDefault();

    if (gameIsOver())
        return;

    player1.setscore(player1.score += 1);
    updateTotalServes(player1, 'player1score')
}

function player2clicked(e) {
    e.preventDefault();

    if (gameIsOver())
        return;

    player2.setscore(player2.score += 1);
    updateTotalServes(player2, 'player2score')
}

function updateTotalServes(player, id){
    if (totalServes % MAX_SERVES == 0){
        player1.setisserving(!player1.isserving);
        player2.setisserving(!player2.isserving);
    }
        

    totalServes += 1;
}

function reinitialize(e) {
    e.preventDefault();

    player1.reinitialize(true);
    player2.reinitialize();

    totalServes = 1;
}