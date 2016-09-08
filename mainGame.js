//VARIABLES
var ctx, c;
var mousePos;
var keyPressed = {};
var pl;
var clock, prevTime;


$(document).ready(function(){

	console.log("ready");

	c = document.getElementById("theCanvas");
	ctx = c.getContext("2d");

	c.width = 800;
	c.height = 800;

	//EventListeners

	c.addEventListener('mousemove', function(evt) {
          mousePos = getMousePos(c, evt);
    }, false);

	//CREATE GAME OBJECTS
	pl = new player();

	//Create and start clock
	clock = new Date();
	prevTime = clock.getTime();

	draw();

});

$(window).resize(function(){

	console.log("resize");

});



function draw()
{
	clock = new Date();

	ctx.clearRect (0 , 0 , c.width, c.height);
	ctx.fillStyle = "#e74c3c";

	if(mousePos)
	{
		//DRAW CROSSHAIR
		ctx.beginPath();
    ctx.arc(mousePos.x, mousePos.y, 4, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fill();

		//DRAW aimLine
		var playerPos = pl.getPosition();
		ctx.beginPath();
		ctx.moveTo(playerPos[0], playerPos[1]);
		ctx.lineTo(mousePos.x, mousePos.y);
		ctx.lineWidth = 0.25;
		ctx.stroke();
		ctx.closePath();


	}

	pl.render((clock.getTime() - prevTime)/1000);

	prevTime = clock.getTime();
	requestAnimationFrame(draw);
}


function getMousePos(c, evt) {
        var rect = c.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
}
