

navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
window.AudioContext = window.AudioContext || window.webkitAudioContext;


//Google charts thingy
google.charts.load('current', {packages: ['corechart', 'line']});

//Web audio API variables
var context = new AudioContext();
var analyzer = context.createAnalyser();
analyzer.fftSize = 8192;
var amplitudeArray = new Float32Array(analyzer.frequencyBinCount);
var pitchArray = [];
var frequencyArray= [];
var sampleRate= context.sampleRate;
var volumeNode = context.createGain();
volumeNode.gain.value = 0.0;
var errorCallback = function(e) {console.log('Mic error!', e);};
var high =400, low=200, step =((high-low)/3.0), picth, projectileType;
const LOW=0, MEDIUM=1, HIGH=2, NOTLOUD=-1;
var dBThreshold=-55;

navigator.getUserMedia({audio: true}, function(stream)
{
  microphone = context.createMediaStreamSource(stream);
  microphone.connect(analyzer);
}, errorCallback);

//calculate frequencies based om sample rate
for(var i =0; i<analyzer.frequencyBinCount; ++i)
{
	frequencyArray[i]= i*(sampleRate/analyzer.fftSize)
}

//The code within setInterval is repeated every 33rd millisecond
setInterval(function() {
  pitch=getPitch();

  //validate pitch and calibration-pitch
  if((pitch!=NOTLOUD) && (high>low))
  {
    //determine pitch type
    if(pitch > high-step) //High
    {
      projectileType=HIGH;
    }
    else if((pitch > low + step) && pitch < high-step) // Medium
    {
      projectileType=MEDIUM;
    }
    else //Low
    {
      projectileType=LOW;
    }
  }
  //drawBasic();
}, 33);

//Draw graph (used for debugging)
function drawBasic()
{
  var data = new google.visualization.DataTable();
  data.addColumn('number', 'X');
  data.addColumn('number', 'Dogs');
  for(var i =0;i<Math.floor(analyzer.frequencyBinCount);++i)
  {
  	data.addRow([frequencyArray[i],amplitudeArray[i]]);
  }
  var options =
  {
    hAxis: {title: 'Frequency'},
    vAxis: {title: 'Amplitude'}
  };
  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}


//
function getPitch()
{

  analyzer.getFloatFrequencyData(amplitudeArray); //get frequency-data
  var max= -300;
  var maxIndex=0;

  for(var i=0;i<amplitudeArray.length;++i)
  {
    //identify highest amplitude
    if(amplitudeArray[i]>max)
    max=amplitudeArray[i]
  }

  //The sound isn't loud enoguh, exit function
  if(max<dBThreshold)
  return NOTLOUD;


  max=0.0;


  //Use algorithm to "amplify" the percieved frequency
  for(var i =0; 5*i < Math.floor(analyzer.frequencyBinCount/5); ++i)
  {
    //multiply the spectras with (1/n) times the length of the original (n = 1-5) with each other
    pitchArray[i]=Math.pow(10.0, (amplitudeArray[i]+amplitudeArray[2*i]+amplitudeArray[3*i]+amplitudeArray[4*i]+amplitudeArray[5*i])/10.0);

    //identify frequency with highest amplitude
    if(pitchArray[i]>max)
    {
      max=pitchArray[i];
      maxIndex=i; // saves index
    }
  }

  return frequencyArray[maxIndex]; // uses maxindex to determine pitch
}

function setHigh()
{
  var temp=pitch;

  if(temp==NOTLOUD)
  {
    hud.setTimedMessage("Louder!", TOP_RIGHT, 2);
    return;
  }
  else if(temp <low)
  {
    hud.setTimedMessage("Sing higher than low", TOP_RIGHT, 2);
    return;
  }
  high=temp;
  hud.setTimedMessage("High set to " + Math.floor(high), TOP_RIGHT, 2);
  setStep();
}

function setLow()
{
  var temp=pitch;
  if(temp==NOTLOUD)
  {
    hud.setTimedMessage("Louder!", TOP_RIGHT, 2);
    return;
  }
  else if(temp >high)
  {
    hud.setTimedMessage("Sing lower than high", TOP_RIGHT, 2);
    return;
  }
  low=temp;
  hud.setTimedMessage("Low set to " + Math.floor(low), TOP_RIGHT, 2);
  setStep();
}

function setStep()
{
  step=(high-low)/3;
}
