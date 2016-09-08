//VARIABLES
var ctx, c;
var mousePos = {x: 0, y:0};
var keyPressed = {};
var pl, enemies;
var clock, prevTime;
var w = 1280;
var h = 720;


$(document).ready(function(){

	console.log("ready");

	c = document.getElementById("theCanvas");
	ctx = c.getContext("2d");

	c.width = w;
	c.height = h;
	c.style.width = w;
	c.style.height = h;

	//EventListeners

	c.addEventListener('mousemove', function(evt) {
          mousePos = getMousePos(c, evt);
    }, false);

	//CREATE GAME OBJECTS
	pl = new player();
	en = new enemies();
	en.generateStack();

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

	pl.render((clock.getTime() - prevTime)/1000);
	en.renderStack((clock.getTime() - prevTime)/1000);


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
