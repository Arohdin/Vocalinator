function holes()
{
  const h = this;

  h.allHoles = [];
  h.linkedHoles = [];

  h.addHole = function(inMass, inDrawRad, inEffectRad, inPos)
  {
    h.allHoles.push(new blackHole(inMass, inDrawRad, inEffectRad, inPos));
  }

  //should not be called
  h.removeHole = function(index)
  {
    if(h.allHoles[index].isLinked)
    {
      h.removeLink(index,h.allHoles[index].linkId);
    }
    h.allHoles.splice(index,1);
  }

  h.renderHoles = function(msdt)
  {
    for(var i = 0; i < h.allHoles.length; ++i)
    {
      if(h.allHoles[i].timeDependant)
      {
        h.allHoles[i].hasLivedFor += msdt;
        if(h.allHoles[i].hasLivedFor >= h.allHoles[i].timeToLive)
        {
          h.removeHole(i);
          if(i > 1)
          {
            --i;
          }
        }
      }
      if(h.allHoles.length > 0)
      {
        h.allHoles[i].render();
        h.allHoles[i].drawEffectiveArea();
      }
    }
  }

  h.linkHoles = function(inIndecis)
  {
    var num = inIndecis.length;
    if(num >= 1)
    {
      for(var i = 0; i < inIndecis.length; ++i)
      {
        if(!h.allHoles[inIndecis[i]].isLinked)
        {
          h.allHoles[inIndecis[i]].linkId = h.linkedHoles.length;
          h.allHoles[inIndecis[i]].isLinked = true;
        }
        else
        {
          console.log("BlackHole with id: " + i + " is already linked to another pair of blacHoles");
          inIndecis.splice(i);
        }
      }
      if(inIndecis.length > 1)
      {
        h.linkedHoles.push(inIndecis);
        console.log("Link established");
      }
    }
  }

  h.removeLink = function(index, linkId)
  {
    for(var i = 0; i < h.linkedHoles[linkId].length; ++i)
    {
      if(h.linkedHoles[linkId][i] == index)
      {
        h.linkedHoles[linkId].splice(i,1);
      }
    }

    for(var i = 0; i < h.linkedHoles.length; ++i)
    {
      for(var j = 0; j < h.linkedHoles[i].length; ++j)
      {
        if(h.linkedHoles[i][j] > index)
        {
          --h.linkedHoles[i][j];
        }
      }
    }

    if(h.linkedHoles[linkId].length == 1)
    {
      h.allHoles[h.linkedHoles[linkId][0]].isLinked = false;
      //WTF
    }
  }

  h.renderLinks = function()
  {
    for(var i = 0; i < h.linkedHoles.length; ++i)
    {
      for(q = 0; q < h.linkedHoles[i].length - 1; ++q)
      {
        h.allHoles[h.linkedHoles[i][q]].renderLinks(h.allHoles[h.linkedHoles[i][q]].pos, h.allHoles[h.linkedHoles[i][q + 1]].pos);
      }
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

  b.isLinked = false;
  b.timeDependant = false;
  b.timeToLive = 0; //ms
  b.hasLivedFor = 0;  //ms

  b.linkId = -1; //what  id to spawn by (not used atm)

  b.render = function()
  {
	  ctx.fillStyle = b.color;

    ctx.beginPath();
    ctx.arc(b.pos[0], b.pos[1], b.drawRadius, 0, 2 * Math.PI,false);
    ctx.closePath();
    ctx.fill();

  }

  b.drawEffectiveArea = function()
  {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "orange";

    ctx.beginPath();
    ctx.arc(b.pos[0], b.pos[1], b.effectRadius, 0, 2 * Math.PI,false);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1.0;
  }

  b.renderLinks = function(pos1,pos2)
  {
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = "red";
    ctx.setLineDash([5, 15]);
    ctx.lineWidth = 5 * _scaleFactor;

    ctx.beginPath();
    ctx.moveTo(pos1[0],pos1[1]);
    ctx.lineTo(pos2[0], pos2[1]);
    ctx.stroke();
    ctx.closePath();

    ctx.setLineDash([]);
    ctx.globalAlpha = 1.0;
  }

  b.resetTimer = function()
  {
    b.hasLivedFor = 0;
  }

  b.isTimeDependant = function(state)
  {
    b.timeDependant = state;
  }

  b.setTimeout = function(ms)
  {
    b.timeToLive = ms;
  }

}
