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

									document.body.style.cursor ="none";
									masterInit();
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

	mainMenu.active=true;
	mainMenu.addButton("Start");
	mainMenu.addButton("Calibrate");

	calMenu.addButton("Set high");
	calMenu.addButton("Set low");
	calMenu.addButton("Back");

	battlefield = new walls();
	deathRow = new deathRow();


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
	battlefield.drawImages();
	krock.updateCells();
	krock.calculateCollision();
	en.renderStack((clock.getTime() - prevTime)/1000);	//render for enemies
	pl.render((clock.getTime() - prevTime)/1000);	//render for player
	proj.render((clock.getTime() - prevTime)/1000); // render projectiles
	deathRow.draw((clock.getTime() - prevTime)/1000);


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


function masterInit()
{
	//Init
	en.generateStack();
	krock.generateGrid();
	krock.init();
	proj.init();


	setInterval(function() {
		proj.shoot();
	},33);
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
	if(mainMenu.active || calMenu.active);
	{
		requestAnimationFrame(drawMenu);
	}
}
