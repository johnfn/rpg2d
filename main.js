var globals = {
    context   : undefined,
    maxSize   : 500,
    tilesWide : 20,
    tileWidth : 16,
    colors    : undefined,
    keys      : [],
    ticks     : 0,
};

globals.colors = {
    "0" : "CCCCCC",
    "1" : "222222",
    "p" : "5555ff",
};

var utils = {
    makeRect:
        function(x1, y2, x2, y2){
            var rect;
            if (y2 != undefined) { 
                /*
                 * Top left, bottom right
                 */
                if (x1 > x2) {
                    var t = x1; x1 = x2; x2 = t;
                }
                if (y2 > y1) { 
                    var t = y2; y2 = y1; y1 = t;
                }
                rect = {
                    x1 : x1,
                    x2 : x2,
                    y1 : y1,
                    y2 : y2,
                };
            } else {
                /* 
                 * X position, Y position, size.
                 */
                rect = {
                    x1 : x1,
                    y1 : y1,
                    x2 : x1+x2,
                    y2 : y1+x2,
                };
            }
            return rect;
        },
    pointIntersectRect:
        function(x, y, rect){
            return (x > rect.x1 && x < rect.x2 &&
                    y > rect.y1 && y < rect.y2 )

        },
    getRectPoints:
        function (x, y, w){
            w = w || globals.tileWidth;
            return [
                     {x: x  , y: y  }, 
                     {x: x  , y: y+w}, 
                     {x: x+w, y: y  },  
                     {x: x+w, y: y+w}, 
                   ];

        },
    rectIntersectRect:
        function (rect1, rect2){
            return utils.pointIntersectRect(rect1.x1, rect1.y1, rect2) ||
                   utils.pointIntersectRect(rect1.x1, rect1.y2, rect2) ||
                   utils.pointIntersectRect(rect1.x2, rect1.y1, rect2) ||
                   utils.pointIntersectRect(rect1.x2, rect1.y2, rect2) ;
        }
};

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

function collideWithObject(x, y, w){
    var points = utils.getRectPoints(x, y, w);

    for (var p in points){
        if (map[Math.floor(points[p].x/globals.tileWidth)][Math.floor(points[p].y/globals.tileWidth)] == "1"){
            return true;
        }
    }
    
}

function movePlayer(){
    var newPos = { 
        x : Player.x,
        y : Player.y,
    };
    newPos.x += (globals.keys[68] - globals.keys[65])*Player.speed;
    if (collideWithObject(newPos.x, newPos.y, Player.width))
        newPos.x = Player.x;

    newPos.y += (globals.keys[83] - globals.keys[87])*Player.speed;
    if (collideWithObject(newPos.x, newPos.y, Player.width))
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
