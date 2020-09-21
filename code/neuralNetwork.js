// Author: Brian Bollen
// Description: Minimal example for PATCHY-SAN algorithm


graph = {
  V : [1,2,3,4,5],
  E: [[1,2],[2,3],[1,3],[4,5]]
}


/*---------------------------------

Input: Graph G, stride s,
Output: List of vertices equipped with the corresponding receptive fields. The receptive fields contain a set of vertices and a set of edges. It is useful if we have some sort of other object that illustrates what each edge and vertex has for an attribute value.

-----------------------------------*/
SelNodeSeq = (G,s,w,k) => {
  VSort = G.V.slice(-w); //If w is an integer, this will grab the last w elements, where we are ordering from lowest rank to highest
  i = 0, j = 0;
  ReceptiveFields = [];
  while(j < w){
    if(i < w){
      f = ReceptiveField(VSort[i],k);
    } else {
      f = ZeroReceptiveField();
    }
    ReceptiveFields.push(f);
    i = i + s, j = j + 1;
  }
  return ReceptiveFields;
}

ReceptiveField = (v,k) =>{
  var N = NeighAssemb(v,k);
  var GNorm = NormalizeGraph(N,v,k);
  return {vertex:v,receptiveField:GNorm};
}

/*---------------------------------

Input: Central vertex,
Output: List containing the vertices equipped with the distance from the central vertex

-----------------------------------*/



NeighAssemb = (v,k) => {
  var N = [{v,d:0,e:null}]; //We store the vertex with corresponding distance data of 0, meaning its the center
  var L = [{v,d:0,e:null}];
  var vertexList = [v]; //Stores just list of vertices to check if vertex is already added
  var dist = 0;
  while(N.length < k && L.length > 0){
    let updatedL = [];
    dist = dist + 1;
    L.forEach(entry => {
      NHood = Neighborhood(entry.v); //In this section, we add vertices attached with distance from central vertex
      NHood.forEach(newVertex => {
        if(!vertexList.includes(newVertex)){
          updatedL.push({
            v:newVertex,
            d:dist,
            e:[entry.v,newVertex]
          })
          vertexList.push(newVertex);  
        }
      })
    })
    L = updatedL; //If no new vertices added, L will be empty and the while loop will stop.
    N = N.concat(updatedL);
  }
  return N
}

/*---------------------------------

Input: Vertex v
Output: All vertices within distance 1 of v.

-----------------------------------*/

Neighborhood = v => {
  var N = [];
  graph.E.forEach(edge => {
    if(edge.includes(v)){
      node = edge.filter(vertex => vertex !== v)[0];
      N.push(node);
    }
  })
  return N
}

/*---------------------------------

Input: a vertex v, List of objects with a vertex and distance from v called U, receptive field k
Ouput: receptive field for v

-----------------------------------*/

NormalizeGraph = (U,v,k) => {
  //Compute Ranking to convert to linear order
  var GNormVertices = [];
  var GNormEdges = [];
  var N = {v:[],e:[]};
  for(let i = 0; i < 5;i++){
    let vertices = U.filter(entry => entry.d === i).map(entry => entry.v); //Get all vertices with distance i
    if(vertices && vertices.length > 0){
      vertices.sort((a,b) => b-a); //Sort in descending order which is based on our own labeling
      GNormVertices = GNormVertices.concat(vertices);
    }
  }
  GNormEdges = U.map(entry => entry.e);
  if(U.length > k){
    N.v = GNormVertices.slice(0,k);

    //Here we remove any edge that should be removed once we remove vertices

    N.e = GNormEdges.filter(edge => {
      var edgeStays = true;
      if(edge){
        edge.forEach(edgeVertex => {
          if(!N.v.includes(edgeVertex)){
            edgeStays = false;
          }
        })
      } else {
        edgeStays = false;
      }
      return edgeStays;
    })

  } else if (U.length < k){
    N.v = GNormVertices;
    N.e = GNormEdges;
    for(let i = 0; i < k - U.length; i++){
      N.v.push(0)
    }
  } else {
    N.v = GNormVertices;
    N.e = GNormEdges;
  }
  return N
}

finalReceptiveFields = SelNodeSeq(graph,1,4,2);
console.log(final);





