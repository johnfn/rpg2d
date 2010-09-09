
var Player = {
    speed : 4,
    mapX  : 1,
    mapY  : 1,
    x     : 5,
    y     : 5,
    width : 12,
};

var modes = {
    NORMAL : 0,
    DIALOG : 1,
};

var Game = {
    mode        : modes.NORMAL,
    dialog      : undefined, //Dialog(0), 
}

Game.dialog = Dialog(0);

function gameLoop(){
    getcmap();


    if (Game.mode == modes.NORMAL){
        movePlayer();
        doAction();
    } else if (Game.mode == modes.DIALOG){
        var dialogkeys = { 
            32 : "",
            89 : "y",
            78 : "n",
        };
        for (var x in dialogkeys){
            if (globals.keys[x]){
                if (!Game.dialog.nextDialog(dialogkeys[x])){
                    Game.dialog.hideDialog();
                    Game.mode = modes.NORMAL;
                }
                globals.keys[x] = false;
            }
        }

    }



    if (globals.ticks++ % 8) {
        drawScreen();
    }
}

function getcmap(){
    cmap = [];
    for (var i=0;i<globals.tilesWide;i++) {
        cmap.push([]);
        for (var j=0;j<globals.tilesWide;j++) { 
            cmap[i].push(maps[Player.mapX][Player.mapY].data[j][i]);
        }
    }
}

function doAction(){
    var vis = false;
    //chars: {"2,2" : 0},
    for (c in maps[Player.mapX][Player.mapY].chars) {
        var chpos = c.split(",");
        var di = (chpos[0] - Player.x) * (chpos[0] - Player.x) + 
                 (chpos[1] - Player.y) * (chpos[1] - Player.y) ;

        if (di < 600){
            if (globals.keys[32]){ 
                Game.mode = modes.DIALOG;
                //start a conversation
                Game.dialog = Dialog(maps[Player.mapX][Player.mapY].chars[c]); 
            } else { 
                vis = true;
                $("#action-text").html("Space to talk");
            }
        }
    }
    if (vis) { 
        $("#action").css("display", "block");
    } else { 
        $("#action").css("display", "none");
    }
}

function canMoveHere(x, y, w){
    if (x < 0 || x > globals.mapWidth ||
        y < 0 || y > globals.mapWidth ) 
        return canMoveHere.OUTOFBOUNDS;

    var points = utils.getRectPoints(x, y, w);

    for (var p in points){
        if (cmap[Math.floor(points[p].x/globals.tileWidth)][Math.floor(points[p].y/globals.tileWidth)] == "1"){
            return canMoveHere.IMPOS;
        }
    }

    return canMoveHere.SAFE;
}
canMoveHere.IMPOS       = 0
canMoveHere.SAFE        = 1;
canMoveHere.OUTOFBOUNDS = 2;

function movePlayer(){
    var res;
    var newPos = { 
        x : Player.x,
        y : Player.y,
    };
    for (var dir in {"x":"x", "y":"y"}){ 
        if (dir=="x") newPos.x += (globals.keys[68] - globals.keys[65])*Player.speed;
        if (dir=="y") newPos.y += (globals.keys[83] - globals.keys[87])*Player.speed;

        res = canMoveHere(newPos.x, newPos.y, Player.width);
        if (res == canMoveHere.IMPOS)
            newPos[dir] = Player[dir];

        if (res == canMoveHere.OUTOFBOUNDS){
            if (newPos.x < 0) {
                newPos.x += globals.mapWidth;
                Player.mapX--;
            }
            if (newPos.x > globals.mapWidth) {
                newPos.x -= globals.mapWidth;
                Player.mapX++;
            }
        }

    }

    Player.x = newPos["x"];
    Player.y = newPos["y"];

}

function renderTile(x, y, color){
    globals.context.fillStyle = globals.colors[color];

    globals.context.fillRect(x, y, globals.tileWidth, globals.tileWidth);
}

function drawScreen(){
    globals.context.clearRect(0,0,globals.maxSize,globals.maxSize);

    for (var i=0;i<globals.tilesWide;i++){
        for (var j=0;j<globals.tilesWide;j++){
            renderTile(i*globals.tileWidth, j*globals.tileWidth, cmap[i][j]);
        }
    }

    renderTile(Player.x, Player.y, "p");

    Game.dialog.renderDialog();


    /*
var Game = {
    mode        : modes.NORMAL,
    dialog      : "Rawr!", 
    */

}

function initialize(){
    globals.context = document.getElementById('main').getContext('2d');

    for (var i=0;i<255;i++) globals.keys[i]=false;

    $(document).keydown(function(e){ console.log(e.which); globals.keys[e.which] =  true;});
    $(document).keyup(  function(e){ globals.keys[e.which] = false;});
}

$(function(){ 
    initialize();

    setInterval(gameLoop, 15);
});
