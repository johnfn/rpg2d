var selTile = "1";
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
    for (var i in globals.colors){
        if (utils.pointIntersectRect(globals.mouseX, globals.mouseY, utils.makeRect(pos*(globals.tileWidth+4), globals.tileWidth * (1 + globals.tilesWide), globals.tileWidth))){
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
            utils.renderTile(i*globals.tileWidth, j*globals.tileWidth, map[i][j]);
        }
    }

    //Render highlighted square

    if (globals.mouseX < globals.tileWidth * globals.tilesWide &&
        globals.mouseY < globals.tileWidth * globals.tilesWide ){

        utils.renderTile(Math.floor(globals.mouseX / globals.tileWidth)*globals.tileWidth, Math.floor(globals.mouseY / globals.tileWidth)*globals.tileWidth, "H");
    }

    //Render 'toolbox'
    
    var pos = 0;
    for (var i in globals.colors){
        if (selTile == i){
            globals.context.fillStyle = "ffff11";

            globals.context.fillRect(pos*(globals.tileWidth+4)-2,
                                     globals.tileWidth* (1+globals.tilesWide)-2, 
                                     globals.tileWidth+4, 
                                     globals.tileWidth+4);
        }
        utils.renderTile(pos*(globals.tileWidth+4), globals.tileWidth* (1 + globals.tilesWide), ""+i);
        ++pos;
    }
}

function initialize(){
    globals.context = document.getElementById('main').getContext('2d');
    $("#btn").click(function(){
        var out = "var map = [\n";
        for (var i=0;i<map.length;i++){
            out +="    ['";
            for (var j=0;j<map.length;j++){ 
                out += map[i][j];
            }
            out += "']\n";
        }
        out += "          ];";
        $("#txt").val(out);
    });
}

$(function(){ 
    initialize();

    setInterval(gameLoop, 5);
});
