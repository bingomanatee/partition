(function () {

    function Engine(element) {
        this.setElement(element);
        _.extend(this, Backbone.Events);
        if (this.events) {
            _.each(this.events, function (handler, name) {
                this.on(name, handler, this);
            }, this);
        }
    }

    function _makeSVGcrisp(node) {
        var det = Partition.browserDetect();
        if (!(det.browser == "Explorer" && det.browser.version <= 8)) {
            node.node.setAttribute("style", 'shape-rendering: crispEdges')
        }
    }

    Engine.prototype = {

        setElement: function (element) {
            throw new Error('must implement set_element');
        },

        clear: function () {
            throw new Error('must implement clear');
        },

        undraw: function (box) {
            throw new Error('must implement undraw');
        },

        polygon: function (box) {
            throw new Error('must implement polygon');
        },

        rect: function (box) {
            throw new Error('must implement rect');
        },

        wedge: function (box) {
            throw new Error('must implement wedge');
        },

        circle: function (box) {
            throw new Error('must implement wedge');
        }

    };

    Partition.engines = {

        raphael: function (params) {
            if (!Partition.engines._Raphael) {
                Partition.engines._Raphael = Partition.engines.make_engine(Partition.engines.raphael_mixin);
            }
            return new Partition.engines._Raphael(params);
        },

        canvas: function (params) {
            if (!Partition.engines._Canvas) {
                Partition.engines._Canvas = Partition.engines.make_engine(Partition.engines.canvas_mixin);
            }
            return new Partition.engines._Canvas(params);
        },

        make_engine: function (mixin) {

            var new_engine = function (element) {
                Engine.call(this, element);
            };

            _.extend(new_engine.prototype, Engine.prototype);
            _.extend(new_engine.prototype, mixin);

            return new_engine;
        },

        raphael_mixin: {
            events: {
                afterDraw: function (slice) {
                    if (slice.element) _makeSVGcrisp(slice.element);
                }
            }

        },

        canvas_mixin: {
            events: {
                'afterDraw': function (slice) {
                    console.log('canvas afterDraw');
                    slice.draw_engine.stage.update();
                }
            }


        }

    };
})();