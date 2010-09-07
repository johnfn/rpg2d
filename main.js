var maps = {};
for (var i=0;i<10;i++) {
    maps[i] = [];
    for (var j=0;j<10;j++) {
        maps[i][j] = [];
    }
}

maps[1][1]= [ 
    "00000000000000000000",
    "00001111111111110000",
    "00000000000000010000",
    "00000000000000010000",
    "00000000000000010000",
    "00000000000000010000",
    "00000000000000010000",
    "00000000000000010000",
    "00000000000000010000",
    "00000000000000010000",
    "00000000000000010000",
    "00000000000000010000",
    "00000000000000000000",
    "00000000000000000000",
    "00000000000000000000",
    "00000000000000000000",
    "00000000000000000000",
    "00000000000000000000",
    "00000000000000000000",
    "00000000000000000000",
        ];

maps[2][1]= [ 
    "00000000000000000000",
    "00011000000000000000",
    "00011000000000000000",
    "00011000000000000000",
    "00011000000000000000",
    "00011000000000000000",
    "00011000000000000000",
    "00011000000000000000",
    "00011000000000000000",
    "00011000000000000000",
    "00011000000000000000",
    "00011000000000000000",
    "00011000000000000000",
    "00000000000000000000",
    "00000000000000000000",
    "00000000000000000000",
    "00000000000000000000",
    "00000000000000000000",
    "00000000000000000000",
    "00000000000000000000",
        ];

var cmap;

var Player = {
    speed : 1,
    mapX  : 1,
    mapY  : 1,
    x     : 5,
    y     : 5,
    width : 15,
};

function gameLoop(){
    cmap = maps[Player.mapX][Player.mapY];
    getKeys();
    if (globals.ticks++ % 8) {
        drawScreen();
    }
}


function getKeys(){
    movePlayer();
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
