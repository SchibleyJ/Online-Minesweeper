const floodFill = (x, y, clicks, surroundings, flags) => {
    if (surroundings[y] == undefined || surroundings[y][x] == undefined || clicks[y][x]){
        return;
    }
    clicks[y][x] = true;
    if (flags[y][x]){
        flags[y][x] = 0;
    }
    if (surroundings[y][x] !== 0){
        return;
    }
    floodFill(x - 1, y, clicks, surroundings, flags);
    floodFill(x + 1, y, clicks, surroundings, flags);
    floodFill(x, y - 1, clicks, surroundings, flags);
    floodFill(x, y + 1, clicks, surroundings, flags);
    floodFill(x - 1, y - 1, clicks, surroundings, flags);
    floodFill(x - 1, y + 1, clicks, surroundings, flags);
    floodFill(x + 1, y - 1, clicks, surroundings, flags);
    floodFill(x + 1, y + 1, clicks, surroundings, flags);
    
    
}

module.exports = floodFill;
