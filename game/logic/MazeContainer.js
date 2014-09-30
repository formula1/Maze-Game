

function MazeContainer(elem, scene){
	this.scene = scene;
	this.width = elem.width;
	this.height = elem.height;
	this.divisor = 16*2;
	var diff = scene.game.shared.attr("difficulty");
	this.dim = 	{
			x: Math.floor(this.width/this.divisor)-4*(2-diff),
			y: Math.floor(this.height/this.divisor-2*(2-diff))
			};

	this.elem = elem;
	this.ctx = elem.getContext("2d");
	this.wall_width = 1/4;

	this.ctx.fillStyle = "#000000";
	this.ctx.fillRect(0,0,this.dim.x*this.divisor-1,this.dim.y*this.divisor-1);
	var that = this;

	this.math_snags = [];
	this.counter = 0;
	that.render();
}

MazeContainer.prototype.render = function(){
	this.ctx.fillStyle = "#FFFFFF";
	console.log(JSON.stringify(this.dim));
	this.maze = new Maze(this.dim.x, this.dim.y, Maze.Algorithms.HuntAndKill, {
		rng: this.scene.game.mt,
		input: void(0),
		weave: void(0),
		weaveMode: void(0),
		weaveDensity: void(0)
	});
	this.maze.container = this;
	this.maze.onUpdate(this.mazeUpdateCB);
	this.maze.onEvent(this.mazeEventCB);
	this.maze.generate();
	this.ctx.fillStyle = "#00FF00";
	for(var i=0;i<this.math_snags.length;i++){
		this.fillSquare(this.math_snags[i].x, this.math_snags[i].y);
	}
	this.ctx.fillStyle = "#FFFFFF";
};


MazeContainer.prototype.mazeUpdateCB = function(maze, x, y){
	if (maze.isBlank(x, y)){
		maze.container.counter++;
		return;
	}

	var ctx = maze.container.ctx;
	var ww = maze.container.wall_width;
	var www = maze.container.wall_width/2;
	var co = maze.container.divisor;

	ctx.fillRect(
		(x+www)*co,
		(y+www)*co,
		(1-ww)*co,
		(1-ww)*co
	);

	if(maze.isWest(x, y)){
		ctx.fillRect(
			(x)*co,
			(y+www)*co,
			www*co,
			(1-ww)*co
		);
	}
	if(maze.isEast(x,y)){
		ctx.fillRect(
			(x+1-www)*co,
			(y+www)*co,
			www*co,
			(1-ww)*co
		);
	}

	if(maze.isNorth(x, y)){
		ctx.fillRect(
			(x+www)*co,
			(y)*co,
			(1-ww)*co,
			www*co
		);
	}
	if(maze.isSouth(x, y)){
		ctx.fillRect(
			(x+www)*co,
			(y+1-www)*co,
			(1-ww)*co,
			www*co
		);
	}
/* */
};

MazeContainer.prototype.mazeEventCB = function(maze, x, y){
	var that = maze.container;
	if(that.counter == 0){
		if(x == 0 && y == 0)
			return; 
		if(x == that.dim.x-1 && y == 0)
			return; 
		if(x == 0 && y == that.dim.y-1)
			return; 
		if(x == that.dim.x-1 && y == that.dim.y-1)
			return; 
		that.math_snags.push({count:that.counter,x:x,y:y});
	}else{
		that.counter = 0;		
	}
	//There is an average of 50
	//(35 might be the least)
	//(61 might be the most)
	//To compensate for this we will hit 45
	// Every 8 events (with minimum of 16 pixles between them) will be a math snag

	//important to note, in the begginning the best hunts are
	//at the end there are many singular hunts
	

	//Here is the logic to know we reached a stopping point in the maze
	//Here we can create stuff at this location or count up the number of events since start
};

MazeContainer.prototype.fillSquare = function(x,y){
	var www = this.wall_width/2;
	this.ctx.fillRect(
		(x+www)*this.divisor,
		(y+www)*this.divisor,
		(1-this.wall_width)*this.divisor,
		(1-this.wall_width)*this.divisor
	);

};

MazeContainer.prototype.checkSnag = function(x,y){
	x = Math.floor(x/32);
	y = Math.floor(y/32);
	for(var i=0;i<this.math_snags.length;i++){
		if(x == this.math_snags[i].x && y == this.math_snags[i].y){
			this.math_snags[i].index = i;
			return this.math_snags[i];
		}
	}
	return false;
};


