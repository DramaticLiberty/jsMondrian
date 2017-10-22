
class Figure {
    constructor(identity) {
        this.modelIdentity = ifUndefined(identity, (e) => { return e; });
    }
    
    canvas(svg) {
        this.svg = svg;
        return this;
    }

    nodes(entities) {
        this.figureNodes = [];
        for (let index in entities) {
            let entity = entities[index];
            // this.figureNodes[this.modelIdentity(entity)] = new Node(entity);
            this.figureNodes.push(new Node(entity));
        }
        this.figure = this.svg
                          .selectAll('jsMondrianFigure')
                          .data(this.figureNodes)
                          .enter();
        return this;
    }

    identity(identity) {
        this.modelIdentity = ifUndefined(identity, (e) => { return e; });
    }

    paint(painter) {
        painter.paint(this.figureNodes);
        this.figure = painter.commit(this.figure);
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

    renderFigure(fig) {
        let svg = 
        svg.selectAll('circle')
           .data([1, 2, 3])
           .enter()
           .append('circle')
           .attr('cy', 60)
           .attr('cx', (model, i) => { return 50 + i*100; })
           .attr('r', (model, i) => { return 10 + i*10; })
        svg
           .selectAll('jsMondrianFigure')
           .data([4, 5, 6, 7])
           .enter()
           .append('rect')
           .attr('y', 90)
           .attr('x', (model, i) => { return 50 + i*100; })
           .attr('width', (model, i) => { return 10 + i*10; })
           .attr('height', (model, i) => { return 10 + i*10; })
        ;
    }
}
