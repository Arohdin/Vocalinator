//VARIABLES
const _OPTIMAL_RES = 1920 * 0.8;	//0.8 due to 0.1 border on both sides
var ctx, c;
var mousePos = {x: 0, y:0};
var keyPressed = {};
var pl, enemies, krock, proj, battlefield, bh;
var clock, prevTime;
var w, h;
var scaleFactor;
var btnWidth= 320, btnHeight=80, btnMargin=80;
var mainMenu, calMenu;
var deathRow;
var gp;
var crosshairRadius = 100;
var timeSinceMouse, idleTime=300;
var gamepadUsed=false;
var hud;
var paused=false;
var joystickAngle;
var playerDeath=false, disableCollision=false, wasPressed=false;
var disablePlayerCollision = false;
var backupTime;

var godMode = false;
var timeFactor = 1.0;

$(window).focus(function()
{
	//prevents the player from resuming during respawn timer
	if(paused && !disableCollision)
	resume();
});

$(window).blur(function()
{
	//prevents the player from pausing during respawn timer
	if(!paused && !disableCollision)
	pause();
});

//Waits for all the files to get ready
$(document).ready(function(){

	//DEBUG
	//console.log("ready");
	backupTime = timeFactor;

	//Linking and creating the canvas stuffs
	c = document.getElementById("theCanvas");
	ctx = c.getContext("2d");

	//declare the width and height
	w = window.innerWidth;
	h = window.innerHeight;

	//Change canvas and container (css) size.
	c.width = w;
	c.height = h;
	c.style.width = w;
	c.style.height = h;

	//set scaleFactor
	_scaleFactor = c.width/_OPTIMAL_RES;
	//console.log(_scaleFactor);

	//EventListeners
	c.addEventListener('mousemove', function(evt) {
		if(!paused) //prevents player from aiming when game is paused
		{
			mousePos = getMousePos(c, evt);
			gamepadUsed=false;
		}
    }, false);

		c.addEventListener('click', function(evt) {
			if(mainMenu.active || calMenu.active)
				mousePos = getMousePos(c, evt);
				if(mainMenu.active)
				{
					var pressed=mainMenu.checkPressed(mousePos.x, mousePos.y);

						if(pressed==START)
						{
							mainMenu.active=false;

							hud.countdown(function()//starts game after countdown
								{
									//Create and start clock
									clock = new Date();
									prevTime = clock.getTime();

									requestAnimationFrame(draw);
								});

							document.body.style.cursor ="none";
						}
						else if(pressed==CALIBRATE)
						{
							mainMenu.active=false;
							calMenu.active=true;
						}
				}

				else if(calMenu.active)
				{
					var pressed=calMenu.checkPressed(mousePos.x, mousePos.y);
						if(pressed==SETHIGH)
						{
							setHigh();
						}
						else if (pressed==SETLOW)
						{
							setLow();
						}
						else if(pressed==BACK)
						{
							calMenu.active=false;
							mainMenu.active=true;
						}
				}
			}, false);

	//CREATE GAME OBJECTS
	pl = new player();
	en = new enemies();
	krock = new collisionDetection();
	proj = new projectiles();
	mainMenu=new menu();
	calMenu=new menu();
	clock = new Date();
	hud =new HUD();
	bh=new holes();

	mainMenu.active=true;
	mainMenu.addButton("Start");
	mainMenu.addButton("Calibrate");

	calMenu.addButton("Set high");
	calMenu.addButton("Set low");
	calMenu.addButton("Back");

	battlefield = new walls();
	deathRow = new deathRow();

	updateGamepad();
	if(gp)
	{
		gamepadconnected=true;
	}

	//Init
	en.generateStack();
	krock.generateGrid();
	krock.init();
	proj.init();
	battlefield.init();
	hud.init();
	pl.loadPlayerImage();

	bh.addHole(1,50,120,[c.width/6		,		c.height/6], 		10);
	bh.addHole(5,50,120,[5*c.width/6	,		c.height/6], 		10);
	bh.addHole(2,50,120,[5*c.width/6	,		5*c.height/6], 	10);
	bh.addHole(1,50,120,[3*c.width/6	,		4*c.height/6],	10);
	bh.addHole(6,50,120,[c.width/6		, 	5*c.height/6],	10);
	bh.linkHoles([0,1,2,3,4]);


	//krock.calculateCollision();
	drawMenu();
});

//Things that happens on resize of window
$(window).resize(function(){

	//console.log("resize");

	//set new width and height
	w = window.innerWidth;
	h = window.innerHeight;

	//Applying new w and h
	c.width = w;
	c.height = h;
	c.style.width = w;
	c.style.height = h;

	//krock.generateGrid();
	if(mainMenu.active)
	{
		mainMenu.resize();
	}
	hud.resize();

	krock.updateCells();

});


//Draw-loop
function draw()
{
	clock = new Date();

	ctx.clearRect (0 , 0 , c.width, c.height);	//Clears the canvas from old data.

	//DEBUGG

	//krock.drawGrid();

	//projectile Collision
	proj.removeProjectiles();

	dealWithGamepad();

	//Renders
	battlefield.drawImages();
	bh.renderHoles(clock.getTime() - prevTime);	//in parameter is dt in ms
	krock.updateCells();
	//Collision is disabled when player is killed so that so that playerDeath isn't reset every time collision is checked after player has disabled
	if(!disableCollision)
	krock.calculateCollision((clock.getTime() - prevTime)/1000);
	bh.renderLinks(clock.getTime() - prevTime);
	proj.shoot();
	en.renderStack((clock.getTime() - prevTime)/1000);	//render for enemies
	deathRow.draw((clock.getTime() - prevTime)/1000);
	proj.render((clock.getTime() - prevTime)/1000); // render projectiles
	pl.render((clock.getTime() - prevTime)/1000);	//render for player
	hud.draw();

	if(dealWithDeath())
	return;


	prevTime = clock.getTime();

	requestAnimationFrame(draw);	//draw again
}

//gets the mouse coordinates...
function getMousePos(c, evt) {
		var rect = c.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
}


function getJoystickPos()
{
		return{
			x: pl.pos[0] + gp.axes[2]*crosshairRadius*_scaleFactor,
			y: pl.pos[1] + gp.axes[3]*crosshairRadius*_scaleFactor
		};

}

function drawMenu()
{
	ctx.clearRect (0 , 0 , c.width, c.height);	//Clears the canvas from old data.

	battlefield.drawImages();
	if(mainMenu.active)
	{
		mainMenu.draw();
	}
	else if(calMenu.active)
	{
		calMenu.draw();
	}
	hud.draw();
	if(mainMenu.active || calMenu.active);
	{
		requestAnimationFrame(drawMenu);
	}
}

//Resets enemyStack basically
function respawnEnemies()
{
	en.enemyStack=[];
	en.generateStack();
}

//resets enemies and player
function resetGame() {
	pl.pos=[c.width/2, c.height/2];
	pl.vel=[0.0, 0.0];
	respawnEnemies();
}

function pause()
{
	if(!mainMenu.active && !calMenu.active)
	{
		document.body.style.cursor ="auto";
		timeFactor=0.0;
		paused=true;

		if(!mainMenu.active && !calMenu.active)
		hud.setMessage("Paused",MIDDLE);

		//prevents the player from continueing to move when resuming
		if(keyPressed[68]){keyPressed[68]=false;}
		if(keyPressed[65]){keyPressed[65]=false;}
		if(keyPressed[87]){keyPressed[87]=false;}
		if(keyPressed[83]){keyPressed[83]=false;}
	}
}
function resume()
{
	if(!mainMenu.active && !calMenu.active)
	{
		document.body.style.cursor ="none";

		hud.clearMessage(MIDDLE);
		timeFactor= backupTime;
		console.log("resume");
		clock = new Date();
		prevTime = clock.getTime();
		paused=false;
	}
}

function dealWithDeath()
{
	if(playerDeath)
	pl.lives--;

	var liveHUD="";
	for(var i = 1; i<=pl.lives; ++i)
	{
		liveHUD = liveHUD + " * ";
	}
	hud.setMessage(liveHUD, TOP_RIGHT); // show lives

	if(playerDeath)
	{
		playerDeath=false;
		if(pl.lives>0) //resets the field for next round
		{
			pause(); //prevents movement and aiming durring countdown
			hud.countdown(function()
			{
				resetGame();//respawns enemies agfter countdown
				resume(); //enable movement and aiming
				disableCollision=false; //enable collision
			});
			return false;
		}
		else if(pl.lives==0) // Game over man!
		{
			pause(); //prevents movement and aiming durring kill screen
			hud.setTimedMessage("GAME OVER", MIDDLE,2);
			setTimeout(function()
			{
				resume(); //enable movement and aiming for next game
				document.body.style.cursor ="auto";
				mainMenu.active=true;
				requestAnimationFrame(drawMenu); //draw the menu again
				resetGame(); // reset for new game
				pl.lives=STARTLIVES; //reset lives
				disableCollision=false; // enable collission for next game
			},2000);
			return true;
		}
	}
}

function dealWithGamepad()
{
	updateGamepad();
	if(!paused)//prevents player from aiming when game is paused
	{
		if(gp && (Math.abs(gp.axes[2])>gamepadThreshold || Math.abs(gp.axes[3])>gamepadThreshold))
		{
			gamepadUsed=true;
			mousePos=getJoystickPos();
			joystickAngle=getAngle([mousePos.x, mousePos.y], pl.pos);
		}
		else if(gamepadconnected && gamepadUsed)
		{
			mousePos={
				x:pl.pos[0]+pl._collisionRadius*_scaleFactor*Math.cos(joystickAngle),
				y:pl.pos[1]-pl._collisionRadius*_scaleFactor*Math.sin(joystickAngle)
			};
		}
	}


	if(gp && isButtonPressed(gp.buttons[9]) && !wasPressed)
	{
		//pausing via button
		if( !mainMenu.active && !calMenu.active)
		{
			wasPressed=true;
			if(!paused)
			{
				pause();
				disableCollision=true;
			}
			else
			{
				resume();
				disableCollision=false;
			}
		}
	}
	else if( gp &&!isButtonPressed(gp.buttons[9]) && wasPressed)
	{
		wasPressed=false;
	}
}

function isButtonPressed(b)
{
  if (typeof(b) == "object") {
    return b.pressed;
  }
  return b == 1.0;
}
