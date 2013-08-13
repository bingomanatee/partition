Partition.engines.raphael_mixin.path = (function () {

    function _polygon(box, engine) {
        var rect = box.rect();
        return engine.paper
            .path(
                _.reduce(box.points, function (out, point) {
                    return out + point.toString(rect);
                }, ''));
    }

    return function (box) {
        var _DEBUG = false;

        var rect = box.rect();

        box.element = _polygon(box, this);
        if (_DEBUG) console.log('box: ', box.name, ':', box, 'rect: ', rect);
        box.element.attr(_.extend({'stroke-width': 0, fill: 'black', title: box.getTitle() }, box.drawAttrs || {}));
    }

})();