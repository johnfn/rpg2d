var Inventory = {
    size:      10,
    itemCount: 0,
    items : [],
    //this.resize = function blarg
    init : function(){

    },
    //return true on success, false on failure
    addItem : function(i){
        if (this.itemCount == this.size) return false;

        this.items.push(i);
        
        this.itemCount++;

        return true;
    },

    removeItem : function(i){
        //Will I ever even do this? 
        //
        //Hm.
    },

    render : function(){
        var str = "";
        for (var i in this.items){
            str += this.items[i].type + "<br />";
        }
        $("#inventory-text").html(str);
    },

};

Inventory.init();
