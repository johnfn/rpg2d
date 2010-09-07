var map = [ 
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

var Player = {
    speed : 1,
    x     : 5,
    y     : 5,
    width : 15,
};

function gameLoop(){
    getKeys();
    if (globals.ticks++ % 4) {
        drawScreen();
    }
}


function getKeys(){
    movePlayer();
}

function canMoveHere(x, y, w){
    if (x < 0 || x > (globals.tileWidth - 1) * globals.tilesWide ||
        y < 0 || y > (globals.tileWidth - 1) * globals.tilesWide ) 
        return false;

    var points = utils.getRectPoints(x, y, w);

    for (var p in points){
        if (map[Math.floor(points[p].x/globals.tileWidth)][Math.floor(points[p].y/globals.tileWidth)] == "1"){
            return false;
        }
    }

    return true;
}

function movePlayer(){
    var newPos = { 
        x : Player.x,
        y : Player.y,
    };
    newPos.x += (globals.keys[68] - globals.keys[65])*Player.speed;
    if (!canMoveHere(newPos.x, newPos.y, Player.width))
        newPos.x = Player.x;

    newPos.y += (globals.keys[83] - globals.keys[87])*Player.speed;
    if (!canMoveHere(newPos.x, newPos.y, Player.width))
        newPos.y = Player.y;

    Player.x = newPos.x;
    Player.y = newPos.y;

}

function renderTile(x, y, color){
    globals.context.fillStyle = globals.colors[color];

    globals.context.fillRect(x, y, globals.tileWidth, globals.tileWidth);
}

function drawScreen(){
    globals.context.clearRect(0,0,globals.maxSize,globals.maxSize);

    for (var i=0;i<globals.tilesWide;i++){
        for (var j=0;j<globals.tilesWide;j++){
            renderTile(i*globals.tileWidth, j*globals.tileWidth, map[i][j]);
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

    setInterval(gameLoop, 5);
});
