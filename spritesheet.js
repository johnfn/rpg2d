function SpriteSheet(sheet, size, callback){
    this.img = new Image();
    this.img.src = sheet;
    this.cache = [];
    this.tiles = [];
    this.spriteW = 8;

    //CLOSING TIME
    var cache = this.cache;
    var img = this.img; 

    this.imgLoad = 
        function(){
            //cache some tiles
            //

            var seenBefore = {};

            for (var i=0;i<this.spriteW;i++){
                this.cache.push([]);
                for (var j=0;j<this.spriteW;j++){
                    var buff = document.createElement('canvas');
                    buff.width = 16;
                    buff.height = 16;
                    buff.getContext('2d').drawImage(this.img, i*17, j*17, 16, 16, 0, 0, 16, 16);

                    var data  = "";
                    var idata = buff.getContext('2d').getImageData(0,0,16,16).data;
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
