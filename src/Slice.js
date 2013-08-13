Partition.Slice = function () {
    var _rgb = _.template("rgb(<%= red %>,<%= green %>,<%= blue %>)");
    var _hsl = _.template("hsl(<%= hue %>, <%= sat %>%,<%= light %>%)");
    var box_id = 0;

    function Slice(name, params, parent, draw_engine) {
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
        this.draw_engine = draw_engine ? draw_engine : parent ? parent.draw_engine : null;
        this.marginDim = new Partition.Dimension(this.margin);
        this.paddingDim = new Partition.Dimension(this.padding)
    }

    Slice.prototype = {TYPE: "Partition.BOX", is_root: function () {
        return this.parent instanceof jQuery || !(this.parent.TYPE == "Partition.BOX")
    }, parentRect: function () {
        if (this.is_root()) {
            return new Partition.Rect(0, 0, $(this.parent).width(), $(this.parent).height())
        } else {
            return this.parent.rect(true)
        }
    }, setDrawEngine: function (draw_engine) {
        this.draw_engine = draw_engine;
        _.each(this._children, function (c) {
            c.setDrawEngine(draw_engine)
        })
    }, getPoints: function () {
        var rect = this.rect();
        return _.reduce(this.points, function (out, point) {
            out += point.toString(rect, this);
            return out
        }, "", this)
    }, addPoint: function (type, params) {
        this.points.push(Partition.utils.point(type, params, this));
        return this;
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
        var width = Partition.utils.scale(this.width, parentRect.width);
        var height = Partition.utils.scale(this.height, parentRect.height);
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
        var rect = new Partition.Rect(left, top, width, height);
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
        this.paddingDim = new Partition.Dimension(p);
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
    }, setStrokeWidth: function (n) {
        if (!n) n = 0;
        this.drawAttrs['stroke-width'] = n;
        return this;
    }, getStrokeWidth: function () {
        return this.drawAttrs['stroke-width'] ? this.drawAttrs['stroke-width'] : 0;
    }, setMargin: function (p) {
        this.marginDim = new Partition.Dimension(p);
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
        if (!(Partition.draw[type] || this.draw_engine[type])) {
            console.log('type:', type, 'draw: ', Partition.draw, 'engine:', this.draw_engine);
            throw new Error("bad draw type " + type)
        }
        this.drawType = type;
        return this
    }, undraw: function () {
        this.draw_engine.undraw(this);
        this._drawn = false;
        _.each(this._children, function (child) {
            child.undraw()
        })
    }, draw: function (draw_engine) {
        if (this._drawn) {
            throw new Error('attempting to draw the same shape twice: ' + this.getPath());
        }

        console.log("drawing ", this.getPathID());
        if (draw_engine) {
            this.draw_engine = draw_engine
        }

        if (!this.draw_engine) {
            throw new Error('slice has no draw engine: ' + this.getPath());
        }

        this.draw_engine.trigger('beforeDraw', this);
        this._computeFill();
        if (this.drawAttrs["stroke-width"]) {
            this._computeStroke()
        }
        if (Partition.draw[this.drawType]) {
            Partition.draw[this.drawType](this)
        } else if (this.draw_engine[this.drawType]) {
            this.draw_engine[this.drawType](this);
        } else {
            throw new Error("cannot find drawType " + this.drawType)
        }
        this.draw_engine.trigger('afterDraw', this);
        this._drawn = true;
        _.each(this._children, function (child) {
            child.draw(this.draw_engine)
        }, this)
    }};
    return Slice
}();