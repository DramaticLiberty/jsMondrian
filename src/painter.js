
class Node {
    constructor(entity) {
        this.entity = entity;
    }

    _addDimension(dimension, painter) {
        this[dimension] = () => {
            // Invoke the painter callback with this entity
            return painter['_' + dimension](this.entity);
        };
    }
}

class Painter {
    constructor() {
        this.dimensions = [];
    }

    _addDimension(dimension, initialCB) {
        this.dimensions.push(dimension);
        this['_' + dimension] = initialCB;
        this[dimension] = (cb) => {
            this['_' + dimension] = cb;
            return this;
        };
    }

    paintNode(node) {
        for (let index in this.dimensions) {
            node._addDimension(this.dimensions[index], this);
        }
        return node;
    }

    paint(nodes) {
        for (let index in nodes) {
            this.paintNode(nodes[index]);
        }
    }

    commit(svg) {
        return svg;
    }
}

class RectangleNode extends Painter {
    constructor() {
        super()
        this._addDimension('color', (e) => { return '#808080'; });
        this._addDimension('width', (e) => { return 5; } );
        this._addDimension('height', (e) => { return 5; } );
        // this._addDimension('label', (e) => { return '' + e; });
    }

    commit(svg) {
        return svg
           .append('rect')
           .attr('width', (node, i) => { return node.width(); })
           .attr('height', (node, i) => { return node.height(); });
    }
}

class FlowLayout extends Painter {
    constructor(horizontal, hSpace, vSpace, limit) {
        super();
        this._addDimension('x', (e) => { return 0; } );
        this._addDimension('y', (e) => { return 0; } );
        
        this.horizontal = ifUndefined(horizontal, true);
        this.limit = limit;
        this.hSpace = ifUndefined(hSpace, 5);
        this.vSpace = ifUndefined(vSpace, 5);

        this.nextLocation = this.nextHorizontal;
        if (!this.horizontal) {
            this.nextLocation = this.nextVertical;
        }
    }

    paint(nodes) {
        let x = this.hSpace;
        let y = this.vSpace;
        let layoutWidth = this.vSpace;
        let layoutHeight = this.hSpace;
        
        for (let index in nodes) {
            let node = nodes[index];
            let absx = x;
            let absy = y;
            this.paintNode(node);
            node.x = () => { return absx; }
            node.y = () => { return absy; }
            layoutWidth = Math.max(layoutWidth, x + node.width());
            layoutHeight = Math.max(layoutHeight, y + node.height());
            [x, y] = this.nextLocation(node, x, y, layoutWidth, layoutHeight);
        }
        return [layoutWidth, layoutHeight]
    }

    nextHorizontal(node, x, y, layoutWidth, layoutHeight) {
        let nextX = x + this.hSpace + node.width(), nextY = y;
        if (typeof this.limit != 'undefValue' && nextX > this.limit) {
            nextX = this.hSpace;
            nextY = layoutHeight + this.vSpace
        }
        return [nextX, nextY];
    }

    nextVertical(node, x, y, layoutWidth, layoutHeight) {
        let nextX = x, nextY = y + this.vSpace + node.height();
        if (typeof this.limit != 'undefValue' && nextY > this.limit) {
            nextY = this.vSpace;
            nextX = layoutWidth + this.hSpace
        }
        return [nextX, nextY];
    }
    
    commit(svg) {
        return svg
           .attr('x', (node, i) => { return node.x(); })
           .attr('y', (node, i) => { return node.y(); })
    }
}



class SuperSmartRectangleNodePainter {
    constructor() {
        // position, color, width, height
        // modifiers normal, hover (tap), selected (tap-hold), visibility
    }
}
