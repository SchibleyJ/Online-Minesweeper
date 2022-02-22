const Game = require('./game.js');

class VsGame extends Game {
    constructor(newId, width, height, bombs) {
        super(newId, width, height, bombs)
        //this.id = newId;
        //this.width = width;
        //this.height = height;
        //this.numBombs = bombs;
        this.numFlags = 0;
        //this.bombs = [...Array(this.height)].map(x => Array(this.width).fill(false));
        //this.surroundings = [...Array(this.height)].map(x => Array(this.width).fill(0));
        this.clicks = this.#createClicks();
        this.flags = this.#createFlags();
        //this.clients = [];
        this.firstTurn = true;
        //this.timer;
        //this.seconds = 0;
        //0 is still going, 1 is win, 2 is loss
        this.winState = 0;
    }


    /*createBombs = (x, y) => {
        let bombs = [...Array(this.height)].map(x => Array(this.width).fill(false))

        for (let i = 0; i < this.numBombs; i++) {
            let ranX = Math.floor(Math.random() * this.width);
            let ranY = Math.floor(Math.random() * this.height);
            if (bombs[ranY][ranX] || (Math.abs(ranY - y) <= 1 && Math.abs(ranX - x) <= 1)) {
                i--;
                continue;
            } else {
                bombs[ranY][ranX] = true;
            }
        }
        this.bombs = bombs;
    }

    createSurrounding = (bombs) => {
        let surroundings = [...Array(this.height)].map(x => Array(this.width).fill(false))

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                surroundings[i][j] = this.#singleSurrounding(bombs, j, i)
            }
        }
        this.surroundings = surroundings;
    }*/

    /*#singleSurrounding = (bombs, x, y) => {
        let total = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (bombs[y + i] && bombs[y + i][x + j] && (j != 0 || i != 0)) {
                    total++;
                }
            }
        }
        return total;

    }*/

    #createClicks = () => {
        let clicks = [...Array(this.height)].map(x => Array(this.width).fill(false))
        return clicks;
    }

    #createFlags = () => {
        let flags = [...Array(this.height)].map(x => Array(this.width).fill(0))
        return flags;
    }

    /*addClient = (client) => {
        this.clients.push(client);
    }*/

    updateFlagCount = () => {
        let total = 0;
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.flags[i] && this.flags[i][j]) {
                    total++;
                }
            }
        }
        this.numFlags = total;
    }

    /*startTimer = (fn, id) => {
        this.timer = setInterval(fn, 1000, id);
    }

    endTimer = () => {
        clearInterval(this.timer);
    }*/

    checkGameOver = () => {
        let numNotClicked = 0;
        for (let i = 0; i < this.bombs.length; i++) {
            for (let j = 0; j < this.bombs[0].length; j++) {
                if (this.clicks[i][j] && this.bombs[i][j]) {
                    this.winState = 2;
                    this.endTimer();
                }
                if (!this.clicks[i][j]) {
                    numNotClicked++;
                }
            }
        }
        if (this.numBombs == numNotClicked && this.winState == 0) {
            this.winState = 1;
            this.numFlags = this.numBombs;
            for (let i = 0; i < this.bombs.length; i++) {
                for (let j = 0; j < this.bombs[0].length; j++) {
                    if (this.bombs[i][j] && this.flags[i][j] == 0){
                        this.flags[i][j] = 6;
                    }
                }
            }
            this.endTimer();
        }
    }

    resetGame = () => {
        this.endTimer();
        this.numFlags = 0;
        this.bombs = [...Array(this.height)].map(x => Array(this.width).fill(false));
        this.surroundings = [...Array(this.height)].map(x => Array(this.width).fill(0));
        this.clicks = this.#createClicks();
        this.flags = this.#createFlags();
        this.clients = [];
        this.firstTurn = true;
        this.seconds = 0;
        this.winState = 0;
    }
}


module.exports = VsGame;