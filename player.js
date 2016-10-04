var gamepadThreshold = 0.001;
var gamepadconnected=false;

const STARTLIVES=3;
function player(){

	//Define this
	const p = this;

	//default values;
	p.DEF_HEALTH = 10;
	p.DEF_SPEED = 250.0;
	p.DEF_DEACC = 1 - (0.1 * timeFactor);
	p.DEF_THRESH = 30;

	//Variables
	p.health = p.DEF_HEALTH;
	p.angle = 0.0;
	p.speed = p.DEF_SPEED;
	p.flySpeed = p.speed * 3;
	p.vel = [0,0];
	p._size = 50 * _scaleFactor;
	p.pos = [w/2, h/2];
	p._color = "#3498db";
	p._collisionRadius = generateCollisionMesh(p._size);
	p.lives =STARTLIVES;

	p.teleporting = false;
	p.ghostsPos = [];
	p.inHolePos;
	p.outHolePos;
	p.outHoleRadius;
	p.numberOfGhosts = 40;
	p.initialGodState = godMode;
	p.canTeleport = true;

	p.hasTeleportedFor = 0;	//s

	p.inAngle;
	p.images = [];


	p.loadPlayerImage = function()
	{

	p.sources = {
		playerSprite: 'images/player.png'
    };

	for(var src in p.sources) {
         p.images[src] = new Image();
         p.images[src].onload = function() {

          };
          p.images[src].src = p.sources[src];
		  console.log("LOADED");
        }

	}


	//Function that renders the player
	p.render = function(dt)
	{
		drawCrosshairLine([p.pos[0], p.pos[1]], [mousePos.x, mousePos.y]);//Draw line between player and the crosshair
		drawCrosshair();	//Draws the crosshair on the screeen

		if(!p.teleporting)
		{
			p.calc();	//Calculates the behaivour of the movement
			p.updatePosition(dt);	//Uppdates the position
			p.draw();	//Draws the player on screen
			//drawCollisionMesh(p._collisionRadius, p.pos, "rgba(231, 76, 60, 0.5)");	//Draw the collision circle
		}
		else
		{
			p.teleportPlayer(dt);
			p.drawGhosts(dt);
		}
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

		if(gp && (Math.abs(gp.axes[0])>gamepadThreshold || Math.abs(gp.axes[1])>gamepadThreshold))
		{
			p.vel[0]=p.speed*gp.axes[0];
			p.vel[1]=p.speed*gp.axes[1];
		}
		//If we're moving diagonaly we calculate the hyp to make sure the speed limit is not violated.
		else if((xDirection != 0) && (yDirection != 0))
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
		if(!keyPressed[65] && !keyPressed[68])	//if A or D are not pressed, generate decreasing velocity.
		{
			p.vel[0] *= p.DEF_DEACC;
			if(Math.abs(p.vel[0]) <= p.DEF_THRESH)	//If the velocity is slow enough, set ut to zero.
			{
				p.vel[0] = 0;
			}
		}
		if(!keyPressed[87] && !keyPressed[83])	//if W or S are not pressed, generate decreasing velocity.
		{
			p.vel[1] *= p.DEF_DEACC;
			if(Math.abs(p.vel[1]) <= p.DEF_THRESH)
			{
				p.vel[1] = 0;
			}
		}
		//Calculates the new positions
		p.pos[0] += p.vel[0] * dt * timeFactor * _scaleFactor;
		p.pos[1] += p.vel[1] * dt * timeFactor * _scaleFactor;
	}

	//Draws the player on the screen
	p.draw = function()
	{
		ctx.fillStyle = p._color;

		ctx.save();	//Saves the state of the canvas
		ctx.translate(p.pos[0], p.pos[1]);	//translate the drawing origin to the position of the object
		ctx.rotate(-p.angle);	//Rotates the grid/coordinates (canvas)
		ctx.translate(-p.pos[0], -p.pos[1]);
		//ctx.fillRect(-p._size/2,-p._size/2, p._size, p._size);	//draws the rect relative to the new origin and rotation
		ctx.drawImage(p.images.playerSprite, p.pos[0]-(42*0.75*_scaleFactor), p.pos[1]-(52*0.75*_scaleFactor), 84*0.75*_scaleFactor, 104*0.75*_scaleFactor);
		ctx.restore();	//Loads the saved state.

	}

	p.getCollisionMeshBoundary = function()
	{
		return p._collisionRadius;
	}

	p.teleportPlayer = function(dt)
	{
		var playerSpeed = p.flySpeed * _scaleFactor * timeFactor;
		var dist = getDist(p.inHolePos, p.outHolePos);
		var ang = getAngle(p.inHolePos, p.outHolePos);

		var secToFinish = dist[2]/playerSpeed;

		p.hasTeleportedFor += dt;

		if(p.hasTeleportedFor >= secToFinish)
		{
			p.hasTeleportedFor = 0;
			p.ghostsPos.length = 0;
			p.angle = getAngle([mousePos.x, mousePos.y], p.pos);
			p.pos[0] += -Math.cos(p.inAngle) * (p.outHoleRadius*0.25 + p._collisionRadius);
			p.pos[1] += Math.sin(p.inAngle) * (p.outHoleRadius*0.25 + p._collisionRadius);
			p.vel[0] = p.speed * -1 * Math.cos(p.inAngle);
			p.vel[1] = p.speed * Math.sin(p.inAngle);
			p.teleporting = false;
			godMode = p.initialGodState;
			disablePlayerCollision = false;
			setTimeout(function(){ p.canTeleport = true; }, 200);
		}
		else
		{
			for(var i = 0; i < p.ghostsPos.length; ++i)
			{
				p.ghostsPos[i][0] += playerSpeed * dt * -1 * Math.cos(ang) * 1.0 *(i/(i+1.5));
				p.ghostsPos[i][1] += playerSpeed * dt * Math.sin(ang) * 1.0 * (i/(i+1.5));
			}
			p.pos[0] += playerSpeed * dt * -1 * Math.cos(ang) * 1.0;
			p.pos[1] += playerSpeed * dt * Math.sin(ang) * 1.0;
			p.angle = ang = getAngle( p.outHolePos, p.inHolePos);
		}
	}

	p.initGhosts = function(inPos, outPos, outHoleColisionRad)
	{
		p.canTeleport = false;
		godMode = true;
		disablePlayerCollision = true;
		p.outHoleRadius = outHoleColisionRad;
		p.teleporting = true;
		p.inHolePos = inPos;
		p.outHolePos = outPos;
		p.inAngle = getAngle(inPos,outPos);
		//console.log(p.outHoleRadius);


		p.pos[0] = inPos[0];
		p.pos[1] = inPos[1];

		for(var i = 0; i < p.numberOfGhosts; ++i)
		{
			var a = p.pos[0];
			var b = p.pos[1];
			p.ghostsPos.push([a,b]);
		}
	}

	p.drawGhosts = function()
	{
		for(var i = 0; i < p.ghostsPos.length-10; ++i)
		{
			ctx.globalAlpha = (i+1)/p.ghostsPos.length;
			ctx.fillStyle = "rgb(227, 140, 45)";

			ctx.beginPath();
			if(p._size * (i+1)/p.ghostsPos.length * 2 < p._size)
			{
				ctx.arc(p.ghostsPos[i][0], p.ghostsPos[i][1], p._collisionRadius * (i+1)/p.ghostsPos.length * 1.3, 0, 2 * Math.PI, false);
			}
			else
			{
				ctx.arc(p.ghostsPos[i][0], p.ghostsPos[i][1], p._collisionRadius * (i+1)/p.ghostsPos.length, 0, 2 * Math.PI, false);
			}
			//ctx.closePath();
			ctx.fill();

			ctx.globalAlpha = 1.0;
		}
		ctx.globalAlpha = 1.0;
		p.draw();
		ctx.globalAlpha = 1.0;
	}

	function drawCrosshairLine(playerPos, mPos)
	{
		var grad= ctx.createLinearGradient(playerPos[0], playerPos[1], mPos[0], mPos[1]);
		grad.addColorStop(0, "RGBA(255,255,255,1.0)");
		grad.addColorStop(0.5, "RGBA(255,255,255,0.7)");
		grad.addColorStop(0.8, "RGBA(255,255,255,0.0)");

		ctx.strokeStyle = grad;
		ctx.lineWidth = 1.5 * _scaleFactor;

		ctx.beginPath();
		ctx.moveTo(playerPos[0], playerPos[1]);
		ctx.lineTo(mPos[0], mPos[1]);

		ctx.stroke();
	}

	//Draws the crosshair of the player.
	function drawCrosshair()
	{
		var scaler = 4;
		var a = getAngle([mousePos.x, mousePos.y], [p.pos[0], p.pos[1]]);
		ctx.fillStyle = "#e74c3c";

		ctx.save();
		ctx.translate(mousePos.x, mousePos.y);
		ctx.rotate(-a);
		//top
		ctx.fillRect(-0.5 * scaler * _scaleFactor, -1 * scaler * _scaleFactor, 1 * scaler * _scaleFactor, -2 * scaler * _scaleFactor);
		//right
		ctx.fillRect(1 * scaler * _scaleFactor, -0.5 * scaler * _scaleFactor, 2 * scaler * _scaleFactor, 1 * scaler * _scaleFactor);
		//bot
		ctx.fillRect(-0.5 * scaler * _scaleFactor, 1 * scaler * _scaleFactor, 1 * scaler * _scaleFactor, 2 * scaler * _scaleFactor);
		//left
		ctx.fillRect(-1 * scaler * _scaleFactor, -0.5 * scaler * _scaleFactor, -2 * scaler * _scaleFactor, 1 * scaler * _scaleFactor);

		ctx.restore();
	}

	//Event listneres....
	window.addEventListener("keydown", function(e){
		keyPressed[e.keyCode] = true;
		//console.log("KeyCode Pressed: " + e.keyCode);
	} ,false);

	window.addEventListener("keyup", function(e){
		keyPressed[e.keyCode] = false;

		//pausing via button
		if(e.keyCode==80 && !mainMenu.active && !calMenu.active)
		{
			if(!paused)
			{
				pause();
				disableCollision=true;
			}
			else
			{
				resume();
				disableCollision=false;
			}
		}
	} ,false);
};

window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

function connecthandler(e) {
	console.log("connected");
	gamepadconnected=true;
  gp=navigator.getGamepads ? navigator.getGamepads()[0] : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads()[0] : []);
}

function disconnecthandler(e) {
	console.log("discconnected");
	gamepadconnected=false;
	gamepadUsed=false;
  delete gp;
}

function updateGamepad()
{
	gp = navigator.getGamepads ? navigator.getGamepads()[0] : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads()[0] : []);
}
