
function FifoLifo(scene){
	this.scene = scene;
	this.maze = this.scene.maze;
	this.rand = this.scene.game.mt;
	this.hud = scene.elem.find(".HUD");
	var that = this;

	var ww = this.maze.wall_width;
	var www = ww/2;
	var co = this.maze.divisor;
	this.diff = scene.game.shared.attr("difficulty");
	this.colors = [
		{color:"#FFFF00",x:0,y:0},
		{color:"#FF7700",x:this.maze.dim.x-1,y:0},
		{color:"#0000FF",x:0,y:this.maze.dim.y-1},
		{color:"#7700FF",x:this.maze.dim.x-1,y:this.maze.dim.y-1}
	];
	for(var i=0;i<4;i++){
		this.maze.ctx.fillStyle = this.colors[i].color;
		this.maze.fillSquare(this.colors[i].x, this.colors[i].y);
	}	

	this.shared = this.scene.game.shared;
	this.shared.attr("fl_array", "");

	this.ball_pos = [];

	this.FLArray = [];
	this.makeChars();

}

FifoLifo.prototype.checkHit = function(x,y){
	var gridpos = {x:Math.floor(x/this.maze.divisor), y:Math.floor(y/this.maze.divisor)};
	if(gridpos.x == this.colors[0].x){
		if(gridpos.y == this.colors[0].x){
			return this.checkColor(0);
		}else if(gridpos.y == this.colors[2].y){
			return this.checkColor(2);
		}
	}else if(gridpos.x == this.colors[3].x){
		if(gridpos.y == this.colors[1].y){
			return this.checkColor(1);
		}else if(gridpos.y == this.colors[3].y){
			return this.checkColor(3);
		}
	}
	for(var i=0;i<this.ball_pos.length;i++){
		var curball = this.ball_pos[i];
		if(gridpos.x == curball.x && gridpos.y == curball.y){
			var ari = this.shared.attr("fl_array").split(",");
			var eq = this.rand.nextBoolean();
			var ball = this.ball_pos.splice(i,1)[0];
			ball.index = (ari[0] == "")?0:ari.length;
			var restext;
			if(eq){
				console.log(JSON.stringify(this.FLArray));
				//fifo
				this.FLArray.push(ball);
				console.log(JSON.stringify(this.FLArray));
				eq="f";
				restext = "<h1>You got yourself a FIFO</h1><p style='font-size:8;'>A patient one</p><p>This means that when you are putting these balls back. This will be last in line. Since the <span style'Font-weight:Bold'>F</span>irst one that came <span style'Font-weight:Bold'>I</span>n is the <span style'Font-weight:Bold'>F</span>irst one to go <span style'Font-weight:Bold'>O</span>ut. First In First Out. Get it? Got it? Good... I suggest you write down the order of the colors because otherwise you may be in a world of pain.";
			}else{
				console.log(JSON.stringify(this.FLArray));
				//lifo
				this.FLArray.unshift(ball);
				console.log(JSON.stringify(this.FLArray));
				eq="l";
				restext = "<h1>You got yourself a LIFO</h1><p style='font-size:8;'>An impatient one</p><p>This means that when you are putting these balls back. This will be first in line. Since the <span style'Font-weight:Bold'>L</span>ast one that came <span style'Font-weight:Bold'>I</span>n is the <span style'Font-weight:Bold'>F</span>irst one to go <span style'Font-weight:Bold'>O</span>ut. Last In First Out. Get it? Got it? Good... I suggest you write down the order of the colors because otherwise you may be in a world of pain.";
			}
			if(ari[0] == "")
				ari[0] = eq+"|"+ball.color
			else
				ari.push(eq+"|"+ball.color);
			this.shared.attr("fl_array", ari.join(","));
			this.maze.fillSquare(ball.x,ball.y);
			this.shared.attr("checkhtml", restext);
			this.scene.game.changeScene("checking_scene", 1);
			break;
		}
	}

};

FifoLifo.prototype.makeChars = function(){
	var w = this.maze.dim.x;
	var h = this.maze.dim.y;
	var xhalf = Math.floor(w/2);
	var xcalc = (1+w%2);
	var xi = xhalf + xcalc;
	var yhalf = Math.floor(h/2);
	var ycalc = (1+h%2);
	var yi = yhalf + ycalc;
	var yoff = 3;
	var xoff = 4;

	for(var y=yoff;y<h-yoff;y++){
		//check if its near midpoint
		if(y > yhalf- 1 && y < yi)
			continue;
		if(y%2 - ((y > yhalf)?1:h%2) != 0)
			continue;
		var ypos = y;
		for(var x=xoff; x<w-xoff;x++){
			if(x > xhalf- 1 && x < xi)
				continue;
			if(x%2 - ((x > xhalf)?1:w%2) != 0)
				continue;
			var xpos = x;
			if(xpos == 0 && ypos == 0){
				continue;
			}
			if(xpos == w-1 && ypos == 0){
				continue;
			}
			if(xpos == 0 && ypos == h-1){
				continue;
			}
			if(xpos == w-1 && ypos == h-1){
				continue;
			}
			this.fillCircle(xpos,ypos);
		}
	}
	this.maze.ctx.fillStyle = "#FFFFFF";
};


FifoLifo.prototype.fillCircle = function(x,y){
	var eq = this.rand.nextInteger(4);
	this.maze.ctx.fillStyle = this.colors[eq].color;
	this.ball_pos.push({color:this.colors[eq].color, x:x, y:y});

	var centerX = (x)*this.maze.divisor+this.maze.divisor/2;
	var centerY = (y)*this.maze.divisor+this.maze.divisor/2;
	var radius = ((1-this.maze.wall_width)*this.maze.divisor)/2;
	this.maze.ctx.beginPath();
	this.maze.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	this.maze.ctx.fill();
};

FifoLifo.prototype.checkColor = function(i){
	if(this.FLArray.length == 0)
		return true;
	if(this.colors[i].color != this.FLArray[0].color){
		console.log(this.colors[i]);
		console.log(this.FLArray[0]);
		this.scene.game.shared.attr("reasons","It can be difficult sometimes remembering what goes where. But its important. Efficiency at 60 frames per second is only possible if you are \"sleeping\" for most of it. Writing down what goes where will help you immensly. Organization is a good practice for many tasks.");
		this.scene.game.changeScene("loss_scene", -1);
		return true;
	}else{
		var ball = this.FLArray.shift();
		var ari = this.shared.attr("fl_array").split(",");
		ari[ball.index] = "f|#000000";
		this.hud.find(".fl_array span").eq(ball.index)
				.css("background-color","#000000");
		if(this.FLArray.length == 0 && this.ball_pos.length == 0)
			this.scene.game.changeScene("win_scene", -1);
		return true;
	}
	return false;
}

