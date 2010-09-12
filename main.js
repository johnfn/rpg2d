var Player = {
    speed : 4,
    mapX  : 1,
    mapY  : 1,
    x     : 5,
    y     : 5,
    width : 12,
};

function gameLoop(){
    cmap = maps[Player.mapX][Player.mapY].data;

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

//Triggered on space
//
//Interact with anything you can interact with
function doAction(){
    var vis = false;
    var obj;
    for (i in Objects.all("Interactable")){
        obj = Objects.all("Interactable")[i];
        if (obj.canInteract(Player)){
            vis = true;
            $("#action-text").html(obj.getText());
            if (globals.keysOnce.getKey(32)) { 
                obj.action();
            }
        }
    }
    
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


    for (var i in Objects.all("Drawable")){
        Objects.all("Drawable")[i].render(globals.context);
    }

    if (Game.dialog){ 
        Game.dialog.render();
    }

    renderTile(Player.x, Player.y, "p");

}

function initialize(){
    var c = new Character(5, 5, 0);
    var i = new Item(50, 50, 0);

    var map = new Map();
    map.load(1,1);


    globals.context = document.getElementById('main').getContext('2d');

    for (var i=0;i<255;i++) globals.keys[i]=false;

    $(document).keydown(function(e){ console.log(e.which); globals.keys[e.which] =  true;});
    $(document).keyup(  function(e){ globals.keys[e.which] = false;});

    setInterval(gameLoop, 15);
}

$(function(){ 
    //These should be chained for maximum nonbuggness.
    globals.itemsheet = new SpriteSheet("graphics/itemsheet.png", 16, function(){ 

        globals.sheet = new SpriteSheet("graphics/spritesheet.png", 16, initialize)

    });
});
