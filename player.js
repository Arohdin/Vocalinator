function player(){

	//Define this
	const p = this;

	//default values;
	p.DEF_HEALTH = 10;
	p.DEF_SPEED = 350.0;
	p.DEF_DEACC = 0.9;
	p.DEF_THRESH = 25;

	//Variables
	p.health = p.DEF_HEALTH;
	p.angle = 0.0;
	p.speed = p.DEF_SPEED;
	p.vel = [0,0];
	p._size = [30, 30];
	p.pos = [w/2, h/2];
	p._color = "#3498db";

	//Functions
	p.render = function(dt)
	{
		drawLineBetween(p.pos, [mousePos.x, mousePos.y], "#000000");
		drawCrosshair();

		p.calc();
		p.updatePosition(dt);
		p.draw();
	}

	p.calc = function()
	{
		var xDirection = 0;
		var yDirection = 0;

		//x-led
		if(keyPressed[68]){xDirection += 1;}
		if(keyPressed[65]){xDirection += -1;}

		//y-led
		if(keyPressed[87]){yDirection += -1;}
		if (keyPressed[83]){yDirection += 1;}

		//calc
		if((xDirection != 0) && (yDirection != 0))
		{
			var newSpeed = Math.sqrt(Math.pow(p.speed, 2) / 2);
			p.vel = [newSpeed * xDirection, newSpeed * yDirection];
		}
		else
		{
			if(xDirection != 0)
			{
				p.vel[0] = p.speed * xDirection;
			}
			if(yDirection != 0)
			{
				p.vel[1] = p.speed * yDirection;
			}
		}

		p.angle = getAngle([mousePos.x, mousePos.y], p.pos);
	}

	p.updatePosition = function(dt)
	{
		if(!keyPressed[65] && !keyPressed[68])
		{
			p.vel[0] *= p.DEF_DEACC;
			if(Math.abs(p.vel[0]) <= p.DEF_THRESH)
			{
				p.vel[0] = 0;
			}
		}
		if(!keyPressed[87] && !keyPressed[83])
		{
			p.vel[1] *= p.DEF_DEACC;
			if(Math.abs(p.vel[1]) <= p.DEF_THRESH)
			{
				p.vel[1] = 0;
			}
		}
		p.pos[0] += p.vel[0] * dt;
		p.pos[1] += p.vel[1] * dt;
	}

	p.draw = function()
	{
		ctx.fillStyle = p._color;

		ctx.save();
		ctx.translate(p.pos[0], p.pos[1]);
		ctx.rotate(-p.angle);
		ctx.fillRect(-p._size[0]/2,-p._size[1]/2, p._size[0], p._size[1]);
		ctx.restore();
	}


	window.addEventListener("keydown", function(e){
		keyPressed[e.keyCode] = true;
		//console.log("KeyCode Pressed: " + e.keyCode);
	} ,false);

	window.addEventListener("keyup", function(e){
		keyPressed[e.keyCode] = false;
	} ,false);
};
