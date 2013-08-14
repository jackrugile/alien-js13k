/*==============================================================================
Request Animation Frame Polyfill
==============================================================================*/
window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(a){window.setTimeout(a,1E3/60)}}();

/*==============================================================================
Random Range
==============================================================================*/
function rand( min, max ) {
	return Math.random() * ( max - min ) + min;
}

/*==============================================================================
Calculations
==============================================================================*/
function distance( p1x, p1y, p2x, p2y ) {
	var xDistance = p1x - p2x,
		yDistance = p1y - p2y;
	return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
}

/*==============================================================================
Shapes
==============================================================================*/
function circle( ctx, x, y, radius ) {
	var radius = radius <= 0 ? 1 : radius;
	ctx.beginPath();
	ctx.arc( x, y, radius, 0, Math.PI * 2 );
}

function fillCircle( ctx, x, y, radius, fillStyle ) {  
	var fillStyle = fillStyle ? fillStyle :  '#000';
	circle( ctx, x, y, radius );
	ctx.fillStyle = fillStyle;
	ctx.fill();
}

function strokeCircle( ctx, x, y, radius, strokeStyle, lineWidth ) {
	var strokeStyle = strokeStyle ? strokeStyle :  '#000',
			lineWidth = lineWidth ? lineWidth : 1;
	circle( ctx, x, y, radius );
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = strokeStyle;
	ctx.stroke();
}