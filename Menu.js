const START=0, CALIBRATE=1;
const SETHIGH=0, SETLOW=1, BACK=2;

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
		bt.pos = [x-bt.width/2, y-bt.height/2];
		bt.text =t;
	}

	bt.checkPressed = function(x, y)
	{
		return x>bt.pos[0] && x<(bt.pos[0]+bt.width) && y>bt.pos[1] && y<(bt.pos[1]+bt.height);
	}

	bt.draw= function()
	{
		ctx.fillStyle="#27ae60";
		ctx.beginPath();
		ctx.fillRect(bt.pos[0], bt.pos[1], bt.width, bt.height);
		ctx.closePath();
		ctx.font= "28px Roboto";
		ctx.textAlign= "center";
		ctx.fillStyle = "rgba(236, 240, 241,1.0)";
		ctx.fillText(bt.text, bt.pos[0]+bt.width/2, bt.pos[1]+7+bt.height/2); // 7 is the magic number
	}
}

function menu()
{
	const mn =this;

	mn.active = false;
	mn.margin=btnMargin;
	mn.buttons = [];
	mn.message="";

	mn.resize=function()
	{
		var length = mn.buttons.length;
		var Height=c.height/2 -(btnMargin+btnHeight)*((length-1)/2*_scaleFactor);
		for(var i=0;i<mn.buttons.length;++i)
		{
			mn.buttons[i].init(c.width/2, Height, mn.buttons[i].text);
			Height= Height+(btnHeight+btnMargin)*_scaleFactor;
		}
	}

	mn.addButton = function(t)
	{
		var buttn;
		buttn=new button();
		buttn.init(0,0,t);
		mn.buttons.push(buttn);
		mn.resize();
	}

	mn.checkPressed = function(x,y)
	{
		for(var i=0; i < mn.buttons.length; ++i)
		{
			if(mn.buttons[i].checkPressed(x,y))
			{
				return i;
			}
		}
	}

	mn.draw = function()
	{
		ctx.fillStyle = "#27ae60";
		ctx.fillText(mn.message, c.width*0.9, c.height*0.05);
		for(var i=0;i<mn.buttons.length;++i)
		{
			mn.buttons[i].draw();
		}
	}
}
