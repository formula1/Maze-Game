
function win_scene(game, elem){
	Scene.apply(this, [game, elem, "win_scene"]);

	elem.find("button").click(function(e){
		game.changeScene("main_menu");
	});
}

win_scene.prototype = Object.create(Scene.prototype); // See note below
win_scene.prototype.constructor = win_scene;


function loss_scene(game, elem){
	Scene.apply(this, [game, elem, "loss_scene"]);

	var re = elem.find(".reason").text(game.shared.attr("reasons"));
	elem.find("button").click(function(e){
		game.changeScene("main_menu");
	});
}

loss_scene.prototype = Object.create(Scene.prototype); // See note below
loss_scene.prototype.constructor = loss_scene;

