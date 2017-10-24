
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

    commit(fig, nodes, svg) {
        return svg;
    }

    addColorDimensions() {
        this._addDimension('fill', (e) => '#C0C0C0');
        this._addDimension('stroke', (e) => '#404040');
        this._addDimension('label', (e) => e+'');
    }

    addInteractionDimensions() {
        this._addDimension('onClick', undefined);
        this._addDimension('onMouseEnter', undefined);
        this._addDimension('onMouseLeave', undefined);
    }

    identity(attrs) {
        attrs.id = (node, i) => node.jsMondrianId;
        attrs.class = this.jsMondrianId;
        return attrs;
    }

    colorize(attrs) {
        attrs.fill = (node, i) => node.fill();
        attrs.stroke = (node, i) => node.stroke();
        return attrs;
    }

    shape(fig, nodes, svg, shape, attrs) {
        attrs = this.identity(attrs);
        attrs = this.colorize(attrs);

        svg = svg
            .selectAll('#' + fig.jsMondrianId +' '+ shape +'.'+ this.jsMondrianId)
            .data(nodes);
        svg.attrs(attrs)
           .select('title')
           .text((node, i) => node.label());

        svg = svg.enter().append(shape);
        svg.attrs(attrs)
           .append('title')
           .text((node, i) => node.label());

        svg.merge(svg);
        svg.on('click', (node, i) => node.onClick());
        svg.on('mouseenter', (node, i) => node.onMouseEnter());
        svg.on('mouseleave', (node, i) => node.onMouseLeave());
        return svg;
    }
}
