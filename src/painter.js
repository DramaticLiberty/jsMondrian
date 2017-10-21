

class BasePainter {
    constructor() {
        this._addDimension('label');
        this._addDimension('color');
    }

    _addDimension(dimension) {
        this[dimension] = (dim) => {
            this['_' + dimension] = dim;
            return this;
        };
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
