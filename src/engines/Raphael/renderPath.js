Partition.engines.raphael_mixin.path = (function () {
	var _DEBUG = true;

	return function (box) {
		var path = box.getPoints();
		if (_DEBUG) console.log('path... ', path);
		box.element = box.draw_engine.polygon(path, box.getDrawAttrs());
	};
})();