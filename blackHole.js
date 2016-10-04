function holes()
{
  const h = this;

  h.allHoles = [];
  h.linkedHoles = [];
  h.enableGravity = true;

  h.addHole = function(inMass, inDrawRad, inEffectRad, inPos, inRotateTime)
  {
    h.allHoles.push(new blackHole(inMass, inDrawRad, inEffectRad, inPos, inRotateTime));
    h.allHoles[h.allHoles.length-1].loadBlackHoleImage();
  }

  //should not be called
  h.removeHole = function(index)
  {
    //remove
    if(h.allHoles[index].isLinked)
    {
      h.removeLink(index,h.allHoles[index].linkId);
    }
    h.allHoles.splice(index,1);

  }

  h.updateHoles = function(msdt)
  {
    for(var i = 0; i < h.allHoles.length; ++i)
    {
      if(h.allHoles[i].timeDependant)
      {
        h.allHoles[i].hasLivedFor += msdt;
        if(h.allHoles[i].hasLivedFor >= h.allHoles[i].timeToLive)
        {
          h.allHoles[i].removeHole(i);
        }
      }
    }
  }

  h.renderHoles = function(msdt)
  {
    h.updateHoles(msdt);
    for(var i = 0; i < h.allHoles.length; ++i)
    {
      //h.allHoles[i].drawEffectiveArea();
      h.allHoles[i].render(msdt/1000);
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
        //console.log("Link established");
      }
    }
  }

  h.removeLink = function(index, linkId)
  {
    //remove links
    for(var q = 0; q < h.linkedHoles[linkId].length; ++q)
    {
      if(h.linkedHoles[linkId][q] == index)
      {
        h.linkedHoles[linkId].splice(q,1);
      }
    }

    //Adjust
    for(var k = 0; k < h.linkedHoles[linkId].length; ++k)
    {
      if(k >= index)
      {
        --h.linkedHoles[linkId][k];
      }
    }

    //check if it is the last item
    if(h.linkedHoles[linkId].length == 1)
    {
      h.removeHole(h.linkedHoles[linkId][0]);
      h.linkedHoles.splice(linkId,1);
    }
  }

  h.renderLinks = function()
  {
    for(var i = 0; i < h.linkedHoles.length; ++i)
    {
      for(q = 0; q < h.linkedHoles[i].length - 1; ++q)
      {
        h.allHoles[h.linkedHoles[i][q]].renderLinks(h.allHoles[h.linkedHoles[i][q]].pos, h.allHoles[h.linkedHoles[i][q + 1]].pos);
        if(h.linkedHoles[i].length > 2 && q == (h.linkedHoles[i].length - 2))
        {
          h.allHoles[h.linkedHoles[i][q]].renderLinks(h.allHoles[h.linkedHoles[i][0]].pos, h.allHoles[h.linkedHoles[i].length - 1].pos);
        }
      }
    }
  }
}



function blackHole(inMass, inDrawRad, inEffectRad, inPos, inRotateTime)
{
  const b = this;

  b.mass = inMass;
  b.drawRadius = inDrawRad * _scaleFactor;
  b.effectRadius = inEffectRad * _scaleFactor;
  b.collisionRadius = b.drawRadius * 0.25;
  b.color = "black";
  b.pos = inPos;
  b.images = [];
  b.angle = 0;
  b.rotateTime = inRotateTime;

  b.isLinked = false;
  b.timeDependant = false;
  b.timeToLive = 0; //ms
  b.hasLivedFor = 0;  //ms

  b.linkId = -1; //what  id to spawn by (not used atm)

  b.render = function(dt)
  {
    b.angle += Math.PI * 2 * (dt/b.rotateTime);
    if(b.angle > Math.PI * 2)
    {
      b.angle = 0;
    }

    var scale = Math.abs(Math.cos(b.angle/2));

    ctx.save();
    ctx.translate(b.pos[0], b.pos[1]);
    ctx.rotate(-b.angle);
    ctx.translate(-b.pos[0], -b.pos[1]);
    ctx.drawImage(b.images.blackHoleSprite, b.pos[0] - b.drawRadius, b.pos[1]- b.drawRadius, b.drawRadius*2,  b.drawRadius*2);
    ctx.restore();

    ctx.save();
    ctx.translate(b.pos[0], b.pos[1]);
    ctx.rotate(-b.angle*0.5);
    ctx.translate(-b.pos[0], -b.pos[1]);
    ctx.globalAlpha = 0.1;
    ctx.drawImage(b.images.blackHoleSprite, b.pos[0] - (b.effectRadius*scale), b.pos[1]- (b.effectRadius*scale), b.effectRadius*2*scale,  b.effectRadius*2*scale);
    ctx.globalAlpha = 1.0;
    ctx.restore();

  }

  b.drawEffectiveArea = function()
  {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "darkblue";

    ctx.beginPath();
    ctx.arc(b.pos[0], b.pos[1], b.effectRadius, 0, 2 * Math.PI,false);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1.0;
  }

  b.renderLinks = function(pos1,pos2)
  {
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = "white";
    ctx.setLineDash([5*_scaleFactor, 15*_scaleFactor]);
    ctx.lineWidth = 2 * _scaleFactor;

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

  b.loadBlackHoleImage = function()
  {

  b.sources = {
    blackHoleSprite: 'images/hole.png'
    };

  for(var src in b.sources) {
         b.images[src] = new Image();
         b.images[src].onload = function() {

          };
          b.images[src].src = b.sources[src];
      console.log("LOADED");
        }

  }

}
