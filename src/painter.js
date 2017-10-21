
class Node {
    constructor(entity, painter) {
        this.entity = entity;
        this.painter = painter;
    }

    _addDimension(dimension) {
        this[dimension] = (entity) => {
            // Invoke the painter callback with this entity
            return this.painter['_' + dimension](entity);
        };
    }
}

class BasePainter {
    constructor() {
        this.dimensions = [];
        this._addDimension('label');
        this._addDimension('color');
    }

    _addDimension(dimension) {
        this.dimensions.push(dimension);
        this[dimension] = (cb) => {
            this['_' + dimension] = cb;
            return this;
        };
    }

    newNode(entity) {
        let node = new Node(entity, this);
        for (let index in this.dimensions) {
            node._addDimension(this.dimensions[index]);
        }
        return node;
    }
}


class RectangleNodePainter extends BasePainter {
    constructor() {
        super()
        this._addDimension('x');
        this._addDimension('y');
        this._addDimension('width');
        this._addDimension('height');
    }
}

class SuperSmartRectangleNodePainter {
    constructor() {
        // position, color, width, height
        // modifiers normal, hover (tap), selected (tap-hold), visibility
    }
}
