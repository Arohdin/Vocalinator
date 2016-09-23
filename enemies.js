function enemies()
{

  //ref to this
  const e = this;

  //const
  const maxNumber = 32;

  //variables
  e.enemyStack = [];

  //Populates the array with enemies of different types.
  e.generateStack = function()
  {
    for(var i = 0; i < maxNumber; ++i)
    {
      var typeIndex = getRandomInt(0,2);

      if(typeIndex == 0)
      {
        e.enemyStack.push(new enemy());
        e.enemyStack[e.enemyStack.length - 1].init(0);	//low
      }
      if(typeIndex == 1)
      {
        e.enemyStack.push(new enemy());
        e.enemyStack[e.enemyStack.length - 1].init(1); 	//med
      }
      if(typeIndex == 2)
      {
        e.enemyStack.push(new enemy());
        e.enemyStack[e.enemyStack.length - 1].init(2); //high
      }
    }
  }

  //renders the stack of enemies (calls enemy.render());
  e.renderStack = function(dt)
  {
    for(var i = 0; i < maxNumber; ++i)
    {
      e.enemyStack[i].render(dt);
    }
  }

}

function enemy(){

    //ref to this
    const e = this;

    //Defaults [low,medhigh] - parameters
	e._typeHealth = [10,5,1];
	e._typeDmg = [5,2,1];
	e._type = ["low", "medium", "high"];
	e._typeSpeed = [100,130,170];
	e._typeColor = ["#2c3e50", "#8e44ad", "#f39c12"];
    e._typeSize = [50, 30, 15];

    //type specifics;
    e.health;
    e.speed;
    e._type;
    e.dmg;
    e._color;
    e._size;
    e._collisionRadius;

    //Variables
    e.pos;
    e.angle;
	
    //init
    e.init = function(typeOf)
    {
      //randomize a start position
      do
      {
        var randIntX = getRandomInt(0, c.width);
        var randIntY = getRandomInt(0, c.height);
      }while(getDist(pl.pos,[randIntX,randIntY])[2] < (c.width*0.10)); //Enemies can't spawn closer than this (percent of width)

      //Creates enemy of right type and sets properties accordningly
		e._type = e._type[typeOf];
		e.health = e._typeHealth[typeOf];
		e.dmg = e._typeDmg[typeOf];
		e._color = e._typeColor[typeOf];
		e._size = e._typeSize[typeOf] * _scaleFactor;
		e.speed = e._typeSpeed[typeOf];
		e._collisionRadius = generateCollisionMesh(e._size);

      //sets common properties
      e.pos = [randIntX, randIntY];
      e.angle = getAngle(e.pos, pl.pos);
    }

    //Render functions which i called to render an enemy
    e.render = function(dt)
    {
      //drawLineBetween(e.pos, pl.pos, "rgba(231, 76, 60, 0.3)", 0.10);
      e.updatePosition(dt);
      e.draw();
      drawCollisionMesh(e._collisionRadius, e.pos, "rgba(231, 76, 60, 0.8)");
		//drawCollisionMesh(1,[en.enemyStack[0].pos[0],en.enemyStack[0].pos[1]],"rgba(255,0,0,1.0)");
    }

    //function that update the position of an enemy
    e.updatePosition = function(dt)
    {
      e.angle = getAngle(e.pos, pl.pos);
      e.pos[0] += (-e.speed * Math.cos(e.angle) * dt * timeFactor * _scaleFactor);
      e.pos[1] += (e.speed * Math.sin(e.angle) * dt * timeFactor *_scaleFactor);
    }

    //draws the enemy on the screen
    e.draw = function()
    {
      ctx.fillStyle = e._color;

      ctx.save();
      ctx.translate(e.pos[0], e.pos[1]);
      ctx.rotate(-e.angle);
      ctx.fillRect(-e._size/2, -e._size/2, e._size, e._size);
      ctx.restore();
    }

    e.getCollisionMeshBoundary = function()
    {
      return e._collisionRadius;
    }

}
