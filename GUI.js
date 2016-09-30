const TOP_LEFT=0, TOP_RIGHT=1, MIDDLE=2, BOTTOM_LEFT=3,BOTTOM_RIGHT=4;
function GUI()
{
  const g=this;
  /*  Messages structure
  0         1
       2
  3         4
  */
  g.notEmptyMessages =[];
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
      g.positions[0][0]=g.positions[3][0]=c.width*0.1;
      g.positions[1][0]=g.positions[4][0]=c.width*0.9;
      g.positions[2][0]=c.width/2;
      g.positions[2][1]=c.height/2;
      g.positions[0][1]=g.positions[1][1]=c.height*0.05;
      g.positions[3][1]=g.positions[4][1]=c.height*0.95;
  }

  g.setMessage =function(msg, time, index)
  {

    //clear interval if it's in use
    if(g.timeouts[index])
    clearTimeout(g.timeouts[index]);

    var milliTime=time*1000;
    g.notEmptyMessages.push(index);
    g.messages[index]=msg;
    g.timeouts[index]=setTimeout(function()
    {
      g.messages[index]="";
    }, milliTime);
  }

  g.draw=function()
  {
    ctx.fillStyle = "#27ae60";
    for(var j=0;j<g.notEmptyMessages.length;++j)
    {
      var i=g.notEmptyMessages[j];

      ctx.fillText(g.messages[i], g.positions[i][0], g.positions[i][1]);
    }
  }

}
