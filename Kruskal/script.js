window.addEventListener("load", foo);

function foo(){
	document.getElementById("canvas").addEventListener("click", create_vertex);
}

var count = 0;

//-----------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------Creating The Graph For Javascript-----------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

var Graph = new Object();

Graph.Vertices = new Array();	//Array of all the vertices of the graph (Adjacency List)
Graph.Edges = new Array();		//Array of all the edges of the graph

function _add_vertex(vertex){
/*
	Create a new Vertex ojbect which has the following attributes :
		element : contains the HTML div element corresponding the vertex of the graph in the DOM
		Adj : an array of all the vertices that are adjacent to the current vertex (Adjacency List)
		distance : a number that tells it's distance from the source vertex
		_parent : a pointer that points to it's predecessor in the shortest path
		visited : a boolean value that tells the program wheather the vertex has been visited or not in the traversal

	The Vertex object is then pushed into array "Graph.Vertices"
	The Array "Graph.Vertices" is the required Adjacency List representation of the graph
*/
	var V = new Object();	
	V.element = vertex;
	V.Adj = new Array();
	V.visited = false;
	V.discovered = false;

	Graph.Vertices.push(V);
}


function _add_edge(origin,endpoint,line,weight){
/*
	Create a new "edge" Object which has the following attributes:
		origin : a HTML div element corresponding to the origin vertex of the edge
		endpoint : a HTML div element corresponding to the endpoint vertex of the edge
		weight : a number that represents the weight of the edge
		line : a reference to the HTML div element the contains the line corresponding to the edge

  	The edge object is then pushed into array "Graph.Edges" 
  	The adjacency lists of the origin and endpoint vertices are modified here
*/
	edge = new Object();	
	edge.origin = origin;		
	edge.endpoint = endpoint;
	edge.weight = weight;
	edge.line = line;

	Graph.Edges.push(edge);

	s = get_graph_vertex(origin);
	d = get_graph_vertex(endpoint);

	if (check_duplicates_in_Adj(s,d))	//Checking if the edge already exists, multiple edges are disallowed
	{
		s.Adj.push(d);
		d.Adj.push(s);
	}

	else
	{
		alert("The edge already exists, multiple edges are not allowed.");
		line.parentNode.removeChild(line);	//Removes the duplicate edge line from the DOM
	}

}


function check_duplicates_in_Adj(u,v){
/*
	Returns 
		false : if the vertex "u" already has vertex "v" in it's adjacency list
				or if vertex "v" already has vertex "u" in it's adjacency list

		true : otherwise
	
	This function returns false if the edge with origin and endpoint vertices passed to it already exists, 
	otherwise, it returns true
*/
	var i;
	var j;
	for(i=0; i < Graph.Vertices.length; i++)
	{
		for(j=0; j < Graph.Vertices.length; j++)
		{
			if (Graph.Vertices[i] == u && Graph.Vertices[i].Adj[j] == v)
			{
				return false;
			}
		}
	}
	return true;
}


function get_graph_vertex(div){
/*
	Function for getting the graph vertex object corresponding to a div element.
	This is required because the div element doesn't have Adj attribute that can give the adjacenct vertices
	whereas the graph vertex object has adjacent vertices attribute.
*/

	var i;
	for(i=0; i < Graph.Vertices.length; i++)
	{
		if (Graph.Vertices[i].element.id == div.id)
		{
			return Graph.Vertices[i];
		}
	}
}

function _show_edges(){			//Display all the edges of the graph
	var i;
	for(i=0; i < this.Edges.length; i++)
	{
		alert(this.Edges[i].weight);
	}
}

function _show_vertices(){		//Display all the vertices of the graph
	var i;
	var j;
	var s = "";
	for(i=0; i < this.Vertices.length; i++)
	{
		s = s + this.Vertices[i].element.id + " : ";
		for(j=0; j< this.Vertices[i].Adj.length; j++)
		{
			s = s + this.Vertices[i].Adj[j].element.id + "--";
		}
		s = s + "\n";
	}
	alert(s);
}

function _weight(origin,endpoint){
	s = origin.element.id;
	d = endpoint.element.id;

	var i;
	for(i=0; i < Graph.Edges.length; i++)
	{
		if(Graph.Edges[i].origin.id == s && Graph.Edges[i].endpoint.id == d){
			return Graph.Edges[i].weight;
		}

		if(Graph.Edges[i].endpoint.id == s && Graph.Edges[i].origin.id == d){
			return Graph.Edges[i].weight;
		}
	}
}


Graph.add_vertex = _add_vertex;
Graph.add_edge = _add_edge;
Graph.show_vertices = _show_vertices;
Graph.show_edges = _show_edges;
Graph.weight = _weight;

//-----------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------The HTML Interface------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

var start_x = null;
var start_y = null;
var start_div = null;

var end_x = null;
var end_y = null;
var end_div = null;

function create_vertex(e){
	x = parseInt(e.clientX);		//getting x co-ordinate of mouseclick
	x = x - 30;						//shifting for appropriate position such that vertex's horizontal centre coincides with the cursor
	y = parseInt(e.clientY);		//getting y co-ordinate of mouseclick
	y = y - 90;						//shifting for appropriate position such that vertex's vertical centre coincides with the cursor


	var div = document.createElement("div");
	var div_text = document.createElement("p");

	count = count + 1

	//Stylings of the vertex
	div.style.zIndex = "2";
	div.style.position = "absolute";
	div.id = count;
	div_text.innerHTML = count;
	div_text.style.position = "relative";
	div_text.style.marginLeft = "15px";
	div_text.style.marginTop = "10px";
	div.style.backgroundColor = "white";
	div.style.border = "2px solid #404040";
	div.style.borderRadius = "50%";
	div.style.color = "black";
	div.style.transitionProperty = "background-color";
	div.style.transitionDuration = "1s";


	//Dimensions of the vertex
	div.style.height = "40px";
	div.style.width = "40px";

	//Positionings
	div.style.marginLeft = x + "px";
	div.style.marginTop = y + "px";
	
	div.appendChild(div_text);

	//Adding event listeners to create edges of the graph
	div.addEventListener("mousedown", get_origin_coordinates);
	div.addEventListener("mouseup", get_destination_coordinates);

	document.getElementById("canvas").appendChild(div);

	Graph.add_vertex(div);
}

function get_origin_coordinates(){
	start_x = parseInt(this.style.marginLeft) + 20;		//x co-ordinate of origin vertex
	start_y = parseInt(this.style.marginTop) + 20;		//y co-ordinate of origin vertex
	start_div = this;
}

function get_destination_coordinates(){
	end_x = parseInt(this.style.marginLeft) + 20;		//x co-ordinate of endpoint vertex
	end_y = parseInt(this.style.marginTop) + 20;		//y co-ordinate of endpoint vertex
	end_div = this;

	if(start_x != null && start_y != null && end_x != null && end_y != null) //draw a line only if all four co-ordinates are available
	{	
		createLine(start_div,end_div, start_x, start_y, end_x, end_y); 		//passing divs into the function to facilitate creatiing edges in the graph
	}

	start_x = null;			// Reassign null values
	start_y = null;			// to all the co-ordinates after
	end_x = null;			// drawing the line
	end_y = null;		
	start_div = null;
	end_div = null;	
}


function createLine(start_div, end_div, x1, y1, x2, y2){

	var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));	//getting the x length of the line according to Euclid's distance formula
	var angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;	//getting angle using the slope of the line
	var transform = 'rotate('+angle+'deg)';						//rotate the line by the obtained angle
	var weight = window.prompt("Enter weight for this edge");

	//s = "";

	var line = document.createElement("div");	//creating the div that contains the line
	//var weight_text = document.createTextNode(weight);
	
	s = "<span style=\"font-size:20px;position:absolute;margin-top:10px;font-weight:bold;\">" + weight +"</span>";	//adding styles for the edge weight which has toappear in the div "line"
				//class = line has css predefined css stylings in style.css


	line.id = "edge_" + start_div.id + "_" + end_div.id;		//id has the syntax edge_origin-vertex-id_destination-vertex-id
	line.className = "line";
	//stylings of the line
	line.style.position = "absolute";
	line.style.transform = transform;
	line.style.width = length;
	line.style.marginLeft = x1;
	line.style.marginTop = y1;
	line.style.textAlign = "center";
	line.innerHTML = s;
	
	document.getElementById("canvas").appendChild(line);
	Graph.add_edge(start_div,end_div,line,weight);
}



//-----------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------Implementing Kruskal's Algorithm-------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

//---------------Priority Queue For Edges----------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------
function _insert(edge){
	this._data.push(edge);
	this._size = this._size + 1;
}

function _extract_min(){
	var i;
	var min = 0;
	for(i=0; i < this._data.length; i++)
	{
		if(parseInt(this._data[i].weight) < parseInt(this._data[min].weight))
		{
				min = i;
		}	
	}

	var last = this._data.length - 1;

	var temp = this._data[last];
	this._data[last] = this._data[min];
	this._data[min] = temp;
	this._size = this._size - 1;

	var deleted = this._data[last];
	this._data.pop()

	return deleted;
}

function _is_empty(){
	return this._size == 0;
}

/*function _display(){
	var s = "";
	while(! this.is_empty())
	{
		var n = this.extract_min();
		s = s + n.weight + "--";
	}
	alert(s);
}*/

var PriorityQueue = new Object();
PriorityQueue._data = new Array();
PriorityQueue._size = 0;

PriorityQueue.is_empty = _is_empty;
PriorityQueue.insert = _insert;
PriorityQueue.extract_min = _extract_min;
//PriorityQueue.disp = _display;


function show_arr(arr){
	var i;
	var s = " ";
	//alert("this was a success");
	for(i=0; i < arr.length; i++)
	{
	//	alert("I'm in here");
		s = s + arr[i]._name + ", ";
	}

	//alert("Came out");

	alert(s);
}
//--------------------------------------MST So Far---------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
var MST = new Object();
MST.Vertices = new Array();
MST.edge_count = 0;

function MST_add_vertex(n){
  var MSTVertex = new Object();
  MSTVertex._name = n;
  MSTVertex.Adj = new Array();
  MSTVertex.visited = false;
  MST.Vertices.push(MSTVertex);
//  alert("Vertex Added : " + n);
  return MSTVertex;
}

function MST_add_edge(origin,endpoint){
  if(MST_check_duplicates(origin,endpoint)){

//  		alert("Before Adding Edge (" + origin._name + ", " + endpoint._name + ") Showing Adj of " + origin._name);
 // 		show_arr(origin.Adj);
//  		alert("Before Adding Edge (" + origin._name + ", " + endpoint._name + ") Showing Adj of " + endpoint._name);
//  		show_arr(endpoint.Adj);

    	origin.Adj.push(endpoint);
    	endpoint.Adj.push(origin);

//  		alert("After Adding Edge (" + origin._name + ", " + endpoint._name + ") Showing Adj of " + origin._name);
 // 		show_arr(origin.Adj);
//  		alert("After Adding Edge (" + origin._name + ", " + endpoint._name + ") Showing Adj of " + endpoint._name);
//  		show_arr(endpoint.Adj);

    	this.edge_count = this.edge_count + 1;
 //   	alert("Edge added : (" + origin._name + ", " + endpoint._name + ")");
  }
}

function MST_check_duplicates(u,v){
  var i,j;
  for(i=0; i < MST.Vertices.length; i++)
  {
    if(MST.Vertices[i] == u){
      for(j=0; j < MST.Vertices.length; j++)
      {
        if(MST.Vertices[i].Adj[j] == v){
          return false;
        }
      }
    }
  } 
  return true;
}

function MST_get_vertex(n){
	var i;
	for(i=0; i < MST.Vertices.length; i++)
	{
		if(MST.Vertices[i]._name == n){
			return MST.Vertices[i];
		}
	}
}

MST.add_vertex = MST_add_vertex;
MST.add_edge = MST_add_edge;
MST.get_vertex = MST_get_vertex;


//------------------------------------------Creates Cycle Method---------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
function creates_cycle(edge){

	var s = edge.origin.id;
	var d = edge.endpoint.id;

//	alert("Checking for edge : (" + s + ", " + d);

	var ufound = false;
	var vfound = false;

	var i;
	var j;

	for(i=0; i < MST.Vertices.length; i++)
	{
		if(MST.Vertices[i]._name == s){
			ufound = true;
			break;
		}
	}

	for(i=0; i < MST.Vertices.length; i++)
	{
		if(MST.Vertices[i]._name == d){
			vfound = true;
			break; 
		}
	}


	if(ufound == true && vfound == true){
//		alert("Both are in the tree");
		var u = MST_get_vertex(s);
		var v = MST_get_vertex(d);
		var result = MST_DFS(u,v);
		if(result == false){
			MST_add_edge(u,v);
		}

		return result;
	}

	else if(ufound == false && vfound == false){
		//None of them are present
//		alert("None of them are in the tree");
		var u = MST.add_vertex(s);
		var v = MST.add_vertex(d);
		MST.add_edge(u,v);
		return false;
	}

	else if(ufound == true && vfound == false){
			//v is not present
//			alert(s + " is alredy in the tree and " + d + " is not");
			var u = MST.get_vertex(s);
			var v = MST.add_vertex(d);
			MST.add_edge(u,v);
			return false;
		}

	else if(ufound == false && vfound == true){
			//u is not present
//			alert(d + " is already in the tree and " + s + " is not");
			var u = MST.add_vertex(s);
			var v = MST.get_vertex(d);
			MST.add_edge(u,v);
			return false;
		}

	return true;
}

function MST_DFS(u,d){

//	alert("DFS traversal of " + u._name);
	u.visited = true;

	for(i=0; i < MST.Vertices.length; i++)
	{
		MST.Vertices[i].visited = false;
	}

	MST_DFS_Visit(u);

	if(d.visited == true){
//		alert("Reached " + d._name + " in the traversal");
		return true;
	}

//	alert("Could not reach " + d._name);

	return false;
}

function MST_DFS_Visit(u){

//	alert("At vertex : " + u._name);

	var j;

	for(j=0; j < u.Adj.length; j++)
	{
		v = u.Adj[j];
//		alert("Checking if " + v._name + " is visited");
		if (v.visited == false)
		{
			v.visited = true;
			MST_DFS_Visit(v);
		}
	}

//	alert("Done with " + u._name);
}

function show_me_the_vertices(){
  var i;
  for(i=0; i < MST.Vertices.length; i++)
  {
    alert(MST.Vertices[i]._name);
  }
}

//--------------------------------------------Kruskal's Algorithm--------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

function Kruskal(){
	var i;
	var count = 0;
	for(i=0; i < Graph.Edges.length; i++)
	{
		PriorityQueue.insert(Graph.Edges[i]);
	}

/*	for(i=0; i < Graph.Vertices.length; i++)
	{
		var e = PriorityQueue.extract_min();
		if(! creates_cycle(e)){
			color_edge(e,count);
			count = count + 1;
		}
	}*/

	while(MST.edge_count != Graph.Vertices.length - 1)
	{
		var e = PriorityQueue.extract_min();
		if(! creates_cycle(e)){
			color_edge(e, count);
			count = count + 1;
		}
	}
}

//-----------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------



//-----------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------Other Functions------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------
function color_edge(edge,count){
	var edge_line = edge.line;
	edge_line.style.transitionDelay = count + "s";
	edge_line.style.backgroundColor = "white";
	edge_line.color = "white";
}


function get_vertex(name){
	var i;
	for(i=0; i < Graph.Vertices.length; i++)
	{
		if(Graph.Vertices[i].element.id == name){
			return Graph.Vertices[i];
		}
	}
}


function Restart(){
	var i;

	for(i=0; i<Graph.Vertices.length; i++)
	{
		Graph.Vertices[i].element.style.transitionDelay = "0s";
		Graph.Vertices[i].element.style.backgroundColor = "white";
	}

	for(i=0; i<Graph.Edges.length; i++)
	{
		Graph.Edges[i].line.style.transitionDelay = "0s";
		Graph.Edges[i].line.style.backgroundColor = "black";
		Graph.Edges[i].line.style.color = "black";
	}

	while(MST.Vertices.length != 0)
	{
		MST.Vertices.pop();
	}

	while(! PriorityQueue.is_empty())
	{
		PriorityQueue.extract_min();
	}
}

function CleanCanvas(){
	location.reload();
}