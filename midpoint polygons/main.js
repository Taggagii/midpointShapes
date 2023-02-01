const canvas = document.querySelector("canvas#drawing");
const context = canvas.getContext('2d')

canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio - 200;

const midpoint = (point1, point2) => {
    return new Point((point1.x + point2.x) / 2, (point1.y + point2.y) / 2, (point1.xvel + point2.xvel) / 2, (point1.yvel + point2.yvel) / 2, point1.boundsExpansion);
}

const drawLine = (point1, point2) => {
    context.beginPath()
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
    // if (cleanupFactor > depth) {
    //     console.log(cleanupFactor, depth)
    //     throw new Error('cleanupfactor cannot be larger than depth')
    // }
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
            drawLine(point1, point2)
            newpoints.push(midpoint(point1, point2))
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

    values() {
        return [this.x, this.y]
    }
}

const myRandomValue = (maxValue, unsigned = true) => {
    if (unsigned) {
        return Math.floor(Math.random() * maxValue)
    }
    return Math.floor(Math.random() * maxValue) * Math.floor(Math.random() * 2) - 1;
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


let numberOfPoints = 100
let points = []
let maxVel = 25;
let boundsExpansion = 0;
let value = 800;
let layersToHide = 20;


const pointCountSlider = document.getElementById('pointCount');
const layersToHideSlider = document.getElementById('layersToHide');
const layersSlider = document.getElementById('layers');
const maxVelocitySlider = document.getElementById('maxVelocity');
// const collisionBoundsSlider = document.getElementById('collisionBounds');
const regenerateButton = document.getElementById('reset');

// context.lineWidth = 1;

numberOfPoints = pointCountSlider.value;
maxVel = maxVelocitySlider.value;
// boundsExpansion = parseInt(collisionBoundsSlider.value);
value = layersSlider.value;
layersToHide = layersToHideSlider.value;



layersToHideSlider.max = layersSlider.value - 1;

layersToHideSlider.addEventListener('input', (event) => {
    layersToHide = layersToHideSlider.value;
});

layersSlider.addEventListener('input', (event) => {
    if (layersSlider.value - 1 < layersToHideSlider.value) {
        layersToHide = layersSlider.value - 1;
        layersToHideSlider.value = layersSlider.value - 1;
    }
    value = layersSlider.value;
    layersToHideSlider.max = layersSlider.value - 1;
});

pointCountSlider.addEventListener('input', (event) => {
    let desiredLength = pointCountSlider.value;
    let difference = desiredLength - numberOfPoints;
    
    if (difference > 0) { // if postive then we need to add points
        for (let i = 0; i < difference; ++i) {
            points.push(new Point(myRandomValue(canvas.width), myRandomValue(canvas.height), myRandomValue(maxVel, false), myRandomValue(maxVel, false),
                   boundsExpansion))
        }
    } else if (difference < 0) { // if negative then we need to remove points
        for (let i = 0; i < Math.abs(difference); ++i) {
            points.pop();
        }
    }

    numberOfPoints = pointCountSlider.value;
    
});

maxVelocitySlider.addEventListener('input', (event) => {
    const ratio = maxVelocitySlider.value / maxVel;
    maxVel = maxVelocitySlider.value;

    points.forEach((point) => {
        point.xvel *= ratio;
        point.yvel *= ratio;
    });
});

regenerateButton.addEventListener('click', (event) => {
    points = [];
    for (let i = 0; i < numberOfPoints; ++i) {
        points.push(new Point(myRandomValue(canvas.width), myRandomValue(canvas.height), myRandomValue(maxVel, false), myRandomValue(maxVel, false),
                   boundsExpansion))
    }
});


// let boundsExpansion = canvas.width / 4;
for (let i = 0; i < numberOfPoints; ++i) {
    points.push(new Point(myRandomValue(canvas.width), myRandomValue(canvas.height), myRandomValue(maxVel, false), myRandomValue(maxVel, false),
               boundsExpansion))
}


const loop = async () => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach((point) => {
        point.update();
    });

    drawPolygon(points, value, layersToHide)

    setTimeout(() => {
        loop()
    }, 0);
}

loop()
