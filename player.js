function player(){
	
	//Define this
	const p = this;
	
	//default values;
	p.DEF_HEALTH = 10;
	p.DEF_SPEED = 200.0;
	p.DEF_DEACC = 0.9;
	p.DEF_THRESH = 25;
	
	//Variables
	p.health = p.DEF_HEALTH;
	p.orientation = [0,0];
	p.speed = p.DEF_SPEED;	
	p.vel = [0,0];
	p.pos = [400,400];
	
	//Functions
	
	p.render = function(dt)
	{
		p.calc();
		p.updatePosition(dt);
		
		ctx.fillStyle = "#34495e";
		ctx.fillRect(p.pos[0], p.pos[1], 25, 25);
		
	}	
	
	p.calc = function()
	{	//neg, pos
		var x = 0;
		var y = 0;
		
		//x-led
		if(keyPressed[68]){x += 1;}
		if(keyPressed[65]){x += -1;}
		
		//y-led
		if(keyPressed[87]){y += -1;}
		if (keyPressed[83]){y += 1;}

		
		//calc new Pos
		if((x != 0) && (y != 0))
		{
			var newSpeed = Math.sqrt(Math.pow(p.speed, 2) / 2);
			p.vel = [newSpeed * x, newSpeed * y];
		}			
		else
		{
			p.vel = [p.speed * x, p.speed * y];
		}
	}
	
	p.updatePosition = function(dt)
	{
		if((!keyPressed[87] && !keyPressed[83])){p.pos[0] += (p.vel[0] * p.DEF_DEACC*dt); if(Math.abs(p.vel[0]) <= p.DEF_THRESH){p.vel[0] = 0;}}
		if((!keyPressed[68] && !keyPressed[65])){p.pos[1] += (p.vel[1] * p.DEF_DEACC*dt); if(Math.abs(p.vel[1]) <= p.DEF_THRESH){p.vel[1] = 0;}}
		p.pos[0] += p.vel[0] * dt;
		p.pos[1] += p.vel[1] * dt;		
	}
	
	
	window.addEventListener("keydown", function(e){
		keyPressed[e.keyCode] = true;
		//console.log("KeyCode Pressed: " + e.keyCode);
	} ,false);
	
	window.addEventListener("keyup", function(e){
		keyPressed[e.keyCode] = false;
	} ,false);	
};

