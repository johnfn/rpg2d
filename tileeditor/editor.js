var selTile = [0,0,"DN"];
var dragging = false;
var toolboxPos    = [];
var maps       = {};

var curObj;


var startdrag  = {x:0, y:0};
var enddrag    = {x:0, y:0};

var usedIDs    = {};
var lastID     = 0;

function getUniqueID(){
    return lastID++;
}

function selectAddItem(itm){
    $("#maplist").html(
            $("#maplist").html() + 
            '<option id="' + itm + '">' + itm + '</option>'
            );
}

function switchToMap(which){
    curObj = maps[which]; 
}

function createNewMap(){
    curObj         = {};
    var curMapID   = getUniqueID();

    curObj.map        = [];
    curObj.oldmap     = [];
    curObj.special    = [];

    maps[curMapID] = curObj;

    for (var i=0;i<globals.tilesWide;i++){
        curObj.map.push([]);
        curObj.special.push([]);
        for (var j=0;j<globals.tilesWide;j++){
            curObj.map[i].push([0,0,"DN"]);
            curObj.special[i].push([1,0,"ED"]);
        }
    }

    selectAddItem(curMapID);
}

function drag(){
    if (!dragging){
        //just started dragging

        startdrag  = {x:globals.mouseX, y:globals.mouseY};
    }

    enddrag = {x:globals.mouseX, y:globals.mouseY};

    globals.context.strokeRect(Math.min(startdrag.x, enddrag.x), Math.min(startdrag.y, enddrag.y), Math.abs(startdrag.x-enddrag.x), Math.abs(startdrag.y - enddrag.y)); 
}

function click(){
    var editedmap = [];
    if (selTile[2] == "ED"){
        editedmap = curObj.special;

    } else {
        editedmap = curObj.map;
    }

    var returnFlag = false;

    if (enddrag.x - startdrag.x == 0 && enddrag.y - startdrag.y == 0){
        //Special case: travelling to other map when you click on it
        if (selTile[2] == "ED" && selTile[0] == 2 && selTile[1] == 0){
            if (selTile[3] == editedmap[Math.floor(x / globals.tileWidth)][Math.floor(y / globals.tileWidth)][3]){
                console.log("travelling nao");
            }
        }
    }

    curObj.oldmap = JSON.parse(JSON.stringify(curObj.map));
    for (var x = Math.min(enddrag.x, startdrag.x); x <= Math.max(enddrag.x, startdrag.x); x += 16){
        for (var y = Math.min(enddrag.y, startdrag.y); y <= Math.ceil(Math.max(enddrag.y, startdrag.y)/16) * 16; y += 16){
            if (x < globals.tileWidth * globals.tilesWide &&
                y < globals.tileWidth * globals.tilesWide ){
                

                editedmap[Math.floor(x / globals.tileWidth)][Math.floor(y / globals.tileWidth)] = JSON.parse(JSON.stringify(selTile));
                returnFlag = true;
            }
        }
    }

    if (returnFlag) return;

    var pos = 0;
    for (var i in Sprites.getOrderedList()){
        if (utils.pointIntersectRect(globals.mouseX, globals.mouseY, utils.makeRect(toolboxPos[i][0], toolboxPos[i][1], globals.tileWidth))){
            selTile = JSON.parse(JSON.stringify(Sprites.getNth(i)));
            if (selTile[2] == "ED" && selTile[0] == 2 && selTile[1] == 0){
                //special case: map transition tile
                selTile.push(prompt("Which room to link to?")); 
            }
        }
        ++pos;
    }
}

function gameLoop(){
    if (globals.ticks++ % 4) {
        drawScreen();
    }
    if (globals.mousedown) { 
        drag();
        dragging = true;
    } 
    if (!globals.mousedown && dragging) {
        click();
        dragging = false;
    }
    if (globals.keys[90]){
        //undo
        var temp = oldmap;
        oldmap = curObj.map;
        curObj.map = temp;
        globals.keys[90] = false;
    }
}


function drawScreen(){
    globals.context.clearRect(0,0,globals.maxSize,globals.maxSize);

    for (var i=0;i<globals.tilesWide;i++){
        for (var j=0;j<globals.tilesWide;j++){
            Sprites.renderImage(globals.context, i*globals.tileWidth, j*globals.tileWidth, curObj.map[i][j][0], curObj.map[i][j][1], curObj.map[i][j][2]); 
        }
    }


    //render special editor specific things on top
    for (var i=0;i<globals.tilesWide;i++){
        for (var j=0;j<globals.tilesWide;j++){
            if (curObj.special[i][j][0] == 1 && curObj.special[i][j][1] == 0) continue;
            Sprites.renderImage(globals.context, i*globals.tileWidth, j*globals.tileWidth, curObj.special[i][j][0], curObj.special[i][j][1], curObj.special[i][j][2]); 
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
    //bind event to the select box
    $("#maplist").change(function(e){
        switchToMap($("#maplist option:selected").text());
    });

    $("#newroom").click(function(){
        createNewMap();
    });
    createNewMap();
    globals.context = document.getElementById('main').getContext('2d');
    $("#btn").click(function(){
        /*
        var out = "data : [\n";
        for (var i=0;i<curObj.map.length;i++){
            out += "[";
            for (var j=0;j<curObj.map.length;j++){ 
                out += "["+  curObj.map[i][j][0] + "," + curObj.map[i][j][1] + ",'" + curObj.map[i][j][2] + "'], " ; //Not IE compliant, but screw IE
            }
            out += "], \n"; //Still not IE compliant
        }
        out += "]\n";

        out += "special : [\n";

        for (var i=0;i<curObj.map.length;i++){
            out += "[";
            for (var j=0;j<curObj.map.length;j++){ 

                if (curObj.special[i][j][0] == 1 && curObj.special[i][j][1] == 0) {

                    out += "[0], " ; 
                    continue;
                }
                out += "["+  curObj.special[i][j][0] + "," + curObj.special[i][j][1] + ",'" + curObj.special[i][j][2] + "'], " ; 
            }
            out += "], \n";
        }
        out += "]\n";
        */

        $("#txt").val("var maps = " + JSON.stringify(maps));
    });

    $("#lbtn").click(function(){
        var data = $("#txt").val();
        //Parse out unnecessary details
        if (data.indexOf("{") != -1){
            data = data.substr(data.indexOf("{"));
        }
        data = data.substr(data.indexOf("["));
        if (data.lastIndexOf(",") > data.lastIndexOf("]")){
            data = data.substring(0, data.lastIndexOf(",")); 
        }
        curObj.map = eval(data); //horror music plays

    }); 

    setInterval(gameLoop, 5);


    //Store toolbox positions in memory

    var toolWidth = 25;
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


    Sprites.loadSpriteFile("editor", function(){
        Sprites.loadSpriteFile("dungeon", function(){
            Sprites.loadSpriteFile("outside_normal", initialize);    
            
        });
    });
});
