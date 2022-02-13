class Board {
    constructor(newId, width, height, bombs){
        this.id = newId;
        this.width = width;
        this.height = height;
        this.numBombs = bombs;
        this.bombs = this.#createBombs();
        this.surroundings = this.#createSurrounding(this.bombs);
        this.clicks = this.#createClicks();
        this.flags = this.#createFlags();
        this.clients = [];


    }

    
    #createBombs = () => {
        let bombs = [...Array(this.height)].map(x=>Array(this.width).fill(false))

        for (let i = 0; i < this.numBombs; i++){
            let ranX = Math.floor(Math.random() * this.width);
            let ranY = Math.floor(Math.random() * this.height);
            if (bombs[ranY][ranX]){
                i--;
                continue;
            } else {
                bombs[ranY][ranX] = true;
            }
        }
        return bombs;
    }

    #createSurrounding = (bombs) => {
        let surroundings = [...Array(this.height)].map(x=>Array(this.width).fill(false))

        for (let i = 0; i < this.height; i++){
            for (let j = 0; j < this.width; j++){
                surroundings[i][j] = this.#singleSurrounding(bombs, j, i)
            }
        }
        return surroundings;
    }

    #singleSurrounding = (bombs, x, y) => {
        let total = 0;
        for (let i = -1; i < 2; i++){
            for (let j = -1; j < 2; j++) {
                if (bombs[y + i] && bombs[y + i][x + j] && (j != 0 || i != 0)){
                    total++;
                }
            }
        }
        return total;
        
    }

    #createClicks = () => {
        let clicks = [...Array(this.height)].map(x=>Array(this.width).fill(false))
        return clicks;
    }

    #createFlags = () => {
        let flags = [...Array(this.height)].map(x=>Array(this.width).fill(0))
        return flags;
    }

    addClient = (client) => {
        this.clients.push(client);
    }
}


module.exports = Board;