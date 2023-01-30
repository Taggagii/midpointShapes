const canvas = document.querySelector("canvas#drawing");
const context = canvas.getContext('2d')

canvas.width = window.innerHeight;
canvas.height = window.innerHeight;

const midpoint = (point1, point2) => {
    return new Point((point1.x + point2.x) / 2, (point1.y + point2.y) / 2, (point1.xvel + point2.xvel) / 2, (point1.yvel + point2.yvel) / 2, point1.boundsExpansion);
}

const drawLine = (point1, point2, color = 'black') => {
    context.beginPath()
    context.strokeStyle = color
    context.lineWidth = 3
    context.moveTo(...point1.values());
    context.lineTo(...point2.values())
    context.stroke()

    // drawBall(...midpoint(x1, y1, x2, y2))
}

const drawBall = (point) => {
    context.beginPath()
    context.arc(...point.values(), 5, 0, 2 * Math.PI)
    context.fill()
}


const drawPolygon = (points, depth = 1, cleanupFactor = 0) => {

    if (cleanupFactor > depth) {
        throw new Error('cleanupfactor cannot be larger than depth')
    }
    for (let i = 0; i < cleanupFactor; ++i) {
        let newpoints = []
        for (let ii = 0; ii < points.length; ++ii) {
            let point1 = points[ii];
            let point2 = points[(ii + 1) % points.length]
            newpoints.push(midpoint(point1, point2))
        }
        points = newpoints
    }

    for (let i = 0; i < depth - cleanupFactor; ++i) {
        newpoints = [];
        for (let ii = 0; ii < points.length; ++ii) {
            let point1 = points[ii];
            let point2 = points[(ii + 1) % points.length]
            // drawLine(point1, point2)

            newPoint = midpoint(point1, point2)

            drawLine(point1, newPoint, 'black')
            drawLine(point2, newPoint, 'red')
            
            newpoints.push(newPoint)
        }
        points = newpoints
    }
}

class Point {
    constructor(x, y, xvel, yvel, boundsExpansion = 0) {
        this.x = x;
        this.y = y;
        this.xvel = xvel;
        this.yvel = yvel;
        this.lowBoundX = 0 - boundsExpansion;
        this.lowBoundY = 0 - boundsExpansion;
        this.highBoundY = canvas.height + boundsExpansion;
        this.highBoundX = canvas.width + boundsExpansion;
    }

    update() {
        this.x += this.xvel;
        this.y += this.yvel;

        let outOfBounds = false;
        if (this.x < this.lowBoundX) {
            this.x = this.lowBoundX;
            outOfBounds = true;
        } else if (this.x > this.highBoundX) {
            this.x = this.highBoundX;
            outOfBounds = true;
        }
        if (outOfBounds) {
            this.xvel *= -1
        }

        outOfBounds = false;
        if (this.y < this.lowBoundY) {
            this.y = this.lowBoundY;
            outOfBounds = true;
        } else if (this.y > this.highBoundY) {
            this.y = this.highBoundY;
            outOfBounds = true;
        }
        if (outOfBounds) {
            this.yvel *= -1
        }
    }

    duplicate() {
        return new Point(this.x, this.y, this.xvel, this.yvel, this.lowBoundX, this.lowBoundY, this.lowBoundY, this.lowBoundX)
    }

    values() {
        return [this.x, this.y]
    }
}

const myRandomValue = (maxValue, unsigned = true) => {
    if (unsigned) {
        return Math.floor(Math.random() * maxValue)
    }
    return Math.floor(Math.random() * maxValue) * ((Math.floor(Math.random() * 2) - 1));
}

const probabilisticTrue = (probability) => {
    if (probability < 0 || probability > 1) {
        throw new Error('probablity must be between 0 and 1')
    }

    if (probability == 0) {
        return false;
    }

    if (probability == 1) {
        return true;
    }

    let numberOfElements = Math.pow(probability, -1);
    return !Math.floor(Math.random() * numberOfElements)
}

let maxVel = 100;

let originsize = 250
boundsExpansion = 0
let points = []
for (let i = 0; i < originsize; ++i) {
    points.push(new Point(myRandomValue(canvas.width), myRandomValue(canvas.height), myRandomValue(maxVel, false), myRandomValue(maxVel, false),
    boundsExpansion))
}

let index = 0
const loop = () => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    // points.forEach((point) => {
    //     point.update()
    // })


    let value = 200
    drawPolygon(points, value, value - 50)
    let temppoint = points[index].duplicate()
    

    points.push(temppoint)
    index++;
    setTimeout(() => {
        loop()
    }, 0);
}
loop();