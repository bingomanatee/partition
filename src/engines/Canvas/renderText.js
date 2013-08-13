Partition.engines.canvas_mixin.text = function (box) {
    var _DEBUG = false;

    var rect = box.rect();

    var fontHeight = box.drawAttrs['font-size'] || 12;
    var fontAttrs = box.drawAttrs['font-family'] || 'Arial';
    box.drawAttrs['font-size'] = fontHeight;
    var bigHeightDiff = rect.height - fontHeight;
    fontHeight *= 0.6;
    var heightDiff = rect.height - fontHeight;

    var paper = this.paper;

    var x, y, align;
    switch (box.anchor) {

        case 'TL':
            x = rect.left;
            y = rect.top + fontHeight;
            align = 'left';
            break;

        case 'T':
            x = rect.left + rect.width / 2;
            y =  rect.top + fontHeight;
            align="center";
            break;

        case 'TR':
            x = rect.right;
            y = rect.top + fontHeight;
            align = 'right';
            break;

        case 'L':
            x = rect.left;
            y = rect.top + (fontHeight + heightDiff) / 2;
            align = 'left';
            break;

        case 'C':
            x = rect.left + rect.width / 2;
            y = rect.top + (fontHeight + heightDiff) / 2;
            align = 'center';
            break;

        case 'R':
            x = rect.right;
            y = rect.top + (fontHeight + heightDiff) / 2;
            align = 'right';

            break;

        case 'BL':
            x = rect.left;
            y = rect.bottom - fontHeight;
            align = 'left';

            break;

        case 'B':
            x = rect.left + rect.width / 2;
            y = rect.bottom - fontHeight;
            align = 'center';

            break;

        case 'BR':
            x = rect.right;
            y = rect.bottom - fontHeight;
            align = 'right';
            break;

        default:
            throw new Error('no anchor ' + box.anchor);
    }

    var text = new createjs.Text(box.text, fontAttrs, box.fill);
    text.x = x;
    text.y = y;
    text.textAlign = align;

    this.stage.addChild(text);
};