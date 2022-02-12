const floodFill = (x, y, clicks, surroundings) => {
    if (surroundings[y] == undefined || surroundings[y][x] == undefined || clicks[y][x]){
        return;
    }
    clicks[y][x] = true;
    if (surroundings[y][x] !== 0){
        return;
    }
    floodFill(x - 1, y, clicks, surroundings);
    floodFill(x + 1, y, clicks, surroundings);
    floodFill(x, y - 1, clicks, surroundings);
    floodFill(x, y + 1, clicks, surroundings);
    floodFill(x - 1, y - 1, clicks, surroundings);
    floodFill(x - 1, y + 1, clicks, surroundings);
    floodFill(x + 1, y - 1, clicks, surroundings);
    floodFill(x + 1, y + 1, clicks, surroundings);
    
    
}

module.exports = floodFill;
