
class Figure {
    
    nodes(entities) {
        this.figureNodes = [];
        this.painters = [];
        for (let index in entities) {
            let entity = entities[index];
            let node = new Node(entity);
            entity.jsMondrianNode = node;
            this.figureNodes.push(node);
        }
        return this;
    }

    edges(entities) {
        return this.nodes(entities);
    }

    paint(painter) {
        painter.paint(this.figureNodes);
        this.painters.push(painter);
        return this;
    }

    commit(svg) {
        this.svg = svg;
        let figure = this.svg
                     .selectAll('jsMondrianFigure')
                     .data(this.figureNodes)
                     .enter();
        for (let index in this.painters) {
            figure = this.painters[index].commit(figure);
        }
        return this;
    }
}

class SVGRenderer {
    constructor(domElem) {
        this.domElem = domElem;
        d3.select(this.domElem)
          .selectAll('svg')
          .data(['jsMondrian'])
          .enter()
          .append('svg')
          .attr("width", '100%')
          .attr("height", '100%')
          .attr("class", 'jsMondrian')
          .call(() => 'jsMondrian');
        this.svg = d3.select('svg.jsMondrian');
    }
}
