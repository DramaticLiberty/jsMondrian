
class FlowLayout extends Painter {
    constructor(horizontal, hSpace, vSpace, limit) {
        super();
        this._addDimension('x', (e) => 0);
        this._addDimension('y', (e) => 0);
        
        this.horizontal = ifUndefined(horizontal, true);
        this.limit = limit;
        this.hSpace = ifUndefined(hSpace, 5);
        this.vSpace = ifUndefined(vSpace, 5);

        this.nextLocation = this.nextHorizontal;
        if (!this.horizontal) {
            this.nextLocation = this.nextVertical;
        }
    }

    paint(nodes) {
        let x = this.hSpace;
        let y = this.vSpace;
        let layoutWidth = this.vSpace;
        let layoutHeight = this.hSpace;
        
        for (let index in nodes) {
            let node = this.paintNode(nodes[index]);
            let absx = x, absy = y;
            node.x = () => absx;
            node.y = () => absy;
            layoutWidth = Math.max(layoutWidth, x + node.width());
            layoutHeight = Math.max(layoutHeight, y + node.height());
            [x, y] = this.nextLocation(node, x, y, layoutWidth, layoutHeight);
        }
        return [layoutWidth, layoutHeight]
    }

    nextHorizontal(node, x, y, layoutWidth, layoutHeight) {
        let nextX = x + this.hSpace + node.width(), nextY = y;
        if (typeof this.limit != 'undefined' && nextX > this.limit) {
            nextX = this.hSpace;
            nextY = layoutHeight + this.vSpace
        }
        return [nextX, nextY];
    }

    nextVertical(node, x, y, layoutWidth, layoutHeight) {
        let nextX = x, nextY = y + this.vSpace + node.height();
        if (typeof this.limit != 'undefined' && nextY > this.limit) {
            nextY = this.vSpace;
            nextX = layoutWidth + this.hSpace
        }
        return [nextX, nextY];
    }
}
