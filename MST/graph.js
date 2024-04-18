class Graph {
    constructor(amount)
    {
        // Counter for id for vertices
        this.counter = 0;
        
        // Creates random vertices
        this.vertices = [];
        for (let i = 0; i < amount; ++i) 
        {
            this.vertices.push(new Vertice(random(0, width), random(0, height), this.counter));
            this.counter++
        }

        // creates 2D array for weights
        this.weight = new Array(amount);
        for (let i = 0; i < amount; ++i) 
        {
            this.weight[i] = new Array(amount);
        }
        // Set up the weight array
        for (let i = 0; i < this.weight.length; ++i)
        {
            for (let k = 0; k < this.weight.length; ++k)
            {
                this.weight[i][k] = 1000000;
                if (i == k)
                {
                    this.weight[i][k] = 0;
                }
            }
        }

        for (let i = 0; i < amount*4; ++i)
        {
            let v = floor(random(0,amount))
            let u = i%amount;
            //console.log(v, u)
            if (v == u) continue;
            let cost = dist(this.vertices[v].pos.x, this.vertices[v].pos.y, this.vertices[u].pos.x, this.vertices[u].pos.y);
            this.addWeightedConnection(u, v, cost);
        }
    }

    addWeightedConnection(u, v, weight)
    {
        this.vertices[u].adj.push(this.vertices[v]);
        this.vertices[v].adj.push(this.vertices[u]);
        this.weight[u][v] = weight;
        this.weight[v][u] = weight;
    }

    updateWeightsVertice(uId) {
        let u = this.vertices[uId];
        for (let i = 0; i < u.adj.length; ++i) 
        {
            let v = u.adj[i].id;
            this.weight[uId][v] = dist(this.vertices[v].pos.x, this.vertices[v].pos.y, this.vertices[uId].pos.x, this.vertices[uId].pos.y);
            this.weight[v][uId] = dist(this.vertices[v].pos.x, this.vertices[v].pos.y, this.vertices[uId].pos.x, this.vertices[uId].pos.y);
        }
    }

    updateWeights() {
        for (let i = 0; i < this.vertices.length; ++i)
        {
            let u = this.vertices[i].id;
            for (let k = 0; k < this.vertices[i].adj.length; ++k)
            {
                let v = this.vertices[i].adj[k].id;
                if (v == u) continue;
                let cost = dist(this.vertices[v].pos.x, this.vertices[v].pos.y, this.vertices[u].pos.x, this.vertices[u].pos.y);
                this.weight[u][v] = cost;
            }
        }
    }

    moveVertices() {
        for (let i = 0; i < this.vertices.length; ++i) 
        {
            this.vertices[i].move();
        }
    }

    show() 
    {
        // draws the edges
        push();
        strokeWeight(3);
        for (let i = 0; i < this.vertices.length; ++i) 
        { 
            let u = this.vertices[i];
            for (let k = 0; k < u.adj.length; ++k) 
            {
                let v = u.adj[k];
                if (v.id < i || this.vertices[i].parent == v.id || this.vertices[v.id].parent == i) continue;
                stroke(255, map(this.weight[i][v.id], width, 0, 1, 60));
                line(v.pos.x, v.pos.y, u.pos.x, u.pos.y);
            }
        }
        pop();

        // Draws edged found via primeMST
        for (let i = 1; i < this.vertices.length; ++i)
        {
            push();
            strokeWeight(3);
            stroke(20, 20, 23, 235);
            let c = this.vertices[i];
            let p = this.vertices[this.vertices[i].parent]
            line(c.pos.x, c.pos.y, p.pos.x, p.pos.y);
            pop();
        }


        // Draws the vertices
        for (let i = 0; i < this.vertices.length; ++i)
        {
          this.vertices[i].show();
        }
    }

    primMST() {
        let mst_wt = 0;	// Initialize result
        // vector <int>parent(adj.size());	// Array to store MST
        //vector <int>key(adj.size());	// Values to pick minimum weight edge in cut
        //vector <bool>visited(adj.size());	// To represent set of vertices included
        let size = this.vertices.length;
        let key = new Array(size);
        let visited = new Array(size);
    
        // Initialize all keys as INFINITE
        for (let i = 0; i < size; i++) {
            key[i] = 1000000; 
            visited[i] = false;
        }
    
        // Always include first 1st vertex in MST, make sure it is picked first.
        key[0] = 0;
        this.vertices[0].parent = -1;				// First node is always root of MST
    
        // The MST will have V vertices
        for (let count = 0; count < size; count++) {
            // Pick the minimum key vertex not yet included in MST
            let min = 1000000;
            let u;
            for (let v = 0; v < size; v++) {
                if (visited[v] == false && key[v] < min) {
                    min = key[v];
                    u = v;
                }
            }
            // Add the picked vertex to the MST Set
            visited[u] = true;
            if (u != 0) {
                mst_wt += min;
                //cout << u << " - " << parent[u] << ", ";
            }
            // Update key/parent of the adjacent vertices of the picked vertex.
            for (let i = 0; i < this.vertices[u].adj.length; ++i) {
                let v = this.vertices[u].adj[i].id;
                if (this.weight[u][v] && visited[v] == false && this.weight[u][v] < key[v]) {
                    this.vertices[v].parent = u; 
                    key[v] = this.weight[u][v];
                }
            }
        }
        return mst_wt;
    }
}