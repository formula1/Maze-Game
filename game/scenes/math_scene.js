
function math_scene(game, elem){
	Scene.apply(this, [game, elem, "math_scene"]);
	this.hud = new HUD(this);

	this.rand = this.game.mt;
	var eq = this.rand.nextInteger(game.shared.attr("difficulty"));
	if(eq == 0){
		eq = new ProblemFindY(this.rand);
	}else if(eq == 1){
		eq = new Problem2Points(this.rand);
	}else if(eq == 2){
		eq = new ProblemIntersection(this.rand);
	}else{
		console.log("theres a problem");
	}

	var ques = elem.find(".question");

	ques[0].innerHTML = "<h2 style=\"margin:0px;\">Given: </h2>";
	for(var i=0;i<eq.givens.length;i++)
		ques[0].innerHTML += "<span style=\"font-family:courier\">"+eq.givens[i]+"</span><br />";

	var ans = elem.find(".answer");

	ans[0].innerHTML = "<h2 style=\"margin:0px;\">Find: </h2>"

	var that = this;

	ans[0].addEventListener("submit", function(evt){
	     evt.preventDefault();
		var answers = [];
		for(var i in ans[0].elements)
			answers.push(ans[0].elements[i].value);
		if(eq.solution(answers)){
			that.correct();
		}else{
			that.failure();
		}
	});

	for(var i=0;i<eq.find.length;i++){
		ans[0].innerHTML += "<span style=\"font-family:courier\">"+eq.find[i]+": ";
		ans[0].innerHTML += "<input name='answer"+i+"' type='number' /></span><br />"
	}
	ans[0].innerHTML += '<br/><button type="submit">Send it in...</button>';

}

math_scene.prototype = Object.create(Scene.prototype); // See note below
math_scene.prototype.constructor = math_scene;

math_scene.prototype.correct = function(){
	this.game.shared.attr("checkhtml", "<h1>CORRECT</h1>")
	this.game.changeScene("checking_scene");
};

math_scene.prototype.failure = function(){
	this.game.shared.attr("reasons","This isn't the most difficult math in the world. However, it's understandable if you cannot accomplish it. Many of the best things (Collision Detection Systems, Image Filters, RPG mechanics, Even AI to an exstent) have a little or a lot of math involved. However, unlike this game, when you mess up a math equation you don't instantly lose (unless you lose motivation). Instead you see that there was a problem and then you try to fix it.");
	this.game.changeScene("loss_scene", -1);
};
