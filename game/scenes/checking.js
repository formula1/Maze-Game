
function checking_scene(game, elem){
	Scene.apply(this, [game, elem, "checking_scene"]);
	
	this.ready = false;
	var randtime = game.mt.nextInteger(2.5)+0.5;
	var tottime = 0;
	var that = this;
	this.onAnim(function(time){
		if(that.ready)
			return;
		tottime += time;
		if(tottime > randtime){
			that.ready = true;
			that.onKey(function(event, isdown){
				var keycode = ('which' in event) ? event.which : event.keyCode;
				console.log(keycode);
				if(keycode==32 && !isdown){
					event.preventDefault();
					game.changeScene();
				}
			});
			var clone = $("#game_scene .HUD").eq(0).clone();
			that.elem.html(game.shared.attr("checkhtml"));
			that.elem.append("<h1 style='font-family:courier;'>[ Press Space to Continue ]</h1>");
			that.elem.append(clone)
			that.hud = new HUD(that);
		}
	});
}

checking_scene.prototype = Object.create(Scene.prototype); // See note below
checking_scene.prototype.constructor = checking_scene;

