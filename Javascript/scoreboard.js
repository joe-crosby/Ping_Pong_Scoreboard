/* Prototypes */
Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

String.prototype.toTitle = function () {
    let words = this.split(' ');

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substring(1);
    }
    
    return words.join(" ");
}

function map(str){
    let caps = str.trim().replace(str[0], str[0].toUpperCase())
    return caps;
}

let synth = null;
let voices = [];
let canSpeak = false;

if ('speechSynthesis' in window) {
    synth = window.speechSynthesis;
    synth.onvoiceschanged = function() {
        voices = synth.getVoices();
        console.log(voices);	
        canSpeak = true;
    };
}else{
    // Speech Synthesis Not Supported
    vocalPhrasingCb.style.visibility = 'hidden';
    alert("Sorry, your browser doesn't support text to speech!");
}

let players = [new Player('Player 1'), new Player('Player 2')];

let p1Cell = document.getElementById('player1-scorecell');
let p1UndoBtn = document.getElementById('player1-undo');
let p2Cell = document.getElementById('player2-scorecell');
let p2UndoBtn = document.getElementById('player2-undo');
let p1Name = document.getElementById('player1-name');
let p2Name = document.getElementById('player2-name');
let newGameBtn = document.getElementById('new-game');
let newOpponentCb = document.getElementById('new-opponent-cb');
let switchServerBtn = document.getElementById('switch-server');
let maxScoreSelect = document.getElementById('max-score-drop-down');
let maxServesSelect = document.getElementById('max-serves-drop-down');

let newPlayerNameTb = document.getElementById('new-player-name-tb');
let addPlayerBtn = document.getElementById('add-player-btn');
let clearPlayersBtn = document.getElementById('clear-players-btn');

let totalScoresTable = document.getElementById('games-won-table');

/* Add events */
p1Cell.addEventListener('click', player1Clicked);
p1Cell.addEventListener('touchStart', player1Clicked);

p1Cell.firstChild.addEventListener('click', player1Clicked);
p1Cell.firstChild.addEventListener('touchStart', player1Clicked);

p1UndoBtn.addEventListener('click', player1Undo);
p1UndoBtn.addEventListener('touchStart', player1Undo);

p2Cell.addEventListener('click', player2Clicked);
p2Cell.addEventListener('touchStart', player2Clicked);

p2Cell.firstChild.addEventListener('click', player2Clicked);
p2Cell.firstChild.addEventListener('touchStart', player2Clicked);

p2UndoBtn.addEventListener('click', player2Undo);
p2UndoBtn.addEventListener('touchStart', player2Undo);

newGameBtn.addEventListener('click', newGame);
newGameBtn.addEventListener('touchStart', newGame);

switchServerBtn.addEventListener('click', switchServer);
switchServerBtn.addEventListener('touchStart', switchServer);

maxScoreSelect.addEventListener('change', maxScoreChanged);

maxServesSelect.addEventListener('change', maxServesChanged);

newPlayerNameTb.addEventListener('keypress', newPlayerEnterPressed);

addPlayerBtn.addEventListener('click', addPlayerClicked);
addPlayerBtn.addEventListener('touchStart', addPlayerClicked);

clearPlayersBtn.addEventListener('click', clearPlayersClicked);
clearPlayersBtn.addEventListener('touchStart', clearPlayersClicked);

/* create players */
let player1 = players[0];
let player2 = players[1];
let currentServer = null;
let winner = null;

let totalServes = 0;
let maxScore = 0;
let maxServes = 0;

updateMaxValues();

reinitialize();

createGamesWon();

function gameIsOver(){
    return player1.score == maxScore || player2.score == maxScore;
}

function createGamesWon(){
    totalScoresTable.innerHTML = null;

    for (var i = -1; i < players.length; i++){
        let r = document.createElement("tr");

        if (i >= 0){
            // Add the user id to the row
            r.setAttribute('id', players[i].id);

            let nameCol = document.createElement("td");
            let totalScoreCol = document.createElement("td");
            let deleteCol = document.createElement("td");
            let deleteButton = document.createElement("button");
            deleteButton.setAttribute('id', players[i].id);
            deleteButton.classList.add('deleteUserBtn');
            deleteButton.innerHTML = "x";
            
            deleteButton.addEventListener('click', deleteUser_clicked);
            deleteButton.addEventListener('touchStart', deleteUser_clicked);

            deleteCol.appendChild(deleteButton);

            totalScoreCol.setAttribute('id', "games-won");
            nameCol.innerText = players[i].name;
            totalScoreCol.innerText = players[i].gamesWon;
            r.appendChild(nameCol);
            r.appendChild(totalScoreCol);
            r.appendChild(deleteCol);
        }
        else {
            // Add the header
            let nameCol = document.createElement("th");
            let totalScoreCol = document.createElement("th");
            let deleteCol = document.createElement("td");
            nameCol.innerText = "PLAYER";
            totalScoreCol.innerText = "WINS";
            r.appendChild(nameCol);
            r.appendChild(totalScoreCol);
            r.appendChild(deleteCol);
        }
        totalScoresTable.appendChild(r);
        r.scrollIntoView();
    }
}

function updateGamesWon(){
    let id = null;
    for (var i = 0; i < players.length; i++){
        document.getElementById(players[i].id).querySelector("#" + "games-won").innerText = players[i].gamesWon;
    }
}

function setWinnerUI(){
    winner = null;

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

    if (player1 != null){
        playerClicked(player1);
        p1UndoBtn.disabled = false;
        p2UndoBtn.disabled = true;
    }
}

function player1Undo(e){
    e.preventDefault();

    if (player1 != null){
        playerUndo(player1);
        p1UndoBtn.disabled = true;
    }
}

function player2Clicked(e) {
    e.preventDefault();

    if (player2 != null){
        playerClicked(player2);
        p2UndoBtn.disabled = false;
        p1UndoBtn.disabled = true;
    }
}

function player2Undo(e){
    e.preventDefault();

    if (player2 != null){
        playerUndo(player2);
        p2UndoBtn.disabled = true;
    }
}

function playerClicked(player) {
    if (gameIsOver())
        return;

    player.setscore(player.score += 1);
    updateScore();
    updateTotalServes();
    updateMaxValues();

    toggleEnabled();

    setWinnerUI();
}

function playerUndo(player) {
    if (gameIsOver())
        return;

    if (player.score > 0){
        player.setscore(player.score -= 1);

        // Change the current player back if necessary
        if (totalServes % maxServes == 0){
            changeServer();
        }
        
        // Remove from the totalServes
        totalServes -= 1;

        updateScore();
        toggleEnabled();
    }
}

function updateScore(){
    if (!playersAreSet())
        return;

    p1Cell.children[0].innerText = player1.score;
    p2Cell.children[0].innerText = player2.score;
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

// function getRandomOpponent(){
//     if (players.length > 2){
//         let newOpponent = players.random();
//         while (newOpponent === player1 || newOpponent === player2 || (winner && newOpponent === winner)){
//             newOpponent = players.random();
//         }
        
//         return newOpponent;
//     }
//     else if (players.length > 1) {
//         let newOpponent = players.random();
//         while (newOpponent === player1 || newOpponent === player2 + newOpponent === player1){
//             newOpponent = players.random();
//         }
        
//         return newOpponent;
//     }

//     return null;
// }

function shufflePlayers(){
    if (newOpponentCb.checked && players.length > 2){
        let newOpponent = players.random();
        while ((winner && newOpponent === winner) || newOpponent === player1 || newOpponent === player2){
            newOpponent = players.random();
        }
        
        if (newOpponent == null)
            return;

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
    if (player1 != null) {
        player1.reinitialize();
        p1Name.innerHTML = player1.name;
    }
    else{
        p1Name.innerHTML = null;
    }

    if (player2 != null){
        player2.reinitialize();
        p2Name.innerHTML = player2.name;
    }
    else{
        p2Name.innerHTML = null;
    }

    totalServes = 0;
    
    if (winner){
        currentServer = winner;
    }

    setServer();
    winner = null;
    toggleEnabled();
    updateScore();
}

function updateMaxValues(){
    maxScore = parseInt(maxScoreSelect.value);
    maxServes = parseInt(maxServesSelect.value);
}

function toggleEnabled(){
    if (!playersAreSet())
        return;

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

function playersAreSet(){
    return (player1 != null && player2 != null);
}

function newPlayerEnterPressed(e){
    if (e.keyCode == 13) {
        e.preventDefault();
        document.activeElement.blur();
        addPlayer(e.target.value);
    }
}

function addPlayerClicked(e){
    e.preventDefault();

    addPlayer(newPlayerNameTb.value);
}

function clearPlayersClicked(e){
    e.preventDefault();

    clearPlayers();
}

function addPlayer(name){
    if (!name || name.trim().length == 0)
        return;

    players.push(new Player(name.toTitle()));

    if (players.length > 0 && player1 == null){
        player1 = players[0];
    }

    if (players.length > 1 && player2 == null){
        player2 = players[1];
    }

    createGamesWon();

    if (players.length > 1){
        reinitialize();
    }

    focusNewPlayerTb();
}

function focusNewPlayerTb(){
    newPlayerNameTb.value = null;
    addPlayerBtn.focus();
}

function deleteUser_clicked(e){
    e.preventDefault();
    players = players.filter(x => x.id != e.target.id)
    if (players.length < 1){
        clearPlayers();
    }

    if (!players.includes(player1)){
        if (player1 == currentServer){
            currentServer = players.filter(x => x.id != player2.id)[0];
            player1 = currentServer;
        }

        player1 = players.filter(x => x.id != player2.id)[0];
    }

    if (!players.includes(player2)){
        if (player2 == currentServer){
            currentServer = players.filter(x => x.id != player1.id)[0];
            player2 = currentServer;
        }

        player2 = players.filter(x => x.id != player1.id)[0];
    }

    createGamesWon();
    reinitialize();
}

function clearPlayers(){
    players = [];
    player1 = null;
    player2 = null;
    createGamesWon();
    reinitialize();
    focusNewPlayerTb();
}

function speak(text){
    // Must be called from a user event.
    if (!canSpeak){
        return;
    }

    var speech = new SpeechSynthesisUtterance();
    speech.voice = voices[1];
    speech.volume = 1; // 0 to 1
    speech.rate = 1; // 0.1 to 10
    speech.pitch = 0; //0 to 2
    speech.lang = 'en-US';
    speech.voiceURI = "Google US English"
    speech.text = text;
    synth.speak(speech);
}