
function Character(elem, scene){
	this.scene = scene;
	this.elem = elem;

	this.midpoint = {
		x:Math.ceil(scene.maze.dim.x*scene.maze.divisor/2),
		y:Math.ceil(scene.maze.dim.y*scene.maze.divisor/2)
	};
	console.log(this.midpoint);

	this.ctx = elem.getContext("2d");
	this.drawable = new Drawable(this.midpoint.x, this.midpoint.y, 8, 8, "#000000", this.ctx);
	this.move = {l:0,r:0,u:0,d:0};
	this.speed = 100;
	var that = this;
	scene.onAnim(this.update.bind(this));
	scene.onKey(this.input.bind(this));
	scene.onClose(function(){
		that.move = {l:0,r:0,u:0,d:0};
	})
}

Character.prototype.resetMidpoint = function(){
	this.drawable.setPosition(this.ctx, this.midpoint.x, this.midpoint.y);
}

Character.prototype.input = function(event, isdown){
        var keycode = ('which' in event) ? event.which : event.keyCode;
	if(keycode == 68 || keycode == 39){
		if(isdown && this.move.r == 0){
			this.move.r = 1;
		}else if(!isdown){
			this.move.r = 0;
		}
	}else if(keycode == 65 || keycode == 37){
		if(isdown && this.move.l == 0){
			this.move.l = 1;
		}else if(!isdown){
			this.move.l = 0;
		}
	}else if(keycode == 87 || keycode == 38){
		if(isdown && this.move.u == 0){
			this.move.u = 1;
		}else if(!isdown){
			this.move.u = 0;
		}
	}else if(keycode == 83 || keycode == 40){
		if(isdown && this.move.d == 0){
			this.move.d = 1;
		}else if(!isdown){
			this.move.d = 0;
		}
	}else{
		return;
	}
	event.preventDefault();

/* */
};

Character.prototype.update = function(time){
//	console.log("update");
	var xc = this.drawable.pos.x+this.drawable.dim.x/2,
	yc = this.drawable.pos.y+this.drawable.dim.y/2;
	
	var snag= this.scene.maze.checkSnag(xc,yc);
	if(snag){
		console.log("snagged");
		this.scene.maze.fillSquare(snag.x,snag.y);
		this.scene.maze.math_snags.splice(snag.index,1);
		this.scene.game.changeScene("math_scene", 1);
		return;
	}
	if(this.scene.fl.checkHit(xc,yc)){
		this.resetMidpoint();
		return;
	}
	
	var xvel = (this.move.r - this.move.l);
	var yvel = (this.move.d - this.move.u);
	if(xvel == 0 && yvel == 0){
		return;
	}
	var speed = this.speed*time;
	if(xvel != 0 && yvel != 0){
		speed *= Math.pow(2, 0.5)/2;
	}
	xvel *= speed;
	yvel *= speed;
	var newvel = this.detectGridHit(xvel, yvel);
	this.drawable.vel.x = newvel.x;
	this.drawable.vel.y = newvel.y;

	this.drawable.draw(this.ctx);
};

Character.prototype.detectGridHit = function(velx,vely){
	var maze = this.scene.maze.maze;

	//check if velocity changes the grid position
	var O_AABB = { 	min:{	x:Math.floor(this.drawable.pos.x/32),
				y:Math.floor(this.drawable.pos.y/32)
			},
			max:{	x:Math.floor((this.drawable.pos.x+8)/32),
				y:Math.floor((this.drawable.pos.y+8)/32)
			}
		};
	var N_AABB = { 	min:{	x:Math.floor((this.drawable.pos.x+velx)/32),
				y:Math.floor((this.drawable.pos.y+vely)/32)
			},
			max:{	x:Math.floor((this.drawable.pos.x+8+velx)/32),
				y:Math.floor((this.drawable.pos.y+8+vely)/32)
			}
		};
	//If no changes in grid, return;
	if(	JSON.stringify(O_AABB.min) == JSON.stringify(N_AABB.max)
	&&	JSON.stringify(O_AABB.max) == JSON.stringify(N_AABB.min)
	&&	JSON.stringify(O_AABB) == JSON.stringify(N_AABB)
	){
		return {x:velx, y:vely};
	}

	//check who is the problem to reduce calculation
	var xproblem = (O_AABB.min.x - N_AABB.max.x != 0 || O_AABB.max.x - N_AABB.min.x != 0);
	var yproblem = (O_AABB.min.y - N_AABB.max.y != 0 || O_AABB.max.y - N_AABB.min.y != 0);
	var xgo = true;
	var ygo = true;

	//we then do minor steps to check when a hit is successful
	var checknum = Math.ceil(Math.max(Math.abs(velx),Math.abs(vely))/32);

	//We'll increment over I_AABB, and floor when necessary
	var I_AABB = {};
	I_AABB.min = {
			x: (this.drawable.pos.x/32),
			y: (this.drawable.pos.y/32)
		};

	I_AABB.max = {
			x: (this.drawable.pos.x+8)/32,
			y: (this.drawable.pos.y+8)/32
		};

	var L_AABB = JSON.parse(JSON.stringify(I_AABB));

	for(var i=0;i<checknum;i++){
		if(xgo){
			I_AABB.min.x += (velx*1/checknum)/32;
			I_AABB.max.x += (velx*1/checknum)/32;
		}
		if(ygo){
			I_AABB.min.y += (vely*1/checknum)/32;
			I_AABB.max.y += (vely*1/checknum)/32;
		}

		if(xproblem && xgo){
			if(velx < 0 && Math.floor(I_AABB.min.x) != Math.floor(L_AABB.min.x)){
				if(!maze.isWest(Math.floor(L_AABB.min.x), Math.floor(L_AABB.min.y))
				|| !maze.isWest(Math.floor(L_AABB.min.x), Math.floor(L_AABB.max.y))
				){
					velx = Math.floor(L_AABB.min.x)*32-this.drawable.pos.x;
					xgo = false;
				}else if(Math.floor(I_AABB.min.y) != Math.floor(I_AABB.max.y)
				&& !maze.isNorth(Math.floor(I_AABB.min.x), Math.floor(I_AABB.max.y))
				){
					velx = Math.floor(L_AABB.min.x)*32-this.drawable.pos.x;
					xgo = false;
				}
			}else if(velx > 0 && Math.floor(I_AABB.max.x) != Math.floor(L_AABB.max.x)){
				if(!maze.isEast(Math.floor(L_AABB.max.x), Math.floor(L_AABB.min.y))
				|| !maze.isEast(Math.floor(L_AABB.max.x), Math.floor(L_AABB.max.y))
				){
					velx = Math.floor(I_AABB.max.x)*32-this.drawable.pos.x;
					velx -= 1+this.drawable.dim.x;
					xgo = false;
				}else if(Math.floor(I_AABB.min.y) != Math.floor(I_AABB.max.y)
				&& !maze.isNorth(Math.floor(I_AABB.max.x), Math.floor(I_AABB.max.y))
				){
					velx = Math.floor(I_AABB.max.x)*32-this.drawable.pos.x;
					velx -= 1+this.drawable.dim.x;
					xgo = false;
				}
			}
		}
		if(yproblem && ygo){
			if(vely < 0 && Math.floor(I_AABB.min.y) != Math.floor(L_AABB.min.y)){
				var cond = [];
				if(!maze.isNorth(Math.floor(L_AABB.min.x), Math.floor(L_AABB.min.y))
				|| !maze.isNorth(Math.floor(L_AABB.max.x), Math.floor(L_AABB.min.y))
				){
					vely = Math.floor(L_AABB.min.y)*32-this.drawable.pos.y;
					ygo = false;
				}else if(Math.floor(I_AABB.min.x) != Math.floor(I_AABB.max.x)
				&& !maze.isWest(Math.floor(I_AABB.max.x), Math.floor(I_AABB.min.y))
				){
					vely = Math.floor(L_AABB.min.y)*32-this.drawable.pos.y;
					ygo = false;
				}

			}else if(vely > 0 && Math.floor(I_AABB.max.y) != Math.floor(L_AABB.max.y)){
				if(!maze.isSouth(Math.floor(L_AABB.min.x), Math.floor(L_AABB.max.y))
				|| !maze.isSouth(Math.floor(L_AABB.max.x), Math.floor(L_AABB.max.y))
				){
					vely = Math.floor(I_AABB.max.y)*32-this.drawable.pos.y;
					vely -= this.drawable.dim.y+1;
					ygo = false;
				}else if(Math.floor(I_AABB.min.x) != Math.floor(I_AABB.max.x)
				&& !maze.isWest(Math.floor(I_AABB.max.x), Math.floor(I_AABB.max.y))
				){
					vely = Math.floor(I_AABB.max.y)*32-this.drawable.pos.y;
					vely -= this.drawable.dim.y+1;
					ygo = false;
				}
			}
			if(!ygo && !xgo){
				break
			}
			L_AABB = JSON.parse(JSON.stringify(I_AABB));
		}
	}
	return {x:velx,y:vely};
}
