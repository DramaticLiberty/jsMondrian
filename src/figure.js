
class Figure {
    constructor() {
        this.figureNodes = {};
    }

    nodes(entities, painter) {
        for (let index in entities) {
            let entity = entities[index];
            this.figureNodes[entity] = painter.newNode(entity);
        }
    }
    
    edges(edges, painter) {
        // TODO: implement or remove edges
    }

    layout(layout) {
        // TODO: implement or remove layout
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
            .attr("class", 'jsMondrian')
          .call(() => 'jsMondrian');
        let svg = d3.select('svg.jsMondrian');
        svg.selectAll('circle')
           .data([1, 2, 3, 4])
           .enter()
           .append('circle')
           .attr('cy', 60)
           .attr('cx', (model, i) => { return 50 + i*100; })
           .attr('r', (model, i) => { return 10 + i*10; })
    }
}
