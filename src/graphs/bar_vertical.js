/**
 * legendMode = 'left', 'overleft', 'overright', 'right'
 * legendMargin = measure
 * bottomMargin = measure
 * titleMargin = measure
 *
 */

Partition.graphs.bar = (function () {

    return function (name, params, parent, draw_engine, data) {
        var legendMode = 'left';
        var legendMargin = params.legendMargin || '12%';
        var bottomMargin = params.bottomMargin || '8%';
        var titleMargin = params.titleMargin || 0;
        var barWidth = params.barWidth || '50%';
        var box = new Partition.Slice(name, {}, parent, draw_engine)
            .setDrawType('none');
        var globalBarColor = params.barColor || {red: 100, green: 200, blue: 204};
        var maxValue = _.max(_.pluck(data, 'value'), _.identity );
        console.log('max value: ', maxValue);
        var dataRegion = box.child('data region').setDrawType('none')
            .setTopPadding(titleMargin).setBottomPadding(bottomMargin);
        var dataBox = dataRegion.child('data', {rows: 1, columns: data.length}).setDrawType('grid');

        var bottomRegion = box.child('bar titles').setDrawType('none').setHeight(bottomMargin).setAnchor('B');
        var labelBox = bottomRegion.child('labels', {rows: 1, columns: data.length}) .setDrawType('grid');
        var labelDrawAttrs = params.labelDrawAttrs || {'text-size': 12, 'text-font': 'Arial'};

        switch (legendMode) {
            case 'left':
                dataRegion.setLeftPadding(legendMargin);
                bottomRegion.setLeftPadding(legendMargin);
                break;

            case 'right':
                dataRegion.setRightPadding(legendMargin);
                bottomRegion.setRightPadding(legendMargin);
                break;
        }

        dataBox.processCell = function (cell, column, row) {
            cell.setDrawType('none');
            var dataItem = data[column];
            var barColor = dataItem.barColor || globalBarColor;
            var bar = cell.child('bar ' + dataItem.label).setWidth(barWidth).setAnchor('B');
            bar.setColor(barColor.red, barColor.green, barColor.blue);
            var height = (100 * dataItem.value / maxValue);
            bar.setHeight(height + '%');
            console.log('height:', height, bar.height);
        };

        labelBox.processCell = function (cell, column, row) {
            var dataItem = data[column];
            console.log('data: ', dataItem);
            var text = cell.setDrawType('none').child('label', {text: dataItem.label}).setDrawType('text').setAnchor('C');
        };

        return box;
    }

})();