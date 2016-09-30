//VARIABLES
const _OPTIMAL_RES = 1920 * 0.8;	//0.8 due to 0.1 border on both sides
var ctx, c;
var mousePos = {x: 0, y:0};
var keyPressed = {};
var pl, enemies, krock, proj, battlefield;
var clock, prevTime;
var w, h;
var timeFactor = 1.0;
var scaleFactor;
var btnWidth= 320, btnHeight=80, btnMargin=80;
var mainMenu, calMenu;
var start=false;
var deathRow;
var gp;
var crosshairRadius = 100;
var timeSinceMouse, idleTime=300;
var gamepadUsed=false;
var gui;


$(window).focus(function() {
	resume();
});

$(window).blur(function() {
	pause();
});

//Waits for all the files to get ready
$(document).ready(function(){

	//DEBUG
	console.log("ready");

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
	console.log(_scaleFactor);

	//EventListeners
	c.addEventListener('mousemove', function(evt) {
      mousePos = getMousePos(c, evt);
			gamepadUsed=false;
    }, false);

		c.addEventListener('click', function(evt) {
						mousePos = getMousePos(c, evt);
						if(mainMenu.active)
						{
							var pressed=mainMenu.checkPressed(mousePos.x, mousePos.y);

								if(pressed==START)
								{
									mainMenu.active=false;
									//Create and start clock
									clock = new Date();
									prevTime = clock.getTime();
									console.log(clock.getTime()-prevTime);

									document.body.style.cursor ="none";
									requestAnimationFrame(draw);
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
	gui =new GUI();

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
	gui.init();


	//krock.calculateCollision();
	drawMenu();
});

//Things that happens on resize of window
$(window).resize(function(){

	console.log("resize");

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
	gui.resize();

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


	//Renders

	updateGamepad();
	if(gp && (Math.abs(gp.axes[2])>gamepadThreshold || Math.abs(gp.axes[3])>gamepadThreshold))
	{
		gamepadUsed=true;
		mousePos=getJoystickPos();
	}
	else if(gamepadconnected && gamepadUsed)
	{
		var angle=getAngle([mousePos.x, mousePos.y], pl.pos);
		mousePos={
			x:pl.pos[0]+pl._collisionRadius*_scaleFactor*Math.cos(angle),
			y:pl.pos[1]+pl._collisionRadius*_scaleFactor*Math.sin(angle)
		};
	}
	battlefield.drawImages();
	krock.updateCells();
	krock.calculateCollision();
	proj.shoot();
	en.renderStack((clock.getTime() - prevTime)/1000);	//render for enemies
	pl.render((clock.getTime() - prevTime)/1000);	//render for player
	proj.render((clock.getTime() - prevTime)/1000); // render projectiles
	deathRow.draw((clock.getTime() - prevTime)/1000);
	gui.draw();


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
	if(mainMenu.active)
	{
		mainMenu.draw();
	}
	else if(calMenu.active)
	{
		calMenu.draw();
	}
	gui.draw();
	if(mainMenu.active || calMenu.active);
	{
		requestAnimationFrame(drawMenu);
	}
}

function pause()
{
	timeFactor=0.0;
}
function resume()
{
	timeFactor=1.0;
		console.log("FOCUS!");
		clock = new Date();
		prevTime = clock.getTime();
}
