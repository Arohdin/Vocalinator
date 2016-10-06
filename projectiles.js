function projectiles() {

  //obj ref
  const pj = this;

  //variables
  pj.skott= [];
  pj.timeSinceShot;
  pj.filteredShots = [];
  pj.playerRef;

  pj.init= function(plRef)
  {
    pj.playerRef = plRef;
    pj.timeSinceShot=clock.getTime();
  }

  //constants
  const projColors = ["#EF4836", "rgb(46, 204, 113)", "#f39c12"];
  const speed = 1100;
  const rateOfFire = 150;

  //projectile object
  function projectile() {
    const pro=this;
    pro.playerRef;

    pro.pos = [];
    pro.radius;
    pro.color;
    pro.direction = [];
    pro._type;
    pro.angle;

    pro.init = function(plRef)
    {
      pro.playerRef = plRef;
      pro.radius= 7*_scaleFactor;
      pro._type = projectileType;
      pro.color = projColors[projectileType];
      pro.angle =getAngle([mousePos.x, mousePos.y], pro.playerRef.pos);
      var hype=pro.playerRef._collisionRadius*0.5;

      pro.direction = [Math.cos(pro.angle), -Math.sin(pro.angle)];
      pro.pos = [pro.playerRef.pos[0] + pro.direction[0]*hype, pro.playerRef.pos[1] + pro.direction[1]*hype];
    }

    pro.updatePosition= function(deltaT)
    {
      pro.pos = [pro.pos[0]+pro.direction[0]*speed*deltaT*timeFactor*_scaleFactor, pro.pos[1]+ pro.direction[1]*speed*deltaT*timeFactor*_scaleFactor];
    }

    pro.draw =function ()
    {
      ctx.beginPath();
      ctx.arc(pro.pos[0], pro.pos[1], pro.radius, 0, 2 * Math.PI, false);
      ctx.closePath();
      ctx.fillStyle= pro.color;
      ctx.fill();
    }
  }

  pj.shoot = function()
  {
    if(!paused && (clock.getTime()-pj.timeSinceShot > rateOfFire/timeFactor) && pitch!=NOTLOUD && !pj.playerRef.teleporting)
    {
      if(gamepadUsed && !(Math.abs(gp.axes[2])>gamepadThreshold || Math.abs(gp.axes[3])>gamepadThreshold))
      {
        return;
      }
      var ettSkott = new projectile();
      ettSkott.init(pj.playerRef);
      pj.skott.push(ettSkott);
      pj.timeSinceShot=clock.getTime();
    }

  }

  pj.updateAll= function(deltaT)
  {
    for(var i=0; i< pj.skott.length; ++i)
    {
      pj.skott[i].updatePosition(deltaT);
    }
  }

  pj.drawAll= function()
  {
    for(var i=0; i< pj.skott.length; ++i)
    {
      pj.skott[i].draw();
    }
  }

  pj.removeProjectiles = function()
  {
    pj.filteredShots = pj.skott.filter(krock.checkProjectileBorderCollision);
    pj.skott.length=0;
    for(i=0;i<pj.filteredShots.length;++i)
    {
      pj.skott[i]=pj.filteredShots[i];
    }
    pj.filteredShots.length=0;
  }

  pj.render = function(deltaT)
  {
    pj.updateAll(deltaT);
    pj.drawAll();
  }
}
