var game;
//adding background color as hex value
var bgColors = [0xF16745, 0xFFC65D, 0x7BC8A4, 0x4CC3D9, 0x93648D, 0x7c786a,
 0x588c73, 0x8c4646, 0x2a5b84, 0x73503c];
var tunnelWidth = 256;
 
var shipHorizontalSpeed = 100; // this will determine speed movement horizontally
var shipMoveDelay = 0;

// this speed will help the ship rise at the top in 15 sec
var shipVerticalSpeed = 15000;
//swipeDistance tells us any momvement greater than 10px will considers as swipe
var swipeDistance = 10;
//this will set the barrier speed
var barrierSpeed = 280;
// distance between the barriers 
var barrierGap = 120;
var shipInvisibilityTime = 1000;
var barrierIncreaseSpeed = 1.1;


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
		  game.load.image("backsplash", "assets/sprites/backsplash.png");
		  game.load.image("tunnelbg", "assets/sprites/tunnelbg.png");
          game.load.image("wall", "assets/sprites/wall.png");
		  game.load.image("ship", "assets/sprites/ship.png");
          game.load.image("barrier", "assets/sprites/barrier.png");
          game.load.image("smoke", "assets/sprites/smoke.png");
	},
  	create: function(){
		this.game.state.start("TitleScreen");
	}
}

var titleScreen = function(game){};
titleScreen.prototype = {  
     create: function(){
		var titleBG = game.add.tileSprite(0,0,game.width,game.height,
		"backsplash");
		titleBG.tint = bgColors[game.rnd.between(0, bgColors.length -1)];
		//the next line will change background color according to-
		//defined hex value bgColor[game.rnd.between(0, bgColor.length - 1 )]
         game.stage.backgroundColor = bgColors[game.rnd.between(0, bgColors.length - 1)];
         
		 //adding the title or game image
		 var title = game.add.image(game.width / 2, 210, "title");
         title.anchor.set(0.5);
		 //using tween both for title-name and playButton
		 var tween = game.add.tween(title).to({
               width: 420,
               height:420
          }, 4000, "Linear", true, 0, -1); 
          tween.yoyo(true);
		  
		  //could also change the background color
		  //title.tint = bgColors[game.rnd.between(0, bgColors.length -1)];
		 
		 //adding the play game button 
         var playButton = game.add.button(game.width / 2, game.height - 150, "playbutton", this.startGame);
         playButton.anchor.set(0.5);
		 var tween = game.add.tween(playButton).to({
               width: 220,
               height:220
          }, 1500, "Linear", true, 0, -1); 
          tween.yoyo(true);
     },
     startGame: function(){
          game.state.start("PlayGame");     
     }
}

var playGame = function(game){};
playGame.prototype = {
		create: function(){
			var tintColor = bgColors[game.rnd.between(0,bgColors.length-1)];
			var tunnelBG = game.add.tileSprite(0,0,game.width,game.height,"tunnelbg");
			tunnelBG.tint = tintColor;
			// it is set as left wall of the game world according to game width
			var leftWallBG = game.add.tileSprite(- tunnelWidth / 2, 0, game.width / 2, game.height, "wall");
			leftWallBG.tint = tintColor;
			// it is set as right wall by 
			var rightWallBG = game.add.tileSprite((game.width + tunnelWidth) / 2, 0, game.width / 2, game.height, "wall");
			rightWallBG.tint = tintColor;
			rightWallBG.tileScale.x = -1;
			
			// which is game game.width = 640 tunnelWidth = 256 shipPositions = [224,160]
			this.shipPositions = [(game.width - tunnelWidth) / 2 + 32, (game.width + tunnelWidth) / 2 - 32];
			// this will load the ship on the left side
			this.ship = game.add.sprite(this.shipPositions[0], 860, "ship");
			// to keep track of the side
			this.ship.side =0;
			this.ship.destroyed = false;
			this.ship.canMove = true;
			this.ship.canSwipe = false;
			this.ship.anchor.set(0.5);
		    //add.emitter(x, y, max) places a particle emitter in position x, y capable of emitting up to max particles at the same time.
            this.smokeEmitter = game.add.emitter(this.ship.x, this.ship.y + 10, 20);
            //will use the smoke 
            this.smokeEmitter.makeParticles("smoke");
            
            //respectively set the horizontal and vertical speed of each particle as a random value from min to max pixels by second.
            this.smokeEmitter.setXSpeed(-15, 15);
            this.smokeEmitter.setYSpeed(50, 150);
            
            this.smokeEmitter.setAlpha(0.5, 1);
            //start(explode, lifespan, frequency)
            this.smokeEmitter.start(false, 1000, 40);
            
			// physics.enable(object, system) creates a default physics body on object using system physics system. 
			game.physics.enable(this.ship, Phaser.Physics.ARCADE);
			//onDown will register player tap or click
			game.input.onDown.add(this.moveShip, this);
            // canSwipe is also set to false when the player releases the input – mouse or finger – from the game
            game.input.onUp.add(function(){
                this.ship.canSwipe = false;
            }, this);
            
            this.verticalTween = game.add.tween(this.ship).to({
                y: 0
            },shipVerticalSpeed, Phaser.Easing.Linear.None, true);
            
            //it contains all the barrier 
            this.barrierGroup = game.add.group();
            //barrier is the variable and Barrier is thename of the new class  
            var barrier = new Barrier(game, barrierSpeed, tintColor);
            // adding the barrier group to the group
            this.barrierGroup = game.add.group();
            //adding barrier to the barrier group
            this.addBarrier(this.barrierGroup, tintColor);
		},
		moveShip: function(){
            this.ship.canSwipe = true;
			// only prompt if this.ship.canMove is true 
			if(this.ship.canMove){
			// then canMove set to false until animation is done
               this.ship.canMove = false;
			// this will help switch side of ship
               this.ship.side = 1 - this.ship.side;
               var horizontalTween = game.add.tween(this.ship).to({ 
                    x: this.shipPositions[this.ship.side]
               }, shipHorizontalSpeed, Phaser.Easing.Linear.None, true);
               horizontalTween.onComplete.add(function(){
                    game.time.events.add(shipMoveDelay, function(){
                         this.ship.canMove = true;
                    }, this);
               }, this);
            
                //adding the gost effect on the player
                var ghostShip = game.add.sprite(this.ship.x, this.ship.y, "ship");
                ghostShip.alpha = 0.5;
                ghostShip.anchor.set(0.5);
                var ghostTween = game.add.tween(ghostShip).to({
                    alpha: 0
                }, 350, Phaser.Easing.Linear.None, true);
                ghostTween.onComplete.add(function(){
                ghostShip.destroy();
                });
            }
        },
        update: function(){
            this.smokeEmitter.x = this.ship.x;
            this.smokeEmitter.y = this.ship.y;
            
            // checking for the 10px swipe distance
            if(this.ship.canSwipe){
                if(Phaser.Point.distance(game.input.activePointer.positionDown,
                                         game.input.activePointer.position) > swipeDistance){
                    this.restartShip();
                }
            }
            if(!this.ship.destroyed && this.ship.alpha == 1){
            game.physics.arcade.collide(this.ship, this.barrierGroup, function(s, b){
                this.ship.destroyed = true
                this.smokeEmitter.destroy();
                var destroyTween = game.add.tween(this.ship).to({
                    x: this.ship.x + game.rnd.between(-100, 100),
                    y: this.ship.y - 100,
                    rotation: 10
                }, 1000, Phaser.Easing.Linear.None, true);
                destroyTween.onComplete.add(function(){
                    var explosionEmitter = game.add.emitter(this.ship.x,
                        this.ship.y, 200);
                    explosionEmitter.makeParticles("smoke");
                    explosionEmitter.setAlpha(0.5, 1);
                    explosionEmitter.minParticleScale = 0.5;
                    explosionEmitter.maxParticleScale = 2;
                    explosionEmitter.start(true, 2000, null, 200);
                    this.ship.destroy();
                        game.time.events.add(Phaser.Timer.SECOND * 2, function(){
                            game.state.start("GameOverScreen");
                        });
                    }, this);
                }, null, this)
            }
        },
    //this function will reset the player to the bottom of the screen
        restartShip: function(){
            
            if(!this.ship.destroyed && this.ship.alpha == 1){
                barrierSpeed *= barrierIncreaseSpeed;
                for(var i = 0; i < this.barrierGroup.length; i++){
                    this.barrierGroup.getChildAt(i).body.velocity.y = barrierSpeed;
                }
                //when called this will prevent from further swipe
                this.ship.canSwipe = false;
                //will stop the vertical speed
                this.verticalTween.stop();
                this.ship.alpha = 0.5;
            
                this.verticalTween = game.add.tween(this.ship).to({
                y: 860
                }, 100,Phaser.Easing.Linear.None, true);
                this.verticalTween.onComplete.add(function(){
                    this.verticalTween = game.add.tween(this.ship).to({
                        y: 0
                    }, shipVerticalSpeed, Phaser.Easing.Linear.None, true);
                    var alphaTween = game.add.tween(this.ship).to({
                        alpha: 1
                    }, shipInvisibilityTime, Phaser.Easing.Bounce.In, true);
                }, this)
            }
        },
        addBarrier: function(group, tintColor){
            var barrier = new Barrier(game, barrierSpeed, tintColor);
            game.add.existing(barrier);
            group.add(barrier);
        }
}


var gameOverScreen = function(game){};
gameOverScreen.prototype = {
    create:function(){
        console.log("game over");
    }
}

Barrier = function (game, speed, tintColor) {
     var positions = [(game.width - tunnelWidth) / 2, (game.width + tunnelWidth) / 2];
     var position = game.rnd.between(0, 1);
	 Phaser.Sprite.call(this, game, positions[position], -100, "barrier");
     var cropRect = new Phaser.Rectangle(0, 0, tunnelWidth / 2, 24);
     this.crop(cropRect);
	 game.physics.enable(this, Phaser.Physics.ARCADE);
     this.anchor.set(position, 0.5);
     this.tint = tintColor;     
     this.body.velocity.y = speed;
     this.placeBarrier = true;
};

Barrier.prototype = Object.create(Phaser.Sprite.prototype);
Barrier.prototype.constructor = Barrier;
Barrier.prototype.update = function(){
    if(this.placeBarrier && this.y > barrierGap){
        this.placeBarrier = false;
        playGame.prototype.addBarrier(this.parent, this.tint);
    }
    if(this.y > game.height){
        this.destroy();
    }
}