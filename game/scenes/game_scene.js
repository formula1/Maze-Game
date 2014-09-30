
function game_scene(game, elem){
	Scene.apply(this, [game, elem, "game_scene"]);
	game.shared.attr("money", 1000000);
	var diff = game.shared.attr("difficulty");
	var ch = elem.children();
	ch.eq(0).css("top", 32*1*(2-diff));
	ch.eq(0).css("left", 32*2*(2-diff));
	ch.eq(1).css("top", 32*1*(2-diff));
	ch.eq(1).css("left", 32*2*(2-diff));
	this.maze = new MazeContainer(ch[0],this);
	this.fl = new FifoLifo(this);
	this.character = new Character(ch[1], this);
	this.hud = new HUD(this);
}

game_scene.prototype = Object.create(Scene.prototype); // See note below
game_scene.prototype.constructor = game_scene;

