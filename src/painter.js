
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

    addColorDimensions() {
        this._addDimension('fill', (e) => '#C0C0C0');
        this._addDimension('stroke', (e) => '#404040');
        this._addDimension('label', (e) => e+'');
    }

    colorize(svg) {
        return svg
           .attr('fill', (node, i) => node.fill())
           .attr('stroke', (node, i) => node.stroke());
    }

    title(svg) {
        return svg
           .append('title')
           .text((node, i) => node.label());
    }
}

class RectangleNode extends Painter {
    constructor() {
        super()
        this.addColorDimensions()
        this._addDimension('x', (e) => 0);
        this._addDimension('y', (e) => 0);
        this._addDimension('width', (e) => 5);
        this._addDimension('height', (e) => 5);
    }

    commit(svg) {
        svg = svg
           .append('rect')
           .attr('x', (node, i) => node.x())
           .attr('y', (node, i) => node.y())
           .attr('width', (node, i) => node.width())
           .attr('height', (node, i) => node.height());
        svg = this.colorize(svg);
        svg = this.title(svg);
        return svg;
    }
}

class EllipseNode extends RectangleNode {
    commit(svg) {
        svg = svg
           .append('ellipse')
           .attr('cx', (node, i) => node.x() + node.width()/2)
           .attr('cy', (node, i) => node.y() + node.height()/2)
           .attr('rx', (node, i) => node.width()/2)
           .attr('ry', (node, i) => node.height()/2);
        svg = this.colorize(svg);
        svg = this.title(svg);
        return svg;
    }
}

class FlowLayout extends Painter {
    constructor(horizontal, hSpace, vSpace, limit) {
        super();
        this._addDimension('x', (e) => 0);
        this._addDimension('y', (e) => 0);
        
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
            let node = this.paintNode(nodes[index]);
            let absx = x, absy = y;
            node.x = () => absx;
            node.y = () => absy;
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
}

class LineEdge extends Painter {
    constructor() {
        super()
        this.addColorDimensions();
        this._addDimension('from', (e) => null);
        this._addDimension('to', (e) => null);
    }

    cx(node) {
        return node.x() + node.width() / 2;
    }

    cy(node) {
        return node.y() + node.height() / 2;
    }

    commit(svg) {
        return this.colorize(svg
           .append('line')
           .attr('x1', (node, i) => this.cx(node.from().jsMondrianNode))
           .attr('y1', (node, i) => this.cy(node.from().jsMondrianNode))
           .attr('x2', (node, i) => this.cx(node.to().jsMondrianNode))
           .attr('y2', (node, i) => this.cy(node.to().jsMondrianNode))
        );
    }
}
