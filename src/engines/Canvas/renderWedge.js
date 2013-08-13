Partition.engines.canvas_mixin.wedge = (function () {

    var _DEBUG = false;

    var rad = Math.PI / 180;

    function _wedge(box) {
        var rect = box.rect();
        var center = rect.center();
        var r = rect.radius();
        var startAngle = box.hasOwnProperty('startAngle') ? box.startAngle : 0
            , endAngle = box.hasOwnProperty('endAngle') ? box.endAngle : 360;

        var p1 = rect.radialPoint(-startAngle);
        var p2 = rect.radialPoint(endAngle);

        box.shape.graphics.moveTo(center.x, center.y);
        box.shape.graphics.lineTo(p2.x, p2.y);
        box.shape.graphics.arc(center.x, center.y, r, endAngle * -rad, startAngle * -rad);
        box.shape.graphics.lineTo(p1.x, p1.y);
        box.shape.graphics.closePath();
    }

    return function (box) {
        var path = box.getPoints();
        if (_DEBUG) console.log('path... ', path);


        box.shape = new createjs.Shape();

        box.shape.graphics.beginFill(attrs.fill);
        _wedge(box);
        box.shape.graphics.endFill();

        if (attrs['stroke-width']) {
            box.shape.graphics.beginStroke(attrs.stroke).setStrokeStyle(box.getStrokeWidth());
            _wedge(box);
            box.shape.graphics.endStroke();
        }

        this.stage.addChild(box.shape);
    }


})();