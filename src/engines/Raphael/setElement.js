(function(){

    var _DEBUG_UNDRAW = false;

    Partition.engines.raphael_mixin.setElement = function(element, width, height){
        if (_.isString(element)){
            element = $('body').find(element)[0];
        }
        if (!element instanceof HTMLElement){
            throw new Error('engine must be passed domElement or css to dom element')
        }

        if (arguments.length < 2){
            width = $(element).width();
            height = $(element).height();
        }

        this.element = element;

        try {
            this.paper = new Raphael(element, width, height);
        } catch(err){
            console.log('cannot make raphael paper from element');
        }
    }
    
    
})()