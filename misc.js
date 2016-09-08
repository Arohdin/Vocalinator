function drawCrosshair()
{
  //DRAW CROSSHAIR
  ctx.fillStyle = "#e74c3c";
  ctx.beginPath();
  ctx.arc(mousePos.x, mousePos.y, 4, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.fill();
}

function drawLineBetween(A, B, lineColor)
{
  ctx.strokeStyle = lineColor;
  ctx.beginPath();
  ctx.moveTo(A[0], A[1]);
  ctx.lineTo(B[0], B[1]);
  ctx.lineWidth = 0.25;
  ctx.stroke();
  ctx.closePath();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getAngle(obj1, obj2) //from 1 to 2
{
  var dist = getDist(obj1, obj2);
  var angle = Math.acos(dist[0]/dist[2]);
  if(obj1[1] < obj2[1])
  {
    return angle *= 1;
  }
  return -1*angle;
}

function getDist(A, B) //between A and B
{
  var a = A[0] - B[0];
  var b = A[1] - B[1];
  var c = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
  return [a, b, c] //[närliggande, motstående, hyp]
}
