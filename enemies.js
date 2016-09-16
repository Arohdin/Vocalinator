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
        e.enemyStack[e.enemyStack.length - 1].init("low");
      }
      if(typeIndex == 1)
      {
        e.enemyStack.push(new enemy());
        e.enemyStack[e.enemyStack.length - 1].init("med");
      }
      if(typeIndex == 2)
      {
        e.enemyStack.push(new enemy());
        e.enemyStack[e.enemyStack.length - 1].init("high");
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

    //Defaults
    e._lowTypeHealth = 10;
    e._medTypeHealth = 5;
    e._highTypeHealth = 1;
    e._lowTypeDmg = 5;
    e._medTypeDmg = 2;
    e._highTypeDmg = 1;
    e._lowType = "low";
    e._medType = "med";
    e._highType = "high";
    e._lowTypeSpeed = 100;
    e._medTypeSpeed = 130;
    e._highTypeSpeed = 170;
    e._lowTypeColor = "#2c3e50";
    e._medTypeColor = "#8e44ad";
    e._highTypeColor = "#f39c12";
    e._typeSize = [50, 30, 15];

    //e Specifics;
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
      if(typeOf == e._lowType)
      {
        e._type = typeOf;
        e.health = e._lowTypeHealth;
        e.dmg = e._lowTypeDmg;
        e._color = e._lowTypeColor;
        e._size = e._typeSize[0] * _scaleFactor;
        e.speed = e._lowTypeSpeed;
        e._collisionRadius = generateCollisionMesh(e._size);
      }
      if(typeOf == e._medType)
      {
        e._type = typeOf;
        e.health = e._medTypeHealth;
        e.dmg = e._medTypeDmg;
        e._color = e._medTypeColor;
        e._size = e._typeSize[1] * _scaleFactor;
        e.speed = e._medTypeSpeed;
        e._collisionRadius = generateCollisionMesh(e._size);
      }
      if(typeOf == e._highType)
      {
        e._type = typeOf;
        e.health = e._highTypeHealth;
        e.dmg = e._highTypeDmg;
        e._color = e._highTypeColor;
        e._size = e._typeSize[2] * _scaleFactor;
        e.speed = e._highTypeSpeed;
        e._collisionRadius = generateCollisionMesh(e._size);
      }

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
