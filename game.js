var game;

window.onload = function() {	
	game = new Phaser.Game(640, 960, Phaser.AUTO, "");
<<<<<<< HEAD
     game.state.add("Boot", boot);
     game.state.add("Preload", preload); 
     game.state.add("TitleScreen", titleScreen);
     game.state.add("PlayGame", playGame);
     game.state.add("GameOverScreen", gameOverScreen);
     game.state.start("Boot");
}

var boot = function(game){};
boot.prototype = {
  	create: function(){
		console.log("game started");
	}     
}

var preload = function(game){};
preload.prototype = {    
}

var titleScreen = function(game){};
titleScreen.prototype = {    
}

var playGame = function(game){};
playGame.prototype = {    
}

var gameOverScreen = function(game){};
gameOverScreen.prototype = {    
=======
>>>>>>> a4fe40f1720611625591665a0e8bce5e281df1bc
}