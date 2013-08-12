/**
 * Created with JetBrains WebStorm.
 * User: dedelhart
 * Date: 7/20/13
 * Time: 7:02 PM
 * To change this template use File | Settings | File Templates.
 */

Partition.blend = (function () {

	var _DEBUG = true;
	var _DEBUG_ATTRS = true;

	function _getElements(box) {
		var name = box.getPath();
		var out = {
		};

		var data = {
			box:  box,
			rect: box.rect()
		};
		out[name] = data;
		data.attr = box.element ? box.element.attr() : {};
		if (data.attr.path){
		//	delete data.attr.path;
		}
		if (data.attr.transform){
			delete data.attr.transform;
		}

		if (_DEBUG_ATTRS) console.log('blend attrs: ', JSON.stringify(data.attr));

		return _.reduce(box._children, function (out, child) {
			var child_out = _getElements(child, name);
			_.each(child_out, function (data, key) {
				var u = 1;
				var _key = key;

				while (out.hasOwnProperty(_key)) {
					_key = key + u;
					++u;
				}
				out[_key] = data;

				return out;
			});
			return out;
		}, out);
	}

	return function (box1, box2, ms, easing, callback) {
		if (_DEBUG) console.log('blending ', box1.name, ' with ', box2.name, ' over ', ms, ' easing ', easing);
	//	var tempPaper = Raphael(box1.parent);

		if (_DEBUG) console.log('blending ', box1.name, 'to', box2.name);

		var box1elements = _getElements(box1);

	//	box2.setDrawEngine(tempPaper);
		box2.draw();

		var box2elements = _getElements(box2);
		box2.undraw();
	//	tempPaper.clear();
		//box2.setDrawEngine(box1.draw_engine);

		var commonKeys = _.intersection(_.keys(box1elements), _.keys(box2elements));
		var oldKeys = _.difference(_.keys(box1elements), _.keys(box2elements));

		//console.log('blending ', box1elements, 'and', box2elements, ' keys: ', commonKeys);

		var doneOnce = false;
		function onDone() {
			if (doneOnce) return;
			doneOnce = true;
			if (_DEBUG) console.log('done with blend of ', box1.name);
			box1.draw_engine.clear();
			box2.draw();
			callback();
		}

		var baseElement;
		if (commonKeys.length) {
			_.each(commonKeys, function (key) {
				var data = box1elements[key];

				if (data.box.element) {
					if (baseElement) {
						data.box.element.animateWith(baseElement, null, box2elements[key].attr, ms, easing, onDone);
					} else {
						baseElement = data.box.element.animate(box2elements[key].attr, ms, easing, onDone);
					}
				}
			});

			_.each(oldKeys, function (key) {
				var data = box1elements[key];
				//	data.box.element.attr('opacity', 1);
				if (_DEBUG) console.log('fading old element ', key);
				if (data.box.element) {
					console.log('fading ', key);
					data.box.element.animate({ opacity: 0 }, ms, easing, onDone);
				} else {
					if (_DEBUG) console.log('key ', key, ' has no element')
				}
			});

		} else {

			_.each(oldKeys, function (key) {
				var data = box1elements[key];
				if (_DEBUG) console.log('fading old key ', key);
				data.box.element.animate({ opacity: 0 }, ms, easing, onDone);
			});
		}

		box2.undraw();
	};
})();