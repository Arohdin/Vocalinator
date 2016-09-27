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
