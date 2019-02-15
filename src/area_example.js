
class GridTile {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.hover = false;
    this.selecting = false;
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

  commitSelectingToType(type) {
    this.tiles.forEach((tile) => {
      if (tile.selecting) {
        tile.selecting = false;
        tile.type = type;
      }
    });
  }

  setAreaType(fromTile, toTile) {
    const xMin = Math.min(toTile.x, fromTile.x);
    const yMin = Math.min(toTile.y, fromTile.y);
    const xLen = Math.abs(toTile.x - fromTile.x);
    const yLen = Math.abs(toTile.y - fromTile.y);
    let mutated = false;
    for (let i=0; i<this.width; i++) {
      for (let j=0; j<this.height; j++) {
        const selecting = i >= xMin && i <= (xMin + xLen) && j >= yMin && j <= (yMin + yLen);
        const tile = this.getTile(i, j);
        mutated = mutated || tile.selecting != selecting;
        tile.selecting = selecting;
      }
    }
    return mutated;
  }
}

class GridView {
  constructor(model) {
    this.model = model;
    this.palette = ['#99DCC1', '#F3B7BD'];
    this.hoverPalette = ['#D9F2E8', '#FAE4E6'];
    this.isDrawing = false;
    this.currentType = 1;
    this.firstTouchedTile = undefined;
  }

  tileFill(tile) {
    if (!tile.visible)
      return '#FFFFFF';
    if (tile.hover || tile.selecting) {
      return this.hoverPalette[this.currentType];
    } else {
      return this.palette[tile.type % this.palette.length];
    }
  }

  tileStroke(tile) {
    if (tile.hover) {
      return '#FFFFFF';
    }
    if (tile.visible) {
      return '#FFFFFF';
    }
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
      return this.model.setAreaType(this.firstTouchedTile, tile);
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
      this.model.commitSelectingToType(this.currentType);
    }
  }
}

class GridExample {

  getCanvas() {
    return document.getElementById('container');
  }

  makeGrid(update) {
    let theGrid = new Grid(24, 7);
    return theGrid;
  }

  main() {
    let rendition = new SVGRenderer(this.getCanvas());
    let fig = new Figure();

    let theGrid = this.makeGrid(() => fig.reload(rendition.svg));
    let view = new GridView(theGrid);

    rendition
      .on('mousedown', () => { view.setDrawing(true); })
      .on('mouseup', () => {
        view.setDrawing(false);
        fig.reload(rendition.svg);
      });

    fig.nodes(theGrid.tiles)
       .paint(new RectangleNode()
         .label(() => 'A box')
         .fill((box) => view.tileFill(box))
         .stroke((box) => view.tileStroke(box))
         .strokeWidth((box) => box.hover ? 2 : 1)
         .x((box) => 10 + 30*box.x)
         .y((box) => 10 + 40*box.y)
         .width(() => 29)
         .height(() => 39)
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
