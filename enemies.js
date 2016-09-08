function enemies()
{

  //ref to this
  const e = this;

  //variables
  var maxNumber = 2;
  var enemyStack = [];

  e.generateStack = function()
  {
    for(var i = 0; i < maxNumber; ++i)
    {
      var typeIndex = getRandomInt(0,1);
      console.log(typeIndex);
      if(typeIndex == 0)
      {
        enemyStack.push(new enemy());
        enemyStack[enemyStack.length - 1].init("low");
      }
      if(typeIndex == 1)
      {
        enemyStack.push(new enemy());
        enemyStack[enemyStack.length - 1].init("med");
      }
      if(typeIndex == 2)
      {
        enemyStack.push(new enemy());
        enemyStack[enemyStack.length - 1].init("high");
      }
    }
  }


  e.renderStack = function(dt)
  {
    for(var i = 0; i < maxNumber; ++i)
    {
      enemyStack[i].render(dt);
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
    e._lowTypeSpeed = 80;
    e._medTypeSpeed = 120;
    e._highTypeSpeed = 170;
    e._lowTypeColor = "#2c3e50";
    e._medTypeColor = "#8e44ad";
    e._highTypeColor = "#f39c12";
    e._typeSize = [40, 25 ,10];

    //e Specifics;
    e.health;
    e.speed;
    e._type;
    e.dmg;
    e._color;
    e._size;

    //Variables
    e.pos;
    e.angle;

    //init
    e.init = function(typeOf)
    {
      var randIntX = getRandomInt(200, 1200);
      var randIntY = getRandomInt(100, 600);

      if(typeOf == e._lowType)
      {
        e._type = typeOf;
        e.health = e._lowTypeHealth;
        e.dmg = e._lowTypeDmg;
        e._color = e._lowTypeColor;
        e._size = [e._typeSize[0], e._typeSize[0]];
        e.speed = e._lowTypeSpeed;
      }
      if(typeOf == e._medType)
      {
        e._type = typeOf;
        e.health = e._medTypeHealth;
        e.dmg = e._medTypeDmg;
        e._color = e._medTypeColor;
        e._size = [e._typeSize[1], e._typeSize[1]];
        e.speed = e._medTypeSpeed;
      }
      if(typeOf == e._highType)
      {
        e._type = typeOf;
        e.health = e._highTypeHealth;
        e.dmg = e._highDmg;
        e._color = e._highTypeColor;
        e._size = [e._typeSize[2], e._typeSize[2]];
        e.speed = e._highSpeed;
      }

      e.pos = [randIntX, randIntY];
      e.angle = getAngle(e.pos, pl.pos);
    }

    e.render = function(dt)
    {
      drawLineBetween(e.pos, pl.pos, "#e74c3c");
      e.updatePosition(dt);
      e.draw();
    }

    e.updatePosition = function(dt)
    {
      e.angle = getAngle(e.pos, pl.pos);
      e.pos[0] += (-e.speed * Math.cos(e.angle) * dt);
      e.pos[1] += (e.speed * Math.sin(e.angle) * dt);
    }

    e.draw = function()
    {
      ctx.fillStyle = e._color;

      ctx.save();
      ctx.translate(e.pos[0], e.pos[1]);
      ctx.rotate(-e.angle);
      ctx.fillRect(-e._size[0]/2, -e._size[1]/2, e._size[0], e._size[1]);
      ctx.restore();
    }

}
