var game;

window.onload = function() {	
	game = new Phaser.Game(640, 960, Phaser.AUTO, "");
     game.state.add("Boot", boot);
     game.state.add("Preload", preload); 
     game.state.add("TitleScreen", titleScreen);
     game.state.add("PlayGame", playGame);
     game.state.add("GameOverScreen", gameOverScreen);
     game.state.start("Boot");
}

var boot = function(game){};
boot.prototype = {
  	preload: function(){
          this.game.load.image("loading","assets/sprites/loading.png"); 
	},
  	create: function(){
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
          game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.state.start("Preload");
	}      
}

var preload = function(game){};
preload.prototype = {   
     create: function(){
          console.log("going to preload");
     } 
}

var titleScreen = function(game){};
titleScreen.prototype = {    
}

var playGame = function(game){};
playGame.prototype = {    
}

var gameOverScreen = function(game){};
gameOverScreen.prototype = {    
}