
class ComplexNumber {
    constructor(real, imaginary) {
        this.real = real;
        this.imaginary = imaginary;
    }

    asString() {
        return this.real + ' + i*' + this.imaginary;
    }

    sum() {
        return this.real + this.imaginary;
    }

    modulo1() {
        return this.real*this.real + this.imaginary*this.imaginary;
    }

    getComponents() {
        return [Math.floor(this.real), 2 * Math.floor(this.imaginary)]
    }
}

class ComplexDuo {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}

class EllipseModel {
    constructor(x, y, rx, ry, color) {
        this.x = x;
        this.y = y;
        this.rx = rx;
        this.ry = ry;
        this.color = color;
    }    
}

class RectangleModel {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }    
}

class ObjectModels {
    getSomeNumbers() {
        let a = new ComplexNumber( 20, 20);
        let b = new ComplexNumber(100,100);
        let c = new ComplexNumber( 50, 50);
        let nodes = [];
        nodes.push(a);
        nodes.push(b);
        nodes.push(c);
        let edges = []
        edges.push(new ComplexDuo(b, a));
        edges.push(new ComplexDuo(c, a));
        return [nodes, edges];
    }

    getSomeEllipses() {
        let nodes = [];
        nodes.push(new EllipseModel(50,  50, 20,  40, '#FF0000'));
        nodes.push(new EllipseModel(25,  90, 60, 100, '#0000FF'));
        nodes.push(new EllipseModel(75,  70, 45,  40, '#0000FF'));
        nodes.push(new EllipseModel(95,  85, 17,  15, '#FFFFFF'));
        nodes.push(new EllipseModel(75, 110, 60, 100, '#FF0000'));
        nodes.push(new EllipseModel(35, 120, 35,  60, '#FFFFFF'));
        nodes.push(new EllipseModel(95, 130, 30,  60, '#FFFFFF'));
        return nodes;
    }

    getSomeRectangles() {
        let nodes = [];
        nodes.push(new RectangleModel(25, 144, 52, 50));
        nodes.push(new RectangleModel(76, 159, 60, 51));
        return nodes;
    }

    getCanvas() {
        return document.getElementById('container');
    }

    main() {
        let numbers, edges;
        [numbers, edges] = this.getSomeNumbers();
        
        let rendition = new SVGRenderer(this.getCanvas());
        let fig = new Figure();
        fig.nodes(numbers)
           .paint(new RectangleNode()
                .label((number) => number.asString())
                .width((number) => number.real)
                .height((number) => number.imaginary))
           .paint(new FlowLayout())
           .commit(rendition.svg)

        fig.nodes(numbers)
           .paint(new EllipseNode()
                .label((number) => number.asString())
                .width((number) => number.imaginary)
                .height((number) => number.real))
           .paint(new FlowLayout(false, 5, 50))
           .commit(rendition.svg)
           .edges(edges)
           .paint(new LineEdge()
                 .from((pair) => pair.a)
                 .to((pair) => pair.b))
           .commit(rendition.svg)
           .nodes(this.getSomeEllipses())
           .paint(new EllipseNode()
                 .label((eli) => eli.color=='#FFFFFF' ? 'A white ellipse' : 'A coloured ellipse')
                 .fill((eli) => eli.color)
                 .x((eli) => 5*eli.x - eli.rx)
                 .y((eli) => 4*eli.y - eli.ry)
                 .width((eli) => eli.rx*2)
                 .height((eli) => eli.ry*2))
           .commit(rendition.svg);
    }

    grid() {
        let theGrid = [];
        for (let i=0; i<20; i++) {
            for (let j=0; j<15; j++) {
                theGrid.push({
                    color: '#F0F0F0',
                    hover: false,
                    x: i,
                    y: j
                });
            }
        }

        theGrid[81].color = '#C0C0C0';
        theGrid[82].color = '#C0C0C0';
        theGrid[96].color = '#C0C0C0';
        theGrid[97].color = '#C0C0C0';

        theGrid[141].color = '#C0C0C0';
        theGrid[142].color = '#C0C0C0';
        theGrid[156].color = '#C0C0C0';
        theGrid[157].color = '#C0C0C0';
        
        let rendition = new SVGRenderer(this.getCanvas());
        let fig = new Figure();
        
        fig.nodes(theGrid)
           .paint(new RectangleNode()
               .label(() => 'A box')
               .fill((box) => box.color)
               .stroke((box) => box.hover ? '#101060' : '#106010')
               .x((box) => 10 + 40*box.x)
               .y((box) => 10 + 30*box.y)
               .width(() => 40)
               .height(() => 30)
               .onClick((box) => {
                   box.color = box.color == '#C0C0C0' ? '#F0F0F0': '#C0C0C0';
                   fig.reload(rendition.svg);
               })
               .onMouseEnter((box) => {
                   box.hover = true;
                   fig.reload(rendition.svg);
               })
               .onMouseLeave((box) => {
                   box.hover = false;
                   fig.reload(rendition.svg);
               })
           )
           .commit(rendition.svg)
        window.setTimeout(function() {
            theGrid[158].color = theGrid[158].color == '#C0C0C0' ? '#F0F0F0': '#C0C0C0';
            theGrid[173].x = theGrid[173].x + 0.01;
            theGrid[159].y = theGrid[159].y + 0.01;
            fig.reload(rendition.svg);
        }, 200);
    }
}
