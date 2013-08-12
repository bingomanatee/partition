/**
 * Created with JetBrains WebStorm.
 * User: dedelhart
 * Date: 7/21/13
 * Time: 1:20 AM
 * To change this template use File | Settings | File Templates.
 */

Partition.utils.point = (function () {

	var _point_template = _.template('<%= point.type %><%= point.getX(rect) %>,<%= point.getY() %>');

	var _2_template = _.template('<%= point.type %><%= point.getX(rect) %>,<%= point.getY() %>,<%= point.getX2(rect) %>,<%= point.getY2() %>');

	var _3_template = _.template('<%= point.type %><%= point.getX(rect) %>,<%= point.getY() %>,<%= point.getX2(rect) %>,<%= point.getY2() %>,<%= point.getX3(rect) %>,<%= point.getY3() %>');

	var _h_template =  _.template('H<%= point.getX(rect) %>');

	var _v_template =  _.template('V<%= point.getY(rect) %>');

	var _0_template = _.template('<%= point.type %>');

	var Point = function (type, params, box) {
		this.type = type;
		this.params = params;
		this.box = box;

		switch (type){
			case 'M':
			case 'L':
				this.template = _point_template;
				break;

			case 'H':
				this.template = _h_template;
				break;

			case 'V':
				this.template = _v_template;
				break;

			case 'S':
			case 'Q':
				this.template = _2_template;
				break;

			case 'Z':
				this.template = _0_template;
				break;

			case 'C':
				this.template = _3_template;
				break;
		}
	}

	Point.prototype = {

		toString: function (rect) {
			if (!rect) {
				rect = this.box.rect();
			}

			return this.template({box: this.box, point: this, rect: rect});
		},

		getX: function (rect) {
			if (!rect) {
				rect = this.box.rect();
			}
			return Partition.utils.scale(this.params.x, rect.width) + rect.left;
		},

		getY: function (rect) {
			if (!rect) {
				rect = this.box.rect();
			}
			return Partition.utils.scale(this.params.y, rect.height) + rect.top;
		},

		getX2: function (rect) {
			if (!rect) {
				rect = this.box.rect();
			}
			return Partition.utils.scale(this.params.x2, rect.width) + rect.left;
		},

		getY2: function (rect) {
			if (!rect) {
				rect = this.box.rect();
			}
			return Partition.utils.scale(this.params.y2, rect.height) + rect.top;
		},

		getX3: function (rect) {
			if (!rect) {
				rect = this.box.rect();
			}
			return Partition.utils.scale(this.params.x3, rect.width) + rect.left;
		},

		getY3: function (rect) {
			if (!rect) {
				rect = this.box.rect();
			}
			return Partition.utils.scale(this.params.y3, rect.height) + rect.top;
		}
	}

	return function (type, params, box) {
		return new Point(type, params, box);
	}
})();