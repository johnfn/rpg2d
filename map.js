function Map(){
    this.mapX = -1;
    this.mapY = -1;

    this.tiles = [];

    this.load = function(mapX, mapY) { 
        if (mapX == this.mapX && 
            mapY == this.mapY )
            return;

        var data = maps[Player.mapX][Player.mapY].data;

        if (tiles != []){
            //TODO: get rid of old tiles

        }

        var tiles = [];

        //Make a lot of tiles.
        for (var i in data){
            tiles.push([]);
            for (var j in data[i]){
                tiles.push(new Tile(i * globals.tileWidth, j * globals.tileWidth, data[i][j][0], data[i][j][1]));
            }
        }
    }
}

function Tile(x, y, spritex, spritey){

    decorate(this, new Drawable(), [x, y, 5, globals.sheet, spritex, spritey]); 
    decorate(this, new Trackable(), []);
}
