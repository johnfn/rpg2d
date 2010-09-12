function Map(){
    this.mapX = -1;
    this.mapY = -1;

    this.tiles = [];

    this.load = function(mapX, mapY) { 
        console.log("loading");
        if (mapX == this.mapX && 
            mapY == this.mapY )
            return;

        this.mapX = mapX;
        this.mapY = mapY;
        var data = maps[Player.mapX][Player.mapY].data;

        if (this.tiles.length != 0){
            console.log("removing");
            Objects.removeAll();
        }

        var tiles = [];

        //Make a lot of tiles.
        for (var i in data){
            tiles.push([]);
            for (var j in data[i]){
                tiles.push(new Tile(i * globals.tileWidth, j * globals.tileWidth, data[i][j][0], data[i][j][1]));
            }
        }


        //Time to do some dynamic loading of characters items etc.
        //exits: {},
        //
        //chars: {"2,2": 0
        for (var pos in maps[Player.mapX][Player.mapY].chars){
            var cpos = pos.split(",");

            var c = new Character((cpos[0]-0) * globals.tileWidth, 
                                  (cpos[1]-0) * globals.tileWidth, 
                                   maps[Player.mapX][Player.mapY].chars[pos]);

        }
        var i = new Item(50, 50, 0);

    }
}

function Tile(x, y, spritex, spritey){

    decorate(this, new Drawable(), [x, y, 5, globals.sheet, spritex, spritey]); 
    decorate(this, new Trackable(), []);
}
