var game;

window.onload = function() {	
	game = new Phaser.Game(640, 960, Phaser.AUTO, "");
	//Boot state: in the boot state we will make all adjustment to the game to be resized accordingly to browser 
	//resolution and aspect ratio
				// name given(key) , function (state)
     game.state.add("Boot", boot);
	 
	//we will use this state to preload all assets we will use in the game.
	//It's the classic “loading” screen you see in most games 
     game.state.add("Preload", preload);
	
	//the title screen, showing your game name and a play button.
     game.state.add("TitleScreen", titleScreen);
	
	//The game itself
     game.state.add("PlayGame", playGame);
	
	//The game over screen also features a “play again” button to let players restart the game
     game.state.add("GameOverScreen", gameOverScreen);
	 
     game.state.start("Boot"); //starting the first state
}

var boot = function(game){};
boot.prototype = {
	
  	preload: function(){
          this.game.load.image("loading","assets/sprites/loading.png"); //will load or show loading progress 
	},
  	create: function(){
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		// will set scaling method
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		// this will pass the state to the next state
		this.game.state.start("Preload");
	}      
}

var preload = function(game){};
preload.prototype = {
	preload: function(){ 
          var loadingBar = this.add.sprite(game.width / 2, game.height / 2, "loading");
          loadingBar.anchor.setTo(0.5);
          game.load.setPreloadSprite(loadingBar);
          game.load.image("title", "assets/sprites/title.png");
          game.load.image("playbutton", "assets/sprites/playbutton.png");
	},
  	create: function(){
		this.game.state.start("TitleScreen");
	}
}

var titleScreen = function(game){};
titleScreen.prototype = {  
     create: function(){  
          console.log("title screen here");
     }
}

var playGame = function(game){};
playGame.prototype = {    
}

var gameOverScreen = function(game){};
gameOverScreen.prototype = {    
}