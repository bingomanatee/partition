Partition.engines.canvas_mixin.circle = (function () {
    var _DEBUG = false;

    return function (box) {
        var rect = box.rect();
        var center = rect.center();
        var radius = rect.radius(box.radMode || '');

        attrs = box.drawAttrs || {};

        box.shape = new createjs.Shape();

        box.shape.graphics.beginFill(attrs.fill)
            .drawCircle(center.x, center.y, radius)
            .endFill();

        if (attrs['stroke-width']) {
            box.shape.graphics.beginStroke(attrs.stroke).setStrokeStyle(attrs['stroke-width'])
                .drawCircle(center.x, center.y, radius)
                .endStroke();
        }

        this.stage.addChild(box.shape);

    }

})();