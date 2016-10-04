//Draw a line between two objects.
function drawLineBetween(A, B, lineColor, thickness) //arg: (positions1[x,y], positions2[x,y], RGBA-color, thickness of the line)
{
  ctx.strokeStyle = lineColor;
  ctx.beginPath();
  ctx.moveTo(A[0], A[1]);
  ctx.lineTo(B[0], B[1]);
  ctx.lineWidth = thickness;
  ctx.stroke();
  ctx.closePath();
}

//Generates a random int from min to max (including min and max)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//calculates the angle ( -pi to pi )
function getAngle(obj1, obj2) //angle between obj1 and obj2
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
  return [a, b, c] //[närliggande, motstående, hypotinusa]
}

function generateCollisionMesh(A)
{
  return (A/2) + ((Math.sqrt(Math.pow(A/2,2) + Math.pow(A/2,2)) - (A/2))/2);
}

function drawCollisionMesh(rad, pos, color)
{
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(pos[0], pos[1], rad, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.lineWidth = 2;
  ctx.stroke();
}

function normalize(inArr)
{
  var length = getDist([0,0], inArr)[2];
  inArr[0] = inArr[0]/length;
  inArr[1] = inArr[1]/length;

  return inArr;
}
