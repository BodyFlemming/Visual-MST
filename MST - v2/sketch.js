let graph
let currentVertice;
let off;

function setup() {
  ellipseMode(RADIUS);
  createCanvas(windowWidth, windowHeight);
  background(0, 0, 0);
  graph = new Graph(2);
  graph.primMST();
  currentVertice = -1;
  off = random(10000);
}

function draw() {
  background(0, 0, 4);

  off += 0.005;
  if (currentVertice != -1) // Controls the movement of held vertice
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
  let verticeFound = false; // Becomes true if a circle is clicked
  for (let i = 0; i < graph.vertices.length; ++i)
  {
    v = graph.vertices[i]; 
    if (dist(mouseX, mouseY, v.pos.x, v.pos.y) < v.radius)
    {
      currentVertice = i; // A index, which is used to draw to keep the same vertice moving
      v.pressed = true; // Used in the vertice to color 
      verticeFound = true;
    }
  }
  if (!verticeFound)
  {
    graph.weight[graph.vertices.length] = []; // Resizing the weight array
    graph.vertices.push(new Vertice(mouseX, mouseY, graph.vertices.length)); // add a new Vertice at mouse position
    let connectionAmount = floor(random(2, 5)) // Generate a random amount of connections
    for (let i = 0; i < connectionAmount; ++i)
    {
      let v = floor(random(0, graph.vertices.length));
      if (v == graph.vertices.length-1) continue; // Skip if the randomly generated v-id is itself
      graph.addWeightedConnection(graph.vertices.length-1, v, 10);
    }

    // If all of the random generated v's are equal to itself, no weights are initialised
    // Therefore manually init a weighted connection to zero, if all fails
    if (graph.weight[graph.vertices.length-1] == false) 
    {
      graph.addWeightedConnection(graph.vertices.length-1, 0, 10);
    }
  }
}

function mouseReleased() {
  if (currentVertice != -1)
  {
    graph.vertices[currentVertice].pressed = false;
    currentVertice = -1;
  }

}