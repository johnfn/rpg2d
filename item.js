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


function Item(ID){
    this.type = ItemInfo[ID]; 

}
