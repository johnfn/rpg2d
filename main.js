var Player = {
    speed : 4,
    mapX  : 1,
    mapY  : 1,
    x     : 5,
    y     : 5,
    width : 12,
};



//Game.dialog = Dialog(0);

function gameLoop(){
    getcmap();

    if (Game.mode == Modes.NORMAL){
        movePlayer();
        doAction();
    } else if (Game.mode == Modes.DIALOG){
        var dialogkeys = { 
            32 : "",
            89 : "y",
            78 : "n",
        };
        for (var x in dialogkeys){
            if (globals.keysOnce.getKey(x)){
                if (!Game.dialog.nextDialog(dialogkeys[x])){
                    Game.dialog.hideDialog();
                    Game.mode = Modes.NORMAL;
                }
            }
        }
    }



    if (globals.ticks++ % 8) {
        drawScreen();
    }
}

//Flips map x/y so that it renders right

function getcmap(){
    cmap = [];
    for (var i=0;i<globals.tilesWide;i++) {
        cmap.push([]);
        for (var j=0;j<globals.tilesWide;j++) { 
            cmap[i].push(maps[Player.mapX][Player.mapY].data[j][i]);
        }
    }
}

//Triggered on space
//
//Try to talk to anyone nearby
function doAction(){
    var vis = false;
    var obj;
    for (i in Interactable.all){
        obj = Interactable.all[i];
        if (obj.canInteract(Player)){
            vis = true;
            $("#action-text").html(obj.getText());
            if (globals.keysOnce.getKey(32)) { 
                Game.mode = Modes.DIALOG;
                obj.action();
                Game.dialog = Dialog(0); 
            }
        }
    }
    //console.log(Interactable.all);
    
    if (vis) { 
        $("#action").css("display", "block");
    } else { 
        $("#action").css("display", "none");
    }
}

//returns safe if x/y is valid, impos if it's a wall, outofbounds if it's another map
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

//attempts to move a player in a direction
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
            //TODO Y
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

    if (Game.dialog){ 
        Game.dialog.render();
    }


    globals.sheet.renderImage(globals.context, 0, 0, 0, 0); 
}

function initialize(){
    globals.context = document.getElementById('main').getContext('2d');

    for (var i=0;i<255;i++) globals.keys[i]=false;

    $(document).keydown(function(e){ console.log(e.which); globals.keys[e.which] =  true;});
    $(document).keyup(  function(e){ globals.keys[e.which] = false;});

    setInterval(gameLoop, 15);

    var c = new Character(5, 5, 0);
}

$(function(){ 
    globals.sheet = new SpriteSheet("graphics/spritesheet.png", 16, initialize)
});
