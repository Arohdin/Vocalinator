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

	//Function that renders the player
	p.render = function(dt)
	{

		drawLineBetween(p.pos, [mousePos.x, mousePos.y], "rgba(0, 0, 0, 1.0)", 0.5);	//Draw line between player and the crosshair
		drawCrosshair();	//Draws the crosshair on the screeen

		p.calc();	//Calculates the behaivour of the movement
		p.updatePosition(dt);	//Uppdates the position
		p.draw();	//Draws the player on screen
	}

	p.calc = function()
	{
		//Values to determine movement in pos or neg axis.
		var xDirection = 0;
		var yDirection = 0;

		/*
			The following if-statements calculates which direction
			along an axis we're moving
		*/

		//x-led
		if(keyPressed[68]){xDirection += 1;}
		if(keyPressed[65]){xDirection += -1;}

		//y-led
		if(keyPressed[87]){yDirection += -1;}
		if (keyPressed[83]){yDirection += 1;}

		//If we're moving diagonaly we calculate the hyp to make sure the speed limit is not violated.
		if((xDirection != 0) && (yDirection != 0))
		{
			var newSpeed = Math.sqrt(Math.pow(p.speed, 2) / 2);
			p.vel = [newSpeed * xDirection, newSpeed * yDirection];
		}
		else //If buttons are pressed, then the new velocity is calculated as normal.
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

		//sets the angle (which direction) the player is facing.
		p.angle = getAngle([mousePos.x, mousePos.y], p.pos);
	}

	//Calculates the new position
	p.updatePosition = function(dt)
	{
		if(!keyPressed[65] && !keyPressed[68])	//if W or S are not pressed, generate decreasing velocity.
		{
			p.vel[0] *= p.DEF_DEACC;
			if(Math.abs(p.vel[0]) <= p.DEF_THRESH)	//If the velocity is slow enough, set ut to zero.
			{
				p.vel[0] = 0;
			}
		}
		if(!keyPressed[87] && !keyPressed[83])	//if A or D are not pressed, generate decreasing velocity.
		{
			p.vel[1] *= p.DEF_DEACC;
			if(Math.abs(p.vel[1]) <= p.DEF_THRESH)
			{
				p.vel[1] = 0;
			}
		}
		//Calculates the new positions
		p.pos[0] += p.vel[0] * dt;
		p.pos[1] += p.vel[1] * dt;
	}

	//Draws the player on the screen
	p.draw = function()
	{
		ctx.fillStyle = p._color;

		ctx.save();	//Saves the state of the canvas
		ctx.translate(p.pos[0], p.pos[1]);	//translate the drawing origin to the position of the object
		ctx.rotate(-p.angle);	//Rotates the grid/coordinates (canvas)
		ctx.fillRect(-p._size[0]/2,-p._size[1]/2, p._size[0], p._size[1]);	//draws the rect relative to the new origin and rotation
		ctx.restore();	//Loads the saved state.
	}

	//Draws the crosshair of the player.
	function drawCrosshair()
	{
	  //DRAW CROSSHAIR
	  ctx.fillStyle = "#e74c3c";
	  ctx.beginPath();
	  ctx.arc(mousePos.x, mousePos.y, 4, 0, 2 * Math.PI, false);
	  ctx.closePath();
	  ctx.fill();
	}

	//Event listneres....
	window.addEventListener("keydown", function(e){
		keyPressed[e.keyCode] = true;
		//console.log("KeyCode Pressed: " + e.keyCode);
	} ,false);

	window.addEventListener("keyup", function(e){
		keyPressed[e.keyCode] = false;
	} ,false);
};
