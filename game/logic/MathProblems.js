
function Problem(){
	this.givens = {}
	this.find = [];
}

Problem.prototype.solution = function(answer){
	return true;
}

function ProblemFindY(rand){
	this.change = {x:(rand.nextInteger(18)-9), y:(rand.nextInteger(18)-9)}
	this.point = {x:(rand.nextInteger(18)-9), y:(rand.nextInteger(18)-9)}
	this.xval = (rand.nextInteger(18)-9)*this.change.x + this.point.x
	
	var eq = "Line: "+this.change.x+" * ( y + "+(-1*this.point.y)+" ) = "
			+this.change.y+" * ( x + "+(-1*this.point.x)+" )";


	this.givens = [eq,"x = "+this.xval];

	this.find = ["value of y"]
}

ProblemFindY.prototype.solution = function(answer){
	var yval = this.change.y*(this.xval- this.point.x)/this.change.x + this.point.y;
	console.log(yval);
	return (yval == answer[0]);
}

function Problem2Points(rand){
	// Given two points find x intercept and y intercept
	/* For this, we should 
	1) find the intercepts first to avoid any complications
	2) Find the equation of the line
	3) find two points that will be integers
	*/
	do{
		this.xint = rand.nextInteger(18)-9;
	}while(this.xint == 0);
	
	do{
		this.yint = rand.nextInteger(18)-9;
	}while(this.yint == 0);

	console.log(this.xint);
	console.log(this.yint);

	var change = {x:this.xint, y:-this.yint};

	console.log(change);


	var point1 = {};
	var point2 = {};
	
	point1.x = (rand.nextInteger(18)-9)*change.x + this.xint;
	point1.y = change.y*(point1.x- this.xint)/change.x;

	do{
		point2.y = (rand.nextInteger(18)-9)*change.y + this.yint;
	}while(point2.y == point1.y);

	point2.x = change.x*(point2.y- this.yint)/change.y;

	this.givens = [
		"pointA: ( x: "+point1.x+", y: "+point1.y+" )"
		,"pointB: ( x: "+point2.x+", y: "+point2.y+" )"
		,"Of a single Line"
	];

	this.find = ["x when y=0", "y when x=0"];
}

Problem2Points.prototype.solution = function(answer){
	return (answer[0] == this.xint && answer[1] == this.yint);
}

function ProblemIntersection(rand){
	// Given two lines what are the intersecting points
	/* For this, we must do 2 things
	1) Find the original equation
	2) Find a point on the line that uses absolute integers
	3) create another line that uses that point and a random point
	*/
	var change1;
	do{
		change1 = {x:(rand.nextInteger(18)-9), y:(rand.nextInteger(18)-9)};
	}while(change1.x == 0 || change1.y == 0);

	var point1 = {x:(rand.nextInteger(18)-9), y:(rand.nextInteger(18)-9)};

	this.intersect = {}
	this.intersect.x = (rand.nextInteger(18)-9)*change1.x + point1.x;
	this.intersect.y = change1.y*(this.intersect.x- point1.x)/change1.x + point1.y;

	var point2;
	do{
		point2 = {x:(rand.nextInteger(18)-9), y:(rand.nextInteger(18)-9)};
	}while(point2.x - this.intersect.x == 0 || point2.y - this.intersect.y == 0);

	var change2 = {x:this.intersect.x-point2.x, y:this.intersect.y-point2.y};
	

	this.givens = [
		"Line A: "+change1.x+" * ( y + "+(-1*point1.y)+" ) = "
			+change1.y+" * ( x + "+(-1*point1.x)+" )"
		,"Line B: "+change2.x+" * ( y + "+(-1*point2.y)+" ) = "
			+change2.y+" * ( x + "+(-1*point2.x)+" )"
		];

	console.log(this.intersect);

	this.find = ["x of the intersect","y of the intersect"]
}

ProblemIntersection.prototype.solution = function(answer){
	return (this.intersect.y == answer[1] && this.intersect.x == answer[0]);
}


