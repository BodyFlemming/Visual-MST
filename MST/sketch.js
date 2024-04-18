let graph
let currentVertice;
let off;
let middleV

function setup() {
  ellipseMode(RADIUS);
  createCanvas(windowWidth, windowHeight);
  background(0, 0, 0);
  graph = new Graph(15);
  graph.primMST();
  currentVertice = -1;
  off = random(10000);
  middleV = createVector(width/2, height/2);
}

function draw() {
  background(34, 45, 90);
  off += 0.005;
  if (currentVertice != -1) 
  {
    graph.vertices[currentVertice].pos.x = mouseX;
    graph.vertices[currentVertice].pos.y = mouseY;
    graph.updateWeightsVertice(currentVertice);
  }
  graph.updateWeights();
  graph.primMST();
  graph.moveVertices();
  graph.show();
}

function mousePressed() {
  for (let i = 0; i < graph.vertices.length; ++i)
  {
    v = graph.vertices[i]; 
    if (dist(mouseX, mouseY, v.pos.x, v.pos.y) < v.radius)
    {
      currentVertice = i;
      v.pressed = true;
    }
  }
}

function mouseReleased() {
  graph.vertices[currentVertice].pressed = false;
  currentVertice = -1;
}