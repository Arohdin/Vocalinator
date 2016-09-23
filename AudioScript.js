

navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
window.AudioContext = window.AudioContext || window.webkitAudioContext;


//Google charts thingy
google.charts.load('current', {packages: ['corechart', 'line']});

//Web audio API variables
var context = new AudioContext();
var analyzer = context.createAnalyser();
analyzer.fftSize = 8192;
var amplitudeArray = new Uint8Array(analyzer.frequencyBinCount);
var pitchArray = [];
var frequencyArray= [];
var sampleRate= context.sampleRate;
var volumeNode = context.createGain();
volumeNode.gain.value = 0.0;
var errorCallback = function(e) {console.log('Mic error!', e);};
var high =400, low=200, step =((high-low)/3.0), picth, projectileType;
const LOW=0, MEDIUM=1, HIGH=2, NOTLOUD=-1;

navigator.getUserMedia({audio: true}, function(stream)
{
  microphone = context.createMediaStreamSource(stream);
  microphone.connect(analyzer);
  analyzer.connect(volumeNode);
  volumeNode.connect(context.destination); //play mic sound
}, errorCallback);

//calculate frequencies based om sample rate
for(var i =0; i<analyzer.frequencyBinCount; ++i)
{
	frequencyArray[i]= i*(sampleRate/analyzer.fftSize)
}

setInterval(function() {
  pitch=getPitch();
  if((pitch!=NOTLOUD) && (high>low))
  {
    if(pitch > high-step) //High
    {
      console.log("High");
      projectileType=HIGH;
    }
    else if((pitch > low + step) && pitch < high-step) // Medium
    {
      console.log("Medium");
      projectileType=MEDIUM;
    }
    else //Low
    {
      console.log("Low");
      projectileType=LOW;
    }
  }
  //drawBasic();
}, 33);

//Draw graph
function drawBasic()
{
  var data = new google.visualization.DataTable();
  data.addColumn('number', 'X');
  data.addColumn('number', 'Dogs');
  for(var i =0;i<Math.floor(analyzer.frequencyBinCount/5);++i)
  {
  	data.addRow([frequencyArray[i],pitchArray[i]]);
  }
  var options =
  {
    hAxis: {title: 'Frequency'},
    vAxis: {title: 'Amplitude'}
  };
  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}


function getPitch()
{
  analyzer.getByteFrequencyData(amplitudeArray);
  var max= 0.0;
  var maxIndex=0;

  //Use algorithm to "amplify" the percieved frequency
  for(var i =0; 5*i < Math.floor(analyzer.frequencyBinCount/5); ++i)
  {
    pitchArray[i]=Math.pow(10.0, -12.0)*Math.pow(10.0, (amplitudeArray[i]+amplitudeArray[2*i]+amplitudeArray[3*i]+amplitudeArray[4*i]+amplitudeArray[5*i])/10.0);
    //identify frequency with highest amplitude
    if(pitchArray[i]>max)
    {
      max=pitchArray[i];
      maxIndex=i;
    }
  }
  if(max< Math.pow(10.0,25.0))
  return NOTLOUD;
  /*
  if(max < Math.pow(10.0,6.0))
  {
    return -1;
  }
  */
  //Log frequency with highest amplitude
  //console.log(frequencyArray[maxIndex] + " with index " + maxIndex);
  return frequencyArray[maxIndex];
}

function setHigh()
{
  high=pitch;
}

function setLow()
{
  low=pitch;
}

function setStep()
{
  step=(high-low)/3;
}
