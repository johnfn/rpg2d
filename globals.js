var spriteAbbr = {
    "editor"         : "ED",
    "outside_normal" : "GR",
    "dungeon"        : "DN",

    //...
};

var globals = {
    context     : undefined,
    sheet       : undefined,
    itemsheet   : undefined,
    maxSize     : 500,
    tilesWide   : 20,
    tileWidth   : 16,
    colors      : undefined,
    keys        : [],
    ticks       : 0,
    mouseX      : 0,
    mouseY      : 0,
    mapWidth    : 0,
    mousedown   : false,
    keysOnce    : {
                    keys : [],
                    setKey: function(k){
                        this.keys[k] = true;
                    },
                    getKey: function(k){
                        if (this.keys[k]){
                            this.keys[k] = false;
                            return true;
                        }
                        return false;
                    },
                },
};

globals.mapWidth = (globals.tilesWide - 1) * globals.tileWidth;

for (var i=0;i<255;i++) globals.keys[i]=false;

globals.colors = {
    "H" : "000000", //Highlighted square; map editor only. At least probably.
};


var Modes = {
    NORMAL : 0,
    DIALOG : 1,
};

var Game = {
    mode        : Modes.NORMAL,
    dialog      : undefined, 
};



function handlers(){ 
    $(document).mousedown(
        function(e){
            globals.mousedown = true;
        }
    );
    $(document).mouseup(
        function(e){
            globals.mousedown = false;
        }
    );

    $(document).mousemove(
        function(e){
            globals.mouseX = e.pageX-9;
            globals.mouseY = e.pageY-9;
        }
    );

    $(document).keydown(
        function(e){ 
            console.log(e.which); 
            globals.keys[e.which] =  true;
            globals.keysOnce.setKey(e.which);
        }
    );

    $(document).keyup(
        function(e){ 
            globals.keys[e.which] = false;
        }
    );
}


var utils = {
    getSpriteDir:
        function (nm){
            return "../graphics/"+nm+".png";
        }, 
    makeRect:
        function(x1, y1, x2, y2){
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
        },
    renderTile:
        function (x, y, color){
            if (color == "H"){
                globals.context.globalAlpha = 0.4;
            }
            globals.context.fillStyle = globals.colors[color];

            globals.context.fillRect(x, y, globals.tileWidth, globals.tileWidth);
            globals.context.globalAlpha = 1;
        },
    removeObj:
        function (arr, obj){
            for (x in arr){
                if (arr[x] == obj){
                    arr.splice(x, 1);
                    break;
                }
            }
            return arr;
        },

};


handlers();
