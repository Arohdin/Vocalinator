function collisionDetection()
{
  const cd = this;

  cd._PAD = 2;
  cd.numCols = 24 + cd._PAD;
  cd.numRows = 13 + cd._PAD;
  cd.cellWidth;
  cd.cellHeight;
  cd.AA;
  cd.cellIndexArray = [];

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
		for(var i = 0; i < en.enemyStack.length; ++i)
		{
		  var posX = en.enemyStack[i].pos[0];
		  var posY = en.enemyStack[i].pos[1];
		  var colIndex = 1 + Math.floor(posX/cd.cellWidth);
		  var rowIndex = 1 + Math.floor(posY/cd.cellHeight);
      //if(cd.AA[rowIndex][colIndex].members[0].length < 1 && cd.AA[rowIndex][colIndex].members[1].length < 1)
      //{
        cd.cellIndexArray.push([rowIndex,colIndex]);
      //}
      cd.AA[rowIndex][colIndex].members[0].push(i);
		}

    for(var u = 0; u < proj.skott.length; ++u)
    {
      var pX = proj.skott[u].pos[0];
      var pY = proj.skott[u].pos[1];
      var cIndex = 1 + Math.floor(pX/cd.cellWidth);
      var rIndex = 1 + Math.floor(pY/cd.cellHeight);
      //if(cd.AA[rIndex][cIndex].members[0].length < 1 && cd.AA[rIndex][cIndex].members[1].length < 1)
      //{
        cd.cellIndexArray.push([rIndex,cIndex]);
      //}
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
        for(var h = 0; h < cd.AA[cd.cellIndexArray[q][0]][cd.cellIndexArray[q][1]].members[s].length; ++h)
        {
          cd.AA[cd.cellIndexArray[q][0]][cd.cellIndexArray[q][1]].members[s][h].length = 0;
        }
        cd.AA[cd.cellIndexArray[q][0]][cd.cellIndexArray[q][1]].members[s].length = 0;
			}
	  }
	  cd.cellIndexArray.length = 0;

	  //Init again
	  cd.init();
  }

  cd.calculateCollision = function()
  {
	  //Check collision with screen border (also moves if outside the boundries)
	  pl.pos = cd.checkBorderCollision(pl.pos, pl._collisionRadius)

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

  	for(var f = 0; f < en.enemyStack.length; ++f)
  	{
  		var dist = getDist(pl.pos,en.enemyStack[f].pos);
  		if((dist[2] - pl._collisionRadius - en.enemyStack[f]._collisionRadius) < 0)
  		{
  			var deltaDist = Math.abs(dist[2] - pl._collisionRadius - en.enemyStack[f]._collisionRadius);
  			var tempAngle = getAngle(pl.pos, en.enemyStack[f].pos);

  			en.enemyStack[f].pos[0] += Math.cos(tempAngle) * -deltaDist;
  			en.enemyStack[f].pos[1] += Math.sin(tempAngle) * deltaDist;

  			pl._color = "#ff0000";
  		}

  		//Check collision with screen border (also moves if outside the boundries)
  		en.enemyStack[f].pos = cd.checkBorderCollision(en.enemyStack[f].pos, en.enemyStack[f]._collisionRadius);
  	}

  }

	cd.checkBorderCollision = function(positions, radius)
	{
		var returnValues = positions;
		//x
		if((positions[0] - radius) < c.width*0.1)
		{
			returnValues[0] = c.width*0.1 + radius;
		}
		else if(positions[0] + radius > c.width*0.9)
		{
			returnValues[0] = c.width*0.9 - radius;
		}
		//y
		if(positions[1] - radius < c.height*0.05)
		{
			returnValues[1] = c.height*0.05 + radius;
		}
		else if(positions[1] + radius > c.height*0.95)
		{
			returnValues[1] = c.height*0.95 - radius;
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
        if(cd.AA[tr][tc].members[1][g] < proj.skott.length)
        {
          if(!proj.skott[cd.AA[tr][tc].members[1][g]])
          {
            console.log("PROJ");
            console.log(cd.AA[tr][tc]);
          }
          if(!en.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]].pos)
          {
            console.log("ENEMY");
          }
          var dist = getDist(proj.skott[cd.AA[tr][tc].members[1][g]].pos, en.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]].pos);
          var rad1 = proj.skott[cd.AA[tr][tc].members[1][g]].radius;
          var rad2 = en.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]]._collisionRadius;
          if(dist[2] - rad1 - rad2 < 0)
          {
            //Removes health from enemy if types matches
            if(en.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]]._type ==  proj.skott[cd.AA[tr][tc].members[1][g]]._type)
            {
              --en.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]].health;
            }

            //Deletes enemy if it's dead.
            if(en.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]].health < 1)
            {

              deathRow.row.push(new deadEnemy());
              deathRow.row[deathRow.row.length - 1].init(en.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]].pos, en.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]]._size, en.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]].angle, en.enemyStack[cd.AA[rowIndex][colIndex].members[0][j]]._color);

              //Removes enemy from en.enemyStack[]
              if(en.enemyStack.length > 1)
              {
                var newArr = [];
                //Save the enemies that are NOT killed
                if(cd.AA[rowIndex][colIndex].members[0][j] > 0)
                {
                  var parts = [en.enemyStack.slice(0, cd.AA[rowIndex][colIndex].members[0][j])];
                  parts.push((cd.AA[rowIndex][colIndex].members[0][j] < (en.enemyStack.length - 1)) ? en.enemyStack.slice(cd.AA[rowIndex][colIndex].members[0][j] + 1, en.enemyStack.length) : []);
                  newArr = parts[0].concat(parts[1]);
                }
                else
                {
                  newArr = en.enemyStack.slice(1, en.enemyStack.length);
                }

                //empties enemyStack
                en.enemyStack.length = 0;
                //Update the stack with the enemies that are still alive.
                en.enemyStack = newArr;
              }
              else
              {
                en.enemyStack.length = 0;
              }

              cd.adjustEnemyIndex(cd.AA[rowIndex][colIndex].members[0][j]);

              //Removes enemy from Cell
              if(cd.AA[rowIndex][colIndex].members[0].length > 1)
              {
                var newArr = [];
                //save the enemies that are NOT killed
                if(j > 0)
                {
                  var parts = [cd.AA[rowIndex][colIndex].members[0].slice(0,j)];
                  parts.push((j < (cd.AA[rowIndex][colIndex].members[0].length - 1)) ? cd.AA[rowIndex][colIndex].members[0].slice(j + 1, cd.AA[rowIndex][colIndex].members[0].length) : []);
                  newArr = parts[0].concat(parts[1]);
                }
                else
                {
                  newArr = cd.AA[rowIndex][colIndex].members[0].slice(1, cd.AA[rowIndex][colIndex].members[0].length);
                }

                //empties enemies in the cell
                cd.AA[rowIndex][colIndex].members[0].length = 0;
                //update enemies in cell
                cd.AA[rowIndex][colIndex].members[0] = newArr;
              }
              else
              {
                //If there's only one enemy, the cell empties
                cd.AA[rowIndex][colIndex].members[0].length = 0;
              }
            }

            //Removes from game projectiles when they hit an enemy
              if(proj.skott.length > 1)
              {
                var newArr = [];
                //console.log(cd.AA[tr][tc]);
                if(cd.AA[tr][tc].members[1][g] > 0)
                {
                  //Saves the projectiles that DID NOT collide
                  var parts = [proj.skott.slice(0, cd.AA[tr][tc].members[1][g])];
                  parts.push((cd.AA[tr][tc].members[1][g] < (proj.skott.length -1)) ? proj.skott.splice(cd.AA[tr][tc].members[1][g]+1, proj.skott.length) : []);
                  newArr = parts[0].concat(parts[1]);
                }
                else
                {
                  newArr = proj.skott.slice(1,proj.skott.length);
                }
                //Empties the skott array
                proj.skott.length = 0;
                //Update skott with the remaining projectiles
                proj.skott = newArr;
              }
              else
              {
                proj.skott.length = 0;
              }

              cd.adjustProjectileIndex(cd.AA[tr][tc].members[1][g]);

              //Removes projectile form CELL when it hits an enemy.
              if(cd.AA[tr][tc].members[1].length > 1)
              {
                var newArr = [];
                if(g > 0)
                {
                  //Saves the projectiles that DID NOT Collide.
                  var parts = [cd.AA[rowIndex][colIndex].members[1].slice(0,g)];
                  parts.push((g < (cd.AA[rowIndex][colIndex].members[1].length - 1)) ? cd.AA[rowIndex][colIndex].members[1].slice(g+1, cd.AA[rowIndex][colIndex].members[1].length) : []);
                  newArr = parts[0].concat(parts[1]);
                }
                else
                {
                  newArr = cd.AA[rowIndex][colIndex].members[1].slice(1,cd.AA[rowIndex][colIndex].members[1].length);
                }
                //Empties the cell from projectiles
                cd.AA[rowIndex][colIndex].members[1].length = 0;
                //Updates the cell with the remaining projectiles
                cd.AA[rowIndex][colIndex].members[1] = newArr;
              }
              else
              {
                //console.log(cd.AA[rowIndex][colIndex].m(embers[1].length);
                //console.log(cd.AA[rowIndex][colIndex]);
                cd.AA[rowIndex][colIndex].members[1].length = 0;
              }
              //Fixes displacement of elemnts in the array
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

	  if(cd.AA[q][d].members[0].length > 0)
	  {
		for(var s  = 0; s < cd.AA[tempRow][tempCol].members[0].length; ++s)
		{
		  for(var h = 0; h < cd.AA[q][d].members[0].length; ++h)
		  {
        var dist = getDist(en.enemyStack[cd.AA[tempRow][tempCol].members[0][s]].pos, en.enemyStack[cd.AA[q][d].members[0][h]].pos);
        var rad1 = en.enemyStack[cd.AA[tempRow][tempCol].members[0][s]]._collisionRadius;
        var rad2 = en.enemyStack[cd.AA[q][d].members[0][h]]._collisionRadius;
  			if(dist[2] > 0 && (dist[2] - rad1 - rad2) < 0)
  			{
  			  var newAngle = getAngle(en.enemyStack[cd.AA[tempRow][tempCol].members[0][s]].pos, en.enemyStack[cd.AA[q][d].members[0][h]].pos);
  			  var moveDist = Math.abs(dist[2] - rad1 -rad2);
  			  var smallPercent;
  			  var deltaPercent;
  			  //THIS IS UGLY AS FUUCK
  			  if(en.enemyStack[cd.AA[q][d].members[0][h]]._size >=en.enemyStack[cd.AA[tempRow][tempCol].members[0][s]]._size)
  			  {
  				smallPercent = en.enemyStack[cd.AA[tempRow][tempCol].members[0][s]]._size/en.enemyStack[cd.AA[q][d].members[0][h]]._size;
  				deltaPercent = 1 - smallPercent;
  				en.enemyStack[cd.AA[q][d].members[0][h]].pos[0] += (Math.cos(newAngle)*-moveDist * smallPercent);
  				en.enemyStack[cd.AA[q][d].members[0][h]].pos[1] += (Math.sin(newAngle)*moveDist * smallPercent);
  				en.enemyStack[cd.AA[tempRow][tempCol].members[0][s]].pos[0] += (Math.cos(newAngle)*moveDist * deltaPercent);
  				en.enemyStack[cd.AA[tempRow][tempCol].members[0][s]].pos[1] += (Math.sin(newAngle)*-moveDist * deltaPercent);
  			  }
  			  else
  			  {
  				smallPercent = en.enemyStack[cd.AA[q][d].members[0][h]]._size/en.enemyStack[cd.AA[tempRow][tempCol].members[0][s]]._size;
  				deltaPercent = 1 - smallPercent;
  				en.enemyStack[cd.AA[q][d].members[0][h]].pos[0] += (Math.cos(newAngle)*-moveDist * deltaPercent);
  				en.enemyStack[cd.AA[q][d].members[0][h]].pos[1] += (Math.sin(newAngle)*moveDist * deltaPercent);
  				en.enemyStack[cd.AA[tempRow][tempCol].members[0][s]].pos[0] += (Math.cos(newAngle)*moveDist * smallPercent);
  				en.enemyStack[cd.AA[tempRow][tempCol].members[0][s]].pos[1] += (Math.sin(newAngle)*-moveDist * smallPercent);
  			  }
  			  en.enemyStack[cd.AA[q][d].members[0][h]].angle = getAngle(en.enemyStack[cd.AA[q][d].members[0][h]].pos, pl.pos);
  			  en.enemyStack[cd.AA[tempRow][tempCol].members[0][s]].angle = getAngle(en.enemyStack[cd.AA[tempRow][tempCol].members[0][s]].pos, pl.pos);
  			}
		  }
		}
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
