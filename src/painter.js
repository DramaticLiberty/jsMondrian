
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
