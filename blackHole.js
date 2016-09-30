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
    var ind;
    for(var i = 0; i < dR.row.length; ++i)
    {
      if(dR.row[i].timeLived * dR.row[i].timeBeforeGone > 1)
      {
        ind = i;
      }
    }

    if(dR.row.length > 1)
    {
      if(ind > 0)
      {
        var parts = [dR.row.slice(0, ind)];
        parts.push((ind < (dR.row.length - 1)) ? dR.row.slice(ind + 1, dR.row.length) : []);
        newArr = parts[0].concat(parts[1]);
      }
      else
      {
        newArr = dR.row.slice(1, dR.row.length);
      }
      dR.row.length = 0;
      dR.row = newArr;
    }
    else
    {
      dR.row.length = 0;
    }
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
