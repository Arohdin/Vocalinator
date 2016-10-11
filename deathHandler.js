function deathRow()
{
  const dR = this;

  dR.enemyRow = [];
  dR.holeRow = [];

  dR.draw = function(dt)
  {
    for(var i = 0; i < dR.enemyRow.length; ++i)
    {
      dR.enemyRow[i].render(dt);
    }
    for(var k = 0; k < dR.holeRow.length; ++k)
    {
      dR.holeRow[k].render(dt);
    }
  }

  dR.removeFromArray = function(objTypeRow)
  {
    var ind;
    for(var i = 0; i < objTypeRow.length; ++i)
    {
      if(objTypeRow[i].timeLived * objTypeRow[i].timeBeforeGone > 1)
      {
        ind = i;
      }
    }

    if(objTypeRow.length > 1)
    {
      if(ind > 0)
      {
        var parts = [objTypeRow.slice(0, ind)];
        parts.push((ind < (objTypeRow.length - 1)) ? objTypeRow.slice(ind + 1, objTypeRow.length) : []);
        newArr = parts[0].concat(parts[1]);
      }
      else
      {
        newArr = objTypeRow.slice(1, objTypeRow.length);
      }
      objTypeRow.length = 0;
      objTypeRow = newArr;
    }
    else
    {
      objTypeRow.length = 0;
    }

  }
}


function deadEnemy(ref)
{
  const e = this;
  e.refToParent = ref;

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

    if(!paused)
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
      deathRow.removeFromArray(e.refToParent.enemyRow);
    }
    ctx.globalAlpha = 1.0;
  }
}

function deadHole(ref)
{
  const dh = this;
  dh.refToParent = ref

  dh.timeBeforeGone = 0.7; //seconds
  dh.timeLived = 0;
  dh.pos;
  dh.angle;
  dh.images = [];
  dh.drawRadius;
  dh.linkPositions = null;

  dh.init = function(inPos, inAngle, sprites, rad, linkObj)
  {
    dh.timeLived = 0;
    dh.pos = inPos;
    dh.angle = inAngle;
    dh.images = sprites;
    dh.drawRadius = rad;
    dh.linkPositions = linkObj;
  }

  dh.render = function(dt)
  {
    if(!paused)
    dh.timeLived += dt;

    var t = (dh.timeLived/dh.timeBeforeGone < 1.0) ? dh.timeLived/dh.timeBeforeGone : 1.0;
    var g = (dh.timeLived/dh.timeBeforeGone < 0.4) ? dh.timeLived/dh.timeBeforeGone*0.4 : 0.4;

    var scale = Math.abs(Math.cos(dh.angle/2));

    //HOLES
    ctx.globalAlpha = 1.0 - t;
    ctx.save();
    ctx.translate(dh.pos[0], dh.pos[1]);
    ctx.rotate(-dh.angle);
    ctx.translate(-dh.pos[0], -dh.pos[1]);
    ctx.drawImage(dh.images.blackHoleSprite, dh.pos[0] - dh.drawRadius, dh.pos[1]- dh.drawRadius, dh.drawRadius*2,  dh.drawRadius*2);
    ctx.restore();
    ctx.globalAlpha = 1.0;

    ctx.save();
    ctx.translate(dh.pos[0], dh.pos[1]);
    ctx.rotate(-dh.angle*0.5);
    ctx.translate(-dh.pos[0], -dh.pos[1]);
    ctx.globalAlpha = 0.1 * (1.0 - t);
    ctx.drawImage(dh.images.blackHoleSprite, dh.pos[0] - (dh.effectRadius*scale), dh.pos[1]- (dh.effectRadius*scale), dh.effectRadius*2*scale,  dh.effectRadius*2*scale);
    ctx.globalAlpha = 1.0;
    ctx.restore();

    if(dh.linkPositions)
    {
      ctx.globalAlpha = 0.4 - g;
      ctx.strokeStyle = "white";
      ctx.setLineDash([5*_scaleFactor, 15*_scaleFactor]);
      ctx.lineWidth = 2 * _scaleFactor;

      ctx.beginPath();
      ctx.moveTo(dh.linkPositions.startPos[0], dh.linkPositions.startPos[1]);
      for(var i = 0; i < dh.linkPositions.middlePos.length; ++i)
      {
        ctx.lineTo(dh.linkPositions.middlePos[i][0], dh.linkPositions.middlePos[i][1]);
      }
      ctx.lineTo(dh.linkPositions.endPos[0], dh.linkPositions.endPos[1]);
      ctx.stroke();
      ctx.closePath();

      ctx.setLineDash([]);
    }

    if(t == 1.0 && g == 0.4)
    {
      deathRow.removeFromArray(dh.refToParent.holeRow);
    }
    ctx.globalAlpha = 1.0;

  }
}
