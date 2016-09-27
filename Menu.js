const _OPTIMAL_RES = 1920;
var btnWidth= 320, btnHeight=80;

function button()
{
	const bt=this;
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

	//set scaleFactor
	_scaleFactor = c.width/_OPTIMAL_RES;
	console.log(_scaleFactor);

	//EventListeners
	c.addEventListener('mousemove', function(evt) {
          mousePos = getMousePos(c, evt);
    }, false);

    ctx.fillStyle="#27ae60";
    ctx.beginPath();
    ctx.fillRect(w/2-btnWidth*_scaleFactor/2, h/2-btnHeight*_scaleFactor/2, btnWidth*_scaleFactor, btnHeight*_scaleFactor);
    ctx.closePath();
		ctx.font= "28px Roboto";
		ctx.textAlign= "center";
		ctx.fillStyle = "rgba(236, 240, 241,1.0)";
		ctx.fillText("Button",w/2, h/2+7); // 7 is the magic number
});


function checkButtons()
{

}


//THIS SHOULD BE REMOVED EVENTUALLY

//gets the mouse coordinates...
function getMousePos(c, evt) {
        var rect = c.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
}
