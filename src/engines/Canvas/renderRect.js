Partition.engines.canvas_mixin.rect = function (box) {
    var _DEBUG = false;

    var rect = box.rect(),
        attrs = box.drawAttrs || {};

    var shape = new createjs.Shape();

    shape.graphics.beginFill(attrs.fill)
        .rect(rect.left, rect.top, rect.width, rect.height)
        .endFill();

    if (attrs['stroke-width']) {
        shape.graphics.beginStroke(attrs.stroke).setStrokeStyle(attrs['stroke-width']).
            rect(rect.left, rect.top, rect.width, rect.height)
            .endStroke();
    }

    this.stage.addChild(shape);

};