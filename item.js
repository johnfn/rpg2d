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

    decorate(this, new Interactable(), [x, y, 600]);
    decorate(this, new Drawable(), [x, y, 7, globals.sheet, 1, 1]); 
}

