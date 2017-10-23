
class Figure {

    constructor() {
        this.allNodes = [];
        this.commits = [];
    }
    
    nodes(entities) {
        this.figureNodes = [];
        this.painters = [];
        for (let index in entities) {
            let entity = entities[index];
            let node = new Node(entity);
            entity.jsMondrianNode = node;
            node.jsMondrianId = 'n-' + this.allNodes.length;
            this.figureNodes.push(node);
            this.allNodes.push(node);
        }
        return this;
    }

    edges(entities) {
        return this.nodes(entities);
    }

    paint(painter) {
        painter.jsMondrianId = 'p-' + this.commits.length + '-' + this.painters.length;
        painter.paint(this.figureNodes);
        this.painters.push(painter);
        return this;
    }

    internalCommit(svg, nodes, painters) {
        let figure = svg
                     .selectAll('jsMondrianFigure')
                     .data(nodes)
                     .enter();
        for (let index in painters) {
            figure = painters[index].commit(figure);
        }
        return this;
    }

    commit(svg) {
        this.internalCommit(svg, this.figureNodes, this.painters);
        this.commits.push({
            nodes: this.figureNodes,
            painters: this.painters
        });
        return this;
    }

    reload(svg) {
        for (let index in this.commits) {
            let commit = this.commits[index];
            this.internalCommit(svg, commit.nodes, commit.painters);
        }
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
