function drawCrosshair()
{
  //DRAW CROSSHAIR
  ctx.beginPath();
  ctx.arc(mousePos.x, mousePos.y, 4, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.fill();
}

function drawAimLine()
{
  var playerPos = pl.getPosition();
  ctx.beginPath();
  ctx.moveTo(playerPos[0], playerPos[1]);
  ctx.lineTo(mousePos.x, mousePos.y);
  ctx.lineWidth = 0.25;
  ctx.stroke();
  ctx.closePath();
}
