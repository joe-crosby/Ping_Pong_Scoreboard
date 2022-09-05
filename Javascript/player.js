/*  A ping pong player class to control an HTML element, 
    with a child element that is used to display the score. */
class PingPongPlayer{
    constructor(element, name, isserving=false){
        this.scorecell = element;
        this.name = name;
        this.score = 0;
        this.isserving = isserving;
    }

    setisserving(isserving){
        this.isserving = isserving;

        if (this.isserving){
            this.scorecell.className = 'score-cell-serving';
        }
        else {
            this.scorecell.className = 'score-cell';
        }
    }

    setscore(score){
        this.score = score;
        this.scorecell.children[0].innerText = this.score;
    }

    reinitialize(isserving=false){
        this.setisserving(isserving)
        this.setscore(0);
    }
}