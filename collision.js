function collisionDetection()
{
  const cd = this;

  cd.iterations = 4;

  cd._PAD = 2;
  cd.numCols = 24 + cd._PAD;
  cd.numRows = 13 + cd._PAD;
  cd.cellWidth;
  cd.cellHeight;
  cd.AA;
  cd.cellIndexArray = [];

  cd.playerRef;
  cd.projectileRef;
  cd.enemyStackRef;
  cd.deathRowRef;

  cd.linkRefs = function(plRef, enRef, projRef, deathRef)
  {
    cd.playerRef = plRef;
    cd.projectileRef = projRef;
    cd.enemyStackRef = enRef;
    cd.deathRowRef = deathRef;
  }

  cd.generateGrid = function()
  {
    cd.cellWidth = c.width / (cd.numCols - cd._PAD);
    cd.cellHeight = c.height / (cd.numRows - cd._PAD);

    cd.AA = new Array(cd.numRows);    //AA[row][col];

    for(var g = 0; g < cd.numRows; ++g)
    {
      cd.AA[g] = new Array(cd.numCols)
    }

    //GENERATES
    for(var i = 0; i < cd.numRows; ++i)
    {
      for(var q = 0; q < cd.numCols; ++q)
      {
        cd.AA[i][q] = new cell(q*cd.cellWidth, i*cd.cellHeight, cd.cellWidth, cd.cellHeight);
      }
    }
  }

  cd.drawGrid = function()
  {
    ctx.strokeStyle = "rgba(46, 204, 113, 0.8)";
    ctx.lineWidth = 1;
    for(var i = 0; i < cd.numRows; ++i)
    {
      ctx.beginPath()
      ctx.moveTo(0,i*cd.cellHeight);
      ctx.lineTo(c.width, i*cd.cellHeight);
      ctx.stroke();
      ctx.closePath();
    }
    for(var q = 0; q < cd.numCols; ++q)
    {
      ctx.beginPath()
      ctx.moveTo(q*cd.cellWidth,0);
      ctx.lineTo(q*cd.cellWidth, c.width);
      ctx.stroke();
      ctx.closePath();
    }
  }

  cd.init = function()
  {
		//Init for enemies
		for(var i = 0; i < cd.enemyStackRef.enemyStack.length; ++i)
		{
		  var posX = cd.enemyStackRef.enemyStack[i].pos[0];
		  var posY = cd.enemyStackRef.enemyStack[i].pos[1];
		  var colIndex = 1 + Math.floor(posX/cd.cellWidth);
		  var rowIndex = 1 + Math.floor(posY/cd.cellHeight);
      if(cd.AA[rowIndex][colIndex].members[0].length < 1 && cd.AA[rowIndex][colIndex].members[1].length < 1)
      {
      //console.log(rowIndex + " " + colIndex);
        cd.cellIndexArray.push([rowIndex,colIndex]);
      }
      cd.AA[rowIndex][colIndex].members[0].push(i);
		}

    for(var u = 0; u < cd.projectileRef.skott.length; ++u)
    {
      var pX = cd.projectileRef.skott[u].pos[0];
      var pY = cd.projectileRef.skott[u].pos[1];
      var cIndex = 1 + Math.floor(pX/cd.cellWidth);
      var rIndex = 1 + Math.floor(pY/cd.cellHeight);
      if(cd.AA[rIndex][cIndex].members[0].length < 1 && cd.AA[rIndex][cIndex].members[1].length < 1)
      {
        cd.cellIndexArray.push([rIndex,cIndex]);
      }
      cd.AA[rIndex][cIndex].members[1].push(u);
    }
  }

  cd.updateCells = function()
  {
	  //flushing
	  for(var q = 0; q < cd.cellIndexArray.length; q++)
	  {
		  for(var s = 0; s < cd.AA[cd.cellIndexArray[q][0]][cd.cellIndexArray[q][1]].members.length; ++s)
		  {
        cd.AA[cd.cellIndexArray[q][0]][cd.cellIndexArray[q][1]].members[s].length = 0;
			}
	  }
	  cd.cellIndexArray.length = 0;

	  //Init again
	  cd.init();
  }

  cd.calculateCollision = function(dt)
  {
	  //Check collision with screen border (also moves if outside the boundries)
	  cd.playerRef.pos = cd.checkBorderCollision(cd.playerRef.pos, cd.playerRef._collisionRadius)
    for(var b = 0; b < cd.iterations; ++b)
    {

      for(var i = 0; i < cd.cellIndexArray.length; ++i)
      {
        for(var q = cd.cellIndexArray[i][0] - 1; q <= cd.cellIndexArray[i][0] + 1; q++)
        {
          for(var d = cd.cellIndexArray[i][1] - 1; d <= cd.cellIndexArray[i][1] + 1; ++d)
          {
               cd.enemyCollisionCheck(q,d,i);
               cd.projectileCollisionCheck(q,d,i);
          }
        }
      }
      cd.updateCells();
    }

    //Gravity
    if(bh.enableGravity)
    {
      for(var j = 0; j < cd.projectileRef.skott.length; ++j)
      {
        for(var k = 0; k < bh.allHoles.length; ++k)
        {
          var d = getDist([cd.projectileRef.skott[j].pos[0], cd.projectileRef.skott[j].pos[1]], [bh.allHoles[k].pos[0],bh.allHoles[k].pos[1]]);
          if(d[2] < bh.allHoles[k].effectRadius)
          {
            var m = bh.allHoles[k].mass;
            var a = getAngle(cd.projectileRef.skott[j].pos, bh.allHoles[k].pos);

            cd.projectileRef.skott[j].direction[0] -= Math.cos(a) * dt * _scaleFactor * timeFactor * m  * (1-(d[2]/bh.allHoles[k].effectRadius/2));
            cd.projectileRef.skott[j].direction[1] += Math.sin(a) * dt *_scaleFactor * timeFactor * m * (1-(d[2]/bh.allHoles[k].effectRadius/2));
          }
          if(enableProjectileTeleport)
          {
            if(d[2] - bh.allHoles[k].collisionRadius - cd.projectileRef.skott[j].radius < 0)
            {
              var q = bh.allHoles[k].linkId;
              var f = 0;
              for(var g = 0; g < bh.linkedHoles[q].length; ++g)
              {
                if(bh.linkedHoles[q][g] == k)
                {
                  f = g;
                }
              }
              var ind = (f == bh.linkedHoles[q].length - 1) ? ind = 0 : ind = f+1;
              var asd = bh.linkedHoles[q][ind];
              cd.projectileRef.skott[j].pos[0] = bh.allHoles[asd].pos[0] + Math.cos(cd.projectileRef.skott[j].angle) * (bh.allHoles[asd].collisionRadius + cd.projectileRef.skott[j].radius * 2);
              cd.projectileRef.skott[j].pos[1] = bh.allHoles[asd].pos[1] - Math.sin(cd.projectileRef.skott[j].angle) * (bh.allHoles[asd].collisionRadius + cd.projectileRef.skott[j].radius * 2);
              cd.updateCells();
            }
          }
        }
      }
      cd.updateCells();
    }



    if(!disablePlayerCollision)
    {
      for(var f = 0; f < cd.enemyStackRef.enemyStack.length; ++f)
      {
        var dist = getDist(cd.playerRef.pos,cd.enemyStackRef.enemyStack[f].pos);
        if((dist[2] - cd.playerRef._collisionRadius - cd.enemyStackRef.enemyStack[f]._collisionRadius) < 0)
        {
          var deltaDist = Math.abs(dist[2] - cd.playerRef._collisionRadius - cd.enemyStackRef.enemyStack[f]._collisionRadius);
          var tempAngle = getAngle(cd.playerRef.pos, cd.enemyStackRef.enemyStack[f].pos);

          cd.enemyStackRef.enemyStack[f].pos[0] += Math.cos(tempAngle) * -deltaDist;
          cd.enemyStackRef.enemyStack[f].pos[1] += Math.sin(tempAngle) * deltaDist;
          cd.enemyStackRef.enemyStack[f].angle = tempAngle;

          //player dies
          if(!godMode)
          {
            playerDeath=true;
            disableCollision=true;
          }
        }

        //Check collision with screen border (also moves if outside the boundries)
        cd.enemyStackRef.enemyStack[f].pos = cd.checkBorderCollision(cd.enemyStackRef.enemyStack[f].pos, cd.enemyStackRef.enemyStack[f]._collisionRadius);
      }
    }

    if(!cd.playerRef.teleporting && cd.playerRef.canTeleport)
    {
      l1:
      for(var i = 0; i < bh.linkedHoles.length; ++i)
      {
        for(var k = 0; k < bh.linkedHoles[i].length; ++k)
        {
          if(getDist(cd.playerRef.pos,bh.allHoles[bh.linkedHoles[i][k]].pos)[2] - cd.playerRef._collisionRadius - bh.allHoles[bh.linkedHoles[i][k]].collisionRadius < 0)
          {
            var ind = (k == bh.linkedHoles[i].length - 1) ? ind = 0 : ind = k+1;
            cd.playerRef.initGhosts(bh.allHoles[bh.linkedHoles[i][k]].pos, bh.allHoles[bh.linkedHoles[i][ind]].pos, bh.allHoles[bh.linkedHoles[i][ind]].collisionRadius);
            break l1;
          }
        }
      }
    }

  }

	cd.checkBorderCollision = function(positions, radius)
	{
		var returnValues = positions;
		//x
		if((positions[0] - radius) < c.width*0)
		{
			returnValues[0] = c.width*0 + radius;
		}
		else if(positions[0] + radius > c.width*1.0)
		{
			returnValues[0] = c.width*1.0 - radius;
		}
		//y
		if(positions[1] - radius < c.height*0)
		{
			returnValues[1] = c.height*0 + radius;
		}
		else if(positions[1] + radius > c.height*1.0)
		{
			returnValues[1] = c.height*1.0 - radius;
		}

		return returnValues;
	}

  cd.projectileCollisionCheck = function(rowIndex, colIndex, middleIndex)
  {
    var tr = cd.cellIndexArray[middleIndex][0];
    var tc = cd.cellIndexArray[middleIndex][1];
    for(var g = 0; g < cd.AA[tr][tc].members[1].length; ++g)
    {
      for(var j = 0; j < cd.AA[rowIndex][colIndex].members[0].length; ++j)
      {
        if(cd.AA[tr][tc].members[1][g] < cd.projectileRef.skott.length)
        {
          //DEBUGG
          if(!cd.projectileRef.skott[cd.AA[tr][tc].members[1][g]])
          {
            console.log("PROJ");
            console.log(cd.AA[tr][tc]);
          }
          //DEBUGG
          if(!cd.enemyStackRef.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]].pos)
          {
            console.log("ENEMY");
          }
          var dist = getDist(cd.projectileRef.skott[cd.AA[tr][tc].members[1][g]].pos, cd.enemyStackRef.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]].pos);
          var rad1 = cd.projectileRef.skott[cd.AA[tr][tc].members[1][g]].radius;
          var rad2 = cd.enemyStackRef.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]]._collisionRadius;
          if(dist[2] - rad1 - rad2 < 0)
          {
            //Removes health from enemy if types matches
            if(cd.enemyStackRef.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]]._type ==  cd.projectileRef.skott[cd.AA[tr][tc].members[1][g]]._type)
            {
              --cd.enemyStackRef.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]].health;
            }

            //Deletes enemy if it's dead.
            if(cd.enemyStackRef.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]].health < 1)
            {
              //Handles death animations
              cd.deathRowRef.enemyRow.push(new deadEnemy(cd.deathRowRef));
              cd.deathRowRef.enemyRow[cd.deathRowRef.enemyRow.length - 1].init(cd.enemyStackRef.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]].pos, cd.enemyStackRef.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]]._size, cd.enemyStackRef.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]].angle, cd.enemyStackRef.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]]._color);

              //Removes enemy from cd.enemyStackRef.enemyStack[]
              cd.enemyStackRef.enemyStack.splice(cd.AA[rowIndex][colIndex].members[0][j],1);

              if(cd.enemyStackRef.enemyStack.length == 0 && cd.enemyStackRef.maxNumber != 0)
              {
                //all enemies are dead and new enemies are spawned
                hud.countdown(function()
                {
                  respawnEnemies();
                });
              }

              //Adjusts the index in the array in the cell
              cd.adjustEnemyIndex(cd.AA[rowIndex][colIndex].members[0][j]);

              //Removes enemy from Cell
              cd.AA[rowIndex][colIndex].members[0].splice(j,1);
            }

              //Removes from game projectiles when they hit an enemy
              cd.projectileRef.skott.splice(cd.AA[tr][tc].members[1][g],1);

              cd.adjustProjectileIndex(cd.AA[tr][tc].members[1][g]);

              //Removes projectile form CELL when it hits an enemy.
              cd.AA[tr][tc].members[1].splice(g,1);

              //compensates the iterator in the for-loop for displacement of elemnts in the array
              --g;
              break;
          }
        }
      }
    }
  }

  cd.adjustEnemyIndex = function(index)
  {
    for(var i = 0; i < cd.cellIndexArray.length; ++i)
    {
      for(var h = 0; h < cd.AA[cd.cellIndexArray[i][0]][cd.cellIndexArray[i][1]].members[0].length; ++h)
      {
        if(cd.AA[cd.cellIndexArray[i][0]][cd.cellIndexArray[i][1]].members[0][h] > index)
        {
          --cd.AA[cd.cellIndexArray[i][0]][cd.cellIndexArray[i][1]].members[0][h];
        }
      }
    }
  }

  cd.adjustProjectileIndex = function(index)
  {
    for(var i = 0; i < cd.cellIndexArray.length; ++i)
    {
      for(var h = 0; h < cd.AA[cd.cellIndexArray[i][0]][cd.cellIndexArray[i][1]].members[1].length; ++h)
      {
        if(cd.AA[cd.cellIndexArray[i][0]][cd.cellIndexArray[i][1]].members[1][h] > index)
        {
          --cd.AA[cd.cellIndexArray[i][0]][cd.cellIndexArray[i][1]].members[1][h];
        }
      }
    }
  }



	cd.enemyCollisionCheck = function(q,d,i)
	{
	  //tempRow/col is current enemy position
	  var tempRow = cd.cellIndexArray[i][0];
	  var tempCol = cd.cellIndexArray[i][1];

    //This if-statement is the savior of this script
	  if(cd.AA[q] && cd.AA[q][d] && cd.AA[q][d].members[0].length > 0)
	  {
  		for(var s  = 0; s < cd.AA[tempRow][tempCol].members[0].length; ++s)
  		{
  		  for(var h = 0; h < cd.AA[q][d].members[0].length; ++h)
  		  {
          var dist = getDist(cd.enemyStackRef.enemyStack[cd.AA[tempRow][tempCol].members[0][s]].pos, cd.enemyStackRef.enemyStack[cd.AA[q][d].members[0][h]].pos);
          var rad1 = cd.enemyStackRef.enemyStack[cd.AA[tempRow][tempCol].members[0][s]]._collisionRadius;
          var rad2 = cd.enemyStackRef.enemyStack[cd.AA[q][d].members[0][h]]._collisionRadius;
    			if(dist[2] > 0 && (dist[2] - rad1 - rad2) < 0)
    			{
    			  var newAngle = getAngle(cd.enemyStackRef.enemyStack[cd.AA[tempRow][tempCol].members[0][s]].pos, cd.enemyStackRef.enemyStack[cd.AA[q][d].members[0][h]].pos);
    			  var moveDist = Math.abs(dist[2] - rad1 -rad2);
    			  var smallPercent;
    			  var deltaPercent;
    			  //THIS IS UGLY AS FUUCK
    			  if(cd.enemyStackRef.enemyStack[cd.AA[q][d].members[0][h]]._size >=cd.enemyStackRef.enemyStack[cd.AA[tempRow][tempCol].members[0][s]]._size)
    			  {
    				smallPercent = cd.enemyStackRef.enemyStack[cd.AA[tempRow][tempCol].members[0][s]]._size/cd.enemyStackRef.enemyStack[cd.AA[q][d].members[0][h]]._size;
    				deltaPercent = 1 - smallPercent;
    				cd.enemyStackRef.enemyStack[cd.AA[q][d].members[0][h]].pos[0] += (Math.cos(newAngle)*-moveDist * smallPercent * (1/cd.iterations));
    				cd.enemyStackRef.enemyStack[cd.AA[q][d].members[0][h]].pos[1] += (Math.sin(newAngle)*moveDist * smallPercent * (1/cd.iterations));
    				cd.enemyStackRef.enemyStack[cd.AA[tempRow][tempCol].members[0][s]].pos[0] += (Math.cos(newAngle)*moveDist * deltaPercent * (1/cd.iterations));
    				cd.enemyStackRef.enemyStack[cd.AA[tempRow][tempCol].members[0][s]].pos[1] += (Math.sin(newAngle)*-moveDist * deltaPercent * (1/cd.iterations));
    			  }
    			  else
    			  {
    				smallPercent = cd.enemyStackRef.enemyStack[cd.AA[q][d].members[0][h]]._size/cd.enemyStackRef.enemyStack[cd.AA[tempRow][tempCol].members[0][s]]._size;
    				deltaPercent = 1 - smallPercent;
    				cd.enemyStackRef.enemyStack[cd.AA[q][d].members[0][h]].pos[0] += (Math.cos(newAngle)*-moveDist * deltaPercent * (1/cd.iterations));
    				cd.enemyStackRef.enemyStack[cd.AA[q][d].members[0][h]].pos[1] += (Math.sin(newAngle)*moveDist * deltaPercent * (1/cd.iterations));
    				cd.enemyStackRef.enemyStack[cd.AA[tempRow][tempCol].members[0][s]].pos[0] += (Math.cos(newAngle)*moveDist * smallPercent * (1/cd.iterations));
    				cd.enemyStackRef.enemyStack[cd.AA[tempRow][tempCol].members[0][s]].pos[1] += (Math.sin(newAngle)*-moveDist * smallPercent * (1/cd.iterations));
    			  }
    			  cd.enemyStackRef.enemyStack[cd.AA[q][d].members[0][h]].angle = getAngle(cd.enemyStackRef.enemyStack[cd.AA[q][d].members[0][h]].pos, cd.playerRef.pos);
    			  cd.enemyStackRef.enemyStack[cd.AA[tempRow][tempCol].members[0][s]].angle = getAngle(cd.enemyStackRef.enemyStack[cd.AA[tempRow][tempCol].members[0][s]].pos, cd.playerRef.pos);
    			}
  		  }
  		}
	  }
    else if(!cd.AA[q] && !cd.AA[q][d])
    {
      //DEBUGG
      console.log(cd.AA[q][d]);
    }
	}

  cd.checkProjectileBorderCollision = function(projektil)
  {
    //x
    if((projektil.pos[0] - projektil.radius) < 0)
    {
      return false;
    }
    else if(projektil.pos[0] + projektil.radius > c.width)
    {
      return false;
    }
    //y
    if(projektil.pos[1] - projektil.radius < 0)
    {
      return false;
    }
    else if(projektil.pos[1] + projektil.radius > c.height)
    {
      return false;
    }

    return true;
  }
}



function cell(inx, iny, indx, indy)
{
	const t = this;

	t.x = inx;
	t.dx = indx;
	t.y = iny;
	t.dy = indy;

  //holds the index in the enemyStack
	t.members = new Array(2); //[enemies, projectiles]
	for(var q = 0; q < t.members.length; ++q)
	{
		t.members[q] = new Array(0);
	}
}
