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
    this.init = function(x, y, distToInteract, msg){
        this.x=x;
        this.y=y;
        this.distToInteract=distToInteract;
        this.msg = msg || "LOL";
        
        Interactable.all.push(this);
    }

    this.canInteract = function(player){ 
        var di = (player.x - this.x) * (player.x - this.x) +
                 (player.y - this.y) * (player.y - this.y) ;

        return (di < this.distToInteract);
    }

    this.getText = function(){
        return "Stuffsauce";
    }

    //this.action = blah...

    //TODO: This should be implemented by the base class
};

Interactable.all = [];

function Talkable(){
    this.init = function(ID){
        this.ID = ID;
    }

    this.action = function(){
        Game.mode = Modes.DIALOG;
        Game.dialog = Dialog(this.ID); 
    }

};

function Drawable(){
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

    /*
                i*globals.tileWidth, 
                j*globals.tileWidth, 
                cmap[i][j][0], 
                cmap[i][j][1]
                */
    this.render = function(ctx){

        globals.sheet.renderImage(
                ctx, 
                this.x, 
                this.y, 
                this.spritex,
                this.spritey
                ); 
    }

};

Drawable.all = [];
