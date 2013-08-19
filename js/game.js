function Game() {

var $ = this;

/*==============================================================================
Init
==============================================================================*/
$.init = function() {
	$.wrap = document.getElementById( 'wrap' );
	$.cbg = document.getElementById( 'cbg' );
	$.cmg = document.getElementById( 'cmg' );
	$.cfg = document.getElementById( 'cfg' );	
	$.ctxbg = $.cbg.getContext( '2d' );
	$.ctxmg = $.cmg.getContext( '2d' );
	$.ctxfg = $.cfg.getContext( '2d' );
	$.ratio = 9 / 16;
	$.scale = 0.001;
	$.cw = $.cbg.width = $.cmg.width = $.cfg.width = 1136;
	$.ch = $.cbg.height = $.cmg.height = $.cfg.height = $.cw * $.ratio;
	$.screen = {};
	$.gravity = 0.3;
	$.landOffset = 30;
	$.dt = 1;
	$.lt = 0;
	$.tick = 0;
	$.state = 'play';
	$.states = {};

	$.spikes = [];

	$.mousedown = 0;

	$.bindEvents();
	$.setupStates();
	$.resizecb();
	$.reset();
	$.renderBackground();
	$.loop();
};

/*==============================================================================
Reset
==============================================================================*/
$.reset = function() {
	$.moon = new Moon( $ );
	$.alien = new Alien( $ );
	$.screen = { 
		x: 0, 
		y: -2500
	};
};

/*==============================================================================
Render Background
==============================================================================*/
$.renderBackground = function() {
	var gradient = $.ctxbg.createRadialGradient( $.cw / 2, $.ch / 2, 0, $.cw / 2, $.ch / 2, $.ch );
	gradient.addColorStop( 0, 'hsla(0, 0%, 100%, 0.1)' );
	gradient.addColorStop( 1, 'hsla(0, 0%, 100%, 0)' );
	$.ctxbg.fillStyle = gradient;
	$.ctxbg.fillRect( 0, 0, $.cw, $.ch );

	var i = 3000;
	while( i-- ) {
		fillCircle( $.ctxbg, rand( 0, $.cw ), rand( 0, $.ch ), rand( 0.2, 0.5 ), 'hsla(0, 0%, 100%, ' + rand( 0.05, 0.2 ) + ')' );
	}

	var i = 1000;
	while( i-- ) {
		fillCircle( $.ctxbg, rand( 0, $.cw ), rand( 0, $.ch ), rand( 0.1, 0.8 ), 'hsla(0, 0%, 100%, ' + rand( 0.05, 0.9 ) + ')' );
	}
}

/*==============================================================================
Render Foreground
==============================================================================*/
$.renderForeground = function() {
	$.ctxfg.clearRect( 0, 0, $.cw, $.ch );

	//$.ctxfg.fillStyle = 'hsla(180, 10%, 50%, 0.1)';
	//$.ctxfg.fillRect( 0, 0, $.cw, $.ch );

	var gradient = $.ctxfg.createRadialGradient( $.cw / 2, $.ch / 3, $.ch / 2, $.cw / 2, $.ch / 2, $.ch );
	gradient.addColorStop( 0, 'hsla(0, 0%, 0%, 0)' );
	gradient.addColorStop( 1, 'hsla(0, 0%, 0%, 0.2)' );
	$.ctxfg.fillStyle = gradient;
	$.ctxfg.fillRect( 0, 0, $.cw, $.ch );

	if( window.innerWidth >= $.cw && window.innerHeight >= $.ch ) {
		$.ctxfg.fillStyle = 'hsla(0, 0%, 50%, 0.1)';
		var i = ~~( $.ch / 2);
		while( i-- ) {
			$.ctxfg.fillRect( 0, i * 2, $.cw, 1 );
		}
	}

	var gradient2 = $.ctxfg.createLinearGradient( $.cw, 0, 0, $.ch);
	gradient2.addColorStop( 0, 'hsla(0, 0%, 100%, 0.03)' );
	gradient2.addColorStop( 1, 'hsla(0, 0%, 100%, 0)' );
	$.ctxfg.beginPath();
	$.ctxfg.moveTo( 0, 0 );
	$.ctxfg.lineTo( $.cw, 0 );
	$.ctxfg.lineTo( 0, $.ch );
	$.ctxfg.closePath();
	$.ctxfg.fillStyle = gradient2;
	$.ctxfg.fill()
}

/*==============================================================================
Create Spikes
==============================================================================*/
$.createSpikes = function() {
	if( $.tick % 50 == 0 ) {
		$.spikes.push( new Spike( $ ) );
	}
}

/*==============================================================================
Action All
==============================================================================*/
$.actionAll = function( array, action ) {
	var i = array.length;
	while( i-- ) {
		array[ i ][action]( $, i );
	}
}

/*==============================================================================
Events
==============================================================================*/
$.resizecb = function() {
	var winWidth = window.innerWidth,
		winHeight = window.innerHeight;
	if( winWidth < $.cw || winHeight < $.ch  ) {
		if( winWidth > winHeight / $.ratio ) {
			$.wrap.style.width = winHeight / $.ratio + 'px'; 
			$.wrap.style.height = winHeight + 'px';			   
		} else {
			$.wrap.style.width = winWidth + 'px';
			$.wrap.style.height = winWidth * $.ratio + 'px';
		}		
	} else {	
		$.wrap.style.width = $.cw + 'px';
		$.wrap.style.height = $.ch + 'px';		
	}
	$.renderForeground();
};

$.mousedowncb = function( e ) {
	e.preventDefault();
	if( !$.mousedown ){
		$.alien.jump( $ );
		$.mousedown = 1;
	}
};

$.mouseupcb = function( e ) {
	e.preventDefault();
	if( $.mousedown ){
		$.mousedown = 0;
	}
};

$.keydowncb = function( e ) {
	if( !$.mousedown ){
		var e = (e.keyCode ? e.keyCode : e.which);
		/*if(e === 38 || e === 87){up = true;}
		if(e === 39 || e === 68){right = true;}
		if(e === 40 || e === 83){down = true;}
		if(e === 37 || e === 65){left = true;}*/
		if( e === 38 || e === 87 ) {
			$.alien.jump( $ );
			$.mousedown = 1;
		}
		/*if( e === 40 || e === 83 ) {
			$.alien.crouch( $ );
		}*/
	}
}

$.keyupcb = function( e ) {
	if( $.mousedown ){
		var e = (e.keyCode ? e.keyCode : e.which);
		/*if(e === 38 || e === 87){up = true;}
		if(e === 39 || e === 68){right = true;}
		if(e === 40 || e === 83){down = true;}
		if(e === 37 || e === 65){left = true;}*/
		if( e === 38 || e === 87 ) {
			//$.alien.jump( $ );
			$.mousedown = 0;
		}
		/*if( e === 40 || e === 83 ) {
			$.alien.crouch( $ );
		}*/
	}
}

$.bindEvents = function() {
	window.addEventListener( 'resize', $.resizecb );
	window.addEventListener( 'mousedown', $.mousedowncb );
	window.addEventListener( 'mouseup', $.mouseupcb );
	window.addEventListener( 'touchstart', $.mousedowncb );
	window.addEventListener( 'keydown', $.keydowncb );
	window.addEventListener( 'keyup', $.keyupcb );
};

/*==============================================================================
Miscellaneous
==============================================================================*/
$.updateDelta = function() { 
	var now = Date.now();
	$.dt = ( now - $.lt ) / ( 1000 / 60 );
	$.dt = ( $.dt < 0 ) ? 0.001 : $.dt;
	$.dt = ( $.dt > 4 ) ? 4 : $.dt;
	$.lt = now;
	//$.dt = 1;
};

$.updateScale = function() { 
	$.scale += ( ( ( 1 - $.alien.distFromGround / 1500 ) - $.scale ) / 15 ) * $.dt ;
	$.scale = Math.min( Math.max( 0.05, $.scale ), 1.2 );
};

$.updateScreen = function() { 
	$.screen.x += ( ( ( $.cw * 0.5 ) - $.screen.x ) / 4 ) * $.dt;
	$.screen.y += ( ( ( ( ( $.alien.dist - ( $.alien.distFromGround * 0.5 ) ) * $.scale) + $.ch * 0.6 ) - $.screen.y ) / 4 ) * $.dt;
	//var offset = ( $.alien.dist - $.moon.radius - $.alien.radius ) * 0.8;
	//$.screen.x += ( ( ( $.moon.x + $.cw * 0.5 ) - $.screen.x ) / 10 ) * $.dt;
	//$.screen.y += ( ( ( $.alien.y + offset - $.ch * 0.7 ) - $.screen.y ) / 10 ) * $.dt;	
};

/*==============================================================================
States
==============================================================================*/
$.setupStates = function() {
	$.states.menu = function() {
	};

	$.states.play = function() {
		$.updateDelta();
		$.updateScale();
		$.updateScreen();

		$.createSpikes(); 

		$.moon.update( $ );
		$.actionAll( $.spikes, 'update' ); 
		$.alien.update( $ );

		$.ctxmg.clearRect( 0, 0, $.cw, $.ch );
		$.ctxmg.save();		
		$.ctxmg.translate( 0, 0 );
		$.ctxmg.scale( $.scale, $.scale );
		$.ctxmg.translate( $.screen.x / $.scale, $.screen.y / $.scale );
		
		$.moon.render( $ );
		$.actionAll( $.spikes, 'render' );  
		$.alien.render( $ ); 
		$.ctxmg.restore();
	};

	$.states.pause = function() {
	};

	$.states.gameover = function() {
	};
}

/*==============================================================================
Loop
==============================================================================*/
$.loop = function() {
	stats.begin();
	requestAnimFrame( $.loop );
	$.states[ $.state ]();
	$.tick++;
	stats.end();
};

}