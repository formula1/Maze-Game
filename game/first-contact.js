/*
Author: S986S
License: Public domain, baby. Knock yourself out.

Modified the Source of Jamis Buck
The original CoffeeScript sources are always available on GitHub:
http://github.com/jamis/csmazes
 */

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;


function Game(algorithm, container){
	this.container = container || $("#game");
	this.hud = $("#hud");
	this.helper = $("#helper");
	this.mt = new MersenneTwister();
	this.sceneBackLog = []
	this.shared = new can.Map({}); //This will be used for saving and loading games
	this.sceneCounter = 0;
}


Game.prototype.changeScene = function(new_scene, type){
	if(typeof type == "undefined" || type == 0)
		this.currentScene.close();
	else if(type == -1){
		this.currentScene.close();
		for(var i=0;i<this.sceneBackLog.length;i++){
			this.sceneBackLog[i].close();
		}
		this.sceneBackLog = [];
	}else if(type == 1)
		this.sceneBackLog.push(this.currentScene.hide());
	if(typeof new_scene == "undefined")
		this.currentScene = this.sceneBackLog.pop().show();
	else
		this.addScene(new_scene);
}

Game.prototype.addScene = function(new_scene){
	this.sceneCounter++;
	var newDiv = $("<div></div>");
	newDiv.attr("id","gamechild_"+this.sceneCounter);
	this.container.append(newDiv);
	console.log(new_scene);
	this.currentScene = new window[new_scene](this, newDiv);
}


function Scene(game, elem, html_id){
	var that = this;
	this.game = game;
	this.elem = elem;
	this.subs = [];
	this.animFunk = [];
	this.animId = -1
	this.keyFunk = [];
	this.sharedFunk = [];
	this.closeFunk = [];
	elem.html($("#"+html_id).html());
	this.time = Date.now();
	this.binded = {
		anim:this.animFrame.bind(this),
		share:this.sharedChange.bind(this),
		ku:this.keyUp.bind(this),
		kd:this.keyDown.bind(this)
	};
	this.show();
}

Scene.prototype.onClose = function(fn){
	this.closeFunk.push(fn);
}

Scene.prototype.onShared = function(fn){
	this.sharedFunk.push(fn);
}

Scene.prototype.sharedChange = function(event, attr, how, newVal, oldVal){
	for(var i=0;i<this.sharedFunk.length;i++)
		this.sharedFunk[i](event, attr, how, newVal, oldVal);

}


Scene.prototype.onAnim = function(fn){
	this.animFunk.push(fn);
}

Scene.prototype.onKey = function(fn){
	this.keyFunk.push(fn);
}

Scene.prototype.animFrame = function(){
	var temp = Date.now();
	var time = temp-this.time;
	this.time = temp;
	delete temp;
	this.animId = window.requestAnimationFrame(this.binded.anim);
	for(var i=0;i<this.animFunk.length;i++)
		this.animFunk[i](time/1000);
}
Scene.prototype.keyDown = function(event){
	for(var i=0;i<this.keyFunk.length;i++)
		this.keyFunk[i](event, true);
}
Scene.prototype.keyUp = function(event){
	for(var i=0;i<this.keyFunk.length;i++)
		this.keyFunk[i](event, false);
}


Scene.prototype.hide = function(){
	for(var i=0;i<this.closeFunk.length;i++)
		this.closeFunk[i]();
	this.game.shared.unbind('change', this.binded.share);
	window.removeEventListener("keydown", this.binded.kd);
	window.removeEventListener("keyup", this.binded.ku);
	cancelAnimationFrame(this.animId);
	this.elem.css("display","none");
	return this;
}

//13 enter
//173 minus
//48 0
//49 1
// ...
//57 9

Scene.prototype.show = function(){
	this.game.shared.bind("change", this.binded.share);
	window.addEventListener("keydown", this.binded.kd);
	window.addEventListener("keyup", this.binded.ku);
	this.animId = window.requestAnimationFrame(this.binded.anim);
	this.elem.css("display","block");
	return this;
}


Scene.prototype.close = function(){
	for(var i=0;i<this.closeFunk.length;i++)
		this.closeFunk[i]();
	this.game.shared.unbind('change', this.binded.share);
	window.removeEventListener("keydown", this.binded.kd);
	window.removeEventListener("keyup", this.binded.ku);
	cancelAnimationFrame(this.animId);
	this.elem.remove();
}

function Drawable(posx, posy, width, height, color, ctx) {
	// Defualt variables
	this.pos = {};
	this.pos.x = posx;
	this.pos.y = posy;
	this.dim = {x:width,y:height}
	this.color = color;
	this.vel = {x:0, y:0};
	this.ctx = ctx;
	ctx.fillRect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
}

Drawable.prototype.setPosition = function(ctx, x, y){
	ctx.clearRect(this.pos.x-1,this.pos.y-1,this.dim.x+2,this.dim.y+2);
	this.pos.x = x;
	this.pos.y = y;
	ctx.fillStyle = this.color;
	ctx.fillRect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
}

Drawable.prototype.draw = function(ctx){
	ctx.clearRect(this.pos.x-1,this.pos.y-1,this.dim.x+2,this.dim.y+2);
	this.pos.x += this.vel.x;
	this.pos.y += this.vel.y;
	ctx.fillStyle = this.color;
	ctx.fillRect(this.pos.x,this.pos.y,this.dim.x,this.dim.y);
}


