
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
        canvas.renderFigure(this);
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

    renderFigure(fig) {
        d3.select(this.domElem)
          .selectAll('svg')
          .data(['jsMondrian'])
          .enter()
          .append('svg')
            .attr("width", '100%')
            .attr("height", '100%')
          .append('g')
          .call(() => 'jsMondrian');
    }
}
