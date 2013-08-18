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
	$.dt = 1;
	$.lt = 0;
	$.tick = 0;
	$.state = 'play';
	$.states = {};

	$.bindEvents();
	$.setupStates();
	$.resize();
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
Events
==============================================================================*/
$.resize = function() {
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

$.mousedown = function( e ) {
	e.preventDefault();
	$.alien.jump();	
};

$.bindEvents = function() {
	window.addEventListener( 'resize', $.resize );
	window.addEventListener( 'mousedown', $.mousedown );
	window.addEventListener( 'touchstart', $.mousedown );
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
	$.scale = Math.min( Math.max( 0.01, $.scale ), 1.2 );
};

$.updateScreen = function() { 
	$.screen.x += ( ( ( $.cw * 0.5 ) - $.screen.x ) / 4 ) * $.dt;
	$.screen.y += ( ( ( ( ( $.alien.dist - ( $.alien.distFromGround * 0.6 ) ) * $.scale) + $.ch * 0.5 ) - $.screen.y ) / 4 ) * $.dt;
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

		$.ctxmg.clearRect( 0, 0, $.cw, $.ch );
		$.ctxmg.save();		
		$.ctxmg.translate( 0, 0 );
		$.ctxmg.scale( $.scale, $.scale );
		$.ctxmg.translate( $.screen.x / $.scale, $.screen.y / $.scale );

		$.moon.update( $ );
		$.alien.update( $ );
		$.moon.render( $ );
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