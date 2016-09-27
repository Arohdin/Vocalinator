//VARIABLES
const _OPTIMAL_RES = 1920;
var ctx, c;
var mousePos = {x: 0, y:0};
var keyPressed = {};
var pl, enemies, krock, proj;
var clock, prevTime;
var w, h;
var timeFactor = 1.0;
var scaleFactor;

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

	//CREATE GAME OBJECTS
	pl = new player();
	en = new enemies();
	krock = new collisionDetection();
	proj = new projectiles();

	//Init
	en.generateStack();
	krock.generateGrid();
	krock.init();
	//krock.calculateCollision();


	//Calls the draw function
	ctx.font= "130px Roboto";
	ctx.textAlign= "center";
	ctx.fillStyle = "rgba(26, 188, 156,1.0)";
	ctx.fillText("GO!",c.width/2,c.height/2);
	setTimeout(function()
	{
		//Create and start clock
		clock = new Date();
		prevTime = clock.getTime();
		draw();
		proj.init();


		setInterval(function() {
			proj.shoot();
		},33);
	}, 1050);
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

});


//Draw-loop
function draw()
{
	clock = new Date();

	ctx.clearRect (0 , 0 , c.width, c.height);	//Clears the canvas from old data.

	//DEBUGG
	krock.drawGrid();

	//projectile Collision
	proj.removeProjectiles();

	//Renders
	krock.updateCells();
	krock.calculateCollision();
	en.renderStack((clock.getTime() - prevTime)/1000);	//render for enemies
	pl.render((clock.getTime() - prevTime)/1000);	//render for player
	proj.render((clock.getTime() - prevTime)/1000); // render projectiles

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
