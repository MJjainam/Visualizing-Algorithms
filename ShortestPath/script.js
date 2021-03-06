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
	V.distance = 1000000000000000;
	V.visited = false;
	V._parent = null;
	V.NEXTS = new Array();

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
		if(document.getElementById("Directed").checked){
			s.Adj.push(d);
		}

		else{
			s.Adj.push(d);
			d.Adj.push(s);
		}
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

	if(document.getElementById("Directed").checked){
		line.className = "directedLine";					//class = line has css predefined css stylings in style.css
	}

	else{
		line.className = "undirectedLine";
	}

	line.id = "edge_" + start_div.id + "_" + end_div.id;		//id has the syntax edge_origin-vertex-id_destination-vertex-id
	
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
//--------------------------------------Implementing Dijkstra's Algorithm------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

//---------------Priority Queue For Dijkstra-----------------
//------------------------------------------------------------
function _insert(vertex){
	this._data.push(vertex);
	this._size = this._size + 1;
}

function _extract_min(){
	var i;
	var min = 0;
	//alert("About to begin iterations")
	for(i=0; i < this._data.length; i++)
	{
		if(parseInt(this._data[i].distance) < parseInt(this._data[min].distance))
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

var PriorityQueue = new Object();
PriorityQueue._data = new Array();
PriorityQueue._size = 0;

PriorityQueue.is_empty = _is_empty;
PriorityQueue.insert = _insert;
PriorityQueue.extract_min = _extract_min;


function Dijkstra(){
	if(validate_inputs() == "Source"){

		var s = get_vertex(document.getElementById("source").value);
		var Path = new Array();

		s.distance = 0;

		var i;

		PriorityQueue.insert(s);

		while(! PriorityQueue.is_empty())
		{
			var u = PriorityQueue.extract_min();
			u.visited = true;

			if(not_in_arr(Path,u))
			{
				Path.push(u);
			}

			var j;
			for(j=0; j < u.Adj.length; j++)
			{
				var v = u.Adj[j];
				if(v.visited == false)
				{
					relax(u,v);
					PriorityQueue.insert(v);
				}
			}
		}	
		reverse_pointers(s,null,1);
		color_graph(s,null,1);
	}

	if(validate_inputs() == "SourceDestination"){

		var s = get_vertex(document.getElementById("source").value);
		var d = get_vertex(document.getElementById("destination").value);

		var Path = new Array();

		s.distance = 0;

		var i;

		PriorityQueue.insert(s);

		while(! PriorityQueue.is_empty())
		{
			var u = PriorityQueue.extract_min();
			u.visited = true;

			if(not_in_arr(Path,u))
			{
				Path.push(u);
			}

			var j;
			for(j=0; j < u.Adj.length; j++)
			{
				var v = u.Adj[j];
				if(v.visited == false)
				{
					relax(u,v);
					PriorityQueue.insert(v);
				}
			}
		}	
		reverse_pointers(s,d,2);
		color_graph(s,d,2);
	}
}

//-----------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------



//-----------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------Other Functions------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

function reverse_pointers(src,destination,key){

	if(key == 1){
		var i;
		var j;

		for(i=0; i < Graph.Vertices.length; i++)
		{
			if(Graph.Vertices[i] != src){
				Graph.Vertices[i]._parent.NEXTS.push(Graph.Vertices[i]);
			}
		}
	}

	else if(key == 2){
		var i;
		var j;

		var curr = destination;
		while(curr != src)
		{
			curr._parent.NEXTS.push(curr);
			curr = curr._parent;
		}
	}
}

//----------Queue For Breadth First Traversal Of Next Pointers----------------
//----------------------------------------------------------------------------

var Queue = new Object();
Queue._data= new Array();
Queue.front = 0;
Queue.rear = 0;
	
function _enqueue(vertex){
	this._data.push(vertex);
	this.rear = this.rear + 1;
}

function _dequeue(){
	dequeued = this._data[this.front];
	this._data[this.front] = null;
	this.front = this.front + 1;
	return dequeued;
}

function Queue_is_empty(){
	return this.front == this.rear;
}


Queue.enqueue = _enqueue;
Queue.dequeue = _dequeue;
Queue.is_empty = Queue_is_empty;
Queue.disp = _disp;

function color_graph(source,destination,key){

	if(key == 1){

		var counter = 0;

		source.element.style.backgroundColor = "#1aff8d";
		Queue.enqueue(source);

		while(!Queue.is_empty())
		{
			u = Queue.dequeue();

			var j;
			for(j=0; j < u.NEXTS.length; j++)
			{
				v = u.NEXTS[j];

				if(v.element.style.backgroundColor == "white")
				{
					counter = counter + 1.5;
					Queue.enqueue(v);
					color_edge(u,v,counter);


					v.element.style.transitionDelay = counter + "s";
					v.element.style.backgroundColor = "#1aff8d";
				}
			}
		}
	}

	if(key == 2){

		var counter = 0;

		source.element.style.backgroundColor = "#1aff8d";
		Queue.enqueue(source);

		while(!Queue.is_empty())
		{
			u = Queue.dequeue();

			var j;
			for(j=0; j < u.NEXTS.length; j++)
			{
				v = u.NEXTS[j];

				if(v.element.style.backgroundColor == "white")
				{
					counter = counter + 1.5;
					Queue.enqueue(v);
					color_edge(u,v,counter);


					v.element.style.transitionDelay = counter + "s";
					v.element.style.backgroundColor = "#1aff8d";
				}
			}

			if(u == destination){
				break;
			}
		}
	}
}


function relax(origin,endpoint){
	ud = parseInt(origin.distance);
	vd = parseInt(endpoint.distance);
	w = parseInt(Graph.weight(origin,endpoint));
	if(vd > (ud + w)){
		endpoint.distance = ud + w;
		endpoint._parent = origin;
	}	
}


function color_edge(source,endpoint,count){
	var i;
	for(i=0; i < Graph.Edges.length; i++)
	{
		if((Graph.Edges[i].origin.id == source.element.id && Graph.Edges[i].endpoint.id == endpoint.element.id) || (Graph.Edges[i].origin.id == endpoint.element.id && Graph.Edges[i].endpoint.id == source.element.id))
		{
			Graph.Edges[i].line.style.transitionDelay = count + "s";
			Graph.Edges[i].line.style.backgroundColor = "white";
			Graph.Edges[i].line.style.color = "white";
		}
	}
}


function not_in_arr(arr,v)
{
	var i;
	for(i=0; i < arr.length; i++)
	{
		if(v.element.id == arr[i].element.id){
			return false;
		}
	}

	return true;
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

function validate_inputs(){
	if(document.getElementById("source").value == ""){
		alert("Please enter a source vertex");
	}

	else if(document.getElementById("destination").value == ""){
		return "Source";
	}

	else{
		return "SourceDestination";	
	}
}

function Restart(){
	var i;

	for(i=0; i<Graph.Vertices.length; i++)
	{
		Graph.Vertices[i].distance = 1000000000000;
		Graph.Vertices[i].element.style.transitionDelay = "0s";
		Graph.Vertices[i].element.style.backgroundColor = "white";
		Graph.Vertices[i].visited = false;
		Graph.Vertices[i]._parent = null;

		while(Graph.Vertices[i].NEXTS.length != 0){
			Graph.Vertices[i].NEXTS.pop();
		}
	}

	for(i=0; i<Graph.Edges.length; i++)
	{
		Graph.Edges[i].line.style.transitionDelay = "0s";
		Graph.Edges[i].line.style.backgroundColor = "black";
		Graph.Edges[i].line.style.color = "black";
	}

	while(! PriorityQueue.is_empty())
	{
		PriorityQueue.extract_min();
	}
}

function CleanCanvas(){
	location.reload();
}