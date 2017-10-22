
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
        return this.shape(svg, 'rect', {
            x: (node, i) => node.x(),
            y: (node, i) => node.y(),
            width: (node, i) => node.width(),
            height: (node, i) => node.height()
        });
    }
}

class EllipseNode extends RectangleNode {
    commit(svg) {
        return this.shape(svg, 'ellipse', {
            cx: (node, i) => node.x() + node.width()/2,
            cy: (node, i) => node.y() + node.height()/2,
            rx: (node, i) => node.width()/2,
            ry: (node, i) => node.height()/2
        });
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
        return this.shape(svg, 'line', {
            x1: (node, i) => this.cx(node.from().jsMondrianNode),
            y1: (node, i) => this.cy(node.from().jsMondrianNode),
            x2: (node, i) => this.cx(node.to().jsMondrianNode),
            y2: (node, i) => this.cy(node.to().jsMondrianNode)
        });
    }
}
