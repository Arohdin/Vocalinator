function holes()
{
  const h = this;

  h.allHoles = [];

  h.addHole = function(inMass, inDrawRad, inEffectRad, inPos)
  {
    h.allHoles.push(new blackHole(inMass, inDrawRad, inEffectRad, inPos));
  }

  h.removeHole = function(index)
  {
    h.allHoles.splice(index,1);
  }

  h.renderHoles = function()
  {
    for(var i = 0; i < h.allHoles.length; ++i)
    {
      h.allHoles[i].render();
    }
  }
}



function blackHole(inMass, inDrawRad, inEffectRad, inPos)
{
  const b = this;

  b.mass = inMass;
  b.drawRadius = inDrawRad * _scaleFactor;
  b.effectRadius = inEffectRad * _scaleFactor;
  b.color = "green";
  b.pos = inPos;

  b.spawnLinkerId = -1; //what  id to spawn by (not used atm)


  b.render = function()
  {
	  ctx.fillStyle = b.color;

    ctx.beginPath();
    ctx.arc(b.pos[0], b.pos[1], b.drawRadius, 0, 2 * Math.PI,false);
    ctx.closePath();
    ctx.fill();

  }

}
