  
 
  navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);


window.AudioContext = window.AudioContext ||
                      window.webkitAudioContext;

var context = new AudioContext();
 var analyzer = context.createAnalyser();
 analyzer.fftSize = 512;
 var amplitudeArray = new Uint8Array(analyzer.frequencyBinCount);

var sampleRate= context.sampleRate;
var frequencyArray= new Float32Array(analyzer.frequencyBinCount);

for(var i =0; i<analyzer.frequencyBinCount; ++i)
{
	frequencyArray[i]= i*(sampleRate/analyzer.fftSize)
}

 var volumeNode = context.createGain();
 volumeNode.gain.value = 0.0;

  var errorCallback = function(e) {
    console.log('Reeeejected!', e);
  };

navigator.getUserMedia({audio: true}, function(stream) {
 microphone = context.createMediaStreamSource(stream);

  microphone.connect(analyzer);
  analyzer.connect(volumeNode);
  volumeNode.connect(context.destination);
}, errorCallback);

setInterval(function(){
	analyzer.getByteFrequencyData(amplitudeArray);
	drawBasic()}, 33);



google.charts.load('current', {packages: ['corechart', 'line']});

function drawBasic() {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'Dogs');

      for(var i =0;i<analyzer.frequencyBinCount;++i)
      {
      	data.addRow([frequencyArray[i],amplitudeArray[i]]);
      }

      var options = {
        hAxis: {
          title: 'Frequency'
        },
        vAxis: {
          title: 'Amplitude',
              viewWindow:{
                max:300,
                min:0.0
              }
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

      chart.draw(data, options);
    }



