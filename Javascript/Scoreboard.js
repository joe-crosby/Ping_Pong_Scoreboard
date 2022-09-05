const MAX_SCORE = 21
const MAX_SERVES = 5

let totalServes = 1;

/* Add events */
document.getElementById('player1scorecell').addEventListener('click', player1clicked);
document.getElementById('player1scorecell').addEventListener('touchStart', player1clicked);

document.getElementById('player2scorecell').addEventListener('click', player2clicked);
document.getElementById('player2scorecell').addEventListener('touchStart', player2clicked);

document.getElementById('newgame').addEventListener('click', reinitialize);

function gameIsOver(){
    return getScore('player1score') == MAX_SCORE || getScore('player2score') == MAX_SCORE;
}

function player1clicked(e) {
    e.preventDefault();

    if (gameIsOver())
        return;

    incrementScore('player1score')
}

function player2clicked(e) {
    e.preventDefault();

    if (gameIsOver())
        return;

    incrementScore('player2score')
}

function getScore(id){
    return parseInt(document.getElementById(id).innerText);
}

function incrementScore(id){
    let element = document.getElementById(id);
    let score = parseInt(element.innerText);

    document.getElementById(id).innerText = score + 1;

    if (totalServes % MAX_SERVES == 0)
        changeBackgrounds()

    totalServes += 1;
}

function changeBackgrounds(){
    let serving = document.getElementsByClassName('score-cell-serving')[0];
    let notServing = document.getElementsByClassName('score-cell')[0];

    serving.className = 'score-cell';
    notServing.className = 'score-cell-serving';
}

function reinitialize(e) {
    e.preventDefault();

    document.getElementById('player1scorecell').className = 'score-cell-serving';
    document.getElementById('player1score').innerText = 0;

    document.getElementById('player2scorecell').className = 'score-cell'
    document.getElementById('player2score').innerText = 0;

    totalServes = 1;
}