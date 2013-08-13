Partition.draw.grid = (function (paper) {

	var _DEBUG = false;
	var _cell_name_template = _.template('<%= name %> row <%= row %> column <%= column %>');
    var _DEBUG_CELL_STATS = true;

	return function (box) {
		var rect = box.rect(true);

		var cell_name_template = box.cell_name_template || _cell_name_template;

		var columns = Math.floor(box.columns) || 1;
		var columnMargin = box.columnMargin || 0;
		var columnMarginWidth = columnMargin ? Partition.utils.scale(columnMargin, rect.width) : 0;
		var columnsWidth = rect.width - (columns - 1) * columnMarginWidth;
		var columnWidth = columnsWidth / columns;

		var rows = Math.floor(box.rows) || 1;
		var rowMargin = box.rowMargin || 0;
		var rowMarginHeight = rowMargin ? Partition.utils.scale(rowMargin, rect.height) : 0;
		var rowsHeight = rect.height - (rows - 1) * rowMarginHeight;
		var rowHeight = rowsHeight / rows;

	 if (_DEBUG)	console.log('grid specs: ', {
			columns: columns,
			columnMargin: columnMargin,
			columnWidth: columnWidth,
			rows: rows,
			rowMargin: rowMargin,
			rowHeight: rowHeight
		});

		box._children = [];

		var totalColumnLeftMargin = 0;
		_.each(_.range(0, columns), function (column) {
			var params = {column: column, columns : columns, rows: rows, columnWidth: columnWidth, columnMarginWidth: columnMarginWidth, rect: rect};
			var width = box.setColumnWidth ? box.setColumnWidth(params) : columnWidth;
            if(_.isString(width)){
                width = Partition.utils.scale(width, rect.width);
            }
			params.width = width;
			var columnLeftMargin = box.setColumnMargin ? box.setColumnMargin(params) : columnMarginWidth;
			var totalRowTopMargin = 0;

			_.each(_.range(0, rows), function (row) {
				params = {row: row, columns : columns, rows: rows, rowHeight: rowHeight, rect: rect, rowMarginHeight: rowMarginHeight};
				var height = box.setRowHeight ? box.setRowHeight(params) : rowHeight;
                if(_.isString(height)){
                    height = Partition.utils.scale(height, rect.height);
                }
				params.height = height;
				var rowTopMargin = box.setRowMargin ? box.setRowMargin(params) : rowMarginHeight;

				var cell = box.child(cell_name_template({name: box.name, row: row, column: column}))
					.setLeftMargin(totalColumnLeftMargin)
                    .setTopMargin(totalRowTopMargin)
                    .setWidth(width)
                    .setHeight(height)
                    .setDrawType('rect');

				if (box.processCell) {
					box.processCell(cell, column, row);
                }

				if (_DEBUG_CELL_STATS || box.debug) {
					console.log('cell specs: ', {
						name: cell.name,
						height: height,
						width: width,
						rowTopMargin: rowTopMargin,
						columnLeftMargin: columnLeftMargin,
						totalColumnLeftMargin: totalColumnLeftMargin,
						totalRowTopMargin: totalRowTopMargin
					});
					console.log('cell ', cell.getTitle(), '  rect: ', cell.rect().toString());
				}

				totalRowTopMargin += height + rowTopMargin;

			});
			totalColumnLeftMargin += columnLeftMargin + width;

		})
	};
})();
