const canvas = document.querySelector("canvas#drawing");
const context = canvas.getContext('2d')

canvas.width = window.innerHeight;
canvas.height = window.innerHeight;

const midpoint = (point1, point2) => {
    return new Point((point1.x + point2.x) / 2, (point1.y + point2.y) / 2, (point1.xvel + point2.xvel) / 2, (point1.yvel + point2.yvel) / 2);
}

const drawLine = (point1, point2) => {
    context.beginPath()
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

const drawTriangle = (point1, point2, point3, counter = 1) => {

    for (let i = 0; i < counter; ++i) {
        drawLine(point1, point2)
        drawLine(point2, point3)
        drawLine(point3, point1)

        let temppoint1 = midpoint(point1, point2)
        point2 = midpoint(point2, point3)
        point3 = midpoint(point1, point3)
        
        point1 = temppoint1
    }
}

class Point {
    constructor(x, y, xvel, yvel) {
        this.x = x;
        this.y = y;
        this.xvel = xvel;
        this.yvel = yvel;
    }

    update() {
        this.x += this.xvel;
        this.y += this.yvel;

        let outOfBounds = false;
        if (this.x < 0) {
            this.x = 0;
            outOfBounds = true;
        } else if (this.x > canvas.width) {
            this.x = canvas.width;
            outOfBounds = true;
        }
        if (outOfBounds) {
            this.xvel *= -1
        }

        outOfBounds = false;
        if (this.y < 0) {
            this.y = 0;
            outOfBounds = true;
        } else if (this.y > canvas.width) {
            this.y = canvas.width;
            outOfBounds = true;
        }
        if (outOfBounds) {
            this.yvel *= -1
        }
    }

    values() {
        return [this.x, this.y]
    }
}

const myRandomValue = () => {
    return Math.floor(Math.random() * 5) * Math.floor(Math.random() * 2) - 1;
}

let point1 = new Point(canvas.width / 2, 0, myRandomValue(), myRandomValue())
let point2 = new Point(0, canvas.height, myRandomValue(),  myRandomValue())
let point3 = new Point(canvas.width, canvas.height,  myRandomValue(), myRandomValue())
let points = [point1, point2, point3]

const loop = async () => {
    
    context.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach((point) => {
        point.update();
    });

    drawTriangle(point1, point2, point3, 100)

    setTimeout(() => {
        loop()
    }, 10);
}

loop()

