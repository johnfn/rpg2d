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
