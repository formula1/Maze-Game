

function HUD(scene){
	this.scene = scene;
	this.shared = this.scene.game.shared;

	this.gui = scene.elem.find(".HUD");

	this.gui.children(".money").text("$"+this.shared.attr("money"));

	var that = this;

	scene.onShared(function(event, attr, how, newVal, oldVal) {
		if(attr != "money")
			return;
		if(newVal > 0){
			that.gui.children(".money").text("$"+newVal);
		}else{
			that.scene.game.shared.attr("reasons","Money is important. If you spend every waking hour on a passion project, you will eventually run out. If you have investors, you will be under even more pressure. If you live with your parents, much of the expenses are mitigated. However, do you want to spend months or even years on a project that may turn up bad? Wasting you're own and possibly others without giving back? Being a successful Video Game Developer is much like a struggling artist. If you get lucky, you get huge. Otherwise, you may be doing it on your off time while working on websites or even fast food just to make ends meet. Its not because you aren't incredible, its because arts (video games, writing, drawing, videos) are paid for by the masses. And if the masses don't pay you, you don't make money.");

			that.scene.game.changeScene("loss_scene", -1);
		}
	});

	this.scene.onAnim(function(time){
		var money = Math.round(that.shared.attr("money") - time*1000);
		that.shared.attr("money", money);
	});
	
	var ari = this.shared.attr("fl_array").split(",");
	console.log(this.shared.attr("fl_array"));
	console.log(ari.length);
	if(ari[0] != ""){
		for(var i=0;i<ari.length;i++){
			var temp = ari[i].split("|");
			var fl = (temp[0] == "f")?"#FFFFFF":"#000000";
			var color = temp[1];
			that.gui.children(".fl_array").append(
				"<span style='background-color:"+color+";"+
					"border:1px solid "+fl+";"+
					"width:16px;height:16px;display:inline-block'>"+
				"</span>"
			);
		}
	}


	scene.onShared(function(event, attr, how, newVal, oldVal) {
		if(attr != "fl_array")
			return;
		if(newVal.length > oldVal.length){
			var ari = newVal.split(",");
			ari = ari[ari.length-1].split("|");
			var fl = (ari[0] == "f")?"#FFFFFF":"#000000";
			var color = ari[1];
			console.log(color);
			that.gui.children(".fl_array").append(
				"<span style='background-color:"+color+";"+
					"border:1px solid "+fl+";"+
					"width:16px;height:16px;display:inline-block'>"+
				"</span>"
			);
		}
	});


}
