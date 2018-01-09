var game;
var score;

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

var scoreHeight = 100;

var multiPlayer_1 = false;
var multiPlayer_2 = false;
var singlePlayer = false;

var scoreSegments = [100, 50, 25, 10, 5, 2, 1];

var name;
var bestScore, battlekey;
var returnArr = [];

var k = 0;

var config = {
    apiKey: "AIzaSyAJo2Jb785zRBn78QaHd2KxCajscE3iBww",
    authDomain: "zigzag-be62e.firebaseapp.com",
    databaseURL: "https://zigzag-be62e.firebaseio.com",
    projectId: "zigzag-be62e",
    storageBucket: "zigzag-be62e.appspot.com",
    messagingSenderId: "875489683030"
};
firebase.initializeApp(config);
var user = firebase.auth().currentUser;

//var fruits = firebase.database();
//var ref = database.ref('fruits');

window.onload = function() {
	var width = 640;
    var height = 960;	
    var windowRatio = window.innerWidth / window.innerHeight;
    if(windowRatio < width / height){
    	var height = width / windowRatio;
    }
    
	game = new Phaser.Game(width, height, Phaser.AUTO, "");
	//Boot state: in the boot state we will make all adjustment to the game to be resized accordingly to browser 
	//resolution and aspect ratio
				// name given(key) , function (state)
    game.state.add("Boot", boot);
	 
    //we will use this state to preload all assets we will use in the game.
	//It's the classic “loading” screen you see in most games 
    game.state.add("Preload", preload);
	
	//the title screen, showing your game name and a play button.
    game.state.add("TitleScreen", titleScreen);
	
    game.state.add("HowToPlay", howToPlay);
	
	
    game.state.add("LobbyState", lobbyState);
    
    //The game itself
    game.state.add("PlayGame", playGame);
	
	//The game over screen also features a “play again” button to let players restart the game
   
    game.state.add("GameOverScreen", gameOverScreen);
    
    game.state.add("LeaderBoard", leaderBoard);
    
    game.state.add("BattleMode", battleMode);
    
    game.state.add("MultiPlayer_1_GameOver", multiPlayer_1_GameOver);
    
    game.state.add("MultiPlayer_2_GameOver", multiPlayer_2_GameOver);
    
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
		  game.load.image("leaderboard", "assets/sprites/crown.png");
          game.load.image("tunnelbg", "assets/sprites/tunnelbg.png");
          game.load.image("wall", "assets/sprites/wall.png");
		  game.load.image("ship", "assets/sprites/ship.png");
          game.load.image("barrier", "assets/sprites/barrier.png");
          game.load.image("smoke", "assets/sprites/smoke.png");
          game.load.image("battle", "assets/sprites/battle.png");
          game.load.image("separator", "assets/sprites/separator.png");
          game.load.bitmapFont("font", "assets/fonts/font.png", "assets/fonts/font.fnt");
		  game.load.audio("bgmusic", ["assets/sounds/bgmusic.mp3", "assets/sounds/bgmusic.ogg"]);
		  game.load.audio("explosion", ["assets/sounds/explosion.mp3", "assets/sounds/explosion.ogg"]); 
	},
  	create: function(){
        
		this.game.state.start("LobbyState");
	}
}

var titleScreen = function(game){};
titleScreen.prototype = {  
     create: function(){

         var titleBG = game.add.tileSprite(0,0,game.width,game.height,"backsplash");
         titleBG.tint = bgColors[game.rnd.between(0, bgColors.length -1)];
         //the next line will change background color according to-
         //defined hex value bgColor[game.rnd.between(0, bgColor.length - 1 )]
         game.stage.backgroundColor = bgColors[game.rnd.between(0, bgColors.length - 1)];
        
		 // adding or making the whole background as game color
         document.body.style.background = "#"+titleBG.tint.toString(16);
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
                 
        var leader = game.add.button(game.width / 2, 400, "leaderboard", this.showLeaderBoard);
		leader.anchor.set(0.5);
        var tween = game.add.tween(leader).to({
               width: 54,
               height:54
          }, 1500, "Linear", true, 0, -1); 
          tween.yoyo(true);
         
        var battle = game.add.button(game.width / 2, 550, "battle", this.battleMode);
		battle.anchor.set(0.5);
        var tween = game.add.tween(battle).to({
               width: 70,
               height:70
          }, 1500, "Linear", true, 0, -1); 
          tween.yoyo(true);
     },
     startGame: function(){
          singlePlayer = true;
          game.state.start("HowToPlay",singlePlayer);     
     },    
    battleMode: function(){
        game.state.start("BattleMode");
    },
    showLeaderBoard: function(){
        game.state.start("LeaderBoard");
    }
    
}


var lobbyState = function(game){};
lobbyState.prototype = {
    
    create: function(){
        
    var provider;
        provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("https://www.googleapis.com/auth/plus.login");
        firebase.auth().signInWithPopup(provider).then(this.on_login.bind(this)).catch(this.handle_error.bind(this));
    },
    
    on_login: function (result) {
        //var email = firebase.auth().currentUser.email
        //firebase.database().ref("users/" + result.user.uid).set("data");
        game.state.start("TitleScreen");
    },

    handle_error: function (error) {
        console.log(error);
        game.state.start("TitleScreen");
    }
}

var playGame = function(game){};
playGame.prototype = {
		create: function(){
            console.log(battlekey);
            console.log("palyer_1 is active " + multiPlayer_1);
            console.log("palyer_2 is active " + multiPlayer_2);
            console.log(multiPlayer_1 || multiPlayer_2);
            if ((multiPlayer_1 || multiPlayer_2) || singlePlayer){
			this.saveBarrierSpeed = barrierSpeed;
			this.bgMusic = game.add.audio("bgmusic");
			this.bgMusic.loopFull(1);
            score = 0;
			var tintColor = bgColors[game.rnd.between(0,bgColors.length-1)];
			document.body.style.background = "#"+tintColor.toString(16);
			var tunnelBG = game.add.tileSprite(0,0,game.width,game.height,"tunnelbg");
			tunnelBG.tint = tintColor;
			// it is set as left wall of the game world according to game width
			var leftWallBG = game.add.tileSprite(- tunnelWidth / 2, 0, game.width / 2, game.height, "wall");
			leftWallBG.tint = tintColor;
			// it is set as right wall by 
			var rightWallBG = game.add.tileSprite((game.width + tunnelWidth) / 2, 0, game.width / 2, game.height, "wall");
			rightWallBG.tint = tintColor;
			rightWallBG.tileScale.x = -1;
			
            for(var i = 1; i <= scoreSegments.length; i++){
                var leftSeparator = game.add.sprite((game.width - tunnelWidth) / 2, scoreHeight * i, "separator");
                leftSeparator.tint = tintColor;
                leftSeparator.anchor.set(1, 0)
                var rightSeparator = game.add.sprite((game.width + tunnelWidth) / 2, scoreHeight * i, "separator");
                rightSeparator.tint = tintColor;
                var posX = (game.width - tunnelWidth) / 2 - leftSeparator.width / 2;
                if(i % 2 == 0){
                    posX = (game.width + tunnelWidth) / 2 + leftSeparator.width / 2;
                }
                game.add.bitmapText(posX, scoreHeight * (i - 1) + scoreHeight / 2 - 18 , "font", scoreSegments[i - 1].toString(), 36).anchor.x = 0.5;
            }
            
            this.scoreText = game.add.bitmapText(20, game.height - 90 , "font", "0", 48);
            this.multiscoreText = game.add.bitmapText(580, game.height - 90 , "font", "0", 48);
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
			
            //We want to check every ¼ seconds which height we reached with the spaceship and increase score accordingly.
            game.time.events.loop(250, this.updateScore, this);
            //highlightbar is the name of the tiled sprite
            this.highlightBar = game.add.tileSprite(game.width / 2, 0, tunnelWidth,scoreHeight,"smoke");
            this.highlightBar.anchor.set(0.5, 0);
            this.highlightBar.alpha = 0.1;
            this.highlightBar.visible = false;
			
			this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			this.spacebar.onDown.add(this.moveShip, this);
			this.shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
			this.shift.onDown.add(this.restartShip, this);
            
            }
		},
		moveShip: function(e){     
			var isKeyboard = e instanceof Phaser.Key;
			if(!isKeyboard){
				this.ship.canSwipe = true;
			}
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
                if(this.ship.y < scoreHeight * scoreSegments.length){
                    this.highlightBar.visible = true;
                    var row = Math.floor(this.ship.y / scoreHeight);
                    this.highlightBar.y = row * scoreHeight;
                }
            game.physics.arcade.collide(this.ship, this.barrierGroup, null, function(s, b){
                this.highlightBar.visible = false;
                this.ship.destroyed = true
                this.smokeEmitter.destroy();
                var destroyTween = game.add.tween(this.ship).to({
                    x: this.ship.x + game.rnd.between(-100, 100),
                    y: this.ship.y - 100,
                    rotation: 10
                }, 1000, Phaser.Easing.Linear.None, true);
                destroyTween.onComplete.add(function(){
					this.bgMusic.stop();
					var explosionSound = game.add.audio("explosion");
					explosionSound.play();
                    var explosionEmitter = game.add.emitter(this.ship.x, this.ship.y, 200);
                    explosionEmitter.makeParticles("smoke");
                    explosionEmitter.setAlpha(0.5, 1);
                    explosionEmitter.minParticleScale = 0.5;
                    explosionEmitter.maxParticleScale = 2;
                    explosionEmitter.start(true, 2000, null, 200);
                    this.ship.destroy();
                        game.time.events.add(Phaser.Timer.SECOND * 2, function(){
							//barrierSpeed = this.saveBarrierSpeed;
                            if (multiPlayer_1){
                                game.state.start("MultiPlayer_1_GameOver");
                            } 
                                if (multiPlayer_2){
                                game.state.start("MultiPlayer_2_GameOver");
                            }
                            if(singlePlayer){
                                game.state.start("GameOverScreen");
                            }
                        });
                    }, this);
                }, this)
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
        },
        
        updateScore: function(){
            if(this.ship.alpha == 1 && !this.ship.destroyed){
                if(this.ship.y < scoreHeight * scoreSegments.length){
                var row = Math.floor(this.ship.y / scoreHeight);
                score += scoreSegments[row];
                this.scoreText.text = score.toString();
                }
            }
        }
}


var gameOverScreen = function(game){};
gameOverScreen.prototype = {

    create: function(){
		//bestScore = Math.max(score, savedData.score);
        var titleBG = game.add.tileSprite(0, 0, game.width, game.height,"backsplash");
        titleBG.tint = bgColors[game.rnd.between(0, bgColors.length - 1)];
		document.body.style.background = "#"+titleBG.tint.toString(16);
        game.add.bitmapText(game.width / 2, 50 , "font", "Your score", 48).anchor.x = 0.5;
        game.add.bitmapText(game.width / 2, 150 , "font", score.toString(), 72).anchor.x = 0.5;
		game.add.bitmapText(game.width / 2, 350 , "font", "Best score", 48).anchor.x = 0.5;
		//game.add.bitmapText(game.width / 2, 450 , "font", bestScore.toString(), 72).anchor.x = 0.5;
        
        var authData = firebase.auth().currentUser;
        name = firebase.auth().currentUser.displayName;
        this.checkForFirstTime(name);
        
        var ref = firebase.database().ref("battles/");
        ref.on("value", function(childSnapshot) {
            console.log("from gameover" + childSnapshot.chosenbtl);
            
        }, function (error) {
            console.log("Error: " + error.code);
        });
        
        firebase.database().ref('fruits/').on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var item = childSnapshot.val();
            item.key = childSnapshot.key;
            returnArr.push(item);
            });
            for (var i = 0; i < returnArr.length - 1; i++) {
                if(returnArr[i].key == name){
                    //console.log(returnArr[i].count);
                    bestScore = Math.max(score, returnArr[i].count);
                    game.add.bitmapText(game.width / 2, 450 , "font", bestScore, 72).anchor.x = 0.5;
                    firebase.database().ref('fruits/' + name)
                    .set({ count: bestScore});
                    
                }
            }
            //console.log(score);
    
         });
        
        
        var playButton = game.add.button(game.width / 2, game.height - 150,"playbutton", this.startGame);
        playButton.anchor.set(0.5);
        var tween = game.add.tween(playButton).to({
			width: 220,
			height:220
        }, 1500, "Linear", true, 0, -1);
        tween.yoyo(true);

    },
    
    
    checkForFirstTime: function (name) {
    firebase.database().ref('fruits/').child(name).on('value', function(snapshot) {
        console.log(name);
        var exists = (snapshot.val() !== null);
        //this.userFirstTimeCallback(name, exists),this;
        console.log(exists);
        if (exists) {
            //alert('user ' + name + ' exists!');
            firebase.database().ref('fruits/').on('value', function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var item = childSnapshot.val();
                    item.key = childSnapshot.key;
                    returnArr.push(item);
                });
                
                for (var i = 0; i < returnArr.length - 1; i++) {
                    if(returnArr[i].key == name){
                        //console.log(returnArr[i].count);
                        bestScore = Math.max(score, returnArr[i].count);
                        game.add.bitmapText(game.width / 2, 450 , "font", bestScore, 72).anchor.x = 0.5;
                        firebase.database().ref('fruits/' + name).set({ count: bestScore});
                    }
                }
                //console.log(score);
            });
        } else {
            //alert('user ' + name + ' does not exist!');
            // Do something here you want to do for first time users (Store data in database?)
            var data = {
                count: 0
            };
            firebase.database().ref('fruits/' + name).set(data);
            //firebase.database().ref('fruits').push(data);
            }   
        });
    },
    
    startGame: function(){
		game.state.start("PlayGame");
    }

}

var multiPlayer_1_GameOver = function(game){};
multiPlayer_1_GameOver.prototype = {
    create: function(){
        var titleBG = game.add.tileSprite(0, 0, game.width, game.height,"backsplash");
        titleBG.tint = bgColors[game.rnd.between(0, bgColors.length - 1)];
		document.body.style.background = "#"+titleBG.tint.toString(16);
        
        console.log(battlekey);
        
        firebase.database().ref("battles").child(battlekey).child("player1").set(score);
        var player_1_score, palyer_2_score,battles;
        firebase.database().ref("battles").child(battlekey).on("value",function(snapshot){
            battles = snapshot.val();
            player_1_score = score;
            palyer_2_score = battles.player2;
            console.log("player_1 " + player_1_score);
            console.log("player_2 " + palyer_2_score);
            if (palyer_2_score > -1){
                if(player_1_score > palyer_2_score){
                    game.world.removeAll();
                    
                    var titleBG = game.add.tileSprite(0, 0, game.width, game.height,"backsplash");
                    titleBG.tint = bgColors[game.rnd.between(0, bgColors.length - 1)];
                    document.body.style.background = "#"+titleBG.tint.toString(16);
                    
                    var playButton = game.add.button(game.width / 2, game.height - 150,"playbutton", this.strg);
                    playButton.anchor.set(0.5);
                    var tween = game.add.tween(playButton).to({
                        width: 220,
                        height:220
                    }, 1500, "Linear", true, 0, -1);
                    tween.yoyo(true);
                    
                    game.add.bitmapText(game.width / 2, 50 , "font", "You Win", 48).anchor.x = 0.5;
                    game.add.bitmapText(game.width / 2, 150 , "font", "Your score " + player_1_score, 48).anchor.x = 0.5;
                    game.add.bitmapText(game.width / 2, 200 , "font", "Your Opponent Score " + palyer_2_score, 48).anchor.x = 0.5;
                    
                }else if (player_1_score == palyer_2_score){
                    game.world.removeAll();
                    
                    var titleBG = game.add.tileSprite(0, 0, game.width, game.height,"backsplash");
                    titleBG.tint = bgColors[game.rnd.between(0, bgColors.length - 1)];
                    document.body.style.background = "#"+titleBG.tint.toString(16);
                    
                    var playButton = game.add.button(game.width / 2, game.height - 150,"playbutton", this.strg);
                    playButton.anchor.set(0.5);
                    var tween = game.add.tween(playButton).to({
                        width: 220,
                        height:220
                    }, 1500, "Linear", true, 0, -1);
                    tween.yoyo(true);
                    game.add.bitmapText(game.width / 2, 50 , "font", "Draw", 48).anchor.x = 0.5;
                    game.add.bitmapText(game.width / 2, 150 , "font", "Your score " + player_1_score, 48).anchor.x = 0.5;
                    game.add.bitmapText(game.width / 2, 200 , "font", "Your Opponent Score " + palyer_2_score, 48).anchor.x = 0.5;
                }else{
                    game.world.removeAll();
                    
                    var titleBG = game.add.tileSprite(0, 0, game.width, game.height,"backsplash");
                    titleBG.tint = bgColors[game.rnd.between(0, bgColors.length - 1)];
                    document.body.style.background = "#"+titleBG.tint.toString(16);
                    
                    var playButton = game.add.button(game.width / 2, game.height - 150,"playbutton", this.strg);
                    playButton.anchor.set(0.5);
                    var tween = game.add.tween(playButton).to({
                        width: 220,
                        height:220
                    }, 1500, "Linear", true, 0, -1);
                    tween.yoyo(true);
                    
                    game.add.bitmapText(game.width / 2, 50 , "font", "You lose", 48).anchor.x = 0.5;
                    game.add.bitmapText(game.width / 2, 150 , "font", "Your score " + player_1_score, 48).anchor.x = 0.5;
                    game.add.bitmapText(game.width / 2, 200 , "font", "Your Opponent Score " + palyer_2_score, 48).anchor.x = 0.5;
                }
            }else{
                game.add.bitmapText(game.width / 2, 50 , "font", "Please wait for other player", 35).anchor.x = 0.5;
            }
        });
    }
}

var multiPlayer_2_GameOver = function(game){};
multiPlayer_2_GameOver.prototype = {
    create: function(){
        var titleBG = game.add.tileSprite(0, 0, game.width, game.height,"backsplash");
        titleBG.tint = bgColors[game.rnd.between(0, bgColors.length - 1)];
		document.body.style.background = "#"+titleBG.tint.toString(16);
        console.log(score);
        //palyer_2_score = score;
        firebase.database().ref("battles").child(battlekey).child("player2").set(score);
        
        var palyer_2,btl;
        var player;
        console.log(player);
        firebase.database().ref("battles").child(battlekey).on("value",function(snapshot){
            btl = snapshot.val();
            console.log(btl);
            palyer_2 = btl.player2;
            player = btl.player1;
            var j = btl.chosenbtl;
            console.log("player_1 " + player);
            console.log("player_2 " + palyer_2);
            if (player > -1){
                if(palyer_2 > player){
                    game.world.removeAll();
                    
                    var titleBG = game.add.tileSprite(0, 0, game.width, game.height,"backsplash");
                    titleBG.tint = bgColors[game.rnd.between(0, bgColors.length - 1)];
                    document.body.style.background = "#"+titleBG.tint.toString(16);
                    var playButton = game.add.button(game.width / 2, game.height - 150,"playbutton", this.strg);
                    playButton.anchor.set(0.5);
                    var tween = game.add.tween(playButton).to({
                        width: 220,
                        height:220
                    }, 1500, "Linear", true, 0, -1);
                    tween.yoyo(true);
                    
                    game.add.bitmapText(game.width / 2, 50 , "font", "You Win", 48).anchor.x = 0.5;
                    game.add.bitmapText(game.width / 2, 150 , "font", "Your score " + palyer_2, 48).anchor.x = 0.5;
                    game.add.bitmapText(game.width / 2, 200 , "font", "Your Opponent Score " + player, 48).anchor.x = 0.5;
                    
                }else if (player == palyer_2){
                    game.world.removeAll();
                    
                    var titleBG = game.add.tileSprite(0, 0, game.width, game.height,"backsplash");
                    titleBG.tint = bgColors[game.rnd.between(0, bgColors.length - 1)];
                    document.body.style.background = "#"+titleBG.tint.toString(16);
                    var playButton = game.add.button(game.width / 2, game.height - 150,"playbutton", this.strg);
                    playButton.anchor.set(0.5);
                    var tween = game.add.tween(playButton).to({
                        width: 220,
                        height:220
                    }, 1500, "Linear", true, 0, -1);
                    tween.yoyo(true);
                    game.add.bitmapText(game.width / 2, 50 , "font", "Draw", 48).anchor.x = 0.5;
                    game.add.bitmapText(game.width / 2, 150 , "font", "Your score " + palyer_2, 48).anchor.x = 0.5;
                    game.add.bitmapText(game.width / 2, 200 , "font", "Your Opponent Score " + player, 48).anchor.x = 0.5;
                }
                else{
                    game.world.removeAll();
                    
                    var titleBG = game.add.tileSprite(0, 0, game.width, game.height,"backsplash");
                    titleBG.tint = bgColors[game.rnd.between(0, bgColors.length - 1)];
                    document.body.style.background = "#"+titleBG.tint.toString(16);
                    var playButton = game.add.button(game.width / 2, game.height - 150,"playbutton", this.strg);
                    playButton.anchor.set(0.5);
                    var tween = game.add.tween(playButton).to({
                        width: 220,
                        height:220
                    }, 1500, "Linear", true, 0, -1);
                    tween.yoyo(true);
                    game.add.bitmapText(game.width / 2, 50 , "font", "You lose", 48).anchor.x = 0.5;
                    game.add.bitmapText(game.width / 2, 150 , "font", "Your score " + palyer_2, 48).anchor.x = 0.5;
                    game.add.bitmapText(game.width / 2, 200 , "font", "Your Opponent Score " + player, 48).anchor.x = 0.5;
                }
            }else{
                game.add.bitmapText(game.width / 2, 50 , "font", "Please wait for other player", 35).anchor.x = 0.5;
            }
        });
    }
}

var howToPlay = function(game){};
howToPlay.prototype = {
	create: function(){
		var titleBG = game.add.tileSprite(0, 0, game.width, game.height, "backsplash");
		titleBG.tint = bgColors[game.rnd.between(0, bgColors.length - 1)];
		document.body.style.background = "#"+titleBG.tint.toString(16);
		game.add.bitmapText(game.width / 2, 120 , "font", "Move left / right", 60).anchor.x = 0.5;
		game.add.bitmapText(game.width / 2, 200 , "font", "Tap, Click or SPACEBAR key", 36).anchor.x = 0.5;
		game.add.bitmapText(game.width / 2, 400 , "font", "Move to the bottom", 60).anchor.x = 0.5;
		game.add.bitmapText(game.width / 2, 480 , "font", "Swipe, Drag or SHIFT key", 36).anchor.x = 0.5;
		var horizontalShip = game.add.sprite(game.width / 2 - 50, 260, "ship");
		horizontalShip.anchor.set(0.5);
		horizontalShip.scale.set(0.5);
		var horizontalShipTween = game.add.tween(horizontalShip).to({
			x: game.width / 2 + 50
		}, 500, "Linear", true, 0, -1);
		horizontalShipTween.yoyo(true);
		var verticalShip = game.add.sprite(game.width / 2, 540, "ship");
		verticalShip.anchor.set(0.5);
		verticalShip.scale.set(0.5);
		var verticalShipTween = game.add.tween(verticalShip).to({
			y: 640
		}, 500, "Linear", true, 0, -1);
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

var leaderBoard = function(game){};
leaderBoard.prototype = {
	create: function(){
        var titleBG = game.add.tileSprite(0,0,game.width,game.height,"backsplash");
        titleBG.tint = bgColors[game.rnd.between(0, bgColors.length -1)];
         //the next line will change background color according to-
         //defined hex value bgColor[game.rnd.between(0, bgColor.length - 1 )]
        game.stage.backgroundColor = bgColors[game.rnd.between(0, bgColors.length - 1)];
        
		 // adding or making the whole background as game color
        document.body.style.background = "#"+titleBG.tint.toString(16);
        
        var playButton = game.add.button(game.width / 2, game.height - 150, "playbutton", this.startGame);
         playButton.anchor.set(0.5);
		 var tween = game.add.tween(playButton).to({
               width: 220,
               height:220
          }, 1500, "Linear", true, 0, -1); 
          tween.yoyo(true);
        
        for(var i = 1; i < 6; i++){
            game.add.bitmapText(game.width / 2 -200, 100 + (i*90) , "font", i + ". ", 20);
        }

        var playersRef = firebase.database().ref("fruits/").limitToLast(5);
        var a = [] , b = [];
        var p = 0;
        //console.log("a " + a.length);
        playersRef.orderByChild("count").on("child_added", function(data) {

            a [p] = [data.key];
            b [p] = [data.val().count];
            console.log(a[k]);
            p = p+1;
            console.log(a.length);
            if(a.length == 5){

                var m = 0
                for(var i = 4; i >= 0;i--){
                    game.add.bitmapText(game.width / 2 -180, 100 + ((m+1)*90) ,  "font", a[i],20);
                    game.add.bitmapText(game.width / 2 + 70, 100 + ((m+1)*90) ,  "font", b[i],20);
                    
                    m++;
                }
            }
            
           });
    },
     startGame: function(){
          game.state.start("TitleScreen");     
     }
}

var battleMode = function(game){};
battleMode.prototype = {
    create: function(){
        firebase.database().ref("battles").once("value", this.find_battle.bind(this));
    },
    
    find_battle: function(snapshot){
        var battles,battle,chosen_battle,new_battle;
        battles = snapshot.val();
        
        for(battle in battles){
            if(battles.hasOwnProperty(battle) && !battles[battle].full){
                chosen_battle = battle;
                console.log("this is the r = " +  chosen_battle);
                //battlekey = chosen_battle;
                firebase.database().ref("battles").child(chosen_battle).child("full").set(true, this.join_battle.bind(this,chosen_battle));
                break;
            }
        }
        if(!chosen_battle){
            this.new_battle = firebase.database().ref("battles/").push({player1: -1 , player2:-1, full: false, gamestatus:false, chosenbtl:""});
            this.new_battle.on("value", this.host_battle.bind(this));
            console.log(snapshot.val());
            
        }
    },
    
    host_battle: function(snapshot){
        var battle_data;
        var battles,battle,chosen_battle;
        
        //battles = snapshot.val();
        firebase.database().ref("battles").once("value",function(snapshot){
            battles = snapshot.val();
            for(battle in battles){
                if(battles.hasOwnProperty(battle) && !battles[battle].full){
                    battlekey = battle;
                    console.log("from 682 " + battlekey);
                    break;
                }
            }
        });
        battle_data = snapshot.val();
        if (battle_data.full) {
            this.new_battle.off();
            multiPlayer_1 = true;

            this.game.state.start("PlayGame", battlekey);
            //this.init({battle_id: snapshot.val(),local_palyer: "player1", remote_player:"player2"});
        }
    },
    join_battle: function(battle_id){
        console.log(battle_id);
        firebase.database().ref("battles").child(battle_id).child("chosenbtl").set(battle_id);
        multiPlayer_2 = true;
        battlekey = battle_id;
        
        this.game.state.start("PlayGame", multiPlayer_2);
        //this.init({battle_id: battle_id.key,local_palyer: "player2", remote_player:"player1"});
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
     this.body.immovable = true;
     this.body.velocity.y = speed;
     this.placeBarrier = true;
};

strg = function(){
    game.state.start("TitleScreen");
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