var ItemInfo = {
    0 : {
            type : "Weapon",
        },

    1 : {
            type : "Armor",
        },

    2 : { 
            type : "Bomb",
        },

};


function Item(x, y, ID){
    this.type = ItemInfo[ID].type; 

    this.action = function(){
        if (Inventory.addItem(this)){ 
            Objects.remove(this);
        } 
    }
    decorate(this, new Interactable(), [x, y, 600]);
    decorate(this, new Drawable(), [x, y, 7, globals.itemsheet, 0, 0]); 
    decorate(this, new Trackable(), []);
}

