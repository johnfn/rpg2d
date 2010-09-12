/*
 * Add methods from decorator to obj.
 */

function decorate(objToDecorate, decorator, initargs){
    
    for (func in decorator){
        if (typeof decorator[func] == "function") { 
            if (objToDecorate[func]){
                console.log("MEGA ERROR");
            }
                
            objToDecorate[func] = decorator[func];
        } 

    }
    if (decorator["init"]) 
        objToDecorate["init"].apply(objToDecorate, initargs);

    return objToDecorate;
}


/*
 * Trackables
 *
 * Sometimes, it's convienant to be able to go Interactable.all()
 *
 */

/*
 * "Static" Tracker object.
 */
var Objects = {
    all       :
    function(type){
        debugger;
        console.log(Objects.arrays[type]);
    },

    arrays    : {},

    removeAll : 
    function(){

    },

};

/*
 * Trackable decorator.
 *
 * YES. They need to be separate. This took me ages to figure out. 
 */
function Trackable(){
    this.init = function(){
        if (!Objects.arrays[ this.constructor.name ]){
            Objects.arrays[ this.constructor.name ] = [];
        }
        Objects.arrays[ this.constructor.name ].push(this);
    };

    this.remove = function(f){

    };
}
Trackable.arrays = {};


/*
 * Removeables
 *
 * Objects that can be removed (depriving them of their other decorators).
 *
 * This code hurts my head. Please be nice.
 */

function Removeable(){
    this.remove = function(){

            /*
        for (var f in this.decorators){
            console.log(this.decorators[f]);
        }

            removeObj:
                function (arr, obj){
                }
            */
    }
};


/*
 * Interactables
 *
 * Objects that, if you were to walk up to, would display a message
 * on the action icon.
 *
 * More, if you pressed space, something would happen.
 *
 * This is only to be used as a decorator to other objects.
 */

function Interactable(){
    this.tracks = true;

    this.init = function(x, y, distToInteract, msg){
        this.x=x;
        this.y=y;
        this.distToInteract=distToInteract;
        this.msg = msg || "LOL";

    }

    this.canInteract = function(player){ 
        var di = (player.x - this.x) * (player.x - this.x) +
                 (player.y - this.y) * (player.y - this.y) ;

        return (di < this.distToInteract);
    }

    this.getText = function(){
        return this.msg;
    }
};

//Interactable.all = [];

function Talkable(){
    this.tracks = true;

    this.init = function(ID){
        this.ID = ID;
    }

    this.action = function(){
        Game.mode = Modes.DIALOG;
        Game.dialog = Dialog(this.ID); 
    }

};

/*
 * Drawables
 *
 * Objects that you can see ingame.
 */

function Drawable(){
    this.tracks = true;

    this.init = function(x, y, z, spritesheet, spritex, spritey){
        this.x = x;
        this.y = y;
        this.z = z; //For ordering top to bottom.

        this.spritesheet = spritesheet;
        this.spritex = spritex;
        this.spritey = spritey;

        Drawable.all.push(this);

        Drawable.all.sort( function(a, b) { return a.z - b.z; } ); //Draw in order of z
    }

    this.render = function(ctx){

        this.spritesheet.renderImage(
                ctx, 
                this.x, 
                this.y, 
                this.spritex,
                this.spritey
                ); 
    }

};

Drawable.all = [];

