class Player{
    constructor(name){
        this.id = Date.now() + Math.floor(((Math.random() + 1) * 10));
        this.name = name;
        this.score = 0;
        this.gamesWon = 0;
    }

    setscore(score){
        this.score = score;
    }

    reinitialize(){
        this.setscore(0);
    }
}