(function(){

    function Engine(params){
        _.extend(this, params);
    }

    Engine.prototype = {

        clear: function(){
            throw new Error('must implement clear');
        },

        undraw: function(box){
          throw new Error('must implement undraw');
        },

        polygon: function(box){
            throw new Error('must implement polygon');
        },

        rect: function(box){
            throw new Error('must implement rect');
        },

        wedge: function(box){
            throw new Error('must implement wedge');
        },

        circle: function(box){
            throw new Error('must implement wedge');
        }

    };

    Partition.engines = {

        raphael: function(params){
            if (!Partition.engines._Raphael){
                Partition.engines._Raphael = Partition.engines.make_engine(Partition.engines.raphael_mixin);
            }
            return new Partition.engines._Raphael(params);
        },

        make_engine: function(mixin){

            var new_engine = function(params){
                _.extend(this, params);
                var args = _.toArray(arguments);

                if (this.init) this.init.apply(this, args.slice(1));
            };

            _.extend(new_engine.prototype, Engine.prototype);
            _.extend(new_engine.prototype, mixin);

            return new_engine;
        },

        raphael_mixin: {},

        canvas: {}

    };
})();