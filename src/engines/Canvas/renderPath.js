Partition.engines.canvas_mixin.path = (function () {
    var _DEBUG = true;

    function _polygon(box) {
        var x, y;

        _.forEach(box.points, function (point) {
            switch (point.type) {
                case 'M':
                    x = point.getX(), y = point.getY();
                    box.shape.graphics.moveTo(x, y);
                    break;

                case 'L':
                    x = point.getX(), y = point.getY();
                    box.shape.graphics.lineTo(x, y);
                    break;

                case 'H':
                    x = point.getX();
                    box.shape.graphics.lineTo(x, y);
                    break;

                case 'V':
                    y = point.getY();
                    box.shape.graphics.lineTo(x, y);
                    break;

                case 'Q':
                    x = point.getX(), y = point.getY();
                    box.shape.graphics.quadraticCurveTo(x, y, point.getX2(), point.getY2());
                    break;

                default:
                    throw new Error('unhandled point type: ' + point.type);

            }
        });
    }

    return function (box) {
        var path = box.getPoints();
        if (_DEBUG) console.log('path... ', path);

       box.shape = new createjs.Shape();
        box.shape.graphics.beginFill(attrs.fill);
        _polygon(box);
        box.shape.graphics.endFill();

        if (attrs['stroke-width']) {
            box.shape.graphics.beginStroke(attrs.stroke).setStrokeStyle(attrs['stroke-width'])
            _polygon(box);
            box.shape.graphics.endStroke();
        }
        
        this.stage.addChild(box.shape);
    };
})();