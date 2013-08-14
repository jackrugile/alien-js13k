/*
http://middleearmedia.com/web-audio-api-basics/
var context = new webkitAudioContext(); // Create audio container with webkit prefix
     oscillator = context.createOscillator(); // Create bass guitar
     gainNode = context.createGainNode(); // Create boost pedal
 
oscillator.connect(gainNode); // Connect bass guitar to boost pedal
gainNode.connect(context.destination); // Connect boost pedal to amplifier
gainNode.gain.value = 0.3; // Set boost pedal to 30 percent volume
oscillator.frequency.value = 0;
oscillator.noteOn(1); // Play bass guitar instantly
setTimeout(function(){oscillator.noteOff(1)}, 5000); // Play bass guitar instantly
setInterval(function(){oscillator.frequency.value = 150 + Math.cos(Date.now()/150) * 20;}, 16);
*/