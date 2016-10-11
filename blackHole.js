function holes(deathRef)
{
  const h = this;

  h.refToDeathRow = deathRef;
  h.allHoles = [];
  h.linkedHoles = [];
  h.enableGravity = enableGravity;

  holes.prototype.addHole = function(inMass, inDrawRad, inEffectRad, inPos, inRotateTime)
  {
    var h = this;
    h.allHoles.push(new blackHole(inMass, inDrawRad, inEffectRad, inPos, inRotateTime));
    h.allHoles[h.allHoles.length-1].loadBlackHoleImage();
  }

  holes.prototype.removeHole = function(index)
  {
    var h = this;
    var id = -1;
    var spliceId = -1;
    var tempBlackHoleID;

    for(var i = 0; i < h.allHoles.length; ++i)
    {
      if(index == i)
      {
        if(h.allHoles[i].isLinked)
        {
          id = h.allHoles[i].linkId;
        }
        tempBlackHoleID = i;
        break;
      }
    }

    if(id > -1 && h.allHoles.length > 0)
    {
      {
        for(var g = 0; g < h.linkedHoles[id].length; ++g)
        {
          if(index == h.linkedHoles[id][g])
          {
            spliceId = g;
            for(var k = 0; k < h.linkedHoles[id].length; ++k)
            {
              if(h.linkedHoles[id][k] > index)
              {
                --h.linkedHoles[id][k];
              }
            }
            break;
          }
        }
        var o = h.getLinkObject(id);
        h.refToDeathRow.holeRow.push(new deadHole(h.refToDeathRow));
        h.refToDeathRow.holeRow[h.refToDeathRow.holeRow.length-1].init(h.allHoles[i].pos, h.allHoles[i].angle, h.allHoles[i].images, h.allHoles[i].drawRadius, o);
        h.removeLink(id, spliceId);
      }
    }
    var o = h.getLinkObject(id);
    h.refToDeathRow.holeRow.push(new deadHole(h.refToDeathRow));
    h.refToDeathRow.holeRow[h.refToDeathRow.holeRow.length-1].init(h.allHoles[i].pos, h.allHoles[i].angle, h.allHoles[i].images, h.allHoles[i].drawRadius, o);
    //h.refToDeathRow.holeRow.push(new deadHole(h.refToDeathRow));
    //h.refToDeathRow.holeRow[h.refToDeathRow.holeRow.length-1].init(h.allHoles[i].pos, h.allHoles[i].angle, h.allHoles[i].images, h.allHoles[i].drawRadius, null);

    h.allHoles.splice(tempBlackHoleID,1);

    if(h.linkedHoles[id].length == 1)
    {
      h.removeLink(id, 0);
    }
  }

  holes.prototype.flush = function()
  {
    var h = this;
    h.allHoles.length = 0;
    h.linkedHoles.length = 0;
  }

  holes.prototype.updateHoles = function(msdt)
  {
    var h = this;
    if(!paused)
    {
      var dt = msdt/1000;
      for(var i = 0; i < h.allHoles.length; ++i)
      {
        h.allHoles[i].angle += Math.PI * 2 * (dt/h.allHoles[i].rotateTime);
        if(h.allHoles[i].angle > Math.PI * 2)
        {
          h.allHoles[i].angle = 0;
        }

        if(h.allHoles[i].timeDependant)
        {
          h.allHoles[i].hasLivedFor += msdt;
          if(h.allHoles[i].hasLivedFor >= h.allHoles[i].timeToLive)
          {
            h.removeHole(i);
          }
        }
      }
    }

  }

  holes.prototype.renderHoles = function(dt)
  {
    var h = this;
    for(var i = 0; i < h.allHoles.length; ++i)
    {
      //h.allHoles[i].drawEffectiveArea();
      h.allHoles[i].render(dt);
    }
  }

  holes.prototype.linkHoles = function(idArray)
  {
    var h = this;
    for(var i = 0; i < idArray.length; ++i)
    {
      if(h.allHoles[idArray[i]].isLinked == true)
      {
        console.log("already linked");
        return;
      }
    }

    for(var i = 0; i < idArray.length; ++i)
    {
      h.allHoles[idArray[i]].isLinked = 1;
      h.allHoles[idArray[i]].linkId = h.linkedHoles.length;
    }
    h.linkedHoles.push(idArray);
  }

  holes.prototype.removeLink = function(id, spliceId)
  {
    var h = this;
    h.allHoles[h.linkedHoles[id][spliceId]].isLinked = -1;
    h.linkedHoles[id].splice(spliceId,1);
    if(h.linkedHoles[id].length == 0)
    {
      h.linkedHoles.splice(id,1);
    }
  }

  holes.prototype.renderLinks = function()
  {
    var h = this;
    for(var i = 0; i < h.linkedHoles.length; ++i)
    {
      var o = h.getLinkObject(i);
      h.drawLinks(o);
    }
  }

  holes.prototype.getLinkObject = function(i)
  {
    var obj = {startPos: h.allHoles[h.linkedHoles[i][0]].pos, middlePos: []};
    if(h.linkedHoles[i].length == 2)
    {
      obj.endPos = h.allHoles[h.linkedHoles[i][1]].pos;
    }
    else if(h.linkedHoles[i].length > 1)
    {
      for(var q = 1; q < h.linkedHoles[i].length; ++q)
      {
        obj.middlePos.push(h.allHoles[h.linkedHoles[i][q]].pos);
      }
      obj.endPos = h.allHoles[h.linkedHoles[i][0]].pos;
    }
    else
    {
      obj.endPos = h.allHoles[h.linkedHoles[i][0]].pos;
    }

    return obj;
  }

  holes.prototype.drawLinks = function(inObj)
  {
    var h = this;
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = "white";
    ctx.setLineDash([5*_scaleFactor, 15*_scaleFactor]);
    ctx.lineWidth = 2 * _scaleFactor;

    ctx.beginPath();
    ctx.moveTo(inObj.startPos[0], inObj.startPos[1]);
    for(var i = 0; i < inObj.middlePos.length; ++i)
    {
      ctx.lineTo(inObj.middlePos[i][0], inObj.middlePos[i][1]);
    }
    ctx.lineTo(inObj.endPos[0], inObj.endPos[1]);
    ctx.stroke();
    ctx.closePath();

    ctx.setLineDash([]);
    ctx.globalAlpha = 1.0;
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

  blackHole.prototype.render = function(dt)
  {
    var b = this;
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

  blackHole.prototype.drawEffectiveArea = function()
  {
    var b = this;
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "darkblue";

    ctx.beginPath();
    ctx.arc(b.pos[0], b.pos[1], b.effectRadius, 0, 2 * Math.PI,false);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1.0;
  }

  blackHole.prototype.resetTimer = function()
  {
    var b = this;
    b.hasLivedFor = 0;
  }

  blackHole.prototype.isTimeDependant = function(state)
  {
    var b = this;
    b.timeDependant = state;
  }

  blackHole.prototype.setTimeout = function(ms)
  {
    var b = this;
    b.timeToLive = ms;
  }

  blackHole.prototype.loadBlackHoleImage = function()
  {
    var b = this;
    b.sources = {
    blackHoleSprite: 'images/hole.png'
    };

    for(var src in b.sources)
    {
      b.images[src] = new Image();
      b.images[src].onload = function() {};
      b.images[src].src = b.sources[src];
      console.log("LOADED");
    }
  }
}
