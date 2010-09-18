function Map() {
    this.mapX = -1;
    this.mapY = -1;

    this.tiles = [];
    this.special = [];
    this.cmap = undefined;

    this.load = function(mapX, mapY) { 
        console.log("loading");
        if (mapX == this.mapX && 
            mapY == this.mapY )
            return;

        this.mapX = mapX;
        this.mapY = mapY;
        this.cmap = maps[Player.mapX][Player.mapY];
        var data = this.cmap.data;

        if (this.tiles.length != 0){
            console.log("removing");
            Objects.removeAll();
        }

        var tiles = [];

        //Make a lot of tiles.
        for (var i in data){
            tiles.push([]);
            for (var j in data[i]){
                tiles.push(new Tile(i * globals.tileWidth, j * globals.tileWidth, data[i][j][0], data[i][j][1], data[i][j][2]));
            }
        }

        //Time to do some dynamic loading of characters items etc.
        //exits: {},
        //
        //chars: {"2,2": 0

        var objMap = {
            "chars" : Character,
            "items" : Item,
        }

        for (objStr in objMap) { 

            for (var pos in maps[Player.mapX][Player.mapY][objStr]){
                var cpos = pos.split(",");

                var c = new objMap[objStr]((cpos[0]-0) * globals.tileWidth, 
                                           (cpos[1]-0) * globals.tileWidth, 
                                            maps[Player.mapX][Player.mapY][objStr][pos]);

            }

        }
        //var i = new Item(50, 50, 0);

    }

    this.safeTile = function(x, y){
       if (this.cmap.special[x][y].length == 1) return true;
       return false;
    }
}

function Tile(x, y, spritex, spritey, sheetname){

    decorate(this, new Drawable(), [x, y, 5, sheetname, spritex, spritey]); 
    decorate(this, new Trackable(), []);
}
