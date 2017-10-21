
class ComplexNumber {
    constructor(real, imaginary) {
        this.real = real;
        this.imaginary = imaginary;
    }

    asString() {
        return this.real + 'i*' + this.imaginary;
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
        return nodes, edges;
    }

    getSomeEllipses() {
        let nodes = [];
        nodes.push(new EllipseModel(50,  50, 20,  40, Color.RED.getRGB()));
        nodes.push(new EllipseModel(25,  90, 60, 100, Color.BLUE.getRGB()));
        nodes.push(new EllipseModel(75,  70, 45,  40, Color.BLUE.getRGB()));
        nodes.push(new EllipseModel(95,  85, 17,  15, Color.WHITE.getRGB()));
        nodes.push(new EllipseModel(75, 110, 60, 100, Color.RED.getRGB()));
        nodes.push(new EllipseModel(35, 120, 35,  60, Color.WHITE.getRGB()));
        nodes.push(new EllipseModel(95, 130, 30,  60, Color.WHITE.getRGB()));    
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
        let numbers, edges = this.getSomeNumbers();
        
        let fig = new Figure();
        fig.nodes(numbers, new RectangleNodePainter()
                .width((number) => number.real)
                .height((number) => number.imaginary)
        );
        fig.layout(new FlowLayout());
        let svg = new SVGRenderer(this.getCanvas());
        fig.renderOn(svg);
    }
}

new ObjectModels().main()
