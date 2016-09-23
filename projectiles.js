function projectiles() {

  //obj ref
  const pj = this;

  //variables
  pj.skott= [];

  //constants
  const projColors = ["#3498db", "#2ecc71", "#e74c3c"];
  const speed = 1100;

  //projectile object
  function projectile() {
    const pro=this;

    pro.pos = [];
    pro.radius;
    pro.color;
    pro.direction = [];

    pro.init = function()
    {
      pro.radius= 7;
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
    var ettSkott = new projectile();
    ettSkott.init();
    pj.skott.unshift(ettSkott);
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

  pj.removeProjectile= function()
  {
    pj.skott.length--;
  }

  pj.render = function(deltaT)
  {
    pj.updateAll(deltaT);
    pj.drawAll();
  }
}
