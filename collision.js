function collisionDetection()
{
  const cd = this;

  cd.numCols = 10;
  cd.numRows = 10;
  cd.cellWidth;
  cd.cellHeight;
  cd.AA;

  cd.generateGrid = function()
  {
    cd.cellWidth = c.width / cd.numCols;
    cd.cellHeight = c.height / cd.numRows;

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
        cd.AA[i][q] = new genBox(q*cd.cellWidth, i*cd.cellHeight, cd.cellWidth, cd.cellHeight);
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

}


function genBox(inx, iny, indx, indy)
{
  this.x = inx;
  this.dx = indx;
  this.y = iny;
  this.dy = indy;
}
