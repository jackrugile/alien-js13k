
/*var context = new webkitAudioContext(),
	gainNode = context.createGainNode(),
    instr = context.createOscillator(),
    noteMap = {
    	a4: 400,
    	b4: 493.88,
    	c5: 523.25,
    	e5: 659.26
    },
    song = [
		{ note: 'a4', duration: 30 },
		{ note: 'b4', duration: 30 },
		{ note: 'c5', duration: 30 }
	],
    current = 0,
    durationTick = 0;

 
gainNode.connect(context.destination);
gainNode.gain.value = 0.05;  
instr.connect(gainNode);
instr.type = 0;
instr.noteOn(1);

function play(){
	requestAnimationFrame(play);

	if( durationTick < song[current].duration ) {
		durationTick++;
	} else {
		durationTick = 0;
		current = ( current == song.length - 1 ) ? 0 : current + 1;
	}

	instr.frequency.value = noteMap[song[current].note];
}

function mute(){
	gainNode.gain.value = 0;
}

function unmute(){
	gainNode.gain.value = 0.05;
}

window.addEventListener('load', play);
window.addEventListener('blur', mute);
window.addEventListener('focus', unmute);*/

//setInterval(function(){oscillator1.frequency.value = 150 + Math.cos(Date.now()/150) * 20;}, 16);






/*var context = new webkitAudioContext(),
	gainNode = context.createGainNode(),
    instr = context.createOscillator(),
    channelTick = 0,
    sounds = [];

gainNode.connect(context.destination);
gainNode.gain.value = 0.1;

function Sound( opt ){
	this.channel = context.createOscillator();
	this.channel.connect(gainNode);

	this.channel.frequency.value = opt.freqStart;
	this.channel.type = opt.oscType;
	this.channel.noteOn(1);
	this.freqCurr = opt.freqStart;
	this.freqStart = opt.freqStart;
	this.freqEnd = opt.freqEnd;
	this.freqChange = opt.freqChange;
}

Sound.prototype.update = function( i ) {
	var endSound = false;
	if( this.freqStart < this.freqEnd ){
		if( this.freqCurr < this.freqEnd ){
			this.freqCurr += this.freqChange;
		} else {
			endSound = true;
		}	
	} else if( this.freqStart > this.freqEnd ) {
		if( this.freqCurr > this.freqEnd ){
			this.freqCurr -= this.freqChange;
		} else {
			endSound = true;
		}
	} 
	this.channel.frequency.value = this.freqCurr;
	if(endSound) {
		this.channel.disconnect();
		sounds.splice( i, 1 );
	}
};

function loopAudio(){
	requestAnimationFrame( loopAudio );
	var i = sounds.length;
	while( i-- ){
		sounds[ i ].update( i );
	}
}

window.addEventListener('click', function(){
	sounds.push( new Sound({
		oscType: 1,
		freqStart: 50,
		freqEnd: 800,
		freqChange: 100
	}));

	sounds.push( new Sound({
		oscType: 2,
		freqStart: 62,
		freqEnd: 60,
		freqChange: 0.2
	}));
});

loopAudio();
*/





var context = new webkitAudioContext(),
	gainNode = context.createGainNode(),
    instr = context.createOscillator(),
    channelCount = 4,
    channelTick = 0,
    channels = [],
    sounds = [];

for( var i = 0; i < channelCount; i++ ){
	channel = context.createOscillator();
	channel.connect(gainNode);
	channel.type = 0;
	channel.frequency.value = 0;
	//channel.noteOn(0);
	channels.push(channel);
}

gainNode.connect(context.destination);
gainNode.gain.value = 0.1;

function getChannel(){	
	if(channelTick < channelCount - 1){
		channelTick++;
	} else {
		channelTick = 0;
	}
	return channels[channelTick];
}

function Sound( opt ){
	this.channel = getChannel();
	this.channel.frequency.value = opt.freqStart;
	this.channel.type = opt.oscType;
	this.channel.noteOn(1);
	this.freqCurr = opt.freqStart;
	this.freqStart = opt.freqStart;
	this.freqEnd = opt.freqEnd;
	this.freqChange = opt.freqChange;
}

Sound.prototype.update = function( i ) {
	var endSound = false;
	if( this.freqStart < this.freqEnd ){
		if( this.freqCurr < this.freqEnd ){
			this.freqCurr += this.freqChange;
		} else {
			endSound = true;
		}	
	} else if( this.freqStart > this.freqEnd ) {
		if( this.freqCurr > this.freqEnd ){
			this.freqCurr -= this.freqChange;
		} else {
			endSound = true;
		}
	} 
	this.channel.frequency.value = this.freqCurr;
	if( endSound ) {
		this.channel.frequency.value = 0;
		//this.channel.disconnect();
		sounds.splice( i, 1 );
	}
};

function loopAudio(){
	requestAnimationFrame( loopAudio );
	var i = sounds.length;
	while( i-- ){
		sounds[ i ].update( i );
	}
}

/*window.addEventListener('click', function(){
	sounds.push( new Sound({
		oscType: 1,
		freqStart: 300,
		freqEnd: 800,
		freqChange: 100
	}));
});*/

loopAudio();
