(function(){

    var _DEBUG_UNDRAW = false;

    Partition.engines.raphael_mixin.undraw = function(box){
        if (_DEBUG_UNDRAW) {
            console.log("undrawing ", box.name, "element", box.element)
        }
        if (box.element) {
            box.element.attr("opacity", 0);
            box.element.hide();
            box.element.remove();
            delete box.element
        } else {
            if (_DEBUG_UNDRAW)console.log(" ... no element to undraw")
        }
    }
    
    
})()