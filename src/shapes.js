
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
