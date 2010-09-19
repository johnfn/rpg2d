function Map() {
    this.mapID = -1;

    this.tiles = [];
    this.special = [];
    this.cmap = undefined;

    this.load = function(mapID) { 
        if (mapID == this.mapID)
            return;

        this.mapID = mapID;
        this.cmap = maps[mapID];
        var data = this.cmap.map;

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

            for (var pos in maps[mapID][objStr]){
                var cpos = pos.split(",");

                var c = new objMap[objStr]((cpos[0]-0) * globals.tileWidth, 
                                           (cpos[1]-0) * globals.tileWidth, 
                                            maps[mapID][objStr][pos]);

            }

        }
        //var i = new Item(50, 50, 0);

    }

    this.safeTile = function(x, y){
       var obj = this.cmap.special[x][y];

       if (obj[0] == 1 && obj[1] == 0 && obj[2] == "ED") return false;
       return true;
    }
}

function Tile(x, y, spritex, spritey, sheetname){

    decorate(this, new Drawable(), [x, y, 5, sheetname, spritex, spritey]); 
    decorate(this, new Trackable(), []);
}
