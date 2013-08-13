(function(){

    var _DEBUG_UNDRAW = false;

    var _canvas = _.template('<canvas width="<%= width %>" height="<%= height %>"></canvas>');

    Partition.engines.canvas_mixin.setElement = function(element, width, height){
        if (_.isString(element)){
            element = $('body').find(element)[0];
        }
        if (!element instanceof HTMLElement){
            throw new Error('engine must be passed domElement or css to dom element')
        }
        console.log('canvas element: ', element);
        var j = $(element);

        if (!j.is('canvas')){
            j.html(_canvas({width: j.width(), height: j.height()}));
            element = j.find('canvas')[0];
        }

        if (arguments.length < 2){
            width = $(element).width();
            height = $(element).height();
        }

        this.element = element;

        this.stage = new createjs.Stage(this.element);
    }
    
    
})()