function enemies()
{

  //ref to this
  const e = this;

  //const
  e.maxNumber = 16;
  e.playerRef ;
  e.playerRef;


  //variables
  e.enemyStack = [];

  enemies.prototype.linkRefs = function(plRef)
  {
    var e = this;
    e.playerRef = plRef;
  }

  //Populates the array with enemies of different types.
  enemies.prototype.generateStack = function(percent)
  {
    var e = this;
    for(var i = 0; i < e.maxNumber; ++i)
    {
      var typeIndex = getRandomInt(0,2);

      if(typeIndex == 0)
      {
        e.enemyStack.push(new enemy(e.playerRef));
        e.enemyStack[e.enemyStack.length - 1].init(0, percent);	//low
      }
      if(typeIndex == 1)
      {
        e.enemyStack.push(new enemy(e.playerRef));
        e.enemyStack[e.enemyStack.length - 1].init(1, percent); 	//med
      }
      if(typeIndex == 2)
      {
        e.enemyStack.push(new enemy(e.playerRef));
        e.enemyStack[e.enemyStack.length - 1].init(2, percent); //high
      }
    }
    //console.log(en.enemyStack);
  }

  //renders the stack of enemies (calls enemy.render());
  enemies.prototype.renderStack = function(dt)
  {
    var e = this;
    for(var i = 0; i < e.enemyStack.length; ++i)
    {
      e.enemyStack[i].updatePosition(dt);
      e.enemyStack[i].render(dt);
    }
  }
}

function enemy(plRef){

    //ref to this
    const e = this;
  e.playerRef = plRef;

    //Defaults [low,medhigh] - parameters
	e._typeHealth = [5,3,1];
	e._typeDmg = [5,2,1];
	e._type = [0, 1, 2];
	e._typeSpeed = [50,80,120];
	e._typeColor = ["#EF4836", "rgb(46, 204, 113)", "#f39c12"];
    e._typeSize = [35, 20, 10];

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
    enemy.prototype.init = function(typeOf, percent)
    {
      //randomize a start position
      do
      {
        var randIntX = getRandomInt(c.width * 0.1, c.width * 0.8);
        var randIntY = getRandomInt(c.height*0.05, c.height* 0.9);
      }while(getDist(e.playerRef.pos,[randIntX,randIntY])[2] < (c.width*percent)); //Enemies can't spawn closer than this (percent of width)

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
      e.angle = getAngle(e.pos, e.playerRef.pos);
    }

    //Render functions which i called to render an enemy
    enemy.prototype.render = function(dt)
    {
      var e = this;
      //drawLineBetween(e.pos, e.playerRef.pos, "rgba(231, 76, 60, 0.3)", 0.10);
      e.draw();
      //drawCollisionMesh(e._collisionRadius, e.pos, "rgba(231, 76, 60, 0.8)");
		//drawCollisionMesh(1,[en.enemyStack[0].pos[0],en.enemyStack[0].pos[1]],"rgba(255,0,0,1.0)");
    }

    //function that update the position of an enemy
    enemy.prototype.updatePosition = function(dt)
    {
      var e = this;
      e.angle = getAngle(e.pos, e.playerRef.pos);
      e.pos[0] += (-e.speed * Math.cos(e.angle) * dt * timeFactor * _scaleFactor);
      e.pos[1] += (e.speed * Math.sin(e.angle) * dt * timeFactor *_scaleFactor);
      if(!e.pos[0] || !e.pos[1] || e.pos[0]<0.0 || e.pos[1]<0.0)
      {
        console.log(e);
      }
    }

    //draws the enemy on the screen
    enemy.prototype.draw = function()
    {
      var e = this;
      ctx.fillStyle = e._color;

      ctx.save();
      ctx.translate(e.pos[0], e.pos[1]);
      ctx.rotate(-e.angle);
      ctx.fillRect(-e._size/2, -e._size/2, e._size, e._size);
      ctx.restore();
    }

    enemy.prototype.getCollisionMeshBoundary = function()
    {
      var e = this;
      return e._collisionRadius;
    }

}
