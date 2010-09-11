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

    this.interact = function(player){ 
        var di = (player.x - this.x) * (player.x - this.x) +
                 (player.y - this.y) * (player.y - this.y) ;

        if (di < this.distToInteract){
            return this.msg;
        }
    }

    this.action = function(){
        console.log("AN ACTION HOLY CRAP");
    }
};

Interactable.all = [];
