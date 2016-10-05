const TOP_LEFT=0, TOP_RIGHT=1, MIDDLE=2, BOTTOM_LEFT=3,BOTTOM_RIGHT=4;

function Mesage()
{
  const m=this;
  m.msg;
}
function HUD()
{
  const g=this;
  /*  Messages structure
  0         1
       2
  3         4
  */
  g.messages = [];
  g.positions;
  g.timeouts=[];

  g.init=function()
  {
      g.messages = ["","","","",""];

      g.positions=new Array(5);
      for(var i=0; i<5; ++i)
      {
        g.positions[i]=new Array(2);
      }
      g.resize();

  }

  g.resize=function()
  {
    g.positions[0][0]=g.positions[3][0]=c.width*0.1;
    g.positions[1][0]=g.positions[4][0]=c.width*0.9;
    g.positions[2][0]=c.width/2;
    g.positions[2][1]=c.height/2;
    g.positions[0][1]=g.positions[1][1]=c.height*0.05;
    g.positions[3][1]=g.positions[4][1]=c.height*0.95;
  }

  g.setTimedMessage =function(msg, index,time)
  {
    g.setMessage(msg, index);

    var milliTime=time*1000;
    g.timeouts[index]=setTimeout(function()
    {
      g.messages[index]="";
    }, milliTime);
  }

  g.setMessage=function(msg,index)
  {
    g.clearMessage(index);
    g.messages[index]=msg;
  }



  g.draw=function()
  {
    ctx.fillStyle = "#ecf0f1";
    ctx.font= "56px Roboto";
    for(var i=0; i<g.messages.length;++i)
    {
      if(g.messages[i]!="")
      ctx.fillText(g.messages[i], g.positions[i][0], g.positions[i][1]);
    }
  }

  g.clearMessage= function(index)
  {

    //clear interval if it's in use
    if(g.timeouts[index])
    clearTimeout(g.timeouts[index]);

    g.messages[index]="";

  }
  g.countdown=function(callback)
  {
    g.setMessage("3", MIDDLE);
    setTimeout(function()
    {
      g.setMessage("2", MIDDLE);
      setTimeout(function()
      {
        g.setMessage("1",MIDDLE);
        setTimeout(function()
        {
          g.clearMessage(MIDDLE);
          callback();
        },1000);
      },1000);
    },1000);
  }

  g.drawHeart=function() {

    ctx.fillStyle="#EF4836";
    ctx.beginPath();
    ctx.moveTo(75,40);
    ctx.bezierCurveTo(75,37,70,25,50,25);
    ctx.bezierCurveTo(20,25,20,62.5,20,62.5);
    ctx.bezierCurveTo(20,80,40,102,75,120);
    ctx.bezierCurveTo(110,102,130,80,130,62.5);
    ctx.bezierCurveTo(130,62.5,130,25,100,25);
    ctx.bezierCurveTo(85,25,75,37,75,40);
    ctx.fill();
}

}
