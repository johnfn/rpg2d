var selTile = "1";

var toolboxPos = [];
var map = [];
for (var i=0;i<globals.tilesWide;i++){
    map.push([]);
    for (var j=0;j<globals.tilesWide;j++){
        map[i].push([0,0,"DN"]);
    }
}



function click(){
    if (globals.mouseX < globals.tileWidth * globals.tilesWide &&
        globals.mouseY < globals.tileWidth * globals.tilesWide ){
        
        map[Math.floor(globals.mouseX / globals.tileWidth)][Math.floor(globals.mouseY / globals.tileWidth)] = selTile;
    }
    var pos = 0;
    for (var i in Sprites.getOrderedList()){
        if (utils.pointIntersectRect(globals.mouseX, globals.mouseY, utils.makeRect(toolboxPos[i][0], toolboxPos[i][1], globals.tileWidth))){
            selTile = Sprites.getNth(i);
        }
        ++pos;
    }
}

function gameLoop(){
    if (globals.ticks++ % 4) {
        drawScreen();
    }
    if (globals.mousedown) { 
        click();
    }
}


function drawScreen(){
    globals.context.clearRect(0,0,globals.maxSize,globals.maxSize);

    for (var i=0;i<globals.tilesWide;i++){
        for (var j=0;j<globals.tilesWide;j++){
            Sprites.renderImage(globals.context, i*globals.tileWidth, j*globals.tileWidth, map[i][j][0], map[i][j][1], map[i][j][2]); 
        }
    }

    //Render highlighted square

    if (globals.mouseX < globals.tileWidth * globals.tilesWide &&
        globals.mouseY < globals.tileWidth * globals.tilesWide ){

        utils.renderTile(Math.floor(globals.mouseX / globals.tileWidth)*globals.tileWidth, Math.floor(globals.mouseY / globals.tileWidth)*globals.tileWidth, "H");
    }

    //Render 'toolbox'
    
    var toolWidth = 15;
    var pos = 0;
    for (var i in Sprites.getOrderedList()){
        if (selTile == i){
            globals.context.fillStyle = "ffff11";

            globals.context.fillRect((pos % toolWidth)*(globals.tileWidth+4)-2,
                                     globals.tileWidth* (globals.tilesWide)-2 + (Math.floor(i/toolWidth)) * 20, 
                                     globals.tileWidth+4, 
                                     globals.tileWidth+4);
        }

        Sprites.renderImage(globals.context, 
                                  toolboxPos[pos][0], 
                                  toolboxPos[pos][1], 
                                  Sprites.getNth(i)[0], 
                                  Sprites.getNth(i)[1], 
                                  Sprites.getNth(i)[2]);
        ++pos;
    }
}

function initialize(){
    globals.context = document.getElementById('main').getContext('2d');
    $("#btn").click(function(){
        var out = "var map = [\n";
        for (var i=0;i<map.length;i++){
            out += "[";
            for (var j=0;j<map.length;j++){ 
                out += "["+  map[i][j][0] + "," + map[i][j][1] + ",'" + map[i][j][2] + "'], " ; //Not IE compliant, but screw IE
            }
            out += "], \n"; //Still not IE compliant
        }
        out += "]";
        $("#txt").val(out);
    });

    setInterval(gameLoop, 5);


    //Store toolbox positions in memory

    var toolWidth = 15;
    var pos = 0;


    for (var i in Sprites.getOrderedList()){
        toolboxPos.push([
                           (i % toolWidth  )*(globals.tileWidth+4), 
                           (globals.tileWidth)*(globals.tilesWide  ) + (Math.floor(i/toolWidth)) * 20, 
                       ]);
    }



}

$(function(){ 
/*var spriteFiles = {
    "outside_normal" : "GR",
    "dungeon"        : "DN",*/


    Sprites.loadSpriteFile("dungeon", function(){
        Sprites.loadSpriteFile("outside_normal", initialize);    
        
    });
});
