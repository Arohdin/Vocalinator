

navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
window.AudioContext = window.AudioContext || window.webkitAudioContext;


//Google charts thingy
google.charts.load('current', {packages: ['corechart', 'line']});

//Web audio API variables
var context = new AudioContext();
var analyzer = context.createAnalyser();
analyzer.fftSize = 16384;
var amplitudeArray = new Uint8Array(analyzer.frequencyBinCount);
var pitchArray = [];
var frequencyArray= [];
var sampleRate= context.sampleRate;
var volumeNode = context.createGain();
volumeNode.gain.value = 0.0;
var errorCallback = function(e) {console.log('Mic error!', e);};

navigator.getUserMedia({audio: true}, function(stream)
{
  microphone = context.createMediaStreamSource(stream);
  microphone.connect(analyzer);
  analyzer.connect(volumeNode);
  volumeNode.connect(context.destination);
}, errorCallback);

//calculate frequencies based om sample rate
for(var i =0; i<analyzer.frequencyBinCount; ++i)
{
	frequencyArray[i]= i*(sampleRate/analyzer.fftSize)
}

setInterval(function(){
	analyzer.getByteFrequencyData(amplitudeArray);
  var max= 0.0;
  var maxIndex=0;

  //Use algorithm to "amplify" the percieved frequency
  for(var i =0; 5*i < Math.floor(analyzer.frequencyBinCount/5); ++i)
  {
    pitchArray[i]=Math.pow(10.0, -12.0)*Math.pow(10.0, (amplitudeArray[i]+amplitudeArray[2*i]+amplitudeArray[3*i]+amplitudeArray[4*i]+amplitudeArray[5*i])/10.0);
    //pitchArray[i]=amplitudeArray[i]*amplitudeArray[2*i]*amplitudeArray[3*i]*amplitudeArray[4*i]*amplitudeArray[5*i];

    //identify frequency with highest amplitude
    if(pitchArray[i]>max)
    {
      max=pitchArray[i];
      maxIndex=i;
    }
  }
  //Log frequency with highest amplitude
  console.log(frequencyArray[maxIndex] + " with index " + maxIndex);
	drawBasic()}, 33);

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
