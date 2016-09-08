//VARIABLES
var ctx, c;
var mousePos;


$(document).ready(function(){
	
	console.log("ready");
	
	c = document.getElementById("theCanvas");
	ctx = c.getContext("2d");
	
	c.width = 800;
	c.height = 800;
	
	c.addEventListener('mousemove', function(evt) {
          mousePos = getMousePos(c, evt);
    }, false);

	
	draw();
	
});

$(window).resize(function(){
	
	console.log("resize");
	
});



function draw()
{
	ctx.clearRect (0 , 0 , c.width, c.height);
	ctx.fillStyle = "#ff0000";
	
	if(mousePos)
	{
		//console.log(mousePos);
		ctx.fillRect(mousePos.x , mousePos.y , 50, 50);
	}
	
	requestAnimationFrame(draw);
}


function getMousePos(c, evt) {
        var rect = c.getBoundingClientRect();
		console.log(rect);
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }