Partition.engines.raphael_mixin.rect =  function(box){
	var _DEBUG = false;
	var rect = box.rect();
	box.element = this.paper.rect(rect.left, rect.top, rect.width, rect.height);
    var box_attrs = _.extend({'stroke-width': 0, fill: 'black', title: box.name}, box.drawAttrs);
	if (_DEBUG) console.log('box: ', box.name, ':',  box, 'rect: ', rect, 'attrs: ', box_attrs);
	box.element.attr(box_attrs);

};