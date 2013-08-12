raphaelDOM.Slice = function () {
    var _rgb = _.template("rgb(<%= red %>,<%= green %>,<%= blue %>)");
    var _hsl = _.template("hsl(<%= hue %>, <%= sat %>%,<%= light %>%)");
    var _DEBUG_UNDRAW = true;

    function _addSVGclass(node, klass) {
        var det = raphaelDOM.browserDetect();
        if (!(det.browser == "Explorer" && det.browser.version <= 8)) {
            return node.node.setAttribute("class", klass)
        }
    }

    var box_id = 0;

    function Slice(name, params, parent, paper) {
        this.anchor = "TL";
        this.margin = 0;
        this.padding = 0;
        this.width = "100%";
        this.height = "100%";
        this.rows = 1;
        this.cols = 1;
        this.id = ++box_id;
        this.points = [];
        this.drawType = "rect";
        this.color = {red: 0, green: 0, blue: 0};
        this.strokeColor = {red: 0, green: 0, blue: 0};
        this.colorMode = "rgb";
        this.drawAttrs = {};
        if (params)_.extend(this, params);
        this.name = name;
        this._children = [];
        this.parent = parent;
        this.paper = paper || (parent ? parent.paper : null);
        this.marginDim = new raphaelDOM.Dimension(this.margin);
        this.paddingDim = new raphaelDOM.Dimension(this.padding)
    }

    Slice.prototype = {TYPE: "raphaelDOM.BOX", is_root: function () {
        return this.parent instanceof jQuery || !(this.parent.TYPE == "raphaelDOM.BOX")
    }, parentRect: function () {
        if (this.is_root()) {
            return new raphaelDOM.Rect(0, 0, this.parent.width(), this.parent.height())
        } else {
            return this.parent.rect(true)
        }
    }, setPaper: function (paper) {
        this.paper = paper;
        _.each(this._children, function (c) {
            c.setPaper(paper)
        })
    }, getPoints: function () {
        var rect = this.rect();
        return _.reduce(this.points, function (out, point) {
            out += point.toString(rect, this);
            return out
        }, "", this)
    }, addPoint: function (type, params) {
        this.points.push(raphaelDOM.utils.point(type, params, this))
    }, getPath: function () {
        var out = "";
        if (this.parent && this.parent.getPath) {
            out += this.parent.getPath() + "."
        }
        out += this.name || "<unnamed>";
        return out
    }, getPathID: function () {
        var out = "";
        if (this.parent && this.parent.getPathID) {
            out += this.parent.getPathID() + "."
        }
        out += (this.name || "<unnamed>") + "#" + this.id;
        return out
    }, rect: function (inner) {
        var parentRect = this.parentRect();
        var marginRect = parentRect.inset(this.marginDim);
        var width = raphaelDOM.utils.scale(this.width, parentRect.width);
        var height = raphaelDOM.utils.scale(this.height, parentRect.height);
        var left, top;
        var diffWidth = marginRect.width - width;
        var diffHeight = marginRect.height - height;
        switch (this.anchor) {
            case"TL":
                left = marginRect.left;
                top = marginRect.top;
                break;
            case"TR":
                left = marginRect.right - width;
                top = marginRect.top;
                break;
            case"T":
                left = marginRect.left + diffWidth / 2;
                top = marginRect.top;
                break;
            case"L":
                left = marginRect.left;
                top = marginRect.top + diffHeight / 2;
                break;
            case"C":
                left = marginRect.left + diffWidth / 2;
                top = marginRect.top + diffHeight / 2;
                break;
            case"R":
                left = marginRect.right - width;
                top = marginRect.top + diffHeight / 2;
                break;
            case"BL":
                left = marginRect.left;
                top = marginRect.bottom - height;
                break;
            case"BR":
                left = marginRect.right - width;
                top = marginRect.bottom - height;
                break;
            case"B":
                left = marginRect.left + (marginRect.width - width) / 2;
                top = marginRect.bottom - height;
                break;
            default:
                throw new Error("bad anchor" + this.anchor)
        }
        var rect = new raphaelDOM.Rect(left, top, width, height);
        return inner ? rect.inset(this.paddingDim) : rect
    }, child: function (name, attrs) {
        var child = new Slice(name || this.name + " child " + this._children.length, attrs || {}, this);
        this._children.push(child);
        return child
    }, setWidth: function (width) {
        this.width = width;
        return this
    }, setHeight: function (height) {
        this.height = height;
        return this
    }, setAnchor: function (a) {
        this.anchor = _.reduce({top: "T", left: "L", right: "R", bottom: "B"},function (a, shortName, longName) {
            return a.replace(longName, shortName)
        }, a).replace(/[^TLCBR]/g, "");
        return this
    }, getTitle: function () {
        return this.hasOwnProperty("title") ? this.title : ""
    }, setPadding: function (p) {
        this.paddingDim = new raphaelDOM.Dimension(p);
        return this
    }, setTopPadding: function (m) {
        this.paddingDim.top = m;
        return this
    }, setBottomPadding: function (m) {
        this.paddingDim.bottom = m;
        return this
    }, setLeftPadding: function (m) {
        this.paddingDim.left = m;
        return this
    }, setRightPadding: function (m) {
        this.paddingDim.right = m;
        return this
    }, getDrawAttrs: function () {
        this._computeFill();
        if (this.drawAttrs["stroke-width"]) {
            this._computeStroke()
        }
        return _.extend({"stroke-width": 0, fill: "black"}, this.drawAttrs || {})
    }, setMargin: function (p) {
        this.marginDim = new raphaelDOM.Dimension(p);
        return this
    }, setTopMargin: function (m) {
        this.marginDim.top = m;
        return this
    }, setBottomMargin: function (m) {
        this.marginDim.bottom = m;
        return this
    }, setLeftMargin: function (m) {
        this.marginDim.left = m;
        return this
    }, setRightMargin: function (m) {
        this.marginDim.right = m;
        return this
    }, _computeFill: function () {
        if (this.color && _.isObject(this.color)) {
            switch (this.colorMode) {
                case"rgb":
                    this.drawAttrs.fill = _rgb(this.color);
                    break;
                case"hsl":
                    this.drawAttrs.fill = _hsl(this.color);
                    break
            }
        }
    }, _computeStroke: function () {
        if (this.strokeColor && _.isObject(this.strokeColor)) {
            switch (this.colorMode) {
                case"rgb":
                    this.drawAttrs.stroke = _rgb(this.strokeColor);
                    break;
                case"hsl":
                    this.drawAttrs.stroke = _hsl(this.strokeColor);
                    break
            }
        }
    }, setColor: function (r, g, b) {
        this.color.red = r;
        this.color.green = g;
        this.color.blue = b;
        return this
    }, setStrokeColor: function (r, g, b) {
        this.strokeColor.red = r;
        this.strokeColor.green = g;
        this.strokeColor.blue = b;
        return this
    }, setDrawType: function (type) {
        if (!raphaelDOM.draw.hasOwnProperty(type)) {
            throw new Error("bad draw type " + type)
        }
        this.drawType = type;
        return this
    }, undraw: function () {
        if (_DEBUG_UNDRAW) {
            console.log("undrawing ", this.name, "element", this.element)
        }
        if (this.element) {
            this.element.attr("opacity", 0);
            this.element.hide();
            this.element.remove();
            delete this.element
        } else {
            if (_DEBUG_UNDRAW)console.log(" ... no element to undraw")
        }
        this._drawn = false;
        _.each(this._children, function (child) {
            child.undraw()
        })
    }, draw: function (paper) {
        console.log("drawing ", this.getPathID());
        if (paper) {
            this.paper = paper
        }
        this._computeFill();
        if (this.drawAttrs["stroke-width"]) {
            this._computeStroke()
        }
        if (raphaelDOM.draw[this.drawType]) {
            raphaelDOM.draw[this.drawType](this)
        } else {
            throw new Error("cannot find drawType " + this.drawType)
        }
        if (this.element && !this.noCrisp) {
            _addSVGclass(this.element, "crispEdges")
        }
        this._drawn = true;
        _.each(this._children, function (child) {
            child.draw(this.paper)
        }, this)
    }};
    return Slice
}();