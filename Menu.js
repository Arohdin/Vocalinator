const _OPTIMAL_RES = 1920;
var btnWidth= 320, btnHeight=80;
var start, button2;

//pos typ w/2-btnWidth*_scaleFactor/2, h/2-btnHeight*_scaleFactor/2,

function button()
{
	const bt=this;

	bt.width;
	bt.height;
	bt.text;
	bt.pos = [];

	bt.init = function(x, y, t)
	{
		bt.width=btnWidth*_scaleFactor;
		bt.height=btnHeight*_scaleFactor;
		bt.pos = [x, y];
		bt.text =t;
	}

	bt.checkPressed = function(x, y)
	{
		return x>bt.pos[0]-bt.width/2 && x<bt.pos[0]+bt.width/2 && y>bt.pos[1]-bt.height/2 && y<bt.pos[1]+bt.height/2;
	}

	bt.draw= function()
	{
		ctx.fillStyle="#27ae60";
		ctx.beginPath();
		ctx.fillRect(bt.pos[0]-bt.width/2, bt.pos[1]-bt.height/2, bt.width, bt.height);
		ctx.closePath();
		ctx.font= "28px Roboto";
		ctx.textAlign= "center";
		ctx.fillStyle = "rgba(236, 240, 241,1.0)";
		ctx.fillText(bt.text, bt.pos[0], bt.pos[1]+7); // 7 is the magic number
	}
}

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
	start=new button();
	button2= new button();

	//set scaleFactor
	_scaleFactor = c.width/_OPTIMAL_RES;
	console.log(_scaleFactor);

	start.init(w/2, h/2-40, "Start");
	button2.init(w/2, h/2+40, "Button 2");
	start.draw();
	button2.draw();

	//EventListeners
	c.addEventListener('click', function(evt) {
          mousePos = getMousePos(c, evt);
					var tst =button1.checkPressed(mousePos.x, mousePos.y);
					if (tst)
					{
						console.log("Hey there");
					}
    }, false);

});


//THIS SHOULD BE REMOVED EVENTUALLY

//gets the mouse coordinates...
function getMousePos(c, evt) {
        var rect = c.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
}
