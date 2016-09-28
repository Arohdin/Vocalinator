function projectiles() {

  //obj ref
  const pj = this;

  //variables
  pj.skott= [];
  pj.timeSinceShot;
  pj.filteredShots = [];

  pj.init= function()
  {
    pj.timeSinceShot=clock.getTime();
  }

  //constants
  const projColors = ["#2c3e50", "#8e44ad", "#f39c12"];
  const speed = 1100;
  const rateOfFire = 150;

  //projectile object
  function projectile() {
    const pro=this;

    pro.pos = [];
    pro.radius;
    pro.color;
    pro.direction = [];
    pro._type;

    pro.init = function()
    {
      pro.radius= 7*_scaleFactor;
      pro._type = projectileType;
      pro.color = projColors[projectileType];
      var angle =getAngle([mousePos.x, mousePos.y], pl.pos);
      var hype=pl._collisionRadius+ pro.radius;

      pro.direction = [Math.cos(angle), -Math.sin(angle)];
      pro.pos = [pl.pos[0] + pro.direction[0]*hype, pl.pos[1] + pro.direction[1]*hype];
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
    if((clock.getTime()-pj.timeSinceShot > rateOfFire*timeFactor) && pitch!=NOTLOUD)
    {
      var ettSkott = new projectile();
      ettSkott.init();
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
