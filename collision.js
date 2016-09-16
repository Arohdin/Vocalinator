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
	  for(var i = 0; i < en.enemyStack.length; ++i)
	  {
		  var posX = en.enemyStack[i].pos[0];
		  var posY = en.enemyStack[i].pos[1];
		  var colIndex = 1 + Math.floor(posX/cd.cellWidth);
		  var rowIndex = 1 + Math.floor(posY/cd.cellHeight);
		  cd.AA[rowIndex][colIndex].members.push(i);
		  //console.log(cd.AA[rowIndex][colIndex].members);
		  //console.log([rowIndex,colIndex]);
		  cd.cellIndexArray.push([rowIndex,colIndex]);
	  }
		//console.log([cd.cellIndexArray[0][0], cd.cellIndexArray[0][1]])
  }

  cd.updateCells = function()
  {
	  //flushing
	  for(var q = 0; q < cd.cellIndexArray.length; q++)
	  {
		  cd.AA[cd.cellIndexArray[q][0]][cd.cellIndexArray[q][1]].members.length = 0;
	  }
	  cd.cellIndexArray.length = 0;

	  //Init again
	  cd.init();
  }

  cd.calculateCollision = function()
  {
    for(var i = 0; i < cd.cellIndexArray.length; ++i)
    {
      for(var q = cd.cellIndexArray[i][0] - 1; q <= cd.cellIndexArray[i][0] + 1; q++)
      {
        for(var d = cd.cellIndexArray[i][1] - 1; d <= cd.cellIndexArray[i][1] + 1; ++d)
        {
          //tempRow/col is current enemy position
          var tempRow = cd.cellIndexArray[i][0];
          var tempCol = cd.cellIndexArray[i][1];
          var tempAA = cd.AA[tempRow][tempCol];
          //current cell we're checking (around tempAA)
          var currAA = cd.AA[q][d];

          if(currAA.members.length > 0)
          {
            for(var s  = 0; s < tempAA.members.length; ++s)
            {
              for(var h = 0; h < currAA.members.length; ++h)
              {
                var dist = getDist(en.enemyStack[tempAA.members[s]].pos, en.enemyStack[currAA.members[h]].pos);
                var rad1 = en.enemyStack[tempAA.members[s]]._collisionRadius;
                var rad2 = en.enemyStack[currAA.members[h]]._collisionRadius;
                if(dist[2] > 0 && (dist[2] - rad1 - rad2) < 0)
                {
                  //console.log("Collision");
                  //timeFactor = 0.0;
                  var newAngle = getAngle(en.enemyStack[tempAA.members[s]].pos, en.enemyStack[currAA.members[h]].pos);
                  var moveDist = Math.abs(dist[2] - rad1 -rad2);
                  en.enemyStack[currAA.members[h]].pos[0] += (Math.cos(newAngle)*-moveDist);
                  en.enemyStack[currAA.members[h]].pos[1] += (Math.sin(newAngle)*moveDist);
                }
              }
            }
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
	t.members = [];
}
