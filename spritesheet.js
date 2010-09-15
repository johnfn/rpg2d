

// Takes as arguments: Dict of files to use as spritesheets mapped to their shortcut,
// size of individual sprite, callback fn



//ex sheets var:
//
//
function SpriteSheet(sheets, size, callback){
    this.img = new Image();
    this.img.src = sheet;
    this.cache = [];
    this.tiles = [];
    this.spriteW = 20;

    //CLOSING TIME
    var cache = this.cache;
    var img = this.img; 

    this.imgLoad = 
        function(){
            //cache some tiles (this code makes sure not to load the same tile twice)
            //

            var seenBefore = {};

            for (var i=0;i<this.spriteW;i++){
                this.cache.push([]);
                for (var j=0;j<this.spriteW;j++){
                    var buff = document.createElement('canvas');
                    buff.width = globals.tileWidth;
                    buff.height = globals.tileWidth;
                    buff.getContext('2d').drawImage(this.img, i*globals.tileWidth, j*globals.tileWidth, globals.tileWidth, globals.tileWidth, 0, 0, globals.tileWidth, globals.tileWidth);

                    var data  = "";
                    var idata = buff.getContext('2d').getImageData(0,0,globals.tileWidth,globals.tileWidth).data;
                    for (x in idata){
                        data += idata[x];
                    }

                    if (!seenBefore[data]){ 
                        this.cache[i].push(buff);
                        seenBefore[data] = true;

                        this.tiles.push( [i,j]) 
                    } else {
                        this.cache[i].push(undefined);
                    }
                }
            }

            callback();
        };

    var thisObj = this;
    this.img.onload = function(){
        thisObj.imgLoad();
    }
    this.renderImage = function(ctx, x, y, tx, ty){
        ctx.drawImage(this.cache[tx][ty], x, y);

    }
}

function loadFilesToSheet(files, sheet){




} 
