
class RectangleNodePainter {
    constructor() {
        // adds rectangles to Figures
    }

    width(modelWidth) {
        this.modelWidth = modelWidth;
        return this;
    }

    height(modelHeight) {
        this.modelHeight = modelHeight;
        return this;
    }
}

class SuperSmartRectangleNodePainter {
    constructor() {
        // position, color, width, height
        // modifiers normal, hover (tap), selected (tap-hold), visibility
    }
}

class Figure {
    constructor() {
    }

    nodes(nodes, painter) {
    }
    
    edges(edges, painter) {
    }

    layout(layout) {
    }
    
    renderOn(canvas) {
        return this;
    }
}

class FlowLayout {
    constructor() {
    }
}

class SVGRenderer {
    constructor(domElem) {
        this.domElem = domElem;
    }
}
