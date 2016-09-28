function deathRow()
{
  const dR = this;

  dR.row = [];

  dR.draw = function(dt)
  {
    for(var i = 0; i < dR.row.length; ++i)
    {
      dR.row[i].render(dt);
    }
  }

  dR.removeFromArray = function()
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
}


function deadEnemy()
{
  const e = this;

  e.timeBeforeGone = 1; //seconds
  e.timeLived;
  e.pos;
  e.angle;
  e.color;
  e.size;

  e.init = function(inPos, inSize, inAngle, inColor)
  {
    e.timeLived = 0;
    e.pos = inPos;
    e.angle = inAngle;
    e.color = inColor;
    e.size = inSize;
  }

  e.render = function(dt)
  {
    ctx.fillStyle = e.color;

    e.timeLived += dt;
    var t = (e.timeBeforeGone*e.timeLived < 1.0) ? e.timeBeforeGone*e.timeLived : 1.0;

    ctx.globalAlpha = 1.0 - t;
    ctx.save();	//Saves the state of the canvas
    ctx.translate(e.pos[0], e.pos[1]);	//translate the drawing origin to the position of the object
    ctx.rotate(-e.angle);	//Rotates the grid/coordinates (canvas)
    ctx.fillRect(-e.size/2,-e.size/2, e.size, e.size);	//draws the rect relative to the new origin and rotation
    ctx.restore();	//Loads the saved state

    if(e.timeBeforeGone*e.timeLived > 1.0)
    {
      deathRow.removeFromArray();
    }
    ctx.globalAlpha = 1.0;
  }
}
