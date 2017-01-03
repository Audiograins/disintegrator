var soundBuffer = null;
var fileToProcess;
var source = null;
var updateIndex = 0;
// Fix up prefixing
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var VolumeSample = {
};
var alreadyClickedPlay = false;
VolumeSample.gNode = null;
 if (!context.createGain)
    context.createGain = context.createGainNode;
VolumeSample.gNode = context.createGain();
//console.log(VolumeSample.gNode);
VolumeSample.distNode = context.createWaveShaper();

function processing(){

document.getElementById('processingNote').innerHTML= "Processing!";
}

function loadSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      soundBuffer = buffer;
    });
  }
  console.log('sound loaded');
  request.send();
}
VolumeSample.changeVolume = function(element) {
  var volume = element.value;
  var fraction = parseInt(element.value) / parseInt(element.max);
  // Lets use an x*x curve (x-squared) since simple linear (x) does not
  // sound as good.
  VolumeSample.gNode.gain.value = fraction * fraction;
  console.log(VolumeSample.gNode);
  console.log(VolumeSample.gNode.gain.value);
};
//var context;
window.addEventListener('load', init, false);
function init() {
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
}

function update(){


VolumeSample.distNode.curve = makeDistortionCurve(updateIndex++);

}
  
function makeDistortionCurve(amount)
 {
 var k = typeof amount === 'number' ? amount : 50,

    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 60 * deg / ( Math.PI + k * Math.abs(x) );
    document.getElementById("Counter").innerHTML = "Distortion Level - " + amount;
  }
  return curve;
};

VolumeSample.playSoundWithDistortion = function(buffer) {
 //  processing();
  if (alreadyClickedPlay)
  	stopSound();
  console.log('called playSoundWithDistortion');
    
  source = context.createBufferSource(); // creates a sound source
  
  source.buffer = buffer;                    // tell the source which sound to play
  //source.connect(context.destination);       // connect the source to the contexts destination (the speakers)
  console.log(VolumeSample.gNode);
  console.log('Gain Value' + VolumeSample.gNode.gain.value);
   if (!context.createGain)
    context.createGain = context.createGainNode;
this.gNode = context.createGain();
updateIndex = 0;
this.distNode = context.createWaveShaper();

this.distortionCounter = setInterval(update,1000);



 source.connect(this.distNode);
 this.distNode.connect(this.gNode);
 this.gNode.connect(context.destination);
  source.start(0);                           // play the source now
                                             // note: on older systems, may have to use deprecated noteOn(time);
  alreadyClickedPlay = true;                                        
    console.log('you should hear something'); 
   
           // setTimeout(function(){document.getElementById('processingNote').innerHTML= " "},2000); 
           
                           
}




loadSound('http://audiograins.com/blog/wp-content/uploads/2014/04/beatles_mono.wav');




  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
	var output = [];
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process audiofiles.
      if (!f.type.match('audio.*')) {
        continue;
      }
	
    
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
    
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          console.log('Loading Audio Buffer');
          context.decodeAudioData(e.target.result,function(buffer){
          soundBuffer = buffer;
          });
        };
      })(f);
console.log(f);
      // Read in the file as a data URL.
      reader.readAsArrayBuffer(f);
      
       

    }
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);

function stopSound(){
source.stop ? source.stop(0) : source.noteOff(0);
document.getElementById("Counter").innerHTML = "Distortion Level - 0";
clearInterval(VolumeSample.distortionCounter);
VolumeSample.distortionCounter=0;
}

 