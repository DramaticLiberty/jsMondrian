
class GridTile {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.hover = false;
        this.visible = true;
    }
}

class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = [];
        for (let i=0; i<width; i++) {
            for (let j=0; j<height; j++) {
                this.tiles.push(new GridTile(i, j, 0));
            }
        }
    }

    setType(index, type) {
        this.tiles[index].type = type;
    }

    getTile(x, y) {
        return this.tiles[x * this.height + y];
    }

    setLinearType(d, type, fetchTile) {
        let i = d > 0 ? 1 : -1;
        let mutated = false;
        for (;; d -= i) {
            let tile = fetchTile(-d);
            mutated = mutated || tile.type != type;
            tile.type = type;
            if (d==0) break;
        }
        return mutated;
    }

    setRowType(fromTile, dx, type) {
        return this.setLinearType(dx, type, (ix) => this.getTile(fromTile.x + ix, fromTile.y));
    }

    setColType(fromTile, dy, type) {
        return this.setLinearType(dy, type, (iy) => this.getTile(fromTile.x, fromTile.y + iy));
    }
}

class GridView {
    constructor(model) {
        this.model = model;
        this.palette = ['#F0F0F0', '#C0C0C0', '#83a6c7', '#FFFFFF'];
        this.isDrawing = false;
        this.currentType = 1;
        this.firstTouchedTile = undefined;
    }

    tileFill(tile) {
        if (!tile.visible)
            return '#FFFFFF';
        return this.palette[tile.type % this.palette.length];
    }

    tileStroke(tile) {
        if (tile.hover)
            return '#101060';
        if (tile.visible)
            return '#106010';
        return;
    }

    cycleCurrentType() {
        this.currentType = (this.currentType + 1) % this.palette.length;
        return this.currentType;
    }

    tileTouched(tile) {
        if (!this.isDrawing) {
            return false;
        }
        if (typeof this.firstTouchedTile == 'undefined') {
            this.firstTouchedTile = tile;
            return true;
        } else {
            let dx = this.firstTouchedTile.x - tile.x;
            let dy = this.firstTouchedTile.y - tile.y;
            if (Math.abs(dx) > Math.abs(dy)) {
                return this.model.setRowType(this.firstTouchedTile, dx, this.currentType);
            } else {
                return this.model.setColType(this.firstTouchedTile, dy, this.currentType);
            }
        }
    }

    setDrawing(isDrawing) {
        if (!this.isDrawing && isDrawing) {
            // Started drawing
            this.isDrawing = isDrawing;
        } else if (this.isDrawing && !isDrawing) {
            // Stopped drawing
            this.isDrawing = isDrawing;
            this.firstTouchedTile = undefined;
        }
    }
}

class GridExample {

    getCanvas() {
        return document.getElementById('container');
    }

    makeGrid(update) {
        let theGrid = new Grid(20, 15);
        theGrid.setType(81, 1);
        theGrid.setType(82, 1);
        theGrid.setType(96, 1);
        theGrid.setType(97, 1);

        window.setTimeout(function() {
            theGrid.setType(141, 1);
            theGrid.setType(142, 1);
            update();
        }, 1000);
        window.setTimeout(function() {
            theGrid.setType(156, 1);
            update();
        }, 2000);
        window.setTimeout(function() {
            theGrid.setType(157, 1);
            update();
        }, 3000);        
        window.setTimeout(function() {
            theGrid.getTile(19, 0).type = 1;
            theGrid.getTile(19, 1).type = 1;
            theGrid.getTile(19, 2).type = 1;
            update();
        }, 3500);

        return theGrid;
    }

    main() {
        let rendition = new SVGRenderer(this.getCanvas());
        let fig = new Figure();

        let theGrid = this.makeGrid(() => fig.reload(rendition.svg));
        let view = new GridView(theGrid);

        rendition
            .on('mousedown', () => { view.setDrawing(true); })
            .on('mouseup', () => { view.setDrawing(false); });
                
        fig.nodes(theGrid.tiles)
           .paint(new RectangleNode()
               .label(() => 'A box')
               .fill((box) => view.tileFill(box))
               .stroke((box) => view.tileStroke(box))
               .strokeWidth((box) => box.hover ? 2 : 1)
               .x((box) => 10 + 40*box.x)
               .y((box) => 10 + 30*box.y)
               .width(() => 39)
               .height(() => 29)
               .onDblClick((box) => {
                    box.type = view.cycleCurrentType();
                    fig.reload(rendition.svg);
               })
               .onClick((box) => {
                    if (view.currentType != box.type) {
                        box.type = view.currentType;
                        fig.reload(rendition.svg);
                    }
               })
               .onMouseMove((box) => {
                    if (view.tileTouched(box)) {
                        fig.reload(rendition.svg);
                    }
               })
               .onMouseEnter((box) => {
                    box.hover = true;
                    fig.reload(rendition.svg);
               })
               .onMouseLeave((box) => {
                    box.hover = false;
                    fig.reload(rendition.svg);
               })
           )
           .commit(rendition.svg)    
    }
}


