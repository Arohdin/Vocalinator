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
		  cd.AA[rowIndex][colIndex].members[0].push(i);
		  cd.cellIndexArray.push([rowIndex,colIndex]);
		}
		//console.log([cd.cellIndexArray[0][0], cd.cellIndexArray[0][1]])
		
		//
		
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
		if((positions[0] - radius) < 0)
		{
			returnValues[0] = radius;
		}
		else if(positions[0] + radius > c.width)
		{
			returnValues[0] = c.width - radius;
		}
		//y
		if(positions[1] - radius < 0)
		{
			returnValues[1] = radius;
		}
		else if(positions[1] + radius > c.height)
		{
			returnValues[1] = c.height - radius;
		}
		
		return returnValues;
	}
  
	
	cd.enemyCollisionCheck = function(q,d,i)
	{
	  //tempRow/col is current enemy position
	  var tempRow = cd.cellIndexArray[i][0];
	  var tempCol = cd.cellIndexArray[i][1];
	  var tempAA = cd.AA[tempRow][tempCol];
	  //current cell we're checking (around tempAA)
	  var currAA = cd.AA[q][d];

	  if(currAA.members[0].length > 0)
	  {
		for(var s  = 0; s < tempAA.members[0].length; ++s)
		{
		  for(var h = 0; h < currAA.members[0].length; ++h)
		  {
			var dist = getDist(en.enemyStack[tempAA.members[0][s]].pos, en.enemyStack[currAA.members[0][h]].pos);
			var rad1 = en.enemyStack[tempAA.members[0][s]]._collisionRadius;
			var rad2 = en.enemyStack[currAA.members[0][h]]._collisionRadius;
			if(dist[2] > 0 && (dist[2] - rad1 - rad2) < 0)
			{
			  var newAngle = getAngle(en.enemyStack[tempAA.members[0][s]].pos, en.enemyStack[currAA.members[0][h]].pos);
			  var moveDist = Math.abs(dist[2] - rad1 -rad2);
			  var smallPercent;
			  var deltaPercent;
			  //THIS IS UGLY AS FUUCK
			  if(en.enemyStack[currAA.members[0][h]]._size >=en.enemyStack[tempAA.members[0][s]]._size)
			  {
				smallPercent = en.enemyStack[tempAA.members[0][s]]._size/en.enemyStack[currAA.members[0][h]]._size;
				deltaPercent = 1 - smallPercent;
				en.enemyStack[currAA.members[0][h]].pos[0] += (Math.cos(newAngle)*-moveDist * smallPercent);
				en.enemyStack[currAA.members[0][h]].pos[1] += (Math.sin(newAngle)*moveDist * smallPercent);
				en.enemyStack[tempAA.members[0][s]].pos[0] += (Math.cos(newAngle)*moveDist * deltaPercent);
				en.enemyStack[tempAA.members[0][s]].pos[1] += (Math.sin(newAngle)*-moveDist * deltaPercent);
			  }
			  else
			  {
				smallPercent = en.enemyStack[currAA.members[0][h]]._size/en.enemyStack[tempAA.members[0][s]]._size;
				deltaPercent = 1 - smallPercent;
				en.enemyStack[currAA.members[0][h]].pos[0] += (Math.cos(newAngle)*-moveDist * deltaPercent);
				en.enemyStack[currAA.members[0][h]].pos[1] += (Math.sin(newAngle)*moveDist * deltaPercent);
				en.enemyStack[tempAA.members[0][s]].pos[0] += (Math.cos(newAngle)*moveDist * smallPercent);
				en.enemyStack[tempAA.members[0][s]].pos[1] += (Math.sin(newAngle)*-moveDist * smallPercent);
			  }
			  en.enemyStack[currAA.members[0][h]].angle = getAngle(en.enemyStack[currAA.members[0][h]].pos, pl.pos);
			  en.enemyStack[tempAA.members[0][s]].angle = getAngle(en.enemyStack[tempAA.members[0][s]].pos, pl.pos);
			}			
		  }
		}
	  }
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
