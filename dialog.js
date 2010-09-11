var DTYPE = 0;
var DWORDS = 1;
var DNEXT = 2;
function Dialog(ID){ 
    if (this instanceof Dialog === false) {
        return new Dialog(ID);
    }

    this.visible = true;
    this.curPos = 0;
    this.dialogInfo = {
        "talk" : "Space to continue.",
        "end"  : "Space to conclude.",
        "ask"  : "<span class='white'>Y</span>es or <span class='white'>N</span>o.",
    };

    this.hideDialog = function(){
        this.visible=false;
    }

    this.nextDialog = function(response){
        if (this.data[this.curPos][DTYPE] == "end") {
            this.visible=false;
            return false;
        }
        if (this.data[this.curPos][DNEXT]["default"]){
            this.curPos = this.data[this.curPos][DNEXT]["default"]; 
        }

        if (this.data[this.curPos][DNEXT]["yes"] && response == "y"){
            this.curPos = this.data[this.curPos][DNEXT]["yes"]; 
        }

        if (this.data[this.curPos][DNEXT]["no"] && response == "n"){
            this.curPos = this.data[this.curPos][DNEXT]["no"]; 
        }

        while (this.data[this.curPos][DTYPE]== "action") {
            var func = this.data[this.curPos][DWORDS]; 
            this.curPos = this.data[this.curPos][DNEXT][func()+""]; 
        }

        var res = this.data[this.curPos][DTYPE];

        $("#dialog-info").html(this.dialogInfo[res]);

        return true; 
    }
    this.render = function(){
        if (this.visible) { 
            $("#dialog").css("display", "block");
        } else { 
            $("#dialog").css("display", "none");
        }
        this.text = this.data[this.curPos][DWORDS];
        $("#dialog-text").html(this.text);
    }

    this.init = function(){
        if (!Dialog.lastPos[ID])
            Dialog.lastPos[ID]=0;
        this.curPos = Dialog.lastPos[ID];
        this.data = Dialogs.data[ID];
    }

    this.init();

}
Dialog.lastPos = {};
