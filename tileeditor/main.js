var selTile = "1";

var toolboxPos = [];
var map = [];
for (var i=0;i<globals.tilesWide;i++){
    map.push([]);
    for (var j=0;j<globals.tilesWide;j++){
        map[i].push("0");
    }
}



function click(){
    if (globals.mouseX < globals.tileWidth * globals.tilesWide &&
        globals.mouseY < globals.tileWidth * globals.tilesWide ){
        
        map[Math.floor(globals.mouseX / globals.tileWidth)][Math.floor(globals.mouseY / globals.tileWidth)] = selTile;
    }
    var pos = 0;
    for (var i in globals.sheet.tiles){
        if (utils.pointIntersectRect(globals.mouseX, globals.mouseY, utils.makeRect(toolboxPos[i][0], toolboxPos[i][1], globals.tileWidth))){
            selTile = i;
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
            globals.sheet.renderImage(globals.context, i*globals.tileWidth, j*globals.tileWidth, globals.sheet.tiles[map[i][j]][0], globals.sheet.tiles[map[i][j]][1]); 
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
    for (var i in globals.sheet.tiles){
        if (selTile == i){
            globals.context.fillStyle = "ffff11";

            globals.context.fillRect((pos % toolWidth)*(globals.tileWidth+4)-2,
                                     globals.tileWidth* (globals.tilesWide)-2 + (Math.floor(i/toolWidth)) * 20, 
                                     globals.tileWidth+4, 
                                     globals.tileWidth+4);
        }

        globals.sheet.renderImage(globals.context, 
                                  (pos % toolWidth)*(globals.tileWidth+4), 
                                  globals.tileWidth*(globals.tilesWide) + (Math.floor(i/toolWidth)) * 20, 
                                  globals.sheet.tiles[i][0], 
                                  globals.sheet.tiles[i][1]); 
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
                out += "["+  globals.sheet.tiles[map[i][j]] + "], " ; //Not IE compliant, but screw IE
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


    for (var i in globals.sheet.tiles){
        toolboxPos.push([
                           (i % toolWidth  )*(globals.tileWidth+4), 
                           (globals.tileWidth)*(globals.tilesWide  ) + (Math.floor(i/toolWidth)) * 20, 
                       ]);
    }



}

$(function(){ 
    globals.sheet = new SpriteSheet("../graphics/spritesheet.png", 16, initialize)
});
