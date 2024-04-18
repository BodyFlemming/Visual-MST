class Vertice {
    constructor(x, y, id)
    {
        this.id = id;
        this.pos = createVector(x, y);
        this.radius = 10;
        this.pressed = false;
        this.adj = [];
        this.visited = false;
        this.parent;
        this.vel = createVector();
        this.xOffset = random(0, 10000);
        this.yOffset = random(0, 10000);
        this.middleV = createVector(width/2, height/2); // Used in the calculation of the vertice movement. calculated once to save computations
    }

    move() {
        this.vel.x += map(noise(off + this.xOffset), 0, 1, -0.1, 0.1);
        this.vel.y += map(noise(off + this.yOffset), 0, 1, -0.1, 0.1);
        this.attraction = p5.Vector.sub(this.middleV, this.pos); // A vector pointing to the middle of the screen
        this.attraction.setMag(map(this.attraction.mag(), 0, width/2, 0, 0.02)); // Increased size based on distance from middle
        //drawArrow(this.pos, p5.Vector.mult(this.attraction,4000), 'red'); // Can be used to visualize the arrow
        this.vel.add(this.attraction);
        this.vel.setMag(0.5); // Insures a constant speed
        this.pos.add(this.vel);
    }

    show() {
        push();
        if (!this.pressed) { fill(255,255,255) }
        else { fill(173, 174, 175) }
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.radius);
        fill('red');
        //text(this.id, this.pos.x, this.pos.y);
        pop();
    }
};

function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }