function holes()
{
  const h = this;

  h.allHoles = [];

  h.addHole = function(inMass, inRad, inPos)
  {
    h.allHoles.push(new blackHole(inMass, inRad, inPos));
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
  }

  h.renderHoles = function()
  {

  }



}



function blackHole(inMass, inRad, inPos)
{
  const b = this;

  b.mass = inMass;
  b.radius = inRad;
  b.color = "red";
  b.pos = inPos;


  b.render = function()
  {

  }

}
