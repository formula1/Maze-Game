

function main_menu(game, elem){
	Scene.apply(this, [game, elem, "main_menu"]);
	var that = this;
	
	game.shared.attr("difficulty", 0);
	elem.find(".difficulty").change(function(e){
		game.shared.attr("difficulty", $(this).children("option:selected").attr("data-value"));
	});

	$.ajax({url:"game/story.txt", dataType: "text",}).done(function(data){
		var ke = $("<span></span>");
		ke.css("padding", "4px")
		.css("border", "2px solid #000")
		.css("border-radius", "4px")
		.css("background-color", "#DDD");
		
		var keys = [
			["up","w", "&larr;"], 
			["left","a", "&#8592;"], 
			["down", "s", "&#8595;"],
			["right", "d", "&#8594;"]
		];
		var c = elem.find(".controls");
		for(var i=0;i<4;i++){
			var temp = $("<h3>"+keys[i][0]+": </h3>")
			var t2 = ke.clone();
			t2.html(keys[i][1]);
			temp.append(t2);
			var t2 = ke.clone();
			t2.html(keys[i][2]);
			temp.append(t2);
			c.prepend(temp);
		}
			

		var story = elem.find(".story");
		story.html(data)
		elem.find("button").click(function(e){
			game.changeScene("game_scene");
		});
		var lasttime = 0;
		that.onAnim(function(time){
			lasttime += time;
			if(lasttime > 0.3){
				story.scrollTop( story.scrollTop()+1 );
				lasttime -= 0.3;
			}
		});
	});


	
}
main_menu.prototype = Object.create(Scene.prototype); // See note below
main_menu.prototype.constructor = main_menu;

